import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./motion/ScrollReveal";

const CTASection = () => {
  const { t } = useLanguage();

  return (
    <section className="grid-fade relative py-24 md:py-32 overflow-hidden">
      {/* Colored ambient glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(79,143,255,0.06),transparent_70%)]" />
        <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[400px] bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.05),transparent_70%)]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <ScrollReveal>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              <span className="text-gradient-accent">{t("cta.title")}</span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <p className="text-lg text-white/40 max-w-xl mx-auto leading-relaxed">
              {t("cta.subtitle")}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex justify-center pt-4">
              <a
                href="#pricing"
                className="inline-flex items-center justify-center px-10 py-4 text-lg font-medium rounded-full text-white transition-all hover:shadow-[0_0_30px_rgba(79,143,255,0.3)] hover:scale-[1.03] active:scale-[0.97]"
                style={{
                  background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
                }}
              >
                {t("cta.button")}
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
