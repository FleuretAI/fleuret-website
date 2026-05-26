import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ComparisonTable from "@/components/ComparisonTable";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerGroup from "@/components/motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";
import { SEO } from "@/seo/SEO";
import { DEMO_ROUTE } from "@/lib/routes";
import { trackCTAClick } from "@/lib/gtag";

/* ═══════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════ */

const processSteps = [
  { key: "step1", num: "01", label: "SCOPE", time: "T+00:00 · 60S", kpis: [{ k: "INPUTS", v: "3" }, { k: "SETUP", v: "~60s" }] },
  { key: "step2", num: "02", label: "RECON", time: "T+01:00 · 12 MIN", kpis: [{ k: "ENDPOINTS", v: "247" }, { k: "SUBDOMAINS", v: "38" }] },
  { key: "step3", num: "03", label: "EXECUTE", time: "T+13:00 · 1–6 HRS", kpis: [{ k: "AGENTS", v: "12–60" }, { k: "POC ATTEMPTS", v: "47" }] },
  { key: "step4", num: "04", label: "PROVE & REPORT", time: "T+71:30 · INSTANT", kpis: [{ k: "FINDINGS", v: "17" }, { k: "FALSE POS.", v: "0" }] },
] as const;

const terminalRows = [
  { t: "00:00.21", actor: "orchestrator", cls: "", msg: "scope locked · coverage graph initialized · 247 endpoints", status: "OK", statusCls: "text-green-400" },
  { t: "00:01.84", actor: "agent.recon", cls: "text-[var(--accent-blue)]", msg: "discovered 38 subdomains, 18 auth surfaces, 3 admin panels", status: "OK", statusCls: "text-green-400" },
  { t: "00:02.41", actor: "agent.authn.07", cls: "text-[var(--accent-blue)]", msg: "enumerating /v2/login · rate-limit confirmed · pivoting", status: "OK", statusCls: "text-green-400" },
  { t: "00:03.07", actor: "agent.idor.04", cls: "text-[var(--accent-violet)]", msg: "probing /v2/accounts/{id}/invoices · tenant boundary", status: "SUSP", statusCls: "text-amber-400" },
  { t: "00:03.41", actor: "validator", cls: "text-[var(--accent-red)]", msg: "requesting controlled PoC · non-destructive challenge", status: "OK", statusCls: "text-green-400" },
  { t: "00:03.92", actor: "validator", cls: "text-[var(--accent-red)]", msg: "cross-tenant read confirmed · evidence captured · signed", status: "CONFIRMED", statusCls: "text-red-400" },
  { t: "00:04.10", actor: "orchestrator", cls: "", msg: "finding F-014 promoted · DORA art.24 · severity high", status: "OK", statusCls: "text-green-400" },
  { t: "00:04.55", actor: "agent.authn.07", cls: "text-[var(--accent-blue)]", msg: "retired after mission · context flushed", status: "OK", statusCls: "text-green-400" },
] as const;

const archComponents = [
  { key: "emile", color: "red", dot: "bg-[var(--accent-red)]", title: "text-[#ff7a7e]", shadow: "shadow-[0_0_0_4px_rgba(229,72,77,0.18),0_0_22px_rgba(229,72,77,0.35)]", meta: ["ROLE · SUPERVISOR", "DETERMINISTIC"] },
  { key: "agents", color: "blue", dot: "bg-[var(--accent-blue)]", title: "text-[#88a4ff]", shadow: "shadow-[0_0_0_4px_rgba(62,99,221,0.20),0_0_22px_rgba(62,99,221,0.35)]", meta: ["ROLE · SPECIALISTS", "EPHEMERAL"] },
  { key: "validation", color: "violet", dot: "bg-[var(--accent-violet)]", title: "text-[#b1a3ff]", shadow: "shadow-[0_0_0_4px_rgba(124,102,220,0.18),0_0_22px_rgba(124,102,220,0.35)]", meta: ["ROLE · PROVER", "NON-DESTRUCTIVE"] },
  { key: "coverage", color: "blue", dot: "bg-[var(--accent-blue)]", title: "text-[#88a4ff]", shadow: "shadow-[0_0_0_4px_rgba(62,99,221,0.20),0_0_22px_rgba(62,99,221,0.35)]", meta: ["ROLE · STATE", "GRAPH + SCORING"] },
  { key: "reporter", color: "red", dot: "bg-[var(--accent-red)]", title: "text-[#ff7a7e]", shadow: "shadow-[0_0_0_4px_rgba(229,72,77,0.18),0_0_22px_rgba(229,72,77,0.35)]", meta: ["OUTPUT · SIGNED PDF", "DORA · NIS2 · ISO · SOC 2"] },
] as const;


const diffPoints = [
  { key: "point1", num: "01", sub: "SPECIALISTS", color: "blue", grad: "from-[#a4b8ff] to-[#3E63DD]", titleCls: "text-[#88a4ff]", chips: ["agent.authn", "agent.idor", "agent.injection", "agent.bizlogic", "agent.privesc", "+ 18 more"] },
  { key: "point2", num: "02", sub: "PROOF", color: "violet", grad: "from-[#c5b8ff] to-[#7C66DC]", titleCls: "text-[#b1a3ff]", chips: ["reproducible PoC", "controlled challenge", "non-destructive", "signed evidence"] },
  { key: "point3", num: "03", sub: "SOVEREIGN", color: "red", grad: "from-[#ff9ea1] to-[#E5484D]", titleCls: "text-[#ff7a7e]", chips: ["Scaleway · Paris", "open-weight", "no data egress", "model-agnostic"] },
] as const;

const productionPoints = [
  { key: "point1", dot: "bg-[var(--accent-blue)]", title: "text-[#88a4ff]", shadow: "shadow-[0_0_0_4px_rgba(62,99,221,0.20),0_0_22px_rgba(62,99,221,0.35)]", meta: ["GUARANTEE · NO WRITES", "READ-ONLY POCS"] },
  { key: "point2", dot: "bg-[var(--accent-violet)]", title: "text-[#b1a3ff]", shadow: "shadow-[0_0_0_4px_rgba(124,102,220,0.18),0_0_22px_rgba(124,102,220,0.35)]", meta: ["TRACE · PER REQUEST", "SHIPPED WITH REPORT"] },
  { key: "point3", dot: "bg-[var(--accent-red)]", title: "text-[#ff7a7e]", shadow: "shadow-[0_0_0_4px_rgba(229,72,77,0.18),0_0_22px_rgba(229,72,77,0.35)]", meta: ["SIGNED · ED25519", "DORA · NIS2"] },
] as const;

/* ═══════════════════════════════════════════════════════
   Small components
   ═══════════════════════════════════════════════════════ */

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2.5 font-mono text-[11.5px] tracking-[0.12em] uppercase text-white/50">
    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-red)] shadow-[0_0_0_3px_rgba(229,72,77,0.16)]" />
    {children}
  </span>
);

const Sep = () => <span className="text-white/25">·</span>;

const CardMeta = ({ left, right }: { left: string; right: string }) => (
  <div className="mt-5 pt-4 border-t border-dashed border-white/[0.14] flex justify-between gap-3 font-mono text-[11px] tracking-[0.1em] uppercase text-white/40">
    <span>{left}</span>
    <span>{right}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════
   Hero topology SVG
   ═══════════════════════════════════════════════════════ */

const HeroTopology = () => (
  <div
    className="w-full max-w-[1020px] mx-auto mt-20 rounded-2xl border border-white/8 p-7 pb-4 relative overflow-hidden"
    style={{
      background: "radial-gradient(60% 80% at 50% 0%, rgba(229,72,77,0.08), transparent 70%), linear-gradient(180deg, rgba(242,242,248,0.025), rgba(242,242,248,0.005))",
    }}
    aria-hidden="true"
  >
    {/* grid pattern */}
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "linear-gradient(rgba(242,242,248,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,248,0.04) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
        maskImage: "radial-gradient(60% 80% at 50% 50%, #000, transparent 75%)",
      }}
    />

    {/* header bar */}
    <div className="relative z-10 flex items-center justify-between pb-4 mb-4 border-b border-dashed border-white/[0.14]">
      <span className="font-mono text-[11px] tracking-[0.18em] uppercase text-white/50">
        ENGAGEMENT TOPOLOGY <span className="text-white/20">·</span> FL-2026-0184
      </span>
      <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.16em] uppercase text-white/60">
        <span className="w-[7px] h-[7px] rounded-full bg-green-400 shadow-[0_0_0_4px_rgba(74,222,128,0.18)] animate-pulse" />
        LIVE <span className="text-white/20">·</span> 12 AGENTS
      </span>
    </div>

    <svg viewBox="0 0 960 320" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" className="relative z-10 w-full h-auto block">
      <defs>
        <linearGradient id="lg-red" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#ff7a7e" stopOpacity={0}/>
          <stop offset="50%" stopColor="#E5484D" stopOpacity={0.85}/>
          <stop offset="100%" stopColor="#ff7a7e" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="lg-blue" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#3E63DD" stopOpacity={0}/>
          <stop offset="50%" stopColor="#88a4ff" stopOpacity={0.85}/>
          <stop offset="100%" stopColor="#3E63DD" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="lg-violet" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#7C66DC" stopOpacity={0}/>
          <stop offset="50%" stopColor="#b1a3ff" stopOpacity={0.85}/>
          <stop offset="100%" stopColor="#7C66DC" stopOpacity={0}/>
        </linearGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={3}/>
        </filter>
      </defs>

      <g fill="none" strokeWidth={1.25} opacity={0.95}>
        <path d="M 380 160 C 300 100, 260 70, 205 70" stroke="url(#lg-blue)"/>
        <path d="M 380 160 C 320 160, 260 161, 205 160" stroke="url(#lg-blue)"/>
        <path d="M 380 160 C 300 220, 260 250, 205 250" stroke="url(#lg-blue)"/>
        <path d="M 480 160 C 540 160, 640 161, 700 160" stroke="url(#lg-violet)"/>
        <path d="M 760 160 C 800 160, 840 100, 870 80" stroke="url(#lg-red)"/>
        <path d="M 760 160 C 800 160, 840 220, 870 240" stroke="url(#lg-red)"/>
      </g>

      <g>
        <circle r={3} fill="#88a4ff"><animateMotion dur="3s" repeatCount="indefinite" path="M 205 70 C 260 70, 300 100, 380 160"/></circle>
        <circle r={3} fill="#88a4ff"><animateMotion dur="3.4s" repeatCount="indefinite" path="M 205 160 C 260 161, 320 160, 380 160"/></circle>
        <circle r={3} fill="#88a4ff"><animateMotion dur="2.6s" repeatCount="indefinite" path="M 205 250 C 260 250, 300 220, 380 160"/></circle>
        <circle r={3} fill="#b1a3ff"><animateMotion dur="2.8s" repeatCount="indefinite" path="M 480 160 C 540 160, 640 161, 700 160"/></circle>
        <circle r={3} fill="#ff7a7e"><animateMotion dur="3.2s" repeatCount="indefinite" path="M 760 160 C 800 160, 840 100, 870 80"/></circle>
        <circle r={3} fill="#ff7a7e"><animateMotion dur="3s" repeatCount="indefinite" path="M 760 160 C 800 160, 840 220, 870 240"/></circle>
      </g>

      {/* agents */}
      <g fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize={10} fill="#88a4ff">
        {[{ y: 56, label: "AGENT · AUTHN" }, { y: 146, label: "AGENT · IDOR" }, { y: 236, label: "AGENT · INJECT" }].map((a) => (
          <g key={a.label} transform={`translate(60 ${a.y})`}>
            <rect width={140} height={28} rx={14} fill="rgba(62,99,221,0.10)" stroke="rgba(62,99,221,0.45)"/>
            <circle cx={14} cy={14} r={3.5} fill="#3E63DD"/>
            <text x={26} y={18} letterSpacing={1.5}>{a.label}</text>
          </g>
        ))}
      </g>

      {/* orchestrator */}
      <g transform="translate(380 100)">
        <rect width={100} height={120} rx={14} fill="rgba(229,72,77,0.08)" stroke="rgba(229,72,77,0.55)"/>
        <circle cx={50} cy={32} r={6} fill="#E5484D" filter="url(#glow)"/>
        <circle cx={50} cy={32} r={6} fill="#E5484D"/>
        <text x={50} y={64} fontFamily="Lufga, sans-serif" fontSize={14} fill="#F2F2F8" textAnchor="middle" fontWeight={500}>Émile</text>
        <text x={50} y={84} fontFamily="ui-monospace, monospace" fontSize={9} fill="rgba(242,242,248,0.5)" textAnchor="middle" letterSpacing={2}>ORCHESTRATOR</text>
        <text x={50} y={102} fontFamily="ui-monospace, monospace" fontSize={9} fill="rgba(255,122,126,0.85)" textAnchor="middle" letterSpacing={2}>DETERMINISTIC</text>
      </g>

      {/* validator */}
      <g transform="translate(700 130)">
        <rect width={60} height={60} rx={10} fill="rgba(124,102,220,0.08)" stroke="rgba(124,102,220,0.55)"/>
        <circle cx={30} cy={22} r={5} fill="#7C66DC"/>
        <text x={30} y={44} fontFamily="ui-monospace, monospace" fontSize={9} fill="#b1a3ff" textAnchor="middle" letterSpacing={1.5}>VALIDATOR</text>
      </g>

      {/* reporter */}
      <g transform="translate(820 50)">
        <rect width={120} height={46} rx={10} fill="rgba(229,72,77,0.08)" stroke="rgba(229,72,77,0.45)"/>
        <circle cx={14} cy={23} r={4} fill="#E5484D"/>
        <text x={26} y={20} fontFamily="ui-monospace, monospace" fontSize={9} fill="#ff7a7e" letterSpacing={1.5}>COMPLIANCE</text>
        <text x={26} y={34} fontFamily="ui-monospace, monospace" fontSize={9} fill="rgba(242,242,248,0.55)" letterSpacing={1.5}>REPORTER</text>
      </g>

      {/* coverage graph */}
      <g transform="translate(820 220)">
        <rect width={120} height={46} rx={10} fill="rgba(62,99,221,0.08)" stroke="rgba(62,99,221,0.45)"/>
        <circle cx={14} cy={23} r={4} fill="#3E63DD"/>
        <text x={26} y={20} fontFamily="ui-monospace, monospace" fontSize={9} fill="#88a4ff" letterSpacing={1.5}>COVERAGE</text>
        <text x={26} y={34} fontFamily="ui-monospace, monospace" fontSize={9} fill="rgba(242,242,248,0.55)" letterSpacing={1.5}>GRAPH</text>
      </g>
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════
   System map SVG (architecture section)
   ═══════════════════════════════════════════════════════ */

const SystemMap = () => (
  <div
    className="w-full mb-8 rounded-2xl border border-white/8 p-7 relative overflow-hidden"
    style={{ background: "linear-gradient(180deg, rgba(242,242,248,0.025), rgba(242,242,248,0.005))" }}
    aria-hidden="true"
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "linear-gradient(rgba(242,242,248,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(242,242,248,0.035) 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        maskImage: "radial-gradient(70% 80% at 50% 50%, #000, transparent 80%)",
      }}
    />
    <svg viewBox="0 0 1200 360" preserveAspectRatio="xMidYMid meet" className="relative z-10 w-full h-auto block">
      <defs>
        <marker id="arr" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="rgba(242,242,248,0.5)"/>
        </marker>
      </defs>

      <g fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.4)" letterSpacing={2}>
        <text x={60} y={36}>DISCOVER</text>
        <text x={380} y={36}>ORCHESTRATE</text>
        <text x={700} y={36}>VALIDATE</text>
        <text x={1020} y={36}>REPORT</text>
      </g>
      <line x1={40} y1={54} x2={1160} y2={54} stroke="rgba(242,242,248,0.1)" strokeDasharray="2 4"/>

      <g fill="none" stroke="rgba(242,242,248,0.18)" strokeWidth={1}>
        <path d="M 240 200 L 360 200" markerEnd="url(#arr)"/>
        <path d="M 560 200 L 680 200" markerEnd="url(#arr)"/>
        <path d="M 880 200 L 1000 200" markerEnd="url(#arr)"/>
        <path d="M 920 268 C 840 320, 540 320, 460 268" strokeDasharray="3 4"/>
        <text x={690} y={338} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.35)" letterSpacing={2}>COVERAGE GRAPH · STATE LOOP</text>
      </g>

      {/* Attack Agents */}
      <g transform="translate(40 100)">
        <rect width={200} height={180} rx={14} fill="rgba(62,99,221,0.06)" stroke="rgba(62,99,221,0.5)"/>
        <circle cx={20} cy={22} r={5} fill="#3E63DD"/>
        <text x={34} y={26} fontFamily="Lufga, sans-serif" fontSize={15} fill="#88a4ff" fontWeight={500}>Attack Agents</text>
        <text x={20} y={50} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.45)" letterSpacing={1.5}>SHORT-LIVED · SPECIALIST</text>
        {["AUTHN", "IDOR", "INJECT", "BIZLOGIC", "PRIVESC"].map((l, i) => (
          <g key={l}>
            <rect x={20 + (i % 2) * 80} y={68 + Math.floor(i / 2) * 30} width={74} height={22} rx={11} fill="rgba(62,99,221,0.10)" stroke="rgba(62,99,221,0.3)"/>
            <text x={32 + (i % 2) * 80} y={83 + Math.floor(i / 2) * 30} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.7)" letterSpacing={1}>{l}</text>
          </g>
        ))}
        <rect x={100} y={128} width={74} height={22} rx={11} fill="rgba(242,242,248,0.04)" stroke="rgba(242,242,248,0.12)"/>
        <text x={112} y={143} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.4)" letterSpacing={1}>+ 18</text>
      </g>

      {/* Émile */}
      <g transform="translate(360 100)">
        <rect width={200} height={180} rx={14} fill="rgba(229,72,77,0.06)" stroke="rgba(229,72,77,0.5)"/>
        <circle cx={20} cy={22} r={5} fill="#E5484D"/>
        <text x={34} y={26} fontFamily="Lufga, sans-serif" fontSize={15} fill="#ff7a7e" fontWeight={500}>Émile</text>
        <text x={20} y={50} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.45)" letterSpacing={1.5}>ORCHESTRATOR</text>
        <text x={20} y={80} fontFamily="Lufga, sans-serif" fontSize={12} fill="rgba(242,242,248,0.9)">Coverage Graph</text>
        <text x={20} y={98} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.5)">247 endpoints · 38 surfaces</text>
        <line x1={20} y1={112} x2={180} y2={112} stroke="rgba(242,242,248,0.1)" strokeDasharray="2 3"/>
        <text x={20} y={132} fontFamily="Lufga, sans-serif" fontSize={12} fill="rgba(242,242,248,0.9)">Prioritizer</text>
        <text x={20} y={150} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.5)">deterministic logic</text>
        <text x={20} y={170} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(255,122,126,0.85)" letterSpacing={1.5}>ENGAGEMENT COMPLETE</text>
      </g>

      {/* Validation */}
      <g transform="translate(680 100)">
        <rect width={200} height={180} rx={14} fill="rgba(124,102,220,0.06)" stroke="rgba(124,102,220,0.5)"/>
        <circle cx={20} cy={22} r={5} fill="#7C66DC"/>
        <text x={34} y={26} fontFamily="Lufga, sans-serif" fontSize={15} fill="#b1a3ff" fontWeight={500}>Validation Engine</text>
        <text x={20} y={50} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.45)" letterSpacing={1.5}>NON-DESTRUCTIVE PROOF</text>
        {["▸ controlled challenge", "▸ idempotent retry", "▸ evidence capture", "▸ ed25519 signature"].map((l, i) => (
          <text key={l} x={20} y={82 + i * 20} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.7)">{l}</text>
        ))}
        <text x={20} y={170} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(177,163,255,0.85)" letterSpacing={1.5}>FALSE POSITIVES = 0</text>
      </g>

      {/* Reporter */}
      <g transform="translate(1000 100)">
        <rect width={160} height={180} rx={14} fill="rgba(229,72,77,0.06)" stroke="rgba(229,72,77,0.5)"/>
        <circle cx={20} cy={22} r={5} fill="#E5484D"/>
        <text x={34} y={26} fontFamily="Lufga, sans-serif" fontSize={14} fill="#ff7a7e" fontWeight={500}>Compliance</text>
        <text x={34} y={42} fontFamily="Lufga, sans-serif" fontSize={14} fill="#ff7a7e" fontWeight={500}>Reporter</text>
        <text x={20} y={64} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.45)" letterSpacing={1.5}>AUDIT-GRADE</text>
        {[["DORA", "NIS2"], ["ISO", "SOC 2"]].map((row, ri) =>
          row.map((label, ci) => (
            <g key={label}>
              <rect x={20 + ci * 64} y={84 + ri * 26} width={56} height={20} rx={10} fill="rgba(229,72,77,0.12)" stroke="rgba(229,72,77,0.35)"/>
              <text x={32 + ci * 64} y={98 + ri * 26} fontFamily="ui-monospace, monospace" fontSize={10} fill="#ff7a7e" letterSpacing={1.5}>{label}</text>
            </g>
          ))
        )}
        <text x={20} y={158} fontFamily="Lufga, sans-serif" fontSize={12} fill="rgba(242,242,248,0.85)">Signed PDF</text>
        <text x={20} y={174} fontFamily="ui-monospace, monospace" fontSize={10} fill="rgba(242,242,248,0.45)">ed25519 · offline</text>
      </g>
    </svg>
  </div>
);

/* ═══════════════════════════════════════════════════════
   Main page
   ═══════════════════════════════════════════════════════ */

const Platform = () => {
  const { t, localize } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO pageKey="platform" />
      <Navbar />
      <main id="main-content" className="pt-40 md:pt-48">

        {/* ── 1. HERO ── */}
        <section className="text-center pb-20 md:pb-28 lg:pb-36">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <ScrollReveal>
              <Eyebrow>PLATFORM <Sep /> ÉMILE V2</Eyebrow>
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <h1 className="mt-6 text-[clamp(40px,6.8vw,88px)] leading-[1.0] tracking-[-0.035em] font-light text-white max-w-[14ch] mx-auto">
                {t("platformPage.hero.title")}{" "}
                <span className="text-gradient-accent">{t("platformPage.hero.highlight")}</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="mt-7 text-white/60 text-[clamp(16px,1.3vw,18px)] leading-[1.55] max-w-[60ch] mx-auto" style={{ textWrap: "pretty" }}>
                {t("platformPage.hero.subtitle")}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="mt-10 flex gap-2.5 justify-center flex-wrap">
                <Link
                  to={localize(DEMO_ROUTE)}
                  className="btn-cta btn-cta--lg"
                  onClick={() => trackCTAClick({ location: "platform_hero", label: "get_demo", destination: DEMO_ROUTE })}
                >
                  {t("platformPage.hero.cta")}
                </Link>
                <a href="#process" className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-full border border-white/[0.14] text-white/80 text-sm font-medium hover:bg-white/[0.03] hover:border-white/[0.22] transition-all duration-200">
                  {t("platformPage.hero.ctaSecondary")}
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <HeroTopology />
            </ScrollReveal>
          </div>
        </section>

        {/* ── 2. PHILOSOPHY ── */}
        <section className="section-elevated grid-fade py-20 md:py-28 lg:py-36 relative">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8 text-center">
            <ScrollReveal>
              <Eyebrow>PRINCIPLE 01 <Sep /> PROOF OVER PROBABILITY</Eyebrow>
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <h2 className="mt-6 text-[clamp(32px,4.2vw,56px)] leading-[1.05] tracking-[-0.028em] font-light text-white max-w-[18ch] mx-auto">
                {t("platformPage.philosophy.title")}{" "}
                <span className="text-gradient-accent">{t("platformPage.philosophy.highlight")}</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="mt-7 text-white/60 text-[clamp(16px,1.3vw,18px)] leading-[1.55] max-w-[62ch] mx-auto" style={{ textWrap: "pretty" }}>
                {t("platformPage.philosophy.body")}
              </p>
            </ScrollReveal>
          </div>
        </section>

        {/* ── 3. PROCESS ── */}
        <section id="process" className="py-20 md:py-28 lg:py-36 scroll-mt-24">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="max-w-[760px] mb-14 space-y-4">
              <ScrollReveal>
                <Eyebrow>PROCESS <Sep /> 04 STAGES</Eyebrow>
              </ScrollReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-[clamp(32px,4.2vw,56px)] leading-[1.05] tracking-[-0.028em] font-light text-white">
                  {t("platformPage.process.title")}{" "}
                  <span className="text-gradient-accent">{t("platformPage.process.highlight")}</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="text-white/60 text-[clamp(16px,1.3vw,18px)] leading-[1.55] max-w-[60ch]" style={{ textWrap: "pretty" }}>
                  {t("platformPage.process.subtitle")}
                </p>
              </ScrollReveal>
            </div>

            {/* Process timeline */}
            <ScrollReveal>
              <div className="rounded-2xl border border-white/8 p-2" style={{ background: "linear-gradient(180deg, rgba(242,242,248,0.02), rgba(242,242,248,0.005))" }}>
                {/* tick bar */}
                <div className="hidden md:grid grid-cols-4 px-5 pt-5">
                  {processSteps.map((s, i) => (
                    <span key={s.key} className="font-mono text-[11px] text-white/40 tracking-[0.14em] uppercase pb-4 border-b border-dashed border-white/[0.14] relative">
                      {s.time}
                      <span
                        className="absolute left-0 -bottom-1 w-2 h-2 rounded-full"
                        style={{
                          background: i === 0 ? "var(--accent-red)" : "rgba(242,242,248,0.4)",
                          boxShadow: i === 0 ? "0 0 0 4px rgba(229,72,77,0.2)" : "0 0 0 3px rgba(242,242,248,0.06)",
                        }}
                      />
                    </span>
                  ))}
                </div>

                {/* step cards */}
                <div className="grid md:grid-cols-4">
                  {processSteps.map((step, i) => (
                    <div key={step.key} className={`p-5 md:p-6 flex flex-col gap-3.5 ${i < 3 ? "md:border-r border-dashed border-white/[0.14]" : ""} ${i < 3 ? "border-b md:border-b-0 border-dashed border-white/[0.14]" : ""}`}>
                      <span className="font-mono text-[11px] text-white/50 tracking-[0.16em] uppercase">
                        {step.num} <span className="text-white/20">·</span> {step.label}
                      </span>
                      <h3 className="text-lg leading-[1.2] font-light tracking-[-0.015em] text-white">
                        {t(`platformPage.process.${step.key}.title`)}
                      </h3>
                      <p className="text-white/60 text-[14.5px] leading-[1.55]">
                        {t(`platformPage.process.${step.key}.desc`)}
                      </p>
                      <div className="mt-auto pt-4 border-t border-dashed border-white/[0.14] grid grid-cols-2 gap-2">
                        {step.kpis.map((kpi) => (
                          <div key={kpi.k} className="font-mono">
                            <div className="text-[10.5px] text-white/40 tracking-[0.12em] uppercase">{kpi.k}</div>
                            <div className="text-[15px] text-white mt-0.5">{kpi.v}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>

            {/* Terminal */}
            <ScrollReveal delay={0.1}>
              <div className="mt-4 rounded-[14px] border border-white/8 overflow-hidden bg-[#07070a]" aria-hidden="true">
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 bg-white/[0.02]">
                  <div className="flex items-center gap-3.5">
                    <div className="flex gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                      <span className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                    </div>
                    <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/50">
                      STDOUT <span className="text-white/20">·</span> ENGAGEMENT FL-2026-0184
                    </span>
                  </div>
                  <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-white/50">
                    RUNTIME 00:14:22 <span className="text-white/20">·</span> LIVE
                  </span>
                </div>
                <div className="p-4 font-mono text-[12.5px] leading-[1.9] text-white/60 space-y-0.5 overflow-x-auto">
                  {terminalRows.map((row, i) => (
                    <div key={i} className="grid grid-cols-[88px_140px_1fr_90px] gap-x-4 min-w-[600px]">
                      <span className="text-white/25">{row.t}</span>
                      <span className={row.cls || "text-white"}>{row.actor}</span>
                      <span>{row.msg}</span>
                      <span className={`${row.statusCls} tracking-[0.12em] text-right`}>{row.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── 4. ARCHITECTURE ── */}
        <section className="section-elevated grid-fade py-20 md:py-28 lg:py-36 relative">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="max-w-[760px] mb-14 space-y-4">
              <ScrollReveal><Eyebrow>ARCHITECTURE <Sep /> 05 COMPONENTS</Eyebrow></ScrollReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-[clamp(32px,4.2vw,56px)] leading-[1.05] tracking-[-0.028em] font-light text-white">
                  {t("platformPage.arch.title")}{" "}
                  <span className="text-gradient-accent">{t("platformPage.arch.highlight")}</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="text-white/60 text-[clamp(16px,1.3vw,18px)] leading-[1.55] max-w-[60ch]">
                  {t("platformPage.arch.subtitle")}
                </p>
              </ScrollReveal>
            </div>

            <ScrollReveal>
              <SystemMap />
            </ScrollReveal>

            {/* 3+2 architecture cards */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              {archComponents.map((comp, i) => (
                <ScrollReveal key={comp.key} delay={i * 0.06}>
                  <div
                    className={`h-full p-7 rounded-2xl border border-white/8 bg-white/[0.018] hover:bg-white/[0.04] hover:border-white/[0.14] transition-all duration-250 ${
                      i < 3 ? "md:col-span-2" : i === 3 ? "md:col-start-2 md:col-span-2" : "md:col-span-2"
                    }`}
                  >
                    <span className={`inline-block w-[9px] h-[9px] rounded-full mb-7 ${comp.dot} ${comp.shadow}`} />
                    <h3 className={`text-[19px] leading-[1.25] font-light tracking-[-0.012em] mb-3 ${comp.title}`}>
                      {t(`platformPage.arch.${comp.key}.title`)}
                    </h3>
                    <p className="text-white/60 text-[15px] leading-[1.55]">
                      {t(`platformPage.arch.${comp.key}.desc`)}
                    </p>
                    <CardMeta left={comp.meta[0]} right={comp.meta[1]} />
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. COMPARISON (reuse homepage component) ── */}
        <ComparisonTable />

        {/* ── 6. DIFFERENTIATION ── */}
        <section className="section-elevated grid-fade py-20 md:py-28 lg:py-36 relative">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="max-w-[760px] mb-14 space-y-4">
              <ScrollReveal><Eyebrow>BY DESIGN <Sep /> 03 DECISIONS</Eyebrow></ScrollReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-[clamp(32px,4.2vw,56px)] leading-[1.05] tracking-[-0.028em] font-light text-white">
                  {t("platformPage.diff.title")}{" "}
                  <span className="text-gradient-accent">{t("platformPage.diff.highlight")}</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="text-white/60 text-[clamp(16px,1.3vw,18px)] leading-[1.55] max-w-[60ch]">
                  {t("platformPage.diff.subtitle")}
                </p>
              </ScrollReveal>
            </div>

            <StaggerGroup className="space-y-3">
              {diffPoints.map((pt) => (
                <motion.article
                  key={pt.key}
                  variants={staggerItem}
                  className="grid md:grid-cols-[220px_1fr] gap-8 items-start p-7 md:p-10 rounded-2xl border border-white/8 bg-white/[0.018] hover:bg-white/[0.04] hover:border-white/[0.14] transition-all duration-250"
                >
                  <div>
                    <span
                      className={`block text-[clamp(56px,7vw,96px)] leading-[0.9] font-extralight tracking-[-0.04em] bg-gradient-to-b ${pt.grad} bg-clip-text text-transparent`}
                    >
                      {pt.num}
                    </span>
                    <span className="block mt-3.5 font-mono text-[11px] text-white/25 tracking-[0.2em] uppercase">
                      {pt.sub}
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-[clamp(22px,2vw,28px)] font-light tracking-[-0.018em] leading-[1.2] mb-3 ${pt.titleCls}`}>
                      {t(`platformPage.diff.${pt.key}.title`)}
                    </h3>
                    <p className="text-white/60 text-base leading-[1.6] max-w-[60ch]">
                      {t(`platformPage.diff.${pt.key}.desc`)}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-5">
                      {pt.chips.map((chip) => (
                        <span key={chip} className="font-mono text-[11px] text-white/60 px-2.5 py-1 rounded-full border border-white/[0.14] bg-white/[0.02] tracking-[0.04em]">
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* ── 7. PRODUCTION SAFETY ── */}
        <section className="py-20 md:py-28 lg:py-36">
          <div className="max-w-[1280px] mx-auto px-4 md:px-8">
            <div className="max-w-[760px] mb-14 space-y-4">
              <ScrollReveal><Eyebrow>PRODUCTION SAFETY <Sep /> 03 GUARANTEES</Eyebrow></ScrollReveal>
              <ScrollReveal delay={0.05}>
                <h2 className="text-[clamp(32px,4.2vw,56px)] leading-[1.05] tracking-[-0.028em] font-light text-white">
                  {t("platformPage.production.title")}{" "}
                  <span className="text-gradient-accent">{t("platformPage.production.highlight")}</span>
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <p className="text-white/60 text-[clamp(16px,1.3vw,18px)] leading-[1.55] max-w-[60ch]">
                  {t("platformPage.production.subtitle")}
                </p>
              </ScrollReveal>
            </div>

            <StaggerGroup className="grid md:grid-cols-3 gap-4">
              {productionPoints.map((pt) => (
                <motion.article
                  key={pt.key}
                  variants={staggerItem}
                  className="p-7 rounded-2xl border border-white/8 bg-white/[0.018] hover:bg-white/[0.04] hover:border-white/[0.14] transition-all duration-250"
                >
                  <span className={`inline-block w-[9px] h-[9px] rounded-full mb-7 ${pt.dot} ${pt.shadow}`} />
                  <h3 className={`text-[19px] leading-[1.25] font-light tracking-[-0.012em] mb-3 ${pt.title}`}>
                    {t(`platformPage.production.${pt.key}.title`)}
                  </h3>
                  <p className="text-white/60 text-[15px] leading-[1.55]">
                    {t(`platformPage.production.${pt.key}.desc`)}
                  </p>
                  <CardMeta left={pt.meta[0]} right={pt.meta[1]} />
                </motion.article>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* ── 8. FINAL CTA (homepage-style layered bg) ── */}
        <section
          className="fl-section fl-section--solid text-center"
          style={{ position: "relative", overflow: "hidden", padding: "7rem 0 8rem", minHeight: "min(60vh, 600px)" }}
        >
          <div
            aria-hidden
            className="fl-crosshair"
            style={{ position: "absolute", inset: 0, pointerEvents: "none", opacity: 1, zIndex: 0 }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              zIndex: 0,
              background:
                "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(79,143,255,0.18), transparent 70%), radial-gradient(ellipse 70% 40% at 50% 100%, rgba(229,72,77,0.10), transparent 75%)",
            }}
          />

          <div className="max-w-[1280px] mx-auto px-4 md:px-8" style={{ position: "relative", zIndex: 1 }}>
            <ScrollReveal>
              <Eyebrow>GET STARTED <Sep /> 15 MINUTES</Eyebrow>
            </ScrollReveal>
            <ScrollReveal delay={0.05}>
              <h2 className="mt-6 text-[clamp(32px,4.2vw,56px)] leading-[1.05] tracking-[-0.028em] font-light text-white max-w-[18ch] mx-auto">
                {t("platformPage.cta.title")}{" "}
                <span className="text-gradient-accent">{t("platformPage.cta.highlight")}</span>
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="mt-6 text-white/60 text-[clamp(16px,1.3vw,18px)] leading-[1.55] max-w-[60ch] mx-auto" style={{ textWrap: "pretty" as React.CSSProperties["textWrap"] }}>
                {t("platformPage.cta.subtitle")}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.15}>
              <div className="mt-10 flex gap-2.5 justify-center flex-wrap">
                <Link
                  to={localize(DEMO_ROUTE)}
                  className="btn-cta btn-cta--lg"
                  onClick={() => trackCTAClick({ location: "platform_bottom_cta", label: "get_demo", destination: DEMO_ROUTE })}
                >
                  {t("platformPage.cta.button")}
                </Link>
                <a href="mailto:yanis@fleuret.ai" className="inline-flex items-center gap-2 px-[18px] py-2.5 rounded-full border border-white/[0.14] text-white/80 text-sm font-medium hover:bg-white/[0.03] hover:border-white/[0.22] transition-all duration-200">
                  {t("platformPage.cta.ctaSecondary")}
                </a>
              </div>
              <div className="mt-9 font-mono text-[11px] tracking-[0.2em] uppercase text-white/25">
                15 MIN <span className="text-white/15">·</span> CET <span className="text-white/15">·</span> NDA-READY
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Back link ── */}
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 pb-20">
          <Link to={localize("/")} className="text-[var(--accent-blue)] hover:underline text-sm">
            &larr; {t("platformPage.back")}
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Platform;
