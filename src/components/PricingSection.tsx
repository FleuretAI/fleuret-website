import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import ScrollReveal from "./motion/ScrollReveal";
import StaggerGroup from "./motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";

interface PricingCard {
  name: string;
  price: string;
  unit?: string;
  description: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
  badge?: string;
}

const PricingSection = () => {
  const { t } = useLanguage();

  const cards: PricingCard[] = [
    {
      name: t("pricing.standard.name"),
      price: t("pricing.standard.price"),
      unit: t("pricing.standard.unit"),
      description: t("pricing.standard.desc"),
      features: [
        t("pricing.standard.feature1"),
        t("pricing.standard.feature2"),
        t("pricing.standard.feature3"),
        t("pricing.standard.feature4"),
      ],
      cta: t("pricing.cta"),
      highlighted: true,
    },
    {
      name: t("pricing.enterprise.name"),
      price: t("pricing.enterprise.price"),
      unit: undefined,
      description: t("pricing.enterprise.desc"),
      features: [
        t("pricing.enterprise.feature1"),
        t("pricing.enterprise.feature2"),
        t("pricing.enterprise.feature3"),
        t("pricing.enterprise.feature4"),
      ],
      cta: t("pricing.enterprise.cta"),
    },
  ];

  return (
    <section
      id="pricing"
      className="section-elevated grid-fade relative py-24 md:py-32 overflow-hidden"
    >
      {/* Radial accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[radial-gradient(ellipse_at_top,rgba(79,143,255,0.06),transparent_70%)] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.04),transparent_70%)] pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
                {t("pricing.title")}{" "}
                <span className="text-gradient-accent">
                  {t("pricing.subtitle")}
                </span>
              </h2>
              <p className="text-lg text-white/40 leading-relaxed max-w-2xl mx-auto">
                {t("pricing.description")}
              </p>
            </div>
          </ScrollReveal>

          {/* Pricing Cards */}
          <StaggerGroup className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-4xl mx-auto">
            {cards.map((card) => (
              <motion.div
                key={card.name}
                variants={staggerItem}
                className="relative"
              >
                {/* Gradient border for highlighted card */}
                {card.highlighted && (
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-br from-[var(--accent-blue)] via-[var(--accent-violet)] to-[var(--accent-red)] opacity-40 blur-[1px]" />
                )}

                <div
                  className={`relative flex flex-col h-full rounded-2xl p-8 transition-all duration-300 ${
                    card.highlighted
                      ? "bg-white/[0.04] border border-white/10 hover:bg-white/[0.06]"
                      : "bg-white/[0.02] border border-white/8 hover:bg-white/[0.04]"
                  }`}
                >
                  {/* Badge */}
                  {card.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-block px-4 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-violet)] text-white">
                        {card.badge}
                      </span>
                    </div>
                  )}

                  {/* Plan name */}
                  <h3 className="text-sm uppercase tracking-widest text-white/50 font-semibold mb-6">
                    {card.name}
                  </h3>

                  {/* Price */}
                  <div className="mb-6">
                    {card.unit && (
                      <span className="text-sm text-white/40 uppercase tracking-wider">
                        {t("pricing.startingAt")}
                      </span>
                    )}
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        {card.price}€
                      </span>
                      {card.unit ? (
                        <span className="text-sm text-white/40">
                          {card.unit}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-white/40 leading-relaxed mb-8">
                    {card.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-1">
                    {card.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-white/60"
                      >
                        <svg
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{
                            color: card.highlighted
                              ? "var(--accent-violet)"
                              : "var(--accent-blue)",
                          }}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    className={`w-full py-3 px-6 rounded-lg text-sm font-semibold transition-all duration-300 cursor-pointer ${
                      card.highlighted
                        ? "bg-gradient-to-r from-[var(--accent-blue)] to-[var(--accent-violet)] text-white hover:opacity-90"
                        : "border border-white/10 text-white/70 hover:text-white hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    {card.cta}
                  </button>
                </div>
              </motion.div>
            ))}
          </StaggerGroup>

          {/* Anchor comparison text */}
          <ScrollReveal delay={0.3}>
            <p className="text-center text-sm text-white/30 mt-12">
              {t("pricing.anchor")}
            </p>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
