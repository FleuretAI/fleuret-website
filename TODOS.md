# TODOS

Deferred work captured during plan reviews. Do NOT let items here bit-rot.
When an item is picked up, move it to the corresponding PR.

---

## 1. Stand up vitest + React Testing Library

**What:** Install `vitest`, `@testing-library/react`, `@testing-library/jest-dom`,
`jsdom`. Add `vitest` + `test:ui` scripts to `package.json`. Wire a minimal
`vitest.config.ts`. Write smoke tests for `Hero.tsx`, `Demo.tsx`, and the cookie
consent state machine.

**Why:** Project has zero test coverage. Fleuret is a security vendor. Untested
code on the marketing site is survivable today, but the same pattern on the
product codebase would be a liability. Start the habit here where risk is lowest.

**Pros:**
- Catches the class of regression we just flagged in /plan-eng-review for the
  /demo page CTA swap (a renamed import in one of 7 call sites would go
  unnoticed until a customer hits a dead CTA).
- Unblocks proper /plan-eng-review test sections on future PRs.
- Cheap starter: one hour to stand up + one smoke test per critical component.

**Cons:**
- ~30 dev deps added (jsdom, vitest, testing-library, @types/*).
- Small bundle-side impact (dev-only, but eslint config needs extension).
- Ongoing maintenance cost. If nobody runs tests, they rot.

**Context:** Flagged in `~/.gstack/projects/FleuretAI-fleuret-website/checkpoints/20260419-031503-mobile-polish-rgpd-ship.md`
("Zero test coverage, flagged in /retro. Fleuret is security vendor. Start:
`bun add -d vitest @testing-library/react`, first test on Hero.tsx + cookie
consent state machine."). Reconfirmed in /plan-eng-review for /demo page: no
automated regression coverage for the 7-callsite CTA swap.

**Depends on / blocked by:** Nothing. Can ship any time.

---

## 2. v2 of /demo page: lead-capture form above scheduler

**What:** Add short 3-field form above the Google scheduler iframe on `/demo`:
name, work email, company. Submit writes to a new Supabase `demo_leads` table
with RLS policy (anon insert only, service-role read). Optional: edge function
emails Augustin on each new row.

**Why:** v1 (current plan) sends anyone who does not click a slot into the void.
If real drop-off is high, capturing the name+email before booking converts
abandoners into follow-up leads.

**Pros:**
- Recovers demand that the pure-scheduler page misses.
- Structured lead data for CRM (HubSpot / Attio / Notion).
- Still compatible with the scheduler-below-form pattern.

**Cons:**
- Adds a second CTA above the scheduler, splitting intent.
- Friction on the current happy path (people who just want to book a time).
- Requires Supabase table + RLS policy + edge function (or email provider
  integration). ~1 day of real work, not ~1 hour.

**Context:** Considered and explicitly deferred in /office-hours design doc
at `~/.gstack/projects/FleuretAI-fleuret-website/yanis-main-design-20260419-070714.md`
as "Approach C: Hybrid." User chose "Approach A: branded page + scheduler
embed, no form" for v1. This TODO captures the v2 extension.

**Depends on / blocked by:**
- ~~v1 /demo page shipped to prod.~~ ✅ shipped 2026-04-19 (PR #12). Hot-fix CSP `frame-src https://calendar.google.com` followed in PR #13.
- 2+ weeks of real traffic on /demo so drop-off is measurable.
- Decision on lead sink (Supabase table vs. HubSpot form vs. Attio API).
- reCAPTCHA site key provisioned if form is public.

---

## 3. GTM container pre-merge audit (ship gate for GA4 plan)

**What:** Before merging the full-GA4 plan (`docs/superpowers/specs/2026-04-19-google-analytics-full-design.md`), log in to tagmanager.google.com, open container `GTM-W5JB9N2K`, verify zero GA4 tags exist. If any GA4 tag is present, pause and delete it (gtag.js in `index.html` owns GA4, GTM must not duplicate).

**Why:** Dual-pipe architecture (gtag.js + GTM) only works if they are not both firing GA4. If GTM container has a GA4 tag on "All Pages" trigger, every page_view fires twice and GA4 funnel data is silently corrupted from day one.

**Pros:**
- Prevents silent double-counting that would be impossible to detect from inside the repo.
- Locks in the "GTM reserved for future marketing tags only" premise the plan depends on.

**Cons:**
- Requires human action outside the repo (GTM admin access).
- If audit fails (GA4 tag exists), the plan needs to be reconsidered before merge.

**Context:** Flagged in Codex-adversarial review of `/plan-eng-review` on 2026-04-19 (finding #2). Plan explicitly treats this as an out-of-repo premise: see `docs/superpowers/specs/2026-04-19-google-analytics-full-design.md` "Premises" section.

**Depends on / blocked by:** GTM container admin access.

---

## 4. GTM workspace policy: no advertising tags (keeps 2-button banner legal)

**What:** Inside GTM container `GTM-W5JB9N2K`, add a workspace note / container description: "Policy: do NOT add advertising tags (LinkedIn Insight, Meta Pixel, Google Ads remarketing, TikTok Pixel) without first implementing consent category toggles in src/components/CookieBanner.tsx. Current banner is 2-button (Accept all / Refuse all). Adding ad tags without finer consent = CNIL violation."

**Why:** The 2-button banner only consents to `analytics_storage` per CNIL specificity rule. If someone adds a LinkedIn Insight tag to GTM later, the banner copy no longer covers the processing purpose = GDPR Art. 7(2) specificity violation + CNIL fine exposure.

**Pros:**
- Makes the legal constraint visible to the next person touching GTM.
- Forces a consent UI redesign (3-button or category toggles) before any ad tag ships.

**Cons:**
- GTM notes can be ignored. Not a hard gate.
- Could block a fast marketing experiment that would have been legal under a different legal basis.

**Context:** Flagged in Codex-adversarial review of `/plan-eng-review` on 2026-04-19 (finding #4 - CNIL compliance). Plan grants `analytics_storage` only; `ad_storage` explicitly not granted.

**Depends on / blocked by:** Nothing. Can add note any time.

---

## 5. Pre-merge CSP audit when adding any new `<iframe>` or third-party widget

**What:** Before merging any PR that introduces an `<iframe>`, embedded third-party
script, or `connect-src` target, grep `vercel.json` for the relevant CSP directive
(`frame-src`, `script-src`, `connect-src`, `img-src`, `font-src`, `style-src`) and
confirm the new origin is in the allowlist. If missing, add it in the same PR.

**Why:** /demo (PR #12) shipped without `https://calendar.google.com` in `frame-src`.
Result: production CSP blocked the Google scheduler iframe. Visitors saw an empty
white card with only the fallback link. Caught immediately by `/land-and-deploy`
canary, hot-fixed in PR #13. Cost: ~5 minutes of broken /demo on prod + extra PR.
Generalizes: any future widget (Calendly, Stripe Checkout, Intercom, Hotjar,
LinkedIn Insight, etc.) will silently break the same way.

**Pros:**
- Two-line check, prevents whole class of post-deploy CSP regressions.
- Forces reviewers to think about which third-party origins the site trusts.
- `/review` and `/ship` should grow this check; until then it is a manual gate.

**Cons:**
- Easy to forget. Needs to be wired into `/review` checklist or a Vercel build
  hook to be reliable.

**Context:** Observed 2026-04-19 on PR #12 → PR #13. CSP from `vercel.json:12`.
Console error verbatim: `Framing 'https://calendar.google.com/' violates the
following Content Security Policy directive: "frame-src https://www.googletagmanager.com".`

**Depends on / blocked by:** Nothing. Could be automated via a `bun run` script
that diff-greps `<iframe src=` and `fetch('https://...')` against `vercel.json`
on every PR.
