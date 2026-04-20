# Changelog

All notable changes to the Fleuret website. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- Branding hygiene: add production `public/og-image.png` (1200×630) so every route's social preview renders a real Fleuret card instead of 404. SVG source in `scripts/og-image.svg`. Remove stale `public/placeholder.svg` (Lovable default), drop `lovable-tagger` dev dependency + plugin, scrub the `lovableproject.com` reference in `.env.local.example`.

### Added

- `/design-partners` rework around a dated pilot-cohort offer: **€4,900 flat, 5 slots, 3 AI pentests in 6 weeks, NIS2 / DORA-ready report**. Cohort kickoff 2026-06-01 Europe/Paris. Page now leads with price + deliverable in the hero, a week-by-week timeline (scope, recon, webapp+API, infra, audit-ready report, review), a founder + audit-trail proof block, an inline 5-field application form, and a real countdown. Slot counter reads live from Supabase via a stale-while-revalidate serverless function pinned to `fra1`. Cohort visibility gated by `VITE_COHORT_VISIBLE` so the page can ship without dated copy if product readiness slips. Every text string lives in `designPartners.*` i18n keys (FR + EN).
- Serverless API: `api/slots.ts` (GET, returns remaining slot count, cached 300s fresh / 24h stale, falls back to total on error) and `api/apply.ts` (POST, zod-validates a 5-field payload, honeypot + IP hash + idempotent submission via UUID, writes to Supabase, returns Google Calendar URL only to qualified applicants).
- Supabase migration `20260420000000_design_partner_applications.sql`: new table with RLS enabled and no anon grants, `design_partner_status` enum, status index, `design_partner_slots_remaining(total)` SECURITY DEFINER function exposed to anon for the slot counter.
- Shared library for the program: `src/lib/designPartnerConfig.ts` (price, slots, cohort ISO), `designPartnerSchema.ts` (zod), `designPartnerQualify.ts` (role + size rule), `useCountdown.ts`, `useSlots.ts`, `captureUtm.ts`. Reused by the page, the form, and the `api/apply.ts` handler.
- vitest + @testing-library/react + jsdom as dev dependencies, a `test` script, a dedicated `tsconfig.api.json` for the serverless functions, and 21 unit tests covering schema validation, qualify branches, countdown math, and UTM capture.
- `CLAUDE.md` at the repo root documenting product, ICP, Design Partner program parameters, and stack for any AI agent working on this repo.

### Changed

- Landing page copy rewrite, ICP-targeted positioning against consulting firms and legacy scanners. Hero pivots from abstract "Incisive offensive security. Infinite scalability." to concrete, price-named "Your pentest starts in 10 minutes. Not 10 weeks." Problem section reframes as "You ship every day. Your pentest ships once a year." Platform section anchors the category claim: "Not a firm. Not a scanner. A platform." Comparison table headers now name the real deal-stage competitors ("Consulting firm" / "Legacy scanner" instead of "Manual pentest" / "Automated scanner") and the price anchor moves from €10,000+ to €25,000+ to match actual Wavestone / OCD / Synacktiv-level invoices. Pricing guarantee sharpens to "0 findings, 0 invoice." Footer tagline: "European AI pentest. Built in France. Sovereign by design." EN unifies on "audit-grade" terminology across hero, platform, process, comparison, and pricing; FR keeps "audit-ready" per standard FR security vocabulary. Bilingual parity maintained across EN and FR.
- English is now the default language for first-time visitors. Visiting `/` with no stored preference redirects to `/en`. Stored language preference persists across sessions via `localStorage` (`fleuret_lang`). French-only `/mentions-legales` is exempt from the redirect.
- Homepage background: single page-length linear gradient (blue → violet → red) replaces per-section radial accents. Removed `.section-elevated` and `.grid-fade` CSS utilities. Section seams eliminated between Hero / Why / Platform / HowItWorks / Comparison / Pricing / CTA / Footer. ([#16](https://github.com/FleuretAI/fleuret-website/pull/16))

### Fixed

- Language persistence across navigation: every internal link (Navbar, Footer, Cookie banner, Demo/Careers/About CTAs, legal back buttons) now stays on the current locale. Previously, clicking `/about` from `/en/about` silently dropped users back to French. Hardcoded `language === "fr"` ternaries replaced with `t()` keys so copy, ARIA labels, and section headings stay consistent per locale. Technical jargon (pentest, NIS2, DORA, SOC 2, Design Partners, audit-ready, PoC, ASM) remains in English inside French copy by design.

## 2026-04 — SEO + /demo launch

### Added

- `/demo` branded landing page replaces raw Google Calendar link. ([#12](https://github.com/FleuretAI/fleuret-website/pull/12))
- SEO full pass: per-route meta, prerender, hreflang, Edge 404 routing, sitemap includes `/demo`, canonical host enforced via Vercel dashboard. ([#11](https://github.com/FleuretAI/fleuret-website/pull/11), [#14](https://github.com/FleuretAI/fleuret-website/pull/14), [#15](https://github.com/FleuretAI/fleuret-website/pull/15))
- Footer "Ask AI for summary of Fleuret" row. ([#10](https://github.com/FleuretAI/fleuret-website/pull/10))
- Scroll to top on route change. ([#9](https://github.com/FleuretAI/fleuret-website/pull/9))
- `/design-partners` landing page, footer legal links. ([#7](https://github.com/FleuretAI/fleuret-website/pull/7))
- RGPD consent banner, hero mobile polish. ([#6](https://github.com/FleuretAI/fleuret-website/pull/6))

### Fixed

- CSP `frame-src` allows `calendar.google.com` so `/demo` embed renders. ([#13](https://github.com/FleuretAI/fleuret-website/pull/13))
- SPA fallback: unknown paths rewrite to `/` so React Router handles them. ([#8](https://github.com/FleuretAI/fleuret-website/pull/8))

## Earlier

- Security headers ported to `vercel.json` so they reach prod. ([#5](https://github.com/FleuretAI/fleuret-website/pull/5))
- Dropped cookie banner, GA4 runs in consent-denied mode by default. ([#4](https://github.com/FleuretAI/fleuret-website/pull/4))
- RGPD consent defaults set before GTM loads, nginx security headers. ([#2](https://github.com/FleuretAI/fleuret-website/pull/2))
- Dropped waitlist + 13 orphan components, hardened Supabase client. ([#3](https://github.com/FleuretAI/fleuret-website/pull/3))
- Mobile news badge layout fixes.
- Favicon switched to white logo variant (`#F2F2F8`).

[Unreleased]: https://github.com/FleuretAI/fleuret-website/compare/main...HEAD
