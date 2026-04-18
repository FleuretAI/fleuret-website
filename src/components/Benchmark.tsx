import { useLanguage } from "@/contexts/LanguageContext";

const Benchmark = () => {
  const { t } = useLanguage();
  const features = [
    { num: "01", color: "var(--accent-blue)",   title: t("platform.asm.title"),      desc: t("platform.asm.desc") },
    { num: "02", color: "var(--accent-violet)", title: t("platform.pentest.title"),  desc: t("platform.pentest.desc") },
    { num: "03", color: "var(--accent-blue)",   title: t("platform.scanners.title"), desc: t("platform.scanners.desc") },
    { num: "04", color: "var(--accent-violet)", title: t("platform.reports.title"),  desc: t("platform.reports.desc") },
  ];
  return (
    <section id="platform" className="section-elevated grid-fade py-16 md:py-24 lg:py-32" style={{ position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: 0, right: 0, width: 600, height: 600, background: "radial-gradient(ellipse at top right, rgba(139,92,246,0.06), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, width: 400, height: 400, background: "radial-gradient(ellipse at bottom left, rgba(79,143,255,0.04), transparent 70%)", pointerEvents: "none" }} />
      <div className="max-w-[1280px] mx-auto px-4 md:px-8" style={{ position: "relative", zIndex: 10 }}>
        <div style={{ textAlign: "center", maxWidth: "56rem", margin: "0 auto 4rem" }}>
          <h2 style={{ fontSize: "clamp(1.875rem, 4.5vw, 3.75rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1 }}>
            <span style={{ color: "#fff" }}>{t("platform.main.title")}</span>{" "}
            <span className="text-gradient-accent">{t("platform.main.highlight")}</span>
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, maxWidth: "42rem", margin: "1rem auto 0" }}>
            {t("platform.main.subtitle")}
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4 max-w-[72rem] mx-auto">
          {features.map((f) => (
            <div key={f.num} style={{ padding: "2rem", borderRadius: "1rem", border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", transition: "all 0.3s", cursor: "default" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}>
              <span style={{ fontSize: "1.875rem", fontWeight: 300, opacity: 0.3, display: "block", marginBottom: "1rem", lineHeight: 1, letterSpacing: "-0.02em", color: f.color }}>{f.num}</span>
              <h3 style={{ color: "#fff", fontWeight: 400, marginBottom: "0.5rem", fontSize: "1.125rem" }}>{f.title}</h3>
              <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Benchmark;
