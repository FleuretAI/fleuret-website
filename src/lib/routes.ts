/**
 * Single source of truth for demo-booking route + scheduler URLs.
 *
 * DEMO_ROUTE is the internal React Router path used by every "Book a demo"
 * CTA across the site. Changing the route value here updates every CTA.
 *
 * DEMO_SCHEDULER_EMBED_URL is the full Google Calendar appointment schedule
 * URL with the gv=true flag. This renders the bare scheduler widget
 * (no calendar.google.com chrome) and is safe to embed in an iframe
 * (verified: no X-Frame-Options header, no frame-ancestors CSP).
 *
 * DEMO_SCHEDULER_SHORT_URL is the short calendar.app.google link used as
 * the fallback when the iframe is blocked (adblockers, strict CSPs) or
 * when a user wants to book in a new tab.
 */
export const DEMO_ROUTE = "/demo";

export const DEMO_SCHEDULER_EMBED_URL =
  "https://calendar.google.com/calendar/appointments/schedules/AcZssZ1cAggFoBj4ZTGms-JRvzBbVcDM4xpgIDCmH-MkB1C_WB4fCiXKx0q9DRwZRqwM0DE4Fxu61_ko?gv=true";

export const DEMO_SCHEDULER_SHORT_URL =
  "https://calendar.app.google/zQvJoUiDncYQC9d1A";
