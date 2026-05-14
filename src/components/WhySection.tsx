import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { staggerContainer, staggerItem } from "@/lib/animations";
import CountUp from "@/components/motion/CountUp";

type Status = "UNAUDITED" | "STAGING" | "DEPLOYED" | "CANARY" | "ROLLBACK";

type Release = {
  date: string;
  service: string;
  type: string;
  sha: string;
  version: string;
  status: Status;
};

const STATUS_COLOR: Record<Status, string> = {
  UNAUDITED: "rgba(229,72,77,0.85)",
  STAGING: "rgba(245,196,81,0.85)",
  DEPLOYED: "rgba(79,143,255,0.85)",
  CANARY: "rgba(245,196,81,0.85)",
  ROLLBACK: "rgba(229,72,77,0.9)",
};

const SERVICES = ["api", "web", "billing", "auth", "edge", "search", "notify", "graphql", "scoring", "payments", "infra"];
const TYPES = ["chore", "feat", "fix", "perf", "refactor", "deps", "ci"];

function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function buildReleases(count: number): Release[] {
  const rand = rng(20260510);
  const out: Release[] = [];
  let day = 200; // Jan ≈ 14, count backwards into early year
  for (let i = 0; i < count; i++) {
    if (rand() < 0.4) day -= 1;
    const hh = String(Math.floor(rand() * 24)).padStart(2, "0");
    const mm = String(Math.floor(rand() * 60)).padStart(2, "0");
    const month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"][Math.min(6, Math.floor((day - 1) / 30))];
    const d = String((day % 30) + 1).padStart(2, "0");
    const svc = SERVICES[Math.floor(rand() * SERVICES.length)];
    const type = TYPES[Math.floor(rand() * TYPES.length)];
    const sha = Math.floor(rand() * 0xffffffff).toString(16).slice(0, 7).padEnd(7, "0");
    const major = 4;
    const minor = 8 + Math.floor(rand() * 6);
    const patch = Math.floor(rand() * 30);
    const r = rand();
    const status: Status =
      r < 0.78 ? "UNAUDITED" :
      r < 0.87 ? "STAGING" :
      r < 0.93 ? "DEPLOYED" :
      r < 0.97 ? "CANARY" :
      "ROLLBACK";
    out.push({
      date: `${month} ${d} ${hh}:${mm}`,
      service: svc,
      type,
      sha,
      version: `v${major}.${minor}.${patch}`,
      status,
    });
  }
  return out;
}

const RELEASES = buildReleases(60);
const LOOP = [...RELEASES, ...RELEASES]; // duplicate for seamless -50% loop

const DAY_RULER = [
  { label: "D + 0",   right: "JAN 14 · last pentest", tone: "pentest" as const, big: true },
  { label: "D + 30",  right: "~ 96 deploys",          tone: "tick"    as const },
  { label: "D + 60",  right: "~ 192 deploys",         tone: "tick"    as const },
  { label: "D + 90",  right: "~ 288 deploys",         tone: "tick"    as const },
  { label: "D + 120", right: "~ 384 deploys",         tone: "tick"    as const },
  { label: "D + 150", right: "~ 480 deploys",         tone: "tick"    as const },
  { label: "D + 184", right: "TODAY · WEEK 27",       tone: "now"     as const },
  { label: "D + 220", right: "JUL 22 · scheduled",    tone: "pentest" as const, faint: true },
];

const WhySection = () => {
  const { t } = useLanguage();

  return (
    <section id="why" className="fl-section" style={{ padding: "6rem 0 7rem", position: "relative", overflow: "hidden", scrollMarginTop: "5rem" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8" style={{ position: "relative", zIndex: 1 }}>
        {/* Header row */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "3rem", flexWrap: "wrap", marginBottom: "2rem" }}
        >
          <motion.div variants={staggerItem} style={{ maxWidth: "44rem" }}>
            <p className="fl-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", margin: "0 0 1rem", color: "rgba(255,255,255,0.45)", letterSpacing: "0.16em", fontSize: "10.5px" }}>
              <span className="fl-dot" style={{ background: "var(--fl-red)" }} />
              {t("problem.diptych.eyebrow")}
            </p>
            <h2
              style={{
                fontSize: "clamp(26px, 2.65vw, 36px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "#fff",
                margin: 0,
              }}
            >
              {t("problem.main.title")}{" "}
              <span className="fl-text-gradient">{t("problem.main.broken")}</span>
            </h2>
          </motion.div>
          <motion.p variants={staggerItem} style={{ fontSize: "14.5px", color: "rgba(255,255,255,0.5)", lineHeight: 1.65, maxWidth: "360px", margin: 0 }}>
            {t("problem.main.subtitle")}
          </motion.p>
        </motion.div>

        {/* Shared 52-week axis card — desktop only */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 }}
          className="hidden md:block"
          style={{ background: "rgba(15,16,28,0.6)", border: "1px solid rgba(255,255,255,0.07)", padding: "22px 28px 20px", marginBottom: "1.5rem", borderRadius: 4 }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
            <span className="fl-mono" style={{ fontSize: 10.5, letterSpacing: "0.22em", color: "rgba(255,255,255,0.48)" }}>52-WEEK AXIS · 2026</span>
            <span className="fl-mono" style={{ fontSize: 10.5, letterSpacing: "0.22em", color: "rgba(255,255,255,0.48)", display: "inline-flex", alignItems: "center", gap: 8 }}>
              <span className="fl-pulse-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
              NOW · W27
            </span>
          </div>
          <svg viewBox="0 0 1000 56" preserveAspectRatio="none" style={{ display: "block", width: "100%", height: 52 }} role="img" aria-label="52-week axis with pentest events at week 2 and week 29">
            <defs>
              <linearGradient id="bv2-heat" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="rgba(229,72,77,0)" />
                <stop offset="50%" stopColor="rgba(229,72,77,0.22)" />
                <stop offset="100%" stopColor="rgba(229,72,77,0)" />
              </linearGradient>
            </defs>
            <rect x="0" y="22" width="1000" height="12" fill="url(#bv2-heat)" />
            <line x1="0" y1="28" x2="1000" y2="28" stroke="rgba(255,255,255,0.1)" strokeWidth="0.6" />
            {Array.from({ length: 52 }).map((_, i) => {
              const x = (1000 / 52) * (i + 0.5);
              const major = i % 13 === 0;
              return <line key={i} x1={x} y1={major ? 18 : 21} x2={x} y2={major ? 38 : 35} stroke={major ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.1)"} strokeWidth="1" />;
            })}
            {/* Pentest markers at W2 and W29 — blue square boxes */}
            {[2, 29].map((wk) => {
              const x = (1000 / 52) * wk;
              return (
                <g key={wk}>
                  <rect x={x - 9} y="17" width="18" height="18" rx="2" fill="rgba(79,143,255,0.18)" stroke="rgba(79,143,255,0.85)" strokeWidth="1" />
                  <path d={`M ${x - 4} 26 L ${x - 1} 29 L ${x + 5} 21`} stroke="rgba(79,143,255,1)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              );
            })}
            {/* NOW indicator at W27 — 1px line + 8px dot */}
            <line x1={(1000 / 52) * 27} y1="10" x2={(1000 / 52) * 27} y2="46" stroke="rgba(255,255,255,0.55)" strokeWidth="1" />
            <rect x={(1000 / 52) * 27 - 4} y="6" width="8" height="8" rx="1" fill="#fff" />
          </svg>
          <div className="fl-mono" style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", marginTop: 14, fontSize: 10.5, letterSpacing: "0.22em", color: "rgba(255,255,255,0.38)" }}>
            {["JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC"].map((m) => (
              <span key={m} style={{ textAlign: "center" }}>{m}</span>
            ))}
          </div>
        </motion.div>

        {/* Diptych */}
        <div className="grid grid-cols-1 lg:grid-cols-2" style={{ gap: "1.5rem", alignItems: "stretch" }}>
          {/* Left — Release cadence */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
            className="h-[360px] sm:h-[420px]"
            style={{ background: "rgba(15,16,28,0.55)", padding: "18px 16px", display: "flex", flexDirection: "column", overflow: "hidden" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <p className="fl-mono" style={{ margin: 0, fontSize: 10, letterSpacing: "0.2em", color: "rgba(79,143,255,0.85)" }}>RELEASE CADENCE</p>
                <p style={{ margin: "8px 0 0", display: "flex", alignItems: "baseline", gap: 8 }}>
                  <CountUp to={247} duration={1.4} style={{ fontSize: 32, fontWeight: 300, color: "#fff", lineHeight: 1, letterSpacing: "-0.01em" }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>YTD · 3.2 / day</span>
                </p>
              </div>
              <span className="fl-mono" style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em" }}>PROD · EU-WEST-1</span>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
              {/* Desktop: full 6-col grid */}
              <div className="hidden sm:flex" style={{ flexDirection: "column", flex: 1, minHeight: 0 }}>
                <div className="fl-mono" style={{ display: "grid", gridTemplateColumns: "88px 56px 60px 70px 70px 1fr", gap: 8, fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.32)", paddingBottom: 8, borderBottom: "1px dashed rgba(255,255,255,0.08)" }}>
                  <span>TIME</span><span>SERVICE</span><span>TYPE</span><span>SHA</span><span>VERSION</span><span>STATUS</span>
                </div>
                <div style={{ flex: 1, overflow: "hidden", position: "relative", marginTop: 6 }}>
                  <div className="fl-mono why-track" style={{ fontSize: 11, lineHeight: "22px", color: "rgba(255,255,255,0.85)" }}>
                    {LOOP.map((r, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "88px 56px 60px 70px 70px 1fr", gap: 8, padding: "2px 0" }}>
                        <span style={{ color: "rgba(255,255,255,0.55)" }}>{r.date}</span>
                        <span style={{ color: "rgba(255,255,255,0.9)" }}>{r.service}</span>
                        <span style={{ color: "rgba(255,255,255,0.55)" }}>{r.type}</span>
                        <span style={{ color: "rgba(255,255,255,0.55)" }}>{r.sha}</span>
                        <span style={{ color: "rgba(255,255,255,0.55)" }}>{r.version}</span>
                        <span style={{ color: STATUS_COLOR[r.status], letterSpacing: "0.12em" }}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* Mobile: condensed 4-col (time, service, version, status) */}
              <div className="sm:hidden flex flex-col" style={{ flex: 1, minHeight: 0 }}>
                <div className="fl-mono" style={{ display: "grid", gridTemplateColumns: "72px 1fr 56px 64px", gap: 6, fontSize: 8.5, letterSpacing: "0.18em", color: "rgba(255,255,255,0.32)", paddingBottom: 8, borderBottom: "1px dashed rgba(255,255,255,0.08)" }}>
                  <span>TIME</span><span>SERVICE</span><span>VER</span><span>STATUS</span>
                </div>
                <div style={{ flex: 1, overflow: "hidden", position: "relative", marginTop: 6 }}>
                  <div className="fl-mono why-track" style={{ fontSize: 10.5, lineHeight: "22px", color: "rgba(255,255,255,0.85)" }}>
                    {LOOP.map((r, i) => (
                      <div key={i} style={{ display: "grid", gridTemplateColumns: "72px 1fr 56px 64px", gap: 6, padding: "2px 0" }}>
                        <span style={{ color: "rgba(255,255,255,0.55)" }}>{r.date}</span>
                        <span style={{ color: "rgba(255,255,255,0.9)" }}>{r.service}</span>
                        <span style={{ color: "rgba(255,255,255,0.55)" }}>{r.version}</span>
                        <span style={{ color: STATUS_COLOR[r.status], letterSpacing: "0.1em", fontSize: 9.5 }}>{r.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right — Pentest cadence + day ruler */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
            className="h-[420px]"
            style={{ background: "rgba(15,16,28,0.55)", padding: "18px 16px", position: "relative" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p className="fl-mono" style={{ margin: 0, fontSize: 10, letterSpacing: "0.2em", color: "rgba(229,72,77,0.85)" }}>PENTEST CADENCE</p>
                <p style={{ margin: "8px 0 0", display: "flex", alignItems: "baseline", gap: 8 }}>
                  <CountUp to={2} duration={1.0} style={{ fontSize: 32, fontWeight: 300, color: "#fff", lineHeight: 1, letterSpacing: "-0.01em" }} />
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", letterSpacing: "0.04em" }}>/ yr · 39 days of testing</span>
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p className="fl-mono" style={{ margin: 0, fontSize: 22, fontWeight: 400, color: "rgba(255,180,180,0.95)", letterSpacing: "-0.005em", lineHeight: 1.05 }}>
                  <CountUp to={184} duration={1.6} /><sup style={{ fontSize: 12, color: "rgba(255,180,180,0.6)", marginRight: 6, marginLeft: 1 }}>d</sup>
                  <CountUp to={7} duration={1.0} prefix="0" /><sup style={{ fontSize: 12, color: "rgba(255,180,180,0.6)", marginRight: 6, marginLeft: 1 }}>h</sup>
                  <CountUp to={12} duration={1.2} /><sup style={{ fontSize: 12, color: "rgba(255,180,180,0.6)", marginLeft: 1 }}>m</sup>
                </p>
                <p className="fl-mono" style={{ margin: "6px 0 0", fontSize: 9, letterSpacing: "0.22em", color: "rgba(255,180,180,0.55)" }}>SINCE LAST AUDIT</p>
              </div>
            </div>

            {/* Day ruler — vertical */}
            <div style={{ position: "relative", marginTop: 24, height: 250 }}>
              {/* Spine */}
              <div style={{ position: "absolute", left: "44%", top: 0, bottom: 0, width: 1, background: "linear-gradient(180deg, rgba(79,143,255,0.7) 0%, rgba(229,72,77,0.45) 8%, rgba(229,72,77,0.45) 92%, rgba(79,143,255,0.7) 100%)" }} />
              <div aria-hidden style={{ position: "absolute", left: "calc(44% - 12px)", top: 0, bottom: 0, width: 24, background: "radial-gradient(rgba(229,72,77,0.18), rgba(229,72,77,0) 70%)", pointerEvents: "none" }} />

              {DAY_RULER.map((row, idx) => {
                const top = (idx / (DAY_RULER.length - 1)) * 100;
                const isNow = row.tone === "now";
                const isPentest = row.tone === "pentest";
                const leftColor = isNow ? "#fff" : isPentest ? "rgba(79,143,255,0.85)" : "rgba(255,255,255,0.32)";
                const rightColor = isNow ? "#fff" : isPentest ? "rgba(79,143,255,0.85)" : "rgba(229,72,77,0.55)";
                return (
                  <div key={idx} style={{ position: "absolute", top: `${top}%`, left: 0, right: 0, transform: "translateY(-50%)", display: "grid", gridTemplateColumns: "calc(44% - 12px) 24px 1fr", alignItems: "center", gap: 0 }}>
                    <span className="fl-mono" style={{ textAlign: "right", paddingRight: 8, fontSize: 10, letterSpacing: "0.16em", color: leftColor, opacity: row.faint ? 0.55 : 1 }}>{row.label}</span>
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      {isPentest && !row.faint && (
                        <span style={{ width: 14, height: 14, background: "rgba(79,143,255,0.18)", border: "1px solid rgba(79,143,255,0.85)", borderRadius: 2 }} />
                      )}
                      {isPentest && row.faint && (
                        <span style={{ width: 14, height: 14, background: "rgba(79,143,255,0.06)", border: "1px solid rgba(79,143,255,0.45)", borderRadius: 2 }} />
                      )}
                      {isNow && <span style={{ width: 10, height: 10, background: "#fff", borderRadius: 1 }} />}
                      {row.tone === "tick" && <span style={{ width: 8, height: 1, background: "rgba(229,72,77,0.6)" }} />}
                    </div>
                    <span className="fl-mono" style={{ paddingLeft: 10, fontSize: 10.5, letterSpacing: "0.12em", color: rightColor, opacity: row.faint ? 0.7 : 1 }}>{row.right}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* SVG connector — desktop only (built for 3-col grid) */}
        <svg viewBox="0 0 1000 28" preserveAspectRatio="none" className="hidden md:block" style={{ width: "100%", height: 28, marginTop: "1rem" }} aria-hidden>
          <path d="M250 0 C 250 16, 166.66 16, 166.66 28" stroke="rgba(79,143,255,0.5)" strokeWidth="1" fill="none" />
          <path d="M500 0 C 500 16, 500 16, 500 28" stroke="rgba(139,92,246,0.5)" strokeWidth="1" fill="none" />
          <path d="M750 0 C 750 16, 833.33 16, 833.33 28" stroke="rgba(229,72,77,0.5)" strokeWidth="1" fill="none" />
        </svg>

        {/* Problem strip — 3 cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.15 } } }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 px-0 md:px-5"
          style={{ paddingTop: "1.25rem" }}
        >
          {[
            { num: "01", color: "var(--fl-blue)",   title: t("problem.delay.title"),    desc: t("problem.delay.desc") },
            { num: "02", color: "var(--fl-violet)", title: t("problem.friction.title"), desc: t("problem.friction.desc") },
            { num: "03", color: "var(--fl-red)",    title: t("problem.cost.title"),     desc: t("problem.cost.desc") },
          ].map((p) => (
            <motion.div
              key={p.num}
              variants={staggerItem}
              style={{ background: "transparent", border: 0, padding: 0 }}
            >
              <span className="fl-mono" style={{ fontSize: 22, color: p.color, fontWeight: 400, letterSpacing: "-0.01em", display: "block", marginBottom: 6 }}>
                {p.num}
              </span>
              <h3 style={{ fontSize: 16, fontWeight: 400, color: "#F6F6FB", margin: "0 0 6px" }}>{p.title}</h3>
              <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: 1.55, margin: 0, fontSize: 13.5, fontWeight: 300 }}>{p.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </section>
  );
};

export default WhySection;
