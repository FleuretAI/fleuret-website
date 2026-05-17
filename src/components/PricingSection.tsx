import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { DEMO_ROUTE } from "@/lib/routes";
import { staggerContainer, staggerItem } from "@/lib/animations";

const fleuretLines = [
  { id: "01.01", key: "pricing.standard.f1" },
  { id: "01.02", key: "pricing.standard.f2" },
  { id: "01.03", key: "pricing.standard.f3" },
  { id: "01.04", key: "pricing.standard.f4" },
] as const;

const anchorLines = [
  { id: "02.01", key: "pricing.anchor.line1", tag: "pricing.anchor.line1Tag" },
  { id: "02.02", key: "pricing.anchor.line2", tag: "pricing.anchor.line2Tag" },
  { id: "02.03", key: "pricing.anchor.line3", tag: "pricing.anchor.line3Tag" },
  { id: "02.04", key: "pricing.anchor.line4", tag: "pricing.anchor.line4Tag" },
] as const;

const PricingSection = () => {
  const { t, localize } = useLanguage();

  return (
    <section id="pricing" className="fl-section fl-section--solid" style={{ padding: "6rem 0 7rem", position: "relative", overflow: "hidden", scrollMarginTop: "5rem" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}
        >
          <motion.div variants={staggerItem} style={{ maxWidth: "44rem" }}>
            <p className="fl-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", margin: "0 0 1rem" }}>
              <span className="fl-dot" style={{ background: "var(--fl-violet)" }} />
              {t("pricing.eyebrow")}
            </p>
            <h2
              style={{
                fontSize: "clamp(26px, 2.9vw, 42px)",
                fontWeight: 400,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "#fff",
                margin: 0,
              }}
            >
              {t("pricing.title.main")}{" "}
              <span className="fl-text-gradient">{t("pricing.title.accent")}</span>
            </h2>
            <p style={{ fontSize: "1rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.55, maxWidth: "34rem", margin: "1rem 0 0" }}>
              {t("pricing.subtitle.desc")}
            </p>
          </motion.div>
          <motion.p
            variants={staggerItem}
            className="fl-mono"
            style={{
              fontSize: "0.75rem",
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.4)",
              margin: 0,
              alignSelf: "flex-end",
            }}
          >
            {t("pricing.accent.tagline")}
          </motion.p>
        </motion.div>

        {/* Receipt sheet */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 6,
            background: "rgba(11,12,20,0.6)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ alignItems: "stretch" }}>
            {/* Left — Fleuret */}
            <div style={{ padding: "2.5rem clamp(1rem, 4vw, 2.25rem) 2rem", borderRight: "1px dashed rgba(255,255,255,0.1)", position: "relative" }}>
              {/* Line item header row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", paddingBottom: "1.25rem", borderBottom: "1px dashed rgba(255,255,255,0.12)" }}>
                <span className="fl-mono" style={{ fontSize: "0.75rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.7)" }}>
                  01 · {t("pricing.standard.lineItem")}
                </span>
                <span className="fl-mono" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)" }}>{t("pricing.standard.price")}</span>
              </div>

              {/* Hero price echo */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", margin: "1.5rem 0 0.5rem", flexWrap: "wrap" }}>
                <span
                  className="fl-mono"
                  style={{
                    fontSize: "clamp(44px, 4.7vw, 68px)",
                    fontWeight: 400,
                    letterSpacing: "-0.025em",
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {t("pricing.standard.price")}
                </span>
                <span className="fl-mono" style={{ fontSize: "0.75rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
                  {t("pricing.standard.unit")}
                </span>
              </div>

              {/* Gradient divider */}
              <div style={{ height: 1, background: "var(--fl-gradient)", opacity: 0.7, margin: "1.75rem 0 1.5rem" }} />

              {/* INCLUDED header */}
              <p className="fl-mono" style={{ fontSize: "0.6875rem", letterSpacing: "0.24em", color: "rgba(255,255,255,0.55)", margin: "0 0 1rem" }}>
                {t("pricing.standard.included")}
              </p>

              {/* Lines */}
              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.25 } } }}
                style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}
              >
                {fleuretLines.map((line) => (
                  <motion.li
                    key={line.id}
                    variants={{
                      hidden: { opacity: 0, x: -12 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.7rem 0",
                      borderBottom: "1px dashed rgba(255,255,255,0.08)",
                      fontSize: "0.9375rem",
                      color: "rgba(255,255,255,0.85)",
                    }}
                  >
                    <span className="fl-mono" style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem" }}>{line.id}</span>
                    <span>{t(line.key)}</span>
                    <span className="fl-mono" style={{ color: "var(--fl-violet)", fontSize: "0.6875rem", letterSpacing: "0.18em" }}>INCLUDED</span>
                  </motion.li>
                ))}
              </motion.ul>

              <Link to={localize(DEMO_ROUTE)} className="fl-cta" style={{ marginTop: "2.25rem", width: "100%", maxWidth: "100%" }}>
                {t("pricing.standard.cta")}
                <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Right — Anchor / firm reference */}
            <div style={{ padding: "2.5rem clamp(1rem, 4vw, 2.25rem) 2rem", position: "relative", opacity: 0.62, overflow: "hidden" }}>
              {/* Watermark */}
              <div aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", overflow: "hidden" }}>
                <span
                  className="fl-mono"
                  style={{
                    transform: "rotate(-18deg)",
                    fontSize: "clamp(2rem, 6vw, 5rem)",
                    letterSpacing: "0.2em",
                    color: "rgba(229,72,77,0.08)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {t("pricing.anchor.watermark")}
                </span>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "1rem", paddingBottom: "1.25rem", borderBottom: "1px dashed rgba(229,72,77,0.3)" }}>
                <span className="fl-mono" style={{ fontSize: "0.75rem", letterSpacing: "0.18em", color: "rgba(229,72,77,0.85)" }}>
                  02 · {t("pricing.anchor.lineItem")}
                </span>
                <span className="fl-mono" style={{ fontSize: "0.875rem", color: "rgba(229,72,77,0.85)" }}>{t("pricing.anchor.price")}</span>
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.75rem", margin: "1.5rem 0 0.5rem", flexWrap: "wrap" }}>
                <s
                  className="fl-mono"
                  aria-label={t("pricing.anchor")}
                  style={{
                    fontSize: "clamp(44px, 4.7vw, 68px)",
                    fontWeight: 400,
                    letterSpacing: "-0.025em",
                    color: "rgba(255,255,255,0.55)",
                    lineHeight: 1,
                    textDecoration: "line-through",
                    textDecorationColor: "rgba(229,72,77,0.7)",
                    textDecorationThickness: 4,
                  }}
                >
                  {t("pricing.anchor.price")}
                </s>
                <span className="fl-mono" style={{ fontSize: "0.8125rem", letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                  {t("pricing.anchor.unit")}
                </span>
              </div>

              <div style={{ height: 1, background: "rgba(229,72,77,0.45)", margin: "1.75rem 0 1.5rem" }} />

              <p className="fl-mono" style={{ fontSize: "0.6875rem", letterSpacing: "0.24em", color: "rgba(229,72,77,0.85)", margin: "0 0 1rem" }}>
                {t("pricing.anchor.extras")}
              </p>

              <motion.ul
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
                style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column" }}
              >
                {anchorLines.map((line) => (
                  <motion.li
                    key={line.id}
                    variants={{
                      hidden: { opacity: 0, x: 12 },
                      visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
                    }}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "auto 1fr auto",
                      alignItems: "center",
                      gap: "1rem",
                      padding: "0.7rem 0",
                      borderBottom: "1px dashed rgba(229,72,77,0.18)",
                      fontSize: "0.9375rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    <span className="fl-mono" style={{ color: "rgba(229,72,77,0.55)", fontSize: "0.75rem" }}>{line.id}</span>
                    <span>{t(line.key)}</span>
                    <span className="fl-mono" style={{ color: "rgba(229,72,77,0.8)", fontSize: "0.6875rem", letterSpacing: "0.18em" }}>{t(line.tag)}</span>
                  </motion.li>
                ))}
              </motion.ul>

              <p
                className="fl-mono"
                style={{
                  fontSize: "0.625rem",
                  letterSpacing: "0.22em",
                  color: "rgba(229,72,77,0.65)",
                  textAlign: "center",
                  margin: "2.25rem 0 0",
                  padding: "0.75rem 0",
                  borderTop: "1px dashed rgba(229,72,77,0.3)",
                  borderBottom: "1px dashed rgba(229,72,77,0.3)",
                }}
              >
                {t("pricing.anchor.footer")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer row: guarantee stamp + enterprise inline */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
          style={{ display: "flex", justifyContent: "space-between", gap: "2rem", flexWrap: "wrap", marginTop: "2rem", alignItems: "center" }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, rotate: -8, scale: 0.92 },
              visible: { opacity: 1, rotate: -3, scale: 1, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            style={{
              border: "2px solid var(--fl-violet)",
              borderRadius: 8,
              padding: "1rem 1.25rem",
              maxWidth: "22rem",
              background: "rgba(139,92,246,0.04)",
              transformOrigin: "center",
            }}
          >
            <p style={{ margin: 0, fontSize: "1.1rem", color: "#fff", fontWeight: 400, letterSpacing: "-0.01em" }}>
              {t("pricing.guarantee.title")}
            </p>
            <p style={{ margin: "0.35rem 0 0", fontSize: "0.8125rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>
              {t("pricing.guarantee.subtitle")}
            </p>
          </motion.div>

          <motion.p
            variants={{
              hidden: { opacity: 0, x: 16 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
            }}
            style={{
              fontSize: "0.9375rem",
              color: "rgba(255,255,255,0.6)",
              margin: 0,
              maxWidth: "32rem",
              textAlign: "right",
              lineHeight: 1.55,
            }}
          >
            <span className="fl-mono" style={{ display: "block", fontSize: "0.6875rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.45)", marginBottom: "0.4rem" }}>
              {t("pricing.alsoAvailable")}
            </span>
            {t("pricing.enterprise.desc")}
          </motion.p>
        </motion.div>

        <p style={{ textAlign: "center", fontSize: "0.8125rem", color: "rgba(255,255,255,0.4)", marginTop: "2rem" }}>
          {t("pricing.anchor")}
        </p>
      </div>
    </section>
  );
};

export default PricingSection;
