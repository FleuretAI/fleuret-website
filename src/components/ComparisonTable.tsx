import { useLanguage } from "@/contexts/LanguageContext";

const Check = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: "inline-block", margin: "0 auto" }}>
    <circle cx="10" cy="10" r="10" fill="#22c55e" fillOpacity="0.2"/>
    <path d="M6 10.5L8.5 13L14 7.5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const Cross = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ display: "inline-block", margin: "0 auto" }}>
    <circle cx="10" cy="10" r="10" fill="#ef4444" fillOpacity="0.15"/>
    <path d="M7 7L13 13M13 7L7 13" stroke="#ef4444" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

type Cell = string | { check: boolean };

const ComparisonTable = () => {
  const { t } = useLanguage();

  const rows: { label: string; manual: Cell; fleuret: Cell; automated: Cell }[] = [
    { label: t("comparison.depth"),          manual: t("comparison.depth.traditional"),          fleuret: t("comparison.depth.fleuret"),          automated: t("comparison.depth.automated") },
    { label: t("comparison.speed"),          manual: t("comparison.speed.traditional"),          fleuret: t("comparison.speed.fleuret"),          automated: t("comparison.speed.automated") },
    { label: t("comparison.cost"),           manual: t("comparison.cost.traditional"),           fleuret: t("comparison.cost.fleuret"),           automated: t("comparison.cost.automated") },
    { label: t("comparison.falsePositives"), manual: t("comparison.falsePositives.traditional"), fleuret: t("comparison.falsePositives.fleuret"), automated: t("comparison.falsePositives.automated") },
    { label: t("comparison.frequency"),      manual: t("comparison.frequency.traditional"),      fleuret: t("comparison.frequency.fleuret"),      automated: t("comparison.frequency.automated") },
    { label: t("comparison.compliance"),     manual: { check: true },  fleuret: { check: true },  automated: { check: false } },
    { label: t("comparison.adaptability"),   manual: { check: true },  fleuret: { check: true },  automated: { check: false } },
  ];

  const renderCell = (v: Cell, isFleuret = false) => {
    if (typeof v === "object") return v.check ? <Check /> : <Cross />;
    return <span style={{ fontSize: "0.875rem", fontWeight: isFleuret ? 500 : 400, color: isFleuret ? "#fff" : "rgba(255,255,255,0.35)", lineHeight: 1.4 }}>{v}</span>;
  };

  // Mobile cards version
  const renderMobileCard = (row: typeof rows[0]) => (
    <div key={row.label} style={{ padding: "1rem", borderRadius: "0.75rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
      <div style={{ fontSize: "0.75rem", fontWeight: 500, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.75rem" }}>{row.label}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.5rem", textAlign: "center" }}>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.375rem" }}>Manual</div>
          {renderCell(row.manual)}
        </div>
        <div style={{ background: "rgba(79,143,255,0.05)", borderRadius: "0.5rem", padding: "0.375rem 0.25rem", margin: "-0.375rem 0" }}>
          <div style={{ fontSize: 10, color: "var(--accent-blue)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.375rem" }}>Fleuret</div>
          {renderCell(row.fleuret, true)}
        </div>
        <div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "0.375rem" }}>Scanner</div>
          {renderCell(row.automated)}
        </div>
      </div>
    </div>
  );

  return (
    <section id="comparison" className="py-16 md:py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div style={{ textAlign: "center", maxWidth: "48rem", margin: "0 auto 4rem" }}>
          <h2 style={{ fontSize: "clamp(1.875rem, 4vw, 3rem)", color: "#fff", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            {t("comparison.title")}
          </h2>
        </div>

        {/* Desktop table */}
        <table className="hidden md:table w-full max-w-[64rem] mx-auto" style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "1rem", fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {t("comparison.header.capability")}
              </th>
              <th style={{ textAlign: "center", padding: "1rem", fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {t("comparison.header.traditional")}
              </th>
              <th style={{ textAlign: "center", padding: "1rem" }}>
                <span style={{ display: "inline-block", fontSize: "0.875rem", fontWeight: 500, color: "#fff", borderRadius: "999px", padding: "0.375rem 1rem", background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))" }}>
                  {t("comparison.header.fleuret")}
                </span>
              </th>
              <th style={{ textAlign: "center", padding: "1rem", fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {t("comparison.header.automated")}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} style={{ borderTop: "1px solid rgba(255,255,255,0.05)", transition: "background 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = ""; }}>
                <td style={{ padding: "1.25rem 1rem", fontSize: "0.875rem", fontWeight: 500, color: "rgba(255,255,255,0.6)", textAlign: "left" }}>{row.label}</td>
                <td style={{ padding: "1.25rem 1rem", textAlign: "center" }}>{renderCell(row.manual)}</td>
                <td style={{ padding: "1.25rem 1rem", textAlign: "center", background: "rgba(79,143,255,0.03)", borderLeft: "1px solid rgba(79,143,255,0.1)", borderRight: "1px solid rgba(79,143,255,0.1)" }}>
                  {renderCell(row.fleuret, true)}
                </td>
                <td style={{ padding: "1.25rem 1rem", textAlign: "center" }}>{renderCell(row.automated)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Mobile cards */}
        <div className="flex md:hidden flex-col gap-3 max-w-sm mx-auto">
          {rows.map(renderMobileCard)}
        </div>
      </div>
    </section>
  );
};

export default ComparisonTable;
