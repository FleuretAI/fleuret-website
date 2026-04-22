#!/usr/bin/env node
/**
 * Ensure every expected route has a static HTML file in dist/.
 *
 * Runs in the build chain AFTER `vite build` + `build:sitemap` but BEFORE
 * `node scripts/prerender.mjs`. This guarantees fallback SPA shells exist
 * at every expected path BEFORE prerender runs. If puppeteer later writes
 * prerendered HTML to the same paths, the prerendered version wins
 * (writeFileSync overwrites). If puppeteer crashes or fails on any route,
 * the fallback shell is already on disk and will ship to Vercel.
 *
 * This is the resilient core of the /resources + /blog deploy fix:
 * puppeteer is brittle on Vercel's serverless build env, but a plain
 * `writeFileSync` cannot fail silently.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = join(ROOT, "dist");

// Static FR + EN routes. Mirror of scripts/prerender.mjs route list.
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
  "/news/fleuret-raises-3-5m",
];
const EN_PATHS = FR_PATHS
  .filter((p) => p !== "/mentions-legales")
  .map((p) => (p === "/" ? "/en" : `/en${p}`));
const EXTRA_PATHS = ["/404"];

// Dynamic post paths from the codegen manifest written by
// scripts/build-post-registry.ts and copied into dist/ by build-sitemap.
function readPostPaths() {
  const manifestInDist = join(DIST, "post-manifest.json");
  const manifestInRoot = join(ROOT, ".post-manifest.json");
  const manifestPath = existsSync(manifestInDist)
    ? manifestInDist
    : existsSync(manifestInRoot)
      ? manifestInRoot
      : null;
  if (!manifestPath) return [];
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    return manifest.map((m) => m.path);
  } catch (err) {
    console.warn(
      `[ensure-fallback] manifest parse failed, skipping post paths: ${(err && err.message) || err}`,
    );
    return [];
  }
}

function outputPathFor(route) {
  if (route === "/") return join(DIST, "index.html");
  return join(DIST, route.replace(/^\//, ""), "index.html");
}

function flatPathFor(route) {
  if (route === "/") return null;
  return join(DIST, route.replace(/^\//, "") + ".html");
}

function main() {
  if (!existsSync(DIST)) {
    console.error("[ensure-fallback] dist/ missing — run vite build first");
    process.exit(1);
  }
  const rootIndex = join(DIST, "index.html");
  if (!existsSync(rootIndex)) {
    console.error(
      "[ensure-fallback] dist/index.html missing — vite build output is broken",
    );
    process.exit(1);
  }
  const rootHtml = readFileSync(rootIndex, "utf8");

  const ROUTES = [
    ...FR_PATHS,
    ...EN_PATHS,
    ...EXTRA_PATHS,
    ...readPostPaths(),
  ];

  let written = 0;
  for (const route of ROUTES) {
    if (route === "/") continue; // dist/index.html already exists from vite
    const nested = outputPathFor(route);
    const flat = flatPathFor(route);
    try {
      mkdirSync(dirname(nested), { recursive: true });
      writeFileSync(nested, rootHtml, "utf8");
      written++;
      if (flat) {
        mkdirSync(dirname(flat), { recursive: true });
        writeFileSync(flat, rootHtml, "utf8");
      }
    } catch (err) {
      console.error(
        `[ensure-fallback] FAILED for ${route}: ${(err && err.message) || err}`,
      );
    }
  }
  console.log(
    `[ensure-fallback] wrote SPA shell to ${written} route(s). Prerender will overwrite with puppeteer output where possible.`,
  );
}

main();
