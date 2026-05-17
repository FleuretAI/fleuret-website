import { describe, expect, it } from "vitest";
import { PostFrontmatterSchema } from "./post-schema";

describe("PostFrontmatterSchema", () => {
  const valid = {
    title: "T",
    description: "D",
    date: "2026-04-20",
    author: "A",
    tags: ["x"],
    locale: "fr" as const,
    slug: "my-post",
  };

  it("parses valid frontmatter", () => {
    const r = PostFrontmatterSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("rejects non-ISO date", () => {
    const r = PostFrontmatterSchema.safeParse({ ...valid, date: "April 20 2026" });
    expect(r.success).toBe(false);
  });

  it("rejects unknown locale", () => {
    const r = PostFrontmatterSchema.safeParse({ ...valid, locale: "de" });
    expect(r.success).toBe(false);
  });

  it("rejects non-kebab slug", () => {
    const r = PostFrontmatterSchema.safeParse({ ...valid, slug: "My Post" });
    expect(r.success).toBe(false);
  });

  it("accepts missing tags (defaults to [])", () => {
    const { tags: _tags, ...rest } = valid;
    const r = PostFrontmatterSchema.safeParse(rest);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.tags).toEqual([]);
  });

  it("accepts draft flag", () => {
    const r = PostFrontmatterSchema.safeParse({ ...valid, draft: true });
    expect(r.success).toBe(true);
  });

  it("defaults audience to 'direct' when missing", () => {
    const r = PostFrontmatterSchema.safeParse(valid);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.audience).toBe("direct");
  });

  it("accepts audience='partner'", () => {
    const r = PostFrontmatterSchema.safeParse({ ...valid, audience: "partner" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.audience).toBe("partner");
  });

  it("rejects invalid audience value (e.g. 'enterprise')", () => {
    const r = PostFrontmatterSchema.safeParse({ ...valid, audience: "enterprise" });
    expect(r.success).toBe(false);
  });

  // REG1 (regression): the kind/framework/industry extension must not break
  // existing blog frontmatter parsing. Existing 11 posts (now under
  // src/content/blog/en/) do not declare kind. Schema must default to "blog".
  describe("REG1: kind defaults to 'blog' for back-compat", () => {
    it("defaults kind to 'blog' when missing", () => {
      const r = PostFrontmatterSchema.safeParse(valid);
      expect(r.success).toBe(true);
      if (r.success) expect(r.data.kind).toBe("blog");
    });

    it("accepts existing-shape frontmatter with no kind/framework/industry", () => {
      const r = PostFrontmatterSchema.safeParse({
        title: "Existing blog post",
        description: "Existing description",
        date: "2026-04-20",
        author: "Fleuret",
        tags: ["dora"],
        locale: "en" as const,
        slug: "existing-blog-post",
      });
      expect(r.success).toBe(true);
    });
  });

  describe("compliance kind requires framework + industry", () => {
    it("accepts kind='compliance' with framework + industry", () => {
      const r = PostFrontmatterSchema.safeParse({
        ...valid,
        locale: "en" as const,
        slug: "fintech",
        kind: "compliance",
        framework: "dora",
        industry: "fintech",
      });
      expect(r.success).toBe(true);
    });

    it("rejects kind='compliance' missing framework", () => {
      const r = PostFrontmatterSchema.safeParse({
        ...valid,
        locale: "en" as const,
        slug: "fintech",
        kind: "compliance",
        industry: "fintech",
      });
      expect(r.success).toBe(false);
    });

    it("rejects kind='compliance' missing industry", () => {
      const r = PostFrontmatterSchema.safeParse({
        ...valid,
        locale: "en" as const,
        slug: "fintech",
        kind: "compliance",
        framework: "dora",
      });
      expect(r.success).toBe(false);
    });

    it("rejects unknown framework slug", () => {
      const r = PostFrontmatterSchema.safeParse({
        ...valid,
        locale: "en" as const,
        slug: "fintech",
        kind: "compliance",
        framework: "made-up-framework",
        industry: "fintech",
      });
      expect(r.success).toBe(false);
    });

    it("rejects unknown industry slug", () => {
      const r = PostFrontmatterSchema.safeParse({
        ...valid,
        locale: "en" as const,
        slug: "fintech",
        kind: "compliance",
        framework: "dora",
        industry: "edtech",
      });
      expect(r.success).toBe(false);
    });
  });
});
