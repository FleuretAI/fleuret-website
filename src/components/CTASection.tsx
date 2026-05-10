import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_ROUTE } from "@/lib/routes";

const CTASection = () => {
  const { t, localize } = useLanguage();

  return (
    <section
      className="fl-section"
      style={{ position: "relative", overflow: "hidden", padding: "12rem 0 13rem", minHeight: "min(80vh, 760px)" }}
    >
      <div
        aria-hidden
        className="fl-crosshair"
        style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 1, zIndex: 0 }}
      />
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 0,
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,143,255,0.18), transparent 70%), radial-gradient(ellipse 70% 40% at 50% 100%, rgba(229,72,77,0.10), transparent 75%)",
        }}
      />

      <div className="max-w-[1280px] mx-auto px-4 md:px-8" style={{ position: "relative", zIndex: 1 }}>
        <div style={{ maxWidth: "62rem", margin: "0 auto", textAlign: "center" }}>
          <p
            className="fl-eyebrow"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.6rem",
              justifyContent: "center",
              margin: "0 0 2rem",
            }}
          >
            <span className="fl-dot" style={{ background: "var(--fl-blue)" }} />
            {t("cta.eyebrow")}
          </p>

          <h2
            style={{
              fontSize: "clamp(48px, 6vw, 96px)",
              fontWeight: 300,
              letterSpacing: "-0.03em",
              lineHeight: 1.04,
              color: "#fff",
              margin: 0,
              textWrap: "balance" as React.CSSProperties["textWrap"],
            }}
          >
            {t("cta.titleA")}{" "}
            <span className="fl-text-gradient">{t("cta.titleB")}</span>
            <span style={{ color: "#fff" }}>.</span>
          </h2>

          <p
            style={{
              fontSize: "clamp(16px, 1.5vw, 18px)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              maxWidth: "620px",
              margin: "1.75rem auto 2.5rem",
            }}
          >
            {t("cta.subtitle")}
          </p>

          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link to={localize(DEMO_ROUTE)} className="fl-cta">
              {t("cta.button")}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>

      <p
        className="fl-eyebrow fl-mono"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 26,
          margin: 0,
          textAlign: "center",
          fontSize: 10,
          letterSpacing: "0.32em",
          color: "rgba(255,255,255,0.32)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {t("cta.ambient")}
      </p>
    </section>
  );
};

export default CTASection;
