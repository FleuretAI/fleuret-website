import { useLanguage } from "@/contexts/LanguageContext";

type RowKey = "depth" | "fp" | "speed" | "cost" | "frequency" | "compliance" | "adapt";
type Band = "rigor" | "economics" | "fit";

type Row = {
  key: RowKey;
  band: Band;
  label: string;
  firm: string;
  fleuret: string;
  scanner: string;
};

const isFleuretWin = (k: RowKey) => k === "cost" || k === "fp" || k === "frequency" || k === "compliance" || k === "adapt";

const Tick = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden style={{ display: "inline-block", verticalAlign: "-2px", marginLeft: 6 }}>
    <circle cx="7" cy="7" r="6.5" stroke="rgba(124,205,124,0.7)" strokeWidth="1" fill="rgba(124,205,124,0.16)" />
    <path d="M4 7L6 9.2L10 4.6" stroke="rgba(124,205,124,1)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </svg>
);

const NoMark = ({ label }: { label: string }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" role="img" aria-label={label} style={{ display: "inline-block", verticalAlign: "-2px" }}>
    <circle cx="7" cy="7" r="6.5" stroke="rgba(229,72,77,0.55)" strokeWidth="1" fill="rgba(229,72,77,0.1)" />
    <path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="rgba(229,72,77,0.85)" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

const ComparisonTable = () => {
  const { t } = useLanguage();

  const rows: Row[] = [
    { key: "depth",      band: "rigor",     label: t("comparison.depth"),          firm: t("comparison.depth.traditional"),          fleuret: t("comparison.depth.fleuret"),          scanner: t("comparison.depth.automated") },
    { key: "fp",         band: "rigor",     label: t("comparison.falsePositives"), firm: t("comparison.falsePositives.traditional"), fleuret: t("comparison.falsePositives.fleuret"), scanner: t("comparison.falsePositives.automated") },
    { key: "speed",      band: "economics", label: t("comparison.speed"),          firm: t("comparison.speed.traditional"),          fleuret: t("comparison.speed.fleuret"),          scanner: t("comparison.speed.automated") },
    { key: "cost",       band: "economics", label: t("comparison.cost"),           firm: t("comparison.cost.traditional"),           fleuret: t("comparison.cost.fleuret"),           scanner: t("comparison.cost.automated") },
    { key: "frequency",  band: "economics", label: t("comparison.frequency"),      firm: t("comparison.frequency.traditional"),      fleuret: t("comparison.frequency.fleuret"),      scanner: t("comparison.frequency.automated") },
    { key: "compliance", band: "fit",       label: t("comparison.compliance"),     firm: "__yes__",                                  fleuret: "__yes__",                              scanner: "__no__" },
    { key: "adapt",      band: "fit",       label: t("comparison.adaptability"),   firm: "__yes__",                                  fleuret: "__yes__",                              scanner: "__no__" },
  ];

  const bands: { key: Band; labelKey: string }[] = [
    { key: "rigor",     labelKey: "comparison.band.rigor" },
    { key: "economics", labelKey: "comparison.band.economics" },
    { key: "fit",       labelKey: "comparison.band.fit" },
  ];

  type PosterMeta = {
    id: "firm" | "fleuret" | "scanner";
    eyebrowKey: string;
    eyebrowColor: string;
    rgb: string;
    label: string;
    verdictKey: string;
    raised: boolean;
  };

  const posters: PosterMeta[] = [
    { id: "firm",    eyebrowKey: "comparison.poster.firm",    eyebrowColor: "rgba(255,255,255,0.55)", rgb: "255,255,255", label: t("comparison.header.traditional"), verdictKey: "comparison.verdict.firm",    raised: false },
    { id: "fleuret", eyebrowKey: "comparison.poster.fleuret", eyebrowColor: "var(--fl-violet)",       rgb: "139,92,246",  label: t("comparison.header.fleuret"),     verdictKey: "comparison.verdict.fleuret", raised: true },
    { id: "scanner", eyebrowKey: "comparison.poster.scanner", eyebrowColor: "rgba(255,255,255,0.55)", rgb: "255,255,255", label: t("comparison.header.automated"),   verdictKey: "comparison.verdict.scanner", raised: false },
  ];

  const cellFor = (row: Row, p: PosterMeta) => {
    const v = p.id === "firm" ? row.firm : p.id === "fleuret" ? row.fleuret : row.scanner;
    const isFleuret = p.id === "fleuret";
    const content =
      v === "__yes__" ? <Tick /> :
      v === "__no__"  ? <NoMark label="Not supported" /> :
      v === "✓"       ? <Tick /> :
      <span>{v}</span>;
    return (
      <div
        style={{
          padding: "1rem 1.1rem",
          borderTop: "1px dashed rgba(255,255,255,0.08)",
          fontSize: "0.875rem",
          color: isFleuret ? "#fff" : "rgba(255,255,255,0.65)",
          lineHeight: 1.5,
          minHeight: 62,
          display: "flex",
          alignItems: "center",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
          {content}
          {isFleuret && isFleuretWin(row.key) && typeof v === "string" && v !== "__yes__" && v !== "__no__" && <Tick />}
        </span>
      </div>
    );
  };

  return (
    <section id="comparison" className="fl-section fl-section--solid" style={{ padding: "5rem 0 6rem", position: "relative", overflow: "hidden", scrollMarginTop: "5rem" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ maxWidth: "44rem", margin: "0 auto 3rem", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(26px, 2.9vw, 42px)", fontWeight: 400, letterSpacing: "-0.02em", lineHeight: 1.12, color: "#fff", margin: 0 }}>
            {t("comparison.title")}
          </h2>
        </div>

        {/* Posters */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr_1fr]" style={{ gap: "1.25rem", alignItems: "stretch" }}>
          {posters.map((p) => {
            const inner = (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  background: p.id === "fleuret" ? "rgba(11,12,20,0.85)" : "rgba(255,255,255,0.02)",
                  border: p.id === "fleuret" ? "none" : "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 6,
                  overflow: "hidden",
                }}
              >
                {/* Eyebrow strip */}
                <div
                  className="fl-mono"
                  style={{
                    padding: "0.85rem 1.1rem",
                    fontSize: "0.65rem",
                    letterSpacing: "0.24em",
                    color: p.eyebrowColor,
                    borderBottom: "1px solid rgba(255,255,255,0.08)",
                    textTransform: "uppercase",
                  }}
                >
                  {t(p.eyebrowKey)}
                </div>

                {/* Column label */}
                <div style={{ padding: "1.5rem 1.1rem 1.25rem", display: "flex", justifyContent: p.id === "fleuret" ? "center" : "flex-start" }}>
                  {p.id === "fleuret" ? (
                    <span className="fl-pill">{p.label}</span>
                  ) : (
                    <span style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.85)", fontWeight: 400 }}>{p.label}</span>
                  )}
                </div>

                {/* Bands of criteria */}
                {bands.map((b) => {
                  const bandRows = rows.filter((r) => r.band === b.key);
                  return (
                    <div key={b.key} style={{ padding: "0 0 0.4rem" }}>
                      <div
                        className="fl-mono"
                        style={{
                          padding: "0.55rem 1.1rem",
                          fontSize: "0.6rem",
                          letterSpacing: "0.24em",
                          color: "rgba(255,255,255,0.4)",
                          textTransform: "uppercase",
                          background: "rgba(255,255,255,0.025)",
                          borderTop: "1px solid rgba(255,255,255,0.06)",
                        }}
                      >
                        {t(b.labelKey)}
                      </div>
                      {bandRows.map((row) => (
                        <div key={row.key}>
                          {p.id === "firm" && (
                            <div
                              className="fl-mono"
                              style={{
                                padding: "0.45rem 1.1rem 0",
                                fontSize: "0.62rem",
                                letterSpacing: "0.2em",
                                color: "rgba(255,255,255,0.35)",
                                textTransform: "uppercase",
                              }}
                            >
                              {row.label}
                            </div>
                          )}
                          {cellFor(row, p)}
                        </div>
                      ))}
                    </div>
                  );
                })}

                {/* Verdict */}
                <div
                  style={{
                    marginTop: "auto",
                    padding: "1rem 1.1rem 1.25rem",
                    borderTop: "1px dashed rgba(255,255,255,0.1)",
                    fontSize: "0.9375rem",
                    color: p.id === "fleuret" ? "#fff" : "rgba(255,255,255,0.6)",
                    fontWeight: p.id === "fleuret" ? 500 : 400,
                    lineHeight: 1.5,
                  }}
                >
                  {t(p.verdictKey)}
                </div>
              </div>
            );

            return (
              <div
                key={p.id}
                style={{
                  transform: p.raised ? "translateY(-12px)" : undefined,
                }}
                className={p.raised ? "fl-gradient-frame" : undefined}
              >
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
