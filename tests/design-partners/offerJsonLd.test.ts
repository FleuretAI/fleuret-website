import { describe, expect, it } from "vitest";
import { designPartnerOfferJsonLd } from "@/seo/SEO";

const baseParams = {
  priceEur: 4900,
  totalSlots: 5,
  slotsRemaining: 3,
  pentestsIncluded: 3,
  pilotWeeks: 6,
  cohortStartIso: "2026-05-31T22:00:00.000Z",
  url: "https://fleuret.ai/design-partners",
  locale: "fr" as const,
};

describe("designPartnerOfferJsonLd", () => {
  it("returns Product + Event JSON-LD pair", () => {
    const ld = designPartnerOfferJsonLd(baseParams);
    expect(ld).toHaveLength(2);
    expect(ld[0]["@type"]).toBe("Product");
    expect(ld[1]["@type"]).toBe("Event");
  });

  it("Product price uses EUR and matches config", () => {
    const [product] = designPartnerOfferJsonLd(baseParams);
    const offer = product.offers as Record<string, unknown>;
    expect(offer.price).toBe("4900");
    expect(offer.priceCurrency).toBe("EUR");
  });

  it("Product availability is LimitedAvailability when slots remain", () => {
    const [product] = designPartnerOfferJsonLd(baseParams);
    const offer = product.offers as Record<string, unknown>;
    expect(offer.availability).toBe("https://schema.org/LimitedAvailability");
  });

  it("Product availability flips to SoldOut when slotsRemaining is 0", () => {
    const [product] = designPartnerOfferJsonLd({
      ...baseParams,
      slotsRemaining: 0,
    });
    const offer = product.offers as Record<string, unknown>;
    expect(offer.availability).toBe("https://schema.org/SoldOut");
  });

  it("inventoryLevel reflects slot counter", () => {
    const [product] = designPartnerOfferJsonLd(baseParams);
    const offer = product.offers as Record<string, unknown>;
    const inventory = offer.inventoryLevel as Record<string, unknown>;
    expect(inventory.value).toBe(3);
    expect(inventory.maxValue).toBe(5);
    expect(inventory.unitText).toBe("slots");
  });

  it("Event startDate matches cohort kickoff", () => {
    const [, event] = designPartnerOfferJsonLd(baseParams);
    expect(event.startDate).toBe("2026-05-31T22:00:00.000Z");
  });

  it("Event endDate is startDate + pilotWeeks", () => {
    const [, event] = designPartnerOfferJsonLd(baseParams);
    // 2026-05-31T22:00 + 6 weeks (42d) = 2026-07-12T22:00
    expect(event.endDate).toBe("2026-07-12T22:00:00.000Z");
  });

  it("Event capacity tracks total + remaining slots", () => {
    const [, event] = designPartnerOfferJsonLd(baseParams);
    expect(event.maximumAttendeeCapacity).toBe(5);
    expect(event.remainingAttendeeCapacity).toBe(3);
  });

  it("priceValidUntil is the cohort kickoff date (price freezes after)", () => {
    const [product] = designPartnerOfferJsonLd(baseParams);
    const offer = product.offers as Record<string, unknown>;
    expect(offer.priceValidUntil).toBe("2026-05-31");
  });

  it("FR locale produces French product name", () => {
    const [product] = designPartnerOfferJsonLd(baseParams);
    expect(product.name).toContain("Programme");
  });

  it("EN locale produces English product name", () => {
    const [product] = designPartnerOfferJsonLd({
      ...baseParams,
      locale: "en",
    });
    expect(product.name).toContain("Cohort");
  });

  it("Event is virtual + scheduled (not in-person)", () => {
    const [, event] = designPartnerOfferJsonLd(baseParams);
    expect(event.eventAttendanceMode).toBe(
      "https://schema.org/OnlineEventAttendanceMode",
    );
    expect(event.eventStatus).toBe("https://schema.org/EventScheduled");
  });

  it("output is JSON-serializable (no circular refs, no functions)", () => {
    const ld = designPartnerOfferJsonLd(baseParams);
    expect(() => JSON.stringify(ld)).not.toThrow();
    const parsed = JSON.parse(JSON.stringify(ld));
    expect(parsed[0]["@context"]).toBe("https://schema.org");
  });
});
