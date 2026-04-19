import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_ROUTE } from "@/lib/routes";

const CheckIcon = ({ color }: { color: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{ width: "1rem", height: "1rem", flexShrink: 0, marginTop: 2 }}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
  </svg>
);

const PricingSection = () => {
  const { t, localize } = useLanguage();

  const standardFeatures = [
    t("pricing.standard.f1"),
    t("pricing.standard.f2"),
    t("pricing.standard.f3"),
    t("pricing.standard.f4"),
  ];
  const enterpriseFeatures = [
    t("pricing.enterprise.f1"),
    t("pricing.enterprise.f2"),
    t("pricing.enterprise.f3"),
    t("pricing.enterprise.f4"),
  ];

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

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-[56rem] mx-auto">
          {/* Standard — highlighted with gradient border */}
          <div style={{ position: "relative" }}>
            {/* Animated gradient glow border */}
            <div style={{ position: "absolute", inset: -1, borderRadius: "1rem", background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet), var(--accent-red))", opacity: 0.4, filter: "blur(1px)", zIndex: 0 }} />
            <div
              style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", borderRadius: "1rem", padding: "2rem", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", transition: "all 0.3s", cursor: "default" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
            >
              <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginBottom: "1.5rem" }}>
                {t("pricing.standard.name")}
              </p>
              <div>
                <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", display: "block", marginBottom: "0.25rem" }}>
                  {t("pricing.startingAt")}
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  <span style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em" }}>{t("pricing.standard.price")}</span>
                  <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)" }}>{t("pricing.standard.unit")}</span>
                </div>
              </div>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2rem" }}>{t("pricing.standard.desc")}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
                {standardFeatures.map((f) => (
                  <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", fontSize: "0.875rem", color: "rgba(255,255,255,0.6)" }}>
                    <CheckIcon color="var(--accent-violet)" />{f}
                  </li>
                ))}
              </ul>
              <Link
                to={localize(DEMO_ROUTE)}
                style={{ display: "block", width: "100%", padding: "0.75rem 1.5rem", borderRadius: "0.5rem", fontSize: "0.875rem", fontWeight: 600, textAlign: "center", background: "linear-gradient(to right, var(--accent-blue), var(--accent-violet))", color: "#fff", transition: "opacity 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.9"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
              >
                {t("pricing.standard.cta")}
              </Link>
            </div>
          </div>

          {/* Enterprise */}
          <div
            style={{ display: "flex", flexDirection: "column", height: "100%", borderRadius: "1rem", padding: "2rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", transition: "all 0.3s", cursor: "default" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
          >
            <p style={{ fontSize: "0.875rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)", fontWeight: 600, marginBottom: "1.5rem" }}>
              {t("pricing.enterprise.name")}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "1.5rem" }}>
              <span style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em" }}>{t("pricing.enterprise.price")}</span>
            </div>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, marginBottom: "2rem" }}>{t("pricing.enterprise.desc")}</p>
            <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.75rem", flex: 1 }}>
              {enterpriseFeatures.map((f) => (
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
              {t("pricing.enterprise.cta")}
            </Link>
          </div>
        </div>

        {/* Guarantee */}
        <div style={{ margin: "3rem auto 0", maxWidth: "28rem", textAlign: "center", padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(79,143,255,0.2)", background: "rgba(79,143,255,0.04)" }}>
          <p style={{ fontSize: "1.25rem", fontWeight: 400, color: "#fff", marginBottom: "0.25rem" }}>{t("pricing.guarantee.title")}</p>
          <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", margin: 0 }}>{t("pricing.guarantee.subtitle")}</p>
        </div>
        <p style={{ textAlign: "center", fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", marginTop: "2rem" }}>{t("pricing.anchor")}</p>
      </div>
    </section>
  );
};

export default PricingSection;
