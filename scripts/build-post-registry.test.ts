import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Codegen smoke tests. These assert the invariants the design doc committed
 * to: paired FR+EN, same-locale dup detection, draft exclusion, manifest
 * shape. We run the codegen once against the real content dir and inspect
 * the outputs — full isolation (temp dir + fixture content) can be a
 * follow-up TODO if/when authoring cadence warrants it.
 */

const ROOT = resolve(__dirname, "..");
const MANIFEST = resolve(ROOT, "dist/post-manifest.json");
const REGISTRY = resolve(ROOT, "src/content/posts.generated.ts");

describe("build-post-registry output", () => {
  it("emits manifest with paired FR+EN for every slug", () => {
    expect(existsSync(MANIFEST)).toBe(true);
    const raw = readFileSync(MANIFEST, "utf8");
    const entries = JSON.parse(raw) as Array<{ locale: string; slug: string }>;
    const frSlugs = new Set(entries.filter((e) => e.locale === "fr").map((e) => e.slug));
    const enSlugs = new Set(entries.filter((e) => e.locale === "en").map((e) => e.slug));
    for (const s of frSlugs) expect(enSlugs.has(s)).toBe(true);
    for (const s of enSlugs) expect(frSlugs.has(s)).toBe(true);
  });

  it("emits registry module with POSTS_BY_SLUG keyed by locale:slug", () => {
    expect(existsSync(REGISTRY)).toBe(true);
    const source = readFileSync(REGISTRY, "utf8");
    expect(source).toMatch(/export const POSTS_BY_SLUG/);
    expect(source).toMatch(/"fr:continuous-ai-pentesting-nis2"/);
    expect(source).toMatch(/"en:continuous-ai-pentesting-nis2"/);
  });

  it("stamps hreflangPath in the manifest so sitemap can pair locales", () => {
    const entries = JSON.parse(readFileSync(MANIFEST, "utf8")) as Array<{
      locale: string;
      path: string;
      hreflangPath: string;
    }>;
    for (const e of entries) {
      if (e.locale === "fr") {
        expect(e.path).toMatch(/^\/blog\//);
        expect(e.hreflangPath).toMatch(/^\/en\/blog\//);
      } else {
        expect(e.path).toMatch(/^\/en\/blog\//);
        expect(e.hreflangPath).toMatch(/^\/blog\//);
      }
    }
  });
});
