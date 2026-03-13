import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./motion/ScrollReveal";
import { slideInLeft, slideInRight } from "@/lib/animations";
import DeployIllustration from "./illustrations/DeployIllustration";
import AttackIllustration from "./illustrations/AttackIllustration";
import ExploitsIllustration from "./illustrations/ExploitsIllustration";
import type { ComponentType } from "react";

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps: {
    number: string;
    title: string;
    description: string;
    Illustration: ComponentType;
    color: string;
  }[] = [
    {
      number: "01",
      title: t("process.deploy.title"),
      description: t("process.deploy.desc"),
      Illustration: DeployIllustration,
      color: "var(--accent-blue)",
    },
    {
      number: "02",
      title: t("process.attack.title"),
      description: t("process.attack.desc"),
      Illustration: AttackIllustration,
      color: "var(--accent-red)",
    },
    {
      number: "03",
      title: t("process.exploits.title"),
      description: t("process.exploits.desc"),
      Illustration: ExploitsIllustration,
      color: "var(--accent-violet)",
    },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="text-center mb-12 md:mb-20 space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                {t("process.main.title")}{" "}
                <span className="text-gradient-accent">{t("process.main.works")}</span>
              </h2>
              <p className="text-lg text-white/40 max-w-xl mx-auto">
                {t("process.main.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="space-y-16 md:space-y-24 lg:space-y-32">
            {steps.map((step, i) => {
              const isEven = i % 2 === 0;
              return (
                <div
                  key={step.number}
                  className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
                >
                  <ScrollReveal
                    variants={isEven ? slideInLeft : slideInRight}
                    className={isEven ? "md:order-1" : "md:order-2"}
                  >
                    <div className="flex items-center justify-center min-h-[200px] md:min-h-0" style={{ color: step.color }}>
                      <step.Illustration />
                    </div>
                  </ScrollReveal>

                  <ScrollReveal
                    variants={isEven ? slideInRight : slideInLeft}
                    className={isEven ? "md:order-2" : "md:order-1"}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs font-bold uppercase tracking-widest font-sans"
                          style={{ color: step.color }}
                        >
                          {step.number}
                        </span>
                        <div className="h-px flex-1 bg-white/10" />
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold font-sans text-white">
                        {step.title}
                      </h3>
                      <p className="text-white/40 leading-relaxed text-lg">
                        {step.description}
                      </p>
                    </div>
                  </ScrollReveal>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
