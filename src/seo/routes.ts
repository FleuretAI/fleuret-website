// Single-locale (EN) site. Locale type kept for backwards-compatible imports.
export type Locale = "en";

export type RouteKey =
  | "home"
  | "about"
  | "careers"
  | "designPartners"
  | "partners"
  | "demo"
  | "mentionsLegales"
  | "privacy"
  | "terms"
  | "security"
  | "subProcessors"
  | "resources"
  | "blog"
  | "compliance"
  | "platform"
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
  partners: "/partners",
  demo: "/demo",
  mentionsLegales: "/mentions-legales",
  privacy: "/privacy",
  terms: "/terms",
  security: "/security",
  subProcessors: "/sub-processors",
  resources: "/resources",
  blog: "/blog",
  compliance: "/compliance",
  platform: "/platform",
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
  partners: {
    title: "Channel Partners | Fleuret",
    description:
      "GRC platform or pentest marketplace? Resell Fleuret under your brand. 50% wholesale on Recurring, 60% on POC. Sovereign EU, DORA / NIS2 ready.",
    keywords:
      "Fleuret partners, GRC, Vanta, Sprinto, Drata, pentest marketplace, white label, wholesale, NIS2, DORA",
  },
  demo: {
    title: "Book a Demo | Agentic AI Pentest in Hours | Fleuret AI",
    description:
      "30-minute call with a Fleuret founder. See how Émile delivers human-grade pentests in hours, not weeks. Webapp, REST, GraphQL, external infra. EU-hosted, NIS2 and DORA audit-ready.",
    keywords:
      "pentest demo, AI pentest demo, book pentest, Fleuret demo, automated pentest, DORA pentest demo, agentic AI pentest, NIS2 pentest, autonomous pentest demo, EU pentest provider, Active Directory pentest demo",
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
    title: "Resources | Blog and Compliance Hub | Fleuret",
    description:
      "Browse the Fleuret blog (industry analysis and competitor breakdowns) and the compliance hub (DORA, NIS2, ISO 27001 pentest scoping by industry).",
    keywords:
      "fleuret resources, pentest blog, compliance hub, DORA scoping, NIS2 scoping, ISO 27001 pentest, agentic AI pentest, Fleuret library",
  },
  blog: {
    title: "Blog | Fleuret",
    description:
      "Our latest insights on continuous AI pentesting, European compliance and offensive security.",
  },
  compliance: {
    title: "Compliance Pentest Guides | DORA, NIS2, ISO 27001 | Fleuret",
    description:
      "Practical pentest scoping for CISOs: DORA, NIS2, ISO 27001, SOC 2, PCI DSS by industry. Agentic AI pentest with audit-ready evidence. EU-hosted, €3,000 POC vs €15,000+ consulting.",
    keywords:
      "compliance pentest, DORA pentest, NIS2 pentest, ISO 27001 pentest, SOC 2 pentest, PCI DSS pentest, agentic AI compliance pentest, automated DORA pentest, NIS2 pentest scoping, Active Directory pentest, EU sovereign compliance pentest, pentest €3000",
  },
  platform: {
    title: "Platform | How Émile Works | Fleuret AI",
    description:
      "Inside Fleuret's agentic AI pentest engine. Multi-agent orchestration, proof-of-concept validation, audit-ready compliance output. Sovereign EU, zero false positives.",
    keywords:
      "Émile, agentic AI pentest, multi-agent pentest, AI pentest engine, automated pentesting, web app pentest, API pentest, Active Directory pentest, DORA pentest, NIS2 pentest, sovereign EU pentest, pentest platform",
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
