import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_ROUTE } from "@/lib/routes";
import { DP_COHORT_VISIBLE } from "@/lib/designPartnerConfig";
import { trackEvent } from "@/lib/gtag";

const CheckIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{ width: "1rem", height: "1rem", flexShrink: 0, marginTop: 2 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);

const PricingSection = () => {
  const { t, localize } = useLanguage();
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let fired = false;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !fired) {
            fired = true;
            trackEvent("pricing_viewed", { section: "homepage_pricing" });
            obs.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Product-led, per-test façade. Pentest + Advanced are concrete one-off
  // products; Continuous is the recurring moat (quote → demo), highlighted.
  const tiers = [
    {
      key: "pentest" as const,
      testId: "pricing-tier-pentest",
      color: "var(--accent-blue)",
      highlighted: false,
      features: [
        t("pricing.pentest.f1"),
        t("pricing.pentest.f2"),
        t("pricing.pentest.f3"),
      ],
    },
    {
      key: "advanced" as const,
      testId: "pricing-tier-advanced",
      color: "var(--accent-violet)",
      highlighted: false,
      features: [
        t("pricing.advanced.f1"),
        t("pricing.advanced.f2"),
        t("pricing.advanced.f3"),
      ],
    },
    {
      key: "continuous" as const,
      testId: "pricing-tier-continuous",
      color: "var(--accent-red)",
      highlighted: true,
      features: [
        t("pricing.continuous.f1"),
        t("pricing.continuous.f2"),
        t("pricing.continuous.f3"),
        t("pricing.continuous.f4"),
        t("pricing.continuous.f5"),
      ],
    },
  ];

  return (
    <section ref={sectionRef} id="pricing" className="py-16 md:py-24 lg:py-32" style={{ scrollMarginTop: "5rem" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        {/* Header */}
        <div style={{ textAlign: "center", maxWidth: "56rem", margin: "0 auto 3rem" }}>
          <h2 style={{ fontSize: "clamp(1.875rem, 4.5vw, 3.75rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            {t("pricing.title.main")}{" "}
            <span className="text-gradient-accent">{t("pricing.title.accent")}</span>
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: "42rem", margin: "1rem auto 0" }}>
            {t("pricing.description")}
          </p>
        </div>

        {/* 3-column grid: Pentest | Advanced | Continuous */}
        <div
          data-testid="pricing-layout"
          className="grid md:grid-cols-3 gap-6 max-w-[64rem] mx-auto items-start"
        >
          {tiers.map((tier) => (
            <div key={tier.key} data-testid={tier.testId} style={{ position: "relative" }}>
              {tier.highlighted && (
                <div style={{ position: "absolute", inset: -1, borderRadius: "1rem", background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet), var(--accent-red))", opacity: 0.4, filter: "blur(1px)", zIndex: 0 }} />
              )}
              <div
                style={{
                  position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%",
                  borderRadius: "1rem", padding: "2rem",
                  border: `1px solid ${tier.highlighted ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.08)"}`,
                  background: tier.highlighted ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                  transition: "all 0.3s", cursor: "default",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = tier.highlighted ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.04)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = tier.highlighted ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)"; }}
              >
                <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginBottom: "1rem" }}>
                  {t(`pricing.${tier.key}.name`)}
                </p>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em" }}>
                    {t(`pricing.${tier.key}.price`)}
                  </span>
                  {t(`pricing.${tier.key}.unit`) !== `pricing.${tier.key}.unit` && t(`pricing.${tier.key}.unit`) !== "" && (
                    <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>
                      {t(`pricing.${tier.key}.unit`)}
                    </span>
                  )}
                </div>
                <p style={{ fontSize: "0.8rem", color: tier.color, lineHeight: 1.5, marginBottom: "1rem", fontWeight: 500 }}>
                  {t(`pricing.${tier.key}.depth`)}
                </p>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                  {t(`pricing.${tier.key}.desc`)}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
                  {tier.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
                      <CheckIcon color={tier.color} />{f}
                    </li>
                  ))}
                </ul>
                <Link to={localize(DEMO_ROUTE)} className={tier.highlighted ? "btn-cta btn-cta--block" : ""} style={tier.highlighted ? {} : { display: "block", width: "100%", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 600, textAlign: "center", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", transition: "all 0.3s" }}>
                  {t(`pricing.${tier.key}.cta`)}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Anchor line: boutique comparison + first-test credit (where POC lives now) */}
        <p style={{ textAlign: "center", fontSize: "0.95rem", color: "rgba(255,255,255,0.55)", marginTop: "2rem", maxWidth: "44rem", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
          {t("pricing.anchor")}
        </p>

        {/* Guarantee badge */}
        <div
          data-testid="pricing-guarantee"
          style={{
            margin: "1.5rem auto 0",
            maxWidth: "32rem",
            padding: "1rem 1.5rem",
            borderRadius: "0.75rem",
            border: "2px solid rgba(79,143,255,0.3)",
            background: "rgba(79,143,255,0.06)",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "1.1rem", fontWeight: 500, color: "#fff", margin: 0, marginBottom: "0.25rem" }}>
            {t("pricing.guarantee.title")}
          </p>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: 0, lineHeight: 1.4 }}>
            {t("pricing.guarantee.subtitle")}
          </p>
        </div>

        {DP_COHORT_VISIBLE && (
          <Link
            to={localize("/design-partners")}
            data-testid="pricing-dp-banner"
            style={{ display: "block", margin: "2.5rem auto 0", maxWidth: "44rem", padding: "1.25rem 1.5rem", borderRadius: "1rem", border: "1px solid rgba(212,168,75,0.25)", background: "linear-gradient(135deg, rgba(212,168,75,0.06), rgba(212,168,75,0.02))", textDecoration: "none", transition: "all 0.3s" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,75,0.4)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,168,75,0.25)"; }}
          >
            <p style={{ fontSize: "0.95rem", fontWeight: 500, color: "#fff", margin: 0, marginBottom: "0.25rem" }}>{t("pricing.dpBanner.title")}</p>
            <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.55)", margin: 0, marginBottom: "0.5rem" }}>{t("pricing.dpBanner.subtitle")}</p>
            <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(212,168,75,0.95)" }}>{t("pricing.dpBanner.cta")} →</span>
          </Link>
        )}

        <Link
          to={localize("/partners")}
          data-testid="pricing-partners-banner"
          style={{ display: "block", margin: "1rem auto 0", maxWidth: "44rem", padding: "1rem 1.5rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", textDecoration: "none", transition: "all 0.3s" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.18)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
        >
          <p style={{ fontSize: "0.9rem", fontWeight: 500, color: "rgba(255,255,255,0.85)", margin: 0, marginBottom: "0.25rem" }}>{t("pricing.partnersBanner.title")}</p>
          <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", margin: 0, marginBottom: "0.4rem" }}>{t("pricing.partnersBanner.subtitle")}</p>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{t("pricing.partnersBanner.cta")} →</span>
        </Link>
      </div>
    </section>
  );
};

export default PricingSection;
