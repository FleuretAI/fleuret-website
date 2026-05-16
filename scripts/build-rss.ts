#!/usr/bin/env bun
/**
 * RSS feed generator.
 *
 * Runs AFTER `vite build`, alongside `scripts/build-sitemap.ts`:
 *   1. Reads dist/post-manifest.json (already copied there by build-sitemap.ts).
 *      Falls back to repo-root .post-manifest.json when run standalone.
 *   2. Emits two feeds:
 *        - dist/feed.xml         (FR locale, primary)
 *        - dist/en/feed.xml      (EN locale)
 *   3. Each feed lists that locale's posts in reverse-chronological order.
 *
 * RSS 2.0 spec: https://www.rssboard.org/rss-specification
 * pubDate must be RFC 822 (e.g. "Wed, 13 May 2026 10:00:00 GMT").
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SITE_URL } from "../src/seo/routes.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const MANIFEST_DIST = resolve(DIST, "post-manifest.json");
const MANIFEST_ROOT = resolve(ROOT, ".post-manifest.json");
const OUT_FR = resolve(DIST, "feed.xml");
const OUT_EN = resolve(DIST, "en", "feed.xml");

interface ManifestEntry {
  locale: "fr" | "en";
  slug: string;
  path: string;
  hreflangPath: string;
  date: string;
  title: string;
  description: string;
  // Compliance pSEO entries set kind="compliance" and are excluded from RSS
  // (editorial feed only). Blog entries either omit kind or set kind="blog".
  kind?: "blog" | "compliance";
}

const FEED_META = {
  fr: {
    title: "Fleuret — Pentest continu par IA agentique",
    description:
      "Analyses, guides et retours d'expérience sur le pentest automatisé par IA agentique, la conformité NIS2/DORA et la sécurité offensive européenne.",
    link: `${SITE_URL}/blog`,
    selfLink: `${SITE_URL}/feed.xml`,
    language: "fr-FR",
  },
  en: {
    title: "Fleuret — Continuous AI-powered pentesting",
    description:
      "Insights, guides and case studies on agentic AI pentesting, NIS2/DORA compliance and European offensive security.",
    link: `${SITE_URL}/en/blog`,
    selfLink: `${SITE_URL}/en/feed.xml`,
    language: "en-US",
  },
} as const;

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc822(isoDate: string): string {
  // Manifest dates are YYYY-MM-DD with no time. Anchor at 10:00 UTC so feed
  // ordering is stable and pubDate doesn't collide for same-day posts.
  const d = new Date(`${isoDate}T10:00:00Z`);
  return d.toUTCString();
}

function loadManifest(): ManifestEntry[] {
  const path = existsSync(MANIFEST_DIST)
    ? MANIFEST_DIST
    : existsSync(MANIFEST_ROOT)
      ? MANIFEST_ROOT
      : null;
  if (!path) {
    console.error(
      `ERROR: post manifest not found at ${MANIFEST_DIST} or ${MANIFEST_ROOT}. Run build:posts first.`,
    );
    process.exit(1);
  }
  return JSON.parse(readFileSync(path, "utf8"));
}

function renderFeed(
  locale: "fr" | "en",
  posts: ManifestEntry[],
): string {
  const meta = FEED_META[locale];
  // Reverse-chronological by date (newest first). Manifest order is not guaranteed.
  const sorted = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  const lastBuildDate = new Date().toUTCString();

  const items = sorted
    .map((p) => {
      const url = SITE_URL + p.path;
      return `    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${toRfc822(p.date)}</pubDate>
      <description>${escapeXml(p.description)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${meta.link}</link>
    <description>${escapeXml(meta.description)}</description>
    <language>${meta.language}</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <atom:link href="${meta.selfLink}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}

function main() {
  if (!existsSync(DIST)) {
    console.error(`ERROR: ${DIST} missing. Run vite build first.`);
    process.exit(1);
  }
  const manifest = loadManifest();

  // Editorial RSS: blog only. Compliance pSEO stays out of /feed.xml so
  // subscribers don't get a programmatic-SEO firehose in their reader.
  const editorial = manifest.filter((p) => p.kind !== "compliance");
  const frPosts = editorial.filter((p) => p.locale === "fr");
  const enPosts = editorial.filter((p) => p.locale === "en");

  if (!existsSync(dirname(OUT_EN))) {
    mkdirSync(dirname(OUT_EN), { recursive: true });
  }

  writeFileSync(OUT_FR, renderFeed("fr", frPosts), "utf8");
  console.log(`wrote ${OUT_FR} (${frPosts.length} items)`);

  writeFileSync(OUT_EN, renderFeed("en", enPosts), "utf8");
  console.log(`wrote ${OUT_EN} (${enPosts.length} items)`);
}

main();
