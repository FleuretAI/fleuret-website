/**
 * Single source of truth for site routes.
 *
 * Consumed by: scripts/prerender.mjs, scripts/ensure-fallback-shells.mjs,
 * scripts/build-sitemap.ts, middleware.ts. Single-locale (EN) site.
 *
 * Edge runtime note: middleware.ts imports this file. @vercel/edge bundles
 * relative ESM imports via esbuild, so .mjs is fine. Do not add Node-only
 * APIs here (no fs, no path) so the edge bundler stays happy.
 */

export const STATIC_PATHS = [
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
  "/compliance",
  "/news/fleuret-raises-3-5m",
];

// Backwards-compat aliases. Older script imports still resolve.
export const STATIC_FR_PATHS = STATIC_PATHS;
export const STATIC_EN_PATHS = [];

// Build-only routes that are not user-routable (404 page lives at /404.html).
export const BUILD_ONLY_PATHS = ["/404"];

// Blog post slug shape: alphanumeric + hyphens, must start with alphanumeric.
export const BLOG_POST_RE = /^\/blog\/[a-z0-9][a-z0-9-]*$/;

// Compliance pSEO shape: /compliance/{framework}/{industry}. Both segments
// alphanumeric + hyphens, must start with alphanumeric. The build-time
// registry enforces that {framework} and {industry} come from typed
// constants; this regex is only the middleware shape gate.
export const COMPLIANCE_POST_RE =
  /^\/compliance\/[a-z0-9][a-z0-9-]*\/[a-z0-9][a-z0-9-]*$/;

/**
 * Allowlist for middleware: every route the site can serve a 200 for, minus
 * build-only paths. Blog posts and compliance pSEO pages are matched by
 * regex, not enumerated.
 */
export const KNOWN_PATHS = new Set(STATIC_PATHS);
