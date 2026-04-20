import {
  lazy,
  Suspense,
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type LazyExoticComponent,
} from "react";
import { Link, useParams } from "react-router-dom";
import { SEO, articleJsonLd, breadcrumbJsonLd } from "@/seo/SEO";
import { SITE_URL, hreflangLinksFor } from "@/seo/routes";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getPost } from "@/content/posts.generated";
import { PostMeta } from "@/components/blog/PostMeta";

/**
 * BlogPost is EAGER-imported from App.tsx (see design doc premise #10): prerender
 * Puppeteer otherwise captures an empty Suspense frame before the lazy chunk
 * resolves and ships blank HTML. Inside this component, the MDX component is
 * lazy-loaded per slug (registry entries expose `load: () => import(...)`), so
 * the main bundle stays flat regardless of post count.
 *
 * Puppeteer contract: `scripts/prerender.mjs` waits for
 *   article[data-post-slug][data-rendered="true"]
 * before snapshotting. `data-rendered` flips to "true" inside an effect that
 * fires after the lazy MDX child mounts.
 */
/**
 * Module-scoped cache: one `React.lazy` wrapper per (locale, slug).
 *
 * Without this, every SPA navigation between posts would re-call `lazy()`
 * during render. React sees a brand-new wrapper each time and re-throws
 * Suspense, flashing the skeleton even for a previously-loaded post.
 * With the cache, revisits are synchronous after the first load.
 */
const lazyCache = new Map<string, LazyExoticComponent<ComponentType>>();

function resolveLazy(
  key: string,
  loader: () => Promise<{ default: ComponentType }>,
): LazyExoticComponent<ComponentType> {
  const hit = lazyCache.get(key);
  if (hit) return hit;
  const fresh = lazy(loader);
  lazyCache.set(key, fresh);
  return fresh;
}

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { language, t, localize } = useLanguage();
  const entry = slug ? getPost(language, slug) : undefined;

  const MdxComponent = entry
    ? resolveLazy(`${language}:${slug}`, entry.load)
    : null;

  if (!entry || !MdxComponent) {
    // Stale link or tombstoned slug. Emit noindex meta so Google deindexes the
    // URL even if Vercel still serves a cached 200. Edge rewrites (see
    // tombstones) provide the canonical 301/permanent-redirect path.
    //
    // We inline the 404 body rather than import NotFound (static import would
    // defeat NotFound's lazy chunk from App.tsx).
    return (
      <>
        <SEO pageKey="notFound" noindex />
        <Navbar />
        <main className="min-h-screen pt-32 pb-24 px-6 md:px-10 flex items-center justify-center">
          <div className="max-w-[560px] text-center">
            <p className="text-xs uppercase tracking-widest text-accent-red mb-4">
              404
            </p>
            <h1 className="text-3xl md:text-4xl font-semibold mb-4">
              {t("notfound.subtitle")}
            </h1>
            <p className="text-muted-foreground mb-8">
              {t("blog.empty")}
            </p>
            <Link
              to={localize("/blog")}
              className="inline-flex items-center gap-2 text-sm font-medium text-accent-red hover:underline"
            >
              ← {t("nav.blog")}
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const canonical = SITE_URL + entry.meta.path;
  const hreflangs = hreflangLinksFor(entry.meta.path, entry.meta.hreflangPath);
  const breadcrumbItems = [
    { name: t("nav.home"), url: SITE_URL + (language === "fr" ? "/" : "/en") },
    {
      name: t("nav.blog"),
      url:
        SITE_URL + (language === "fr" ? "/blog" : "/en/blog"),
    },
    { name: entry.meta.title, url: canonical },
  ];
  const jsonLd = [
    articleJsonLd({
      headline: entry.meta.title,
      description: entry.meta.description,
      url: canonical,
      author: entry.meta.author,
      datePublished: entry.meta.date,
      image: entry.meta.ogImage,
    }),
    breadcrumbJsonLd(breadcrumbItems),
  ];

  return (
    <>
      <SEO
        meta={{
          title: `${entry.meta.title} | Fleuret`,
          description: entry.meta.description,
          canonical,
          hreflangs,
          ogImage: entry.meta.ogImage,
        }}
        jsonLd={jsonLd}
      />
      <Navbar />
      <Suspense fallback={<PostSkeleton />}>
        <PostArticle MdxComponent={MdxComponent} meta={entry.meta} />
      </Suspense>
      <Footer />
    </>
  );
};

function PostSkeleton() {
  return (
    <main className="min-h-[60vh] pt-32 pb-24 px-6 md:px-10">
      <div className="max-w-[720px] mx-auto animate-pulse">
        <div className="h-3 w-32 bg-muted rounded mb-6" />
        <div className="h-10 w-3/4 bg-muted rounded mb-4" />
        <div className="h-10 w-2/3 bg-muted rounded mb-10" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </div>
      </div>
    </main>
  );
}

function PostArticle({
  MdxComponent,
  meta,
}: {
  MdxComponent: ComponentType;
  meta: NonNullable<ReturnType<typeof getPost>>["meta"];
}) {
  const { t, localize } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const [rendered, setRendered] = useState(false);

  // Flip data-rendered only after MDX child has actually mounted and painted.
  // Prerender Puppeteer waits on this attribute.
  useEffect(() => {
    const id = requestAnimationFrame(() => setRendered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const shareUrl = encodeURIComponent(SITE_URL + meta.path);
  const shareTitle = encodeURIComponent(meta.title);
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;

  return (
    <main className="min-h-screen pt-32 pb-24 px-6 md:px-10">
      <article
        ref={ref}
        data-post-slug={meta.slug}
        data-rendered={rendered ? "true" : "false"}
        className="max-w-[720px] mx-auto"
      >
        <nav aria-label="Breadcrumb" className="mb-8 text-sm text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                to={localize("/")}
                className="hover:text-foreground transition-colors"
              >
                {t("nav.home")}
              </Link>
            </li>
            <li aria-hidden="true" className="text-accent-red">/</li>
            <li>
              <Link
                to={localize("/blog")}
                className="hover:text-foreground transition-colors"
              >
                {t("nav.blog")}
              </Link>
            </li>
            <li aria-hidden="true" className="text-accent-red">/</li>
            <li aria-current="page" className="text-foreground line-clamp-1">
              {meta.title}
            </li>
          </ol>
        </nav>

        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight">
            {meta.title}
          </h1>
          <PostMeta
            className="mt-6"
            date={meta.date}
            author={meta.author}
            readingTimeMinutes={meta.readingTimeMinutes}
          />
        </header>

        <hr className="mb-10 border-border/40" />

        <div className="prose prose-invert prose-red max-w-none prose-headings:font-semibold prose-h2:mt-14 prose-h2:text-3xl prose-h3:text-xl prose-p:leading-relaxed prose-blockquote:border-l-accent-red prose-blockquote:bg-card/40 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-sm prose-a:text-accent-red prose-a:no-underline hover:prose-a:underline prose-code:text-accent-red prose-code:bg-muted prose-code:rounded-sm prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-img:rounded-md">
          <MdxComponent />
        </div>

        <hr className="my-14 border-border/40" />

        <section aria-label={t("blog.share.label")} className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-muted-foreground">{t("blog.share.prompt")}</span>
          <a
            href={linkedInHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent-red text-white text-sm font-medium transition-transform hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
            </svg>
            {t("blog.share.linkedIn")}
          </a>
          <button
            type="button"
            onClick={() => {
              // Safari rejects writeText in some non-secure contexts; swallow
              // the promise rejection (no worse than a no-op for MVP).
              if (typeof navigator !== "undefined" && navigator.clipboard) {
                navigator.clipboard
                  .writeText(SITE_URL + meta.path)
                  .catch(() => {});
              }
            }}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-red focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-full px-3 py-2"
            aria-label={t("blog.share.copyLink")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M10 13a5 5 0 007.07 0l3-3a5 5 0 00-7.07-7.07l-1 1" />
              <path d="M14 11a5 5 0 00-7.07 0l-3 3a5 5 0 007.07 7.07l1-1" />
            </svg>
            {t("blog.share.copyLink")}
          </button>
        </section>
      </article>
    </main>
  );
}

export default BlogPost;
