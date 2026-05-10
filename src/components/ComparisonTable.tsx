import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { staggerContainer, staggerItem } from "@/lib/animations";

type RowKey = "depth" | "fp" | "speed" | "cost" | "frequency" | "compliance" | "adapt";
type Band = "rigor" | "economics" | "fit";

type Row = {
  key: RowKey;
  band: Band;
  label: string;
  firm: string | "__yes__" | "__no__";
  fleuret: string | "__yes__" | "__no__";
  scanner: string | "__yes__" | "__no__";
  win: boolean;
};

const Tick = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden style={{ display: "inline-block" }}>
    <circle cx="9" cy="9" r="8.5" fill="rgb(34,197,94)" fillOpacity="0.18" stroke="rgb(34,197,94)" strokeOpacity="0.7" strokeWidth="1" />
    <path d="M5.5 9.2L8 11.6L12.6 6.6" stroke="rgb(34,197,94)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const Cross = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden style={{ display: "inline-block" }}>
    <circle cx="9" cy="9" r="8.5" fill="rgb(239,68,68)" fillOpacity="0.15" stroke="rgb(239,68,68)" strokeOpacity="0.6" strokeWidth="1" />
    <path d="M6 6L12 12M12 6L6 12" stroke="rgb(239,68,68)" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const WinBadge = ({ label }: { label: string }) => (
  <span
    className="fl-mono"
    style={{
      display: "inline-block",
      padding: "2px 6px",
      border: "1px solid rgba(79,143,255,0.4)",
      borderRadius: 2,
      fontSize: 9,
      letterSpacing: "0.18em",
      color: "rgba(180,200,255,0.85)",
      marginLeft: 10,
      lineHeight: 1.45,
    }}
  >
    {label}
  </span>
);

const ComparisonTable = () => {
  const { t } = useLanguage();

  const rows: Row[] = [
    { key: "depth",      band: "rigor",     label: t("comparison.depth"),          firm: t("comparison.depth.traditional"),          fleuret: t("comparison.depth.fleuret"),          scanner: t("comparison.depth.automated"),          win: false },
    { key: "fp",         band: "rigor",     label: t("comparison.falsePositives"), firm: t("comparison.falsePositives.traditional"), fleuret: t("comparison.falsePositives.fleuret"), scanner: t("comparison.falsePositives.automated"), win: true },
    { key: "speed",      band: "economics", label: t("comparison.speed"),          firm: t("comparison.speed.traditional"),          fleuret: t("comparison.speed.fleuret"),          scanner: t("comparison.speed.automated"),          win: false },
    { key: "cost",       band: "economics", label: t("comparison.cost"),           firm: t("comparison.cost.traditional"),           fleuret: t("comparison.cost.fleuret"),           scanner: t("comparison.cost.automated"),           win: true },
    { key: "frequency",  band: "economics", label: t("comparison.frequency"),      firm: t("comparison.frequency.traditional"),      fleuret: t("comparison.frequency.fleuret"),      scanner: t("comparison.frequency.automated"),      win: true },
    { key: "compliance", band: "fit",       label: t("comparison.compliance"),     firm: "__yes__",                                  fleuret: "__yes__",                              scanner: "__no__",                                 win: false },
    { key: "adapt",      band: "fit",       label: t("comparison.adaptability"),   firm: "__yes__",                                  fleuret: "__yes__",                              scanner: "__no__",                                 win: false },
  ];

  const bands: { key: Band; labelKey: string }[] = [
    { key: "rigor",     labelKey: "comparison.band.rigor" },
    { key: "economics", labelKey: "comparison.band.economics" },
    { key: "fit",       labelKey: "comparison.band.fit" },
  ];

  type Col = "firm" | "fleuret" | "scanner";

  const renderCell = (row: Row, col: Col) => {
    const v = row[col];
    const isFleuret = col === "fleuret";
    let body: React.ReactNode;
    if (v === "__yes__") body = <Tick />;
    else if (v === "__no__") body = <Cross />;
    else body = (
      <span style={{ color: isFleuret ? "#fff" : "rgba(255,255,255,0.45)", fontWeight: isFleuret ? 500 : 400 }}>
        {v}
      </span>
    );

    return (
      <div
        key={col}
        style={{
          padding: "16px 26px",
          minHeight: row.band === "fit" ? 68 : 70,
          fontSize: 14.5,
          lineHeight: "20.3px",
          borderTop: "1px solid rgba(255,255,255,0.04)",
          borderRight: col === "firm" ? "1px solid rgba(255,255,255,0.04)" : "none",
          borderLeft: col === "scanner" ? "1px solid rgba(255,255,255,0.04)" : "none",
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <p className="fl-mono" style={{ margin: "0 0 6px", fontSize: 9.5, letterSpacing: "0.19em", color: "rgba(255,255,255,0.32)", textTransform: "uppercase" }}>
          {row.label}
        </p>
        <div style={{ display: "flex", alignItems: "center" }}>
          {body}
          {isFleuret && row.win && <WinBadge label={t("comparison.win")} />}
        </div>
      </div>
    );
  };

  const renderHeaderCell = (col: Col) => {
    const isFleuret = col === "fleuret";
    const eyebrow =
      col === "firm" ? t("comparison.poster.firm") :
      col === "fleuret" ? t("comparison.poster.fleuret") :
      t("comparison.poster.scanner");
    const eyebrowColor =
      col === "fleuret" ? "rgba(180,200,255,0.95)" : "rgba(255,255,255,0.42)";
    return (
      <div
        key={col}
        style={{
          padding: "24px 26px 22px",
          minHeight: 98,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          borderRight: col === "firm" ? "1px solid rgba(255,255,255,0.04)" : "none",
          borderLeft: col === "scanner" ? "1px solid rgba(255,255,255,0.04)" : "none",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p className="fl-mono" style={{ margin: "0 0 10px", fontSize: 10, letterSpacing: "0.22em", color: eyebrowColor }}>
          {eyebrow}
        </p>
        {isFleuret ? (
          <span
            style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: 999,
              background: "linear-gradient(135deg, #4F8FFF 0%, #8B5CF6 100%)",
              color: "#fff",
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: "0.02em",
            }}
          >
            {t("comparison.header.fleuret")}
          </span>
        ) : (
          <span style={{ fontSize: 22, fontWeight: 400, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.01em" }}>
            {col === "firm" ? t("comparison.header.traditional") : t("comparison.header.automated")}
          </span>
        )}
      </div>
    );
  };

  const renderBandStrip = (labelKey: string, key: string) => (
    <div
      key={key}
      style={{
        gridColumn: "1 / -1",
        padding: "14px 26px 6px",
        background: "rgba(255,255,255,0.016)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <span className="fl-mono" style={{ fontSize: 9.5, letterSpacing: "0.22em", color: "rgba(255,255,255,0.32)", textTransform: "uppercase" }}>
        {t(labelKey)}
      </span>
    </div>
  );

  const renderVerdictCell = (col: Col) => {
    const isFleuret = col === "fleuret";
    const verdictKey =
      col === "firm" ? "comparison.verdict.firm" :
      col === "fleuret" ? "comparison.verdict.fleuret" :
      "comparison.verdict.scanner";
    return (
      <div
        key={col}
        style={{
          padding: "20px 26px 22px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderRight: col === "firm" ? "1px solid rgba(255,255,255,0.04)" : "none",
          borderLeft: col === "scanner" ? "1px solid rgba(255,255,255,0.04)" : "none",
          position: "relative",
          zIndex: 1,
          fontSize: 14,
          lineHeight: "21px",
          color: isFleuret ? "#fff" : "rgba(255,255,255,0.5)",
          fontWeight: isFleuret ? 500 : 300,
        }}
      >
        {t(verdictKey)}
      </div>
    );
  };

  const cols: Col[] = ["firm", "fleuret", "scanner"];

  return (
    <section id="comparison" className="fl-section fl-section--solid" style={{ padding: "3.5rem 0 4.5rem", position: "relative", overflow: "hidden", scrollMarginTop: "5rem" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8" style={{ position: "relative", zIndex: 1 }}>
        {/* Header row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem", flexWrap: "wrap", marginBottom: "2rem" }}
        >
          <motion.h2
            variants={staggerItem}
            style={{ fontSize: "clamp(28px, 2.9vw, 42px)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#fff", margin: 0 }}
          >
            {t("comparison.title")}
          </motion.h2>
          <motion.div variants={staggerItem} className="fl-mono" style={{ textAlign: "right", fontSize: 10.5, letterSpacing: "0.18em", lineHeight: 1.7 }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.42)" }}>{t("comparison.chrome.criteria")}</p>
            <p style={{ margin: 0, color: "rgba(180,200,255,0.85)" }}>{t("comparison.chrome.wins")}</p>
          </motion.div>
        </motion.div>

        {/* Grid wrapper with raised middle card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
          style={{ position: "relative" }}
        >
          {/* Raised middle column overlay */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "33.333%",
              right: "33.333%",
              top: -18,
              bottom: -18,
              borderRadius: 14,
              padding: 1,
              background: "linear-gradient(180deg, rgba(79,143,255,0.7) 0%, rgba(139,92,246,0.5) 60%, rgba(79,143,255,0.2) 100%)",
              zIndex: 0,
              pointerEvents: "none",
              boxShadow: "0 30px 80px rgba(79,143,255,0.18)",
              WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: "33.333%",
              right: "33.333%",
              top: -18,
              bottom: -18,
              borderRadius: 14,
              background: "linear-gradient(180deg, rgba(79,143,255,0.05) 0%, rgba(139,92,246,0.05) 100%)",
              zIndex: 0,
              pointerEvents: "none",
            }}
          />

          {/* CSS grid: 3 equal columns, mixing per-column cells with full-width band strips */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 0,
            }}
          >
            {/* Header row */}
            {cols.map(renderHeaderCell)}

            {/* Bands + rows */}
            {bands.map((b) => (
              <div key={b.key} style={{ display: "contents" }}>
                {renderBandStrip(b.labelKey, `${b.key}-strip`)}
                {rows.filter((r) => r.band === b.key).map((r) => (
                  <div key={r.key} style={{ display: "contents" }}>
                    {cols.map((c) => <div key={c}>{renderCell(r, c)}</div>)}
                  </div>
                ))}
              </div>
            ))}

            {/* Verdict row */}
            {cols.map(renderVerdictCell)}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComparisonTable;
