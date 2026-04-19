import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_ROUTE } from "@/lib/routes";

const CTASection = () => {
  const { t, localize } = useLanguage();

  return (
    <section className="grid-fade py-16 md:py-24 lg:py-32" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "33%", left: "25%", width: 500, height: 400, background: "radial-gradient(ellipse at center, rgba(79,143,255,0.06), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "33%", right: "25%", width: 500, height: 400, background: "radial-gradient(ellipse at center, rgba(139,92,246,0.05), transparent 70%)", pointerEvents: "none" }} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-8" style={{ position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.875rem, 4.5vw, 3.75rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            <span className="text-gradient-accent">{t("cta.title")}</span>
          </h2>
          <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)", color: "rgba(255,255,255,0.4)", maxWidth: "36rem", margin: "1.5rem auto 2rem", lineHeight: 1.7 }}>
            {t("cta.subtitle")}
          </p>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "1rem" }}>
            <Link
              to={localize(DEMO_ROUTE)}
              style={{ fontSize: "1.125rem", fontWeight: 500, padding: "1rem 2.5rem", borderRadius: "999px", color: "#fff", background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))", transition: "box-shadow 0.2s, transform 0.15s", display: "inline-block" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(79,143,255,0.3)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = ""; }}
            >
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
