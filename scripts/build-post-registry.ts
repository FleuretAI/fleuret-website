#!/usr/bin/env bun
/**
 * Blog post registry codegen.
 *
 * Run via bun (imports .ts schema directly):
 *   bun scripts/build-post-registry.ts         # non-strict (warns)
 *   bun scripts/build-post-registry.ts --strict  # build/CI mode (throws)
 *
 * Pipeline:
 *   1. Glob src/content/blog/{fr,en}/*.mdx
 *   2. Parse frontmatter with gray-matter, validate with Zod
 *   3. Enforce FR+EN locale pair (orphan => fail in strict mode)
 *   4. Reject same-locale duplicate slugs (always)
 *   5. Strip drafts unless BLOG_INCLUDE_DRAFTS=true
 *   6. Compute reading time via `reading-time` on the MDX body
 *   7. Exclude tombstoned slugs from manifest
 *   8. Emit:
 *        - src/content/posts.generated.ts  (eager metadata + lazy MDX loader map)
 *        - dist/post-manifest.json         (JSON for prerender + sitemap)
 *   9. Patch vercel.json tombstone region (generates 410 Gone / 301 redirect rules)
 *
 * Iron rule: build fails loudly on schema violation. Never ship orphan hreflang.
 */
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import readingTime from "reading-time";
import {
  LOCALES,
  type Locale,
  PostFrontmatterSchema,
  type PostMeta,
} from "../src/content/post-schema.ts";
import { TOMBSTONES } from "../src/content/blog/tombstones.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT_DIR = join(ROOT, "src/content/blog");
const REGISTRY_OUT = join(ROOT, "src/content/posts.generated.ts");
// Manifest lives at repo root (gitignored). `vite build` wipes dist/, so we
// keep the manifest outside dist/ and let downstream scripts (sitemap,
// prerender) read it from here, then copy to dist/ AFTER vite build finishes.
const MANIFEST_OUT = join(ROOT, ".post-manifest.json");
const VERCEL_JSON = join(ROOT, "vercel.json");

const STRICT = process.argv.includes("--strict");
const INCLUDE_DRAFTS = process.env.BLOG_INCLUDE_DRAFTS === "true";

const errors: string[] = [];
const warnings: string[] = [];

function fail(msg: string) {
  (STRICT ? errors : warnings).push(msg);
}
function hardFail(msg: string) {
  // Always-fatal errors (dupes, schema).
  errors.push(msg);
}

interface LoadedPost {
  meta: PostMeta;
  body: string;
  absolutePath: string;
  /** Import specifier relative to src/content/posts.generated.ts. */
  relativeImport: string;
}

function loadLocale(locale: Locale): LoadedPost[] {
  const dir = join(CONTENT_DIR, locale);
  if (!existsSync(dir)) return [];
  const files = readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const seen = new Map<string, string>();
  const out: LoadedPost[] = [];

  for (const file of files) {
    const full = join(dir, file);
    const raw = readFileSync(full, "utf8");
    let parsed: ReturnType<typeof matter>;
    try {
      parsed = matter(raw);
    } catch (e) {
      hardFail(`${full}: frontmatter parse error: ${(e as Error).message}`);
      continue;
    }

    const result = PostFrontmatterSchema.safeParse({
      ...parsed.data,
      locale, // filesystem is source of truth for locale
    });
    if (!result.success) {
      const msg = result.error.issues
        .map((i) => `${i.path.join(".") || "(root)"}: ${i.message}`)
        .join("; ");
      fail(`${full}: invalid frontmatter: ${msg}`);
      continue;
    }

    const fm = result.data;

    // slug must match filename (prevents typo drift)
    const expectedFile = `${fm.slug}.mdx`;
    if (file !== expectedFile) {
      hardFail(
        `${full}: frontmatter slug "${fm.slug}" must match filename "${file}" (expected ${expectedFile}).`,
      );
      continue;
    }

    // same-locale duplicate detection (always fatal)
    if (seen.has(fm.slug)) {
      hardFail(
        `${full}: duplicate slug "${fm.slug}" already defined at ${seen.get(fm.slug)} (same locale).`,
      );
      continue;
    }
    seen.set(fm.slug, full);

    if (fm.draft && !INCLUDE_DRAFTS) continue;

    const rt = readingTime(parsed.content);
    const readingTimeMinutes = Math.max(1, Math.ceil(rt.minutes));

    const path =
      locale === "fr" ? `/blog/${fm.slug}` : `/en/blog/${fm.slug}`;
    const hreflangPath =
      locale === "fr" ? `/en/blog/${fm.slug}` : `/blog/${fm.slug}`;

    // Normalize ogImage to an absolute URL. Schema.org + Google require
    // absolute URLs in Article JSON-LD; a bare `/blog/<slug>/hero.webp` in
    // frontmatter otherwise ships as a relative URL in the JSON-LD payload.
    // SITE_URL is the source of truth and is the same constant consumed by
    // SEO.tsx, so we inline it here.
    let normalizedOgImage = fm.ogImage;
    if (normalizedOgImage && normalizedOgImage.startsWith("/")) {
      normalizedOgImage = `https://fleuret.ai${normalizedOgImage}`;
    }

    out.push({
      meta: {
        ...fm,
        ogImage: normalizedOgImage,
        readingTimeMinutes,
        path,
        hreflangPath,
      },
      body: parsed.content,
      absolutePath: full,
      relativeImport: `./blog/${locale}/${fm.slug}.mdx`,
    });
  }

  return out;
}

function enforcePair(
  fr: LoadedPost[],
  en: LoadedPost[],
): { posts: LoadedPost[] } {
  const frSlugs = new Set(fr.map((p) => p.meta.slug));
  const enSlugs = new Set(en.map((p) => p.meta.slug));

  const orphanFr = [...frSlugs].filter((s) => !enSlugs.has(s));
  const orphanEn = [...enSlugs].filter((s) => !frSlugs.has(s));

  for (const s of orphanFr) {
    fail(
      `slug "${s}" exists in fr/ but not en/. Pair required (add src/content/blog/en/${s}.mdx or set draft:true on FR).`,
    );
  }
  for (const s of orphanEn) {
    fail(
      `slug "${s}" exists in en/ but not fr/. Pair required (add src/content/blog/fr/${s}.mdx or set draft:true on EN).`,
    );
  }

  // Only posts that appear in BOTH locales ship.
  const paired = new Set([...frSlugs].filter((s) => enSlugs.has(s)));
  return {
    posts: [...fr, ...en].filter((p) => paired.has(p.meta.slug)),
  };
}

function excludeTombstoned(posts: LoadedPost[]): LoadedPost[] {
  const blocked = new Set(TOMBSTONES.map((t) => `${t.locale}:${t.slug}`));
  return posts.filter((p) => !blocked.has(`${p.meta.locale}:${p.meta.slug}`));
}

function writeRegistry(posts: LoadedPost[]) {
  // Lazy-loading map: dynamic import keeps main bundle flat.
  const imports = posts
    .map(
      (p) =>
        `  "${p.meta.locale}:${p.meta.slug}": { meta: ${JSON.stringify(
          p.meta,
        )}, load: () => import("${p.relativeImport}") },`,
    )
    .join("\n");

  const content = `// GENERATED by scripts/build-post-registry.ts. Do not edit by hand.
// Regenerate: \`bun run build:posts\`.
import type { PostMeta } from "./post-schema";
import type { ComponentType } from "react";

export interface RegistryEntry {
  meta: PostMeta;
  load: () => Promise<{ default: ComponentType }>;
}

/** Keyed by \`\${locale}:\${slug}\`. */
export const POSTS_BY_SLUG: Record<string, RegistryEntry> = {
${imports}
};

export const POSTS: PostMeta[] = Object.values(POSTS_BY_SLUG).map((e) => e.meta);

export function getPost(locale: string, slug: string): RegistryEntry | undefined {
  return POSTS_BY_SLUG[\`\${locale}:\${slug}\`];
}

export function listPosts(locale: string): PostMeta[] {
  return POSTS
    .filter((p) => p.locale === locale)
    .sort((a, b) => b.date.localeCompare(a.date));
}
`;
  writeFileSync(REGISTRY_OUT, content, "utf8");
  console.log(`wrote ${REGISTRY_OUT} (${posts.length} posts)`);
}

function writeManifest(posts: LoadedPost[]) {
  if (!existsSync(dirname(MANIFEST_OUT))) {
    mkdirSync(dirname(MANIFEST_OUT), { recursive: true });
  }
  const manifest = posts.map((p) => ({
    locale: p.meta.locale,
    slug: p.meta.slug,
    path: p.meta.path,
    hreflangPath: p.meta.hreflangPath,
    date: p.meta.date,
    title: p.meta.title,
  }));
  writeFileSync(MANIFEST_OUT, JSON.stringify(manifest, null, 2), "utf8");
  console.log(`wrote ${MANIFEST_OUT} (${manifest.length} entries)`);
}

/**
 * Blog tombstone sources match this regex. We identify generated redirects
 * by the `source` field alone — Vercel's redirect schema is
 * `additionalProperties: false`, so we can't stash a marker field like
 * `_tombstone: true` (would fail `vercel build` validation and block deploy).
 *
 * Tombstones WITHOUT a replacement: no redirect is emitted. The prerender
 * step already excludes the slug from dist/, so Vercel's default
 * file-not-found handler returns /404.html with real HTTP 404. Emitting a
 * 308 redirect to /404 would turn that into a 200 at /404 (soft-404 in
 * Google Search Console). Natural 404 is strictly better.
 */
const BLOG_TOMBSTONE_SOURCE_RE = /^\/(?:en\/)?blog\/[a-z0-9-]+$/;

function patchVercelTombstones() {
  if (!existsSync(VERCEL_JSON)) return;
  const raw = readFileSync(VERCEL_JSON, "utf8");
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    hardFail(`vercel.json is not valid JSON: ${(e as Error).message}`);
    return;
  }
  const existing = Array.isArray(parsed.redirects)
    ? (parsed.redirects as Array<Record<string, unknown>>)
    : [];
  // Strip any prior-run blog tombstones by source-pattern match.
  const stripped = existing.filter(
    (r) =>
      typeof r.source !== "string" ||
      !BLOG_TOMBSTONE_SOURCE_RE.test(r.source as string),
  );

  // Only emit redirects for tombstones that point somewhere (replacement).
  const generated = TOMBSTONES.filter((t) => t.replacement).map((t) => {
    const source =
      t.locale === "fr" ? `/blog/${t.slug}` : `/en/blog/${t.slug}`;
    const dest =
      t.locale === "fr"
        ? `/blog/${t.replacement}`
        : `/en/blog/${t.replacement}`;
    return { source, destination: dest, permanent: true };
  });

  const nextRedirects = [...stripped, ...generated];

  // Short-circuit when nothing changed. Preserves hand-authored whitespace /
  // key order across no-op codegen runs.
  const currentSerialized = JSON.stringify(existing);
  const nextSerialized = JSON.stringify(nextRedirects);
  if (currentSerialized === nextSerialized) {
    console.log(
      `vercel.json tombstones: no change (${generated.length} redirect(s))`,
    );
    return;
  }

  // Prefer omitting the `redirects` key entirely when we have no redirects.
  if (nextRedirects.length === 0) {
    delete (parsed as Record<string, unknown>).redirects;
  } else {
    parsed.redirects = nextRedirects;
  }

  const next = JSON.stringify(parsed, null, 2) + "\n";
  try {
    JSON.parse(next);
  } catch (e) {
    hardFail(
      `vercel.json patch produced invalid JSON: ${(e as Error).message}`,
    );
    return;
  }
  writeFileSync(VERCEL_JSON, next, "utf8");
  console.log(
    `patched ${VERCEL_JSON}: ${generated.length} tombstone redirect(s), ${existing.length - stripped.length} stale removed`,
  );
}

function main() {
  console.log(
    `build-post-registry: strict=${STRICT} drafts=${INCLUDE_DRAFTS}`,
  );
  const fr = loadLocale("fr");
  const en = loadLocale("en");
  const { posts: paired } = enforcePair(fr, en);
  const live = excludeTombstoned(paired);

  for (const w of warnings) console.warn(`WARN: ${w}`);
  if (errors.length > 0) {
    for (const e of errors) console.error(`ERROR: ${e}`);
    console.error(`\nbuild-post-registry: ${errors.length} error(s). Aborting.`);
    process.exit(1);
  }

  writeRegistry(live);
  writeManifest(live);
  patchVercelTombstones();

  console.log(
    `done: ${live.length} live posts (${fr.length} fr + ${en.length} en, paired=${paired.length}, tombstoned=${paired.length - live.length})`,
  );
}

main();
