import type { Locale } from "../post-schema";

/**
 * Deleted post slugs. The codegen script reads this list and:
 *   1. Excludes matching slugs from the post manifest + sitemap.
 *   2. Patches `vercel.json` with edge rewrite rules inside the
 *      marker-region `GENERATED:TOMBSTONES:START/END` so that
 *      `/blog/<slug>` returns 410 (no replacement) or 301 (replacement).
 *
 * Never soft-404 a deleted post. Edge-level response prevents Google
 * from keeping the URL indexed with 200 OK + empty body.
 */

export interface Tombstone {
  slug: string;
  locale: Locale;
  /** If set, `/blog/<slug>` issues 301 → `/blog/<replacement>`. */
  replacement?: string;
}

export const TOMBSTONES: Tombstone[] = [];
