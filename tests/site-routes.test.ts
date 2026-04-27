import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import {
  STATIC_FR_PATHS,
  STATIC_EN_PATHS,
  KNOWN_PATHS,
  BLOG_POST_RE,
} from "../scripts/site-routes.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

function readSource(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

describe("site-routes single source of truth", () => {
  it("EN paths derive from FR paths (minus FR-only legal page)", () => {
    expect(STATIC_EN_PATHS).toContain("/en");
    expect(STATIC_EN_PATHS).toContain("/en/about");
    expect(STATIC_EN_PATHS).not.toContain("/en/mentions-legales");
  });

  it("KNOWN_PATHS contains every static route", () => {
    for (const p of [...STATIC_FR_PATHS, ...STATIC_EN_PATHS]) {
      expect(KNOWN_PATHS.has(p)).toBe(true);
    }
  });

  it("BLOG_POST_RE matches valid slugs and rejects invalid ones", () => {
    expect(BLOG_POST_RE.test("/blog/my-post")).toBe(true);
    expect(BLOG_POST_RE.test("/en/blog/my-post-2")).toBe(true);
    expect(BLOG_POST_RE.test("/blog/-bad")).toBe(false);
    expect(BLOG_POST_RE.test("/blog/foo/bar")).toBe(false);
    expect(BLOG_POST_RE.test("/blog/")).toBe(false);
  });

  it("/changelog is in every consumer (regression: prior drift bug)", () => {
    expect(STATIC_FR_PATHS).toContain("/changelog");
    expect(STATIC_EN_PATHS).toContain("/en/changelog");
    expect(KNOWN_PATHS.has("/changelog")).toBe(true);
    expect(KNOWN_PATHS.has("/en/changelog")).toBe(true);
  });

  it("middleware imports route lists from shared module (no hardcoded duplication)", () => {
    const src = readSource("middleware.ts");
    expect(src).toMatch(
      /from\s+["']\.\/scripts\/site-routes\.mjs["']/,
    );
    expect(src).not.toMatch(/const\s+KNOWN_PATHS\s*=\s*new Set/);
    expect(src).not.toMatch(/const\s+BLOG_POST_RE\s*=\s*\//);
  });

  it("prerender imports route lists from shared module", () => {
    const src = readSource("scripts/prerender.mjs");
    expect(src).toMatch(/from\s+["']\.\/site-routes\.mjs["']/);
    expect(src).not.toMatch(/const\s+FR_PATHS\s*=\s*\[/);
  });

  it("ensure-fallback-shells imports route lists from shared module", () => {
    const src = readSource("scripts/ensure-fallback-shells.mjs");
    expect(src).toMatch(/from\s+["']\.\/site-routes\.mjs["']/);
    expect(src).not.toMatch(/const\s+FR_PATHS\s*=\s*\[/);
  });
});
