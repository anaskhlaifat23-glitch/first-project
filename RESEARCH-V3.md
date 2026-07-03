# Research v3 — AmanaWill: Islamic Will & Inheritance Builder

**Why a third direction:** the user asked for something different from invoicing (v1) and
visa prep (v2). From the v2 global scan, the remaining top candidates were: Islamic estate
planning (B2C, global), EU Accessibility Act compliance (B2B, needs a crawler backend),
Umrah/Hajj agency SaaS (B2B, needs backend + slow sales), and GCC digital wedding invites
(B2C, needs per-event hosting). Only Islamic estate planning fits all current constraints:
client-side buildable, global, one-off payments, and driven by *religious obligation* —
the strongest willingness-to-pay motive there is.

## 1. The market

- **Audience:** ~25M+ Muslims living in the UK, US, Canada, EU and Australia — where
  **dying without a will means local intestacy law overrides the Quranic shares entirely**
  (e.g. spouse takes everything, parents/siblings get nothing). Estate planning is a
  religious duty (the hadith in Bukhari/Muslim: no two nights without a written will), yet
  will-ownership among Western Muslims is notoriously low. This is a compliance product
  where the "regulator" is conviction — stronger than any tax authority.
- **Proven prices:** Wassiyyah charges **$99 per estate plan** ($199 for trusts); US
  specialist attorneys charge thousands; My Islamic Will (UK) charges per change or
  £10/year; ShariaWiz / MyWassiyah / MinaWill sell state-specific US wills. The paid
  market is real and mid-priced — leaving room to undercut at **$29 one-off**.
- **Trigger moments:** Ramadan (wills are a classic Ramadan resolution), Hajj (pilgrims
  are strongly advised to write a will before travel — an annual 2M-person event),
  marriage, first child, house purchase.

## 2. Saturation check (honest)

Free Faraid calculators are plentiful (IslamicInheritance.com, Al-Wirasat, HalalWallet…)
— so the calculator is **not** the product; it's the funnel. Paid will services exist but
are few, dated in UX, priced 3–10× higher, and none lead with the emotional hook this
build uses: **"If you passed away today, who inherits what?"** — showing a user that,
without a will, their spouse could take 100% under intestacy while their parents'
Quranic 1/6 shares vanish. Every existing tool is a dry fiqh utility; none are built as
a wake-up call that converts into a $29 fix.

## 3. The product

1. **Free:** exact-fraction Faraid calculator — spouse/children/parents/grandparents/
   full & maternal siblings, with 'awl, radd, both 'Umariyyah cases, blocking rules,
   the 1/3 wasiyyah cap, and the Quranic basis cited on every share (an-Nisa 4:11,
   4:12, 4:176). Runs entirely in the browser (privacy matters for family+money data).
   Engine is pure-function and unit-tested against 13 canonical fiqh cases.
2. **Paid ($29 one-off):** personalized witness-ready Islamic will — executor,
   guardianship of minor children, funeral wishes, wasiyyah clauses, Faraid schedule,
   country-specific signing guidance (UK: two non-beneficiary witnesses; US: per state).
   Checkout via Lemon Squeezy/Paddle like the other products.
3. **Roadmap:** Arabic/Urdu/French versions, paternal half-siblings + grandchildren
   cases, madhhab selector, "Hajj will" quick version each Dhul-Hijjah, zakat calculator
   cross-sell.

## 4. Distribution

- **SEO:** "islamic inheritance calculator", "islamic will template UK/US", "who inherits
  in Islam", "wife share in islamic inheritance" — high-intent, evergreen; plus
  programmatic pages per country and per family-scenario ("islamic inheritance: wife and
  two daughters").
- **Mosques & Islamic centers** in the UK/US run wills workshops constantly — offer the
  tool free to attendees, sell the document.
- **Ramadan/Dhul-Hijjah campaigns**; Muslim personal-finance channels (Islamic Finance
  Guru audience type), khutbah handout QR codes.
- **Charity partnerships:** UK Islamic charities (Islamic Relief etc.) actively promote
  wills because of the 1/3 charity bequest — a "leave a legacy" co-marketing angle where
  the charity promotes the tool for free.

## 5. Unit economics

$29 × conversions on religious-obligation traffic; comparable services convert at
2–5% from calculator to paid document. 5,000 calculator users/month × 3% × $29 ≈
**$4.3K/month**, zero hosting, ~97% margin after payment fees. Ramadan multiplies
traffic several-fold for a month every year.

## 6. Sources

- [Wassiyyah — pricing ($99/estate plan)](https://wassiyyah.com/pricing)
- [WillsConnect — UK Islamic will providers compared](https://www.willsconnect.co.uk/islamic-wills/best-islamic-will-providers-uk-comparison/)
- [Islamic Finance Guru — Islamic wills UK guide](https://www.islamicfinanceguru.com/articles/islamic-wills-uk)
- [My Islamic Will UK — pricing model](https://www.myislamicwill.co.uk/)
- [HalalWallet — US Islamic estate-planning comparison](https://www.halalwallet.us/estate-planning)
- [Islamic Wills & Trust Services USA](https://islamicwillstrust.com/)
- [IslamicInheritance.com — free Faraid calculator (competitor)](https://islamicinheritance.com/calculator/)
- [Al-Wirasat — free calculator (competitor)](https://alwirasat.com/)
