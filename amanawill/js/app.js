/* AmanaWill UI — wires the form to the faraid engine and renders results.
   100% client-side; nothing entered here leaves the browser. */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  function fmt(amount, currency) {
    try {
      return new Intl.NumberFormat("en", { style: "currency", currency, maximumFractionDigits: 0 }).format(amount);
    } catch (e) {
      return currency + " " + Math.round(amount).toLocaleString();
    }
  }

  function readInput() {
    return {
      deceased: $("deceased").value,
      spouses: parseInt($("spouses").value, 10) || 0,
      sons: parseInt($("sons").value, 10) || 0,
      daughters: parseInt($("daughters").value, 10) || 0,
      father: $("father").checked,
      mother: $("mother").checked,
      pgf: $("pgf").checked,
      grandmothers: parseInt($("grandmothers").value, 10) || 0,
      fullBrothers: parseInt($("fullBrothers").value, 10) || 0,
      fullSisters: parseInt($("fullSisters").value, 10) || 0,
      maternalSiblings: parseInt($("maternalSiblings").value, 10) || 0,
    };
  }

  function pct(share) {
    return Math.round((share.n / share.d) * 1000) / 10;
  }

  function render() {
    const input = readInput();
    const cur = $("currency").value;
    const estate = computeEstate(
      parseFloat($("estate").value) || 0,
      0,
      parseFloat($("debts").value) || 0,
      parseFloat($("bequest").value) || 0
    );
    const result = computeFaraid(input);

    // estate summary
    let summary =
      row("Net estate (after debts)", fmt(estate.net, cur)) +
      (estate.bequestApplied > 0
        ? row("Wasiyyah honoured" + (estate.bequestCapped ? " (capped at 1/3)" : ""), "− " + fmt(estate.bequestApplied, cur))
        : "") +
      row("<strong>Distributed to heirs</strong>", "<strong>" + fmt(estate.distributable, cur) + "</strong>");
    if (estate.bequestCapped) {
      summary += "<p class='cap-warn'>⚠️ Your bequest exceeds the Shariah maximum of one-third of the net estate (" +
        fmt(estate.bequestMax, cur) + "). Amounts above 1/3 require the heirs' consent after death — the calculator applied the 1/3 cap.</p>";
    }
    $("estateSummary").innerHTML = summary;

    // shares
    const wrap = $("shares");
    wrap.innerHTML = "";
    if (result.heirs.length === 0) {
      wrap.innerHTML = "<p class='no-heirs'>No eligible heirs entered — add your family members above.</p>";
    }
    result.heirs
      .slice()
      .sort((a, b) => b.share.n / b.share.d - a.share.n / a.share.d)
      .forEach((h) => {
        const amount = estate.distributable * (h.share.n / h.share.d);
        const card = document.createElement("div");
        card.className = "share-card";
        card.innerHTML =
          "<div class='share-head'><span class='share-name'>" + h.label + "</span>" +
          "<span class='share-frac'>" + fStr(h.share) + (h.awl ? " ('awl)" : "") + (h.radd ? " (with radd)" : "") + "</span></div>" +
          "<div class='share-bar'><div class='share-fill' style='width:" + Math.min(100, pct(h.share)) + "%'></div></div>" +
          "<div class='share-meta'><span>" + pct(h.share) + "%</span><strong>" + fmt(amount, cur) + "</strong>" +
          (h.count > 1 ? "<span class='share-each'>" + fmt(amount / h.count, cur) + " each</span>" : "") + "</div>" +
          "<div class='share-basis'>" + h.basis + "</div>";
        wrap.appendChild(card);
      });

    // notes
    $("notes").innerHTML = result.notes.length
      ? "<h3>Notes on this case</h3><ul>" + result.notes.map((n) => "<li>" + n + "</li>").join("") + "</ul>"
      : "";

    $("results").hidden = false;
    $("results").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function row(label, value) {
    return "<div class='sum-row'><span>" + label + "</span><span>" + value + "</span></div>";
  }

  /* ---------- modal (checkout placeholder) ---------- */
  function initModal() {
    document.querySelectorAll(".checkout-btn").forEach((el) =>
      el.addEventListener("click", () => { $("modal").hidden = false; $("waitlistEmail").focus(); }));
    $("modalClose").addEventListener("click", () => { $("modal").hidden = true; });
    $("modal").addEventListener("click", (e) => { if (e.target === $("modal")) $("modal").hidden = true; });
    $("waitlistForm").addEventListener("submit", (e) => {
      e.preventDefault();
      try {
        const list = JSON.parse(localStorage.getItem("amanawill.waitlist") || "[]");
        list.push({ email: $("waitlistEmail").value, at: new Date().toISOString() });
        localStorage.setItem("amanawill.waitlist", JSON.stringify(list));
      } catch (err) {}
      $("waitlistForm").hidden = true;
      $("waitlistDone").hidden = false;
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    initModal();
    $("calcBtn").addEventListener("click", render);
    $("printBtn").addEventListener("click", () => window.print());
    $("deceased").addEventListener("change", () => {
      $("spouseLabel").textContent = $("deceased").value === "male" ? "Wives (living)" : "Husband";
      const sel = $("spouses");
      if ($("deceased").value === "female") {
        Array.from(sel.options).forEach((o) => { o.hidden = Number(o.value) > 1; });
        if (Number(sel.value) > 1) sel.value = "1";
      } else {
        Array.from(sel.options).forEach((o) => { o.hidden = false; });
      }
    });
  });
})();
