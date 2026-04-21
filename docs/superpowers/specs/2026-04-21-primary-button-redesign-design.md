# Primary button redesign (A3)

## Problem

Every primary CTA on the fleuret-website uses the same blue→violet gradient pill with a glow-on-hover. The pattern reads as generative-AI boilerplate and undermines the offensive-security positioning. A reviewer flagged the buttons as "AI slop."

Audit of the current pattern (inline styles duplicated across 11+ files):

```css
borderRadius: 999px;
background: linear-gradient(135deg, #4f8fff, #8b5cf6);
boxShadow: 0 0 20-30px rgba(79,143,255,0.3) on hover;
```

Tells that make it read AI-generated: soft saturated rainbow fade, 999px pill, glow halo on hover, scale-on-hover in the unused `hero` Button variant.

## Direction

Editorial + brand-anchored. Keep a red→blue fade to wink at the red-team / blue-team duality (offensive + defensive security), but strip every AI-slop signature:

- Muted, desaturated tones (no neon blue, no violet).
- 6px radius (not 999px pill).
- No glow on hover.
- No scale-up on hover.
- Brightness bump on hover only.
- Press state: 1px translate.

## Token / visual spec

```css
.btn-cta {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  border-radius: 6px;
  font-size: 0.9375rem;
  font-weight: 500;
  color: #fff;
  background: linear-gradient(135deg, #7a1f24 0%, #1c2d4a 100%);
  transition: filter 0.15s ease, transform 0.15s ease;
}
.btn-cta:hover  { filter: brightness(1.12); }
.btn-cta:active { transform: translateY(1px); }
.btn-cta:focus-visible {
  outline: 2px solid #4f8fff;
  outline-offset: 2px;
}
.btn-cta--lg { padding: 1rem 2.5rem;   font-size: 1rem; }
.btn-cta--sm { padding: 0.625rem 1.25rem; font-size: 0.875rem; }
```

Added CSS lives in `src/index.css` under the existing `@layer components` block (or a new one if absent). Single source of truth. No Tailwind arbitrary values at call sites.

## Scope — files to migrate

Replace the duplicated inline `style={{ ... linear-gradient(135deg, var(--accent-blue), var(--accent-violet)) ... }}` blocks with `className="btn-cta"` (plus `btn-cta--lg` / `btn-cta--sm` when a larger / smaller size is wanted):

- `src/components/Hero.tsx` — primary hero CTA (large).
- `src/components/CTASection.tsx` — footer CTA (large).
- `src/components/Navbar.tsx` — desktop CTA + mobile CTA (default / small).
- `src/components/PricingSection.tsx` — in-card CTA (default).
- `src/pages/DesignPartners.tsx` — 3 inline-styled CTAs.
- `src/pages/Careers.tsx` — single inline-styled CTA.
- `src/pages/About.tsx` — single inline-styled CTA.
- `src/pages/BlogPost.tsx` — single inline-styled CTA.
- `src/components/designPartners/ApplyForm.tsx` — submit button + success-state CTA.
- `src/components/CookieBanner.tsx` — accept button.

`onMouseEnter` / `onMouseLeave` box-shadow handlers are removed — CSS hover owns the state.

## Out of scope (explicitly keeping)

- `ComparisonTable.tsx` — pill badge, not a button. Not changed.
- `AnnouncementBanner.tsx` — background gradient tint, not a button.
- Hero headline gradient text (signature brand element).
- `.gradient-border` utilities in `src/index.css` and the gradient ring around the pricing card (headline accent, not a button).

## Cleanup

`src/components/ui/button.tsx` — remove the unused `hero` variant (gradient + `hover:scale-105` + glow — AI-slop pattern, zero call sites).

## Verification

- `tsc --noEmit` clean.
- Manual browser pass: Hero, Navbar desktop + mobile, `/design-partners`, `/about`, `/careers`, apply form, cookie banner.
- Focus ring visible via keyboard tab.
- No new console warnings.
