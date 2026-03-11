import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./motion/ScrollReveal";
import StaggerGroup from "./motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";

const complianceFrameworks = [
  { key: "nis2", accent: "var(--accent-blue)" },
  { key: "iso", accent: "var(--accent-violet)" },
  { key: "soc2", accent: "var(--accent-red)" },
  { key: "dora", accent: "var(--accent-blue)" },
] as const;

const ComplianceSection = () => {
  const { t } = useLanguage();

  return (
    <section id="compliance" className="section-elevated bg-grid-pattern grid-fade py-16 md:py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center space-y-4 mb-10 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">
                {t("compliance.title")}{" "}
                <span className="text-gradient-accent">
                  {t("compliance.highlight")}
                </span>
              </h2>
              <p className="text-lg text-white/40 leading-relaxed max-w-2xl mx-auto">
                {t("compliance.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          {/* 2x2 Grid */}
          <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {complianceFrameworks.map((framework) => (
              <motion.div
                key={framework.key}
                variants={staggerItem}
                className="group p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300"
              >
                <div className="space-y-3">
                  <h3
                    className="text-2xl md:text-3xl font-bold tracking-tight"
                    style={{ color: framework.accent }}
                  >
                    {t(`compliance.${framework.key}.title`)}
                  </h3>
                  <p className="text-white/40 leading-relaxed text-sm md:text-base">
                    {t(`compliance.${framework.key}.desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </StaggerGroup>

          {/* Sovereignty note */}
          <ScrollReveal delay={0.3}>
            <div className="mt-12 flex items-center justify-center gap-2.5 text-white/30 text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 text-white/25 shrink-0"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              <span>{t("compliance.sovereignty")}</span>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default ComplianceSection;
