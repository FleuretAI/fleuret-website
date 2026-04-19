# CLAUDE.md — Fleuret website project context

Context for any AI agent working on this repo. Read this before suggesting product
copy, visual design, or changes to offers on the site.

## Product

Fleuret is an **AI-driven offensive security platform**, not a generic workflow or
productivity tool. The wedge is agentic pentest: Fleuret combines human offensive
expertise with AI agents to deliver human-grade pentests in hours rather than the
2–4 weeks a traditional pentest firm takes. Every finding ships with a reproducible
PoC, zero false positives tolerated.

Public homepage messaging (source of truth, kept in `src/contexts/LanguageContext.tsx`):

- Hero: "Sécurité offensive incisive. Scalabilité infinie." / "Incisive offensive
  security. Infinite scalability."
- Value prop: "Fleuret combine IA agentique et expertise offensive pour délivrer
  des pentests de niveau humain en heures, pas en semaines."
- Standard pricing anchor: **€2,500 per pentest** (list). Traditional pentests
  usually cost €10k+.
- Scopes covered today: webapp, REST / GraphQL API, external infrastructure.
  Cloud / Active Directory / mobile scanners are on the roadmap and design
  partners access them in alpha.

## Ideal Customer Profile (ICP)

Use this profile when writing copy, validating assumptions, or designing flows.
Do not reframe the product as generic ops automation.

- **Geography:** Europe. EU + UK + Switzerland. France-first.
- **Company size:** 50 to 1,000 employees. Mature enough to have a security budget,
  small enough to iterate fast with a vendor.
- **Buyer persona:** CISO / RSSI, Head of Security, CTO, CFO (budget), or DPO for
  compliance-heavy deals. CEO signs on smaller teams. Not DevOps leads, not
  engineers without budget authority.
- **Compliance posture:** NIS2 and / or DORA in progress, or an imminent obligation.
  Their audit-ready report is a forcing function for adoption.
- **Industry:** SaaS, fintech, healthtech, any business with a significant web /
  API attack surface. Not consumer-only or pure-offline businesses.
- **Buying trigger:** new funding round, auditor deadline, post-incident, new CTO
  or CISO arriving, first SOC 2 / ISO 27001 prep. Every pitch should be able to
  name one of these.

Buyer cares about: audit-trail, NIS2 / DORA mapping in the deliverable, zero
false positives, response time, EU data residency (company hosts data in `fra1`
region, serverless functions pinned to Europe).

## Design Partner program

Single source of truth lives in `src/lib/designPartnerConfig.ts`. Never hardcode
price, slot count, cohort date, or pilot duration in a component — import from
that module so a single edit propagates to copy, countdown, form, and schema.

Current cohort (April 2026):

- **Offer:** €4,900 flat, 5 slots, 3 AI pentests (webapp + API + external infra)
  in 6 weeks, NIS2 / DORA-ready PDF report.
- **Cohort kickoff:** 2026-06-01 00:00 Europe/Paris (hard deadline).
- **Apply flow:** `/design-partners` page → inline 5-field form at `#apply` →
  `POST /api/apply` → Supabase insert → qualified applicants get the Google
  Calendar booking URL inline, unqualified get a manual-review promise.
- **Slot counter:** `GET /api/slots` → `design_partner_slots_remaining(total)`
  RPC in Supabase, cached 300s fresh / 86400s stale-while-revalidate at the
  Vercel edge, `regions: ['fra1']`. Falls back to total remaining on any error.
- **Qualification rule** (`src/lib/designPartnerQualify.ts`): role in
  {CISO, Head of Security, CTO, CEO, DPO} AND company size ≥ 100 employees.
  DevOps leads and "Other" are filtered out.
- **GDPR:** consent checkbox required, legal basis = consent, retention 12
  months, consent version tracked per submission (currently `2026-04-20`).
- **Feature flag:** `VITE_COHORT_VISIBLE=false` hides the countdown and dated
  copy, switches the CTA to waitlist-only. Use if product readiness slips.
- **Design doc:** `~/.gstack/projects/FleuretAI-fleuret-website/yanisgrigy-claude-adoring-wilson-e4923f-design-20260420-000300.md`
  holds the full program rework plan, open questions, and reviewer findings.

## Stack

- React 18 + TypeScript + Vite 7.
- React Router 6 (SPA). Prerender via `scripts/prerender.mjs` using
  puppeteer-core + `@sparticuz/chromium`.
- Tailwind 3 + shadcn-style primitives under `src/components/ui/`.
- framer-motion for reveals / staggers.
- i18n inline in `src/contexts/LanguageContext.tsx` — FR + EN, paths are
  localised via `localize()` from that context.
- Supabase (client-side anon key for site, service-role key server-side in
  `api/_lib/supabase.ts`). EU project required for GDPR.
- Serverless functions in `api/` (Vercel Node runtime, pinned `fra1`).
- Vitest + @testing-library/react + jsdom for unit / schema / hook tests under
  `tests/`.
- CSP hardened via `vercel.json` — `form-action 'self'`, strict `connect-src`.
  Do not add a third-party form backend without updating CSP.

## Skill routing

When the user's request matches an available skill, ALWAYS invoke it using the
Skill tool as your FIRST action. Do not answer directly, do not use other tools
first. The skill has specialised workflows that produce better results than
ad-hoc answers.

Key routing rules:

- Product ideas, "is this worth building", brainstorming → `office-hours`
- Bugs, errors, "why is this broken", 500 errors → `investigate`
- Ship, deploy, push, create PR → `ship`
- QA, test the site, find bugs → `qa`
- Code review, check my diff → `review`
- Update docs after shipping → `document-release`
- Weekly retro → `retro`
- Design system, brand → `design-consultation`
- Visual audit, design polish → `design-review`
- Architecture review → `plan-eng-review`
- Save progress → `context-save` / Resume → `context-restore`
- Code quality, health check → `health`
