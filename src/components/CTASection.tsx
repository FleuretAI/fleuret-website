import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_ROUTE } from "@/lib/routes";

const CTASection = () => {
  const { t, localize } = useLanguage();

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div style={{ maxWidth: "48rem", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(1.875rem, 4.5vw, 3.75rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            <span className="text-gradient-accent">{t("cta.title")}</span>
          </h2>
          <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.125rem)", color: "rgba(255,255,255,0.4)", maxWidth: "36rem", margin: "1.5rem auto 2rem", lineHeight: 1.7 }}>
            {t("cta.subtitle")}
          </p>
          <div style={{ display: "flex", justifyContent: "center", paddingTop: "1rem" }}>
            <Link to={localize(DEMO_ROUTE)} className="btn-cta btn-cta--lg">
              {t("cta.button")}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
