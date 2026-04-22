# Changelog

All notable changes to the Fleuret website. Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added

- **Hidden fundraise announcement page at `/news/fleuret-raises-3-5m`** (+ `/en` mirror). Bilingual FR/EN announcement of the €3.5M seed (€2.8M equity led by RAISE Capital with Auriga Cyber Ventures, Wind Capital and United Founders, plus a €700k Bpifrance innovation loan). Page renders Fleuret-native editorial: hero + byline (Yanis Grigy, Augustin Ponsin, Pierre-Gabriel Berlureau), use-of-funds breakdown (product / team / distribution), investor + angel grids sourced from the public About page roster, NIS2/DORA commitment section, founding-team photos, closing CTA to `/demo`. The page is intentionally unlinked: not in Navbar, Footer, AnnouncementBanner, sitemap, or prerender route list. SEO ships `<meta robots="noindex, nofollow">` via the existing SEO component override. URL resolves client-side only. Launch flip (documented in the design doc) toggles `noindex` off, adds the route to `scripts/prerender.mjs` and the sitemap generator, and points `ANNOUNCE_HREF` in `AnnouncementBanner.tsx` at the page when press embargo drops.

### Changed

- **Announcement banner is now env-gated.** Wrapped `<AnnouncementBanner />` mount in `src/App.tsx` behind `import.meta.env.VITE_ANNOUNCE_VISIBLE !== "false"` so the fundraise CTA can be hidden via Vercel env (`VITE_ANNOUNCE_VISIBLE=false`) without removing the component. Default remains visible. Documented in `.env.example` alongside the existing `VITE_COHORT_VISIBLE` flag.
- **Hero telemetry pill replaced with rolling log tail.** The `FLEURET SCANNING` / `FLEURET COMPLETE` pill at the bottom-right of the hero canvas read as generic SaaS loading state and put the brand name inside its own telemetry. Replaced with a 3-line monospace log stream cycling real-pentest-shaped findings (`[+] 443/tcp open`, `[!] idor /user/{id}`, etc.) while scanning, freezing to `[+] scan complete / [+] N findings recorded / [✓] report sealed` when the graph fills. Finding count is computed live from the HUD vuln counters so the sealed state never contradicts the numbers on the left. Severity coloring: neutral for `[+]`, red for `[!]`, violet for `[✓]`. Desktop gate (`W >= 640`) and intro-fade handling preserved. Reduced-motion path still jumps straight to sealed.
- **Primary buttons redesigned to kill the AI-slop signature.** Every primary CTA (Hero, Navbar, Pricing, CTASection, DesignPartners, Careers, About, BlogPost share, ApplyForm, CookieBanner) used the same inline `linear-gradient(135deg, #4f8fff, #8b5cf6)` 999px pill with a blue glow on hover. The pattern read as generative-AI boilerplate and undermined the offensive-security positioning. Replaced with a single `.btn-cta` class in `src/index.css`: desaturated red → blue diagonal fade (`#7a1f24` → `#1c2d4a`), 6px radius, brightness-only hover, press-state translate, no glow, no scale. Size modifiers `.btn-cta--lg`, `.btn-cta--sm`, `.btn-cta--block`. Red + blue ties to offensive / defensive (red-team / blue-team) positioning without neon. Decorative gradients kept: headline text, cohort badge pill, qualify bullet dots, comparison-table badge, pricing card outer glow ring. Unused `hero` variant removed from `button.tsx` (same AI-slop pattern: scale-105 + glow, zero call sites).
- `/design-partners` page now uses wider inner wrappers (hero, timeline, proof, qualify, FAQ, back-link) so the page occupies more of the container. Apply form kept at a narrower width for readability. Font sizes untouched. Tailwind container still caps at 1400px so nothing escapes the page gutter.
- **Page titles no longer crowd the navbar.** Standardized top padding on About, Careers, Resources, BlogIndex, BlogPost, Demo, MentionsLegales, PrivacyPolicy, TermsOfUse, SecurityPolicy to `pt-40 md:pt-48` (12rem on Demo's inline-style `<main>`), matching the DesignPartners reference. Previously `pt-32` (or `pt-24 md:pt-28` on About) left the hero headline sitting too close to the sticky navbar. No font-size or layout changes, just vertical breathing room.

### Fixed

- Pre-existing vitest failures on main: `scripts/build-post-registry.test.ts` referenced `dist/post-manifest.json` but the codegen writes `.post-manifest.json` at repo root. Updated the test path. Added a `pretest` npm hook so `build:posts` runs before vitest (guarantees the manifest exists when codegen smoke tests read it). Stubbed `IntersectionObserver` in `tests/setup.ts` so framer-motion's `whileInView` no longer throws under jsdom in `BlogIndex` tests.

### Added

- **`/design-partners` rich result + funnel telemetry.** Cohort page now emits a `Product` (with €4,900 `Offer`, `LimitedAvailability` flipping to `SoldOut` when slots hit zero, slot inventory + `priceValidUntil` pinned to kickoff) plus a companion `Event` (kickoff date + 6-week endDate + virtual location). Schema sources every value from `designPartnerConfig.ts`, so cohort changes propagate to Google rich results without redeploys, and the live counter at `/api/slots` controls availability without code changes. New GA4 funnel: `apply_form_view`, `apply_started`, `apply_submitted`, `apply_qualified`, `apply_unqualified`, `apply_error` (with HTTP status), `apply_booked`. Events include `role` + `company_size` on the qualified branches so conversion can be segmented by ICP fit. Built on a new shared `src/lib/gtag.ts` wrapper extracted from `Demo.tsx` that guards `window` + missing-gtag + thrown-gtag (extension corruption), so every event is a no-op under the prerender pipeline (puppeteer + `@sparticuz/chromium`) and when Consent Mode is denied. 28 new tests cover the JSON-LD schema, all 7 funnel events, and the prerender / consent-denied / extension-throws paths.

### Changed

- Announcement banner (fundraise) scaled up Nevis-style: 40px → 64px tall, headline bolded and enlarged to clamp(0.95rem, 1.6vw, 1.25rem) font-weight 700, uppercase "Annonce/Announcement" label dropped so the main line gets the space, dot pulse bumped 8px → 10px, gradient alpha 0.18 → 0.22 for slightly more presence. Navbar offset follows automatically via the `--announce-h` CSS var.
- Branding hygiene: add production `public/og-image.png` (1200×630) so every route's social preview renders a real Fleuret card instead of 404. SVG source in `scripts/og-image.svg`. Remove stale `public/placeholder.svg` (Lovable default), drop `lovable-tagger` dev dependency + plugin, scrub the `lovableproject.com` reference in `.env.local.example`.

### Added

- **`/resources` hub + MDX blog.** New routes `/resources`, `/en/resources` (content hub) and `/blog`, `/en/blog` (editorial index) plus `/blog/:slug`, `/en/blog/:slug` for individual posts. Blog index uses an editorial row layout (date, title, excerpt, reading time, hairline dividers), not a SaaS card grid. First post ships bilingual: "Pentest continu par IA agentique : pourquoi NIS2 change la donne" / "Continuous AI pentesting: why NIS2 changes the game". Resources link added to Navbar (desktop + mobile) and Footer. Brand accent for blog surfaces is the existing `--accent-red` token (`#ef4444`), used for links, breadcrumb separator, focus ring, and LinkedIn share button. Accessibility: `<article>` wrapping post body, `<nav aria-label="Breadcrumb">`, `<time dateTime>`, visible focus rings, 44px touch targets, visited-link color shift. Post images restricted to `public/blog/<slug>/*` so CSP `img-src 'self'` stays unchanged.
- **Static MDX blog pipeline.** Content lives in `src/content/blog/{fr,en}/<slug>.mdx`. Build-time codegen `scripts/build-post-registry.ts` validates frontmatter with Zod, enforces FR+EN pairing (strict mode throws, dev mode warns), rejects same-locale duplicate slugs, filters drafts (unless `BLOG_INCLUDE_DRAFTS=true`), computes reading time, normalizes `ogImage` to absolute URL, and emits `src/content/posts.generated.ts` (lazy MDX loaders for flat main-bundle cost) plus `.post-manifest.json` for downstream scripts. Vite plugins `@mdx-js/rollup`, `remark-gfm`, `rehype-slug` configured ahead of `react-swc` per plugin-order requirement. Tailwind typography plugin enabled for post prose (`prose prose-invert prose-red`).
- **Blog-aware prerender and sitemap.** `scripts/prerender.mjs` reads the post manifest and extends the Puppeteer wait condition to `article[data-post-slug][data-rendered="true"]` on blog routes, so lazy-loaded MDX bodies are captured in static HTML (not the Suspense skeleton). `scripts/build-sitemap.ts` generates `dist/sitemap.xml` from `ALL_PRERENDER_PATHS` + post manifest with hreflang alt links, `x-default` aligned to EN. Legacy `public/sitemap.xml` deleted. Article + BreadcrumbList JSON-LD emitted per post. `scripts/smoke.mjs` added for post-build puppeteer smoke coverage of the key blog flows.
- **Tombstone path for deleted posts.** `src/content/blog/tombstones.ts` lists retired slugs with optional replacement targets. Codegen patches `vercel.json` idempotently: replacement tombstones become 301 redirects, slugs without replacement are excluded from build output so Vercel serves the real 404 rather than a soft-404 308 to `/404`.
- **SEO dynamic meta override.** `src/seo/SEO.tsx` accepts an optional `meta` prop (title, description, canonical, hreflangs, ogImage) for dynamic pages; static `pageKey` path is unchanged. New `hreflangLinksFor()` helper in `src/seo/routes.ts` + `articleJsonLd()` helper for blog posts. New `RouteKey` entries `resources` and `blog` with FR + EN META.
- **Test infrastructure bootstrap.** vitest + @testing-library/react + @testing-library/jest-dom + jsdom + gray-matter wired via `vitest.config.ts`. `tests/setup.ts` for shared globals. Regression test added for `SEO.tsx` `pageKey` path (previously untested). New tests cover Zod schema validation, BlogIndex locale routing + empty state, and codegen manifest shape. Total test count: 37.
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
