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
});
