export type Locale = "fr" | "en";

export type RouteKey =
  | "home"
  | "about"
  | "careers"
  | "designPartners"
  | "mentionsLegales"
  | "privacy"
  | "terms"
  | "security"
  | "notFound";

export const SITE_URL = "https://fleuret.ai";
export const DEFAULT_LOCALE: Locale = "fr";
export const LOCALES: Locale[] = ["fr", "en"];
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

type LocalePath = { fr: string; en: string };

export const ROUTES: Record<RouteKey, LocalePath> = {
  home: { fr: "/", en: "/en" },
  about: { fr: "/about", en: "/en/about" },
  careers: { fr: "/careers", en: "/en/careers" },
  designPartners: { fr: "/design-partners", en: "/en/design-partners" },
  mentionsLegales: { fr: "/mentions-legales", en: "/en/mentions-legales" },
  privacy: { fr: "/privacy", en: "/en/privacy" },
  terms: { fr: "/terms", en: "/en/terms" },
  security: { fr: "/security", en: "/en/security" },
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
    { hrefLang: "x-default", href: SITE_URL + ROUTES[key].fr },
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
