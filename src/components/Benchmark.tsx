import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./motion/ScrollReveal";
import StaggerGroup from "./motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";

const Benchmark = () => {
  const { t } = useLanguage();

  const metrics = [
    { label: t("benchmark.exploitation.label"), description: t("benchmark.exploitation.description"), color: "var(--accent-blue)" },
    { label: t("benchmark.rapidite.label"), description: t("benchmark.rapidite.description"), color: "var(--accent-violet)" },
    { label: t("benchmark.validation.label"), description: t("benchmark.validation.description"), color: "var(--accent-blue)" },
    { label: t("benchmark.efficacite.label"), description: t("benchmark.efficacite.description"), color: "var(--accent-violet)" },
  ];

  return (
    <section className="section-elevated grid-fade relative py-24 md:py-32 overflow-hidden">
      {/* Colored radial accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(79,143,255,0.04),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollReveal>
              <div className="space-y-6">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                  {t("benchmark.title.main")}
                </h2>
                <p className="text-sm uppercase tracking-widest text-gradient-accent font-semibold">
                  {t("benchmark.subtitle.main")}
                </p>
                <p className="text-lg text-white/40 leading-relaxed">
                  {t("benchmark.description")}
                </p>
              </div>
            </ScrollReveal>

            <StaggerGroup className="space-y-4">
              {metrics.map((metric, i) => (
                <motion.div
                  key={metric.label}
                  variants={staggerItem}
                  className="group flex gap-5 p-5 rounded-xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300"
                >
                  <span
                    className="text-3xl font-bold font-sans shrink-0 transition-opacity group-hover:opacity-70"
                    style={{ color: metric.color, opacity: 0.3 }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="space-y-1">
                    <h3 className="text-white font-semibold font-sans">{metric.label}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{metric.description}</p>
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

export default Benchmark;
