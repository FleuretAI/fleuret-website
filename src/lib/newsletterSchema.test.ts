import { describe, expect, it } from "vitest";
import { newsletterSchema, NEWSLETTER_CONSENT_VERSION } from "./newsletterSchema";

const base = {
  email: "subscriber@example.com",
  consent: true as const,
  submissionId: "6f0a0c28-8a8a-4d4b-a0a0-1111aaaa2222",
};

describe("newsletterSchema", () => {
  it("accepts a valid input", () => {
    const parsed = newsletterSchema.parse(base);
    expect(parsed.email).toBe("subscriber@example.com");
    expect(parsed.consent).toBe(true);
    expect(parsed.submissionId).toBe(base.submissionId);
  });

  it("lowercases + trims email", () => {
    const parsed = newsletterSchema.parse({ ...base, email: "  Subscriber@Example.COM  " });
    expect(parsed.email).toBe("subscriber@example.com");
  });

  it("rejects an invalid email", () => {
    expect(() => newsletterSchema.parse({ ...base, email: "not-an-email" })).toThrow();
  });

  it("rejects email longer than 320 chars", () => {
    const long = `${"a".repeat(320)}@example.com`;
    expect(() => newsletterSchema.parse({ ...base, email: long })).toThrow();
  });

  it("rejects missing consent (false)", () => {
    expect(() =>
      newsletterSchema.parse({ ...base, consent: false as unknown as true }),
    ).toThrow();
  });

  it("rejects an invalid submissionId (not a UUID)", () => {
    expect(() =>
      newsletterSchema.parse({ ...base, submissionId: "not-a-uuid" }),
    ).toThrow();
  });

  it("rejects an unknown locale value", () => {
    expect(() =>
      newsletterSchema.parse({ ...base, locale: "de" as unknown as "fr" }),
    ).toThrow();
  });

  it("accepts optional utm + referrer + sourcePath + locale", () => {
    const parsed = newsletterSchema.parse({
      ...base,
      locale: "fr" as const,
      sourcePath: "/blog/some-post",
      referrer: "https://example.com/ref",
      utm: { source: "linkedin", medium: "dm", campaign: "w4" },
    });
    expect(parsed.locale).toBe("fr");
    expect(parsed.sourcePath).toBe("/blog/some-post");
    expect(parsed.utm?.source).toBe("linkedin");
  });

  it("caps utm fields at 120 chars", () => {
    expect(() =>
      newsletterSchema.parse({ ...base, utm: { source: "a".repeat(121) } }),
    ).toThrow();
  });

  it("caps sourcePath at 500 chars", () => {
    expect(() =>
      newsletterSchema.parse({ ...base, sourcePath: "a".repeat(501) }),
    ).toThrow();
  });

  it("exposes a frozen consent version constant", () => {
    expect(NEWSLETTER_CONSENT_VERSION).toBe("2026-05-17");
  });
});
