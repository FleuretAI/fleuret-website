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

## 3. GTM container pre-merge audit (ship gate for GA4 plan) — RESOLVED 2026-05-18

**Status:** RESOLVED via removal. Playwright audit on prod 2026-05-17/18 confirmed the dual-pipe gtag.js + GTM premise does not hold:
1. Modern GTM containers auto-create a "Google tag" entity (separate menu from the Tags list) that injects its own `gtag/js?id=G-GCT3NK4C34&cx=c&gtm=...` even when Tags list is empty.
2. The Vite prerender step (`scripts/prerender.mjs`) captures the dynamically-injected `gtm.js` `<script>` element into the static HTML, and the inline boot then re-executes on hydration = a second `gtm.js` load.

Both bugs combine into a 2x GA4 event duplication that survived three container recreations (`GTM-W5JB9N2K` → `GTM-NQFK57KC` → `GTM-TLLF3LB2`). Fix: removed the GTM bootstrap (inline boot + noscript iframe) from `index.html` entirely 2026-05-18. gtag.js is now the sole GA4 dispatcher. GTM stays available in Fleuret AI account at `GTM-TLLF3LB2` for the day a real marketing tag is needed; re-introduce paired with the consent-banner upgrade required by TODOS#4.

**Original ask:** Before merging the full-GA4 plan (`docs/superpowers/specs/2026-04-19-google-analytics-full-design.md`), log in to tagmanager.google.com, open container `GTM-W5JB9N2K`, verify zero GA4 tags exist. If any GA4 tag is present, pause and delete it (gtag.js in `index.html` owns GA4, GTM must not duplicate).

**Why it mattered:** Every page_view, scroll_depth, pricing_viewed, and demo_scheduler_fallback_clicked event was hitting `/g/collect` twice with identical payload. Funnel rates inflated 2x, audience triggers double-fired, decision data corrupted from analytics launch (2026-05-16) through removal (2026-05-18).

**Lesson for next time:** Before re-introducing GTM, add a Playwright assertion in `tests/` that fails CI if `/g/collect` calls contain duplicate `cid` × `en` payloads on a single page load — turn this from a human audit into a hard gate.

**Context:** Flagged in Codex-adversarial review of `/plan-eng-review` on 2026-04-19 (finding #2). Resolved by removal 2026-05-18.

---

## 4. GTM re-introduction policy: paired with 3-button consent banner

**What:** GTM is not currently loaded on the site (removed 2026-05-18, see TODO #3). When the first real marketing tag is needed (LinkedIn Insight, Meta Pixel, Google Ads remarketing, TikTok Pixel, etc.), re-introduce the GTM bootstrap in `index.html` AS A SINGLE COMMIT that also:
1. Upgrades `src/components/CookieBanner.tsx` from 2-button (Accept all / Refuse all) to 3-button or category toggles (analytics / marketing / strictly necessary).
2. Updates the gtag consent grant in `src/lib/gtag.ts` to flip `ad_storage`, `ad_user_data`, `ad_personalization` from `denied` to `granted` when the marketing category is accepted.
3. Adds the Playwright CI assertion mentioned in TODO #3 (no duplicate `/g/collect` per event) before merging.
4. Inside GTM container `GTM-TLLF3LB2`, adds a workspace note: "Policy: do NOT add advertising tags without the corresponding consent category toggle. Adding ad tags without finer consent = CNIL violation."

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

## Website playbook audit (2026-05-16) — W2 through W9

Source: YC friend's 9-point website guide. Mapped against fleuret.ai. W1 (hero rewrite) shipped in this PR.

### W2: Page intent — one CTA per page
**What:** Each top page (Home, /pricing, /design-partners, /about, /resources, /blog) has exactly one directional next-step CTA. Kill "Learn more" / "Explore" generics.
**Audit:** read every route in `src/pages/`. List current CTAs + `trackCTAClick` labels. Map each to a single buyer next-step.
**Acceptance:** inventory + proposed rewrites at `docs/site/cta-audit-2026-05-16.md`. Implement only after Yanis review.
**Don't touch:** GA4 event names (sibling agent on `feat/ga4-debug-mode`).
**Effort:** ~2h audit + 1h implement.

### W3: Trust signals above the fold
**What:** Stoik logo (permission cleared 2026-04-27) visible above-fold on homepage. Stub remaining (Raja, Clustor, Ouwba, Yogosha) once NDAs land.
**Files:** `src/components/ClientsBand.tsx` (or grep `clients.title`). Assets in `public/clients/`.
**Acceptance:** Stoik logo renders above-fold desktop + mobile. No fake/placeholder logos LIVE.
**Capital gate:** none.
**Effort:** ~30 min.

### W4: Conversion basics — contextual CTAs
**What:** Every blog + landing has page-specific CTA. Blog → newsletter capture. /pricing → demo. Eliminate footer-only contact.
**Files:** `src/components/blog/`, `src/pages/Blog*.tsx`, MDX articles in `src/content/`. Build `<NewsletterCTA />` reusing design-partners apply form pattern.
**Acceptance:** new component renders on every blog post + resources page. Submits to existing Supabase via `api/_lib/supabase.ts`. GDPR consent checkbox per design-partners pattern. EU project only.
**Don't touch:** existing /design-partners form, GA4 event names.
**Effort:** ~3-4h.

### W5: SEO foundation (maintenance, no new work)
**State:** 22 FR+EN articles live (2026-04-27→29). Domain authority near zero, compounding clock started. Continue cadence via `fleuret-content-engine` skill.
**Owner:** Yanis direct.

### W6: GEO/AEO (already ahead)
**State:** refine-seo-geo Phase 2-9 shipped. AEO baseline 2026-05-15 + 6wk sprint design 2026-05-16. Cross-ref Yogosha co-citation work.
**Owner:** Yanis direct.

### W7: Analytics baseline ⚠ blocked
**State:** GA4 work active on `feat/ga4-debug-mode` (commits `8f19120`, `3ae5e0d`). Microsoft Clarity merged `75e492f`. **Do not parallel-agent on analytics until that branch lands.**
**Files (when unblocked):** `src/components/Analytics.tsx`, `index.html`, `src/lib/analytics.ts`.
**Acceptance:** GA4 DebugView shows hero CTA + scroll-depth events. Document funnel definitions in `docs/analytics/funnel-spec.md`.
**Effort:** ~2h once branch lands.

### W8: CMS bottleneck audit (defer until marketing hire)
**Triggers:** marketing hire signs OR weekly copy edits ≥ 3.
**Action this week:** none. Snapshot pain — count copy commits last 4 wks via `git log --since=2026-04-15 --oneline -- src/contexts/LanguageContext.tsx src/content/`.
**Capital gate:** post-€3.5M close.
**Effort:** 1h audit + decision doc. Migration itself ~1-2 wks if green-lit.

### W9: Site speed + mobile audit
**What:** Lighthouse run on prod fleuret.ai (desktop + mobile). Doc Core Web Vitals (LCP / CLS / INP / FCP). Fix if score < 90.
**Tool:** Lighthouse CI or local `bunx unlighthouse` against prod URL.
**Acceptance:** report at `docs/perf/lighthouse-2026-05-16.md` with scores + actionable findings. If LCP > 2.5s mobile, raise P1.
**Don't touch:** code until report reviewed.
**Effort:** ~30 min audit + variable fix.

### Shared rules (paste at top of every sibling-agent prompt)
- Project: Fleuret AI marketing site (this repo).
- Base: branch off origin/main, NOT `feat/*` branches.
- Active sibling branches: `feat/ga4-debug-mode` (analytics, do not touch `Analytics.tsx` + `index.html`).
- No em-dashes "— " in user-facing copy (lints + tests enforce).
- Site = EN-only since PR #98. Update FR strings in `LanguageContext.tsx` anyway for type-compat.
- Pricing source-of-truth = `src/lib/pricingConfig.ts`. Hero anchor = €2,500 vs €15,000+ (Standard tier vs market low).
- GDPR / EU residency required. Supabase EU project only.
- Capital discipline: any spend > €500 = ask Yanis. Free paths first.
- Narrow `git add <file>`, never `-A`.
- `/review` before commit. `/ship` only with Yanis green light.

---

## N. Related compliance pages cross-link block on every CompliancePage

**What:** Below article body (between final `<hr>` and the "Book a demo" CTA at `src/pages/CompliancePage.tsx:271`), render 3-5 sibling anchor links: every same-framework sibling (e.g. NIS2/water → NIS2/energy, NIS2/healthcare, NIS2/telecom, NIS2/transport) plus 1-2 cross-framework anchors most topically adjacent (e.g. DORA/fintech for the NIS2/healthcare reader). Pulled from existing `listCompliancePosts()` metadata, no new registry.

**Why:** Distributes PageRank through the pSEO long-tail without relying solely on the hub. Hub fix (2026-05-31 plan-eng-review) is the necessary condition; article-to-article edges are the sufficient condition for Google to treat the pSEO grid as a topical cluster, not isolated pages. Adds ~50 new internal edges across 15 pages, near-zero render cost.

**Pros:**
- 50 new internal edges, zero new data dependency.
- Independent SEO signal from the hub fix, useful if hub fix alone is not enough.
- Cheap render (one component, no fetch).

**Cons:**
- Adding now would have prevented clean attribution of hub-fix-only impact.
- Cross-framework selection logic needs a heuristic (e.g. shared industry tag, or hand-mapped table).

**Context:** Pulled out of 2026-05-31 plan-eng-review (Issue TODO 1) so the GSC indexing fix wave could ship as a clean experiment. Wait at least 7 days post-hub-fix-merge before picking this up — measure GSC index count delta first. If hub fix alone closes the 20-page gap, deprioritize. If gap stays > 5 pages, pick this up.

**Depends on:** Hub fix PR merged + 7 days of post-merge GSC measurement.

---

## N+1. Generic prerender invariant — every page in dist/ has >=1 internal anchor

**What:** Extend or generalize `scripts/assert-hub-links.mjs` to walk every `dist/**/index.html` and assert each contains at least one `<a href="/...">` to another internal route. Catches the broader class of "prerender wait fired too early and shipped a navbar-only shell" bugs, not just the two hubs we just fixed.

**Why:** The hub-render bug we just diagnosed (2026-05-31) was the second of its class on this codebase (first was the GTM dual-init silent regression caught by PR #135). Cheap generic invariant catches future cases before they deindex pages.

**Pros:**
- One script catches a regression class, not just two cases.
- Aligns with the loud-fail philosophy already encoded in `scripts/prerender.mjs:158`.
- Fast (~50-100ms across all dist pages).

**Cons:**
- Needs an allowlist for legit single-anchor pages (mentions-legales, terms, privacy may only link to nav/footer).
- Risk of noise-failing on prerender quirks, training the team to ignore the assertion.

**Context:** Pulled out of 2026-05-31 plan-eng-review (Issue TODO 2). Prove out per-hub `assert-hub-links.mjs` first; generalize once we know the threshold tuning.

**Depends on:** Hub fix PR shipped, per-hub assertion stable in production for >=2 weeks.

---

## Completed

### 1. Stand up vitest + React Testing Library

**Completed:** 2026-04-20 (shipped with /resources + blog MVP)

vitest + @testing-library/react + jsdom + @testing-library/jest-dom wired via `vitest.config.ts`. Setup file at `tests/setup.ts`. Scripts `test` + `test:watch` in package.json. 16 blog-related tests + 21 design-partner tests = 37 green. First real tests cover `post-schema` (Zod validation), `SEO.tsx` (pageKey regression + meta override paths), `BlogIndex` (locale routing + empty state), and codegen manifest shape.
