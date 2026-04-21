import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/motion/ScrollReveal";
import StaggerGroup from "@/components/motion/StaggerGroup";
import { staggerItem } from "@/lib/animations";
import { DEMO_ROUTE } from "@/lib/routes";
import { motion } from "framer-motion";
import { SEO } from "@/seo/SEO";
import yanisPhoto from "@/assets/yanis.png";
import pierrePhoto from "@/assets/pierre-gabriel.png";
import augustinPhoto from "@/assets/augustin.png";
import hornetsecurityLogo from "@/assets/investors/hornetsecurity.png";
import almondLogo from "@/assets/investors/almond.svg";
import gitguardianLogo from "@/assets/investors/gitguardian.svg";
import ovrseaLogo from "@/assets/investors/ovrsea.svg";
import stoikLogo from "@/assets/investors/stoik.svg";
import raiseLogo from "@/assets/investors/raise.svg";
import aurigaLogo from "@/assets/investors/auriga.svg";
import unitedFoundersLogo from "@/assets/investors/unitedfounders.svg";
import windLogo from "@/assets/investors/wind.svg";
import betterAngleLogo from "@/assets/investors/betterangle.svg";

type Investor = {
  /** Primary display. For companies: wordmark text. For individuals: person's full name (personName=true). */
  name: string;
  /** Set true to render name as headline and logo as small brand mark beneath. */
  personName?: boolean;
  logo?: string;
  /** When true, invert logo colors so dark-on-light artwork reads on dark bg. */
  invertLogo?: boolean;
  subtitleFr?: string;
  subtitleEn?: string;
  url: string;
};

const investors: Investor[] = [
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

const vcs: Investor[] = [
  {
    name: "RAISE",
    logo: raiseLogo,
    invertLogo: true,
    url: "https://raise.co/",
  },
  {
    name: "Auriga Cyber Ventures",
    logo: aurigaLogo,
    invertLogo: true,
    url: "https://aurigacyber.com/",
  },
  {
    name: "United Founders",
    logo: unitedFoundersLogo,
    url: "https://unitedfounders.vc/",
  },
  {
    name: "Wind Capital",
    logo: windLogo,
    url: "#",
  },
  {
    name: "Better Angle",
    logo: betterAngleLogo,
    url: "#",
  },
];

const team = [
  {
    name: "Yanis Grigy",
    role: "Co-founder & CEO",
    roleFr: "Co-fondateur & CEO",
    linkedin: "https://www.linkedin.com/in/yanis-grigy-793635237/",
    photo: yanisPhoto,
  },
  {
    name: "Pierre-Gabriel Berlureau",
    role: "Co-founder & CTO",
    roleFr: "Co-fondateur & CTO",
    linkedin: "https://www.linkedin.com/in/pierre-gabriel-berlureau-427320313/",
    photo: pierrePhoto,
  },
  {
    name: "Augustin Ponsin",
    role: "Co-founder & COO",
    roleFr: "Co-fondateur & COO",
    linkedin: "https://www.linkedin.com/in/augustinponsin/",
    photo: augustinPhoto,
  },
];

function renderInvestorTile(
  inv: Investor,
  idx: number,
  language: "fr" | "en",
) {
  const subtitle = language === "fr" ? inv.subtitleFr : inv.subtitleEn;
  const newTabLabel =
    language === "fr" ? "ouvre un nouvel onglet" : "opens in new tab";
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
          {inv.logo && (
            <img
              src={inv.logo}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className={`h-6 md:h-7 max-w-[130px] ${logoClass}`}
            />
          )}
        </>
      ) : inv.logo ? (
        <img
          src={inv.logo}
          alt={inv.name}
          loading="lazy"
          className={`h-10 md:h-12 max-w-[170px] ${logoClass}`}
        />
      ) : (
        <span className="text-base md:text-lg font-light tracking-wide text-white/75 group-hover:text-white transition-colors">
          {inv.name}
        </span>
      )}
      {subtitle && (
        <span className="text-[11px] text-white/40 group-hover:text-white/60 transition-colors">
          {subtitle}
        </span>
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
        aria-label={`${inv.name}${subtitle ? ` — ${subtitle}` : ""} (${newTabLabel})`}
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

const About = () => {
  const { language, t, localize } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <SEO pageKey="about" />
      <Navbar />
      <main id="main-content" className="pt-24 md:pt-28 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-10 md:mb-12">
          <ScrollReveal>
            <div className="max-w-3xl mx-auto space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-light tracking-tight text-white leading-[1.1]">
                {t("about.hero.title")}{" "}
                <span className="text-gradient-accent">
                  {t("about.hero.highlight")}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                {t("about.hero.subtitle")}
              </p>
            </div>
          </ScrollReveal>
        </section>

        {/* Mission */}
        <section className="section-elevated grid-fade py-10 md:py-14 relative">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <ScrollReveal>
                <div className="p-8 rounded-2xl border border-white/8 bg-white/[0.02]">
                  <h2 className="text-2xl font-light text-white mb-4">
                    {t("about.mission.title")}
                  </h2>
                  <p className="text-white/50 leading-relaxed">
                    {t("about.mission.desc")}
                  </p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </section>

        {/* Leadership Team */}
        <section className="container mx-auto px-4 py-10 md:py-14">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <h2 className="text-3xl md:text-4xl font-light text-white text-center mb-12">
                {t("about.team.title")}
              </h2>
            </ScrollReveal>

            <StaggerGroup className="grid md:grid-cols-3 gap-6">
              {team.map((member) => (
                <motion.div
                  key={member.name}
                  variants={staggerItem}
                  className="group p-6 rounded-2xl border border-white/8 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/15 transition-all duration-300 text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border border-white/10">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-medium text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-white/40 mb-3">
                    {language === "fr" ? member.roleFr : member.role}
                  </p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[var(--accent-blue)] hover:underline"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  )}
                </motion.div>
              ))}
            </StaggerGroup>
          </div>
        </section>

        {/* Business angels */}
        <section className="container mx-auto px-4 pb-12 md:pb-16">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-light text-white mb-3">
                  {t("about.investors.title")}
                </h2>
                <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto">
                  {t("about.investors.subtitle")}
                </p>
              </div>
            </ScrollReveal>

            <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {investors.map((inv, idx) => renderInvestorTile(inv, idx, language))}
            </StaggerGroup>
          </div>
        </section>

        {/* VCs */}
        <section className="container mx-auto px-4 pb-16 md:pb-24">
          <div className="max-w-5xl mx-auto">
            <ScrollReveal>
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-light text-white mb-3">
                  {t("about.vcs.title")}
                </h2>
                <p className="text-white/50 text-sm md:text-base max-w-2xl mx-auto">
                  {t("about.vcs.subtitle")}
                </p>
              </div>
            </ScrollReveal>

            <StaggerGroup className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {vcs.map((inv, idx) => renderInvestorTile(inv, idx, language))}
            </StaggerGroup>
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 pb-16">
          <ScrollReveal>
            <div className="max-w-xl mx-auto text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-white">
                {t("about.cta.title")}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={localize(DEMO_ROUTE)} className="btn-cta">
                  {t("about.cta.demo")}
                </Link>
                <Link
                  to={localize("/careers")}
                  className="inline-flex items-center justify-center rounded-[6px] px-8 py-3 text-sm font-medium text-white/70 border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all"
                >
                  {t("about.cta.careers")}
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* Back link */}
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              to={localize("/")}
              className="text-[var(--accent-blue)] hover:underline text-sm"
            >
              &larr; {t("about.back")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default About;
