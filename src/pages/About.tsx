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
import yanisPhoto from "@/assets/yanis.png";
import pierrePhoto from "@/assets/pierre-gabriel.png";
import augustinPhoto from "@/assets/augustin.png";

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

const About = () => {
  const { language, t } = useLanguage();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="pt-32 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-4 text-center mb-20">
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
        <section className="section-elevated grid-fade py-16 md:py-24 relative">
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
        <section className="container mx-auto px-4 py-16 md:py-24">
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

        {/* CTA */}
        <section className="container mx-auto px-4 pb-16">
          <ScrollReveal>
            <div className="max-w-xl mx-auto text-center space-y-6">
              <h2 className="text-2xl md:text-3xl font-light text-white">
                {t("about.cta.title")}
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={DEMO_ROUTE}
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium text-white transition-all hover:opacity-90 hover:shadow-[0_0_30px_rgba(79,143,255,0.3)]"
                  style={{
                    background: "linear-gradient(135deg, var(--accent-blue), var(--accent-violet))",
                  }}
                >
                  {t("about.cta.demo")}
                </Link>
                <Link
                  to="/careers"
                  className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-medium text-white/70 border border-white/10 hover:text-white hover:border-white/20 hover:bg-white/[0.04] transition-all"
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
              to="/"
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
