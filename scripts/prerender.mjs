#!/usr/bin/env node
/**
 * Post-build prerender.
 * 1. Spin up `vite preview` against dist/.
 * 2. For each route, let Puppeteer render the SPA to post-mount HTML.
 * 3. Write result to dist/<route>/index.html (dist/index.html for "/").
 *
 * Helmet-async mutates <head> synchronously on mount, so the captured HTML
 * already contains per-route <title>/meta/canonical/JSON-LD before we save it.
 *
 * Blog-route invariant:
 *   /blog/:slug (and /en/blog/:slug) render an MDX body lazy-loaded inside
 *   BlogPost.tsx. The root `<div id="root">` has children immediately (the
 *   BlogPost scaffold), but the MDX chunk resolves asynchronously. To avoid
 *   shipping the Suspense fallback, we wait for
 *     article[data-post-slug][data-rendered="true"]
 *   which BlogPost sets after the MDX child mounts.
 */
import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");
const PORT = Number(process.env.PRERENDER_PORT || 4273);
const BASE = `http://127.0.0.1:${PORT}`;

import {
  STATIC_FR_PATHS as FR_PATHS,
  STATIC_EN_PATHS as EN_PATHS,
  BUILD_ONLY_PATHS as EXTRA_PATHS,
} from "./site-routes.mjs";

// Load dynamic post paths from the codegen manifest. Build step ordering:
//   build:posts -> vite build -> build:sitemap -> prerender
// The manifest sits at dist/post-manifest.json by the time we get here.
const MANIFEST_PATH = join(DIST, "post-manifest.json");
let POST_PATHS = [];
if (existsSync(MANIFEST_PATH)) {
  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, "utf8"));
  POST_PATHS = manifest.map((m) => m.path);
}

const ROUTES = [...FR_PATHS, ...EN_PATHS, ...EXTRA_PATHS, ...POST_PATHS];

function isBlogPostPath(route) {
  return /^(\/en)?\/blog\/.+/.test(route);
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function waitForServer(url, timeoutMs = 20_000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok) return;
    } catch {}
    await wait(200);
  }
  throw new Error(`preview server never came up at ${url}`);
}

function outputPathFor(route) {
  if (route === "/") return join(DIST, "index.html");
  return join(DIST, route.replace(/^\//, ""), "index.html");
}

// Resolve a local Chrome/Chromium binary. Covers the common dev machines.
function localChromePath() {
  const candidates = [
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/snap/bin/chromium",
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

async function main() {
  if (!existsSync(DIST)) {
    throw new Error("dist/ missing — run `vite build` before prerender");
  }

  const preview = spawn(
    "bunx",
    ["vite", "preview", "--port", String(PORT), "--strictPort"],
    { cwd: ROOT, stdio: ["ignore", "pipe", "pipe"] },
  );
  preview.stdout.on("data", (d) => process.stdout.write(`[preview] ${d}`));
  preview.stderr.on("data", (d) => process.stderr.write(`[preview] ${d}`));

  const cleanup = () => {
    if (!preview.killed) preview.kill("SIGTERM");
  };
  process.on("exit", cleanup);
  process.on("SIGINT", () => {
    cleanup();
    process.exit(130);
  });

  try {
    await waitForServer(BASE);
    // @sparticuz/chromium ships a Linux x64 binary. Vercel's build container
    // is Linux, so we use it there. Locally (macOS, Linux dev) we resolve the
    // system Chrome/Chromium path to avoid shipping Puppeteer's bundled binary
    // that needs libnspr4.so (missing on Vercel).
    const isServerless =
      !!process.env.VERCEL ||
      !!process.env.AWS_LAMBDA_FUNCTION_NAME ||
      !!process.env.AWS_EXECUTION_ENV;
    const executablePath = isServerless
      ? await chromium.executablePath()
      : process.env.CHROME_PATH || localChromePath();
    if (!executablePath) {
      throw new Error(
        "No Chrome/Chromium executable found. Set CHROME_PATH env var, or install Google Chrome (macOS) / chromium (Linux).",
      );
    }
    const browser = await puppeteer.launch({
      args: isServerless
        ? [...chromium.args, "--no-sandbox", "--disable-setuid-sandbox"]
        : ["--no-sandbox", "--disable-setuid-sandbox"],
      executablePath,
      headless: true,
    });
    try {
      const page = await browser.newPage();
      await page.setViewport({ width: 1280, height: 800 });

      // Block third-party trackers and external assets during prerender.
      // GTM/GA/DoubleClick/cdnfonts hold connections open via heartbeat or
      // long-poll, which makes `waitUntil: "networkidle2"` hang on Vercel
      // (locally these are sometimes blocked by host firewall/extensions, so
      // the hang only manifests in production builds and silently drops every
      // route except the first to a failure case). Helmet runs from the React
      // bundle, not from any of these — blocking them is safe.
      const BLOCKED_HOSTS = [
        "googletagmanager.com",
        "google-analytics.com",
        "analytics.google.com",
        "doubleclick.net",
        "g.doubleclick.net",
        "cdnfonts.com",
        "fonts.cdnfonts.com",
      ];
      await page.setRequestInterception(true);
      page.on("request", (req) => {
        const reqUrl = req.url();
        if (BLOCKED_HOSTS.some((h) => reqUrl.includes(h))) {
          req.abort();
        } else {
          req.continue();
        }
      });

      // Per-route failures are FATAL. Silent fallback shells were shipping to
      // prod with no Helmet metadata (no canonical, no title, no description),
      // which deindexed every non-root route from Google. We'd rather fail the
      // build loudly than ship soft-200 shells.
      //
      // Each route gets one retry. Vercel build containers have flaky
      // cold-start latency for lazy-loaded MDX chunks (locally these resolve
      // in ~200ms; on Vercel a single chunk can occasionally exceed 15s once
      // and resolve normally on a second attempt). One retry trades ~5s of
      // build time worst-case for resilience.
      async function renderRoute(route) {
        const url = `${BASE}${route}`;
        // Use `domcontentloaded` instead of `networkidle2`: react-helmet-async
        // mutates <head> synchronously on mount, so we can capture the SEO
        // tags as soon as Helmet has run. Waiting for network idle is both
        // unnecessary and a known hang source on Vercel build containers.
        await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 30_000,
        });
        if (isBlogPostPath(route)) {
          // Blog route: wait for MDX to finish lazy-loading and flip the
          // rendered flag. Prevents shipping the Suspense skeleton.
          // 30s tolerates Vercel's flakier cold-start chunk loads.
          await page.waitForFunction(
            () =>
              !!document.querySelector(
                'article[data-post-slug][data-rendered="true"]',
              ),
            { timeout: 30_000 },
          );
        } else {
          // Wait for React mount AND Helmet to flush its <head> mutations.
          // `data-rh="true"` is the marker react-helmet-async stamps on
          // every tag it owns; if it's not present after 15s, Helmet never
          // ran and we'd ship a metadata-less shell.
          await page.waitForFunction(
            () => {
              const root = document.getElementById("root");
              if (!root || root.children.length === 0) return false;
              return !!document.querySelector('[data-rh="true"]');
            },
            { timeout: 15_000 },
          );
        }
        const html = await page.content();
        // Verify Helmet actually mutated <head>. If `data-rh="true"` is
        // missing, Helmet never ran and we're about to ship a shell with
        // no per-route metadata. Treat as a render failure.
        if (!html.includes('data-rh="true"')) {
          throw new Error(
            `Helmet output missing (no data-rh="true" attribute in HTML)`,
          );
        }
        const out = outputPathFor(route);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, html, "utf8");
      }

      const failed = [];
      for (const route of ROUTES) {
        console.log(`[prerender] -> ${route}`);
        let lastErr;
        let success = false;
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            await renderRoute(route);
            const out = outputPathFor(route);
            console.log(
              `prerendered ${route} -> ${out.replace(ROOT + "/", "")}` +
                (attempt > 1 ? ` (attempt ${attempt})` : ""),
            );
            success = true;
            break;
          } catch (err) {
            lastErr = err;
            const msg = (err && err.message) || String(err);
            if (attempt === 1) {
              console.warn(`[prerender] retry ${route}: ${msg}`);
            } else {
              console.error(`[prerender] FAILED ${route}: ${msg}`);
            }
          }
        }
        if (!success) {
          failed.push({
            route,
            error: (lastErr && lastErr.message) || String(lastErr),
          });
        }
      }
      if (failed.length > 0) {
        console.error(
          `[prerender] ${failed.length} route(s) failed:\n` +
            failed.map((f) => `  - ${f.route}: ${f.error}`).join("\n"),
        );
        await browser.close();
        cleanup();
        process.exit(1);
      }

      // Belt-and-suspenders: for every route we INTENDED to prerender, make
      // sure a real file exists at that path. If prerender succeeded the
      // file already exists (no-op). If it failed OR if Vercel's deploy
      // pipeline drops the nested directory for some reason, this copies
      // dist/index.html as a fallback so Vercel still serves a real static
      // file and React hydrates client-side from there.
      //
      // We explicitly write to both the cleanUrls-friendly paths
      // (`dist/<route>.html`) AND the nested-index form
      // (`dist/<route>/index.html`) so whichever one Vercel's edge prefers
      // resolves.
      const rootIndex = join(DIST, "index.html");
      if (existsSync(rootIndex)) {
        const rootHtml = readFileSync(rootIndex, "utf8");
        for (const route of ROUTES) {
          if (route === "/" || route === "/404") continue;
          const nested = outputPathFor(route);
          const flat = join(DIST, route.replace(/^\//, "") + ".html");
          try {
            if (!existsSync(nested)) {
              mkdirSync(dirname(nested), { recursive: true });
              writeFileSync(nested, rootHtml, "utf8");
              console.log(
                `[prerender] ensure ${route} -> ${nested.replace(ROOT + "/", "")}`,
              );
            }
            if (!existsSync(flat)) {
              mkdirSync(dirname(flat), { recursive: true });
              writeFileSync(flat, rootHtml, "utf8");
            }
          } catch (err) {
            console.error(
              `[prerender] ensure-fallback FAILED for ${route}: ${(err && err.message) || err}`,
            );
          }
        }
      }

      // Vercel default: /404.html at output root is served as the 404 body.
      const fourOhFourSrc = join(DIST, "404", "index.html");
      if (existsSync(fourOhFourSrc)) {
        const dest = join(DIST, "404.html");
        writeFileSync(dest, readFileSync(fourOhFourSrc, "utf8"), "utf8");
        rmSync(join(DIST, "404"), { recursive: true, force: true });
        console.log("promoted /404 -> dist/404.html");
      }

      await browser.close();
    } finally {
      cleanup();
    }
  } catch (err) {
    cleanup();
    console.error(err);
    process.exit(1);
  }
}

main();
