# POC → Recurring upsell — email templates

> Three drafts for the cadence in `../poc-to-recurring-process.md`.
> Personalize the bracketed bits before sending. Voice: direct, founder-to-buyer,
> no hard sell. Customer should read these as a useful nudge, not a pitch.

---

## Template 1 — Month-3 nudge (soft check-in)

**Subject (FR):** Le pentest de [WebApp] : où en est-on côté Jira ?
**Subject (EN):** Pentest follow-up on [WebApp]: how is Jira looking?

**Body (FR):**

Bonjour [Prénom],

Trois mois depuis le pentest de [WebApp]. Rapide check-in : est-ce que les
findings ont bien atterri dans votre Jira et est-ce que votre équipe a pu
faire le re-test sur les criticals ?

Si rien ne bouge ou si vous avez besoin d'un coup de main pour relancer,
dites-moi. Je peux pousser un re-scan automatique en deux clics.

Et si entre temps vous avez d'autres apps à passer au pentest, on peut en
parler. Le crédit POC reste actif jusqu'au [DATE_LIMITE] si vous voulez
basculer en Recurring.

Yanis

**Body (EN):**

Hi [First Name],

Three months since the pentest on [WebApp]. Quick check-in: did the findings
land in your Jira, and did your team get a re-test done on the criticals?

If nothing moved or you need a hand restarting, let me know. I can push an
automated rescan in two clicks.

Also: if you have other apps that need pentesting in the meantime, happy to
talk. The POC credit is still active until [DEADLINE_DATE] if you want to
switch to Recurring.

Yanis

**Notes:**
- Send from `yanis@fleuret.ai` only. Cold mailbox infra (Mailpool) does not
  apply here; this is a customer-relationship touch, not outbound.
- The credit deadline is the POC delivery date + 6 months, exact date.
- Don't pitch features. Pitch follow-through.

---

## Template 2 — Month-5 trigger (real upsell)

This is a call request, not a pitch in email. Goal: book the call.

**Subject (FR):** [Nom] — 30 min sur le passage en pentest continu ?
**Subject (EN):** [Name] — 30 min on switching to continuous pentest?

**Body (FR):**

Bonjour [Prénom],

Cinq mois depuis le pentest de [WebApp]. La fenêtre de crédit POC se ferme
fin [MOIS]. Avant qu'elle expire, je voulais voir si Recurring fait sens
pour vous.

Le format Recurring : re-scan automatique chaque semaine, tickets Jira par
finding, rapport DORA / NIS2 signé Ed25519 vérifiable hors ligne. 30 000 €
par an liste, 27 000 € si vous prenez le lock 3 ans. Et le crédit POC se
déduit de l'année 1 : pour vous, ça donne [MONTANT_CALCULÉ] sur les 12
premiers mois.

30 minutes en visio cette semaine ? Voici mon agenda : [LIEN_CAL_COM]

Yanis

**Body (EN):**

Hi [First Name],

Five months since the pentest on [WebApp]. The POC credit window closes end
of [MONTH]. Before it expires, I wanted to see if Recurring makes sense for
you.

The Recurring format: weekly automated rescan, Jira tickets per finding,
Ed25519-signed DORA / NIS2 report, offline-verifiable. €30,000 a year list,
€27,000 if you take the 3-year lock. And the POC credit deducts from year 1:
for you, that means [COMPUTED_AMOUNT] for the first 12 months.

30 minutes on a call this week? Here is my calendar: [CAL_COM_LINK]

Yanis

**Notes:**
- Always include the calculated amount (POC fees credited against year 1).
  Use `computeUpgradeCredit()` in `src/lib/pricingConfig.ts` for the math.
- If the customer is on the DP cohort program, swap this template for the
  DP-specific upgrade email (TODO: write).
- Don't list every feature. Three is enough; the demo carries the rest.

---

## Template 3 — Month-6 final (last call)

Send 14 days before the credit deadline. This is the last touch.

**Subject (FR):** Le crédit POC expire le [DATE]
**Subject (EN):** The POC credit expires on [DATE]

**Body (FR):**

Bonjour [Prénom],

Petit rappel : le crédit POC sur [WebApp] expire le [DATE_EXACTE]. Après
cette date, Recurring redevient au prix plein (30 000 € / an).

Si Recurring n'est pas le bon timing, pas de souci. Dites-moi si vous voulez
qu'on en reparle dans 6 mois ou si vous préférez qu'on laisse de côté pour
l'instant.

Si vous voulez verrouiller le crédit avant l'expiration, un signal en
réponse à cet email suffit.

Yanis

**Body (EN):**

Hi [First Name],

Quick reminder: the POC credit on [WebApp] expires on [EXACT_DATE]. After
that, Recurring goes back to list price (€30,000 / year).

If Recurring is not the right timing, no problem. Let me know if you want
to revisit in 6 months, or if you would rather we put it aside for now.

If you want to lock the credit before expiry, a one-line reply to this
email is enough.

Yanis

**Notes:**
- This is the last touch. Don't follow up after this email unless the
  customer replies.
- "Lock the credit" = signed letter of intent at Recurring rate, contract
  signed within 30 days. Otherwise the credit lapses.
- Mark customer in Airtable as "POC-only, credit expired" if no response
  within 14 days. Move them to the long-term newsletter cadence.

---

## Voice rules (apply to all three)

- No em-dash sentence connectors. Use periods, commas, parentheses.
- No corporate filler ("just touching base", "circling back", "synergy").
- Lead with the customer's situation, not Fleuret's offering.
- Be specific: app name, exact dates, exact euro amounts.
- Sign-off: "Yanis" only. Not "Best", not "Cheers", not "Sincerely".
- Length cap: 120 words for nudge, 150 for upsell, 100 for final.
