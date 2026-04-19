import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerGroup from "@/components/motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";
import { DEMO_ROUTE } from "@/lib/routes";
import { SEO } from "@/seo/SEO";

const TOTAL_SPOTS = 5;
const SPOTS_FILLED = 0; // EDIT: update as partners sign

const benefits = [
  { icon: "💸", key: "discount", accent: "var(--accent-blue)" },
  { icon: "📞", key: "founders", accent: "var(--accent-violet)" },
  { icon: "🗺️", key: "roadmap", accent: "var(--accent-blue)" },
  { icon: "⚡", key: "firstAccess", accent: "var(--accent-violet)" },
  { icon: "📣", key: "caseStudy", accent: "var(--accent-red)" },
] as const;

const commitments = [
  { icon: "💬", key: "feedback" },
  { icon: "🎯", key: "launch" },
  { icon: "🤝", key: "reference" },
] as const;

const qualifyItems = ["qualifyGeo", "qualifyIndustry", "qualifySize", "qualifyCompliance", "qualifyTeam"] as const;
const faqs = ["q1", "q2", "q3", "q4"] as const;

const DesignPartners = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const spotsRemaining = TOTAL_SPOTS - SPOTS_FILLED;

  return (
    <div className="min-h-screen">
      <SEO pageKey="designPartners" />
      <Navbar />
      <main id="main-content" className="pt-32 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-6">
              {/* Program badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--accent-blue)]/25 bg-[var(--accent-blue)]/[0.08] backdrop-blur">
                <span
                  className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full text-white"
                  style={{ background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))" }}
                >
                  {t("designPartners.hero.badge.label")}
                </span>
                <span className="text-xs text-white/70">
                  {t("designPartners.hero.badge.text").replace("{remaining}", String(spotsRemaining))}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
                {t("designPartners.hero.title")}{" "}
                <span className="text-gradient-accent">
                  {t("designPartners.hero.highlight")}
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto leading-relaxed">
                {t("designPartners.hero.subtitle")}
              </p>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  to={DEMO_ROUTE}
                  className="inline-flex items-center justify-center rounded-full px-10 py-3.5 text-base font-medium text-white transition-all hover:opacity-90 hover:shadow-[0_0_30px_rgba(79,143,255,0.3)]"
                  style={{ background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))" }}
                >
                  {t("designPartners.hero.cta")}
                </Link>
                <a
                  href="#what-you-get"
                  className="text-sm text-white/70 hover:text-white underline-offset-4 hover:underline transition-colors"
                >
                  {t("designPartners.hero.cta.secondary")}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Benefits */}
        <section id="what-you-get" className="container mx-auto px-4 mb-24">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-3">
                {t("designPartners.benefits.title")}
              </h2>
              <p className="text-center text-white/50 mb-12 max-w-2xl mx-auto">
                {t("designPartners.benefits.subtitle")}
              </p>
            </ScrollReveal>

            <StaggerGroup className="grid md:grid-cols-2 gap-5">
              {benefits.map((b) => (
                <motion.div
                  key={b.key}
                  variants={staggerItem}
                  className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl" aria-hidden="true">{b.icon}</span>
                      <h3 className="text-lg font-medium" style={{ color: b.accent }}>
                        {t(`designPartners.benefits.${b.key}.title`)}
                      </h3>
                    </div>
                    <p className="text-white/60 leading-relaxed text-sm">
                      {t(`designPartners.benefits.${b.key}.desc`)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* Commitments */}
        <section className="section-elevated grid-fade py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-3">
                  {t("designPartners.commitments.title")}
                </h2>
                <p className="text-center text-white/50 mb-12 max-w-2xl mx-auto">
                  {t("designPartners.commitments.subtitle")}
                </p>
              </ScrollReveal>

              <StaggerGroup className="grid md:grid-cols-3 gap-5">
                {commitments.map((c) => (
                  <motion.div
                    key={c.key}
                    variants={staggerItem}
                    className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] text-center"
                  >
                    <span className="text-3xl mb-3 block" aria-hidden="true">{c.icon}</span>
                    <h3 className="text-base font-medium text-white mb-2">
                      {t(`designPartners.commitments.${c.key}.title`)}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      {t(`designPartners.commitments.${c.key}.desc`)}
                    </p>
                  </motion.div>
                ))}
              </StaggerGroup>
            </div>
          </div>
        </section>

        {/* Who qualifies */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-10">
                {t("designPartners.qualify.title")}
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <ul className="space-y-3">
                {qualifyItems.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-white/75 leading-relaxed">
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))" }}
                      aria-hidden="true"
                    />
                    <span>{t(`designPartners.qualify.${item}`)}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        {/* FAQ */}
        <section className="section-elevated py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-12">
                  {t("designPartners.faq.title")}
                </h2>
              </ScrollReveal>

              <div className="space-y-4">
                {faqs.map((q, i) => (
                  <ScrollReveal key={q} delay={i * 0.08}>
                    <div className="p-5 md:p-6 rounded-2xl border border-white/8 bg-white/[0.02]">
                      <h3 className="text-base font-medium text-white mb-2">
                        {t(`designPartners.faq.${q}.question`)}
                      </h3>
                      <p className="text-white/60 text-sm leading-relaxed">
                        {t(`designPartners.faq.${q}.answer`)}
                      </p>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="container mx-auto px-4 py-16 md:py-24 text-center">
          <ScrollReveal>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-white/50">
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ background: "var(--accent-blue)" }}
                  aria-hidden="true"
                />
                {t("designPartners.finalCta.spots").replace("{remaining}", String(spotsRemaining)).replace("{total}", String(TOTAL_SPOTS))}
              </div>

              <h2 className="text-3xl md:text-4xl font-light text-white">
                {t("designPartners.finalCta.title")}
              </h2>
              <p className="text-white/60 text-lg">
                {t("designPartners.finalCta.subtitle")}
              </p>

              <div className="pt-2">
                <Link
                  to={DEMO_ROUTE}
                  className="inline-flex items-center justify-center rounded-full px-10 py-3.5 text-base font-medium text-white transition-all hover:opacity-90 hover:shadow-[0_0_30px_rgba(79,143,255,0.3)]"
                  style={{ background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))" }}
                >
                  {t("designPartners.finalCta.cta")}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Back link */}
        <div className="container mx-auto px-4 mt-8">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/"
              className="text-[var(--accent-blue)] hover:underline text-sm"
            >
              &larr; {t("designPartners.back")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DesignPartners;
