import { Helmet } from "react-helmet-async";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  META,
  RouteKey,
  SITE_URL,
  DEFAULT_OG_IMAGE,
  canonicalUrl,
  hreflangLinks,
  ogLocale,
  altOgLocale,
} from "./routes";

type JsonLd = Record<string, unknown>;

interface SEOProps {
  pageKey: RouteKey;
  image?: string;
  jsonLd?: JsonLd | JsonLd[];
  noindex?: boolean;
}

export function SEO({ pageKey, image, jsonLd, noindex }: SEOProps) {
  const { language } = useLanguage();
  const meta = META[pageKey][language];
  const canonical = canonicalUrl(pageKey, language);
  const hreflangs = hreflangLinks(pageKey);
  const ogImage = image ?? DEFAULT_OG_IMAGE;
  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <html lang={language} />
      <title>{meta.title}</title>
      <meta name="title" content={meta.title} />
      <meta name="description" content={meta.description} />
      {meta.keywords && <meta name="keywords" content={meta.keywords} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonical} />
      {hreflangs.map((h) => (
        <link key={h.hrefLang} rel="alternate" hrefLang={h.hrefLang} href={h.href} />
      ))}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Fleuret" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={meta.title} />
      <meta property="og:description" content={meta.description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={meta.title} />
      <meta property="og:locale" content={ogLocale(language)} />
      <meta property="og:locale:alternate" content={altOgLocale(language)} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={meta.title} />
      <meta name="twitter:description" content={meta.description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={meta.title} />

      {jsonLdArray.map((data, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
}

export function organizationJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Fleuret AI",
    legalName: "FLEURET AI",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.png`,
    description:
      "Plateforme de pentesting automatisé par IA agentique pour la cybersécurité continue.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "14 Rue Ballu",
      addressLocality: "Paris",
      postalCode: "75009",
      addressCountry: "FR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      email: "contact@fleuret.ai",
      contactType: "Customer Service",
      availableLanguage: ["French", "English"],
    },
    sameAs: [],
  };
}

export function websiteJsonLd(): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Fleuret",
    url: SITE_URL,
    inLanguage: ["fr-FR", "en-US"],
  };
}

export function softwareApplicationJsonLd(locale: "fr" | "en"): JsonLd {
  const descriptions = {
    fr: "Plateforme de pentesting automatisé par IA agentique avec tests de sécurité en continu.",
    en: "Agentic AI pentesting platform with continuous security testing.",
  };
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Fleuret AI",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    description: descriptions[locale],
  };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
