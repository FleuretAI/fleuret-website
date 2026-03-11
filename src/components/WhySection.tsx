import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./motion/ScrollReveal";
import StaggerGroup from "./motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";
import ExposureIllustration from "./illustrations/ExposureIllustration";

const WhySection = () => {
  const { t } = useLanguage();

  const problems = [
    { number: "01", title: t("problem.delay.title"), description: t("problem.delay.desc"), color: "var(--accent-blue)" },
    { number: "02", title: t("problem.friction.title"), description: t("problem.friction.desc"), color: "var(--accent-violet)" },
    { number: "03", title: t("problem.cost.title"), description: t("problem.cost.desc"), color: "var(--accent-red)" },
  ];

  return (
    <section id="why" className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-start">
            <ScrollReveal>
              <div className="space-y-6 lg:sticky lg:top-32">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">
                  {t("problem.main.title")}{" "}
                  <span className="text-gradient-accent">{t("problem.main.broken")}</span>
                </h2>
                <p className="text-lg text-white/40 leading-relaxed max-w-md">
                  {t("problem.main.subtitle")}
                </p>

                {/* Exposure alert with animated illustration */}
                <div className="pt-2">
                  <div className="p-5 rounded-2xl border border-[var(--accent-red)]/15 bg-[var(--accent-red)]/[0.04]">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.span
                        className="w-2 h-2 rounded-full bg-[var(--accent-red)] shrink-0"
                        animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      />
                      <p className="text-[var(--accent-red)]/80 text-sm font-semibold uppercase tracking-wider">
                        {t("problem.exposure")}
                      </p>
                    </div>
                    <ExposureIllustration />
                  </div>
                </div>
              </div>
            </ScrollReveal>

            <StaggerGroup className="space-y-6">
              {problems.map((problem) => (
                <motion.div
                  key={problem.number}
                  variants={staggerItem}
                  className="group p-6 md:p-8 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300"
                >
                  <div className="flex gap-5">
                    <span
                      className="text-4xl font-bold font-sans transition-opacity group-hover:opacity-80"
                      style={{ color: problem.color, opacity: 0.4 }}
                    >
                      {problem.number}
                    </span>
                    <div className="space-y-2 pt-1">
                      <h3 className="text-xl font-semibold font-sans text-white">{problem.title}</h3>
                      <p className="text-white/40 leading-relaxed">{problem.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
