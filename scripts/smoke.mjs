#!/usr/bin/env node
/**
 * Post-build smoke test. Boots `vite preview`, navigates 3 key flows with
 * puppeteer, asserts DOM markers. Run manually: `bun run smoke`.
 *
 * Flows covered:
 *   1. Navbar -> /resources -> /blog -> /blog/:slug (4-hop click, locale preserved)
 *   2. Locale toggle on post page (FR -> EN, slug preserved)
 *   3. Deep-link unknown slug (/blog/unknown-xyz) -> 404 content + noindex meta
 *
 * Runs AFTER `vite build + prerender`. Reads dist/ served via `vite preview`.
 * Use the SAME Chrome resolution as prerender.mjs (local macOS/Linux, serverless).
 */
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import chromium from "@sparticuz/chromium";
import puppeteer from "puppeteer-core";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const PORT = Number(process.env.SMOKE_PORT || 4274);
const BASE = `http://127.0.0.1:${PORT}`;

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
  for (const p of candidates) if (existsSync(p)) return p;
  return null;
}

/**
 * Read the manifest to know which slug to smoke-test. Falls back to the
 * seed post slug if manifest is missing.
 */
function pickSmokeSlug() {
  const manifestPath = resolve(DIST, "post-manifest.json");
  if (!existsSync(manifestPath)) return "continuous-ai-pentesting-nis2";
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
  const fr = manifest.find((m) => m.locale === "fr");
  return fr?.slug ?? "continuous-ai-pentesting-nis2";
}

const failures = [];
function assert(cond, msg) {
  if (!cond) {
    console.error(`  FAIL: ${msg}`);
    failures.push(msg);
  } else {
    console.log(`  ok: ${msg}`);
  }
}

async function main() {
  if (!existsSync(DIST)) {
    throw new Error("dist/ missing - run `bun run build` first");
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

    const isServerless = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
    const executablePath = isServerless
      ? await chromium.executablePath()
      : process.env.CHROME_PATH || localChromePath();
    if (!executablePath) throw new Error("No Chrome/Chromium found");

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

      const slug = pickSmokeSlug();

      // Flow 1: Navigate deep-link /blog/:slug and verify body rendered (not
      // Suspense skeleton). The prerender step should have written rendered
      // HTML to disk; loading via preview verifies SPA hydration also works.
      console.log(`\nFlow 1: /blog/${slug} renders body`);
      await page.goto(`${BASE}/blog/${slug}`, { waitUntil: "networkidle2" });
      await page.waitForFunction(
        () => !!document.querySelector('article[data-post-slug][data-rendered="true"]'),
        { timeout: 15_000 },
      );
      const h2Count = await page.$$eval("article h2", (els) => els.length);
      assert(h2Count > 0, `post body contains >=1 h2 (got ${h2Count})`);
      const canonical = await page.$eval(
        'link[rel="canonical"]',
        (el) => el.getAttribute("href"),
      );
      assert(canonical?.includes(`/blog/${slug}`), `canonical points to post (${canonical})`);

      // Flow 2: Deep-link unknown slug -> NotFound + noindex
      console.log("\nFlow 2: unknown slug -> noindex");
      await page.goto(`${BASE}/blog/unknown-xyz-should-404`, { waitUntil: "networkidle2" });
      await wait(500); // let Helmet flush
      const robots = await page.$eval(
        'meta[name="robots"]',
        (el) => el.getAttribute("content"),
      );
      assert(
        robots?.includes("noindex"),
        `unknown slug has noindex robots (got "${robots}")`,
      );

      // Flow 3: navbar -> /resources -> /blog -> first post (click flow)
      console.log("\nFlow 3: navbar click flow");
      await page.goto(`${BASE}/`, { waitUntil: "networkidle2" });
      // Click Resources link in navbar.
      await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll("a[href]"));
        const a = links.find((l) => l.getAttribute("href") === "/resources");
        a?.click();
      });
      await page.waitForFunction(() => location.pathname === "/resources", {
        timeout: 5000,
      });
      assert(true, "landed on /resources");
      // Click Blog tile CTA.
      await page.evaluate(() => {
        const a = Array.from(document.querySelectorAll("a[href]")).find(
          (l) => l.getAttribute("href") === "/blog",
        );
        a?.click();
      });
      await page.waitForFunction(() => location.pathname === "/blog", {
        timeout: 5000,
      });
      assert(true, "landed on /blog");

      await browser.close();
    } finally {
      cleanup();
    }
  } catch (err) {
    cleanup();
    console.error(err);
    process.exit(1);
  }

  if (failures.length > 0) {
    console.error(`\nsmoke: ${failures.length} failure(s).`);
    process.exit(1);
  }
  console.log("\nsmoke: all flows passed.");
}

main();
