/* AmanaWill — Faraid (Islamic inheritance) engine.
   Exact fraction arithmetic; majority (jumhur) Sunni positions on the
   supported heir set. Edge-case madhhab differences are surfaced as notes,
   never silently decided. Pure functions — no DOM — so it can be unit-tested.

   Supported heirs: spouse, sons, daughters, father, mother, paternal
   grandfather, grandmothers, full siblings, maternal siblings.
   Order of operations: funeral costs → debts → bequest (≤ 1/3) → fixed
   shares (fard) → residue to agnates ('asaba) → 'awl / radd as needed. */

/* ---------- exact fractions ---------- */
function gcd(a, b) { return b ? gcd(b, a % b) : a; }
function F(n, d) {
  if (d < 0) { n = -n; d = -d; }
  const g = gcd(Math.abs(n), Math.abs(d)) || 1;
  return { n: n / g, d: d / g };
}
const fAdd = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
const fSub = (a, b) => F(a.n * b.d - b.n * a.d, a.d * b.d);
const fMul = (a, b) => F(a.n * b.n, a.d * b.d);
const fDiv = (a, b) => F(a.n * b.d, a.d * b.n);
const fCmp = (a, b) => a.n * b.d - b.n * a.d;
const ZERO = F(0, 1), ONE = F(1, 1);
const fStr = (f) => f.n === 0 ? "0" : (f.d === 1 ? String(f.n) : f.n + "/" + f.d);

/* ---------- the engine ---------- */
/* input: { deceased:"male"|"female", spouses:int, sons:int, daughters:int,
            father:bool, mother:bool, pgf:bool, grandmothers:int,
            fullBrothers:int, fullSisters:int, maternalSiblings:int } */
function computeFaraid(input) {
  const heirs = [];   // { key, label, count, share (total, fraction of distributable), basis, group }
  const notes = [];

  const sons = input.sons | 0, daughters = input.daughters | 0;
  const hasDesc = sons + daughters > 0;
  const hasMaleDesc = sons > 0;
  const siblingsTotal = (input.fullBrothers | 0) + (input.fullSisters | 0) + (input.maternalSiblings | 0);

  // blocking (hajb)
  const pgf = input.pgf && !input.father;
  if (input.pgf && input.father) notes.push("The paternal grandfather is blocked (mahjub) by the father.");
  const grandmothers = input.mother ? 0 : (input.grandmothers | 0);
  if (input.grandmothers > 0 && input.mother) notes.push("Grandmothers are blocked by the mother.");
  const fullSiblingsBlocked = hasMaleDesc || input.father || pgf;
  if ((input.fullBrothers > 0 || input.fullSisters > 0) && fullSiblingsBlocked) {
    notes.push("Full siblings are blocked by the " + (hasMaleDesc ? "son" : input.father ? "father" : "grandfather (majority Hanafi position — Shafi'i/Maliki make siblings share with the grandfather; consult a scholar for this case)") + ".");
  }
  const fullBrothers = fullSiblingsBlocked ? 0 : input.fullBrothers | 0;
  const fullSisters = fullSiblingsBlocked ? 0 : input.fullSisters | 0;
  const matSibsBlocked = hasDesc || input.father || pgf;
  if (input.maternalSiblings > 0 && matSibsBlocked) notes.push("Maternal siblings are blocked by descendants, the father, or the grandfather.");
  const maternalSiblings = matSibsBlocked ? 0 : input.maternalSiblings | 0;

  // spouse
  let spouseShare = ZERO;
  const spouses = Math.max(0, input.spouses | 0);
  if (spouses > 0) {
    if (input.deceased === "female") {
      spouseShare = hasDesc ? F(1, 4) : F(1, 2);
      heirs.push({ key: "husband", label: "Husband", count: 1, share: spouseShare, group: "fard",
        basis: "Qur'an 4:12 — " + (hasDesc ? "1/4 with descendants" : "1/2 with no descendants") });
    } else {
      spouseShare = hasDesc ? F(1, 8) : F(1, 4);
      heirs.push({ key: "wives", label: spouses > 1 ? "Wives (" + spouses + ", shared equally)" : "Wife", count: spouses, share: spouseShare, group: "fard",
        basis: "Qur'an 4:12 — " + (hasDesc ? "1/8 with descendants" : "1/4 with no descendants") + (spouses > 1 ? ", shared equally" : "") });
    }
  }

  // mother — including the two 'Umariyyah cases
  const fatherFigure = input.father || pgf;
  const umariyyah = spouses > 0 && input.father && !hasDesc && siblingsTotal < 2 &&
    !input.mother ? false : (spouses > 0 && input.father && input.mother && !hasDesc && siblingsTotal < 2);
  if (input.mother) {
    let mShare, mBasis;
    if (umariyyah) {
      mShare = fMul(F(1, 3), fSub(ONE, spouseShare));
      mBasis = "'Umariyyah case — 1/3 of the remainder after the spouse (ruling of 'Umar ibn al-Khattab, adopted by the four schools)";
    } else if (hasDesc || siblingsTotal >= 2) {
      mShare = F(1, 6);
      mBasis = "Qur'an 4:11 — 1/6 " + (hasDesc ? "with descendants" : "with two or more siblings");
    } else {
      mShare = F(1, 3);
      mBasis = "Qur'an 4:11 — 1/3 with no descendants and fewer than two siblings";
    }
    heirs.push({ key: "mother", label: "Mother", count: 1, share: mShare, group: "fard", basis: mBasis });
  }

  // grandmothers
  if (grandmothers > 0) {
    heirs.push({ key: "grandmothers", label: grandmothers > 1 ? "Grandmothers (shared)" : "Grandmother", count: grandmothers,
      share: F(1, 6), group: "fard", basis: "Sunnah — 1/6 in the mother's absence" });
  }

  // maternal siblings
  if (maternalSiblings > 0) {
    heirs.push({ key: "maternal", label: "Maternal sibling" + (maternalSiblings > 1 ? "s (shared equally)" : ""), count: maternalSiblings,
      share: maternalSiblings === 1 ? F(1, 6) : F(1, 3), group: "fard",
      basis: "Qur'an 4:12 — " + (maternalSiblings === 1 ? "1/6 for one" : "1/3 shared for two or more (males and females equally)") });
  }

  // daughters (as fard, when no sons)
  if (daughters > 0 && sons === 0) {
    heirs.push({ key: "daughters", label: daughters > 1 ? "Daughters (" + daughters + ", shared)" : "Daughter", count: daughters,
      share: daughters === 1 ? F(1, 2) : F(2, 3), group: "fard",
      basis: "Qur'an 4:11 — " + (daughters === 1 ? "1/2 for one daughter" : "2/3 shared for two or more daughters") });
  }

  // full sisters as fard (no brothers, no daughters)
  if (fullSisters > 0 && fullBrothers === 0 && daughters === 0 && sons === 0) {
    heirs.push({ key: "sisters", label: fullSisters > 1 ? "Full sisters (" + fullSisters + ", shared)" : "Full sister", count: fullSisters,
      share: fullSisters === 1 ? F(1, 2) : F(2, 3), group: "fard",
      basis: "Qur'an 4:176 — " + (fullSisters === 1 ? "1/2 for one sister" : "2/3 shared for two or more") });
  }

  // father / grandfather fixed 1/6 when there are descendants
  if (fatherFigure && hasDesc) {
    heirs.push({ key: input.father ? "father" : "pgf", label: input.father ? "Father" : "Paternal grandfather", count: 1,
      share: F(1, 6), group: "fard",
      basis: "Qur'an 4:11 — 1/6 with descendants" + (hasMaleDesc ? "" : " (plus any residue, as 'asaba)") });
  }

  /* ---------- residue ('asaba) ---------- */
  let sumFard = heirs.reduce((s, h) => fAdd(s, h.share), ZERO);
  let residue = fSub(ONE, sumFard);

  // 'awl — shares exceed the estate: scale everything down proportionally
  if (fCmp(sumFard, ONE) > 0) {
    heirs.forEach((h) => { h.share = fDiv(h.share, sumFard); h.awl = true; });
    notes.push("'Awl applied: the fixed shares exceeded the estate (" + fStr(sumFard) + "), so every share is reduced proportionally.");
    residue = ZERO;
    sumFard = ONE;
  }

  // 'asaba chain
  if (fCmp(residue, ZERO) > 0) {
    if (sons > 0) {
      const parts = sons * 2 + daughters;
      heirs.push({ key: "sons", label: sons > 1 ? "Sons (" + sons + ")" : "Son", count: sons,
        share: fMul(residue, F(sons * 2, parts)), group: "asaba",
        basis: "Qur'an 4:11 — residue, male receives the share of two females" });
      if (daughters > 0) {
        heirs.push({ key: "daughters", label: daughters > 1 ? "Daughters (" + daughters + ")" : "Daughter", count: daughters,
          share: fMul(residue, F(daughters, parts)), group: "asaba",
          basis: "Qur'an 4:11 — residue with sons, male receives the share of two females" });
      }
      residue = ZERO;
    } else if (fatherFigure) {
      const key = input.father ? "father" : "pgf";
      const existing = heirs.find((h) => h.key === key);
      if (existing) { existing.share = fAdd(existing.share, residue); }
      else {
        heirs.push({ key, label: input.father ? "Father" : "Paternal grandfather", count: 1, share: residue, group: "asaba",
          basis: "Residue as nearest male agnate ('asaba)" });
      }
      residue = ZERO;
    } else if (fullBrothers > 0) {
      const parts = fullBrothers * 2 + fullSisters;
      heirs.push({ key: "brothers", label: fullBrothers > 1 ? "Full brothers (" + fullBrothers + ")" : "Full brother", count: fullBrothers,
        share: fMul(residue, F(fullBrothers * 2, parts)), group: "asaba",
        basis: "Qur'an 4:176 — residue, male receives the share of two females" });
      if (fullSisters > 0) {
        heirs.push({ key: "sisters", label: fullSisters > 1 ? "Full sisters (" + fullSisters + ")" : "Full sister", count: fullSisters,
          share: fMul(residue, F(fullSisters, parts)), group: "asaba",
          basis: "Qur'an 4:176 — residue with brothers, male receives the share of two females" });
      }
      residue = ZERO;
    } else if (fullSisters > 0 && daughters > 0) {
      // sisters become 'asaba ma'a al-ghayr alongside daughters
      const existing = heirs.find((h) => h.key === "sisters");
      if (existing) existing.share = fAdd(existing.share, residue);
      else heirs.push({ key: "sisters", label: "Full sister" + (fullSisters > 1 ? "s" : ""), count: fullSisters, share: residue, group: "asaba",
        basis: "'Asaba ma'a al-ghayr — sisters take the residue alongside daughters" });
      residue = ZERO;
    }
  }

  // radd — leftover with no 'asaba: return to fard heirs (except spouse)
  if (fCmp(residue, ZERO) > 0) {
    const raddHeirs = heirs.filter((h) => h.key !== "husband" && h.key !== "wives");
    if (raddHeirs.length > 0) {
      const raddBase = raddHeirs.reduce((s, h) => fAdd(s, h.share), ZERO);
      raddHeirs.forEach((h) => {
        h.share = fAdd(h.share, fMul(residue, fDiv(h.share, raddBase)));
        h.radd = true;
      });
      notes.push("Radd applied: the surplus after fixed shares returns to the blood-relative heirs in proportion to their shares (the spouse does not partake in radd in the majority view).");
    } else if (spouses > 0) {
      heirs.forEach((h) => { if (h.key === "husband" || h.key === "wives") h.share = fAdd(h.share, residue); });
      notes.push("No other eligible heirs: the surplus returns to the spouse (the position applied in most modern codes when the treasury/bayt al-mal is not operative).");
    } else {
      notes.push("Surplus of " + fStr(residue) + " has no listed heir — it would pass to more distant relatives (dhawu al-arham) or the community treasury. Consult a scholar.");
    }
    residue = ZERO;
  }

  if (heirs.length === 0) {
    notes.push("No eligible heirs entered — the estate would pass to more distant relatives (dhawu al-arham) or the community treasury.");
  }

  // per-person share for grouped heirs
  heirs.forEach((h) => { h.each = h.count > 1 ? fDiv(h.share, F(h.count, 1)) : h.share; });

  return { heirs, notes };
}

/* Estate math: funeral & debts first, then bequest capped at 1/3 of the net. */
function computeEstate(gross, funeral, debts, bequest) {
  const net = Math.max(0, (gross || 0) - (funeral || 0) - (debts || 0));
  const bequestMax = net / 3;
  const bequestApplied = Math.min(Math.max(0, bequest || 0), bequestMax);
  return {
    net,
    bequestMax,
    bequestApplied,
    bequestCapped: (bequest || 0) > bequestMax + 1e-9,
    distributable: net - bequestApplied,
  };
}

/* expose for browser + node tests */
if (typeof module !== "undefined") {
  module.exports = { computeFaraid, computeEstate, F, fStr, fCmp, fAdd, fMul, fDiv, ONE };
}
