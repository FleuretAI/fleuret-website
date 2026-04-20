/**
 * GA4 funnel events for the /design-partners apply flow.
 *
 * Funnel:
 *   apply_form_view      → user reaches /design-partners (page-level)
 *   apply_started        → first interaction with the form (focus/input)
 *   apply_submitted      → POST /api/apply succeeded (any verdict)
 *   apply_qualified      → server returned `qualified: true` (booking shown)
 *   apply_unqualified    → server returned `qualified: false` (waitlist)
 *   apply_error          → POST failed or server rejected payload
 *   apply_booked         → user clicked the inline Calendly URL
 *
 * All events are no-ops when `window.gtag` is unavailable (SSR / prerender /
 * consent denied / ad-blocker). See `gtag.ts` for the underlying guard.
 *
 * Caller is responsible for fire-once semantics (e.g. `apply_started` must
 * only fire on the first focus, not every keystroke). `useRef` in the form
 * component handles that — keeping the dedup guard out of this module keeps
 * the events trivially testable.
 */

import { trackEvent } from "./gtag";

const FORM_NAME = "design_partners_apply";

export type ApplyVerdict = "qualified" | "unqualified";
export type ApplyErrorKind = "validation" | "server" | "network";

export function trackApplyFormView(): void {
  trackEvent("apply_form_view", { form_name: FORM_NAME });
}

export function trackApplyStarted(): void {
  trackEvent("apply_started", { form_name: FORM_NAME });
}

export function trackApplySubmitted(role: string, companySize: string): void {
  trackEvent("apply_submitted", {
    form_name: FORM_NAME,
    role,
    company_size: companySize,
  });
}

export function trackApplyQualified(role: string, companySize: string): void {
  trackEvent("apply_qualified", {
    form_name: FORM_NAME,
    role,
    company_size: companySize,
  });
}

export function trackApplyUnqualified(
  role: string,
  companySize: string,
): void {
  trackEvent("apply_unqualified", {
    form_name: FORM_NAME,
    role,
    company_size: companySize,
  });
}

export function trackApplyError(kind: ApplyErrorKind, status?: number): void {
  trackEvent("apply_error", {
    form_name: FORM_NAME,
    error_kind: kind,
    http_status: status,
  });
}

export function trackApplyBooked(): void {
  trackEvent("apply_booked", { form_name: FORM_NAME });
}
