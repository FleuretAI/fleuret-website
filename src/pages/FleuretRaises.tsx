import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerGroup from "@/components/motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";
import { SEO } from "@/seo/SEO";
import { SITE_URL } from "@/seo/routes";
import { DEMO_ROUTE } from "@/lib/routes";
import yanisPhoto from "@/assets/yanis.png";
import pierrePhoto from "@/assets/pierre-gabriel.png";
import augustinPhoto from "@/assets/augustin.png";
import raiseLogo from "@/assets/investors/raise.svg";
import aurigaLogo from "@/assets/investors/auriga.svg";
import windLogo from "@/assets/investors/wind.svg";
import unitedFoundersLogo from "@/assets/investors/unitedfounders.svg";
import betterAngleLogo from "@/assets/investors/betterangle.svg";
import hornetsecurityLogo from "@/assets/investors/hornetsecurity.png";
import almondLogo from "@/assets/investors/almond.svg";
import gitguardianLogo from "@/assets/investors/gitguardian.svg";
import ovrseaLogo from "@/assets/investors/ovrsea.svg";
import stoikLogo from "@/assets/investors/stoik.svg";

type Lang = "fr" | "en";

const PATH_FR = "/news/fleuret-raises-3-5m";
const PATH_EN = "/en/news/fleuret-raises-3-5m";

const copy: Record<Lang, {
  metaTitle: string;
  metaDesc: string;
  date: string;
  byline: string;
  heroKicker: string;
  heroTitle: string;
  heroSub: string;
  openingH: string;
  openingP1: string;
  openingP2: string;
  problemH: string;
  problemP: string;
  useOfFundsH: string;
  useProduct: { h: string; p: string };
  useTeam: { h: string; p: string };
  useDistribution: { h: string; p: string };
  vcsH: string;
  vcsP: string;
  angelsH: string;
  angelsP: string;
  bpiH: string;
  bpiP: string;
  complianceH: string;
  complianceP: string;
  teamH: string;
  teamP: string;
  closingH: string;
  closingP: string;
  ctaDemo: string;
  ctaPlatform: string;
  back: string;
}> = {
  fr: {
    metaTitle: "Fleuret lève 3,5 M€ pour industrialiser le pentest par IA agentique",
    metaDesc: "Fleuret lève 3,5 M€ (équity + prêt amorçage BPI) pour accélérer le pentest par IA agentique en Europe. Tour mené par RAISE Capital avec Auriga, Wind et United Founders.",
    date: "21 avril 2026",
    byline: "Yanis Grigy, Augustin Ponsin et Pierre-Gabriel Berlureau, équipe fondatrice",
    heroKicker: "Annonce",
    heroTitle: "Fleuret lève 3,5 M€ pour industrialiser le pentest par IA agentique",
    heroSub: "Un tour d'amorçage européen pour rendre le pentest continu, rapide et abordable. Webapp, API, infra externe aujourd'hui. Cloud, Active Directory et mobile dès 2026.",
    openingH: "Ce que nous annonçons",
    openingP1: "Nous levons 3,5 M€ pour accélérer Fleuret, plateforme de sécurité offensive pilotée par IA agentique. Le tour réunit 2,8 M€ en équity, menés par RAISE Capital aux côtés d'Auriga Cyber Ventures, Wind Capital et United Founders, complétés par un cercle d'angels opérateurs de la cybersécurité européenne. S'y ajoutent 700 k€ de prêt amorçage Bpifrance.",
    openingP2: "Les fonds arrivent mi-mai 2026. Ils financent le produit, l'équipe et la couverture des scopes attendus par nos clients : NIS2, DORA, ISO 27001.",
    problemH: "Pourquoi maintenant",
    problemP: "Les DSI européennes déploient chaque jour. Les cabinets de pentest livrent en 2 à 4 semaines, à 10 000 € et plus, une à deux fois par an. Entre deux audits, 3 à 12 mois d'exposition aveugle. Le calcul ne tient plus. Fleuret livre un pentest de niveau humain en heures, avec PoC reproductible et rapport audit-ready, à 2 500 € par scope. Zéro faux positif toléré.",
    useOfFundsH: "Ce que ce tour finance",
    useProduct: {
      h: "Produit",
      p: "Webapp, API REST et GraphQL, infra externe en production. Cloud, Active Directory et mobile en alpha chez nos design partners, en production courant 2026.",
    },
    useTeam: {
      h: "Équipe",
      p: "De 5 à environ 12 personnes d'ici fin 2026 : quatre ingénieurs sécurité et produit, un à deux profils sales basés à Paris.",
    },
    useDistribution: {
      h: "Distribution",
      p: "Go-to-market direct auprès des RSSI, CTO et DPO européens, plus partenariats avec assureurs cyber et cabinets spécialisés. Hébergement européen (fra1), résidence des données en Europe.",
    },
    vcsH: "Nos investisseurs",
    vcsP: "RAISE Capital mène le tour. Auriga Cyber Ventures, Wind Capital et United Founders co-investissent.",
    angelsH: "Business angels",
    angelsP: "Des opérateurs qui ont construit la cybersécurité européenne : fondateurs d'Almond, GitGuardian, Stoïk, OVRSEA et Hornetsecurity. Leur réseau client, leur expertise produit et leur vécu opérationnel nous font gagner des années.",
    bpiH: "Prêt amorçage Bpifrance",
    bpiP: "700 k€ de prêt amorçage innovation, non dilutif. Marqueur de confiance de l'écosystème public français dans notre thèse technique.",
    complianceH: "NIS2, DORA, ISO 27001",
    complianceP: "Chaque rapport Fleuret cartographie les findings vers les référentiels attendus par vos auditeurs. La directive NIS2 et le règlement DORA imposent des tests d'intrusion réguliers. Fleuret en fait une opération continue, pas un projet annuel.",
    teamH: "L'équipe fondatrice",
    teamP: "Trois co-fondateurs, une conviction : le pentest doit être aussi rapide que vos déploiements.",
    closingH: "Ce n'est qu'un début",
    closingP: "Si vous êtes RSSI, CTO, DPO ou dirigeant d'une entreprise européenne de 50 à 1 000 collaborateurs, nous voulons vous parler. Réservez une démo de 30 minutes avec un fondateur.",
    ctaDemo: "Réserver une démo",
    ctaPlatform: "Découvrir la plateforme",
    back: "← Retour à l'accueil",
  },
  en: {
    metaTitle: "Fleuret raises €3.5M to industrialize agentic AI pentesting",
    metaDesc: "Fleuret raises €3.5M (equity + Bpifrance innovation loan) to accelerate agentic AI pentesting in Europe. Round led by RAISE Capital with Auriga, Wind and United Founders.",
    date: "April 21, 2026",
    byline: "Yanis Grigy, Augustin Ponsin and Pierre-Gabriel Berlureau, founding team",
    heroKicker: "Announcement",
    heroTitle: "Fleuret raises €3.5M to industrialize agentic AI pentesting",
    heroSub: "A European seed round to make pentesting continuous, fast and affordable. Webapp, API and external infrastructure today. Cloud, Active Directory and mobile coming in 2026.",
    openingH: "What we're announcing",
    openingP1: "We're raising €3.5M to accelerate Fleuret, an offensive security platform driven by agentic AI. The round includes €2.8M in equity, led by RAISE Capital alongside Auriga Cyber Ventures, Wind Capital and United Founders, backed by a circle of operator angels from European cybersecurity. On top of that, a €700k Bpifrance innovation loan.",
    openingP2: "Funds close mid-May 2026. They fund product, team and the scopes our customers need for NIS2, DORA and ISO 27001.",
    problemH: "Why now",
    problemP: "European CIOs ship every day. Pentest firms deliver in 2 to 4 weeks, at €10,000 and up, once or twice a year. Between audits, 3 to 12 months of blind exposure. The math no longer works. Fleuret delivers human-grade pentests in hours, with reproducible PoC and audit-ready reports, at €2,500 per scope. Zero false positives tolerated.",
    useOfFundsH: "What this round funds",
    useProduct: {
      h: "Product",
      p: "Webapp, REST and GraphQL APIs, external infrastructure in production. Cloud, Active Directory and mobile in alpha with our design partners, production-ready in 2026.",
    },
    useTeam: {
      h: "Team",
      p: "Scaling from 5 to roughly 12 people by end of 2026: four security and product engineers, one to two sales hires, Paris-based.",
    },
    useDistribution: {
      h: "Distribution",
      p: "Direct go-to-market to European CISOs, CTOs and DPOs, plus partnerships with cyber insurers and specialized firms. EU hosting (fra1), data residency in Europe.",
    },
    vcsH: "Our investors",
    vcsP: "RAISE Capital leads. Auriga Cyber Ventures, Wind Capital and United Founders co-invest.",
    angelsH: "Business angels",
    angelsP: "Operators who built European cybersecurity: founders of Almond, GitGuardian, Stoïk, OVRSEA and Hornetsecurity. Their customer network, product expertise and operator experience compress years of learning for us.",
    bpiH: "Bpifrance innovation loan",
    bpiP: "€700k non-dilutive innovation loan. A mark of trust from the French public innovation ecosystem in our technical thesis.",
    complianceH: "NIS2, DORA, ISO 27001",
    complianceP: "Every Fleuret report maps findings to the frameworks your auditors expect. NIS2 directive and DORA regulation require recurring penetration tests. Fleuret makes it a continuous operation, not a yearly project.",
    teamH: "The founding team",
    teamP: "Three co-founders, one conviction: pentesting has to move as fast as your deployments.",
    closingH: "Just the beginning",
    closingP: "If you're a CISO, CTO, DPO or executive at a European company of 50 to 1,000 employees, we want to talk. Book a 30-minute demo with a founder.",
    ctaDemo: "Book a demo",
    ctaPlatform: "See the platform",
    back: "← Back to home",
  },
};

type InvestorTile = {
  name: string;
  logo: string;
  invertLogo?: boolean;
  personName?: boolean;
  subtitleFr?: string;
  subtitleEn?: string;
  url?: string;
};

const vcs: InvestorTile[] = [
  { name: "RAISE Capital", logo: raiseLogo, invertLogo: true, url: "https://raise.co/", subtitleFr: "Lead", subtitleEn: "Lead" },
  { name: "Auriga Cyber Ventures", logo: aurigaLogo, invertLogo: true, url: "https://aurigacyber.com/" },
  { name: "Wind Capital", logo: windLogo },
  { name: "United Founders", logo: unitedFoundersLogo, url: "https://unitedfounders.vc/" },
  { name: "Better Angle", logo: betterAngleLogo },
];

const angels: InvestorTile[] = [
  {
    name: "Hornetsecurity",
    logo: hornetsecurityLogo,
    invertLogo: true,
    subtitleFr: "via LTGR, holding fondatrice",
    subtitleEn: "via LTGR, founding holding",
    url: "https://www.hornetsecurity.com/",
  },
  {
    name: "Olivier Pantaleo",
    personName: true,
    logo: almondLogo,
    invertLogo: true,
    subtitleFr: "Co-fondateur Almond",
    subtitleEn: "Co-founder Almond",
    url: "https://almond.consulting/",
  },
  {
    name: "Jean-François Aliotti",
    personName: true,
    logo: almondLogo,
    invertLogo: true,
    subtitleFr: "Co-fondateur Almond",
    subtitleEn: "Co-founder Almond",
    url: "https://almond.consulting/",
  },
  {
    name: "Eric Fourrier",
    personName: true,
    logo: gitguardianLogo,
    subtitleFr: "CEO de GitGuardian",
    subtitleEn: "CEO of GitGuardian",
    url: "https://www.gitguardian.com/",
  },
  {
    name: "Jules Veyrat",
    personName: true,
    logo: stoikLogo,
    invertLogo: true,
    subtitleFr: "Co-fondateur & CEO de Stoïk",
    subtitleEn: "Co-founder & CEO of Stoïk",
    url: "https://www.stoik.io/",
  },
  {
    name: "Alexandre Andreini",
    personName: true,
    logo: stoikLogo,
    invertLogo: true,
    subtitleFr: "Chief Risk Officer chez Stoïk",
    subtitleEn: "Chief Risk Officer at Stoïk",
    url: "https://www.stoik.io/",
  },
  {
    name: "OVRSEA",
    logo: ovrseaLogo,
    subtitleFr: "Équipe fondatrice",
    subtitleEn: "Founding team",
    url: "https://www.ovrsea.com/",
  },
];

const team = [
  { name: "Yanis Grigy", roleFr: "Co-fondateur & CEO", roleEn: "Co-founder & CEO", photo: yanisPhoto, linkedin: "https://www.linkedin.com/in/yanis-grigy-793635237/" },
  { name: "Augustin Ponsin", roleFr: "Co-fondateur & COO", roleEn: "Co-founder & COO", photo: augustinPhoto, linkedin: "https://www.linkedin.com/in/augustinponsin/" },
  { name: "Pierre-Gabriel Berlureau", roleFr: "Co-fondateur & CTO", roleEn: "Co-founder & CTO", photo: pierrePhoto, linkedin: "https://www.linkedin.com/in/pierre-gabriel-berlureau-427320313/" },
];

function InvestorTile({ inv, lang, idx }: { inv: InvestorTile; lang: Lang; idx: number }) {
  const subtitle = lang === "fr" ? inv.subtitleFr : inv.subtitleEn;
  const newTab = lang === "fr" ? "ouvre un nouvel onglet" : "opens in new tab";
  const logoClass = `w-auto object-contain opacity-70 group-hover:opacity-100 transition-opacity ${
    inv.invertLogo ? "invert brightness-0" : ""
  }`;
  const hasLink = !!inv.url && inv.url !== "#";
  const tileClass =
    "group flex flex-col items-center justify-center gap-2.5 p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300 min-h-[128px] text-center";

  const inner = (
    <>
      {inv.personName ? (
        <>
          <span className="text-sm md:text-base font-light tracking-wide text-white/85 group-hover:text-white transition-colors">
            {inv.name}
          </span>
          <img src={inv.logo} alt="" aria-hidden="true" loading="lazy" className={`h-6 md:h-7 max-w-[130px] ${logoClass}`} />
        </>
      ) : (
        <img src={inv.logo} alt={inv.name} loading="lazy" className={`h-10 md:h-12 max-w-[170px] ${logoClass}`} />
      )}
      {subtitle && (
        <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">{subtitle}</span>
      )}
    </>
  );

  const key = `${inv.name}-${idx}`;
  if (hasLink) {
    return (
      <motion.a
        key={key}
        href={inv.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${inv.name}${subtitle ? ` — ${subtitle}` : ""} (${newTab})`}
        variants={staggerItem}
        className={tileClass}
      >
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.div
      key={key}
      aria-label={inv.name + (subtitle ? ` — ${subtitle}` : "")}
      variants={staggerItem}
      className={tileClass}
    >
      {inner}
    </motion.div>
  );
}

const FleuretRaises = () => {
  const { language, localize } = useLanguage();
  const c = copy[language];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const canonical = SITE_URL + (language === "fr" ? PATH_FR : PATH_EN);

  return (
    <div className="min-h-screen">
      <SEO
        meta={{
          title: c.metaTitle,
          description: c.metaDesc,
          canonical,
          hreflangs: [
            { hrefLang: "fr", href: SITE_URL + PATH_FR },
            { hrefLang: "en", href: SITE_URL + PATH_EN },
            { hrefLang: "x-default", href: SITE_URL + PATH_EN },
          ],
        }}
        noindex
      />
      <Navbar />
      <main id="main-content" className="pt-24 md:pt-28 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 mb-10 md:mb-14">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-white/50">
                <span className="text-[var(--accent-blue)]">{c.heroKicker}</span>
                <span className="text-white/20">·</span>
                <span>{c.date}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-tight text-white leading-[1.08]">
                {c.heroTitle}
              </h1>
              <p className="text-lg md:text-xl text-white/60 leading-relaxed">{c.heroSub}</p>
              <p className="text-sm text-white/40">{c.byline}</p>
            </div>
          </ScrollReveal>
        </section>

        {/* Opening */}
        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-3xl mx-auto space-y-5">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-light text-white">{c.openingH}</h2>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-white/70 leading-relaxed">{c.openingP1}</p>
            </ScrollReveal>
            <ScrollReveal>
              <p className="text-white/70 leading-relaxed">{c.openingP2}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Problem */}
        <section className="section-elevated grid-fade py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-5">
              <ScrollReveal>
                <h2 className="text-2xl md:text-3xl font-light text-white">{c.problemH}</h2>
              </ScrollReveal>
              <ScrollReveal>
                <p className="text-white/70 leading-relaxed">{c.problemP}</p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Use of funds */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-2xl md:text-3xl font-light text-white mb-8">{c.useOfFundsH}</h2>
            </ScrollReveal>
            <StaggerGroup className="grid md:grid-cols-3 gap-4">
              {[c.useProduct, c.useTeam, c.useDistribution].map((b, i) => (
                <motion.div
                  key={i}
                  variants={staggerItem}
                  className="p-6 rounded-2xl border border-white/8 bg-white/[0.02]"
                >
                  <h3 className="text-lg font-medium text-white mb-2">{b.h}</h3>
                  <p className="text-sm text-white/60 leading-relaxed">{b.p}</p>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* VCs */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-light text-white mb-2">{c.vcsH}</h2>
                <p className="text-white/50 text-sm md:text-base max-w-2xl">{c.vcsP}</p>
              </div>
            </ScrollReveal>
            <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {vcs.map((inv, idx) => (
                <InvestorTile key={inv.name} inv={inv} lang={language} idx={idx} />
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* Angels */}
        <section className="container mx-auto px-4 pb-12 md:pb-16">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="mb-8">
                <h2 className="text-2xl md:text-3xl font-light text-white mb-2">{c.angelsH}</h2>
                <p className="text-white/50 text-sm md:text-base max-w-2xl">{c.angelsP}</p>
              </div>
            </ScrollReveal>
            <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {angels.map((inv, idx) => (
                <InvestorTile key={inv.name} inv={inv} lang={language} idx={idx} />
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* BPI */}
        <section className="container mx-auto px-4 pb-12 md:pb-16">
          <div className="max-w-3xl mx-auto p-8 rounded-2xl border border-white/10 bg-white/[0.03]">
            <ScrollReveal>
              <h2 className="text-xl md:text-2xl font-light text-white mb-3">{c.bpiH}</h2>
              <p className="text-white/65 leading-relaxed">{c.bpiP}</p>
            </ScrollReveal>
          </div>
        </section>

        {/* Compliance */}
        <section className="section-elevated grid-fade py-10 md:py-14">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto space-y-5">
              <ScrollReveal>
                <h2 className="text-2xl md:text-3xl font-light text-white">{c.complianceH}</h2>
              </ScrollReveal>
              <ScrollReveal>
                <p className="text-white/70 leading-relaxed">{c.complianceP}</p>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-light text-white mb-2">{c.teamH}</h2>
                <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto">{c.teamP}</p>
              </div>
            </ScrollReveal>
            <StaggerGroup className="grid md:grid-cols-3 gap-6">
              {team.map((m) => (
                <motion.div
                  key={m.name}
                  variants={staggerItem}
                  className="group p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300 text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border border-white/10">
                    <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">{m.name}</h3>
                  <p className="text-sm text-white/40 mb-3">{language === "fr" ? m.roleFr : m.roleEn}</p>
                  <a
                    href={m.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-blue)] hover:underline"
                  >
                    LinkedIn
                  </a>
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="container mx-auto px-4 py-16">
          <ScrollReveal>
            <div className="max-w-xl mx-auto text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-white">{c.closingH}</h2>
              <p className="text-white/60 leading-relaxed">{c.closingP}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={localize(DEMO_ROUTE)} className="btn-cta">
                  {c.ctaDemo}
                </Link>
                <Link
                  to={localize("/")}
                  className="inline-flex items-center justify-center rounded-[6px] px-8 py-3 text-sm font-medium text-white/70 border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all"
                >
                  {c.ctaPlatform}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Back */}
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link to={localize("/")} className="text-[var(--accent-blue)] hover:underline text-sm">
              {c.back}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FleuretRaises;
