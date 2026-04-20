import { z } from "zod";

/**
 * Post frontmatter schema. Validated at build time by
 * `scripts/build-post-registry.mjs`. Unknown locale or malformed date
 * causes a hard fail (strict mode) so orphan / broken posts never ship.
 *
 * Data flow:
 *   MDX frontmatter (gray-matter)
 *      -> PostFrontmatterSchema.parse()
 *      -> PostMeta (computed fields added: readingTimeMinutes, hreflangPair)
 *      -> POSTS_BY_SLUG (in-memory registry)
 *      -> dist/post-manifest.json (prerender + sitemap consumers)
 */

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];

export const PostFrontmatterSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "date must be ISO YYYY-MM-DD"),
  author: z.string().min(1),
  tags: z.array(z.string()).default([]),
  locale: z.enum(LOCALES),
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, "slug must be lowercase kebab-case")
    .min(1),
  draft: z.boolean().default(false).optional(),
  ogImage: z.string().optional(),
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

/** Runtime shape consumed by BlogIndex / BlogPost pages. */
export interface PostMeta extends PostFrontmatter {
  /** Build-time computed, rounded up to whole minutes. */
  readingTimeMinutes: number;
  /** `/blog/<slug>` for FR, `/en/blog/<slug>` for EN. */
  path: string;
  /** Pair URL (the opposite-locale URL, used for hreflang). */
  hreflangPath: string;
}
