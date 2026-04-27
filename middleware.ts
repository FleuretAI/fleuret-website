import { next, rewrite } from "@vercel/edge";

/**
 * Edge middleware. Strips trailing slashes and returns a true HTTP 404 for
 * unknown routes so crawlers do not see a soft-200 index.html on every miss.
 *
 * Host canonicalization (fleuret-ai.com / www.fleuret.ai -> fleuret.ai) is
 * owned by the Vercel dashboard (Domains -> primary = fleuret.ai). Doing it
 * here too caused a redirect loop when the dashboard and middleware
 * disagreed on the canonical host. The dashboard is the source of truth.
 */

export const config = {
  matcher:
    "/((?!_next|_vercel|assets|favicon\\.ico|favicon\\.png|favicon\\.svg|robots\\.txt|sitemap\\.xml|.*\\.[a-z0-9]+$).*)",
};

const KNOWN_PATHS = new Set<string>([
  "/",
  "/about",
  "/careers",
  "/design-partners",
  "/demo",
  "/mentions-legales",
  "/privacy",
  "/terms",
  "/security",
  "/resources",
  "/blog",
  "/changelog",
  "/news/fleuret-raises-3-5m",
  "/en",
  "/en/about",
  "/en/careers",
  "/en/design-partners",
  "/en/demo",
  "/en/privacy",
  "/en/terms",
  "/en/security",
  "/en/resources",
  "/en/blog",
  "/en/changelog",
  "/en/news/fleuret-raises-3-5m",
]);

// Dynamic blog post paths: /blog/:slug and /en/blog/:slug. Slugs are
// alphanumeric + hyphens, must have >=1 char, no extra path segments.
const BLOG_POST_RE = /^(?:\/en)?\/blog\/[a-z0-9][a-z0-9-]*$/;

export default function middleware(request: Request): Response {
  const url = new URL(request.url);

  // Strip trailing slash (except root) to avoid canonical duplicates.
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
    return Response.redirect(url.toString(), 301);
  }

  if (KNOWN_PATHS.has(url.pathname) || BLOG_POST_RE.test(url.pathname)) {
    return next();
  }

  // Unknown path: rewrite to /404.html and force a real 404 status code.
  const notFound = new URL("/404.html", url);
  const rewritten = rewrite(notFound);
  return new Response(rewritten.body, {
    status: 404,
    headers: rewritten.headers,
  });
}
