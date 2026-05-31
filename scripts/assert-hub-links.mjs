#!/usr/bin/env node
/**
 * Post-prerender invariant: /blog and /compliance hubs must each render
 * at least MIN_LINKS anchor links to sub-pages in their static HTML.
 *
 * Why this exists: BlogIndex and ComplianceIndex are React.lazy() in
 * App.tsx. Without a route-specific PrerenderMarker + matching
 * waitForFunction in scripts/prerender.mjs, Puppeteer snapshots the
 * App-level Suspense fallback (Navbar + Footer only, zero anchor links
 * to sub-pages). Google then sees an empty hub, fails to flow PageRank
 * to the ~20 long-tail sub-pages, and marks them "Discovered, not
 * indexed" in GSC. This script catches that regression class at build
 * time so future refactors of the lazy chunk boundary fail loudly
 * instead of silently deindexing the long tail.
 *
 * Threshold is 10 (not 15 or 20) so the assertion tolerates 1-2 posts
 * temporarily going draft without false-failing. If post count ever
 * drops below 10, retune.
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "..", "dist");

const MIN_LINKS = 10;

const HUBS = [
  {
    path: "/blog",
    file: resolve(DIST, "blog", "index.html"),
    anchorPattern: /href="\/blog\/[a-z0-9][a-z0-9-]*"/g,
  },
  {
    path: "/compliance",
    file: resolve(DIST, "compliance", "index.html"),
    anchorPattern: /href="\/compliance\/[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9-]*"/g,
  },
];

function stripScripts(html) {
  return html.replace(/<script[\s\S]*?<\/script>/g, "");
}

const failures = [];

for (const hub of HUBS) {
  let html;
  try {
    html = readFileSync(hub.file, "utf8");
  } catch (err) {
    failures.push(`${hub.path}: cannot read ${hub.file} (${err.message})`);
    continue;
  }
  // Strip <script> blocks so we only count crawlable <a href="..."> anchors,
  // not URLs embedded in JSON-LD ItemList structured data. Google treats
  // anchor links and JSON-LD differently for PageRank flow.
  const body = stripScripts(html);
  const matches = body.match(hub.anchorPattern) || [];
  const unique = new Set(matches);
  if (unique.size < MIN_LINKS) {
    failures.push(
      `${hub.path}: only ${unique.size} unique sub-page anchor links in ` +
        `prerendered HTML (expected >= ${MIN_LINKS}). Hub likely shipped ` +
        `as an empty Suspense fallback — check PrerenderMarker mount + ` +
        `scripts/prerender.mjs wait predicate.`,
    );
  } else {
    console.log(
      `[assert-hub-links] ${hub.path}: ${unique.size} sub-page links ✓`,
    );
  }
}

if (failures.length > 0) {
  console.error("\n[assert-hub-links] FAIL:");
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log("[assert-hub-links] all hub invariants pass");
