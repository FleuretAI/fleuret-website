import { describe, expect, it } from "vitest";
import {
  POC_PRICE_EUR,
  STARTER_PRICE_EUR,
  STARTER_MAX_APPS,
  GROWTH_PRICE_EUR,
  GROWTH_MAX_APPS,
  WHOLESALE_RATE_GRC_PCT,
  WHOLESALE_RATE_MARKETPLACE_PCT,
  POC_TO_RECURRING_CREDIT_WINDOW_MONTHS,
  computeWholesalePrice,
  computeUpgradeCredit,
} from "@/lib/pricingConfig";

describe("pricingConfig — constants", () => {
  it("POC list price is €3,000", () => {
    expect(POC_PRICE_EUR).toBe(3000);
  });

  it("Starter is €10,000/yr for up to 3 apps", () => {
    expect(STARTER_PRICE_EUR).toBe(10000);
    expect(STARTER_MAX_APPS).toBe(3);
  });

  it("Growth is €25,000/yr for up to 10 apps", () => {
    expect(GROWTH_PRICE_EUR).toBe(25000);
    expect(GROWTH_MAX_APPS).toBe(10);
  });

  it("SaaS GRC wholesale rate is 50%", () => {
    expect(WHOLESALE_RATE_GRC_PCT).toBe(50);
  });

  it("marketplace wholesale rate is 60%", () => {
    expect(WHOLESALE_RATE_MARKETPLACE_PCT).toBe(60);
  });

  it("POC credit window is 6 months", () => {
    expect(POC_TO_RECURRING_CREDIT_WINDOW_MONTHS).toBe(6);
  });
});

describe("computeWholesalePrice", () => {
  it("SaaS GRC wholesale on €25,000 Growth is €12,500", () => {
    expect(computeWholesalePrice(25000, "saas-grc")).toBe(12500);
  });

  it("SaaS GRC wholesale on €10,000 Starter is €5,000", () => {
    expect(computeWholesalePrice(10000, "saas-grc")).toBe(5000);
  });

  it("marketplace wholesale on €3,000 POC is €1,800", () => {
    expect(computeWholesalePrice(3000, "marketplace")).toBe(1800);
  });

  it("returns 0 for 0 input", () => {
    expect(computeWholesalePrice(0, "saas-grc")).toBe(0);
    expect(computeWholesalePrice(0, "marketplace")).toBe(0);
  });

  it("throws on negative input", () => {
    expect(() => computeWholesalePrice(-1, "saas-grc")).toThrow();
  });

  it("throws on unknown partner type", () => {
    // @ts-expect-error: deliberate runtime check
    expect(() => computeWholesalePrice(25000, "enterprise")).toThrow();
  });
});

describe("computeUpgradeCredit", () => {
  it("POC €3,000 credits against Starter €10,000 → €7,000", () => {
    expect(
      computeUpgradeCredit({ pocPaidEur: 3000, tierYear1Eur: 10000 }),
    ).toBe(7000);
  });

  it("POC €3,000 credits against Growth €25,000 → €22,000", () => {
    expect(
      computeUpgradeCredit({ pocPaidEur: 3000, tierYear1Eur: 25000 }),
    ).toBe(22000);
  });

  it("returns full tier price when no POC was paid", () => {
    expect(
      computeUpgradeCredit({ pocPaidEur: 0, tierYear1Eur: 10000 }),
    ).toBe(10000);
  });

  it("throws when POC credit would exceed tier price", () => {
    expect(() =>
      computeUpgradeCredit({ pocPaidEur: 50000, tierYear1Eur: 10000 }),
    ).toThrow();
  });

  it("throws on negative input", () => {
    expect(() =>
      computeUpgradeCredit({ pocPaidEur: -1, tierYear1Eur: 10000 }),
    ).toThrow();
    expect(() =>
      computeUpgradeCredit({ pocPaidEur: 0, tierYear1Eur: -1 }),
    ).toThrow();
  });
});
