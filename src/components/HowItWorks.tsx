import { useLanguage } from "@/contexts/LanguageContext";

const DEMO_URL = "https://calendar.app.google/H9GMsaSvZMhwRbueA";

const IllustrationDeploy = () => (
  <svg viewBox="0 0 280 280" fill="none" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
    <circle cx="140" cy="140" r="110" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25"/>
    <circle cx="140" cy="140" r="80" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="6 8">
      <animateTransform attributeName="transform" type="rotate" from="0 140 140" to="360 140 140" dur="30s" repeatCount="indefinite"/>
    </circle>
    <line x1="140" y1="30" x2="140" y2="90" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.45"/>
    <line x1="140" y1="190" x2="140" y2="250" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.45"/>
    <line x1="30" y1="140" x2="90" y2="140" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.45"/>
    <line x1="190" y1="140" x2="250" y2="140" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.45"/>
    <line x1="140" y1="140" x2="60" y2="60" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25"/>
    <line x1="140" y1="140" x2="220" y2="60" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25"/>
    <line x1="140" y1="140" x2="60" y2="220" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25"/>
    <line x1="140" y1="140" x2="220" y2="220" stroke="currentColor" strokeWidth="1" strokeOpacity="0.25"/>
    <circle cx="60" cy="60" r="5" fill="currentColor" fillOpacity="0.3"/>
    <circle cx="220" cy="60" r="5" fill="currentColor" fillOpacity="0.3"/>
    <circle cx="60" cy="220" r="5" fill="currentColor" fillOpacity="0.3"/>
    <circle cx="220" cy="220" r="5" fill="currentColor" fillOpacity="0.3"/>
    <circle cx="140" cy="140" r="18" fill="currentColor" fillOpacity="0.15"/>
    <circle cx="140" cy="140" r="6" fill="currentColor" fillOpacity="0.5"/>
    <circle cx="140" cy="140" r="18" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3">
      <animate attributeName="r" values="18;45" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.3;0" dur="2s" repeatCount="indefinite"/>
    </circle>
  </svg>
);

const IllustrationAttack = () => (
  <svg viewBox="0 0 280 280" fill="none" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
    <g transform="translate(140,140)">
      <rect x="-32" y="-28" width="64" height="56" rx="6" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" fill="currentColor" fillOpacity="0.12"/>
      <line x1="-20" y1="-12" x2="20" y2="-12" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1"/>
      <line x1="-20" y1="0"   x2="20" y2="0"   stroke="currentColor" strokeWidth="1" strokeOpacity="0.1"/>
      <line x1="-20" y1="12"  x2="20" y2="12"  stroke="currentColor" strokeWidth="1" strokeOpacity="0.1"/>
      <g stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" strokeOpacity="0.15">
        <line x1="-80" y1="-60" x2="0" y2="0"/><line x1="70" y1="-75" x2="0" y2="0"/>
        <line x1="-90" y1="30"  x2="0" y2="0"/><line x1="85" y1="45"  x2="0" y2="0"/>
        <line x1="-30" y1="-90" x2="0" y2="0"/><line x1="40" y1="80"  x2="0" y2="0"/>
      </g>
      <g>
        <rect x="-86" y="-66" width="12" height="12" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" transform="rotate(45 -80 -60)"/>
        <circle cx="-80" cy="-60" r="2" fill="currentColor" fillOpacity="0.8"/>
        <rect x="64" y="-81" width="12" height="12" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" transform="rotate(45 70 -75)"/>
        <circle cx="70" cy="-75" r="2" fill="currentColor" fillOpacity="0.8"/>
        <rect x="-96" y="24" width="12" height="12" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" transform="rotate(45 -90 30)"/>
        <circle cx="-90" cy="30" r="2" fill="currentColor" fillOpacity="0.8"/>
        <rect x="79" y="39" width="12" height="12" rx="2" fill="currentColor" fillOpacity="0.2" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" transform="rotate(45 85 45)"/>
        <circle cx="85" cy="45" r="2" fill="currentColor" fillOpacity="0.8"/>
      </g>
      <circle cx="-18" cy="-22" r="3" fill="currentColor" fillOpacity="0.4"/>
      <circle cx="20"  cy="-10" r="3" fill="currentColor" fillOpacity="0.4"/>
      <circle cx="-8"  cy="18"  r="3" fill="currentColor" fillOpacity="0.4"/>
      <circle cx="0" cy="0" r="110" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.15" strokeDasharray="3 6"/>
    </g>
  </svg>
);

const IllustrationReport = () => (
  <svg viewBox="0 0 280 280" fill="none" style={{ width: "100%", maxWidth: 260, height: "auto" }}>
    <rect x="65" y="40" width="150" height="200" rx="8" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" fill="currentColor" fillOpacity="0.2"/>
    <rect x="85" y="60" width="60" height="8" rx="4" fill="currentColor" fillOpacity="0.25"/>
    <rect x="85" y="75" width="100" height="4" rx="2" fill="currentColor" fillOpacity="0.08"/>
    {[95,115,135,155,175].map((y) => (
      <g key={y}>
        <rect x="105" y={y} width={[90,70,80,60,75][Math.floor((y-95)/20)]} height="4" rx="2" fill="currentColor" fillOpacity="0.2"/>
        <circle cx="90" cy={y+2} r="6" fill="currentColor" fillOpacity="0.2"/>
        <path d={`M86 ${y+2} L89 ${y+5} L94 ${y-1}`} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.7" fill="none"/>
      </g>
    ))}
    <g>
      <circle cx="195" cy="220" r="22" fill="currentColor" fillOpacity="0.12"/>
      <circle cx="195" cy="220" r="22" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.25" fill="none"/>
      <path d="M195 206 L206 211 L206 222 C206 228 201 233 195 235 C189 233 184 228 184 222 L184 211 Z" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.6" fill="currentColor" fillOpacity="0.08"/>
      <path d="M189 221 L193 225 L201 216" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.6" fill="none"/>
    </g>
  </svg>
);

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    { num: "01", color: "var(--accent-blue)",   Illus: IllustrationDeploy, title: t("process.deploy.title"),   desc: t("process.deploy.desc"),   reverse: false },
    { num: "02", color: "var(--accent-red)",    Illus: IllustrationAttack, title: t("process.attack.title"),   desc: t("process.attack.desc"),   reverse: true },
    { num: "03", color: "var(--accent-violet)", Illus: IllustrationReport, title: t("process.exploits.title"), desc: t("process.exploits.desc"), reverse: false },
  ];

  return (
    <section className="py-16 md:py-24 lg:py-32">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div style={{ textAlign: "center", maxWidth: "56rem", margin: "0 auto 5rem" }}>
          <h2 style={{ fontSize: "clamp(1.875rem, 4.5vw, 3.75rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.1, color: "#fff" }}>
            {t("process.main.title")}{" "}
            <span className="text-gradient-accent">{t("process.main.works")}</span>
          </h2>
          <p style={{ fontSize: "1.125rem", color: "rgba(255,255,255,0.4)", maxWidth: "36rem", margin: "1rem auto 0", lineHeight: 1.7 }}>
            {t("process.main.subtitle")}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6rem", maxWidth: "64rem", margin: "0 auto" }}>
          {steps.map((step) => (
            <div
              key={step.num}
              className="grid md:grid-cols-2 gap-8 md:gap-16 items-center"
            >
              <div
                className="flex items-center justify-center"
                style={{ color: step.color, minHeight: 200, order: step.reverse ? 2 : 1 }}
              >
                <step.Illus />
              </div>
              <div style={{ order: step.reverse ? 1 : 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.2em", color: step.color }}>
                    {step.num}
                  </span>
                  <span style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.1)" }} />
                </div>
                <h3 style={{ fontSize: "clamp(1.5rem, 2.5vw, 1.875rem)", fontWeight: 300, letterSpacing: "-0.02em", color: "#fff", marginBottom: "1rem" }}>
                  {step.title}
                </h3>
                <p style={{ color: "rgba(255,255,255,0.4)", lineHeight: 1.7, fontSize: "1.125rem", margin: 0 }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
