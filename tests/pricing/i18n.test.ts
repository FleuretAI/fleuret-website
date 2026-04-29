import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");

function readSource(rel: string): string {
  return readFileSync(resolve(ROOT, rel), "utf8");
}

const LANG_CTX = readSource("src/contexts/LanguageContext.tsx");

const REQUIRED_PRICING_KEYS = [
  "pricing.title.main",
  "pricing.title.accent",
  "pricing.description",
  "pricing.startingAt",
  "pricing.cta",
  "pricing.poc.name",
  "pricing.poc.price",
  "pricing.poc.unit",
  "pricing.poc.desc",
  "pricing.poc.f1",
  "pricing.poc.f2",
  "pricing.poc.f3",
  "pricing.poc.f4",
  "pricing.poc.cta",
  "pricing.poc.upgradeCredit",
  "pricing.recurring.name",
  "pricing.recurring.price1yr",
  "pricing.recurring.price3yr",
  "pricing.recurring.unit",
  "pricing.recurring.desc",
  "pricing.recurring.f1",
  "pricing.recurring.f2",
  "pricing.recurring.f3",
  "pricing.recurring.f4",
  "pricing.recurring.f5",
  "pricing.recurring.f6",
  "pricing.recurring.cta",
  "pricing.recurring.toggle.1yr",
  "pricing.recurring.toggle.3yr",
  "pricing.recurring.toggle.savings",
  "pricing.guarantee.title",
  "pricing.guarantee.subtitle",
  "pricing.anchor",
  "pricing.dpBanner.title",
  "pricing.dpBanner.subtitle",
  "pricing.dpBanner.cta",
  "pricing.partnersBanner.title",
  "pricing.partnersBanner.subtitle",
  "pricing.partnersBanner.cta",
];

const REQUIRED_PARTNERS_KEYS = [
  "partners.hero.title",
  "partners.hero.subtitle",
  "partners.hero.cta",
  "partners.who.title",
  "partners.who.grc.title",
  "partners.who.grc.body",
  "partners.who.marketplace.title",
  "partners.who.marketplace.body",
  "partners.who.advisory.title",
  "partners.who.advisory.body",
  "partners.model.title",
  "partners.model.grc.label",
  "partners.model.grc.value",
  "partners.model.grc.detail",
  "partners.model.marketplace.label",
  "partners.model.marketplace.value",
  "partners.model.marketplace.detail",
  "partners.included.title",
  "partners.included.f1",
  "partners.included.f2",
  "partners.included.f3",
  "partners.included.f4",
  "partners.included.f5",
  "partners.included.f6",
  "partners.proof.title",
  "partners.proof.body",
  "partners.proof.cta",
  "partners.cta.title",
  "partners.cta.body",
  "partners.cta.button",
];

function countOccurrences(haystack: string, needle: string): number {
  // Count occurrences of `'<key>':` in the dictionary (one per locale = 2 expected).
  const re = new RegExp(`'${needle.replace(/\./g, "\\.")}'\\s*:`, "g");
  return (haystack.match(re) || []).length;
}

describe("i18n — pricing keys (FR + EN parity)", () => {
  for (const key of REQUIRED_PRICING_KEYS) {
    it(`'${key}' is defined in BOTH locales`, () => {
      expect(countOccurrences(LANG_CTX, key)).toBe(2);
    });
  }
});

describe("i18n — partners page keys (FR + EN parity)", () => {
  for (const key of REQUIRED_PARTNERS_KEYS) {
    it(`'${key}' is defined in BOTH locales`, () => {
      expect(countOccurrences(LANG_CTX, key)).toBe(2);
    });
  }
});

describe("i18n — design partners pricing banner cross-link", () => {
  for (const key of [
    "designPartners.pricingBanner.title",
    "designPartners.pricingBanner.subtitle",
    "designPartners.pricingBanner.cta",
  ]) {
    it(`'${key}' is defined in BOTH locales`, () => {
      expect(countOccurrences(LANG_CTX, key)).toBe(2);
    });
  }
});

describe("i18n — REGRESSION: orphan keys removed", () => {
  // R1: every dropped pricing key must be GONE from LanguageContext entirely.
  // If anyone re-adds them by mistake, fail loudly.
  const DROPPED = [
    "pricing.standard.name",
    "pricing.standard.price",
    "pricing.standard.unit",
    "pricing.standard.desc",
    "pricing.standard.feature1",
    "pricing.standard.feature2",
    "pricing.standard.feature3",
    "pricing.standard.feature4",
    "pricing.standard.f1",
    "pricing.standard.f2",
    "pricing.standard.f3",
    "pricing.standard.f4",
    "pricing.standard.cta",
    "pricing.enterprise.name",
    "pricing.enterprise.price",
    "pricing.enterprise.desc",
    "pricing.enterprise.feature1",
    "pricing.enterprise.feature2",
    "pricing.enterprise.feature3",
    "pricing.enterprise.feature4",
    "pricing.enterprise.f1",
    "pricing.enterprise.f2",
    "pricing.enterprise.f3",
    "pricing.enterprise.f4",
    "pricing.enterprise.cta",
  ];
  for (const key of DROPPED) {
    it(`'${key}' is NOT present (dropped in pricing rework)`, () => {
      expect(countOccurrences(LANG_CTX, key)).toBe(0);
    });
  }
});

describe("i18n — em-dash sentence connector ban (user-facing)", () => {
  // CLAUDE.md (user) rule: never use the em-dash pattern "— " in any
  // user-facing text on fleuret-website. Reads as AI-generated.
  // Heuristic: scan only string literals inside the dictionaries for the
  // pattern. We don't ban em-dash in code comments or i18n key values that
  // include it inside parentheses; we ban the "X — Y" connector specifically.
  it("no '— ' connector pattern in pricing or partners string values", () => {
    // Extract just the lines that look like dictionary entries for our keys.
    const lines = LANG_CTX
      .split("\n")
      .filter((l) => /'(pricing|partners|designPartners\.pricingBanner)\./.test(l));
    const offenders = lines.filter((l) => l.includes("— "));
    expect(offenders, `em-dash connector in: ${offenders.join("\n")}`).toHaveLength(0);
  });
});
