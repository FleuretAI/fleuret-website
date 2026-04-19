import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerGroup from "@/components/motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";
import { SEO } from "@/seo/SEO";
import { CohortCountdown } from "@/components/designPartners/CohortCountdown";
import { ApplyForm } from "@/components/designPartners/ApplyForm";
import { useSlots } from "@/lib/useSlots";
import {
  DP_COHORT_VISIBLE,
  DP_PENTESTS_INCLUDED,
  DP_PILOT_WEEKS,
  DP_PRICE_EUR,
  DP_TOTAL_SLOTS,
} from "@/lib/designPartnerConfig";

const timelineKeys = ["w1", "w2", "w3", "w4", "w5", "w6"] as const;
const qualifyKeys = [
  "qualifyGeo",
  "qualifyIndustry",
  "qualifySize",
  "qualifyCompliance",
  "qualifyTeam",
] as const;
const faqKeys = ["q1", "q2", "q3", "q4"] as const;

function formatPriceEur(v: number, lang: "fr" | "en") {
  return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(v);
}

const DesignPartners = () => {
  const { t, language, localize } = useLanguage();
  const slots = useSlots();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const remainingLabel =
    slots.remaining === 0
      ? t("designPartners.hero.full")
      : t("designPartners.hero.remaining")
          .replace("{remaining}", String(slots.remaining))
          .replace("{total}", String(slots.total));

  const priceLabel = formatPriceEur(DP_PRICE_EUR, language);

  return (
    <div className="min-h-screen">
      <SEO pageKey="designPartners" />
      <Navbar />
      <main id="main-content" className="pt-32 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[var(--accent-blue)]/25 bg-[var(--accent-blue)]/[0.08] backdrop-blur">
                <span
                  className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase px-2 py-0.5 rounded-full text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
                  }}
                >
                  {t("designPartners.hero.badge.label")}
                </span>
                <span
                  className="text-xs text-white/70"
                  aria-live="polite"
                  aria-atomic="true"
                >
                  {remainingLabel}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
                {t("designPartners.hero.title")}{" "}
                <span className="text-gradient-accent">
                  {t("designPartners.hero.highlight")}
                </span>
              </h1>

              <p className="text-base md:text-lg font-medium text-white/90">
                {t("designPartners.hero.offer")
                  .replace("{price}", priceLabel)
                  .replace("{pentests}", String(DP_PENTESTS_INCLUDED))
                  .replace("{weeks}", String(DP_PILOT_WEEKS))}
              </p>

              <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                {t("designPartners.hero.subtitle")}
              </p>

              {DP_COHORT_VISIBLE && (
                <div className="pt-2">
                  <CohortCountdown />
                </div>
              )}

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#apply"
                  className="inline-flex items-center justify-center rounded-full px-10 py-3.5 text-base font-medium text-white transition-all hover:opacity-90 hover:shadow-[0_0_30px_rgba(79,143,255,0.3)]"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
                  }}
                >
                  {slots.remaining === 0
                    ? t("designPartners.hero.ctaWaitlist")
                    : t("designPartners.hero.cta")}
                </a>
                <a
                  href="#timeline"
                  className="text-sm text-white/70 hover:text-white underline-offset-4 hover:underline transition-colors"
                >
                  {t("designPartners.hero.cta.secondary")}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Timeline — what you get, week by week */}
        <section
          id="timeline"
          className="section-elevated grid-fade py-16 md:py-24 relative"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-3">
                  {t("designPartners.timeline.title")}
                </h2>
                <p className="text-center text-white/50 mb-12 max-w-2xl mx-auto">
                  {t("designPartners.timeline.subtitle")}
                </p>
              </ScrollReveal>

              <StaggerGroup className="space-y-4 md:space-y-0 md:grid md:grid-cols-6 md:gap-3">
                {timelineKeys.map((k, i) => (
                  <motion.div
                    key={k}
                    variants={staggerItem}
                    className="p-4 md:p-5 rounded-2xl border border-white/8 bg-white/[0.02] relative"
                  >
                    <div className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[var(--accent-blue)] mb-2">
                      {t("designPartners.timeline.week").replace("{n}", String(i + 1))}
                    </div>
                    <h3 className="text-sm font-medium text-white mb-1.5 leading-snug">
                      {t(`designPartners.timeline.${k}.title`)}
                    </h3>
                    <p className="text-xs text-white/55 leading-relaxed">
                      {t(`designPartners.timeline.${k}.desc`)}
                    </p>
                  </motion.div>
                ))}
              </StaggerGroup>
            </div>
          </div>
        </section>

        {/* Proof — founder + audit-trail */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12 items-start">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-light text-white mb-3">
                {t("designPartners.proof.title")}
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                {t("designPartners.proof.founder")}
              </p>
              <p className="text-white/60 text-sm leading-relaxed">
                {t("designPartners.proof.methodology")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="p-5 rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="text-[0.65rem] font-semibold tracking-[0.12em] uppercase text-[var(--accent-violet)] mb-3">
                  {t("designPartners.proof.pipelineLabel")}
                </div>
                <ol className="space-y-2 text-sm text-white/75">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-blue)]">1.</span>
                    <span>{t("designPartners.proof.step1")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-blue)]">2.</span>
                    <span>{t("designPartners.proof.step2")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-blue)]">3.</span>
                    <span>{t("designPartners.proof.step3")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--accent-blue)]">4.</span>
                    <span>{t("designPartners.proof.step4")}</span>
                  </li>
                </ol>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Who qualifies */}
        <section className="container mx-auto px-4 py-10 md:py-16">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-light text-white text-center mb-8">
                {t("designPartners.qualify.title")}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <ul className="space-y-3">
                {qualifyKeys.map((k) => (
                  <li
                    key={k}
                    className="flex items-start gap-3 text-white/75 leading-relaxed"
                  >
                    <span
                      className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{
                        background:
                          "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
                      }}
                      aria-hidden="true"
                    />
                    <span>{t(`designPartners.qualify.${k}`)}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>
        </section>

        {/* Apply */}
        <section
          id="apply"
          className="section-elevated py-16 md:py-24 relative scroll-mt-24"
        >
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto space-y-6">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-3">
                  {slots.remaining === 0
                    ? t("designPartners.apply.waitlistTitle")
                    : t("designPartners.apply.title")}
                </h2>
                <p className="text-center text-white/55 mb-8">
                  {slots.remaining === 0
                    ? t("designPartners.apply.waitlistSubtitle")
                    : t("designPartners.apply.subtitle")}
                </p>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <ApplyForm />
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-10">
                {t("designPartners.faq.title")}
              </h2>
            </ScrollReveal>
            <div className="space-y-4">
              {faqKeys.map((q, i) => (
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
        </section>

        <div className="container mx-auto px-4 mt-8">
          <div className="max-w-3xl mx-auto">
            <Link
              to={localize("/")}
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

export const __config = { DP_TOTAL_SLOTS };
