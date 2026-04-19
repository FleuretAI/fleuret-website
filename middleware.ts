import { next, rewrite } from "@vercel/edge";

/**
 * Edge middleware. Redirects legacy domains to fleuret.ai, strips trailing
 * slashes, and returns a true HTTP 404 for unknown routes so crawlers don't
 * see a soft-200 index.html on every miss.
 */

export const config = {
  matcher: "/((?!_next|_vercel|assets|favicon\\.ico|favicon\\.png|favicon\\.svg|robots\\.txt|sitemap\\.xml|.*\\.[a-z0-9]+$).*)",
};

const KNOWN_PATHS = new Set<string>([
  "/",
  "/about",
  "/careers",
  "/design-partners",
  "/mentions-legales",
  "/privacy",
  "/terms",
  "/security",
  "/en",
  "/en/about",
  "/en/careers",
  "/en/design-partners",
  "/en/privacy",
  "/en/terms",
  "/en/security",
]);

const CANONICAL_HOST = "fleuret.ai";

export default function middleware(request: Request): Response {
  const url = new URL(request.url);

  // Domain consolidation: fleuret-ai.com, www.fleuret.ai, www.fleuret-ai.com
  // -> fleuret.ai with 301.
  if (url.hostname !== CANONICAL_HOST && /^(www\.)?fleuret(-ai)?\.(ai|com)$/i.test(url.hostname)) {
    url.hostname = CANONICAL_HOST;
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }

  // Strip trailing slash (except root) to avoid canonical dupes.
  if (url.pathname.length > 1 && url.pathname.endsWith("/")) {
    url.pathname = url.pathname.replace(/\/+$/, "");
    return Response.redirect(url.toString(), 301);
  }

  if (KNOWN_PATHS.has(url.pathname)) {
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
