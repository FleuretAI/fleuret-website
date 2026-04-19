#!/usr/bin/env node
/**
 * Post-build prerender.
 * 1. Spin up `vite preview` against dist/.
 * 2. For each route, let Puppeteer render the SPA to post-mount HTML.
 * 3. Write result to dist/<route>/index.html (dist/index.html for "/").
 *
 * Helmet-async mutates <head> synchronously on mount, so the captured HTML
 * already contains per-route <title>/meta/canonical/JSON-LD before we save it.
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
];
const EN_PATHS = FR_PATHS
  .filter((p) => p !== "/mentions-legales")
  .map((p) => (p === "/" ? "/en" : `/en${p}`));
const EXTRA_PATHS = ["/404"];
const ROUTES = [...FR_PATHS, ...EN_PATHS, ...EXTRA_PATHS];

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

      for (const route of ROUTES) {
        const url = `${BASE}${route}`;
        await page.goto(url, { waitUntil: "networkidle2", timeout: 30_000 });
        await page.waitForFunction(
          () => {
            const root = document.getElementById("root");
            return !!root && root.children.length > 0;
          },
          { timeout: 15_000 },
        );
        const html = await page.content();
        const out = outputPathFor(route);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, html, "utf8");
        console.log(`prerendered ${route} -> ${out.replace(ROOT + "/", "")}`);
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
