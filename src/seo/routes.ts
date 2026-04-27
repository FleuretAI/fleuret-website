export type Locale = "fr" | "en";

export type RouteKey =
  | "home"
  | "about"
  | "careers"
  | "designPartners"
  | "demo"
  | "mentionsLegales"
  | "privacy"
  | "terms"
  | "security"
  | "resources"
  | "blog"
  | "changelog"
  | "fundraise"
  | "notFound";

export const SITE_URL = "https://fleuret.ai";
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALES: Locale[] = ["fr", "en"];
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

type LocalePath = { fr: string; en: string };

export const ROUTES: Record<RouteKey, LocalePath> = {
  home: { fr: "/", en: "/en" },
  about: { fr: "/about", en: "/en/about" },
  careers: { fr: "/careers", en: "/en/careers" },
  designPartners: { fr: "/design-partners", en: "/en/design-partners" },
  demo: { fr: "/demo", en: "/en/demo" },
  mentionsLegales: { fr: "/mentions-legales", en: "/en/mentions-legales" },
  privacy: { fr: "/privacy", en: "/en/privacy" },
  terms: { fr: "/terms", en: "/en/terms" },
  security: { fr: "/security", en: "/en/security" },
  resources: { fr: "/resources", en: "/en/resources" },
  blog: { fr: "/blog", en: "/en/blog" },
  changelog: { fr: "/changelog", en: "/en/changelog" },
  fundraise: { fr: "/news/fleuret-raises-3-5m", en: "/en/news/fleuret-raises-3-5m" },
  notFound: { fr: "/404", en: "/en/404" },
};

type MetaEntry = {
  title: string;
  description: string;
  keywords?: string;
};

export const META: Record<RouteKey, Record<Locale, MetaEntry>> = {
  home: {
    fr: {
      title: "Fleuret | Pentest automatisé par IA agentique",
      description:
        "Pentest continu propulsé par IA agentique. Conformité NIS2, DORA, ISO 27001. Résultats audit-ready en heures, hébergés en Europe.",
      keywords:
        "pentest automatisé, pentest IA, cybersécurité, test intrusion, audit sécurité, NIS2, DORA, RGPD, ISO 27001, pentest continu, sécurité offensive",
    },
    en: {
      title: "Fleuret | AI-powered automated pentesting",
      description:
        "Continuous pentesting powered by agentic AI. NIS2, DORA, ISO 27001 compliance. Audit-ready results in hours, hosted in Europe.",
      keywords:
        "automated pentest, AI pentesting, cybersecurity, penetration testing, security audit, NIS2, DORA, GDPR, ISO 27001, continuous pentest, offensive security",
    },
  },
  about: {
    fr: {
      title: "À propos de Fleuret | Pentest par IA agentique",
      description:
        "Fleuret AI combine IA agentique et expertise offensive pour rendre le pentest rapide, abordable et continu. Notre mission et l'équipe fondatrice.",
    },
    en: {
      title: "About Fleuret | Agentic AI pentesting",
      description:
        "Fleuret AI combines agentic AI and offensive expertise to make pentesting fast, affordable and continuous. Our mission and founding team.",
    },
  },
  careers: {
    fr: {
      title: "Carrières | Fleuret AI",
      description:
        "Rejoignez Fleuret AI. Construisez le futur de la sécurité offensive avec l'IA agentique. Postes à Paris, profils tech et sécurité.",
    },
    en: {
      title: "Careers | Fleuret AI",
      description:
        "Join Fleuret AI. Build the future of offensive security with agentic AI. Paris-based roles across engineering and security.",
    },
  },
  designPartners: {
    fr: {
      title: "Programme Design Partners | Fleuret",
      description:
        "Rejoignez le programme Design Partners Fleuret. Pentests à -50% pendant 12 mois, ligne directe fondateurs, input produit prioritaire.",
    },
    en: {
      title: "Design Partners Program | Fleuret",
      description:
        "Join the Fleuret Design Partners program. 50% off pentests for 12 months, direct founder access, priority product input.",
    },
  },
  demo: {
    fr: {
      title: "Réserver une démo | Fleuret",
      description:
        "Réservez une démo Fleuret de 30 minutes avec un fondateur. Pentest automatisé par IA agentique, résultats audit-ready, hébergement européen.",
    },
    en: {
      title: "Book a Demo | Fleuret",
      description:
        "Book a 30-minute Fleuret demo with a founder. Agentic AI-powered pentesting, audit-ready results, European hosting.",
    },
  },
  mentionsLegales: {
    fr: {
      title: "Mentions légales | Fleuret",
      description:
        "Mentions légales et informations éditeur de Fleuret AI. SIREN, siège social, hébergeurs et directeur de publication.",
    },
    en: {
      title: "Legal Notice | Fleuret",
      description:
        "Legal notice and publisher information for Fleuret AI. Company registration, head office, hosts and publication director.",
    },
  },
  privacy: {
    fr: {
      title: "Politique de confidentialité | Fleuret",
      description:
        "Politique de confidentialité de Fleuret AI. Traitement des données personnelles conformément au RGPD, sous-traitants et droits utilisateurs.",
    },
    en: {
      title: "Privacy Policy | Fleuret",
      description:
        "Fleuret AI privacy policy. How we handle personal data under GDPR, processors list and user rights.",
    },
  },
  terms: {
    fr: {
      title: "Conditions d'utilisation | Fleuret",
      description:
        "Conditions générales d'utilisation du site fleuret.ai. Propriété intellectuelle, limitation de responsabilité, droit applicable.",
    },
    en: {
      title: "Terms of Use | Fleuret",
      description:
        "Terms of use for the fleuret.ai website. Intellectual property, liability limitation and applicable law.",
    },
  },
  security: {
    fr: {
      title: "Politique de sécurité | Fleuret",
      description:
        "Politique de sécurité de Fleuret AI. Signalement de vulnérabilités, programme de divulgation responsable et mesures de protection.",
    },
    en: {
      title: "Security Policy | Fleuret",
      description:
        "Fleuret AI security policy. Vulnerability disclosure, responsible reporting program and protection measures.",
    },
  },
  resources: {
    fr: {
      title: "Ressources | Fleuret",
      description:
        "Analyses, études de cas et guides sur le pentest automatisé par IA agentique, la conformité NIS2/DORA et la sécurité offensive.",
      keywords:
        "ressources fleuret, blog pentest, analyses cybersécurité, NIS2, DORA, IA agentique",
    },
    en: {
      title: "Resources | Fleuret",
      description:
        "Insights, case studies and guides on AI-powered pentesting, NIS2/DORA compliance and offensive security.",
      keywords:
        "fleuret resources, pentest blog, cybersecurity insights, NIS2, DORA, agentic AI",
    },
  },
  blog: {
    fr: {
      title: "Blog | Fleuret",
      description:
        "Nos dernières analyses sur le pentest continu par IA agentique, la conformité européenne et la sécurité offensive.",
    },
    en: {
      title: "Blog | Fleuret",
      description:
        "Our latest insights on continuous AI pentesting, European compliance and offensive security.",
    },
  },
  changelog: {
    fr: {
      title: "Changelog | Fleuret",
      description:
        "Toutes les améliorations Fleuret, livrées en continu. Chaque version, chaque fix, chaque nouvelle capacité, en clair.",
      keywords:
        "fleuret changelog, journal des changements, releases, pentest IA, NIS2, DORA",
    },
    en: {
      title: "Changelog | Fleuret",
      description:
        "Every Fleuret improvement, shipped continuously. Each release, each fix, each new capability, in the open.",
      keywords:
        "fleuret changelog, releases, AI pentesting changelog, NIS2, DORA",
    },
  },
  fundraise: {
    fr: {
      title: "Fleuret lève 3,5 M€ pour industrialiser le pentest par IA agentique",
      description:
        "Fleuret lève 3,5 M€ (équity + prêt amorçage Bpifrance) pour accélérer le pentest par IA agentique en Europe. Tour mené par RAISE Capital avec Auriga, Wind et United Founders.",
      keywords:
        "Fleuret, levée de fonds, seed, pentest IA, cybersécurité, RAISE Capital, Auriga, Bpifrance, NIS2, DORA",
    },
    en: {
      title: "Fleuret raises €3.5M to industrialize agentic AI pentesting",
      description:
        "Fleuret raises €3.5M (equity + Bpifrance innovation loan) to accelerate agentic AI pentesting in Europe. Round led by RAISE Capital with Auriga, Wind and United Founders.",
      keywords:
        "Fleuret, seed round, funding, agentic AI pentesting, cybersecurity, RAISE Capital, Auriga, Bpifrance, NIS2, DORA",
    },
  },
  notFound: {
    fr: {
      title: "Page introuvable | Fleuret",
      description: "Cette page n'existe pas ou a été déplacée.",
    },
    en: {
      title: "Page Not Found | Fleuret",
      description: "This page does not exist or has been moved.",
    },
  },
};

export function canonicalUrl(key: RouteKey, locale: Locale): string {
  return SITE_URL + ROUTES[key][locale];
}

export function hreflangLinks(key: RouteKey): Array<{ hrefLang: string; href: string }> {
  return [
    { hrefLang: "fr", href: SITE_URL + ROUTES[key].fr },
    { hrefLang: "en", href: SITE_URL + ROUTES[key].en },
    { hrefLang: "x-default", href: SITE_URL + ROUTES[key].en },
  ];
}

export function ogLocale(locale: Locale): string {
  return locale === "fr" ? "fr_FR" : "en_US";
}

export function altOgLocale(locale: Locale): string {
  return locale === "fr" ? "en_US" : "fr_FR";
}

export function detectLocaleFromPath(pathname: string): Locale {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "fr";
}

/**
 * Prefix a FR-canonical base path with the locale prefix, so Link/navigate
 * calls stay on the current locale. `basePath` must be the FR version
 * (e.g. "/about"). Returns "/about" for fr, "/en/about" for en.
 */
export function buildLocalePath(basePath: string, locale: Locale): string {
  if (locale !== "en") return basePath;
  if (basePath === "/") return "/en";
  if (basePath.startsWith("/en")) return basePath;
  return "/en" + basePath;
}

export function swapLocalePath(pathname: string, target: Locale): string {
  const current = detectLocaleFromPath(pathname);
  if (current === target) return pathname;
  if (target === "en") {
    if (pathname === "/") return "/en";
    return "/en" + pathname;
  }
  if (pathname === "/en") return "/";
  return pathname.replace(/^\/en/, "") || "/";
}

export const ALL_PRERENDER_PATHS: string[] = Object.values(ROUTES).flatMap((r) => [r.fr, r.en]);

/**
 * Build an hreflang pair list for an arbitrary URL. Used by the dynamic SEO
 * override path (e.g. blog post pages) where `RouteKey` doesn't apply.
 */
export function hreflangLinksFor(
  path: string,
  hreflangPath: string,
  defaultLocale: Locale = "en",
): Array<{ hrefLang: string; href: string }> {
  const frUrl = path.startsWith("/en") ? SITE_URL + hreflangPath : SITE_URL + path;
  const enUrl = path.startsWith("/en") ? SITE_URL + path : SITE_URL + hreflangPath;
  const xDefault = defaultLocale === "en" ? enUrl : frUrl;
  return [
    { hrefLang: "fr", href: frUrl },
    { hrefLang: "en", href: enUrl },
    { hrefLang: "x-default", href: xDefault },
  ];
}
