# Research v2 — Global Out-of-the-Box Opportunity Scan

**Context:** The invoice-generator niche (v1, see RESEARCH.md) has existing players. This pass
scans *globally* for problems where (a) people demonstrably pay, (b) the pain is acute and
quantified, (c) tool saturation is low, and (d) a solo founder can build and run it at ~$0.

---

## 1. The scan — seven candidates across regions

| # | Idea | Target countries | Pain / willingness to pay | Saturation | Buildable solo, $0? | Verdict |
|---|------|-----------------|---------------------------|------------|--------------------|---------|
| 1 | **Visa rejection-risk checker + application prep** | Applicants from NG, GH, PK, BD, MA, DZ, EG, JO, SN → EU/UK/US | Extreme: €316M/yr lost in rejected Schengen fees alone; €185 avg loss per rejected file; rejection rates 45–62% for several nationalities; insurance purchase is *legally mandatory* → built-in affiliate revenue | **Low** for risk-audit positioning (Atlys/iVisa do e-visa processing; free cover-letter tools are content marketing, not audits) | ✅ Pure client-side | ✅ **SELECTED** |
| 2 | EU Accessibility Act (EAA) compliance reports for SMB shops | EU (esp. DE — BFSG fines to €100k) | Real, B2B, deadline passed Jun 2025, enforcement ramping | Medium (axe/WAVE free; agencies) | ❌ Needs crawler backend | Strong #2 — revisit with backend budget |
| 3 | Embassy/consulate appointment-slot alert bots | IN, NG, MA (US/Schengen appointments) | High — people pay for slots | Medium, grey-area | ❌ Scraping infra + ToS risk | Rejected |
| 4 | Hajj/Umrah group-management SaaS for agencies | ID, PK, NG, UK, US agencies | High per-seat ($50–200/mo) | Very low | ⚠️ Needs backend + slow B2B sales | Good later-stage idea |
| 5 | Study-abroad SOP/LOR prep tools | IN, PK, NG, VN | High (students pay agencies $100s) | **High** (AI tools + agencies flooding) | ✅ | Rejected — saturating fast |
| 6 | EU261 flight-compensation claims | EU travellers | High (€250–600/claim) | **Very high** (AirHelp et al.) | ❌ Legal ops | Rejected |
| 7 | E-invoicing compliance in *new* mandate countries (MY MyInvois, PL KSeF, DE B2B) | MY, PL, DE | High (forced) | Medium — local accounting players moving | ⚠️ | Same shape as v1 idea; keep Fawtara as the MENA play |

## 2. Winner deep-dive: Visa Rejection Risk Checker (“don't lose your €185”)

### The problem, quantified
- **11.9M** Schengen short-stay applications in 2025; **1.7M rejected (14.8%)** — fees are non-refundable.
- Rejection is wildly unequal: Comoros **62.8%**, Bangladesh **~54–62%**, Pakistan **~47%**, Guinea-Bissau **47%**, Senegal **46.8%**, Nigeria **45.9%**, Ghana **45.5%** — vs. UAE or East Asia under 10%. African applicants are ~8× more likely to be refused than Asian ones; Africans lost an estimated **$67.5M** on rejected files in 2024 alone.
- The top refusal reasons are **preventable by preparation**: weak proof of ties to home country (#1), insufficient/badly-presented funds, unclear travel plans, missing documents. Each Schengen state has *specific* funds-per-day rules almost nobody knows (Germany ~€45/day, France €65–120/day depending on accommodation, Spain ~€108/day with a ~€900 minimum) — getting this one number wrong is a common silent killer.
- The rejected applicant loses the €90 visa fee **plus** appointment-center fees, insurance, reservations, and often non-refundable time off — total ~€185 average per rejected file. A $9 pre-submission audit against a €185 loss at 46% base risk is one of the easiest value propositions imaginable.

### Why this is not "already there" (the gap)
- **Atlys/iVisa**: their business is *processing e-visas* (Vietnam, Turkey, etc. — form-filling for easy visas). For sticker visas (Schengen/UK/US) they publish blog checklists and a free cover-letter toy as SEO content. None of them scores *your* file against *your* nationality's refusal data and *your* destination's funds rules and tells you what to fix.
- **Consultants/agencies** charge $50–200 for exactly this audit, manually, mostly via WhatsApp — proof of willingness to pay, and the thing software undercuts.
- Positioning: **"Grammarly for your visa file"** — a pre-submission audit, not a form-filler. That category is empty.

### Business model — three stacked revenue streams
1. **Mandatory-purchase affiliate (works on 100% of users, even free):** every Schengen applicant is *required by law* to buy €30k-coverage travel insurance. Affiliate programs pay real money: AXA Schengen ~6–15% (own program), EKTA 20%, VisitorsCoverage/Allianz up to 40% or $150/sale — realistically **$8–20 per completed application**. Flight-reservation-for-visa services (bookings without full payment) pay similar referral fees. The free risk checker is the funnel; the affiliate step is a *required* part of the user's journey, not an ad.
2. **Premium pack — $9 one-off:** personalized document pack (cover letter, day-by-day itinerary, document ordering, ties-evidence builder, funds-presentation guide). One-off pricing suits low-trust, low-card-penetration markets better than subscriptions.
3. **Later:** appeal-letter generator after refusal (remedy market), UK/US/Canada modules, B2B licensing to travel agencies in Lagos/Karachi/Casablanca who run this for clients.

### Unit economics
1,000 completed checks/month (achievable via programmatic SEO: nationality × destination = 25 × 26 = 650 high-intent pages) →
~20% click into insurance at ~30% purchase ≈ 60 policies × $12 ≈ **$720/mo** + 3% buy the $9 pack ≈ **$270/mo** ≈ **~$1K/mo per 1,000 users, at $0 run cost** — before UK/US modules, French localization (West Africa), or agency licensing.

### Target countries (in order)
| Priority | Applicant market | Why |
|---|---|---|
| 1 | 🇳🇬 Nigeria + 🇬🇭 Ghana | ~46% rejection, English-speaking, huge outbound demand, strong "japa" travel culture online |
| 2 | 🇵🇰 Pakistan + 🇧🇩 Bangladesh | 47–62% rejection, large populations, English-friendly |
| 3 | 🇲🇦🇩🇿🇹🇳 Maghreb + 🇸🇳 Senegal | High rejection; needs **French** UI (fast follow) |
| 4 | 🇪🇬 Egypt, 🇯🇴 Jordan, 🇮🇳 India, 🇹🇷 Turkey | Moderate rejection but massive volume; India alone ~1M+ applications |

### Distribution
- **Programmatic SEO**: "[nationality] Schengen visa rejection rate", "proof of funds for [country] visa", "why was my [country] visa rejected" — high-intent, long-tail, weak competition outside a few blogs.
- **TikTok/YouTube Shorts**: visa-rejection storytime content is enormous in Nigeria/Pakistan; a free "check your risk score" CTA fits it perfectly.
- **Facebook groups**: "Schengen visa experiences" groups have 100K+ members each; genuinely helpful risk-score screenshots spread themselves.
- **Post-refusal capture**: content around "visa refused — what now" catches users at maximum motivation for the paid appeal/reapply pack.

### Risks & honesty
- Refusal-rate and funds data must be refreshed yearly (EU publishes statistics annually) and always labeled as estimates, with "verify with your consulate" disclaimers. The tool gives preparation guidance, not legal advice — disclaimer required.

## 3. Sources
- [HelloSafe — Schengen refusal rates & 2025 volume](https://hellosafe.com/schengen-visa/rejection)
- [Henley — Schengen visa discrimination in numbers](https://www.henleyglobal.com/publications/global-mobility-report/2025-january/global-mobility-contradiction-schengen-visa-discrimination-numbers)
- [Africanews — African applicants hit by soaring rejections ($67.5M lost)](https://www.africanews.com/2025/05/26/visa-denied-african-travellers-hit-hard-by-soaring-schengen-rejections/)
- [Lago Collective — rejection cost data (€316M)](https://www.lagocollective.org/material/f/visas/rejected-by-gdp/)
- [US State Dept — FY24 B-visa refusal rates by nationality](https://travel.state.gov/content/dam/visas/Statistics/Non-Immigrant-Statistics/RefusalRates/FY24.pdf)
- [Insurte — Schengen proof of funds by country](https://insurte.com/schengen-visa-proof-of-funds)
- [Wego — minimum bank balance by Schengen country 2026](https://blog.wego.com/schengen-visa-proof-of-funds-bank-balance-2026/)
- [SchengenVisaSupport — proof of ties (top refusal reason)](https://schengenvisasupport.com/proof-of-ties-document/)
- [AXA Schengen — affiliate program](https://www.axa-schengen.com/en/lp/affiliation-axa-schengen-travel-insurance)
- [Travelpayouts — travel-insurance affiliate commissions](https://www.travelpayouts.com/blog/best-travel-insurance-affiliate-programs/)
- [Ecomobi — best travel insurance affiliate programs 2026](https://ecomobi.com/best-travel-insurance-affiliate-programs-2026/)
