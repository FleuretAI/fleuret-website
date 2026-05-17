# Lighthouse perf audit — fleuret.ai (2026-05-17)

> W9 of the YC website playbook. Audit-only doc. **No code changes in this PR.** Fixes land in follow-up PRs per finding, after Yanis sign-off on priorities.

## TL;DR

Desktop is healthy. Mobile is in the red on every route audited. Performance score floor 35/100. **LCP is the headline number to fix: every mobile route except none currently misses the 2.5s Core Web Vitals target, and `/about` blows past 9.5s.**

The single biggest lever = unused JavaScript on the critical path. Most of it comes from GTM + gtag (analytics layer that shipped via PRs #105 / #106 / #108 / #117). The Vite client bundle has ~94 KB of unused JS too.

CLS is clean everywhere except `/compliance/dora/banking` (0.22 — real layout shift, P1).

## Method

- Tool: `bunx --bun lighthouse@latest` (v13.3.0)
- Throttling: `simulate` (Lighthouse's default Moto G Power / slow 4G profile for mobile, no throttle for desktop preset)
- Categories: performance + accessibility + best practices + SEO (homepage); performance only on the rest
- Source artifacts: `/tmp/lighthouse-2026-05-17/*.json` (not checked into repo — synthesize here, regenerate any time)
- 7 routes (mobile) + 1 desktop spot-check on the homepage:
  - `/`, `/about`, `/design-partners`, `/blog`, `/compliance`, `/compliance/dora/banking`

## Scores

### Mobile (Moto G Power / slow 4G simulation)

| Route | Perf | LCP | FCP | CLS | TBT | TTI |
|---|---|---|---|---|---|---|
| `/` (homepage) | **35** | **7.84s** | 4.07s | 0.000 | **1369ms** | 7.95s |
| `/about` | **45** | **9.50s** | 3.94s | 0.000 | 654ms | 9.50s |
| `/design-partners` | **46** | **7.37s** | 3.45s | 0.000 | 595ms | 7.47s |
| `/blog` | **46** | **4.13s** | 3.81s | 0.000 | **1739ms** | 7.46s |
| `/compliance` | **49** | **4.33s** | 3.91s | 0.000 | **1273ms** | 6.96s |
| `/compliance/dora/banking` | **53** | **6.43s** | 2.58s | **0.223** | 390ms | 7.00s |

**Core Web Vitals targets**: LCP ≤ 2.5s | FCP ≤ 1.8s | CLS < 0.1 | INP ≤ 200ms (proxied here by TBT ≤ 200ms)

Every mobile LCP misses target. Every mobile TBT misses target. CLS only flagged on the compliance pSEO page.

### Desktop (Lighthouse desktop preset, no throttle)

| Route | Perf | A11y | BP | SEO | LCP | FCP | CLS | TBT | TTI |
|---|---|---|---|---|---|---|---|---|---|
| `/` (homepage) | 61 | **100** | 96 | 92 | 1.62s ✓ | 0.93s ✓ | 0.0001 ✓ | 789ms | 2.29s |

Desktop = green on LCP / FCP / CLS. TBT still too high (200ms target). Accessibility = perfect 100. SEO 92 (good, room to improve via metadata tweaks).

## Findings (ranked by impact)

### P0 — Mobile JS payload is too heavy

**Where it hurts:** every mobile route. Main-thread work 4.6s. JS execution 2.2s. Render-blocking requests cost 1.76s alone.

**Top offenders (homepage mobile, unused bytes):**

| Resource | Total | Unused | Wasted |
|---|---|---|---|
| `gtag.js?id=G-GCT3NK4C34` (loaded twice — `&cx=c&gtm=4e65d0` variant + plain) | 161 KB + 161 KB | 113 KB + 69 KB | ~182 KB |
| `gtm.js?id=GTM-W5JB9N2K` (loaded twice, once via GTM bootstrap + once direct) | 114 KB × 2 | 88 KB + 72 KB | ~160 KB |
| `/assets/index-D5qluOM_.js` (Vite main bundle) | 212 KB | 94 KB | 94 KB |

Total mobile unused JS: **427 KB. Estimated LCP savings: ~1.99s.**

**Suggested fixes:**
1. **Dedupe gtag/GTM loads.** Either GTM bootstraps GA4 OR gtag.js loads directly — not both. Pick one path. PR #103 ("dual-pipe gtag + GTM") explicitly planned this as not-both, but the actual loaded state ships both. Audit `index.html` + `Analytics.tsx` for the duplicate include.
2. **Defer GTM until after LCP.** GTM is not needed on the critical path. Load with `defer` or via `requestIdleCallback`, not as a blocking script in `<head>`.
3. **Code-split the Vite main bundle.** 212 KB is heavier than the 16 routes warrant. Likely `framer-motion` + `react-router-hash-link` + the canvas animation library are bundled into the main chunk. Lazy-route the pages that already use `lazy()` in `App.tsx`, and verify the chunk graph in `vite-bundle-visualizer`.

### P0 — `/about` LCP is 9.5s

**Where it hurts:** /about (recruiting + investor surface).

LCP element not surfaced in this audit run (Lighthouse JSON didn't include the element snippet). Strong suspects:
- The two founder photos (`yanis.png`, `augustin.png`) imported in `src/pages/About.tsx`. PNG without explicit `<img width height>` + no `loading="eager"` on the LCP image + no `fetchpriority="high"`.
- Investor logos (`hornetsecurity.png`, `almond.svg`, etc.) loaded eagerly above the fold.

**Suggested fixes:**
1. Convert founder photos to AVIF/WebP + `<img>` with explicit `width` / `height` attributes (also fixes CLS guard).
2. Add `fetchpriority="high"` to the LCP image, `loading="lazy"` to everything else below the fold.
3. Inline the investor SVGs (small, parse-once) and lazy-load the PNG investor logos.

### P0 — Render-blocking requests in `<head>`

**Savings: 1.76s.**

Likely culprits: GTM script tag in `<head>` (synchronous), font CSS from cdnfonts (the CSP whitelists `*.cdnfonts.com`), Vite-injected critical CSS.

**Suggested fixes:**
1. Move GTM to `<head>` end with `async` (or defer to body close, see P0 #1).
2. Switch font CSS to `<link rel="preload" as="style" onload="...">` swap pattern.

### P1 — CLS 0.22 on `/compliance/dora/banking`

Other routes = CLS ≈ 0. The pSEO matrix template is the outlier.

**Suspect:** the breadcrumb / hero block on `CompliancePage.tsx` likely renders before the `framework` + `industry` data load, then re-renders with the correct title height = visible shift.

**Suggested fix:** reserve minimum-height on the breadcrumb + hero containers via CSS, OR move the framework/industry lookup to prerender time (the manifest is built at build time, so SSR can already know the values).

### P1 — Font display strategy

**Savings: 150ms.**

Lighthouse flags missing `font-display: swap`. Custom fonts from `*.cdnfonts.com` block text rendering until they download.

**Suggested fix:** Add `&display=swap` to the font URL (or local @font-face declaration). System fonts will paint immediately, custom font swaps in once ready.

### P1 — Main-thread / TBT

**TBT 1.7s on `/blog`, 1.4s on homepage, 1.3s on `/compliance`.** Target ≤ 200ms.

Driven by the same heavy JS path P0 #1 calls out. Closing P0 should drop TBT by 50-70%. Remaining tail likely = canvas animation cost in `mountHeroCanvas` + framer-motion mount cost.

**Suggested fix:** profile the canvas mount in Chrome DevTools Performance. If it loops every frame, throttle to 30fps or skip on mobile. The hero canvas may be cosmetic enough to skip below a width breakpoint.

### P2 — Unused CSS

**Savings: 14 KB.** Tailwind's purge usually handles this. Suspect: third-party CSS (cdnfonts) shipping more than needed.

### P2 — Missing image dimensions

Several `<img>` without explicit `width` / `height`. Doesn't bite us today because CLS = 0 on most routes, but a single image regression could surface it.

### P2 — Accessibility tweak

Homepage mobile a11y score 96/100 (desktop 100). One audit fails: `[aria-hidden="true"]` elements contain focusable descendants. Likely the Lottie / canvas decoratives in the hero. Add `tabindex="-1"` on any focusable child of an `aria-hidden` parent.

## Recommended fix order

| # | Finding | Effort (CC) | Expected delta |
|---|---|---|---|
| 1 | Dedupe gtag/GTM, defer GTM past LCP | ~30 min | LCP -1.5 to -2s mobile, TBT -500ms |
| 2 | `/about` images → AVIF + dimensions + fetchpriority | ~20 min | LCP -3 to -5s on /about |
| 3 | Font `display=swap` | ~10 min | LCP -150ms everywhere |
| 4 | Fix compliance pSEO CLS via min-height | ~15 min | CLS 0.22 → < 0.05 |
| 5 | Code-split Vite main bundle | ~45 min | LCP -500 to -1000ms |
| 6 | Skip hero canvas on mobile width <768px | ~15 min | TBT -200 to -400ms mobile |

P0 = items 1-3. P1 = items 4-6.

## Not in scope

- Lighthouse CI in the build pipeline. Adding a perf gate to `/ship` is a separate task — propose only after the P0 items land so the gate doesn't immediately red on every PR.
- A/B testing different LCP elements.
- Image-CDN migration (Vercel built-in handles next-gen formats already).

## Re-run

```sh
mkdir -p /tmp/lighthouse-$(date +%F)
cd /tmp/lighthouse-$(date +%F)
for path in / /about /design-partners /blog /compliance /compliance/dora/banking; do
  slug=$(echo "$path" | tr '/' '-' | sed 's/^-//;s/^$/homepage/')
  bunx --bun lighthouse "https://fleuret.ai${path}" --quiet \
    --chrome-flags="--headless=new --no-sandbox" --form-factor=mobile \
    --throttling-method=simulate --only-categories=performance \
    --output=json --output-path="./${slug}-mobile.json"
done
bunx --bun lighthouse "https://fleuret.ai/" --quiet --preset=desktop \
  --chrome-flags="--headless=new --no-sandbox" \
  --only-categories=performance,accessibility,best-practices,seo \
  --output=json --output-path="./homepage-desktop.json"
```

Drop new scores into the table above. If LCP delta > 30% on any route, raise the diff in `/retro`.
