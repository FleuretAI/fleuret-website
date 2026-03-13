import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerGroup from "@/components/motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";

const values = [
  { icon: "⚡", key: "gsd", accent: "var(--accent-blue)" },
  { icon: "💡", key: "newIdeas", accent: "var(--accent-blue)" },
  { icon: "🎯", key: "outcomeFocused", accent: "var(--accent-violet)" },
  { icon: "🔒", key: "integrity", accent: "var(--accent-red)" },
] as const;

const perks = [
  { icon: "📈", key: "equity" },
  { icon: "💻", key: "equipment" },
  { icon: "🏠", key: "hybrid" },
  { icon: "💰", key: "salary" },
  { icon: "🏖️", key: "holidays" },
  { icon: "🏥", key: "healthcare" },
] as const;

const Careers = () => {
  const { t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-20">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
                {t("careers.hero.title")}{" "}
                <span className="text-gradient-accent">
                  {t("careers.hero.highlight")}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                {t("careers.hero.subtitle")}
              </p>
              <div className="pt-4">
                <a
                  href="mailto:careers@fleuret.ai"
                  className="inline-flex items-center justify-center rounded-full px-10 py-3.5 text-base font-medium text-white transition-all hover:opacity-90 hover:shadow-[0_0_30px_rgba(79,143,255,0.3)]"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
                  }}
                >
                  {t("careers.hero.cta")}
                </a>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Why join us — Perks */}
        <section className="container mx-auto px-4 mb-24">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                {t("careers.perks.title")}
              </h2>
            </ScrollReveal>

            <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {perks.map((perk) => (
                <motion.div
                  key={perk.key}
                  variants={staggerItem}
                  className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300 text-center"
                >
                  <span className="text-3xl mb-3 block">{perk.icon}</span>
                  <p className="text-sm font-medium text-white/70">
                    {t(`careers.perks.${perk.key}`)}
                  </p>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* Values */}
        <section className="section-elevated grid-fade py-16 md:py-24 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <ScrollReveal>
                <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
                  {t("careers.values.title")}
                </h2>
              </ScrollReveal>

              <StaggerGroup className="grid md:grid-cols-2 gap-5">
                {values.map((value) => (
                  <motion.div
                    key={value.key}
                    variants={staggerItem}
                    className="p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{value.icon}</span>
                        <h3
                          className="text-lg font-bold"
                          style={{ color: value.accent }}
                        >
                          {t(`careers.values.${value.key}.title`)}
                        </h3>
                      </div>
                      <p className="text-white/40 leading-relaxed text-sm">
                        {t(`careers.values.${value.key}.desc`)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </StaggerGroup>
            </div>
          </div>
        </section>

        {/* Open positions */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
                {t("careers.positions.title")}
              </h2>
              <p className="text-center text-white/40 mb-12">
                {t("careers.positions.subtitle")}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="p-8 rounded-2xl border border-white/8 bg-white/[0.02] text-center">
                <p className="text-white/50 mb-4">
                  {t("careers.positions.empty")}
                </p>
                <a
                  href="mailto:careers@fleuret.ai"
                  className="text-[var(--accent-blue)] hover:underline text-sm font-medium"
                >
                  {t("careers.positions.spontaneous")}
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Back link */}
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/"
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
