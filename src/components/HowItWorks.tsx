import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { staggerContainer, staggerItem } from "@/lib/animations";
import CountUp from "@/components/motion/CountUp";

const STAGE_COLORS = {
  blue: "#4F8FFF",
  red: "#E5484D",
  violet: "#8B5CF6",
} as const;

const ASSETS = [
  { name: "acme.com",            tag: "APEX" },
  { name: "*.api.acme.com",      tag: "WILDCARD" },
  { name: "10.42.0.0/16",        tag: "CIDR" },
  { name: "admin.acme.io",       tag: "SUBDOMAIN" },
  { name: "sso.acme.com",        tag: "SUBDOMAIN" },
];

const STDOUT_LINES = [
  { t: "14:32:04", agent: "AGENT-7", msg: "recon → nginx 1.18.0 detected" },
  { t: "14:32:11", agent: "AGENT-7", msg: "CVE-2021-23017 candidate" },
  { t: "14:32:24", agent: "AGENT-7", msg: "crafting payload · stage 1/3" },
  { t: "14:32:48", agent: "AGENT-7", msg: "PoC successful · RCE confirmed" },
  { t: "14:33:02", agent: "AGENT-3", msg: "lateral · /api/internal exposed" },
  { t: "14:33:19", agent: "AGENT-3", msg: "priv-esc → admin token" },
];

const AssetListPanel = () => (
  <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.016)", borderRadius: 10, padding: 17 }}>
    <p className="fl-mono" style={{ margin: "0 0 14px", fontSize: 9.5, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)" }}>ASSETS · 5 / 247</p>
    {ASSETS.map((a) => (
      <div key={a.name} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "11px 0", borderBottom: "1px dashed rgba(255,255,255,0.06)" }}>
        <span className="fl-mono" style={{ fontSize: 12, color: "rgba(255,255,255,0.85)" }}>{a.name}</span>
        <span className="fl-mono" style={{ fontSize: 9.5, letterSpacing: "0.16em", color: "rgba(79,143,255,0.7)" }}>{a.tag}</span>
      </div>
    ))}
  </div>
);

const StdoutPanel = () => (
  <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.016)", borderRadius: 10, padding: 17 }}>
    <p className="fl-mono" style={{ margin: "0 0 12px", fontSize: 9.5, letterSpacing: "0.2em", color: "rgba(255,255,255,0.35)" }}>STDOUT · ENGAGEMENT</p>
    <div className="fl-mono" style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 11.5, lineHeight: 1.5 }}>
      {STDOUT_LINES.map((l, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "62px 62px 1fr", gap: 6 }}>
          <span style={{ color: "rgba(255,255,255,0.35)" }}>{l.t}</span>
          <span style={{ color: STAGE_COLORS.red }}>{l.agent}</span>
          <span style={{ color: "rgba(255,255,255,0.85)" }}>{l.msg}</span>
        </div>
      ))}
    </div>
    <p className="fl-mono" style={{ margin: "14px 0 0", fontSize: 9.5, letterSpacing: "0.18em", color: STAGE_COLORS.red, display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: STAGE_COLORS.red }} />
      ATTACK CHAIN VALIDATED
    </p>
  </div>
);

const FindingPanel = () => (
  <div style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.016)", borderRadius: 10, padding: 17 }}>
    <div className="fl-mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "rgba(255,255,255,0.35)", marginBottom: 12 }}>
      <span>FINDING #017</span>
      <span>FL-2026-0184</span>
    </div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 8 }}>
      <span className="fl-mono" style={{ fontSize: 10, letterSpacing: "0.2em", color: STAGE_COLORS.red }}>CRITICAL</span>
      <span className="fl-mono" style={{ fontSize: 13, color: "#fff", letterSpacing: "-0.01em" }}>IDOR · /api/orgs/{`{id}`}</span>
    </div>
    <div style={{ height: 1, background: "rgba(139,92,246,0.2)", margin: "10px 0 14px" }} />
    <p className="fl-mono" style={{ margin: 0, fontSize: 11, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>
      Authenticated tenant A reads tenant B's billing, invoices, and invitations by id-substitution.
    </p>
    <div className="fl-mono" style={{ display: "grid", gridTemplateColumns: "auto auto auto", gap: 18, marginTop: 16, fontSize: 9, letterSpacing: "0.18em", color: "rgba(180,160,255,0.9)" }}>
      <span>PoC ✓</span>
      <span>BUSINESS IMPACT</span>
      <span>REMEDIATION</span>
    </div>
    <p className="fl-mono" style={{ margin: "14px 0 0", fontSize: 9.5, letterSpacing: "0.18em", color: STAGE_COLORS.violet, display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: STAGE_COLORS.violet }} />
      AUDIT-GRADE · DELIVERED
    </p>
  </div>
);

type Stage = {
  num: "01" | "02" | "03";
  color: string;
  rgb: string;
  timestamp: string;
  durationKey: string;
  ended: string;
  titleKey: string;
  descKey: string;
  stats: { value: string; label: string }[];
  Panel: () => JSX.Element;
};

const HowItWorks = () => {
  const { t } = useLanguage();

  const stages: Stage[] = [
    {
      num: "01",
      color: STAGE_COLORS.blue,
      rgb: "79,143,255",
      timestamp: "T+00:00",
      durationKey: "process.deploy.duration",
      ended: "ENDED 14:36 UTC",
      titleKey: "process.deploy.title",
      descKey: "process.deploy.desc",
      stats: [
        { value: "247", label: "ASSETS DISCOVERED" },
        { value: "38",  label: "SUBDOMAINS" },
        { value: "11",  label: "OPEN PORTS" },
      ],
      Panel: AssetListPanel,
    },
    {
      num: "02",
      color: STAGE_COLORS.red,
      rgb: "229,72,77",
      timestamp: "T+00:04",
      durationKey: "process.attack.duration",
      ended: "ENDED 18:18 UTC",
      titleKey: "process.attack.title",
      descKey: "process.attack.desc",
      stats: [
        { value: "12", label: "AGENTS DISPATCHED" },
        { value: "47", label: "PoC ATTEMPTS" },
        { value: "17", label: "CHAINS VALID" },
      ],
      Panel: StdoutPanel,
    },
    {
      num: "03",
      color: STAGE_COLORS.violet,
      rgb: "139,92,246",
      timestamp: "T+04:18",
      durationKey: "process.exploits.duration",
      ended: "DELIVERED 14:42 UTC",
      titleKey: "process.exploits.title",
      descKey: "process.exploits.desc",
      stats: [
        { value: "17", label: "FINDINGS" },
        { value: "0",  label: "FALSE POSITIVES" },
        { value: "1",  label: "PDF · SIGNED" },
      ],
      Panel: FindingPanel,
    },
  ];

  return (
    <section className="fl-section fl-section--solid" style={{ padding: "3.5rem 0 4.5rem", position: "relative", overflow: "hidden" }}>
      <div className="max-w-[1280px] mx-auto px-4 md:px-8" style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", gap: "2rem", flexWrap: "wrap", marginBottom: "1.75rem" }}
        >
          <motion.div variants={staggerItem} style={{ maxWidth: "44rem" }}>
            <p className="fl-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", margin: "0 0 1rem", color: "rgba(255,255,255,0.55)", letterSpacing: "0.28em", fontSize: 11 }}>
              <span className="fl-dot" style={{ background: STAGE_COLORS.blue }} />
              {t("process.eyebrow")}
            </p>
            <h2
              style={{
                fontSize: "clamp(26px, 2.65vw, 36px)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.12,
                color: "#fff",
                margin: 0,
              }}
            >
              {t("process.main.title")}{" "}
              <span className="fl-text-gradient">{t("process.main.works")}</span>
            </h2>
            <p style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", lineHeight: 1.6, maxWidth: "32rem", margin: "0.85rem 0 0" }}>
              {t("process.main.subtitle")}
            </p>
          </motion.div>
          <motion.div variants={staggerItem} className="fl-mono" style={{ textAlign: "right", fontSize: 10, letterSpacing: "0.22em" }}>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.45)" }}>RUN #FL-2026-0184</p>
            <p style={{ margin: "4px 0 0", color: "#fff" }}>04 H 42 M END-TO-END</p>
          </motion.div>
        </motion.div>

        {/* Top elapsed-time bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.2 }}
          style={{ marginBottom: "2.25rem" }}
        >
          <div className="fl-mono" style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, letterSpacing: "0.22em", color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
            <span>T+00:00</span>
            <span>T+02:21</span>
            <span>T+04:42</span>
          </div>
          <div style={{ display: "flex", height: 4, borderRadius: 2, overflow: "hidden", background: "rgba(255,255,255,0.05)" }}>
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "1.5%" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.4 }}
              style={{ background: STAGE_COLORS.blue }}
            />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "90%" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.55 }}
              style={{ background: STAGE_COLORS.red }}
            />
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: "8.5%" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94], delay: 1.7 }}
              style={{ background: STAGE_COLORS.violet }}
            />
          </div>
        </motion.div>

        {/* Stages */}
        <div style={{ position: "relative" }}>
          {/* Vertical rail */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 110,
              top: 12,
              bottom: 12,
              width: 1,
              background: `linear-gradient(180deg, ${STAGE_COLORS.blue} 0%, ${STAGE_COLORS.red} 30%, ${STAGE_COLORS.red} 70%, ${STAGE_COLORS.violet} 100%)`,
              opacity: 0.85,
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
            {stages.map((s, idx) => (
              <motion.div
                key={s.num}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.05 * idx } },
                }}
                style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 0, alignItems: "start", position: "relative" }}
              >
                {/* Left rail */}
                <div style={{ position: "relative", paddingRight: 24 }}>
                  {/* Node */}
                  <motion.span
                    aria-hidden
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [0, 1.25, 1] }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, times: [0, 0.7, 1], ease: [0.25, 0.46, 0.45, 0.94], delay: 0.15 + idx * 0.05 }}
                    style={{
                      position: "absolute",
                      top: 4,
                      right: -8,
                      width: 17,
                      height: 17,
                      borderRadius: "50%",
                      background: s.color,
                      boxShadow: `0 0 0 5px var(--fl-bg), 0 0 0 11px rgba(${s.rgb}, 0.18)`,
                    }}
                  />
                  <p className="fl-mono" style={{ margin: 0, fontSize: 12.5, letterSpacing: "0.12em", color: s.color, textAlign: "right" }}>{s.timestamp}</p>
                  <p className="fl-mono" style={{ margin: "8px 0 0", fontSize: 9.5, letterSpacing: "0.18em", color: s.color, textAlign: "right" }}>{t(s.durationKey)}</p>
                  <p className="fl-mono" style={{ margin: "12px 0 0", fontSize: 9, letterSpacing: "0.18em", color: "rgba(255,255,255,0.35)", textAlign: "right" }}>{s.ended}</p>
                </div>

                {/* Right content + artifact */}
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]" style={{ gap: 28, paddingLeft: 32 }}>
                  <div>
                    <p className="fl-mono" style={{ margin: "0 0 12px", fontSize: 10, letterSpacing: "0.24em" }}>
                      <span style={{ color: s.color }}>{s.num}</span>
                      <span style={{ color: "rgba(255,255,255,0.45)" }}> · STAGE</span>
                    </p>
                    <h3 style={{ fontSize: 22, fontWeight: 400, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.015em" }}>{t(s.titleKey)}</h3>
                    <p style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.55, margin: 0, fontSize: 13.5, maxWidth: 440 }}>{t(s.descKey)}</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24, marginTop: 18 }}>
                      {s.stats.map((st, i) => {
                        const n = Number(st.value);
                        const isNumeric = !Number.isNaN(n);
                        return (
                          <div key={i}>
                            <p style={{ margin: 0, fontSize: 22, fontWeight: 400, color: "#fff", letterSpacing: "-0.02em", lineHeight: 1 }}>
                              {isNumeric ? (
                                <CountUp to={n} duration={1.2} separator={n >= 1000 ? "," : ""} />
                              ) : (
                                st.value
                              )}
                            </p>
                            <p className="fl-mono" style={{ margin: "6px 0 0", fontSize: 9, letterSpacing: "0.2em", color: "rgba(255,255,255,0.5)" }}>{st.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div>
                    <s.Panel />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
