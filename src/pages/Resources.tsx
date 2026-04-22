import { Link } from "react-router-dom";
import { SEO } from "@/seo/SEO";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/motion/ScrollReveal";

/**
 * /resources — hub page. Typography + container pattern mirrors About.tsx
 * and Careers.tsx so the Resources surface reads as part of the same site
 * instead of a bolted-on blog section:
 *
 *   - main: pt-32 pb-20
 *   - section: container mx-auto px-4 text-center mb-20
 *   - h1: text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight
 *   - gradient highlight via text-gradient-accent (blue -> violet -> red)
 *   - subtitle: text-lg md:text-xl text-white/50 max-w-2xl mx-auto
 *
 * Currently hosts a single "Blog" tile. No "Coming soon" stubs for future
 * content types: stale stubs erode trust more than missing tiles.
 */
const Resources = () => {
  const { t, localize } = useLanguage();
  return (
    <>
      <SEO pageKey="resources" />
      <Navbar />
      <main id="main-content" className="pt-40 md:pt-48 pb-20">
        <section className="container mx-auto px-4 text-center mb-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
                <span className="text-gradient-accent">
                  {t("resources.hero.title")}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                {t("resources.hero.subtitle")}
              </p>
            </div>
          </ScrollReveal>
        </section>

        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <Link
                to={localize("/blog")}
                className="group block rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10 transition-colors hover:border-white/20 hover:bg-white/[0.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-blue)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                <div className="text-xs uppercase tracking-widest text-white/40 mb-4">
                  {t("resources.blog.label")}
                </div>
                <h2 className="text-2xl md:text-3xl font-light text-white mb-3 leading-tight">
                  {t("resources.blog.title")}
                </h2>
                <p className="text-base md:text-lg font-light text-white/60 leading-relaxed mb-6 max-w-xl">
                  {t("resources.blog.description")}
                </p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/75 transition-transform group-hover:translate-x-1">
                  {t("resources.blog.cta")} <span aria-hidden="true">→</span>
                </span>
              </Link>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Resources;
