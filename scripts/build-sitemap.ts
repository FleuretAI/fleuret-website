#!/usr/bin/env bun
/**
 * Sitemap generator.
 *
 * Runs AFTER `vite build`, BEFORE `scripts/prerender.mjs`:
 *   1. Reads static paths from src/seo/routes.ts (ROUTES + SITE_URL).
 *   2. Reads dynamic blog posts from dist/post-manifest.json.
 *   3. Writes dist/sitemap.xml with hreflang alt links per URL.
 *
 * public/sitemap.xml is expected to be DELETED before this runs so Vercel
 * doesn't serve a stale hand-written copy.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL, ROUTES } from "../src/seo/routes.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
// Manifest is at repo root (see build-post-registry.ts — dist/ gets wiped by vite build).
const MANIFEST = resolve(ROOT, ".post-manifest.json");
const OUT = resolve(DIST, "sitemap.xml");
// Copy manifest into dist/ for downstream consumers (e.g. prerender.mjs) AND
// for debugging deploys (the manifest is useful as an audit log).
const MANIFEST_DIST_COPY = resolve(DIST, "post-manifest.json");

interface UrlEntry {
  loc: string;
  /** map of hreflang code -> absolute URL for alt links */
  alts: Record<string, string>;
  lastmod: string;
  priority: string;
  changefreq: string;
}

const today = new Date().toISOString().slice(0, 10);

function buildStatic(): UrlEntry[] {
  const entries: UrlEntry[] = [];
  for (const [key, loc] of Object.entries(ROUTES)) {
    if (key === "notFound") continue;
    // FR page (always exists)
    entries.push({
      loc: SITE_URL + loc.fr,
      alts: {
        fr: SITE_URL + loc.fr,
        en: SITE_URL + loc.en,
        "x-default": SITE_URL + loc.en,
      },
      lastmod: today,
      priority: key === "home" ? "1.0" : "0.8",
      changefreq: "weekly",
    });
    // EN page (same, except mentionsLegales which is FR-only)
    if (key !== "mentionsLegales") {
      entries.push({
        loc: SITE_URL + loc.en,
        alts: {
          fr: SITE_URL + loc.fr,
          en: SITE_URL + loc.en,
          "x-default": SITE_URL + loc.en,
        },
        lastmod: today,
        priority: key === "home" ? "1.0" : "0.8",
        changefreq: "weekly",
      });
    }
  }
  return entries;
}

interface ManifestEntry {
  locale: "fr" | "en";
  slug: string;
  path: string;
  hreflangPath: string;
  date: string;
  title: string;
}

function buildPosts(): UrlEntry[] {
  if (!existsSync(MANIFEST)) {
    console.warn(
      `WARN: ${MANIFEST} not found. Run build:posts first. Skipping post sitemap entries.`,
    );
    return [];
  }
  const manifest: ManifestEntry[] = JSON.parse(readFileSync(MANIFEST, "utf8"));
  return manifest.map((m) => {
    const frUrl = SITE_URL + (m.locale === "fr" ? m.path : m.hreflangPath);
    const enUrl = SITE_URL + (m.locale === "en" ? m.path : m.hreflangPath);
    return {
      loc: SITE_URL + m.path,
      alts: {
        fr: frUrl,
        en: enUrl,
        // x-default aligned to EN, matching SEO.tsx hreflangLinks().
        "x-default": enUrl,
      },
      lastmod: m.date,
      priority: "0.7",
      changefreq: "monthly",
    };
  });
}

function render(entries: UrlEntry[]): string {
  const urls = entries
    .map((e) => {
      const alts = Object.entries(e.alts)
        .map(
          ([hl, href]) =>
            `    <xhtml:link rel="alternate" hreflang="${hl}" href="${href}" />`,
        )
        .join("\n");
      return `  <url>
    <loc>${e.loc}</loc>
${alts}
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority}</priority>
  </url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
}

function main() {
  if (!existsSync(DIST)) {
    console.error(`ERROR: ${DIST} missing. Run vite build first.`);
    process.exit(1);
  }
  const entries = [...buildStatic(), ...buildPosts()];
  const seen = new Set<string>();
  const deduped = entries.filter((e) => {
    if (seen.has(e.loc)) return false;
    seen.add(e.loc);
    return true;
  });
  writeFileSync(OUT, render(deduped), "utf8");
  console.log(`wrote ${OUT} (${deduped.length} URLs)`);
  // Stage manifest into dist/ so prerender can read it + deploy carries it.
  if (existsSync(MANIFEST)) {
    copyFileSync(MANIFEST, MANIFEST_DIST_COPY);
    console.log(`copied ${MANIFEST} -> ${MANIFEST_DIST_COPY}`);
  }
}

main();
