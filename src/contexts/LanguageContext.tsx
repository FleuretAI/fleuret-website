import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Navbar
    'nav.home': 'Accueil',
    'nav.problem': 'Le problème',
    'nav.platform': 'Plateforme',
    'nav.pricing': 'Tarifs',
    'nav.company': 'Entreprise',
    'nav.about': 'À propos',
    'nav.careers': 'Carrières',
    'nav.cta': 'Réserver une démo',

    // Hero
    'hero.badge': 'Fleuret lève 4M€ pre-seed pour construire le futur de la sécurité IA',
    'hero.badge.label': 'Actualité',
    'hero.badge.text': 'Fleuret lève 4M€ pre-seed pour construire le futur de la sécurité IA',
    'hero.title.line1': 'Sécurité offensive incisive.',
    'hero.title.line2': 'Scalabilité infinie.',
    'hero.subtitle': 'Fleuret combine IA agentique et expertise offensive pour délivrer des pentests de niveau humain en heures, pas en semaines.',
    'hero.cta': 'Réserver une démo',
    'hero.cta.secondary': 'Voir la plateforme',

    // Partners (social proof)
    'partners.title': 'Issus de',

    // Problem section (WhySection)
    'problem.main.title': 'Le pentest est',
    'problem.main.broken': 'cassé.',
    'problem.main.subtitle': 'Vos déploiements s\'enchaînent à grande vitesse. Vos pentests, eux, restent ponctuels, lents et coûteux.',
    'problem.delay.title': 'Lent',
    'problem.delay.desc': '2 à 4 semaines pour un rapport. Entre chaque pentest, 3 à 12 mois d\'exposition sans visibilité.',
    'problem.friction.title': 'Complexe',
    'problem.friction.desc': 'Trouver un cabinet, négocier le scope, attendre un créneau. Chaque pentest est un projet à part entière.',
    'problem.cost.title': 'Coûteux',
    'problem.cost.desc': '+10 000€ pour un pentest complet. Un budget qui limite la fréquence et laisse des angles morts.',
    'problem.exposure': 'Pendant ce temps, vos systèmes restent exposés aux cyberattaques.',

    // Platform section (replaces Benchmark)
    'platform.main.title': 'Une plateforme,',
    'platform.main.highlight': 'pas un prestataire.',
    'platform.main.subtitle': 'Lancez un pentest en quelques clics. Recevez un rapport audit-ready en heures, pas en semaines.',
    'platform.asm.title': 'Surface d\'attaque',
    'platform.asm.desc': 'Cartographiez automatiquement l\'ensemble de votre surface d\'attaque externe. Identifiez chaque asset exposé.',
    'platform.pentest.title': 'Pentest on-demand',
    'platform.pentest.desc': 'Lancez un pentest sur n\'importe quel asset, quand vous voulez. WebApp, API — résultats en heures.',
    'platform.scanners.title': 'Scanners intégrés',
    'platform.scanners.desc': 'Infra réseau, cloud, Active Directory, mobile, repos Git. Connectés à votre ASM, lancés en un clic.',
    'platform.reports.title': 'Rapports & Dashboard',
    'platform.reports.desc': 'Rapports PDF audit-ready, dashboard temps réel, alertes instantanées, conseils de remédiation priorisés.',

    // How it Works
    'process.main.title': 'Comment ça',
    'process.main.works': 'fonctionne',
    'process.main.subtitle': 'De votre périmètre à votre rapport, entièrement automatisé.',
    'process.deploy.title': 'Connectez votre périmètre',
    'process.deploy.desc': 'Renseignez vos IPs, domaines ou URLs. Notre ASM cartographie automatiquement votre surface d\'attaque.',
    'process.attack.title': 'Lancez un pentest',
    'process.attack.desc': 'Nos agents IA attaquent vos systèmes comme le ferait un pentester expert. WebApp, API, et plus.',
    'process.exploits.title': 'Recevez votre rapport',
    'process.exploits.desc': 'Vulnérabilités exploitées, impact métier, plan de remédiation priorisé. 0 faux positif — chaque finding est validé par un PoC. Audit-ready, en heures.',

    // Comparison Table
    'comparison.title': 'Pourquoi Fleuret',
    'comparison.header.capability': 'Critère',
    'comparison.header.traditional': 'Pentest classique',
    'comparison.header.fleuret': 'Fleuret',
    'comparison.header.automated': 'Scanner automatisé',
    'comparison.depth': 'Profondeur',
    'comparison.depth.traditional': 'Approfondie',
    'comparison.depth.fleuret': 'Approfondie',
    'comparison.depth.automated': 'Superficielle',
    'comparison.speed': 'Rapidité',
    'comparison.speed.traditional': '2-4 semaines',
    'comparison.speed.fleuret': 'Quelques heures',
    'comparison.speed.automated': 'Minutes',
    'comparison.cost': 'Coût',
    'comparison.cost.traditional': '+10 000€',
    'comparison.cost.fleuret': 'Dès 2 500€',
    'comparison.cost.automated': 'Faible',
    'comparison.falsePositives': 'Faux positifs',
    'comparison.falsePositives.traditional': 'Rares',
    'comparison.falsePositives.fleuret': 'Zéro (PoC validés)',
    'comparison.falsePositives.automated': 'Nombreux',
    'comparison.frequency': 'Fréquence',
    'comparison.frequency.traditional': 'Trimestrielle-Annuelle',
    'comparison.frequency.fleuret': 'On-demand',
    'comparison.frequency.automated': 'Continue',
    'comparison.compliance': 'Rapport audit-ready',
    'comparison.adaptability': 'Adaptabilité',

    // Problem legend
    'problem.legend.pentest': 'Pentest',
    'problem.legend.audited': 'Déploiement (audité)',
    'problem.legend.unaudited': 'Déploiement (non audité)',
    'problem.legend.stat': 'déploiements partent sans audit',

    // Pricing
    'pricing.title': 'Pricing',
    'pricing.subtitle': 'transparent',
    'pricing.title.main': 'Tarification',
    'pricing.title.accent': 'transparente',
    'pricing.description': 'Un pentest de qualité professionnelle ne devrait pas coûter une fortune.',
    'pricing.standard.name': 'Standard',
    'pricing.startingAt': 'À partir de',
    'pricing.standard.price': '2 500€',
    'pricing.standard.unit': '/ pentest / an',
    'pricing.standard.desc': 'Pentest complet, sans engagement. Résultats en heures.',
    'pricing.standard.feature1': 'Pentest WebApp ou API',
    'pricing.standard.feature2': 'Rapport PDF audit-ready',
    'pricing.standard.feature3': 'Accès plateforme & dashboard',
    'pricing.standard.feature4': 'Re-test inclus',
    'pricing.standard.f1': 'Pentest WebApp ou API',
    'pricing.standard.f2': 'Rapport PDF audit-ready',
    'pricing.standard.f3': 'Accès plateforme & dashboard',
    'pricing.standard.f4': 'Re-test inclus',
    'pricing.standard.cta': 'Réserver une démo',
    'pricing.enterprise.name': 'Entreprise',
    'pricing.enterprise.price': 'Sur mesure',
    'pricing.enterprise.desc': 'Volume, engagement long terme, tarifs dégressifs.',
    'pricing.enterprise.feature1': 'Tout Standard +',
    'pricing.enterprise.feature2': 'Tarifs dégressifs sur volume',
    'pricing.enterprise.feature3': 'Scanners intégrés (infra, cloud, AD)',
    'pricing.enterprise.feature4': 'Support dédié & intégrations',
    'pricing.enterprise.f1': 'Tout Standard +',
    'pricing.enterprise.f2': 'Tarifs dégressifs sur volume',
    'pricing.enterprise.f3': 'Scanners intégrés (infra, cloud, AD)',
    'pricing.enterprise.f4': 'Support dédié & intégrations',
    'pricing.enterprise.cta': 'Nous contacter',
    'pricing.cta': 'Réserver une démo',
    'pricing.guarantee': '0 finding, 0 frais.',
    'pricing.guarantee.title': '0 finding, 0 frais.',
    'pricing.guarantee.subtitle': 'Si notre pentest ne trouve rien, vous ne payez rien.',
    'pricing.guarantee.desc': 'Si notre pentest ne trouve rien, vous ne payez rien.',
    'pricing.anchor': 'vs +10 000€ pour un pentest classique complet',

    // Compliance
    'compliance.title': 'Conçu pour la',
    'compliance.highlight': 'conformité européenne.',
    'compliance.subtitle': 'Hébergé en Europe, données souveraines. Fleuret vous aide à cocher les cases réglementaires.',
    'compliance.nis2.title': 'NIS2',
    'compliance.nis2.desc': 'Tests de pénétration réguliers exigés pour les entités essentielles et importantes.',
    'compliance.iso.title': 'ISO 27001',
    'compliance.iso.desc': 'Pentests requis dans le cadre de l\'annexe A — contrôle de la gestion des vulnérabilités.',
    'compliance.soc2.title': 'SOC 2',
    'compliance.soc2.desc': 'Tests d\'intrusion attendus pour valider les contrôles de sécurité du Trust Service Criteria.',
    'compliance.dora.title': 'DORA',
    'compliance.dora.desc': 'Tests de résilience opérationnelle numérique obligatoires pour le secteur financier européen.',
    'compliance.sovereignty': 'Données hébergées en Europe. Conformité RGPD garantie.',

    // CTA
    'cta.title': 'Prêt à sécuriser votre surface d\'attaque ?',
    'cta.subtitle': 'Réservez un call de 15 minutes. On vous montre la plateforme sur votre périmètre.',
    'cta.button': 'Réserver une démo',

    // Footer
    'footer.tagline': 'Pentest par IA, hébergé en Europe.',
    'footer.contact': 'Contact',
    'footer.rights': '© 2026 fleuret.ai. Tous droits réservés.',

    // Careers
    'careers.hero.title': 'Faites le meilleur',
    'careers.hero.highlight': 'travail de votre vie.',
    'careers.hero.subtitle': 'On construit le futur du pentest. Rejoignez une équipe d\'ingénieurs et de chercheurs passionnés par l\'IA et la cybersécurité.',
    'careers.hero.cta': 'Candidature spontanée',
    'careers.perks.title': 'Pourquoi nous rejoindre',
    'careers.perks.equity': 'BSPCE early-stage',
    'careers.perks.equipment': 'Setup top niveau',
    'careers.perks.hybrid': 'Travail hybride',
    'careers.perks.salary': 'Salaire compétitif',
    'careers.perks.holidays': '30+ jours de congés',
    'careers.perks.healthcare': 'Mutuelle premium',
    'careers.values.title': 'Nos valeurs',
    'careers.values.newIdeas.title': 'On accueille les idées nouvelles',
    'careers.values.newIdeas.desc': 'Chaque voix compte. On crée un espace sûr pour proposer, expérimenter, et itérer.',
    'careers.values.outcomeFocused.title': 'On vise le résultat',
    'careers.values.outcomeFocused.desc': 'Ce qui compte, c\'est l\'impact. Pas la méthode, pas les heures — le résultat.',
    'careers.values.integrity.title': 'On agit avec intégrité',
    'careers.values.integrity.desc': 'Transparence, honnêteté, responsabilité. On fait ce qu\'on dit.',
    'careers.values.gsd.title': 'On livre.',
    'careers.values.gsd.desc': 'On aime les défis. On exécute vite, on apprend vite, on avance.',
    'careers.positions.title': 'Postes ouverts',
    'careers.positions.subtitle': 'On recrute les meilleurs talents en IA et cybersécurité.',
    'careers.positions.empty': 'Aucun poste ouvert pour le moment — mais on cherche toujours des profils exceptionnels.',
    'careers.positions.spontaneous': 'Envoyer une candidature spontanée →',
    'careers.back': 'Retour à l\'accueil',

    // About
    'about.hero.title': 'On construit le futur',
    'about.hero.highlight': 'du pentest.',
    'about.hero.subtitle': 'Fleuret AI combine intelligence artificielle et expertise offensive pour rendre le pentest accessible, continu et souverain.',
    'about.mission.title': 'Notre mission',
    'about.mission.desc': 'Le pentest traditionnel est lent, cher et ponctuel. On croit qu\'il devrait être rapide, abordable et continu. Fleuret utilise l\'IA agentique pour simuler de vraies attaques sur vos systèmes — avec la même rigueur qu\'un pentester humain, mais en heures, pas en semaines.',
    'about.team.title': 'L\'équipe fondatrice',
    'about.cta.title': 'Prêt à travailler avec nous ?',
    'about.cta.demo': 'Réserver une démo',
    'about.cta.careers': 'Voir les postes',
    'about.back': 'Retour à l\'accueil',

    // 404
    'notfound.title': '404',
    'notfound.subtitle': 'Page introuvable',
    'notfound.home': 'Retour à l\'accueil',
  },
  en: {
    // Navbar
    'nav.home': 'Home',
    'nav.problem': 'The problem',
    'nav.platform': 'Platform',
    'nav.pricing': 'Pricing',
    'nav.company': 'Company',
    'nav.about': 'About',
    'nav.careers': 'Careers',
    'nav.cta': 'Book a demo',

    // Hero
    'hero.badge': 'Fleuret raised 4M€ pre-seed to build the future of AI security',
    'hero.badge.label': 'News',
    'hero.badge.text': 'Fleuret raised 4M€ pre-seed to build the future of AI security',
    'hero.title.line1': 'Incisive offensive security.',
    'hero.title.line2': 'Infinite scalability.',
    'hero.subtitle': 'Fleuret combines agentic AI and offensive expertise to deliver human-level pentests in hours, not weeks.',
    'hero.cta': 'Book a demo',
    'hero.cta.secondary': 'See the platform',

    // Partners
    'partners.title': 'Alumni of',

    // Problem
    'problem.main.title': 'Pentesting is',
    'problem.main.broken': 'broken.',
    'problem.main.subtitle': 'Your deployments move fast. Your pentests don\'t. They\'re slow, expensive, and infrequent.',
    'problem.delay.title': 'Slow',
    'problem.delay.desc': '2 to 4 weeks per report. Between each pentest, 3 to 12 months of blind exposure.',
    'problem.friction.title': 'Complex',
    'problem.friction.desc': 'Find a firm, negotiate scope, wait for availability. Every pentest is a project in itself.',
    'problem.cost.title': 'Expensive',
    'problem.cost.desc': '€10,000+ for a complete pentest. A budget that limits frequency and leaves blind spots.',
    'problem.exposure': 'Meanwhile, your systems remain exposed to cyberattacks.',

    // Platform
    'platform.main.title': 'A platform,',
    'platform.main.highlight': 'not a contractor.',
    'platform.main.subtitle': 'Launch a pentest in a few clicks. Get an audit-ready report in hours, not weeks.',
    'platform.asm.title': 'Attack surface',
    'platform.asm.desc': 'Automatically map your entire external attack surface. Identify every exposed asset.',
    'platform.pentest.title': 'On-demand pentest',
    'platform.pentest.desc': 'Launch a pentest on any asset, whenever you want. WebApp, API — results in hours.',
    'platform.scanners.title': 'Integrated scanners',
    'platform.scanners.desc': 'Network infra, cloud, Active Directory, mobile, Git repos. Connected to your ASM, launched in one click.',
    'platform.reports.title': 'Reports & Dashboard',
    'platform.reports.desc': 'Audit-ready PDF reports, real-time dashboard, instant alerts, prioritized remediation advice.',

    // How it Works
    'process.main.title': 'How it',
    'process.main.works': 'works',
    'process.main.subtitle': 'From your perimeter to your report, fully automated.',
    'process.deploy.title': 'Connect your perimeter',
    'process.deploy.desc': 'Enter your IPs, domains or URLs. Our ASM automatically maps your attack surface.',
    'process.attack.title': 'Launch a pentest',
    'process.attack.desc': 'Our AI agents attack your systems like an expert pentester would. WebApp, API, and more.',
    'process.exploits.title': 'Get your report',
    'process.exploits.desc': 'Exploited vulnerabilities, business impact, prioritized remediation plan. 0 false positives — every finding is validated by a PoC. Audit-ready, in hours.',

    // Comparison
    'comparison.title': 'Why Fleuret',
    'comparison.header.capability': 'Criteria',
    'comparison.header.traditional': 'Manual pentest',
    'comparison.header.fleuret': 'Fleuret',
    'comparison.header.automated': 'Automated scanner',
    'comparison.depth': 'Depth',
    'comparison.depth.traditional': 'Deep',
    'comparison.depth.fleuret': 'Deep',
    'comparison.depth.automated': 'Shallow',
    'comparison.speed': 'Speed',
    'comparison.speed.traditional': '2-4 weeks',
    'comparison.speed.fleuret': 'Hours',
    'comparison.speed.automated': 'Minutes',
    'comparison.cost': 'Cost',
    'comparison.cost.traditional': '€10,000+',
    'comparison.cost.fleuret': 'From €2,500',
    'comparison.cost.automated': 'Low',
    'comparison.falsePositives': 'False positives',
    'comparison.falsePositives.traditional': 'Rare',
    'comparison.falsePositives.fleuret': 'Zero (PoC validated)',
    'comparison.falsePositives.automated': 'Many',
    'comparison.frequency': 'Frequency',
    'comparison.frequency.traditional': 'Quarterly-Annual',
    'comparison.frequency.fleuret': 'On-demand',
    'comparison.frequency.automated': 'Continuous',
    'comparison.compliance': 'Audit-ready report',
    'comparison.adaptability': 'Adaptability',

    // Problem legend
    'problem.legend.pentest': 'Pentest',
    'problem.legend.audited': 'Deploy (audited)',
    'problem.legend.unaudited': 'Deploy (unaudited)',
    'problem.legend.stat': 'deploys ship unaudited',

    // Pricing
    'pricing.title': 'Transparent',
    'pricing.subtitle': 'pricing',
    'pricing.title.main': 'Transparent',
    'pricing.title.accent': 'pricing',
    'pricing.description': 'Professional-grade pentesting shouldn\'t cost a fortune.',
    'pricing.standard.name': 'Standard',
    'pricing.startingAt': 'Starting at',
    'pricing.standard.price': '2,500€',
    'pricing.standard.unit': '/ pentest / year',
    'pricing.standard.desc': 'Complete pentest, no commitment. Results in hours.',
    'pricing.standard.feature1': 'WebApp or API pentest',
    'pricing.standard.feature2': 'Audit-ready PDF report',
    'pricing.standard.feature3': 'Platform & dashboard access',
    'pricing.standard.feature4': 'Re-test included',
    'pricing.standard.f1': 'WebApp or API pentest',
    'pricing.standard.f2': 'Audit-ready PDF report',
    'pricing.standard.f3': 'Platform & dashboard access',
    'pricing.standard.f4': 'Re-test included',
    'pricing.standard.cta': 'Book a demo',
    'pricing.enterprise.name': 'Enterprise',
    'pricing.enterprise.price': 'Custom',
    'pricing.enterprise.desc': 'Volume, long-term commitment, volume discounts.',
    'pricing.enterprise.feature1': 'Everything in Standard +',
    'pricing.enterprise.feature2': 'Volume discounts',
    'pricing.enterprise.feature3': 'Integrated scanners (infra, cloud, AD)',
    'pricing.enterprise.feature4': 'Dedicated support & integrations',
    'pricing.enterprise.f1': 'Everything in Standard +',
    'pricing.enterprise.f2': 'Volume discounts',
    'pricing.enterprise.f3': 'Integrated scanners (infra, cloud, AD)',
    'pricing.enterprise.f4': 'Dedicated support & integrations',
    'pricing.enterprise.cta': 'Contact us',
    'pricing.cta': 'Book a demo',
    'pricing.guarantee': '0 findings, 0 costs.',
    'pricing.guarantee.title': '0 findings, 0 costs.',
    'pricing.guarantee.subtitle': 'If our pentest finds nothing, you pay nothing.',
    'pricing.guarantee.desc': 'If our pentest finds nothing, you pay nothing.',
    'pricing.anchor': 'vs €10,000+ for a complete manual pentest',

    // Compliance
    'compliance.title': 'Built for',
    'compliance.highlight': 'European compliance.',
    'compliance.subtitle': 'Hosted in Europe, sovereign data. Fleuret helps you check the regulatory boxes.',
    'compliance.nis2.title': 'NIS2',
    'compliance.nis2.desc': 'Regular penetration testing required for essential and important entities.',
    'compliance.iso.title': 'ISO 27001',
    'compliance.iso.desc': 'Pentests required under Annex A — vulnerability management controls.',
    'compliance.soc2.title': 'SOC 2',
    'compliance.soc2.desc': 'Penetration testing expected to validate Trust Service Criteria security controls.',
    'compliance.dora.title': 'DORA',
    'compliance.dora.desc': 'Mandatory digital operational resilience testing for the European financial sector.',
    'compliance.sovereignty': 'Data hosted in Europe. GDPR compliance guaranteed.',

    // CTA
    'cta.title': 'Ready to secure your attack surface?',
    'cta.subtitle': 'Book a 15-minute call. We\'ll show you the platform on your perimeter.',
    'cta.button': 'Book a demo',

    // Footer
    'footer.tagline': 'AI pentesting, hosted in Europe.',
    'footer.contact': 'Contact',
    'footer.rights': '© 2026 fleuret.ai. All rights reserved.',

    // Careers
    'careers.hero.title': 'Do the best',
    'careers.hero.highlight': 'work of your life.',
    'careers.hero.subtitle': 'We\'re building the future of pentesting. Join a team of engineers and researchers passionate about AI and cybersecurity.',
    'careers.hero.cta': 'Spontaneous application',
    'careers.perks.title': 'Why you\'ll love it here',
    'careers.perks.equity': 'Early-stage equity',
    'careers.perks.equipment': 'Top-notch equipment',
    'careers.perks.hybrid': 'Hybrid working',
    'careers.perks.salary': 'Competitive salary',
    'careers.perks.holidays': '30+ days paid holiday',
    'careers.perks.healthcare': 'Premium healthcare',
    'careers.values.title': 'Our values',
    'careers.values.newIdeas.title': 'We welcome new ideas',
    'careers.values.newIdeas.desc': 'Every voice matters. We create a safe space to propose, experiment, and iterate.',
    'careers.values.outcomeFocused.title': 'We\'re outcome-focused',
    'careers.values.outcomeFocused.desc': 'What matters is impact. Not the method, not the hours — the result.',
    'careers.values.integrity.title': 'We act with integrity',
    'careers.values.integrity.desc': 'Transparency, honesty, accountability. We do what we say.',
    'careers.values.gsd.title': 'We ship.',
    'careers.values.gsd.desc': 'We love challenges. We execute fast, learn fast, move forward.',
    'careers.positions.title': 'Open positions',
    'careers.positions.subtitle': 'We\'re hiring top talent in AI and cybersecurity.',
    'careers.positions.empty': 'No open positions right now — but we\'re always looking for exceptional people.',
    'careers.positions.spontaneous': 'Send a spontaneous application →',
    'careers.back': 'Back to home',

    // About
    'about.hero.title': 'Building the future',
    'about.hero.highlight': 'of pentesting.',
    'about.hero.subtitle': 'Fleuret AI combines artificial intelligence and offensive expertise to make pentesting accessible, continuous, and sovereign.',
    'about.mission.title': 'Our mission',
    'about.mission.desc': 'Traditional pentesting is slow, expensive, and infrequent. We believe it should be fast, affordable, and continuous. Fleuret uses agentic AI to simulate real attacks on your systems — with the same rigor as a human pentester, but in hours, not weeks.',
    'about.team.title': 'Founding team',
    'about.cta.title': 'Ready to work with us?',
    'about.cta.demo': 'Book a demo',
    'about.cta.careers': 'View open positions',
    'about.back': 'Back to home',

    // 404
    'notfound.title': '404',
    'notfound.subtitle': 'Page not found',
    'notfound.home': 'Back to home',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'fr') ? saved : 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
