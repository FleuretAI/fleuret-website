import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerGroup from "@/components/motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";
import { SEO } from "@/seo/SEO";
import { trackCTAClick } from "@/lib/gtag";

const buildCards = [
  { key: "card1", accent: "var(--accent-blue)" },
  { key: "card2", accent: "var(--accent-violet)" },
  { key: "card3", accent: "var(--accent-red)" },
  { key: "card4", accent: "var(--accent-blue)" },
] as const;

const positions = [
  { key: "role1", subject: "AI Engineer", accent: "var(--accent-blue)" },
  { key: "role2", subject: "Offensive Sec Eng", accent: "var(--accent-violet)" },
  { key: "role3", subject: "Founding Eng", accent: "var(--accent-red)" },
] as const;

const EMAIL = "yanis@fleuret.ai";

const Careers = () => {
  const { t, localize } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const mailtoFor = (subject: string) =>
    `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;

  return (
    <div className="min-h-screen">
      <SEO pageKey="careers" />
      <Navbar />
      <main id="main-content" className="pt-40 md:pt-48 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-24">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-light tracking-tight text-white leading-[1.1]">
                {t("careers.hero.title")}{" "}
                <span className="text-gradient-accent">
                  {t("careers.hero.highlight")}
                </span>
              </h1>
              <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                {t("careers.hero.subtitle")}
              </p>
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={mailtoFor("Fleuret careers")}
                  className="btn-cta btn-cta--lg"
                  onClick={() =>
                    trackCTAClick({
                      location: "careers_hero",
                      label: "apply_mailto",
                      destination: "mailto:yanis@fleuret.ai",
                    })
                  }
                >
                  {t("careers.hero.cta")}
                </a>
                <a
                  href="#emile"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {t("careers.hero.ctaSecondary")}
                </a>
              </div>
              <p className="text-xs text-white/40 pt-1">
                {t("careers.hero.email")}
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* What you'll build */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-12">
                {t("careers.build.title")}
              </h2>
            </ScrollReveal>

            <StaggerGroup className="grid md:grid-cols-2 gap-5">
              {buildCards.map((card) => (
                <motion.div
                  key={card.key}
                  variants={staggerItem}
                  className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-medium"
                      style={{ color: card.accent }}
                    >
                      {t(`careers.build.${card.key}.title`)}
                    </h3>
                    <p className="text-white/70 leading-relaxed text-sm">
                      {t(`careers.build.${card.key}.desc`)}
                    </p>
                    <p className="text-white/40 leading-relaxed text-xs pt-2 border-t border-white/8">
                      {t(`careers.build.${card.key}.stack`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* How Émile works */}
        <section
          id="emile"
          className="section-elevated grid-fade py-16 md:py-24 relative scroll-mt-24"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-10">
                  {t("careers.emile.title")}
                </h2>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="space-y-5 text-white/70 leading-relaxed">
                  <p>{t("careers.emile.p1")}</p>
                  <p>{t("careers.emile.p2")}</p>
                  <p>{t("careers.emile.p3")}</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Open positions */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-3">
                {t("careers.positions.title")}
              </h2>
              <p className="text-center text-white/40 mb-12 text-sm">
                {t("careers.positions.subtitle")}
              </p>
            </ScrollReveal>

            <StaggerGroup className="space-y-4 mb-10">
              {positions.map((position) => (
                <motion.div
                  key={position.key}
                  variants={staggerItem}
                  className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <h3
                      className="text-lg font-medium"
                      style={{ color: position.accent }}
                    >
                      {t(`careers.positions.${position.key}.title`)}
                    </h3>
                    <p className="text-white/70 leading-relaxed text-sm">
                      {t(`careers.positions.${position.key}.desc`)}
                    </p>
                    <p className="text-white/40 leading-relaxed text-xs">
                      {t(`careers.positions.${position.key}.background`)}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      <a
                        href={mailtoFor(position.subject)}
                        className="inline-flex items-center text-sm font-medium hover:underline min-h-[44px] py-2 -my-2"
                        style={{ color: position.accent }}
                      >
                        {t("careers.positions.applyLabel")} ({position.subject})
                        &nbsp;&rarr;
                      </a>
                      <span className="text-xs text-white/40">{EMAIL}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </StaggerGroup>

            <ScrollReveal delay={0.1}>
              <p className="text-xs text-white/50 leading-relaxed text-center max-w-2xl mx-auto">
                {t("careers.positions.process")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* Back link */}
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              to={localize("/")}
              className="text-[var(--accent-blue)] hover:underline text-sm"
            >
              &larr; {t("careers.back")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Careers;
