import { z } from "zod";
import { FRAMEWORK_SLUGS } from "./compliance/frameworks";
import { INDUSTRY_SLUGS } from "./compliance/industries";

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

export const AUDIENCES = ["direct", "partner"] as const;
export type Audience = (typeof AUDIENCES)[number];

/**
 * Post kind. Default "blog" preserves the existing 11 blog posts and their
 * /blog/<slug> URLs without any frontmatter edits. "compliance" gates the
 * pSEO matrix under /compliance/{framework}/{industry} and requires both
 * framework and industry frontmatter fields. Refinement below enforces that.
 */
export const KINDS = ["blog", "compliance"] as const;
export type Kind = (typeof KINDS)[number];

export const PostFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    description: z.string().min(1),
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be ISO YYYY-MM-DD"),
    author: z.string().min(1),
    tags: z.array(z.string()).default([]),
    locale: z.enum(LOCALES),
    slug: z
      .string()
      .regex(/^[a-z0-9-]+$/, "slug must be lowercase kebab-case")
      .min(1),
    draft: z.boolean().default(false).optional(),
    ogImage: z.string().optional(),
    // GEO program (2026-04-29): tag who the article speaks to. Default 'direct'
    // keeps existing 16 articles valid without edits. 'partner' is for GRC
    // platform managers (Vanta, Drata, Sprinto) who buy wholesale.
    audience: z.enum(AUDIENCES).default("direct"),
    // FAQ entries lift into FAQPage JSON-LD on the blog post route. Google +
    // AI grounding engines pull these into expandable rich-result answers.
    faqs: z
      .array(
        z.object({
          question: z.string().min(1),
          answer: z.string().min(1),
        }),
      )
      .optional(),
    // pSEO compliance matrix (2026-05-16): kind defaults to "blog" so the
    // existing 11 posts pass validation without edits. kind "compliance"
    // requires both framework and industry slugs from the typed enums.
    kind: z.enum(KINDS).default("blog"),
    framework: z.enum(FRAMEWORK_SLUGS).optional(),
    industry: z.enum(INDUSTRY_SLUGS).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.kind === "compliance") {
      if (!data.framework) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["framework"],
          message: "framework is required when kind=compliance",
        });
      }
      if (!data.industry) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["industry"],
          message: "industry is required when kind=compliance",
        });
      }
    }
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
