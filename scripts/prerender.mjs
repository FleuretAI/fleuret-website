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

const FR_PATHS = [
  "/",
  "/about",
  "/careers",
  "/design-partners",
  "/demo",
  "/mentions-legales",
  "/privacy",
  "/terms",
  "/security",
  "/resources",
  "/blog",
];
const EN_PATHS = FR_PATHS
  .filter((p) => p !== "/mentions-legales")
  .map((p) => (p === "/" ? "/en" : `/en${p}`));
const EXTRA_PATHS = ["/404"];

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

      // Collect per-route failures so one broken route doesn't lose all others.
      // Vercel build treats silent skips better than a full crash; we log each
      // miss loudly so deploy logs surface the problem.
      const failed = [];
      for (const route of ROUTES) {
        const url = `${BASE}${route}`;
        console.log(`[prerender] -> ${route}`);
        try {
          await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });
          if (isBlogPostPath(route)) {
            // Blog route: wait for MDX to finish lazy-loading and flip the
            // rendered flag. Prevents shipping the Suspense skeleton.
            await page.waitForFunction(
              () =>
                !!document.querySelector(
                  'article[data-post-slug][data-rendered="true"]',
                ),
              { timeout: 15_000 },
            );
          } else {
            await page.waitForFunction(
              () => {
                const root = document.getElementById("root");
                return !!root && root.children.length > 0;
              },
              { timeout: 15_000 },
            );
          }
          const html = await page.content();
          const out = outputPathFor(route);
          mkdirSync(dirname(out), { recursive: true });
          writeFileSync(out, html, "utf8");
          console.log(`prerendered ${route} -> ${out.replace(ROOT + "/", "")}`);
        } catch (err) {
          console.error(
            `[prerender] FAILED ${route}: ${(err && err.message) || err}`,
          );
          failed.push(route);
        }
      }
      if (failed.length > 0) {
        console.error(
          `[prerender] ${failed.length} route(s) failed (non-fatal): ${failed.join(", ")}`,
        );
        // Fallback: copy dist/index.html into the missing route's directory
        // so Vercel serves a real file at that path. cleanUrls + SPA rewrite
        // cascade has proven unreliable on the edge for specific path shapes,
        // so we bypass that entirely and guarantee every expected URL maps
        // to a real static file. Content renders client-side once React
        // hydrates; SEO meta comes back via SPA-hydration (degraded vs a
        // puppeteer snapshot but still crawlable by modern Googlebot).
        const rootIndex = join(DIST, "index.html");
        if (existsSync(rootIndex)) {
          const rootHtml = readFileSync(rootIndex, "utf8");
          for (const route of failed) {
            try {
              const out = outputPathFor(route);
              mkdirSync(dirname(out), { recursive: true });
              writeFileSync(out, rootHtml, "utf8");
              console.log(
                `[prerender] fallback-copy index.html -> ${out.replace(ROOT + "/", "")}`,
              );
            } catch (err) {
              console.error(
                `[prerender] fallback-copy FAILED for ${route}: ${(err && err.message) || err}`,
              );
            }
          }
        } else {
          console.error(
            `[prerender] cannot fallback-copy — dist/index.html missing`,
          );
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
