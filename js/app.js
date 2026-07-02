/* Fawtara — bilingual invoice generator.
   100% client-side: no backend, no tracking, data stays in the browser. */

(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);

  const els = {
    sellerName: $("sellerName"), sellerVat: $("sellerVat"), sellerAddress: $("sellerAddress"),
    country: $("country"), currency: $("currency"),
    clientName: $("clientName"), clientVat: $("clientVat"), clientAddress: $("clientAddress"),
    invNumber: $("invNumber"), issueDate: $("issueDate"), dueDate: $("dueDate"),
    items: $("items"), discount: $("discount"), vatRate: $("vatRate"), notes: $("notes"),
  };

  const STORE = {
    profile: "fawtara.profile",
    draft: "fawtara.draft",
    counter: "fawtara.counter",
    waitlist: "fawtara.waitlist",
  };

  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key)); } catch (e) { return null; }
  }
  function lsSet(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
  }

  /* ---------- line items ---------- */

  function itemPlaceholder() {
    return (I18N[currentLang()] || I18N.en)["item.desc"];
  }

  function addItemRow(desc = "", qty = 1, price = "") {
    const row = document.createElement("div");
    row.className = "item-row";
    row.innerHTML =
      '<input type="text" class="it-desc" placeholder="">' +
      '<input type="number" class="it-qty" min="0" step="any" value="1">' +
      '<input type="number" class="it-price" min="0" step="any" placeholder="0.00">' +
      '<button type="button" class="remove-item" aria-label="Remove item">✕</button>';
    row.querySelector(".it-desc").value = desc;
    row.querySelector(".it-desc").placeholder = itemPlaceholder();
    row.querySelector(".it-qty").value = qty;
    row.querySelector(".it-price").value = price;
    row.querySelector(".remove-item").addEventListener("click", () => {
      row.remove();
      update();
    });
    els.items.appendChild(row);
  }

  function readItems() {
    return Array.from(els.items.querySelectorAll(".item-row")).map((row) => ({
      desc: row.querySelector(".it-desc").value.trim(),
      qty: parseFloat(row.querySelector(".it-qty").value) || 0,
      price: parseFloat(row.querySelector(".it-price").value) || 0,
    }));
  }

  /* ---------- money ---------- */

  function fmt(amount, currency) {
    try {
      return new Intl.NumberFormat("en", { style: "currency", currency }).format(amount);
    } catch (e) {
      return currency + " " + amount.toFixed(2);
    }
  }

  /* ---------- ZATCA Phase 1 QR (TLV → Base64) ----------
     Tags per ZATCA e-invoicing spec (simplified tax invoices):
     1 = seller name, 2 = VAT registration number,
     3 = invoice timestamp (ISO 8601), 4 = total incl. VAT, 5 = VAT amount. */

  function zatcaBase64(sellerName, vatNumber, isoTimestamp, total, vat) {
    const enc = new TextEncoder();
    const fields = [sellerName, vatNumber, isoTimestamp, total, vat];
    const bytes = [];
    fields.forEach((value, i) => {
      const v = enc.encode(String(value));
      bytes.push(i + 1, v.length, ...v);
    });
    let bin = "";
    bytes.forEach((b) => { bin += String.fromCharCode(b); });
    return btoa(bin);
  }

  let qrInstance = null;
  function renderQR(text) {
    const box = $("qrBox");
    if (!text || typeof QRCode === "undefined") { box.hidden = true; return; }
    box.hidden = false;
    const target = $("qrcode");
    if (!qrInstance) {
      qrInstance = new QRCode(target, { text, width: 96, height: 96, correctLevel: QRCode.CorrectLevel.M });
    } else {
      qrInstance.clear();
      qrInstance.makeCode(text);
    }
  }

  /* ---------- compute + render preview ---------- */

  function collect() {
    return {
      sellerName: els.sellerName.value.trim(),
      sellerVat: els.sellerVat.value.trim(),
      sellerAddress: els.sellerAddress.value.trim(),
      country: els.country.value,
      currency: els.currency.value,
      clientName: els.clientName.value.trim(),
      clientVat: els.clientVat.value.trim(),
      clientAddress: els.clientAddress.value.trim(),
      invNumber: els.invNumber.value.trim(),
      issueDate: els.issueDate.value,
      dueDate: els.dueDate.value,
      discount: parseFloat(els.discount.value) || 0,
      vatRate: parseFloat(els.vatRate.value) || 0,
      notes: els.notes.value.trim(),
      items: readItems(),
    };
  }

  function update() {
    const d = collect();

    $("pSellerName").textContent = d.sellerName || "—";
    $("pSellerAddress").textContent = d.sellerAddress;
    $("pSellerVat").textContent = d.sellerVat ? "VAT الرقم الضريبي: " + d.sellerVat : "";
    $("pClientName").textContent = d.clientName || "—";
    $("pClientAddress").textContent = d.clientAddress;
    $("pClientVat").textContent = d.clientVat ? "VAT الرقم الضريبي: " + d.clientVat : "";
    $("pInvNumber").textContent = d.invNumber || "—";
    $("pIssueDate").textContent = d.issueDate || "—";
    $("pDueDate").textContent = d.dueDate || "—";

    const tbody = $("pItems");
    tbody.innerHTML = "";
    d.items.filter((it) => it.desc || it.price).forEach((it) => {
      const tr = document.createElement("tr");
      const amount = it.qty * it.price;
      const cells = [
        ["td", it.desc || "—", "col-desc"],
        ["td", String(it.qty), "num"],
        ["td", fmt(it.price, d.currency), "num"],
        ["td", fmt(amount, d.currency), "num"],
      ];
      cells.forEach(([tag, text, cls]) => {
        const td = document.createElement(tag);
        td.textContent = text;
        td.className = cls;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });

    const subtotal = d.items.reduce((sum, it) => sum + it.qty * it.price, 0);
    const discountAmt = subtotal * (d.discount / 100);
    const taxable = subtotal - discountAmt;
    const vat = taxable * (d.vatRate / 100);
    const total = taxable + vat;

    $("pSubtotal").textContent = fmt(subtotal, d.currency);
    $("pDiscountRow").hidden = d.discount <= 0;
    $("pDiscount").textContent = "− " + fmt(discountAmt, d.currency);
    $("pVatRate").textContent = String(d.vatRate);
    $("pVat").textContent = fmt(vat, d.currency);
    $("pTotal").textContent = fmt(total, d.currency);

    const notesBox = $("pNotes");
    notesBox.hidden = !d.notes;
    notesBox.textContent = d.notes;

    // ZATCA QR: shown for Saudi sellers with a VAT number
    if (d.country === "SA" && d.sellerName && d.sellerVat) {
      const ts = d.issueDate ? d.issueDate + "T00:00:00Z" : new Date().toISOString();
      renderQR(zatcaBase64(d.sellerName, d.sellerVat, ts, total.toFixed(2), vat.toFixed(2)));
    } else {
      renderQR(null);
    }

    saveState(d);
  }

  /* ---------- persistence ---------- */

  function saveState(d) {
    lsSet(STORE.profile, {
      sellerName: d.sellerName, sellerVat: d.sellerVat, sellerAddress: d.sellerAddress,
      country: d.country, currency: d.currency, notes: d.notes,
    });
    lsSet(STORE.draft, d);
  }

  function nextInvoiceNumber() {
    const n = (lsGet(STORE.counter) || 0) + 1;
    lsSet(STORE.counter, n);
    return "INV-" + new Date().getFullYear() + "-" + String(n).padStart(4, "0");
  }

  function restore() {
    const draft = lsGet(STORE.draft);
    const profile = lsGet(STORE.profile);
    const src = draft || profile;
    if (src) {
      ["sellerName", "sellerVat", "sellerAddress", "clientName", "clientVat", "clientAddress",
       "invNumber", "issueDate", "dueDate", "notes"].forEach((k) => {
        if (src[k] !== undefined && els[k]) els[k].value = src[k];
      });
      if (src.country) els.country.value = src.country;
      if (src.currency) els.currency.value = src.currency;
      if (src.discount !== undefined) els.discount.value = src.discount;
      if (src.vatRate !== undefined) els.vatRate.value = src.vatRate;
    }
    if (draft && Array.isArray(draft.items) && draft.items.length) {
      draft.items.forEach((it) => addItemRow(it.desc, it.qty, it.price));
    } else {
      addItemRow();
    }
    if (!els.invNumber.value) els.invNumber.value = nextInvoiceNumber();
    if (!els.issueDate.value) els.issueDate.value = new Date().toISOString().slice(0, 10);
  }

  function newInvoice() {
    ["clientName", "clientVat", "clientAddress", "dueDate"].forEach((k) => { els[k].value = ""; });
    els.items.innerHTML = "";
    addItemRow();
    els.invNumber.value = nextInvoiceNumber();
    els.issueDate.value = new Date().toISOString().slice(0, 10);
    update();
  }

  /* ---------- country → VAT/currency preset ---------- */

  function applyCountryPreset() {
    const opt = els.country.selectedOptions[0];
    if (!opt) return;
    els.vatRate.value = opt.dataset.vat;
    els.currency.value = opt.dataset.cur;
    update();
  }

  /* ---------- upgrade modal / monetization hooks ----------
     To go live: replace the waitlist with your Lemon Squeezy / Paddle
     checkout overlay — see README "Wiring payments". */

  function openModal() { $("modal").hidden = false; $("waitlistEmail").focus(); }
  function closeModal() { $("modal").hidden = true; }

  function initModal() {
    document.querySelectorAll(".checkout-btn, #logoBtn, .wm-remove").forEach((el) => {
      el.addEventListener("click", (e) => { e.preventDefault(); openModal(); });
    });
    $("modalClose").addEventListener("click", closeModal);
    $("modal").addEventListener("click", (e) => { if (e.target === $("modal")) closeModal(); });
    $("waitlistForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const emails = lsGet(STORE.waitlist) || [];
      emails.push({ email: $("waitlistEmail").value, at: new Date().toISOString() });
      lsSet(STORE.waitlist, emails);
      $("waitlistForm").hidden = true;
      $("waitlistDone").hidden = false;
    });
  }

  /* ---------- init ---------- */

  document.addEventListener("DOMContentLoaded", () => {
    applyLang(currentLang());
    restore();
    update();
    initModal();

    document.querySelector(".form-panel").addEventListener("input", update);
    els.country.addEventListener("change", applyCountryPreset);
    $("addItem").addEventListener("click", () => { addItemRow(); update(); });
    $("printBtn").addEventListener("click", () => window.print());
    $("newBtn").addEventListener("click", newInvoice);
    $("langToggle").addEventListener("click", () => {
      applyLang(currentLang() === "ar" ? "en" : "ar");
    });
    document.addEventListener("langchange", () => {
      els.items.querySelectorAll(".it-desc").forEach((input) => {
        input.placeholder = itemPlaceholder();
      });
    });
  });
})();
