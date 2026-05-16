/**
 * Industry profiles for the pSEO compliance matrix.
 *
 * Each IndustryProfile carries enough metadata for:
 *  - the compliance page title + breadcrumb label
 *  - the URL slug under /compliance/{framework}/{slug}
 *  - filtering: which industries a given framework applies to
 *
 * Add an industry here, then add MDX pages under
 * src/content/compliance/{framework}/{slug}.mdx for the frameworks it pairs with.
 */

import { z } from "zod";

export const INDUSTRY_SLUGS = [
  "fintech",
  "energy",
  "saas",
  "ecommerce",
] as const;
export type IndustrySlug = (typeof INDUSTRY_SLUGS)[number];

export const IndustryProfileSchema = z.object({
  slug: z.enum(INDUSTRY_SLUGS),
  displayName: z.string().min(1),
  fullName: z.string().min(1),
});
export type IndustryProfile = z.infer<typeof IndustryProfileSchema>;

export const INDUSTRIES: Record<IndustrySlug, IndustryProfile> = {
  fintech: {
    slug: "fintech",
    displayName: "fintech",
    fullName: "Fintech (payment, e-money, crypto-asset services)",
  },
  energy: {
    slug: "energy",
    displayName: "energy",
    fullName: "Energy (electricity, gas, oil, district heating, hydrogen)",
  },
  saas: {
    slug: "saas",
    displayName: "SaaS",
    fullName: "Software-as-a-Service (B2B and B2C cloud applications)",
  },
  ecommerce: {
    slug: "ecommerce",
    displayName: "ecommerce",
    fullName: "Ecommerce (DTC, marketplace, retail, digital goods)",
  },
};

export function isIndustrySlug(value: string): value is IndustrySlug {
  return (INDUSTRY_SLUGS as readonly string[]).includes(value);
}

export function getIndustry(slug: string): IndustryProfile | undefined {
  return isIndustrySlug(slug) ? INDUSTRIES[slug] : undefined;
}
