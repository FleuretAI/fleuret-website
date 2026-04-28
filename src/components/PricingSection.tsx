import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_ROUTE } from "@/lib/routes";
import { DP_COHORT_VISIBLE } from "@/lib/designPartnerConfig";

const CheckIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{ width: "1rem", height: "1rem", flexShrink: 0, marginTop: 2 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);

const PricingSection = () => {
  const { t, localize } = useLanguage();
  const [recurringTerm, setRecurringTerm] = useState<"1yr" | "3yr">("1yr");

  const pocFeatures = [
    t("pricing.poc.f1"),
    t("pricing.poc.f2"),
    t("pricing.poc.f3"),
    t("pricing.poc.f4"),
  ];
  const recurringFeatures = [
    t("pricing.recurring.f1"),
    t("pricing.recurring.f2"),
    t("pricing.recurring.f3"),
    t("pricing.recurring.f4"),
    t("pricing.recurring.f5"),
    t("pricing.recurring.f6"),
  ];

  const recurringPrice =
    recurringTerm === "1yr"
      ? t("pricing.recurring.price1yr")
      : t("pricing.recurring.price3yr");

  const pocCard = (
    <div
      data-testid="pricing-card-poc"
      style={{ display: "flex", flexDirection: "column", height: "100%", borderRadius: "1rem", padding: "2rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", transition: "all 0.3s", cursor: "default" }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
    >
      <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginBottom: "1.5rem" }}>
        {t("pricing.poc.name")}
      </p>
      <div>
        <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.25rem" }}>
          {t("pricing.startingAt")}
        </span>
        <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1rem" }}>
          <span style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em" }}>{t("pricing.poc.price")}</span>
          <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>{t("pricing.poc.unit")}</span>
        </div>
      </div>
      <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "1rem" }}>{t("pricing.poc.desc")}</p>
      <div
        data-testid="pricing-poc-upgrade-credit"
        style={{ display: "inline-block", alignSelf: "flex-start", fontSize: "0.75rem", color: "rgba(79,143,255,0.9)", background: "rgba(79,143,255,0.08)", border: "1px solid rgba(79,143,255,0.18)", borderRadius: "0.5rem", padding: "0.4rem 0.7rem", marginBottom: "1.5rem", lineHeight: 1.4 }}
      >
        {t("pricing.poc.upgradeCredit")}
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
        {pocFeatures.map((f) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
            <CheckIcon color="var(--accent-blue)" />{f}
          </li>
        ))}
      </ul>
      <Link
        to={localize(DEMO_ROUTE)}
        style={{ display: "block", width: "100%", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 600, textAlign: "center", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)", transition: "all 0.3s" }}
        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "#fff"; el.style.borderColor = "rgba(255,255,255,0.2)"; el.style.background = "rgba(255,255,255,0.04)"; }}
        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = "rgba(255,255,255,0.7)"; el.style.borderColor = "rgba(255,255,255,0.1)"; el.style.background = ""; }}
      >
        {t("pricing.poc.cta")}
      </Link>
      <div style={{ margin: "1.5rem 0 0", padding: "1rem", borderRadius: "0.75rem", border: "1px solid rgba(79,143,255,0.2)", background: "rgba(79,143,255,0.04)", textAlign: "center" }}>
        <p style={{ fontSize: "0.95rem", fontWeight: 400, color: "#fff", margin: 0, marginBottom: "0.25rem" }}>{t("pricing.guarantee.title")}</p>
        <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>{t("pricing.guarantee.subtitle")}</p>
      </div>
    </div>
  );

  const recurringCard = (
    <div data-testid="pricing-card-recurring" style={{ position: "relative" }}>
      <div data-testid="pricing-recurring-glow" style={{ position: "absolute", inset: -1, borderRadius: "1rem", background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet), var(--accent-red))", opacity: 0.4, filter: "blur(1px)", zIndex: 0 }} />
      <div
        style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", borderRadius: "1rem", padding: "2rem", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", transition: "all 0.3s", cursor: "default" }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
      >
        <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginBottom: "1.5rem" }}>
          {t("pricing.recurring.name")}
        </p>

        <div
          data-testid="pricing-recurring-toggle"
          role="radiogroup"
          aria-label="Recurring term"
          style={{ display: "inline-flex", alignSelf: "flex-start", padding: "0.25rem", borderRadius: "0.5rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", marginBottom: "1rem" }}
        >
          {(["1yr", "3yr"] as const).map((term) => {
            const active = recurringTerm === term;
            return (
              <button
                key={term}
                type="button"
                role="radio"
                aria-checked={active}
                data-testid={`pricing-recurring-toggle-${term}`}
                onClick={() => setRecurringTerm(term)}
                style={{
                  padding: "0.4rem 0.85rem",
                  fontSize: "0.8rem",
                  fontWeight: 500,
                  borderRadius: "0.35rem",
                  border: "none",
                  cursor: "pointer",
                  color: active ? "#fff" : "rgba(255,255,255,0.55)",
                  background: active ? "rgba(255,255,255,0.12)" : "transparent",
                  transition: "all 0.2s",
                }}
              >
                {t(`pricing.recurring.toggle.${term}`)}
              </button>
            );
          })}
        </div>

        <div>
          <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.25rem" }}>
            {t("pricing.startingAt")}
          </span>
          <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem" }}>
            <span data-testid="pricing-recurring-price" style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em" }}>{recurringPrice}</span>
            <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>{t("pricing.recurring.unit")}</span>
          </div>
          {recurringTerm === "3yr" && (
            <p data-testid="pricing-recurring-savings" style={{ fontSize: "0.75rem", color: "rgba(79,143,255,0.85)", margin: "0 0 1rem" }}>
              {t("pricing.recurring.toggle.savings")}
            </p>
          )}
        </div>
        <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2rem" }}>{t("pricing.recurring.desc")}</p>
        <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
          {recurringFeatures.map((f) => (
            <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
              <CheckIcon color="var(--accent-violet)" />{f}
            </li>
          ))}
        </ul>
        <Link to={localize(DEMO_ROUTE)} className="btn-cta btn-cta--block">
          {t("pricing.recurring.cta")}
        </Link>
      </div>
    </div>
  );

  return (
    <section id="pricing" className="py-16 md:py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div style={{ textAlign: "center", maxWidth: "56rem", margin: "0 auto 4rem" }}>
          <h2 style={{ fontSize: "clamp(1.875rem, 4.5vw, 3.75rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            {t("pricing.title.main")}{" "}
            <span className="text-gradient-accent">{t("pricing.title.accent")}</span>
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: "42rem", margin: "1rem auto 0" }}>
            {t("pricing.description")}
          </p>
        </div>

        {/*
          Cards grid.
          Desktop (md+): POC left, Recurring right (md:grid-cols-2, source order kept).
          Mobile (<md): Recurring renders first (highlighted-first stack) via CSS `order`.
          Tailwind `md:!order-none` resets the inline `order` on desktop so source order rules.
        */}
        <div
          data-testid="pricing-cards-grid"
          className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-[56rem] mx-auto"
        >
          <div data-testid="pricing-card-slot-poc" style={{ order: 2 }} className="md:!order-none">
            {pocCard}
          </div>
          <div data-testid="pricing-card-slot-recurring" style={{ order: 1 }} className="md:!order-none">
            {recurringCard}
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", marginTop: "2rem" }}>{t("pricing.anchor")}</p>

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
