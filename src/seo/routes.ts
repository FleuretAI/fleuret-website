// Single-locale (EN) site. Locale type kept for backwards-compatible imports.
export type Locale = "en";

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
  | "subProcessors"
  | "resources"
  | "blog"
  | "compliance"
  | "fundraise"
  | "notFound";

export const SITE_URL = "https://fleuret.ai";
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALES: Locale[] = ["en"];
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.png`;

export const ROUTES: Record<RouteKey, string> = {
  home: "/",
  about: "/about",
  careers: "/careers",
  designPartners: "/design-partners",
  demo: "/demo",
  mentionsLegales: "/mentions-legales",
  privacy: "/privacy",
  terms: "/terms",
  security: "/security",
  subProcessors: "/sub-processors",
  resources: "/resources",
  blog: "/blog",
  compliance: "/compliance",
  fundraise: "/news/fleuret-raises-3-5m",
  notFound: "/404",
};

type MetaEntry = {
  title: string;
  description: string;
  keywords?: string;
};

export const META: Record<RouteKey, MetaEntry> = {
  home: {
    title: "Fleuret | AI-powered automated pentesting",
    description:
      "Continuous pentesting powered by agentic AI. NIS2, DORA, ISO 27001 compliance. Audit-ready results in hours, hosted in Europe.",
    keywords:
      "automated pentest, AI pentesting, cybersecurity, penetration testing, security audit, NIS2, DORA, GDPR, ISO 27001, continuous pentest, offensive security",
  },
  about: {
    title: "About Fleuret | Agentic AI pentesting",
    description:
      "Fleuret AI combines agentic AI and offensive expertise to make pentesting fast, affordable and continuous. Our mission and founding team.",
  },
  careers: {
    title: "Careers | Fleuret AI",
    description:
      "Join Fleuret AI. Build the future of offensive security with agentic AI. Paris-based roles across engineering and security.",
  },
  designPartners: {
    title: "Design Partners Program | Fleuret AI",
    description:
      "5 slots, 3 AI pentests in 6 weeks for €4,900. Founder-led onboarding, NIS2 and DORA audit-ready report. Apply now.",
    keywords:
      "design partners, pentest pilot, AI pentest trial, DORA pentest, NIS2 pentest, Fleuret",
  },
  demo: {
    title: "Book a Free Demo | Fleuret AI",
    description:
      "See your attack surface in 30 minutes. Book a free demo with a Fleuret founder. AI-powered pentests at €2,500 vs €15,000+ traditional. EU-hosted.",
    keywords:
      "pentest demo, AI pentest demo, book pentest, Fleuret demo, automated pentest, DORA pentest demo",
  },
  mentionsLegales: {
    title: "Legal Notice | Fleuret",
    description:
      "Legal notice and publisher information for Fleuret AI. Company registration, head office, hosts and publication director.",
  },
  privacy: {
    title: "Privacy Policy | Fleuret",
    description:
      "Fleuret AI privacy policy. How we handle personal data under GDPR, processors list and user rights.",
  },
  terms: {
    title: "Terms of Use | Fleuret",
    description:
      "Terms of use for the fleuret.ai website. Intellectual property, liability limitation and applicable law.",
  },
  security: {
    title: "Security Policy | Fleuret",
    description:
      "Fleuret AI security policy. Vulnerability disclosure, responsible reporting program and protection measures.",
  },
  subProcessors: {
    title: "Sub-processors | Fleuret",
    description:
      "Full list of Fleuret AI sub-processors. Scaleway France hosting, Supabase EU database, open-weight LLM inference 100% in Europe. GDPR art. 28 and partner DPA compliant.",
    keywords:
      "sub-processors, GDPR, DPA, EU hosting, Scaleway, sovereignty, compliance, NIS2, DORA",
  },
  resources: {
    title: "Resources | Fleuret",
    description:
      "Insights, case studies and guides on AI-powered pentesting, NIS2/DORA compliance and offensive security.",
    keywords:
      "fleuret resources, pentest blog, cybersecurity insights, NIS2, DORA, agentic AI",
  },
  blog: {
    title: "Blog | Fleuret",
    description:
      "Our latest insights on continuous AI pentesting, European compliance and offensive security.",
  },
  compliance: {
    title: "Compliance guides | Fleuret",
    description:
      "Practical compliance guides for CISOs: DORA, NIS2, ISO 27001, SOC 2, PCI DSS pentest scoping by industry. AI-driven continuous pentest hosted in Europe.",
    keywords:
      "compliance pentest, DORA pentest, NIS2 pentest, ISO 27001 pentest, SOC 2 pentest, PCI DSS pentest",
  },
  fundraise: {
    title: "Fleuret raises €3.5M to industrialize agentic AI pentesting",
    description:
      "Fleuret raises €3.5M (equity + Bpifrance innovation loan) to accelerate agentic AI pentesting in Europe. Round led by RAISE Capital with Auriga, Wind and United Founders.",
    keywords:
      "Fleuret, seed round, funding, agentic AI pentesting, cybersecurity, RAISE Capital, Auriga, Bpifrance, NIS2, DORA",
  },
  notFound: {
    title: "Page Not Found | Fleuret",
    description: "This page does not exist or has been moved.",
  },
};

export function canonicalUrl(key: RouteKey, _locale?: Locale): string {
  return SITE_URL + ROUTES[key];
}

export function hreflangLinks(_key: RouteKey): Array<{ hrefLang: string; href: string }> {
  // Single-locale site, no alternates needed.
  return [];
}

export function ogLocale(_locale?: Locale): string {
  return "en_US";
}

export function altOgLocale(_locale?: Locale): string {
  return "en_US";
}

export function detectLocaleFromPath(_pathname: string): Locale {
  return "en";
}

/**
 * Identity now that the site is single-locale. Kept for API compatibility
 * with components that still call useLanguage().localize(path).
 */
export function buildLocalePath(basePath: string, _locale?: Locale): string {
  return basePath;
}

export function swapLocalePath(pathname: string, _target?: Locale): string {
  return pathname;
}

export const ALL_PRERENDER_PATHS: string[] = Object.values(ROUTES);

export function hreflangLinksFor(
  _path: string,
  _hreflangPath: string,
  _defaultLocale?: Locale,
): Array<{ hrefLang: string; href: string }> {
  return [];
}
