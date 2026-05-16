import { next, rewrite } from "@vercel/edge";
import {
  KNOWN_PATHS,
  BLOG_POST_RE,
  COMPLIANCE_POST_RE,
} from "./scripts/site-routes.mjs";

/**
 * Edge middleware. Strips trailing slashes and returns a true HTTP 404 for
 * unknown routes so crawlers do not see a soft-200 index.html on every miss.
 *
 * Host canonicalization (fleuret-ai.com / www.fleuret.ai -> fleuret.ai) is
 * owned by the Vercel dashboard (Domains -> primary = fleuret.ai). Doing it
 * here too caused a redirect loop when the dashboard and middleware
 * disagreed on the canonical host. The dashboard is the source of truth.
 *
 * Route lists (KNOWN_PATHS, BLOG_POST_RE) come from scripts/site-routes.mjs
 * so middleware, prerender, and fallback-shells stay in sync.
 */

export const config = {
  matcher:
    "/((?!_next|_vercel|assets|favicon\\.ico|favicon\\.png|favicon\\.svg|robots\\.txt|sitemap\\.xml|.*\\.[a-z0-9]+$).*)",
};

export default function middleware(request: Request): Response {
  const url = new URL(request.url);

  // Strip trailing slash (except root) to avoid canonical duplicates.
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
    return Response.redirect(url.toString(), 301);
  }

  // Single-locale (EN) migration: legacy /en/* URLs that Google still has
  // indexed get a permanent redirect to the same path without the prefix.
  // /en -> /
  if (url.pathname === "/en") {
    const stripped = new URL("/", url);
    stripped.search = url.search;
    return Response.redirect(stripped.toString(), 301);
  }
  if (url.pathname.startsWith("/en/")) {
    const stripped = new URL(url.pathname.replace(/^\/en/, "") || "/", url);
    stripped.search = url.search;
    return Response.redirect(stripped.toString(), 301);
  }

  if (
    KNOWN_PATHS.has(url.pathname) ||
    BLOG_POST_RE.test(url.pathname) ||
    COMPLIANCE_POST_RE.test(url.pathname)
  ) {
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
