import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { SEO } from "@/seo/SEO";
import { DEMO_ROUTE } from "@/lib/routes";

const Partners = () => {
  const { t, localize } = useLanguage();

  const includedFeatures = [
    t("partners.included.f1"),
    t("partners.included.f2"),
    t("partners.included.f3"),
    t("partners.included.f4"),
    t("partners.included.f5"),
    t("partners.included.f6"),
  ];

  return (
    <main id="main-content" className="min-h-screen pt-32 md:pt-40 pb-20 px-4">
      <SEO pageKey="partners" />
      <div className="max-w-5xl mx-auto">
        <Link
          to={localize("/")}
          className="text-[var(--accent-blue)] hover:underline text-sm inline-block mb-8"
        >
          {t("common.back")}
        </Link>

        {/* Hero */}
        <section style={{ marginBottom: "5rem" }}>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#fff", maxWidth: "48rem" }}>
            {t("partners.hero.title")}
          </h1>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginTop: "1.5rem", maxWidth: "44rem" }}>
            {t("partners.hero.subtitle")}
          </p>
          <Link
            to={localize(DEMO_ROUTE)}
            className="btn-cta"
            style={{ display: "inline-block", marginTop: "2rem" }}
            data-testid="partners-hero-cta"
          >
            {t("partners.hero.cta")}
          </Link>
        </section>

        {/* Who is this for? */}
        <section style={{ marginBottom: "5rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 300, letterSpacing: "-0.02em", color: "#fff", marginBottom: "2rem" }}>
            {t("partners.who.title")}
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {(["grc", "marketplace", "advisory"] as const).map((key) => (
              <div
                key={key}
                style={{ padding: "1.5rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}
              >
                <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "0.75rem" }}>
                  {t(`partners.who.${key}.title`)}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
                  {t(`partners.who.${key}.body`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Wholesale model */}
        <section style={{ marginBottom: "5rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 300, letterSpacing: "-0.02em", color: "#fff", marginBottom: "2rem" }}>
            {t("partners.model.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {(["grc", "marketplace"] as const).map((key) => (
              <div
                key={key}
                data-testid={`partners-model-${key}`}
                style={{ padding: "2rem", borderRadius: "1rem", border: "1px solid rgba(79,143,255,0.2)", background: "rgba(79,143,255,0.04)" }}
              >
                <p style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.2em", color: "rgba(79,143,255,0.85)", fontWeight: 600, marginBottom: "0.75rem" }}>
                  {t(`partners.model.${key}.label`)}
                </p>
                <p style={{ fontSize: "1.875rem", fontWeight: 300, color: "#fff", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
                  {t(`partners.model.${key}.value`)}
                </p>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, margin: 0 }}>
                  {t(`partners.model.${key}.detail`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Included */}
        <section style={{ marginBottom: "5rem" }}>
          <h2 style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.5rem)", fontWeight: 300, letterSpacing: "-0.02em", color: "#fff", marginBottom: "2rem" }}>
            {t("partners.included.title")}
          </h2>
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "1rem" }} className="md:grid-cols-2">
            {includedFeatures.map((feature) => (
              <li
                key={feature}
                style={{ display: "flex", alignItems: "flex-start", gap: "0.75rem", padding: "1rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)" }}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" strokeWidth="2" style={{ width: "1.1rem", height: "1.1rem", flexShrink: 0, marginTop: 2 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                </svg>
                <span style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Sovereignty proof */}
        <section style={{ marginBottom: "5rem", padding: "2rem", borderRadius: "1rem", border: "1px solid rgba(212,168,75,0.25)", background: "linear-gradient(135deg, rgba(212,168,75,0.06), rgba(212,168,75,0.02))" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 500, color: "#fff", marginBottom: "1rem" }}>
            {t("partners.proof.title")}
          </h2>
          <p style={{ fontSize: "0.95rem", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "44rem" }}>
            {t("partners.proof.body")}
          </p>
          <Link
            to={localize("/sub-processors")}
            style={{ fontSize: "0.85rem", fontWeight: 600, color: "rgba(212,168,75,0.95)", textDecoration: "none" }}
            data-testid="partners-subprocessors-link"
          >
            {t("partners.proof.cta")} →
          </Link>
        </section>

        {/* Final CTA */}
        <section style={{ textAlign: "center", padding: "3rem 1.5rem", borderRadius: "1.5rem", background: "linear-gradient(135deg, rgba(79,143,255,0.04), rgba(167,139,250,0.04))", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", fontWeight: 300, letterSpacing: "-0.02em", color: "#fff", marginBottom: "1rem" }}>
            {t("partners.cta.title")}
          </h2>
          <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "2rem", maxWidth: "32rem", margin: "0 auto 2rem" }}>
            {t("partners.cta.body")}
          </p>
          <Link to={localize(DEMO_ROUTE)} className="btn-cta" data-testid="partners-final-cta">
            {t("partners.cta.button")}
          </Link>
        </section>
      </div>
    </main>
  );
};

export default Partners;
