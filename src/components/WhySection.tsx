import { useLanguage } from "@/contexts/LanguageContext";

const WhySection = () => {
  const { t } = useLanguage();

  return (
    <section id="why" style={{ padding: "4rem 0" }} className="md:py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start max-w-[72rem] mx-auto">

          {/* LEFT — sticky on desktop */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-32">
            <h2
              style={{
                fontSize: "clamp(1.875rem, 4.5vw, 3.75rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "#fff",
              }}
            >
              {t("problem.main.title")}{" "}
              <span className="text-gradient-accent">{t("problem.main.broken")}</span>
            </h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1.125rem", lineHeight: 1.7, maxWidth: "28rem", margin: 0 }}>
              {t("problem.main.subtitle")}
            </p>

            {/* Exposure card */}
            <div
              style={{
                padding: "1.25rem 1.25rem 1rem",
                borderRadius: "1rem",
                border: "1px solid rgba(239,68,68,0.15)",
                background: "rgba(239,68,68,0.04)",
                marginTop: "0.5rem",
              }}
            >
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" }}>
                <span
                  style={{
                    width: "0.5rem", height: "0.5rem", borderRadius: "50%",
                    background: "var(--accent-red)", flexShrink: 0,
                    animation: "pulseDot 2s ease-in-out infinite",
                  }}
                />
                <p style={{ margin: 0, color: "rgba(239,68,68,0.8)", fontSize: "0.875rem", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                  {t("problem.exposure")}
                </p>
              </div>

              {/* SVG Timeline */}
              <div style={{ position: "relative", margin: "0.25rem 0 1rem" }}>
                <svg viewBox="0 0 360 150" preserveAspectRatio="xMidYMid meet" style={{ display: "block", width: "100%", height: "auto", overflow: "visible" }}
                  role="img" aria-label="Timeline showing 2 pentests over 12 months with most deploys unprotected">
                  <defs>
                    <linearGradient id="expoGapGrad" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="rgba(239,68,68,0.18)" />
                      <stop offset="100%" stopColor="rgba(239,68,68,0.02)" />
                    </linearGradient>
                  </defs>
                  {/* Gap zones */}
                  <rect x="40"  y="54" width="140" height="28" rx="2" fill="url(#expoGapGrad)" />
                  <rect x="200" y="54" width="140" height="28" rx="2" fill="url(#expoGapGrad)" />
                  {/* Axis */}
                  <line x1="20" y1="68" x2="340" y2="68" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                  {/* Month ticks */}
                  <g>
                    <line x1="20"  y1="66" x2="20"  y2="70" stroke="rgba(255,255,255,0.15)" />
                    <line x1="49"  y1="67" x2="49"  y2="69" stroke="rgba(255,255,255,0.1)" />
                    <line x1="78"  y1="67" x2="78"  y2="69" stroke="rgba(255,255,255,0.1)" />
                    <line x1="107" y1="67" x2="107" y2="69" stroke="rgba(255,255,255,0.1)" />
                    <line x1="136" y1="67" x2="136" y2="69" stroke="rgba(255,255,255,0.1)" />
                    <line x1="165" y1="67" x2="165" y2="69" stroke="rgba(255,255,255,0.1)" />
                    <line x1="195" y1="66" x2="195" y2="70" stroke="rgba(255,255,255,0.15)" />
                    <line x1="224" y1="67" x2="224" y2="69" stroke="rgba(255,255,255,0.1)" />
                    <line x1="253" y1="67" x2="253" y2="69" stroke="rgba(255,255,255,0.1)" />
                    <line x1="282" y1="67" x2="282" y2="69" stroke="rgba(255,255,255,0.1)" />
                    <line x1="311" y1="67" x2="311" y2="69" stroke="rgba(255,255,255,0.1)" />
                    <line x1="340" y1="66" x2="340" y2="70" stroke="rgba(255,255,255,0.15)" />
                    <text x="20"  y="102" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="9" letterSpacing="0.12em" textDecoration="uppercase" fontWeight="500">Jan</text>
                    <text x="107" y="102" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="9" letterSpacing="0.12em" fontWeight="500">Apr</text>
                    <text x="195" y="102" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="9" letterSpacing="0.12em" fontWeight="500">Jul</text>
                    <text x="282" y="102" textAnchor="middle" fill="rgba(255,255,255,0.28)" fontSize="9" letterSpacing="0.12em" fontWeight="500">Oct</text>
                    <text x="340" y="102" textAnchor="end"    fill="rgba(255,255,255,0.28)" fontSize="9" letterSpacing="0.12em" fontWeight="500">Dec</text>
                  </g>
                  {/* Pentest events */}
                  <g>
                    <rect x="14" y="58" width="12" height="20" rx="2" fill="rgba(79,143,255,0.2)" stroke="rgba(79,143,255,0.8)" strokeWidth="1.2" />
                    <path d="M17 68 L19.5 70.5 L23 66.5" stroke="rgba(79,143,255,1)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <text x="20" y="50" textAnchor="middle" fill="rgba(79,143,255,0.85)" fontSize="9" letterSpacing="0.14em" fontWeight="500">Pentest</text>
                    <rect x="189" y="58" width="12" height="20" rx="2" fill="rgba(79,143,255,0.2)" stroke="rgba(79,143,255,0.8)" strokeWidth="1.2" />
                    <path d="M192 68 L194.5 70.5 L198 66.5" stroke="rgba(79,143,255,1)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                    <text x="195" y="50" textAnchor="middle" fill="rgba(79,143,255,0.85)" fontSize="9" letterSpacing="0.14em" fontWeight="500">Pentest</text>
                  </g>
                  {/* Deploy dots */}
                  <g>
                    <circle cx="32"  cy="68" r="2.6" fill="rgba(255,255,255,0.7)" />
                    {[44,58,72,86,98,112,126,140,154,168,180].map((cx) => (
                      <circle key={cx} cx={cx} cy="68" r="2.8" fill="var(--accent-red)" style={{ animation: "deployPulse 2.4s ease-in-out infinite" }} />
                    ))}
                    <circle cx="207" cy="68" r="2.6" fill="rgba(255,255,255,0.7)" />
                    {[219,232,246,260,274,288,302,315,327,338].map((cx) => (
                      <circle key={cx} cx={cx} cy="68" r="2.8" fill="var(--accent-red)" style={{ animation: "deployPulse 2.4s ease-in-out infinite" }} />
                    ))}
                  </g>
                  {/* Gap labels */}
                  <text x="110" y="124" textAnchor="middle" fill="rgba(239,68,68,0.55)" fontSize="9" letterSpacing="0.18em" fontWeight="500">~6 MONTHS EXPOSED</text>
                  <text x="270" y="124" textAnchor="middle" fill="rgba(239,68,68,0.55)" fontSize="9" letterSpacing="0.18em" fontWeight="500">~6 MONTHS EXPOSED</text>
                  {/* Brackets */}
                  <g stroke="rgba(239,68,68,0.35)" strokeWidth="1" fill="none">
                    <path d="M40 130 L40 134 L180 134 L180 130" />
                    <path d="M200 130 L200 134 L340 134 L340 130" />
                  </g>
                </svg>
              </div>

              {/* Legend */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem 1.25rem", alignItems: "center", paddingTop: "0.875rem", marginTop: "0.25rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.04em" }}>
                  <span style={{ width: "0.9rem", height: "0.9rem", borderRadius: 3, border: "1px solid rgba(79,143,255,0.6)", background: "rgba(79,143,255,0.15)", display: "inline-block", flexShrink: 0 }} />
                  {t("problem.legend.pentest")}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.55)" }}>
                  <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "rgba(255,255,255,0.55)", display: "inline-block", flexShrink: 0 }} />
                  {t("problem.legend.audited")}
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", fontSize: "0.72rem", color: "rgba(255,255,255,0.55)" }}>
                  <span style={{ width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "var(--accent-red)", boxShadow: "0 0 0 3px rgba(239,68,68,0.18)", display: "inline-block", flexShrink: 0 }} />
                  {t("problem.legend.unaudited")}
                </span>
                <span style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginLeft: "auto" }}>
                  <b style={{ color: "rgba(239,68,68,0.9)", fontWeight: 500, fontSize: "0.95rem", letterSpacing: "-0.01em" }}>23 of 25</b>
                  <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.72rem" }}>{t("problem.legend.stat")}</span>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT — problem cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {[
              { num: "01", color: "var(--accent-blue)",   title: t("problem.delay.title"),   desc: t("problem.delay.desc") },
              { num: "02", color: "var(--accent-violet)", title: t("problem.friction.title"), desc: t("problem.friction.desc") },
              { num: "03", color: "var(--accent-red)",    title: t("problem.cost.title"),     desc: t("problem.cost.desc") },
            ].map((p) => (
              <div
                key={p.num}
                className="group"
                style={{
                  padding: "1.5rem",
                  borderRadius: "1rem",
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.02)",
                  transition: "all 0.3s",
                  display: "flex",
                  gap: "1.25rem",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.15)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)";
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.08)";
                }}
              >
                <span style={{ fontSize: "2.25rem", fontWeight: 300, opacity: 0.4, lineHeight: 1, letterSpacing: "-0.02em", color: p.color, flexShrink: 0 }}>
                  {p.num}
                </span>
                <div style={{ paddingTop: "0.25rem" }}>
                  <h3 style={{ fontSize: "1.25rem", fontWeight: 400, color: "#fff", margin: "0.25rem 0 0.5rem" }}>{p.title}</h3>
                  <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0, fontSize: "1rem" }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhySection;
