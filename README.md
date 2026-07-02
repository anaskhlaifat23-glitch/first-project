# Fawtara — فوترة

**Free bilingual (Arabic/English) VAT invoice generator for freelancers in Saudi Arabia,
the UAE and the wider GCC/MENA region — with the ZATCA Phase 1 QR code built in.**

Why this product was chosen, which markets it targets, how saturated the competition is,
and how it makes money: see **[RESEARCH.md](RESEARCH.md)**.

## What it does

- 🧾 Generates professional **bilingual (AR + EN) tax invoices** — the format GCC clients expect
- 🇸🇦 **ZATCA Phase 1 QR code** (official TLV/Base64 encoding: seller name, VAT number, timestamp, total, VAT) for Saudi simplified tax invoices
- 🏛️ One-click **VAT presets** for KSA (15%), UAE (5%), Bahrain (10%), Oman (5%), Qatar, Kuwait, Jordan (16%), Egypt (14%)
- 💱 Multi-currency with correct decimals (incl. 3-decimal KWD/BHD/OMR)
- ⬇ **PDF via the browser's print engine** — zero dependencies, clean A4 output
- 💾 Remembers your business profile, drafts and invoice numbering in `localStorage`
- 🔒 **100% client-side**: no backend, no database, no data ever leaves the browser
- 🌐 Full **RTL Arabic interface** with one-click language toggle

## Run it

It's a static site — no build step:

```bash
# any static server, e.g.
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy for $0

- **GitHub Pages**: Settings → Pages → deploy from `main` branch root. Done.
- **Cloudflare Pages / Netlify / Vercel**: point at the repo, framework = none, output dir = `/`.

Then attach a custom domain (check trademark availability first — do **not** use
"Fatoora", that's ZATCA's own portal brand).

## How it makes money (activation checklist)

The free generator is the SEO acquisition funnel; revenue comes from **Pro** ($7/mo)
and later **Business** ($19/mo, ZATCA Phase 2 API). Full model in RESEARCH.md §4.

1. **Wiring payments (15 min).** Create a product on [Lemon Squeezy](https://lemonsqueezy.com)
   or [Paddle](https://paddle.com) (both act as merchant of record — they handle GCC cards,
   VAT and payouts). Replace the waitlist modal in `js/app.js` (`initModal`) with their
   checkout overlay, e.g. `LemonSqueezy.Url.Open("https://YOURSTORE.lemonsqueezy.com/checkout/…")`.
   Gate `#watermark` removal + logo upload behind the license key their API returns.
2. **Waitlist → real inbox.** The waitlist form currently stores emails in `localStorage`
   (placeholder). Point it at a free [Formspree](https://formspree.io) /
   [Web3Forms](https://web3forms.com) endpoint to actually collect leads.
3. **Contact email.** Replace `support@yourdomain.com` in `index.html` footer.
4. **Analytics.** Add [Plausible](https://plausible.io) or Cloudflare Web Analytics
   (one `<script>` tag; both cookieless, no consent banner needed).
5. **SEO pages.** Add per-keyword landing pages (AR + EN): "فاتورة ضريبية السعودية",
   "free VAT invoice generator Saudi Arabia", "ZATCA QR code generator", per-country pages.
6. **Distribution.** Mostaql/Khamsat communities, Saudi freelancer X/Twitter, Arabic
   TikTok tutorials, r/saudiarabia — and time pushes around each ZATCA Phase 2 wave
   deadline (next: Wave 24, 30 June 2026).

## Project structure

```
index.html      landing page + generator + pricing + FAQ (SEO copy)
css/style.css   design system, RTL support, print stylesheet (A4 invoice only)
js/i18n.js      full EN/AR interface translations
js/app.js       invoice logic, totals, ZATCA TLV/QR, localStorage persistence
RESEARCH.md     market analysis: niche selection, target countries, pricing, GTM
```

## Compliance notes

- **Phase 1 (Generation)**: the QR follows ZATCA's TLV spec (tags 1–5) for *simplified*
  tax invoices (B2C/freelancer scenarios). Standard B2B tax invoices for Phase 2 wave
  companies additionally require Fatoora portal integration (cryptographic stamps, XML) —
  that's the paid Business-tier roadmap, not covered by the free tool.
- Invoice output keeps both languages on one document; ZATCA requires Arabic on tax
  invoices, and the bilingual layout satisfies Arabic-first while staying readable for
  international clients.
