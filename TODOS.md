# TODOS

Deferred work captured during plan reviews. Do NOT let items here bit-rot.
When an item is picked up, move it to the corresponding PR.

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

---

## 6. Split `LanguageContext.tsx` translations into per-locale JSON

**What:** Extract the `translations` object from `src/contexts/LanguageContext.tsx`
(~700 lines) into `src/locales/fr.json` and `src/locales/en.json`. Load at
build time via `import fr from '@/locales/fr.json'` + `import en from ...`.
Keep the `t()` signature identical.

**Why:** Translations are content, not code. Non-dev translators (eventually
Fleuret marketing or a contracted translator) should edit JSON, not TS. Current
file is already the heaviest context in the codebase and the blog PR adds ~10
more keys. Hitting this split before it reaches 1000 lines is cheaper.

**Pros:**
- Decouples content churn from code churn. PR-sized diffs for copy tweaks.
- Enables future tooling (lint keys, missing-key detection, automated
  translation via gpt-4 / deepl).
- Makes per-locale key coverage visible (today, missing FR key = silent
  fallback to key string).

**Cons:**
- Static JSON import inflates all locales into every bundle. At ~700 lines per
  locale, tree-shake won't help. Would want per-locale dynamic import to cut
  the FR locale from EN users' bundle.
- Migration is cosmetic but needs careful diff review (key ordering, escaped
  quotes, JSX vs string).
- `tsc` won't type-check key usage unless JSON is typed via `typescript` satisfies
  pattern or codegen.

**Context:** Flagged in `/plan-eng-review` for the /resources + blog PR
(2026-04-20). The blog PR adds translation keys inline per the existing
pattern, compounding the smell. Reasonable to ship this as a standalone
refactor PR before the NEXT feature that adds >5 translation keys.

**Depends on / blocked by:** Nothing. Pure refactor.

---

## 7. Per-post OG image generator (`@vercel/og` or Satori)

**What:** Generate dynamic per-post Open Graph preview images at build time.
Input = post frontmatter (title, author, date, optional accent color). Output =
`dist/og/<slug>-<locale>.png` 1200×630. Referenced via `ogImage` field auto-set
by codegen if author didn't override.

**Why:** At MVP, every post shares `DEFAULT_OG_IMAGE`. On LinkedIn / X, 3 posts
in a feed with identical thumbnails looks like content-farm SEO spam. Once
post cadence reaches ~3-5 posts, differentiated social cards become a
visible brand investment.

**Pros:**
- Significantly better social share click-through (industry: 2-3x vs generic OG).
- Zero authoring burden (auto-generated from frontmatter).
- Build-time only, no runtime cost.

**Cons:**
- Adds `@vercel/og` or `satori` + `resvg` (WASM) to build deps (~5MB install).
- Font licensing: needs a web-safe font embedded (or self-hosted via existing
  site fonts).
- Design work: one template to nail the Fleuret brand (typography, accent bar,
  logo lock-up).

**Context:** Deferred in `/office-hours` + `/plan-eng-review` for the blog MVP
PR (2026-04-20). Revisit when post count >= 3 OR when a post is specifically
earmarked for paid social distribution.

**Depends on / blocked by:** Blog MVP ships first (this TODO's input is the
frontmatter schema established there). Design direction for the OG template
(could be brainstormed via `/design-shotgun`).

---

## 3. GSC export for GEO program keyword backlog

**What:** Export Google Search Console data for fleuret.ai for the last 90 days (top 200 queries + impressions + clicks + position) and drop the CSV at `~/.gstack/projects/fleuret/geo-2026-04-28/baseline/gsc-export-{date}.csv`. Then update `02-keywords-backlog.csv` Volume + Difficulty columns from "Estimated" to real GSC numbers for the 16 retrofit articles.

**Why:** The GEO keyword backlog landed today with estimated volumes. Real GSC data turns guesswork into prioritisation. Without it, retrofit order is wrong and we waste effort on low-impact articles.

**Pros:**
- Unlocks evidence-based retrofit priority for the 16 existing articles.
- Catches keywords already ranking we can defend instead of new ones we have to fight for.
- 5-minute Yanis task, blocks W2 retrofit ship.

**Cons:**
- Yanis-only credentials (GSC login). No way to delegate.
- Stale within ~30 days, will need a re-pull mid-sprint.

**Context:** Surfaced by /plan-eng-review on 2026-04-29 reviewing the GEO program at `~/.gstack/projects/fleuret/geo-2026-04-28/`. Owner: Yanis. P0. Blocks the W2 ship of the cluster-batched retrofit PRs.

**Depends on:** Nothing. 5 minutes solo work.

---

## 4. Refine.ai free-audit signup for multi-LLM citation tracker

**What:** Sign up for Refine.ai free audit (refine.ai). Run all 50 prompts from `~/.gstack/projects/fleuret/geo-2026-04-28/05-prompt-universe.csv` across ChatGPT + Claude + Gemini + Perplexity. Save baseline screenshots to `~/.gstack/projects/fleuret/geo-2026-04-28/baseline/2026-04-29/`. Update the 50 rows of `05-prompt-universe.csv` with `Brand Cited`, `Top Competitor Cited`, `Top Source Cited` columns.

**Why:** Pre-GEO baseline is the only way to claim "we got cited in ChatGPT" later. Without it, every citation claim is unverifiable and the GEO program ROI is un-measurable.

**Pros:**
- Mandatory prerequisite from the design doc assignment.
- Refine free tier covers the 50-prompt × 4-LLM weekly load.
- Reciprocal goodwill move with Robin (Refine's founder) — see citation tracker Tier 4 entry for case-study collab.

**Cons:**
- 10-minute Yanis signup + ~30 minute baseline run = 40 min of his day.
- Refine is a pre-Series-A friend's startup; pricing or availability could shift later. Acceptable for free tier; revisit if upgrading.

**Context:** Surfaced by /plan-eng-review on 2026-04-29. Decision 1D in `~/.gstack/projects/fleuret/geo-2026-04-28/00-README.md` chose this over paid Refine and over an in-house scraper. Owner: Yanis. P0. Blocks W1 baseline ship.

**Depends on:** Nothing. Solo work.

---

## Completed

### 1. Stand up vitest + React Testing Library

**Completed:** 2026-04-20 (shipped with /resources + blog MVP)

vitest + @testing-library/react + jsdom + @testing-library/jest-dom wired via `vitest.config.ts`. Setup file at `tests/setup.ts`. Scripts `test` + `test:watch` in package.json. 16 blog-related tests + 21 design-partner tests = 37 green. First real tests cover `post-schema` (Zod validation), `SEO.tsx` (pageKey regression + meta override paths), `BlogIndex` (locale routing + empty state), and codegen manifest shape.
