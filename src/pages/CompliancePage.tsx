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
import { SEO, articleJsonLd, breadcrumbJsonLd, faqPageJsonLd } from "@/seo/SEO";
import { SITE_URL } from "@/seo/routes";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getCompliancePost } from "@/content/posts.generated";
import { PostMeta } from "@/components/blog/PostMeta";
import { PostAiSummarize } from "@/components/blog/PostAiSummarize";
import { getFramework } from "@/content/compliance/frameworks";
import { getIndustry } from "@/content/compliance/industries";
import { DEMO_ROUTE } from "@/lib/routes";
import { trackCTAClick } from "@/lib/gtag";

/**
 * CompliancePage renders pSEO entries at /compliance/{framework}/{industry}.
 *
 * Mirrors BlogPost.tsx (eager-imported from App.tsx so prerender does not
 * capture an empty Suspense frame). Internal differences vs blog:
 *  - URL resolves via useParams<{framework, industry}>(), not slug
 *  - Breadcrumb adds Framework + Industry levels
 *  - JSON-LD always emits Article + BreadcrumbList; FAQPage conditional on
 *    presence of faqs[] in frontmatter (per eng-review A5 rule)
 *  - Kill switch: VITE_COMPLIANCE_NOINDEX=true flips noindex meta here and
 *    drops the entries from sitemap.xml in scripts/build-sitemap.ts (same
 *    env var, read at build time). Keep both in lockstep.
 *
 * Duplication with BlogPost.tsx is intentional. Refactor into a shared
 * <PostShell> component is queued as a follow-up TODO so this PR stays
 * scoped.
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

const NOINDEX_FLAG = import.meta.env.VITE_COMPLIANCE_NOINDEX === "true";

const CompliancePage = () => {
  const { framework, industry } = useParams<{
    framework: string;
    industry: string;
  }>();
  const { t, localize } = useLanguage();

  const frameworkProfile = framework ? getFramework(framework) : undefined;
  const industryProfile = industry ? getIndustry(industry) : undefined;
  const entry =
    framework && industry ? getCompliancePost(framework, industry) : undefined;

  const MdxComponent = entry
    ? resolveLazy(`compliance:${framework}:${industry}`, entry.load)
    : null;

  if (!entry || !MdxComponent || !frameworkProfile || !industryProfile) {
    return (
      <>
        <SEO pageKey="notFound" noindex />
        <Navbar />
        <main
          id="main-content"
          className="pt-40 md:pt-48 pb-20 min-h-[60vh] flex items-center justify-center"
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
                This compliance combination does not exist yet.
              </p>
              <Link
                to={localize("/")}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/75 hover:text-white transition-colors"
              >
                <span aria-hidden="true">&larr;</span> {t("nav.home")}
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const canonical = SITE_URL + entry.meta.path;
  const breadcrumbItems = [
    { name: t("nav.home"), url: SITE_URL + "/" },
    { name: "Compliance", url: SITE_URL + "/compliance" },
    {
      name: frameworkProfile.displayName,
      url: SITE_URL + `/compliance/${frameworkProfile.slug}`,
    },
    { name: industryProfile.displayName, url: canonical },
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
  if (entry.meta.faqs && entry.meta.faqs.length > 0) {
    jsonLd.push(faqPageJsonLd(entry.meta.faqs));
  }

  return (
    <>
      <SEO
        meta={{
          title: `${entry.meta.title} | Fleuret`,
          description: entry.meta.description,
          canonical,
          hreflangs: [],
          ogImage: entry.meta.ogImage,
        }}
        jsonLd={jsonLd}
        noindex={NOINDEX_FLAG}
      />
      <Navbar />
      <Suspense fallback={<CompliancePageSkeleton />}>
        <ComplianceArticle
          MdxComponent={MdxComponent}
          meta={entry.meta}
          frameworkDisplay={frameworkProfile.displayName}
          industryDisplay={industryProfile.displayName}
        />
      </Suspense>
      <Footer />
    </>
  );
};

function CompliancePageSkeleton() {
  return (
    <main id="main-content" className="pt-40 md:pt-48 pb-20 min-h-[60vh]">
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

function ComplianceArticle({
  MdxComponent,
  meta,
  frameworkDisplay,
  industryDisplay,
}: {
  MdxComponent: ComponentType;
  meta: NonNullable<ReturnType<typeof getCompliancePost>>["meta"];
  frameworkDisplay: string;
  industryDisplay: string;
}) {
  const { t, localize } = useLanguage();
  const ref = useRef<HTMLElement>(null);
  const [rendered, setRendered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setRendered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <main id="main-content" className="pt-40 md:pt-48 pb-20">
      <article
        ref={ref}
        data-compliance-framework={meta.framework}
        data-compliance-industry={meta.industry}
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
                to={localize("/compliance")}
                className="text-white/60 hover:text-white transition-colors"
              >
                Compliance
              </Link>
            </li>
            <li aria-hidden="true" className="text-white/20">/</li>
            <li className="text-white/60">{frameworkDisplay}</li>
            <li aria-hidden="true" className="text-white/20">/</li>
            <li aria-current="page" className="text-white/70 line-clamp-1">
              {industryDisplay}
            </li>
          </ol>
        </nav>

        {/* Header */}
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

        {/* TL;DR — same AI-summarize affordance as blog */}
        <PostAiSummarize
          className="max-w-3xl mx-auto mb-10"
          title={meta.title}
          path={meta.path}
        />

        <hr className="max-w-3xl mx-auto mb-10 border-white/10" />

        {/* Article body */}
        <div className="max-w-3xl mx-auto prose prose-invert font-sans prose-headings:font-light prose-headings:font-sans prose-headings:text-white prose-h2:mt-14 prose-h2:text-2xl md:prose-h2:text-3xl prose-h3:text-lg md:prose-h3:text-xl prose-p:font-light prose-p:leading-relaxed prose-p:text-white/75 prose-li:font-light prose-li:text-white/75 prose-strong:text-white prose-strong:font-medium prose-blockquote:border-l-[color:var(--accent-blue)] prose-blockquote:bg-white/[0.02] prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-sm prose-blockquote:font-light prose-blockquote:text-white/80 prose-a:text-[color:var(--accent-blue)] prose-a:no-underline hover:prose-a:underline prose-code:text-[color:var(--accent-blue)] prose-code:bg-white/[0.05] prose-code:rounded-sm prose-code:px-1 prose-code:py-0.5 prose-code:before:content-none prose-code:after:content-none prose-pre:overflow-x-auto prose-pre:max-w-full prose-img:rounded-md prose-img:max-w-full max-w-none [&_table]:block [&_table]:overflow-x-auto [&_table]:max-w-full [&_code]:break-words [&_a]:break-words">
          <MdxComponent />
        </div>

        <hr className="max-w-3xl mx-auto my-14 border-white/10" />

        {/* CTA */}
        <section className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <span className="text-sm font-light text-white/60">
            Ready to scope your {frameworkDisplay} pentest programme?
          </span>
          <Link
            to={localize(DEMO_ROUTE)}
            className="btn-cta btn-cta--sm"
            onClick={() =>
              trackCTAClick({
                location: "compliance_footer",
                label: "get_demo",
                destination: DEMO_ROUTE,
              })
            }
          >
            Book a demo
          </Link>
        </section>
      </article>
    </main>
  );
}

export default CompliancePage;
