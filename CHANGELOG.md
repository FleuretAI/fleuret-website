# Changelog

All notable changes to the Fleuret website. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed

- Homepage background: single page-length linear gradient (blue → violet → red) replaces per-section radial accents. Removed `.section-elevated` and `.grid-fade` CSS utilities. Section seams eliminated between Hero / Why / Platform / HowItWorks / Comparison / Pricing / CTA / Footer. ([#16](https://github.com/FleuretAI/fleuret-website/pull/16))

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
