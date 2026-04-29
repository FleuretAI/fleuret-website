# POC → Recurring upsell process

> Internal sales motion. Not customer-facing. Source of truth for who runs
> the upsell, when it triggers, and how the credit works.

## TL;DR

A POC customer (3,000 € / webapp, one-time) gets the full POC fee credited
toward year 1 of Recurring (30,000 € / year) if they upgrade within 6 months.
The credit is the lever that kills the "I already paid for this" objection
when we ask them to subscribe.

This document defines who owns the call, what triggers it, what cadence to
follow, and the math behind the credit.

## Who owns

- **Yanis (CEO)** is the default owner of every POC → Recurring call until a
  CRO is in seat. He runs the conversation, signs the renegotiation, owns
  the relationship.
- **Augustin (CPO)** joins for tech-eval portions only when the customer
  raises infra / sub-processor / DPA questions or asks "what does your CTO
  think." He never runs the commercial conversation.
- **Hand-off rule**: if a POC customer asks to talk to "someone technical"
  during the upsell call, Yanis loops Augustin in within 24h. No commitments
  on infra changes are made before that call.

## Triggers (any one of these starts the cadence)

1. **POC findings count**: the POC report ships with 3+ critical / high
   findings AND the customer has more than one webapp in scope. They have
   real surface area to defend; Recurring is the right shape.
2. **Customer-initiated ask**: the customer mentions a re-test, a new app
   to scope, a quarterly schedule, or "what would you charge for ongoing
   coverage." Drop everything and book the call.
3. **Auditor demand**: customer says their auditor wants more than annual
   pentest evidence (DORA, NIS2 RT-TLPT, ISO 27001 A.12.6). Recurring's
   weekly rescan + Ed25519-signed PDF is exactly the answer.
4. **Month-5 timer**: 5 months after POC delivery, regardless of the above.
   The credit window is 6 months; month 5 is the last clean shot. After
   month 6 the credit expires and we lose the lever.

## Cadence

Three touches max. After three, drop it; don't burn the relationship.

| Touch | Timing | Channel | Purpose |
|-------|--------|---------|---------|
| 1 | POC delivery + 30 days | Email | Soft check-in. Did Jira tickets ship? Any new questions? Hint at Recurring without selling. Template: `month-3-nudge.md`. |
| 2 | POC delivery + 5 months | Call | Real upsell conversation. Run the credit math live. Template: `month-5-trigger.md`. |
| 3 | POC delivery + 6 months − 14 days | Email | Last call. State the credit deadline explicitly. If silence, mark as "POC-only customer, no credit consumed" and move on. Template: `month-6-final.md`. |

## Credit math

The credit is the POC fee, full amount, applied to year 1 of Recurring.

```
POC paid: €3,000 (1 webapp)
Recurring year 1 list: €30,000
Recurring year 1 after credit: €27,000

If customer paid 3 webapp POCs (€9,000):
  Recurring year 1 after credit: €21,000
```

Computed by `computeUpgradeCredit()` in `src/lib/pricingConfig.ts`. The
helper enforces:

- Credit cannot exceed Recurring year-1 price (no negative invoices).
- Credit applies to year 1 only. Years 2 and 3 (if 3-year lock) are at
  full €27,000 / year.

If the customer signs the 3-year lock during the upsell, year 1 is at
€27,000 list and the POC credit drops it further. Stack honors the same
rule: credit never makes year 1 negative.

## Boundaries

- **Credit window is hard**: 6 months from POC delivery. No grace period.
  This is the lever; if we soften it, every customer waits.
- **Credit is per-POC, not per-customer**: a customer who paid 3 POCs gets
  3 × €3,000 = €9,000 in credit. We do not cap.
- **Credit does not stack with DP cohort**: Design Partner cohort customers
  (€4,900 / 3 pentests) are on a different program. They have their own
  upgrade path (defined separately) and do not double-dip.
- **Credit applies to Recurring only**: if a customer upgrades to Deep tier
  (white-glove, 70k+ / year, post-2027 SKU), the credit math is renegotiated
  at the table. POC fee is small compared to Deep year 1; we are not
  protecting the customer against the upgrade premium.

## What gets recorded

Every POC → Recurring conversation closes with a written record:

- Customer name, POC SKU(s) paid, contract dates
- Trigger that started the cadence (findings count / customer ask / auditor / month-5 timer)
- Outcome (Recurring 1yr, Recurring 3yr, no upgrade, deferred)
- If no upgrade: written reason in the customer's own words. We need the
  pattern to learn what the actual blocker is.
- If deferred: next-touch date. Maximum one deferral.

Stored in the Airtable Channel Pipeline (per `Claude/Plans/sprint-day1/02-airtable-schema.md`).

## Open questions (move-to-version-2)

- Auto-trigger emails on month-5 timer. Today this is calendar-driven and
  manual; if upsell volume grows past ~5 / month, automate via lemlist or
  Resend.
- Multi-year lock as a discount inside Recurring (already 10%) vs as the
  default offer at POC → Recurring upsell. Test on first 2 closes.
- Wholesale variant: when a channel partner (Vanta, Yogosha) brings a POC
  customer, who owns the upsell call: us or the partner? Likely partner
  for SaaS GRC channel, us for marketplace channel. Confirm during first
  partner contract.

## Related

- `src/lib/pricingConfig.ts` — `computeUpgradeCredit()` and pricing constants.
- `docs/sales/email-templates/poc-to-recurring-upsell.md` — the three email
  templates (month-3 nudge, month-5 trigger, month-6 final).
- Design doc: `~/.gstack/projects/fleuret/yanisgrigy-master-design-20260428-032004.md`
  open question #1.
