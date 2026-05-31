import { Link } from "react-router-dom";
import { SEO, breadcrumbJsonLd } from "@/seo/SEO";
import { SITE_URL } from "@/seo/routes";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/motion/ScrollReveal";
import { listCompliancePosts } from "@/content/posts.generated";
import { FRAMEWORKS, type FrameworkSlug } from "@/content/compliance/frameworks";
import { PrerenderMarker } from "@/components/PrerenderMarker";

/**
 * /compliance — hub index for pSEO compliance × industry pages. Groups
 * shipped MDX entries by framework so the internal link graph has a
 * single hub the breadcrumb on every CompliancePage can resolve to.
 *
 * The page is data-driven from listCompliancePosts() so new MDX files
 * land here automatically when build-post-registry regenerates.
 */
const ComplianceIndex = () => {
  const { t, localize } = useLanguage();
  const posts = listCompliancePosts();

  const byFramework = new Map<FrameworkSlug, typeof posts>();
  for (const p of posts) {
    const fw = p.framework as FrameworkSlug | undefined;
    if (!fw) continue;
    if (!byFramework.has(fw)) byFramework.set(fw, []);
    byFramework.get(fw)!.push(p);
  }

  const canonical = SITE_URL + "/compliance";
  const breadcrumb = [
    { name: t("nav.home"), url: SITE_URL + "/" },
    { name: "Compliance", url: canonical },
  ];
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Compliance pentest guides",
    itemListElement: posts.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: p.title,
      url: SITE_URL + p.path,
    })),
  };

  return (
    <>
      <SEO
        pageKey="compliance"
        jsonLd={[breadcrumbJsonLd(breadcrumb), itemListJsonLd]}
      />
      {/* PrerenderMarker flips data-compliance-index-rendered on <html> after
          this lazy chunk mounts. scripts/prerender.mjs waits for it before
          snapshotting; without it Puppeteer captures the App-level Suspense
          fallback (Navbar + Footer only, zero compliance/* links). The 15
          pSEO sub-pages then receive zero PageRank from the hub. */}
      <PrerenderMarker flag="complianceIndexRendered" />
      <Navbar />
      <main id="main-content" className="pt-40 md:pt-48 pb-20">
        <section className="container mx-auto px-4 text-center mb-16 md:mb-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-6">
              <p className="text-xs uppercase tracking-widest text-white/40">
                Compliance pentest
              </p>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.1]">
                <span className="text-gradient-accent">
                  Pentest scoping by framework and industry
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                Practical guides for CISOs scoping penetration testing under
                DORA, NIS2, ISO 27001, SOC 2 and PCI DSS. Each guide focuses
                on a single regulator citation and a single industry, with
                concrete examples and an honest fit assessment.
              </p>
            </div>
          </ScrollReveal>
        </section>

        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-3xl mx-auto space-y-14">
            {Array.from(byFramework.entries()).map(([slug, entries]) => {
              const profile = FRAMEWORKS[slug];
              return (
                <div key={slug}>
                  <header className="mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-2xl md:text-3xl font-light text-white">
                      {profile.displayName}
                    </h2>
                    <p className="mt-2 text-sm font-light text-white/50">
                      {profile.fullName}
                    </p>
                  </header>
                  <ul className="space-y-4">
                    {entries.map((p) => (
                      <li key={p.path}>
                        <Link
                          to={localize(p.path)}
                          className="group block py-3 transition-colors"
                        >
                          <div className="text-base md:text-lg font-light text-white group-hover:text-[color:var(--accent-blue)] transition-colors">
                            {p.title}
                          </div>
                          <div className="mt-1 text-sm font-light text-white/50 line-clamp-2">
                            {p.description}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            {posts.length === 0 && (
              <p className="py-12 text-center font-light text-white/50">
                Compliance guides launching soon.
              </p>
            )}
          </div>
        </section>

        <section className="container mx-auto px-4 pb-12">
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <span className="text-sm font-light text-white/60">
              Need pentest scoping for a framework or industry not listed?
            </span>
            <Link to={localize("/demo")} className="btn-cta btn-cta--sm">
              Book a demo
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ComplianceIndex;
