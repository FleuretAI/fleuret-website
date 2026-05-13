import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

/**
 * Codegen smoke tests. Single-locale (EN) site. Asserts that
 * the manifest + registry only contain EN entries and the path
 * shape is `/blog/<slug>`.
 */

const ROOT = resolve(__dirname, "..");
const MANIFEST = resolve(ROOT, ".post-manifest.json");
const REGISTRY = resolve(ROOT, "src/content/posts.generated.ts");

describe("build-post-registry output", () => {
  it("emits manifest with EN entries only", () => {
    expect(existsSync(MANIFEST)).toBe(true);
    const raw = readFileSync(MANIFEST, "utf8");
    const entries = JSON.parse(raw) as Array<{ locale: string; slug: string }>;
    expect(entries.length).toBeGreaterThan(0);
    for (const e of entries) expect(e.locale).toBe("en");
  });

  it("emits registry module with POSTS_BY_SLUG keyed by en:slug", () => {
    expect(existsSync(REGISTRY)).toBe(true);
    const source = readFileSync(REGISTRY, "utf8");
    expect(source).toMatch(/export const POSTS_BY_SLUG/);
    expect(source).toMatch(/"en:continuous-ai-pentesting-nis2"/);
    expect(source).not.toMatch(/"fr:[a-z-]+"/);
  });

  it("stamps /blog/<slug> path in the manifest", () => {
    const entries = JSON.parse(readFileSync(MANIFEST, "utf8")) as Array<{
      locale: string;
      path: string;
      hreflangPath: string;
    }>;
    for (const e of entries) {
      expect(e.path).toMatch(/^\/blog\/[a-z0-9-]+$/);
      expect(e.hreflangPath).toBe(e.path);
    }
  });
});
