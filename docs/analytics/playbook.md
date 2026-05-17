# Fleuret analytics playbook

Source of truth for what we measure on `fleuret.ai`, where to look, and how to turn the numbers into decisions. Read this top to bottom once; come back to specific sections as needed.

Last updated: 2026-05-18.

---

## 1. What is measured, in plain English

Three independent pipes ship into three different dashboards. Each pipe answers a different question.

| Pipe | Question it answers | Where the data lives | Retention |
|---|---|---|---|
| **GA4** | Where do visitors come from, what do they do, where do they drop off? | `analytics.google.com` property `fleuret.ai - GA4` (id `533868629`) | 14 months |
| **Microsoft Clarity** | What does a real session look like — clicks, scroll, rage, dead clicks, screen recording? | `clarity.microsoft.com` project `fleuret-website` (id `wrwrt0esfs`) | 12 months |
| **Google Search Console** | What queries surface fleuret.ai on Google, what's the click-through rate, which pages rank? | `search.google.com/search-console` property `fleuret.ai`, linked into GA4 | 16 months |

GA4 is the only one with custom events wired into `src/components/Analytics.tsx`. Clarity records sessions as-is; Search Console feeds back organic search performance.

GTM (Google Tag Manager) container `GTM-TLLF3LB2` exists under the Fleuret AI account but is **not currently loaded on the site** — it was removed in PR #135 (2026-05-18) because the dual-pipe setup was double-firing every GA4 event. When the first marketing tag is needed (LinkedIn Insight, Meta Pixel, Google Ads, etc.), re-introduce GTM together with the consent-banner upgrade described in `TODOS.md` #4.

---

## 2. The custom events we ship

These events fire in addition to GA4's default `page_view`, `scroll`, `click`, `file_download`, `video_*`. They are wired in `src/components/Analytics.tsx` and `src/lib/gtag.ts`.

| Event | When it fires | Params | What it tells us |
|---|---|---|---|
| `page_view` | Every route change in the React SPA (not just initial HTML load) | `page_path`, `page_location`, `page_title` | Real session-level navigation. Without this, only the landing page would count, every subsequent route invisible. |
| `scroll_depth` | When a visitor scrolls past 25 / 50 / 75 / 100 % of the page height. Fires once per route per milestone. | `percent` | Engagement proxy. Bounces leave at 25; engaged readers reach 75+. |
| `pricing_viewed` | When the pricing block on the homepage scrolls into view (IntersectionObserver threshold 0.3). Fires once per page load. | `section: homepage_pricing` | Pre-purchase intent signal. The funnel: page_view → pricing_viewed → demo CTA. |
| `outbound_click` | Any click on an anchor pointing to a different host. Fired via a single delegated listener on `document`. | `link_url`, `link_domain`, `link_text` | Where visitors go when they leave us (LinkedIn, Calendly, partner sites). |
| `demo_scheduler_fallback_clicked` | When a visitor on `/demo` clicks the plain-text email/scheduler fallback link below the embedded Google scheduler iframe. | `destination` | Signal that the iframe didn't satisfy the visitor. Currently rare; if it grows, /demo needs work. |
| `cta_click` | Reserved for any marketing CTA wired via `trackCTAClick({location, label, destination})`. Wire on demo/contact/pricing buttons as they grow. | `location`, `label`, `destination` | Click-through on individual CTAs; lets us A/B copy and placement. |

Consent: every event respects Consent Mode v2. Before "Accept All" → events ship as anonymized cookieless pings (no `cid`, no `_ga` cookie). After Accept All → full `analytics_storage: granted` mode kicks in, cookies drop, attribution becomes session-stable.

---

## 3. GA4 audiences (cohorts you can target)

Audiences are pre-built filters that turn one-shot events into addressable cohorts. Built in GA4 admin > Audiences.

| Audience | Inclusion logic | Why it matters |
|---|---|---|
| **High-intent dropouts** | Sessions that fired `pricing_viewed` but did not fire `demo_scheduler_fallback_clicked` and have no `outbound_click` to `calendar.google.com` | These are the visitors who got far enough to see pricing and walked. They are the highest-yield re-engagement cohort. |
| **Content readers** | Users with ≥ 3 `page_view` events on `/resources/*` blog routes in a 30-day window | Top-of-funnel earned-attention cohort. Newsletter / SEO content drives them. Target them with deeper content, not sales CTAs. |
| **Active funnel** | Sessions with both `pricing_viewed` AND `scroll_depth >= 75` | Hot leads. Worth a manual look in Clarity for friction points on the way to the demo CTA. |
| **Cold-email landings** | Sessions where the entrance URL contains `utm_source=cold` (per the UTM convention in `wiki/concepts/utm-convention.md` in the master vault) | Measures the cold-mail wedge (A=NIS2, B1=AI agent security, B2=Continuous pentest). Conversion of this cohort answers "are the wedges working." |

---

## 4. Where to look — three dashboards

### 4.1 The Looker Studio funnel dashboard (the daily one)

This is the dashboard you open every morning. It collapses GA4's exploration view into four panels you can read in 30 seconds.

**To create it** (10 minutes, do this once):

1. Open `lookerstudio.google.com` while signed in as `yanis@fleuret.ai`.
2. Click **+ Blank report**.
3. **Add data** → select **Google Analytics** → property **fleuret.ai - GA4** (id `533868629`) → click **Add**. Accept the data-source prompt.
4. The report opens with a default table. Delete it (select → delete).
5. Set the report time range default: **File → Report settings → Default date range → Last 28 days**.
6. Add a report-level filter: **Resource → Manage filters → Add a filter → exclude `Test data filter name = Internal traffic`**. (Once the GA4 internal-traffic filter from §6 is live, this hides founder/team visits.)
7. Build the four panels. Use **Add a chart** from the toolbar:

   | Panel | Position | Chart type | Dimension | Metric | Sort | Top N |
   |---|---|---|---|---|---|---|
   | **Source/medium ranked** | Top-left | Table | `Session source / medium` | `Sessions`, `Engagement rate` | `Sessions` desc | 10 |
   | **Sessions over time** | Top-right | Time series | `Date` | `Sessions` | — | — |
   | **Funnel scorecards** | Bottom-left | Three scorecards side-by-side | — | `Sessions`, then `Event count` filtered to `pricing_viewed`, then `Event count` filtered to `demo_scheduler_fallback_clicked` | — | — |
   | **Landing-page engagement** | Bottom-right | Table | `Landing page` | `Sessions`, `Engagement rate`, `Average session duration` | `Sessions` desc | 20 |

8. **File → Make a copy** → name it **Fleuret Funnel — Daily**. Move to a shared folder if you have one.
9. **Share → manage access → add `augustin@fleuret.ai` as Editor**, and any future team-vault collaborators as Viewer.
10. Bookmark the URL.

### 4.2 GA4 Explorations (the deep dive)

For ad-hoc questions Looker doesn't answer. Go to `analytics.google.com` → property `fleuret.ai - GA4` → **Explore**.

Three reusable explorations to save:

- **Funnel exploration: visitor → pricing → demo CTA → demo page → fallback link.** Add steps `page_view (any path)` → `pricing_viewed` → `outbound_click WHERE link_text = "Book a demo"` → `page_view WHERE page_path = /demo` → `demo_scheduler_fallback_clicked`. Conversion at each step shows where the funnel leaks.
- **Path exploration starting from any homepage hit.** Shows which routes visitors browse after the landing page. Surfaces unexpected navigation patterns (e.g., people clicking through to `/careers` from the homepage means careers is being browsed, not just linked from cold emails).
- **Free-form segmenting on `Cold-email landings`.** Filter by the audience, group by Landing page, show engagement rate. Tells you which wedge / which landing variant converts.

### 4.3 Microsoft Clarity (the qualitative layer)

`clarity.microsoft.com` → project **fleuret-website**. Three tabs that matter:

- **Dashboard.** Sessions / day, average scroll depth, average duration. Click any session row to watch the recording. Good for "what does a real visit actually look like?"
- **Heatmaps.** Click any URL (e.g., `/`, `/demo`, `/pricing`) → see click density. Surfaces dead buttons (high clicks, no event fires) and slept-on CTAs.
- **Recordings.** Filter by URL, by rage-click presence, by session duration. Watch the high-intent-but-no-conversion sessions to learn why people leave.

Clarity is the qualitative complement to GA4's quantitative funnel. GA4 tells you the number; Clarity tells you the cause.

---

## 5. The decision loop — what to do with the numbers

The point of analytics is decisions. If a number doesn't change behaviour, it's a vanity metric. The questions below are the ones the data should be able to answer.

### 5.1 Daily check (~3 minutes, every weekday morning)

Open the Looker Studio dashboard. Ask three questions:

1. **Did anything spike or drop ≥ 30 % vs the same day last week?** If yes, find the source on the top-left panel. Cold-email blast lands? Press mention? Outage? If it's positive, scale it. If it's negative, investigate.
2. **Is the pricing_viewed / sessions ratio ≥ 25 %?** If yes, the message above the fold is doing its job — pricing is being reached. If no, the homepage is failing to drive scroll. Watch a Clarity recording.
3. **Is the demo_scheduler_fallback_clicked count rising vs last week?** If yes, the Calendly embed is failing some visitors. Check Clarity for fallback-click recordings — is it a CSP issue? A specific browser? An iframe load failure?

### 5.2 Weekly review (~20 minutes, Friday)

Go deeper. Pair with the cross-share rapport in `fleuret-vault/Rapport_Yanis_S<WW>.md`.

| Question | Where to look | Action if the answer is bad |
|---|---|---|
| Are sessions growing week-over-week? | Looker top-right time series, smoothed | If flat or down, audit content cadence + cold-email volume + LinkedIn activity. |
| Which channel converts to `pricing_viewed` at the highest rate? | Looker top-left, hover `Engagement rate` column. Cross-reference with GA4 Explore segmenting on Source / medium. | Reallocate budget. If `cold-email` outperforms `(direct)`, double the cold-email cadence; if `organic` outperforms paid, cut Meta and invest in SEO. |
| Where does the funnel leak the most? | GA4 Funnel exploration (§4.2). Look for the biggest step-to-step drop. | If page_view → pricing_viewed leaks ≥ 75 %, the homepage isn't selling the product. Rewrite the top of the page. If pricing_viewed → outbound_click(demo) leaks ≥ 80 %, pricing or proof is weak. |
| Are visitors rage-clicking anything? | Clarity > Recordings > filter "rage clicks" | Element they're stabbing is broken or missing affordance. Fix it. |
| Which landing pages do cold-email visitors hit? | GA4 Explore > Cold-email landings audience > by Landing page | Pages with high bounce on cold-email landings need wedge-specific copy. |
| Which queries got us impressions but no clicks? | Search Console > Performance > sort by impressions desc, CTR asc | Page title / meta description is weak for the query. Rewrite. |

### 5.3 Monthly review (~1 hour, end of month)

Re-evaluate the cohort definitions. Are the four GA4 audiences still capturing the right behaviour? Should there be a new one (e.g., "Saw careers page" once recruiting cadence grows)?

Refresh the Looker Studio dashboard if you added new events. Add scorecards if a new step in the funnel is worth watching.

---

## 6. Internal-traffic filter (so your own clicks don't pollute the data)

GA4 cannot tell your visits apart from real-visitor visits unless you tell it.

**To set up** (2 minutes, do once):

1. `analytics.google.com` → property `fleuret.ai - GA4` → **Admin** (gear bottom-left).
2. **Data Streams** → click the web stream `fleuret.ai`.
3. **Configure tag settings** → **Show all** → **Define internal traffic**.
4. **Create rule** → name `Founder + team`, `traffic_type` value `internal`, match type `IP address in CIDR range`, value `90.8.168.0/24` (Yanis's residential Orange FR block). Add a second condition for IPv6 with value `2a01:cb1d:951:5a00::/64`. Save.
5. When Augustin shares his public IP, add a third condition to the SAME rule (do not create a second rule).
6. Back in **Admin** → **Data filters** → find the auto-created filter named `Internal Traffic`. Switch its state from `Testing` to **Active**. Save.

The Looker Studio dashboard already has the filter applied at the report level (step 4.1.6).

**Equivalent on Clarity side** (already in place 2026-05-17): Clarity > Settings > **IP blocking** > entry for `90.8.168.0/24`. Add Augustin's IP when available.

---

## 7. UTM tagging convention (so attribution actually works)

The canonical scheme lives at `wiki/concepts/utm-convention.md` in the master vault. Highlights:

- `utm_source` = the place the link is published (e.g., `linkedin`, `cold-email`, `newsletter`, `partner-vanta`).
- `utm_medium` = the channel category (`social`, `email`, `referral`, `paid-search`, `paid-social`).
- `utm_campaign` = the specific campaign (`2026-05-cold-nis2`, `friends-letter-w20`, `pricing-rework`).
- `utm_content` = the variant / placement (`hero-cta`, `inline-quote`, `image-1`).
- `utm_term` = paid keyword if relevant.

Every link you publish off-site should carry UTMs. Bare links default to GA4's `(direct)` bucket, which is unattributable noise. Per-channel templates live in the convention doc.

---

## 8. RGPD posture (don't get fined while measuring)

- Consent Mode v2 defaults to `analytics_storage: denied`, `ad_storage: denied`, `ad_user_data: denied`, `ad_personalization: denied`. Set in `index.html` `<head>` before any tag fires.
- "Accept all" on the cookie banner flips `analytics_storage` to `granted` only. The three `ad_*` signals stay `denied` because the banner is 2-button — granting ad consent without a separate marketing-category toggle would violate CNIL specificity per `TODOS.md` #4.
- Privacy policy at `fleuret.ai/privacy` lists Google LLC (GA4) and Microsoft Corp (Clarity) as recipients, declares 14-month and 12-month retention respectively, references DPF for US transfers, and mentions the opt-out path. RGPD art. 13/14 compliant as of 2026-05-17 (PR #108).
- Site is sub-processor compliant — `fleuret.ai/sub-processors` lists Google LLC and Microsoft Corp explicitly.

To add a marketing tag later (LinkedIn, Meta Pixel, etc.) you must first upgrade the consent banner to category toggles. See `TODOS.md` #4 for the exact pre-flight checklist.

---

## 9. Debugging when something looks wrong

| Symptom | First place to look | Diagnostic |
|---|---|---|
| GA4 shows zero sessions today | Realtime report | If real-time also zero: tags not firing. Open `fleuret.ai/?debug_mode=1` in a clean browser, watch DevTools Network for `/g/collect` POSTs. If you see them, GA4 ingestion is delayed. If you don't, the tag is broken. |
| Event counts look inflated | GA4 Realtime > Events | Watch a single page load. If a custom event fires twice in real time, the dual-pipe bug is back. Inspect `index.html` for any re-introduced GTM. |
| `(direct) / (none)` is the top source | Your team is missing UTMs on the links you publish | Audit the last week of LinkedIn posts, cold emails, and newsletter sends. Add UTMs going forward. |
| Pricing_viewed not firing | DevTools console on a homepage scroll | Verify `window.dataLayer` receives `['event', 'pricing_viewed', { section: 'homepage_pricing' }]`. If yes but no `/g/collect`, gtag.js isn't initialized. |
| Clarity dashboard empty | `clarity.microsoft.com` > Setup > "I installed the code, why am I not seeing my data?" wizard | Walks you through script-presence check + first-session timing (≤ a few hours after install). |
| Numbers in Looker disagree with GA4 | Looker time range vs GA4 time range | Looker reports include the report-level filter (`Test data filter name != Internal traffic`); raw GA4 reports do not by default. Reconcile by applying the same filter to the GA4 Explore. |

---

## 10. Reference

- GA4 property ID: `G-GCT3NK4C34` (web stream `fleuret.ai`, property number `533868629`).
- Clarity project ID: `wrwrt0esfs`.
- GTM container ID (NOT loaded on prod, reserved): `GTM-TLLF3LB2`.
- Search Console property: `fleuret.ai`, linked into GA4.
- Source of truth for events: `src/lib/gtag.ts`, wired through `src/components/Analytics.tsx`.
- Cookie banner state lives in `localStorage` key `fleuret_cookie_consent` (values: `accepted`, `denied`, absent).
- UTM convention: `wiki/concepts/utm-convention.md` (master vault).

If anything in this doc drifts from reality, update it here first, then the code. This doc is the source of truth for "how analytics is supposed to work on fleuret.ai."
