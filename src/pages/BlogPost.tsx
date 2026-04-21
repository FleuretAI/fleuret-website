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
 * BlogPost is EAGER-imported from App.tsx (see design doc premise #10):
 * prerender Puppeteer otherwise captures an empty Suspense frame before
 * the lazy chunk resolves and ships blank HTML. Inside this component,
 * the MDX component is lazy-loaded per slug (registry entries expose
 * `load: () => import(...)`), so the main bundle stays flat regardless
 * of post count.
 *
 * Typography: header + meta row follow About.tsx / Careers.tsx — font-light
 * H1 with gradient highlight, white/50 subtitle, container-based spacing.
 * Prose body uses `font-sans` (Lufga) with a minimal accent color set so
 * the article reads as part of the site, not a bolted-on blog.
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
    // Stale link or tombstoned slug. Emit noindex meta so Google deindexes
    // the URL even if Vercel still serves a cached 200. We inline the 404
    // body rather than importing NotFound (a static import would defeat
    // NotFound's lazy chunk from App.tsx).
    return (
      <>
        <SEO pageKey="notFound" noindex />
        <Navbar />
        <main
          id="main-content"
          className="pt-32 pb-20 min-h-[60vh] flex items-center justify-center"
        >
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-xl mx-auto space-y-6">
              <p className="text-xs uppercase tracking-widest text-white/40">
                404
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-tight text-white leading-[1.1]">
                {t("notfound.subtitle")}
              </h1>
              <p className="text-lg font-light text-white/50 leading-relaxed">
                {t("blog.empty")}
              </p>
              <Link
                to={localize("/blog")}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/75 hover:text-white transition-colors"
              >
                <span aria-hidden="true">←</span> {t("nav.blog")}
              </Link>
            </div>
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
      url: SITE_URL + (language === "fr" ? "/blog" : "/en/blog"),
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
    <main id="main-content" className="pt-32 pb-20 min-h-[60vh]">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto animate-pulse">
          <div className="h-3 w-32 bg-white/5 rounded mb-6" />
          <div className="h-12 w-3/4 bg-white/5 rounded mb-4" />
          <div className="h-12 w-2/3 bg-white/5 rounded mb-10" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-5/6 bg-white/5 rounded" />
            <div className="h-4 w-4/6 bg-white/5 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-3/4 bg-white/5 rounded" />
            <div className="h-4 w-full bg-white/5 rounded" />
            <div className="h-4 w-5/6 bg-white/5 rounded" />
          </div>
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
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`;

  return (
    <main id="main-content" className="pt-32 pb-20">
      <article
        ref={ref}
        data-post-slug={meta.slug}
        data-rendered={rendered ? "true" : "false"}
        className="container mx-auto px-4"
      >
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="max-w-3xl mx-auto mb-8 text-sm font-light text-white/50"
        >
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link
                to={localize("/")}
                className="hover:text-white transition-colors"
              >
                {t("nav.home")}
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/20">/</li>
            <li>
              <Link
                to={localize("/blog")}
                className="hover:text-white transition-colors"
              >
                {t("nav.blog")}
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/20">/</li>
            <li aria-current="page" className="text-white/70 line-clamp-1">
              {meta.title}
            </li>
          </ol>
        </nav>

        {/* Header: font-light H1 to match About/Careers */}
        <header className="max-w-3xl mx-auto mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
            {meta.title}
          </h1>
          <PostMeta
            className="mt-6 justify-center"
            date={meta.date}
            author={meta.author}
            readingTimeMinutes={meta.readingTimeMinutes}
          />
        </header>

        <hr className="max-w-3xl mx-auto mb-10 border-white/10" />

        {/* Article body */}
        <div className="max-w-3xl mx-auto prose prose-invert font-sans prose-headings:font-light prose-headings:font-sans prose-headings:text-white prose-h2:mt-14 prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-lg md:prose-h3:text-xl prose-p:font-light prose-p:leading-relaxed prose-p:text-white/75 prose-li:font-light prose-li:text-white/75 prose-strong:text-white prose-strong:font-medium prose-blockquote:border-l-[color:var(--accent-blue)] prose-blockquote:bg-white/[0.02] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-sm prose-blockquote:font-light prose-blockquote:text-white/80 prose-a:text-[color:var(--accent-blue)] prose-a:no-underline hover:prose-a:underline prose-code:text-[color:var(--accent-blue)] prose-code:bg-white/[0.05] prose-code:rounded-sm prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-img:rounded-md max-w-none">
          <MdxComponent />
        </div>

        <hr className="max-w-3xl mx-auto my-14 border-white/10" />

        {/* Share */}
        <section
          aria-label={t("blog.share.label")}
          className="max-w-3xl mx-auto flex flex-wrap items-center gap-4"
        >
          <span className="text-sm font-light text-white/60">
            {t("blog.share.prompt")}
          </span>
          <a
            href={linkedInHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-cta btn-cta--sm"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
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
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-light text-white/60 border border-white/10 transition-colors hover:text-white hover:border-white/20 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={t("blog.share.copyLink")}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
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
