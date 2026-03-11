import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./motion/ScrollReveal";
import StaggerGroup from "./motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";

const Benchmark = () => {
  const { t } = useLanguage();

  const features = [
    { title: t("platform.asm.title"), desc: t("platform.asm.desc"), color: "var(--accent-blue)" },
    { title: t("platform.pentest.title"), desc: t("platform.pentest.desc"), color: "var(--accent-violet)" },
    { title: t("platform.scanners.title"), desc: t("platform.scanners.desc"), color: "var(--accent-blue)" },
    { title: t("platform.reports.title"), desc: t("platform.reports.desc"), color: "var(--accent-violet)" },
  ];

  return (
    <section id="platform" className="section-elevated grid-fade relative py-24 md:py-32 overflow-hidden">
      {/* Colored radial accent */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_top_right,rgba(139,92,246,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_left,rgba(79,143,255,0.04),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                <span className="text-white">{t("platform.main.title")}</span>{" "}
                <span className="text-gradient-accent">{t("platform.main.highlight")}</span>
              </h2>
              <p className="text-lg text-white/40 leading-relaxed max-w-2xl mx-auto">
                {t("platform.main.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <StaggerGroup className="grid md:grid-cols-2 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                className="group p-6 md:p-8 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] transition"
              >
                <span
                  className="text-3xl font-bold font-sans block mb-4 transition-opacity group-hover:opacity-70"
                  style={{ color: feature.color, opacity: 0.3 }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-white font-semibold font-sans mb-2">{feature.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </StaggerGroup>
        </div>
      </div>
    </section>
  );
};

export default Benchmark;
