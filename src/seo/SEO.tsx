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

/**
 * Two call shapes:
 *   1. Static page: pass `pageKey`; reads META[pageKey][language].
 *   2. Dynamic page (e.g. blog post): pass `meta` override with explicit
 *      title/description/canonical/hreflangs. `pageKey` becomes optional.
 * If both are passed, `meta` wins.
 */
interface DynamicMeta {
  title: string;
  description: string;
  canonical: string;
  hreflangs: Array<{ hrefLang: string; href: string }>;
  ogImage?: string;
}

interface SEOProps {
  pageKey?: RouteKey;
  meta?: DynamicMeta;
  image?: string;
  jsonLd?: JsonLd | JsonLd[];
  noindex?: boolean;
}

export function SEO({ pageKey, meta, image, jsonLd, noindex }: SEOProps) {
  const { language } = useLanguage();

  if (!pageKey && !meta) {
    throw new Error("SEO requires either pageKey or meta override.");
  }

  const title = meta?.title ?? META[pageKey!][language].title;
  const description =
    meta?.description ?? META[pageKey!][language].description;
  const keywords = meta ? undefined : META[pageKey!][language].keywords;
  const canonical = meta?.canonical ?? canonicalUrl(pageKey!, language);
  const hreflangs = meta?.hreflangs ?? hreflangLinks(pageKey!);
  const ogImage = image ?? meta?.ogImage ?? DEFAULT_OG_IMAGE;
  const jsonLdArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet prioritizeSeoTags>
      <html lang={language} />
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonical} />
      {hreflangs.map((h) => (
        <link key={h.hrefLang} rel="alternate" hrefLang={h.hrefLang} href={h.href} />
      ))}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Fleuret" />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content={ogLocale(language)} />
      <meta property="og:locale:alternate" content={altOgLocale(language)} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:image:alt" content={title} />

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

/**
 * Design Partner cohort JSON-LD. Emits a `Product` with an `Offer` and a
 * companion `Event` for the cohort kickoff. Google rich results consume the
 * Offer (price, availability, slot count via inventoryLevel) and the Event
 * (start/end dates, location). All values come from `designPartnerConfig.ts`
 * so a config edit propagates here without touching the schema.
 *
 * `availability` flips to `SoldOut` when `slotsRemaining <= 0`; this lets the
 * counter on /api/slots drive the rich result without a redeploy.
 */
export function designPartnerOfferJsonLd(params: {
  priceEur: number;
  totalSlots: number;
  slotsRemaining: number;
  pentestsIncluded: number;
  pilotWeeks: number;
  cohortStartIso: string;
  url: string;
  locale: "fr" | "en";
}): JsonLd[] {
  const cohortEndIso = new Date(
    new Date(params.cohortStartIso).getTime() +
      params.pilotWeeks * 7 * 24 * 60 * 60 * 1000,
  ).toISOString();
  const availability =
    params.slotsRemaining > 0
      ? "https://schema.org/LimitedAvailability"
      : "https://schema.org/SoldOut";
  const productName =
    params.locale === "fr"
      ? "Programme Design Partners Fleuret"
      : "Fleuret Design Partner Cohort";
  const productDescription =
    params.locale === "fr"
      ? `${params.pentestsIncluded} pentests par IA agentique en ${params.pilotWeeks} semaines, livrable conforme NIS2/DORA.`
      : `${params.pentestsIncluded} agentic AI pentests in ${params.pilotWeeks} weeks, NIS2/DORA-ready report.`;

  const product: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: productName,
    description: productDescription,
    brand: { "@type": "Brand", name: "Fleuret AI" },
    offers: {
      "@type": "Offer",
      url: params.url,
      price: String(params.priceEur),
      priceCurrency: "EUR",
      availability,
      inventoryLevel: {
        "@type": "QuantitativeValue",
        value: params.slotsRemaining,
        maxValue: params.totalSlots,
        unitText: "slots",
      },
      validFrom: new Date().toISOString().slice(0, 10),
      priceValidUntil: params.cohortStartIso.slice(0, 10),
      seller: { "@type": "Organization", name: "Fleuret AI", url: SITE_URL },
    },
  };

  const event: JsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name:
      params.locale === "fr"
        ? "Kickoff cohort Design Partners Fleuret"
        : "Fleuret Design Partner Cohort Kickoff",
    startDate: params.cohortStartIso,
    endDate: cohortEndIso,
    eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "VirtualLocation",
      url: params.url,
    },
    organizer: {
      "@type": "Organization",
      name: "Fleuret AI",
      url: SITE_URL,
    },
    offers: {
      "@type": "Offer",
      url: params.url,
      price: String(params.priceEur),
      priceCurrency: "EUR",
      availability,
      validFrom: new Date().toISOString().slice(0, 10),
    },
    maximumAttendeeCapacity: params.totalSlots,
    remainingAttendeeCapacity: params.slotsRemaining,
  };

  return [product, event];
}

/**
 * Article JSON-LD for blog posts. Google uses this for article carousels +
 * rich results. `author` is a plain string byline.
 */
export function articleJsonLd(params: {
  headline: string;
  description: string;
  url: string;
  author: string;
  datePublished: string; // ISO date (YYYY-MM-DD)
  image?: string;
}): JsonLd {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    url: params.url,
    author: { "@type": "Person", name: params.author },
    publisher: {
      "@type": "Organization",
      name: "Fleuret AI",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/favicon.png`,
      },
    },
    datePublished: params.datePublished,
    dateModified: params.datePublished,
    image: params.image ?? DEFAULT_OG_IMAGE,
    mainEntityOfPage: params.url,
  };
}
