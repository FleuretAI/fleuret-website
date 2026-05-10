import { useLanguage } from "@/contexts/LanguageContext";

const RELEASE_ROWS = [
  { wk: "W27", svc: "api-gateway",   env: "prod",    sha: "f3a92c4", status: "DEPLOYED" },
  { wk: "W27", svc: "billing-svc",   env: "prod",    sha: "9b1e7da", status: "DEPLOYED" },
  { wk: "W27", svc: "auth-edge",     env: "canary",  sha: "2d44f81", status: "CANARY" },
  { wk: "W27", svc: "payments-api",  env: "prod",    sha: "c08aa12", status: "DEPLOYED" },
  { wk: "W26", svc: "search-svc",    env: "prod",    sha: "1f7e9aa", status: "DEPLOYED" },
  { wk: "W26", svc: "notif-worker",  env: "prod",    sha: "ab3d402", status: "DEPLOYED" },
  { wk: "W26", svc: "graphql-edge",  env: "staging", sha: "55c1e09", status: "ROLLBACK" },
  { wk: "W26", svc: "billing-svc",   env: "prod",    sha: "e9c2a17", status: "DEPLOYED" },
  { wk: "W25", svc: "auth-edge",     env: "prod",    sha: "78a0bc4", status: "DEPLOYED" },
  { wk: "W25", svc: "scoring-svc",   env: "canary",  sha: "4d2f81b", status: "CANARY" },
  { wk: "W25", svc: "api-gateway",   env: "prod",    sha: "11ff009", status: "DEPLOYED" },
  { wk: "W25", svc: "payments-api",  env: "prod",    sha: "0bc91a7", status: "DEPLOYED" },
] as const;

const STATUS_COLOR: Record<string, string> = {
  DEPLOYED: "var(--fl-blue)",
  CANARY:   "#f5c451",
  ROLLBACK: "var(--fl-red)",
};

const DAY_MARKS = ["D+0", "D+30", "D+60", "D+90", "D+120", "D+150", "D+180"] as const;

const WhySection = () => {
  const { t } = useLanguage();

  return (
    <section id="why" className="fl-section" style={{ padding: "7rem 0 8rem", position: "relative", overflow: "hidden" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8" style={{ position: "relative", zIndex: 1 }}>
        {/* Header row */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem", flexWrap: "wrap", marginBottom: "3rem" }}>
          <div style={{ maxWidth: "44rem" }}>
            <p className="fl-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", margin: "0 0 1.25rem" }}>
              <span className="fl-dot" style={{ background: "var(--fl-red)" }} />
              {t("problem.diptych.eyebrow")}
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
              {t("problem.main.title")}{" "}
              <span className="fl-text-gradient">{t("problem.main.broken")}</span>
            </h2>
            <p style={{ fontSize: "1.0625rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, maxWidth: "36rem", margin: "1.25rem 0 0" }}>
              {t("problem.main.subtitle")}
            </p>
          </div>

          {/* Stat block */}
          <div style={{ textAlign: "right" }}>
            <span
              style={{
                fontSize: "clamp(54px, 6.4vw, 92px)",
                fontWeight: 300,
                letterSpacing: "-0.03em",
                lineHeight: 1,
                display: "block",
              }}
              className="fl-text-gradient"
            >
              {t("problem.stat.value")}
            </span>
            <span className="fl-mono" style={{ fontSize: "0.75rem", letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", display: "block", marginTop: "0.5rem" }}>
              {t("problem.legend.stat")}
            </span>
          </div>
        </div>

        {/* Shared 52-week axis */}
        <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 6, padding: "1.25rem 1.5rem", background: "rgba(11,12,20,0.4)", marginBottom: "1.25rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span className="fl-mono" style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.45)" }}>52-WEEK AXIS · 2026</span>
            <span className="fl-mono" style={{ fontSize: "0.65rem", letterSpacing: "0.22em", color: "rgba(255,255,255,0.45)" }}>NOW · W27</span>
          </div>
          <svg viewBox="0 0 1000 60" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 56 }} role="img" aria-label="52-week axis with two pentest events and current scrub line at week 27">
            <defs>
              <linearGradient id="bv2-axis-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%"  stopColor="rgba(79,143,255,0.4)" />
                <stop offset="55%" stopColor="rgba(229,72,77,0.5)" />
                <stop offset="100%" stopColor="rgba(139,92,246,0.4)" />
              </linearGradient>
            </defs>
            <line x1="0" y1="34" x2="1000" y2="34" stroke="url(#bv2-axis-grad)" strokeWidth="1.2" opacity="0.85" />
            {Array.from({ length: 52 }).map((_, i) => {
              const x = (1000 / 52) * (i + 0.5);
              const big = i % 13 === 0;
              return <line key={i} x1={x} y1={big ? 28 : 31} x2={x} y2={big ? 40 : 37} stroke="rgba(255,255,255,0.18)" strokeWidth={big ? 1 : 0.7} />;
            })}
            {["Jan", "Apr", "Jul", "Oct"].map((m, idx) => (
              <text key={m} x={(1000 / 4) * idx + 24} y="56" fontSize="9" fill="rgba(255,255,255,0.45)" fontFamily="ui-monospace, monospace" letterSpacing="0.18em">{m.toUpperCase()}</text>
            ))}
            {/* Pentest diamonds at W2 + W29 */}
            {[2, 29].map((wk) => {
              const x = (1000 / 52) * wk;
              return (
                <g key={wk}>
                  <path d={`M ${x} 22 L ${x + 7} 34 L ${x} 46 L ${x - 7} 34 Z`} fill="rgba(229,72,77,0.85)" stroke="rgba(229,72,77,1)" strokeWidth="1" />
                  <text x={x} y="14" fontSize="8" fill="rgba(229,72,77,0.85)" fontFamily="ui-monospace, monospace" letterSpacing="0.2em" textAnchor="middle">PENTEST</text>
                </g>
              );
            })}
            {/* NOW scrub line at week 27 */}
            <line x1={(1000 / 52) * 27} y1="6" x2={(1000 / 52) * 27} y2="50" stroke="#fff" strokeWidth="1.2" strokeDasharray="2 3" opacity="0.85" />
            <text x={(1000 / 52) * 27 + 6} y="12" fontSize="8" fill="#fff" fontFamily="ui-monospace, monospace" letterSpacing="0.22em">NOW</text>
          </svg>
        </div>

        {/* Diptych */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "1.25rem" }}>
          {/* Left — Release log */}
          <div style={{ border: "1px solid rgba(79,143,255,0.18)", borderRadius: 6, background: "rgba(79,143,255,0.025)", padding: "1.5rem", position: "relative", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <p className="fl-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", margin: 0, color: "var(--fl-blue)" }}>
                <span className="fl-dot fl-pulse-dot" style={{ background: "var(--fl-blue)" }} />
                RELEASE LOG
              </p>
              <span className="fl-mono" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>
                {t("problem.diptych.left")}
              </span>
            </div>
            <div className="fl-mono" style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.85)", lineHeight: 1.55 }}>
              <div style={{ display: "grid", gridTemplateColumns: "44px 1.6fr 80px 90px 96px", gap: "0.5rem", padding: "0.5rem 0", color: "rgba(255,255,255,0.4)", letterSpacing: "0.18em", textTransform: "uppercase", borderBottom: "1px dashed rgba(255,255,255,0.1)" }}>
                <span>WEEK</span>
                <span>SERVICE</span>
                <span>ENV</span>
                <span>COMMIT</span>
                <span>STATUS</span>
              </div>
              {RELEASE_ROWS.map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "44px 1.6fr 80px 90px 96px",
                    gap: "0.5rem",
                    padding: "0.45rem 0",
                    borderBottom: "1px dashed rgba(255,255,255,0.05)",
                    alignItems: "center",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.5)" }}>{row.wk}</span>
                  <span style={{ color: "#fff" }}>{row.svc}</span>
                  <span style={{ color: "rgba(255,255,255,0.55)" }}>{row.env}</span>
                  <span style={{ color: "rgba(255,255,255,0.45)" }}>{row.sha}</span>
                  <span
                    style={{
                      color: STATUS_COLOR[row.status],
                      fontSize: "0.65rem",
                      letterSpacing: "0.15em",
                      padding: "2px 6px",
                      border: `1px solid ${STATUS_COLOR[row.status]}33`,
                      borderRadius: 3,
                      justifySelf: "start",
                    }}
                  >
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — Pentest day-ruler */}
          <div style={{ border: "1px solid rgba(229,72,77,0.2)", borderRadius: 6, background: "rgba(229,72,77,0.03)", padding: "1.5rem", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <p className="fl-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", margin: 0, color: "var(--fl-red)" }}>
                <span className="fl-dot fl-pulse-dot" style={{ background: "var(--fl-red)" }} />
                AUDIT GAP
              </p>
              <span className="fl-mono" style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.55)" }}>
                {t("problem.diptych.pentest")} · JAN 14 → JUL 22
              </span>
            </div>

            {/* Focal counter */}
            <div style={{ textAlign: "center", padding: "1.5rem 0 1.25rem" }}>
              <p
                className="fl-mono"
                style={{
                  fontSize: "clamp(40px, 5.6vw, 78px)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  color: "var(--fl-red)",
                  margin: 0,
                  lineHeight: 1,
                }}
              >
                184d 07h 12m
              </p>
              <p className="fl-mono" style={{ fontSize: "0.72rem", letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(229,72,77,0.7)", margin: "0.75rem 0 0" }}>
                {t("problem.diptych.right")}
              </p>
            </div>

            {/* Day ruler */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "stretch", marginTop: "1rem", padding: "0 0.25rem" }}>
              {DAY_MARKS.map((mark, i) => (
                <div key={mark} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", flex: 1 }}>
                  <div style={{ width: 1, height: i === 0 || i === DAY_MARKS.length - 1 ? 18 : 12, background: i === 0 || i === DAY_MARKS.length - 1 ? "var(--fl-red)" : "rgba(255,255,255,0.2)" }} />
                  <span className="fl-mono" style={{ fontSize: "0.65rem", letterSpacing: "0.16em", color: i === 0 || i === DAY_MARKS.length - 1 ? "rgba(229,72,77,0.85)" : "rgba(255,255,255,0.45)" }}>
                    {mark}
                  </span>
                </div>
              ))}
            </div>

            {/* Chip labels */}
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.75rem" }}>
              <span className="fl-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", padding: "3px 8px", border: "1px solid rgba(229,72,77,0.45)", color: "rgba(229,72,77,0.85)", borderRadius: 3 }}>
                {t("problem.diptych.pentest")} · JAN 14
              </span>
              <span className="fl-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.2em", padding: "3px 8px", border: "1px solid rgba(229,72,77,0.45)", color: "rgba(229,72,77,0.85)", borderRadius: 3 }}>
                {t("problem.diptych.pentest")} · JUL 22
              </span>
            </div>
          </div>
        </div>

        {/* Problem strip — 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "1.25rem", marginTop: "2.5rem" }}>
          {[
            { num: "01", color: "var(--fl-blue)",   title: t("problem.delay.title"),    desc: t("problem.delay.desc") },
            { num: "02", color: "var(--fl-violet)", title: t("problem.friction.title"), desc: t("problem.friction.desc") },
            { num: "03", color: "var(--fl-red)",    title: t("problem.cost.title"),     desc: t("problem.cost.desc") },
          ].map((p) => (
            <div
              key={p.num}
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 6,
                background: "rgba(255,255,255,0.02)",
                padding: "1.5rem",
                position: "relative",
              }}
            >
              <div style={{ position: "absolute", top: -1, left: "1.5rem", width: "30%", height: 1, background: p.color, opacity: 0.5 }} />
              <span className="fl-mono" style={{ fontSize: "1.625rem", color: p.color, fontWeight: 300, letterSpacing: "-0.02em", display: "block", marginBottom: "0.75rem" }}>
                {p.num}
              </span>
              <h3 style={{ fontSize: "1.125rem", fontWeight: 500, color: "#fff", margin: "0 0 0.5rem" }}>{p.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.55)", lineHeight: 1.55, margin: 0, fontSize: "0.9375rem" }}>{p.desc}</p>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", marginTop: "2.5rem", fontSize: "0.9375rem", color: "rgba(255,255,255,0.5)" }}>
          {t("problem.exposure")}
        </p>
      </div>
    </section>
  );
};

export default WhySection;
