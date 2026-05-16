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

  // REG2 (regression): existing blog paths must keep emitting /blog/<slug>.
  // pSEO compliance pages emit /compliance/{framework}/{industry}. Both shapes
  // must be valid in the manifest after the pSEO extension.
  it("stamps /blog/<slug> for kind=blog and /compliance/<f>/<i> for kind=compliance", () => {
    const entries = JSON.parse(readFileSync(MANIFEST, "utf8")) as Array<{
      locale: string;
      path: string;
      hreflangPath: string;
      kind?: "blog" | "compliance";
      framework?: string;
      industry?: string;
    }>;
    for (const e of entries) {
      if (e.kind === "compliance") {
        expect(e.path).toMatch(/^\/compliance\/[a-z0-9-]+\/[a-z0-9-]+$/);
        expect(e.framework).toBeDefined();
        expect(e.industry).toBeDefined();
        expect(e.path).toBe(`/compliance/${e.framework}/${e.industry}`);
      } else {
        expect(e.path).toMatch(/^\/blog\/[a-z0-9-]+$/);
      }
      expect(e.hreflangPath).toBe(e.path);
    }
  });

  // REG3 (regression): existing blog posts must still appear in the manifest.
  // Specifically, the well-known continuous-ai-pentesting-nis2 post must survive
  // the pSEO extension.
  it("preserves all existing blog posts in the manifest", () => {
    const entries = JSON.parse(readFileSync(MANIFEST, "utf8")) as Array<{
      slug: string;
      kind?: "blog" | "compliance";
    }>;
    const blogEntries = entries.filter((e) => e.kind !== "compliance");
    expect(blogEntries.length).toBeGreaterThanOrEqual(11);
    const slugs = new Set(blogEntries.map((e) => e.slug));
    expect(slugs.has("continuous-ai-pentesting-nis2")).toBe(true);
  });

  it("emits compliance entries when src/content/compliance/ has MDX", () => {
    const entries = JSON.parse(readFileSync(MANIFEST, "utf8")) as Array<{
      kind?: "blog" | "compliance";
      framework?: string;
      industry?: string;
    }>;
    const compliance = entries.filter((e) => e.kind === "compliance");
    // Drafts shipped 2026-05-16: 5 pages (DORA, NIS2, ISO27001, SOC2, PCIDSS).
    expect(compliance.length).toBeGreaterThanOrEqual(5);
    const frameworks = new Set(compliance.map((c) => c.framework));
    expect(frameworks.has("dora")).toBe(true);
    expect(frameworks.has("nis2")).toBe(true);
    expect(frameworks.has("iso27001")).toBe(true);
    expect(frameworks.has("soc2")).toBe(true);
    expect(frameworks.has("pcidss")).toBe(true);
  });
});
