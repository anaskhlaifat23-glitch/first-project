const { computeFaraid, computeEstate, fStr } = require('../js/faraid.js');

const base = { deceased: "male", spouses: 0, sons: 0, daughters: 0, father: false, mother: false,
  pgf: false, grandmothers: 0, fullBrothers: 0, fullSisters: 0, maternalSiblings: 0 };

function run(name, input, expected) {
  const r = computeFaraid({ ...base, ...input });
  const got = {};
  r.heirs.forEach((h) => { got[h.key] = fStr(h.share); });
  const ok = Object.entries(expected).every(([k, v]) => got[k] === v) &&
    Object.keys(got).length === Object.keys(expected).length;
  console.log((ok ? "PASS" : "FAIL") + "  " + name);
  if (!ok) console.log("   expected", expected, "\n   got     ", got, "\n   notes:", r.notes);
  return ok;
}

let all = true;

// 1. 'Umariyyah I: husband + father + mother → 1/2, 1/3, 1/6
all &= run("Umariyyah I (husband, father, mother)",
  { deceased: "female", spouses: 1, father: true, mother: true },
  { husband: "1/2", mother: "1/6", father: "1/3" });

// 2. 'Umariyyah II: wife + father + mother → 1/4, 1/2, 1/4
all &= run("Umariyyah II (wife, father, mother)",
  { deceased: "male", spouses: 1, father: true, mother: true },
  { wives: "1/4", mother: "1/4", father: "1/2" });

// 3. wife + 2 sons + 1 daughter → wife 1/8; sons 7/20 total each... total sons 2*(7/40*2)= 7/10*... parts=5, sons total 7/8*4/5 = 7/10, daughter 7/40
all &= run("Wife + 2 sons + 1 daughter",
  { deceased: "male", spouses: 1, sons: 2, daughters: 1 },
  { wives: "1/8", sons: "7/10", daughters: "7/40" });

// 4. 'Awl: husband + 2 full sisters → 1/2 + 2/3 = 7/6 → husband 3/7, sisters 4/7
all &= run("'Awl (husband + 2 full sisters)",
  { deceased: "female", spouses: 1, fullSisters: 2 },
  { husband: "3/7", sisters: "4/7" });

// 5. Radd: daughter + mother → 1/2,1/6 → radd → 3/4, 1/4
all &= run("Radd (daughter + mother)",
  { deceased: "male", daughters: 1, mother: true },
  { daughters: "3/4", mother: "1/4" });

// 6. Daughter + father → daughter 1/2, father 1/6 + residue = 1/2
all &= run("Daughter + father",
  { deceased: "male", daughters: 1, father: true },
  { daughters: "1/2", father: "1/2" });

// 7. Mother + 2 maternal siblings + full brother → mother 1/6, maternal 1/3, brother 1/2
all &= run("Mother + 2 maternal sibs + full brother",
  { deceased: "male", mother: true, maternalSiblings: 2, fullBrothers: 1 },
  { mother: "1/6", maternal: "1/3", brothers: "1/2" });

// 8. Spouse-only radd: wife alone → everything
all &= run("Wife only (spouse radd)",
  { deceased: "male", spouses: 1 },
  { wives: "1" });

// 9. Blocking: father blocks grandfather & siblings; son blocks siblings
all &= run("Father blocks PGF and siblings (son present)",
  { deceased: "male", spouses: 1, sons: 1, father: true, pgf: true, fullBrothers: 2 },
  { wives: "1/8", father: "1/6", sons: "17/24" });

// 10. 2 daughters + mother + father → 2/3 + 1/6 + 1/6 = 1 exactly
all &= run("2 daughters + mother + father",
  { deceased: "male", daughters: 2, mother: true, father: true },
  { daughters: "2/3", mother: "1/6", father: "1/6" });

// 11. Sisters as 'asaba ma'a al-ghayr: daughter + full sister → 1/2 + residue 1/2
all &= run("Daughter + full sister ('asaba ma'a al-ghayr)",
  { deceased: "male", daughters: 1, fullSisters: 1 },
  { daughters: "1/2", sisters: "1/2" });

// 12. Grandmother blocked by mother
all &= run("Grandmother blocked by mother",
  { deceased: "male", mother: true, grandmothers: 1, sons: 1 },
  { mother: "1/6", sons: "5/6" });

// estate math
const e = computeEstate(120000, 2000, 18000, 50000);
const eOk = e.net === 100000 && Math.abs(e.bequestApplied - 100000 / 3) < 1e-6 && e.bequestCapped === true;
console.log((eOk ? "PASS" : "FAIL") + "  Estate math (bequest capped at 1/3)");
all &= eOk;

console.log(all ? "\nALL TESTS PASSED" : "\nSOME TESTS FAILED");
process.exit(all ? 0 : 1);
