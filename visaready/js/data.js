/* VisaReady data — approximate figures compiled from EU Commission visa statistics
   (2024–2025) and consulate guidance. Refresh yearly. Always shown to users as
   estimates with a "verify with your consulate" disclaimer. */

/* Approximate Schengen short-stay refusal rates by applicant nationality (%). */
const NATIONALITIES = [
  { code: "NG", name: "Nigeria", rate: 45.9 },
  { code: "GH", name: "Ghana", rate: 45.5 },
  { code: "SN", name: "Senegal", rate: 46.8 },
  { code: "GW", name: "Guinea-Bissau", rate: 47.0 },
  { code: "KM", name: "Comoros", rate: 62.8 },
  { code: "PK", name: "Pakistan", rate: 47.0 },
  { code: "BD", name: "Bangladesh", rate: 54.0 },
  { code: "LK", name: "Sri Lanka", rate: 35.0 },
  { code: "NP", name: "Nepal", rate: 30.0 },
  { code: "IN", name: "India", rate: 15.0 },
  { code: "MA", name: "Morocco", rate: 30.0 },
  { code: "DZ", name: "Algeria", rate: 35.0 },
  { code: "TN", name: "Tunisia", rate: 27.0 },
  { code: "EG", name: "Egypt", rate: 27.0 },
  { code: "JO", name: "Jordan", rate: 22.0 },
  { code: "LB", name: "Lebanon", rate: 25.0 },
  { code: "IQ", name: "Iraq", rate: 40.0 },
  { code: "IR", name: "Iran", rate: 30.0 },
  { code: "TR", name: "Turkey", rate: 16.0 },
  { code: "KE", name: "Kenya", rate: 25.0 },
  { code: "ET", name: "Ethiopia", rate: 35.0 },
  { code: "ZA", name: "South Africa", rate: 8.0 },
  { code: "PH", name: "Philippines", rate: 12.0 },
  { code: "ID", name: "Indonesia", rate: 10.0 },
  { code: "VN", name: "Vietnam", rate: 20.0 },
  { code: "CN", name: "China", rate: 8.0 },
  { code: "RU", name: "Russia", rate: 10.0 },
  { code: "UA", name: "Ukraine", rate: 8.0 },
  { code: "SA", name: "Saudi Arabia", rate: 5.0 },
  { code: "AE", name: "United Arab Emirates", rate: 3.0 },
  { code: "KW", name: "Kuwait", rate: 6.0 },
  { code: "XX", name: "Other / not listed", rate: 15.0 },
];

/* Destination funds requirements (approximate, EUR/day unless noted).
   `min` is a flat minimum some consulates apply regardless of trip length. */
const DESTINATIONS = [
  { code: "DE", name: "Germany", perDay: 45, min: 0, note: "≈ €45/day of stay" },
  { code: "FR", name: "France", perDay: 65, min: 0, note: "≈ €65/day with proof of accommodation, ≈ €120/day if staying in hotels without pre-booking" },
  { code: "ES", name: "Spain", perDay: 108, min: 900, note: "≈ €108/day, minimum ≈ €900 regardless of trip length" },
  { code: "IT", name: "Italy", perDay: 50, min: 270, note: "Sliding scale by trip length; ≈ €45–270 overall for short trips" },
  { code: "NL", name: "Netherlands", perDay: 55, min: 0, note: "≈ €55/day" },
  { code: "BE", name: "Belgium", perDay: 95, min: 0, note: "≈ €95/day in hotels, ≈ €45/day if hosted" },
  { code: "GR", name: "Greece", perDay: 50, min: 300, note: "≈ €50/day, minimum ≈ €300" },
  { code: "PT", name: "Portugal", perDay: 40, min: 75, note: "≈ €40/day plus ≈ €75 per entry" },
  { code: "AT", name: "Austria", perDay: 100, min: 0, note: "No official figure; ≈ €100/day is commonly expected" },
  { code: "CH", name: "Switzerland", perDay: 92, min: 0, note: "≈ CHF 100/day" },
  { code: "CZ", name: "Czechia", perDay: 45, min: 0, note: "≈ €45/day" },
  { code: "PL", name: "Poland", perDay: 20, min: 70, note: "≈ PLN 88/day" },
  { code: "SE", name: "Sweden", perDay: 50, min: 0, note: "≈ SEK 580/day" },
  { code: "XX", name: "Other Schengen state", perDay: 60, min: 0, note: "Using a €60/day average — check your consulate's exact figure" },
];

/* Risk model: base = nationality refusal rate, adjusted by file-strength factors.
   Deltas are percentage points; result clamped to 3–90.
   Factor weights reflect the refusal reasons consulates themselves publish:
   ties > funds > travel history > purpose clarity. */
const RISK_RULES = {
  fundsRatio: [
    { min: 1.5, delta: -8 },
    { min: 1.0, delta: -3 },
    { min: 0.7, delta: 8, flag: "Your bank balance is below the required amount for this trip. Either shorten the trip, add funds well in advance, or show a second account." },
    { min: 0, delta: 18, flag: "Your funds are far below this country's requirement — this alone is a very common refusal reason. Do not apply until this is fixed." },
  ],
  employment: {
    employed_letter: { delta: -6 },
    employed_no_letter: { delta: -2, flag: "Get an employment letter confirming your position, salary and approved leave — it is one of the strongest ties documents." },
    self_employed: { delta: -3, flag: "Include business registration, tax filings and business bank statements to prove your business needs you back." },
    student: { delta: -4, flag: "Include an enrollment certificate and a no-objection letter from your institution." },
    unemployed: { delta: 10, flag: "No current employment is a major red flag for ties. Compensate with strong family, property or financial ties, and explain your situation honestly in the cover letter." },
  },
  travelHistory: {
    strong: { delta: -12 },
    some: { delta: -5 },
    none: { delta: 8, flag: "A blank passport raises scrutiny. Consider building history first with easier destinations (e.g. Turkey, Malaysia, Georgia) before Schengen." },
  },
  previousRejection: { delta: 15, flag: "A previous refusal must be addressed head-on: state it in the form (never hide it — Schengen consulates share data) and show what changed since." },
  ties: {
    perTie: -4,
    max: -12,
    noneFlag: "Weak ties to your home country is the #1 Schengen refusal reason. Gather every proof you can: job contract, property deeds, family registry, business ownership.",
  },
  sponsor: { delta: 6, flag: "Third-party sponsorship gets extra scrutiny. Include the sponsor's ID, proof of funds, relationship proof and a formal sponsorship letter — and show some funds of your own." },
  recentDeposits: { delta: 8, flag: "Large recent deposits look like borrowed 'show money'. Officers check statement history — money should sit in your account 3–6 months, or be explained with documents (asset sale, bonus letter…)." },
  bookings: {
    ready: { delta: -3 },
    none: { delta: 5, flag: "Prepare refundable flight and hotel reservations (never pay in full before the visa). An unclear itinerary reads as an unclear purpose of travel." },
  },
};

const RISK_BANDS = [
  { max: 20, label: "Low risk", cls: "band-low", advice: "Your file looks solid. Fix any flags below, double-check the document checklist, and apply with confidence." },
  { max: 40, label: "Moderate risk", cls: "band-mid", advice: "Approvable, but weak points in your file need work before you pay the fee. Address every flag below." },
  { max: 101, label: "High risk", cls: "band-high", advice: "Applying right now would likely waste your fee (~€185 all-in when rejected). Work through the fixes below first — most of them take weeks, not months." },
];
