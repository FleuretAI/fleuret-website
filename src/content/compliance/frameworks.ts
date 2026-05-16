/**
 * Compliance framework profiles. Source of truth for the pSEO matrix.
 *
 * Each FrameworkProfile carries enough metadata for:
 *  - the compliance page title + breadcrumb label
 *  - the URL slug under /compliance/{slug}/{industry}
 *  - downstream automation (Approach B generator) reading regulator citations
 *
 * Add a framework here, then add MDX pages under
 * src/content/compliance/{slug}/{industry}.mdx for the industries it applies to.
 */

import { z } from "zod";

export const FRAMEWORK_SLUGS = [
  "dora",
  "nis2",
  "iso27001",
  "soc2",
  "pcidss",
] as const;
export type FrameworkSlug = (typeof FRAMEWORK_SLUGS)[number];

export const FrameworkProfileSchema = z.object({
  slug: z.enum(FRAMEWORK_SLUGS),
  displayName: z.string().min(1),
  fullName: z.string().min(1),
  regulator: z.string().min(1),
  citationRoot: z.string().url(),
});
export type FrameworkProfile = z.infer<typeof FrameworkProfileSchema>;

export const FRAMEWORKS: Record<FrameworkSlug, FrameworkProfile> = {
  dora: {
    slug: "dora",
    displayName: "DORA",
    fullName: "Digital Operational Resilience Act",
    regulator: "European Supervisory Authorities (ESAs)",
    citationRoot: "https://eur-lex.europa.eu/eli/reg/2022/2554/oj",
  },
  nis2: {
    slug: "nis2",
    displayName: "NIS2",
    fullName: "Network and Information Security Directive 2",
    regulator: "ENISA + national CSIRTs",
    citationRoot: "https://eur-lex.europa.eu/eli/dir/2022/2555/oj",
  },
  iso27001: {
    slug: "iso27001",
    displayName: "ISO 27001",
    fullName: "ISO/IEC 27001:2022 Information Security Management",
    regulator: "ISO/IEC accredited certification bodies",
    citationRoot: "https://www.iso.org/standard/27001",
  },
  soc2: {
    slug: "soc2",
    displayName: "SOC 2",
    fullName: "AICPA SOC 2 Trust Services Criteria",
    regulator: "AICPA",
    citationRoot:
      "https://www.aicpa-cima.com/topic/audit-assurance/audit-and-assurance-greater-than-soc-2",
  },
  pcidss: {
    slug: "pcidss",
    displayName: "PCI DSS",
    fullName: "Payment Card Industry Data Security Standard 4.0",
    regulator: "PCI Security Standards Council",
    citationRoot: "https://www.pcisecuritystandards.org/document_library",
  },
};

export function isFrameworkSlug(value: string): value is FrameworkSlug {
  return (FRAMEWORK_SLUGS as readonly string[]).includes(value);
}

export function getFramework(slug: string): FrameworkProfile | undefined {
  return isFrameworkSlug(slug) ? FRAMEWORKS[slug] : undefined;
}
