/**
 * Pricing parameters. Single source of truth.
 *
 * SKUs:
 *   POC         — €3,000 per webapp, one-time. Land SKU.
 *   Starter     — €10,000/yr, 1-3 webapps, 2 pentests/app/yr + platform.
 *   Growth      — €25,000/yr, 4-10 webapps, weekly rescan + Jira + audit PDF.
 *   Scale       — Custom, 10+ webapps, dedicated CSM.
 *
 * Channel wholesale (Fleuret's share of list):
 *   SaaS GRC partners: 50%
 *   Marketplace partners: 60%
 *
 * Conversion: POC fee credits toward year 1 if upgrade within 6 months.
 */

export const POC_PRICE_EUR = 3000;

export const STARTER_PRICE_EUR = 10000;
export const STARTER_MAX_APPS = 3;

export const GROWTH_PRICE_EUR = 25000;
export const GROWTH_MAX_APPS = 10;

export const WHOLESALE_RATE_GRC_PCT = 50;
export const WHOLESALE_RATE_MARKETPLACE_PCT = 60;

export const POC_TO_RECURRING_CREDIT_WINDOW_MONTHS = 6;

export type PartnerType = "saas-grc" | "marketplace";
export type TierKey = "starter" | "growth" | "scale";

export function computeWholesalePrice(
  listPriceEur: number,
  partnerType: PartnerType,
): number {
  if (listPriceEur < 0) {
    throw new Error("listPriceEur must be non-negative");
  }
  const sharePct =
    partnerType === "saas-grc"
      ? WHOLESALE_RATE_GRC_PCT
      : partnerType === "marketplace"
        ? WHOLESALE_RATE_MARKETPLACE_PCT
        : null;
  if (sharePct === null) {
    throw new Error(`Unknown partnerType: ${String(partnerType)}`);
  }
  return Math.round(listPriceEur * sharePct) / 100;
}

export function computeUpgradeCredit(args: {
  pocPaidEur: number;
  tierYear1Eur: number;
}): number {
  const { pocPaidEur, tierYear1Eur } = args;
  if (pocPaidEur < 0 || tierYear1Eur < 0) {
    throw new Error("Inputs must be non-negative");
  }
  if (pocPaidEur > tierYear1Eur) {
    throw new Error("POC credit cannot exceed tier year 1 price");
  }
  return tierYear1Eur - pocPaidEur;
}
