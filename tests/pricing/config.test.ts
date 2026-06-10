import { describe, expect, it } from "vitest";
import {
  POC_PRICE_EUR,
  PENTEST_PRICE_EUR,
  ADVANCED_PENTEST_PRICE_EUR,
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

  it("Pentest (standard) is €4,000 per test", () => {
    expect(PENTEST_PRICE_EUR).toBe(4000);
  });

  it("Advanced pentest is €8,000 per test", () => {
    expect(ADVANCED_PENTEST_PRICE_EUR).toBe(8000);
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
  it("SaaS GRC wholesale on €4,000 Pentest is €2,000", () => {
    expect(computeWholesalePrice(4000, "saas-grc")).toBe(2000);
  });

  it("SaaS GRC wholesale on €8,000 Advanced is €4,000", () => {
    expect(computeWholesalePrice(8000, "saas-grc")).toBe(4000);
  });

  it("marketplace wholesale on €4,000 Pentest is €2,400", () => {
    expect(computeWholesalePrice(4000, "marketplace")).toBe(2400);
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
    expect(() => computeWholesalePrice(4000, "enterprise")).toThrow();
  });
});

describe("computeUpgradeCredit", () => {
  it("POC €3,000 credits against a €4,000 first test → €1,000", () => {
    expect(
      computeUpgradeCredit({ pocPaidEur: 3000, tierYear1Eur: 4000 }),
    ).toBe(1000);
  });

  it("POC €3,000 credits against a €8,000 advanced test → €5,000", () => {
    expect(
      computeUpgradeCredit({ pocPaidEur: 3000, tierYear1Eur: 8000 }),
    ).toBe(5000);
  });

  it("returns full tier price when no POC was paid", () => {
    expect(
      computeUpgradeCredit({ pocPaidEur: 0, tierYear1Eur: 4000 }),
    ).toBe(4000);
  });

  it("throws when POC credit would exceed tier price", () => {
    expect(() =>
      computeUpgradeCredit({ pocPaidEur: 50000, tierYear1Eur: 4000 }),
    ).toThrow();
  });

  it("throws on negative input", () => {
    expect(() =>
      computeUpgradeCredit({ pocPaidEur: -1, tierYear1Eur: 4000 }),
    ).toThrow();
    expect(() =>
      computeUpgradeCredit({ pocPaidEur: 0, tierYear1Eur: -1 }),
    ).toThrow();
  });
});
