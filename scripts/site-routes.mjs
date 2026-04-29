/**
 * Single source of truth for site routes.
 *
 * Consumed by: scripts/prerender.mjs, scripts/ensure-fallback-shells.mjs,
 * middleware.ts. Keeping the route list in one place prevents the recurring
 * deploy bug where a new page is added to two of three lists and 404s in
 * production.
 *
 * Edge runtime note: middleware.ts imports this file. @vercel/edge bundles
 * relative ESM imports via esbuild, so .mjs is fine. Do not add Node-only
 * APIs here (no fs, no path) so the edge bundler stays happy.
 */

export const STATIC_FR_PATHS = [
  "/",
  "/about",
  "/careers",
  "/design-partners",
  "/partners",
  "/demo",
  "/mentions-legales",
  "/privacy",
  "/terms",
  "/security",
  "/sub-processors",
  "/resources",
  "/blog",
  "/changelog",
  "/news/fleuret-raises-3-5m",
];

// EN derived from FR. /mentions-legales is FR-only (legal mentions).
export const STATIC_EN_PATHS = STATIC_FR_PATHS
  .filter((p) => p !== "/mentions-legales")
  .map((p) => (p === "/" ? "/en" : `/en${p}`));

// Build-only routes that are not user-routable (404 page lives at /404.html).
export const BUILD_ONLY_PATHS = ["/404"];

// Blog post slug shape: alphanumeric + hyphens, must start with alphanumeric.
// Matches /blog/<slug> and /en/blog/<slug>.
export const BLOG_POST_RE = /^(?:\/en)?\/blog\/[a-z0-9][a-z0-9-]*$/;

/**
 * Allowlist for middleware: every route the site can serve a 200 for, minus
 * build-only paths. Blog posts are matched by regex, not enumerated.
 */
export const KNOWN_PATHS = new Set([...STATIC_FR_PATHS, ...STATIC_EN_PATHS]);
