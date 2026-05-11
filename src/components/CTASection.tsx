import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_ROUTE } from "@/lib/routes";
import { fadeInUp, staggerContainer, staggerItem } from "@/lib/animations";

const CTASection = () => {
  const { t, localize } = useLanguage();

  return (
    <section
      className="fl-section fl-section--solid fl-section--breathe"
      style={{ position: "relative", overflow: "hidden", padding: "8rem 0 9rem" }}
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
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          style={{ maxWidth: "62rem", margin: "0 auto", textAlign: "center" }}
        >
          <motion.p
            variants={staggerItem}
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
          </motion.p>

          <motion.h2
            variants={staggerItem}
            style={{
              fontSize: "clamp(36px, 4.4vw, 64px)",
              fontWeight: 300,
              letterSpacing: "-0.025em",
              lineHeight: 1.06,
              color: "#fff",
              margin: 0,
              textWrap: "balance" as React.CSSProperties["textWrap"],
            }}
          >
            {t("cta.titleA")}{" "}
            <span className="fl-text-gradient">{t("cta.titleB")}</span>
            <span style={{ color: "#fff" }}>.</span>
          </motion.h2>

          <motion.p
            variants={staggerItem}
            style={{
              fontSize: "clamp(16px, 1.5vw, 18px)",
              color: "rgba(255,255,255,0.6)",
              lineHeight: 1.6,
              maxWidth: "620px",
              margin: "1.75rem auto 2.5rem",
            }}
          >
            {t("cta.subtitle")}
          </motion.p>

          <motion.div variants={staggerItem} style={{ display: "flex", justifyContent: "center" }}>
            <Link to={localize(DEMO_ROUTE)} className="fl-cta">
              {t("cta.button")}
              <span aria-hidden>→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8, duration: 0.6 }}
        variants={fadeInUp}
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
      </motion.p>
    </section>
  );
};

export default CTASection;
