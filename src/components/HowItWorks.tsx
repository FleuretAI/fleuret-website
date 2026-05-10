import { useLanguage } from "@/contexts/LanguageContext";

const ArtifactASM = () => (
  <svg viewBox="0 0 320 220" fill="none" style={{ display: "block", width: "100%", height: "auto", color: "var(--fl-blue)" }} role="img" aria-label="External attack-surface map">
    <defs>
      <radialGradient id="hiw-asm-glow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="currentColor" stopOpacity="0.25" />
        <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="160" cy="110" r="80" fill="url(#hiw-asm-glow)" />
    <circle cx="160" cy="110" r="6"  fill="currentColor" />
    {[
      [70, 38], [240, 50], [40, 130], [275, 90], [110, 188], [220, 175], [150, 30], [60, 80], [260, 160], [40, 60], [285, 130], [180, 200]
    ].map(([x, y], i) => (
      <g key={i}>
        <line x1="160" y1="110" x2={x} y2={y} stroke="currentColor" strokeOpacity="0.18" strokeWidth="0.8" strokeDasharray="2 3" />
        <circle cx={x} cy={y} r="3" fill="currentColor" fillOpacity="0.65" />
      </g>
    ))}
    <circle cx="160" cy="110" r="80" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="3 5" />
    <circle cx="160" cy="110" r="40" stroke="currentColor" strokeOpacity="0.3"  strokeWidth="1" />
  </svg>
);

const TERMINAL_LINES = [
  { c: "rgba(255,255,255,0.45)", t: "$ fleuret-agent --target=api.acme.io --mode=exploit-chain" },
  { c: "rgba(245,196,81,0.85)",  t: "[recon] discovered 47 routes, 12 auth-flows" },
  { c: "rgba(255,255,255,0.6)",  t: "[chain] testing: idor → oauth-replay → token-leak" },
  { c: "rgba(245,196,81,0.85)",  t: "[hit] /v1/users/:id  PII exposed (idor)" },
  { c: "rgba(229,72,77,0.95)",   t: "[exploit] valid PoC captured — severity HIGH" },
  { c: "rgba(255,255,255,0.6)",  t: "[chain] testing: redis-cache-poisoning" },
  { c: "rgba(245,196,81,0.85)",  t: "[hit] /admin/* token replay (8h window)" },
  { c: "rgba(229,72,77,0.95)",   t: "[exploit] privilege escalation confirmed" },
  { c: "rgba(255,255,255,0.6)",  t: "[validate] re-running PoCs, capturing artifacts…" },
  { c: "rgba(124,205,124,0.85)", t: "[ok] 7 PoCs validated · 0 false-pos · ready for triage" },
];

const ArtifactTerminal = () => (
  <div style={{ border: "1px solid rgba(229,72,77,0.25)", borderRadius: 6, background: "rgba(11,12,20,0.85)", padding: "0.85rem 1rem", fontFamily: "var(--fl-mono)", fontSize: "0.7rem", lineHeight: 1.6, position: "relative" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: "0.6rem" }}>
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(229,72,77,0.7)" }} />
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(245,196,81,0.7)" }} />
      <span style={{ width: 8, height: 8, borderRadius: "50%", background: "rgba(124,205,124,0.7)" }} />
      <span style={{ marginLeft: "auto", fontSize: "0.6rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.4)" }}>FLEURET · AGENT-RUN</span>
    </div>
    {TERMINAL_LINES.map((l, i) => (
      <div key={i} style={{ color: l.c, whiteSpace: "pre-wrap" }}>{l.t}</div>
    ))}
    <div style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <span style={{ color: "rgba(255,255,255,0.4)" }}>$</span>
      <span className="fl-blink" style={{ display: "inline-block", width: 6, height: 12, background: "var(--fl-red)" }} />
    </div>
  </div>
);

const ArtifactReport = () => (
  <div style={{ border: "1px solid rgba(139,92,246,0.25)", borderRadius: 6, background: "rgba(11,12,20,0.8)", padding: "1rem 1.1rem", color: "var(--fl-violet)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.6rem" }}>
      <span className="fl-mono" style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "rgba(139,92,246,0.85)" }}>FLEURET REPORT · v.2026.05</span>
      <span className="fl-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.45)" }}>PDF · 14 PAGES</span>
    </div>
    <div style={{ borderTop: "1px dashed rgba(139,92,246,0.2)", margin: "0 0 0.75rem" }} />
    {[
      { sev: "HIGH", color: "rgba(229,72,77,0.85)", title: "IDOR · /v1/users/:id", impact: "PII exposure across 12,400 users" },
      { sev: "HIGH", color: "rgba(229,72,77,0.85)", title: "Token replay · /admin/*", impact: "Privilege escalation, 8h window" },
      { sev: "MED",  color: "rgba(245,196,81,0.85)", title: "Cache poisoning · redis-l1", impact: "Session bleed cross-tenant" },
      { sev: "MED",  color: "rgba(245,196,81,0.85)", title: "Misconfig · S3 bucket public", impact: "Read access to logs" },
      { sev: "LOW",  color: "rgba(124,205,124,0.7)", title: "Stale dep · openssl 1.1.1", impact: "Theoretical, not exploitable" },
    ].map((f, i) => (
      <div key={i} style={{ display: "grid", gridTemplateColumns: "60px 1fr 140px", gap: "0.75rem", padding: "0.4rem 0", fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", borderBottom: i < 4 ? "1px dashed rgba(255,255,255,0.06)" : 0 }}>
        <span className="fl-mono" style={{ color: f.color, letterSpacing: "0.16em" }}>{f.sev}</span>
        <span style={{ color: "#fff" }}>{f.title}</span>
        <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.68rem" }}>{f.impact}</span>
      </div>
    ))}
    <div style={{ marginTop: "0.75rem", padding: "0.5rem 0 0", borderTop: "1px dashed rgba(139,92,246,0.2)", display: "flex", justifyContent: "space-between" }}>
      <span className="fl-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.22em", color: "rgba(139,92,246,0.85)" }}>SIGNED · TIMESTAMPED · NIS2-MAPPED</span>
      <span className="fl-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.18em", color: "rgba(255,255,255,0.5)" }}>0 false-positives</span>
    </div>
  </div>
);

type Stage = {
  num: "01" | "02" | "03";
  color: string;
  rgb: string;
  timestamp: string;
  durationKey: string;
  titleKey: string;
  descKey: string;
  stats: string[];
  Artifact: () => JSX.Element;
};

const HowItWorks = () => {
  const { t } = useLanguage();

  const stages: Stage[] = [
    {
      num: "01",
      color: "var(--fl-blue)",
      rgb: "79,143,255",
      timestamp: "T+00:00",
      durationKey: "process.deploy.duration",
      titleKey: "process.deploy.title",
      descKey: "process.deploy.desc",
      stats: [t("process.deploy.stat1"), t("process.deploy.stat2"), t("process.deploy.duration")],
      Artifact: ArtifactASM,
    },
    {
      num: "02",
      color: "var(--fl-red)",
      rgb: "229,72,77",
      timestamp: "T+00:04",
      durationKey: "process.attack.duration",
      titleKey: "process.attack.title",
      descKey: "process.attack.desc",
      stats: [t("process.attack.stat1"), t("process.attack.stat2"), t("process.attack.duration")],
      Artifact: ArtifactTerminal,
    },
    {
      num: "03",
      color: "var(--fl-violet)",
      rgb: "139,92,246",
      timestamp: "T+02:18",
      durationKey: "process.exploits.duration",
      titleKey: "process.exploits.title",
      descKey: "process.exploits.desc",
      stats: [t("process.exploits.stat1"), t("process.exploits.stat2"), t("process.exploits.duration")],
      Artifact: ArtifactReport,
    },
  ];

  return (
    <section className="fl-section" style={{ padding: "7rem 0 8rem", position: "relative", overflow: "hidden" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div style={{ maxWidth: "44rem", marginBottom: "3.5rem" }}>
          <p className="fl-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", margin: "0 0 1.25rem" }}>
            <span className="fl-dot" style={{ background: "var(--fl-blue)" }} />
            {t("process.eyebrow")}
          </p>
          <h2
            style={{
              fontSize: "clamp(36px, 4.4vw, 64px)",
              fontWeight: 300,
              letterSpacing: "-0.02em",
              lineHeight: 1.08,
              color: "#fff",
              margin: 0,
            }}
          >
            {t("process.main.title")}{" "}
            <span className="fl-text-gradient">{t("process.main.works")}</span>
          </h2>
          <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: "36rem", margin: "1.25rem 0 0" }}>
            {t("process.main.subtitle")}
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: 0 }}>
          <div className="hiw-rail" />

          <div style={{ display: "flex", flexDirection: "column", gap: "4rem", position: "relative", zIndex: 1 }}>
            {stages.map((s) => (
              <div key={s.num} style={{ display: "grid", gridTemplateColumns: "112px 1fr", gap: "1.25rem", alignItems: "start" }}>
                {/* Rail node + timestamp */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5rem", position: "relative" }}>
                  <div style={{ position: "relative", width: 24, height: 24 }}>
                    <span
                      style={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        border: `1px solid ${s.color}`,
                        opacity: 0.6,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: s.color,
                        boxShadow: `0 0 0 6px rgba(${s.rgb}, 0.18)`,
                      }}
                    />
                  </div>
                  <span className="fl-mono" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.12em" }}>{s.timestamp}</span>
                  <span
                    className="fl-mono"
                    style={{
                      fontSize: "0.65rem",
                      letterSpacing: "0.22em",
                      padding: "3px 8px",
                      border: `1px solid ${s.color}`,
                      color: s.color,
                      borderRadius: 3,
                      textTransform: "uppercase",
                    }}
                  >
                    {t(s.durationKey)}
                  </span>
                </div>

                {/* Card */}
                <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "1.25rem", alignItems: "stretch" }}>
                  <div
                    style={{
                      border: `1px solid rgba(${s.rgb}, 0.25)`,
                      background: `rgba(${s.rgb}, 0.03)`,
                      borderRadius: 6,
                      padding: "1.5rem 1.5rem 1.25rem",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <span className="fl-mono" style={{ fontSize: "0.875rem", color: s.color, letterSpacing: "0.18em", marginBottom: "0.75rem" }}>{s.num}</span>
                    <h3 style={{ fontSize: "clamp(1.25rem, 2vw, 1.625rem)", fontWeight: 400, color: "#fff", margin: "0 0 0.65rem", letterSpacing: "-0.01em" }}>{t(s.titleKey)}</h3>
                    <p style={{ color: "rgba(255,255,255,0.6)", lineHeight: 1.55, margin: 0, fontSize: "0.9375rem" }}>{t(s.descKey)}</p>
                    <div
                      className="fl-mono"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr 1fr",
                        gap: "0.5rem",
                        marginTop: "auto",
                        paddingTop: "1.25rem",
                        borderTop: `1px dashed rgba(${s.rgb}, 0.25)`,
                        fontSize: "0.65rem",
                        letterSpacing: "0.18em",
                        color: "rgba(255,255,255,0.65)",
                      }}
                    >
                      {s.stats.map((st, i) => (
                        <span key={i} style={{ textAlign: i === 1 ? "center" : i === 2 ? "right" : "left" }}>{st}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <s.Artifact />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Elapsed bar */}
        <div style={{ marginTop: "4rem" }}>
          <div className="fl-mono" style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.55)", marginBottom: "0.5rem" }}>
            <span>{t("process.elapsed.perimeter")} · 1.5%</span>
            <span>{t("process.elapsed.engagement")} · 90%</span>
            <span>{t("process.elapsed.report")} · 8.5%</span>
          </div>
          <div style={{ display: "flex", height: 10, borderRadius: 2, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ width: "1.5%", background: "var(--fl-blue)" }} />
            <div style={{ width: "90%",  background: "var(--fl-red)", opacity: 0.85 }} />
            <div style={{ width: "8.5%", background: "var(--fl-violet)" }} />
          </div>
          <p className="fl-mono" style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.45)", margin: "0.65rem 0 0", textAlign: "center" }}>
            {t("process.elapsed.label")}
          </p>
        </div>
      </div>

    </section>
  );
};

export default HowItWorks;
