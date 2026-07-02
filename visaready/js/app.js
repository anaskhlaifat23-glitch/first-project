/* VisaReady — Schengen rejection-risk checker.
   100% client-side: answers never leave the browser. */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  /* ---------- populate selects ---------- */

  function fillSelects() {
    const nat = $("nationality");
    NATIONALITIES.forEach((n) => {
      const o = document.createElement("option");
      o.value = n.code;
      o.textContent = n.name + " — ~" + n.rate + "% refused";
      nat.appendChild(o);
    });
    const dest = $("destination");
    DESTINATIONS.forEach((d) => {
      const o = document.createElement("option");
      o.value = d.code;
      o.textContent = d.name;
      dest.appendChild(o);
    });
    updateDestNote();
  }

  function destData() {
    return DESTINATIONS.find((d) => d.code === $("destination").value) || DESTINATIONS[0];
  }
  function natData() {
    return NATIONALITIES.find((n) => n.code === $("nationality").value) || NATIONALITIES[0];
  }

  function updateDestNote() {
    const d = destData();
    $("destNote").textContent = "💶 " + d.name + " funds rule: " + d.note +
      (d.min ? " (flat minimum ≈ €" + d.min + ")" : "");
  }

  /* ---------- wizard navigation ---------- */

  let step = 1;
  function goTo(n) {
    step = n;
    document.querySelectorAll(".wstep").forEach((s) => {
      s.classList.toggle("is-active", Number(s.dataset.step) === n);
    });
    document.querySelectorAll(".wp-step").forEach((s) => {
      const sn = Number(s.dataset.step);
      s.classList.toggle("is-active", sn === n);
      s.classList.toggle("is-done", sn < n);
    });
    $("wizard").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- scoring ---------- */

  function requiredFunds(days) {
    const d = destData();
    return Math.max(d.perDay * days, d.min);
  }

  function computeScore() {
    const days = Math.max(1, parseInt($("days").value, 10) || 1);
    const balance = parseFloat($("balance").value) || 0;
    const required = requiredFunds(days);
    const flags = [];
    const fixes = [];

    let score = natData().rate;
    const base = score;

    // funds
    const ratio = required > 0 ? balance / required : 1;
    const fundsRule = RISK_RULES.fundsRatio.find((r) => ratio >= r.min);
    score += fundsRule.delta;
    if (fundsRule.flag) flags.push(fundsRule.flag);
    if (ratio < 1.5) {
      fixes.push("Aim to show at least €" + Math.ceil(required * 1.5).toLocaleString() +
        " (1.5× the ≈€" + Math.ceil(required).toLocaleString() + " requirement) for a comfortable margin.");
    }

    // employment
    const emp = RISK_RULES.employment[$("employment").value];
    score += emp.delta;
    if (emp.flag) { flags.push(emp.flag); fixes.push(emp.flag); }

    // sponsor
    if ($("sponsor").value === "sponsor") {
      score += RISK_RULES.sponsor.delta;
      flags.push(RISK_RULES.sponsor.flag);
      fixes.push(RISK_RULES.sponsor.flag);
    }

    // deposits
    if ($("deposits").value === "yes") {
      score += RISK_RULES.recentDeposits.delta;
      flags.push(RISK_RULES.recentDeposits.flag);
      fixes.push(RISK_RULES.recentDeposits.flag);
    }

    // travel history
    const hist = RISK_RULES.travelHistory[$("history").value];
    score += hist.delta;
    if (hist.flag) { flags.push(hist.flag); fixes.push(hist.flag); }

    // previous rejection
    if ($("rejected").value === "yes") {
      score += RISK_RULES.previousRejection.delta;
      flags.push(RISK_RULES.previousRejection.flag);
      fixes.push(RISK_RULES.previousRejection.flag);
    }

    // ties
    const ties = document.querySelectorAll(".tie:checked").length;
    if (ties === 0) {
      score += 10;
      flags.push(RISK_RULES.ties.noneFlag);
      fixes.push(RISK_RULES.ties.noneFlag);
    } else {
      score += Math.max(ties * RISK_RULES.ties.perTie, RISK_RULES.ties.max);
      fixes.push("Document every tie you selected: official letters, deeds, registrations — copies, translated if not in English/French/destination language.");
    }

    // bookings
    const book = RISK_RULES.bookings[$("bookings").value];
    score += book.delta;
    if (book.flag) { flags.push(book.flag); fixes.push(book.flag); }

    fixes.push("Buy visa-compliant travel insurance (€30,000 minimum) — mandatory; your file is incomplete without the certificate.");

    score = Math.min(90, Math.max(3, Math.round(score)));
    return { score, base, flags, fixes: [...new Set(fixes)], required, balance, days };
  }

  function renderResults(r) {
    $("scoreNum").textContent = r.score;
    const band = RISK_BANDS.find((b) => r.score < b.max);
    const bandEl = $("scoreBand");
    bandEl.textContent = band.label;
    bandEl.className = "gauge-band " + band.cls;
    document.querySelector(".gauge").className = "gauge " + band.cls;
    $("bandAdvice").textContent = band.advice;
    $("baseRate").textContent = "~" + r.base + "%";
    $("direction").textContent = r.score < r.base
      ? "lower your risk below"
      : (r.score > r.base ? "raise your risk above" : "match");

    const d = destData();
    $("fundsBox").innerHTML =
      "<strong>💶 Funds check for " + d.name + " · " + r.days + " days</strong>" +
      "<div class='funds-row'><span>Required (≈)</span><span>€" + Math.ceil(r.required).toLocaleString() + "</span></div>" +
      "<div class='funds-row'><span>You can show</span><span>€" + Math.ceil(r.balance).toLocaleString() + "</span></div>" +
      "<div class='funds-row funds-verdict'><span>Coverage</span><span>" +
      (r.required ? Math.round((r.balance / r.required) * 100) : 100) + "% " +
      (r.balance >= r.required * 1.5 ? "✅ comfortable" : r.balance >= r.required ? "⚠️ minimum met — add margin" : "🚩 below requirement") +
      "</span></div><small>" + d.note + " · Verify with your consulate.</small>";

    const flagList = $("flagList");
    flagList.innerHTML = "";
    if (r.flags.length === 0) {
      flagList.innerHTML = "<li class='no-flags'>No major red flags found in your answers — nice file. Keep every claim documented.</li>";
    } else {
      r.flags.forEach((f) => {
        const li = document.createElement("li");
        li.textContent = f;
        flagList.appendChild(li);
      });
    }

    const fixList = $("fixList");
    fixList.innerHTML = "";
    r.fixes.forEach((f) => {
      const li = document.createElement("li");
      li.textContent = f;
      fixList.appendChild(li);
    });
  }

  /* ---------- modal / monetization placeholders ---------- */

  function initModal() {
    document.querySelectorAll(".checkout-btn").forEach((el) => {
      el.addEventListener("click", (e) => { e.preventDefault(); $("modal").hidden = false; $("waitlistEmail").focus(); });
    });
    // Insurance CTA: replace with your affiliate URL (AXA Schengen / EKTA / VisitorsCoverage)
    $("insuranceCta").addEventListener("click", (e) => {
      if ($("insuranceCta").getAttribute("href") === "#") {
        e.preventDefault();
        $("modal").hidden = false;
      }
    });
    $("modalClose").addEventListener("click", () => { $("modal").hidden = true; });
    $("modal").addEventListener("click", (e) => { if (e.target === $("modal")) $("modal").hidden = true; });
    $("waitlistForm").addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const list = JSON.parse(localStorage.getItem("visaready.waitlist") || "[]");
        list.push({ email: $("waitlistEmail").value, at: new Date().toISOString() });
        localStorage.setItem("visaready.waitlist", JSON.stringify(list));
      } catch (err) {}
      $("waitlistForm").hidden = true;
      $("waitlistDone").hidden = false;
    });
  }

  /* ---------- init ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    fillSelects();
    initModal();
    $("destination").addEventListener("change", updateDestNote);

    document.querySelectorAll(".next-btn").forEach((b) =>
      b.addEventListener("click", () => goTo(step + 1)));
    document.querySelectorAll(".back-btn").forEach((b) =>
      b.addEventListener("click", () => goTo(Math.max(1, step - 1))));

    $("scoreBtn").addEventListener("click", () => {
      renderResults(computeScore());
      goTo(4);
    });
    $("printBtn").addEventListener("click", () => window.print());
  });
})();
