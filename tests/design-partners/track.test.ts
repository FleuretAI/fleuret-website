import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  trackApplyBooked,
  trackApplyError,
  trackApplyFormView,
  trackApplyQualified,
  trackApplyStarted,
  trackApplySubmitted,
  trackApplyUnqualified,
} from "@/lib/designPartnerTrack";

type Gtag = (
  cmd: string,
  action: string,
  params?: Record<string, unknown>,
) => void;

describe("designPartnerTrack — gtag wired", () => {
  let gtag: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    gtag = vi.fn();
    (globalThis as { gtag?: Gtag }).gtag = gtag as unknown as Gtag;
  });

  afterEach(() => {
    delete (globalThis as { gtag?: Gtag }).gtag;
  });

  it("apply_form_view fires with form_name", () => {
    trackApplyFormView();
    expect(gtag).toHaveBeenCalledWith("event", "apply_form_view", {
      form_name: "design_partners_apply",
    });
  });

  it("apply_started fires with form_name", () => {
    trackApplyStarted();
    expect(gtag).toHaveBeenCalledWith("event", "apply_started", {
      form_name: "design_partners_apply",
    });
  });

  it("apply_submitted includes role + company_size", () => {
    trackApplySubmitted("ciso", "100-499");
    expect(gtag).toHaveBeenCalledWith("event", "apply_submitted", {
      form_name: "design_partners_apply",
      role: "ciso",
      company_size: "100-499",
    });
  });

  it("apply_qualified includes role + company_size", () => {
    trackApplyQualified("cto", "500-999");
    expect(gtag).toHaveBeenCalledWith("event", "apply_qualified", {
      form_name: "design_partners_apply",
      role: "cto",
      company_size: "500-999",
    });
  });

  it("apply_unqualified fires", () => {
    trackApplyUnqualified("devops_lead", "100-499");
    expect(gtag).toHaveBeenCalledWith("event", "apply_unqualified", {
      form_name: "design_partners_apply",
      role: "devops_lead",
      company_size: "100-499",
    });
  });

  it("apply_error captures kind and HTTP status", () => {
    trackApplyError("server", 500);
    expect(gtag).toHaveBeenCalledWith("event", "apply_error", {
      form_name: "design_partners_apply",
      error_kind: "server",
      http_status: 500,
    });
  });

  it("apply_error works without status (network)", () => {
    trackApplyError("network");
    expect(gtag).toHaveBeenCalledWith("event", "apply_error", {
      form_name: "design_partners_apply",
      error_kind: "network",
      http_status: undefined,
    });
  });

  it("apply_booked fires with form_name", () => {
    trackApplyBooked();
    expect(gtag).toHaveBeenCalledWith("event", "apply_booked", {
      form_name: "design_partners_apply",
    });
  });
});

describe("designPartnerTrack — gtag missing (prerender / consent denied)", () => {
  beforeEach(() => {
    delete (globalThis as { gtag?: Gtag }).gtag;
  });

  it("trackApplyFormView is a no-op without gtag", () => {
    expect(() => trackApplyFormView()).not.toThrow();
  });

  it("trackApplyStarted is a no-op without gtag", () => {
    expect(() => trackApplyStarted()).not.toThrow();
  });

  it("trackApplySubmitted is a no-op without gtag", () => {
    expect(() => trackApplySubmitted("ciso", "100-499")).not.toThrow();
  });

  it("trackApplyError is a no-op without gtag", () => {
    expect(() => trackApplyError("network")).not.toThrow();
  });

  it("trackApplyBooked is a no-op without gtag", () => {
    expect(() => trackApplyBooked()).not.toThrow();
  });
});

describe("designPartnerTrack — gtag throws (extension corruption)", () => {
  let throwingGtag: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    throwingGtag = vi.fn(() => {
      throw new Error("gtag corrupted by extension");
    });
    (globalThis as { gtag?: Gtag }).gtag = throwingGtag as unknown as Gtag;
  });

  afterEach(() => {
    delete (globalThis as { gtag?: Gtag }).gtag;
  });

  it("never bubbles errors into product code", () => {
    expect(() => trackApplyFormView()).not.toThrow();
    expect(() => trackApplySubmitted("ciso", "100-499")).not.toThrow();
    expect(() => trackApplyError("server", 502)).not.toThrow();
  });
});
