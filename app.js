/* Mica Interior Project — static app logic */

const COLLECTIONS = [
  {
    id: "sora",
    name: "Sora",
    style: "Japandi",
    finish: "Blockboard · HPL",
    pricePerMeter: 1600000,
    leadWeeks: "3–4 minggu",
    blurb: "Paket ekonomis: blockboard + HPL. Oak hangat, rak terbuka. Cocok budget terkontrol.",
    image: "kitchens/sora.jpg",
    alt: "Kitchen set Sora bergaya japandi dengan kabinet oak dan rak keramik",
  },
  {
    id: "lumen",
    name: "Lumen",
    style: "Modern",
    finish: "PVC · HPL",
    pricePerMeter: 3700000,
    leadWeeks: "5–6 minggu",
    blurb: "PVC anti-rayap + HPL. Slab putih handleless, profil tipis. Tahan lembap dapur.",
    image: "kitchens/lumen.jpg",
    alt: "Kitchen set Lumen modern putih handleless dengan marmer dan keran hitam",
  },
  {
    id: "arka",
    name: "Arka",
    style: "Industrial",
    finish: "Multiplek · HPL",
    pricePerMeter: 1800000,
    leadWeeks: "4–5 minggu",
    blurb: "Paket standar: multiplek + HPL. Walnut asap, tegas dan tahan lama.",
    image: "kitchens/arka.jpg",
    alt: "Kitchen set Arka walnut gelap dengan granit hitam dan lampu gantung industrial",
  },
  {
    id: "mira",
    name: "Mira",
    style: "Klasik",
    finish: "Duco",
    pricePerMeter: 2800000,
    leadWeeks: "5–6 minggu",
    blurb: "Paket premium duco. Shaker krem, island kayu. Finishing mulus tanpa sambungan HPL.",
    image: "kitchens/mira.jpg",
    alt: "Kitchen set Mira klasik krem dengan pintu shaker dan island kayu",
  },
  {
    id: "sage",
    name: "Sage",
    style: "Tropis",
    finish: "Duco",
    pricePerMeter: 3000000,
    leadWeeks: "5–6 minggu",
    blurb: "Premium duco hijau sage matte. Cocok rumah yang banyak cahaya.",
    image: "kitchens/sage.jpg",
    alt: "Kitchen set Sage hijau sage dengan rak oak dan lantai terakota",
  },
  {
    id: "batu",
    name: "Batu",
    style: "Modern",
    finish: "Multiplek · HPL+",
    pricePerMeter: 2000000,
    leadWeeks: "4–5 minggu",
    blurb: "Paket menengah: multiplek + HPL lebih baik. Abu batu, quiet luxury untuk dapur compact.",
    image: "kitchens/batu.jpg",
    alt: "Kitchen set Batu charcoal dengan counter kuarsa dan kaca fluted",
  },
];

const STYLES = ["Semua", "Japandi", "Modern", "Industrial", "Klasik", "Tropis"];

const LAYOUTS = [
  { id: "lurus", label: "Lurus", hint: "Satu dinding" },
  { id: "l", label: "Huruf L", hint: "Sudut dapur" },
  { id: "u", label: "Huruf U", hint: "Tiga sisi" },
  { id: "paralel", label: "Paralel", hint: "Dua baris" },
  { id: "pulau", label: "Pulau", hint: "Plus island" },
];

const MIN_LENGTH = 1.5;
const MAX_LENGTH = 12;
const STEP = 0.5;

const WHATSAPP_NUMBER = "6285122674950";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const INSTAGRAM_HANDLE = "micainteriorproject";
const INSTAGRAM_URL = `https://www.instagram.com/${INSTAGRAM_HANDLE}/`;
const INSTAGRAM_DM_URL = `https://ig.me/m/${INSTAGRAM_HANDLE}`;

const state = {
  style: "Semua",
  collectionId: COLLECTIONS[0].id,
  layout: "lurus",
  lengthM: 3,
  name: "",
  city: "",
  notes: "",
  draft: null,
  copied: false,
};

function formatRupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatLength(value) {
  return value.toLocaleString("id-ID", {
    minimumFractionDigits: value % 1 === 0 ? 0 : 1,
    maximumFractionDigits: 1,
  });
}

function clampLength(value) {
  const snapped = Math.round(value / STEP) * STEP;
  return Math.min(MAX_LENGTH, Math.max(MIN_LENGTH, snapped));
}

function getCollection(id) {
  return COLLECTIONS.find((c) => c.id === id) || COLLECTIONS[0];
}

function getLayout(id) {
  return LAYOUTS.find((l) => l.id === id) || LAYOUTS[0];
}

function estimatePrice(pricePerMeter, lengthM) {
  const meters = Math.round(lengthM * 2) / 2;
  return Math.round(pricePerMeter * meters);
}

function buildOrderMessage() {
  const collection = getCollection(state.collectionId);
  const layout = getLayout(state.layout);
  const estimate = estimatePrice(collection.pricePerMeter, state.lengthM);
  const length = formatLength(state.lengthM);
  const notes = state.notes.trim() || "—";

  return [
    "Halo Mica Interior Project, saya ingin pesan kitchen set.",
    "",
    `Nama: ${state.name.trim()}`,
    `Kota: ${state.city.trim()}`,
    `Koleksi: ${collection.name} — ${collection.style} (${collection.finish})`,
    `Layout: ${layout.label}`,
    `Panjang kabinet: ${length} m`,
    `Estimasi: ${formatRupiah(estimate)}`,
    `Catatan: ${notes}`,
    "",
    "Mohon info ketersediaan survey dan jadwal pengerjaan.",
  ].join("\n");
}

function whatsappOrderUrl(message) {
  return `${WHATSAPP_URL}?text=${encodeURIComponent(message)}`;
}

async function copyText(value) {
  try {
    await navigator.clipboard.writeText(value);
    return true;
  } catch {
    // Fallback for older browsers
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      document.body.removeChild(ta);
      return true;
    } catch {
      document.body.removeChild(ta);
      return false;
    }
  }
}

function layoutIcon(type) {
  const paths = {
    lurus: '<rect x="4" y="13" width="24" height="6" rx="1"/>',
    l: '<rect x="4" y="18" width="24" height="6" rx="1"/><rect x="4" y="8" width="6" height="16" rx="1"/>',
    u: '<rect x="4" y="20" width="24" height="6" rx="1"/><rect x="4" y="8" width="6" height="18" rx="1"/><rect x="22" y="8" width="6" height="18" rx="1"/>',
    paralel: '<rect x="4" y="7" width="24" height="6" rx="1"/><rect x="4" y="19" width="24" height="6" rx="1"/>',
    pulau: '<rect x="4" y="7" width="24" height="5" rx="1"/><rect x="10" y="18" width="12" height="7" rx="1"/>',
  };
  return `<svg viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">${paths[type] || ""}</svg>`;
}

function scrollToOrder() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById("pesan")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
}

/* —— Render —— */

function renderStyleFilters() {
  const el = document.getElementById("style-filters");
  el.innerHTML = STYLES.map(
    (s) =>
      `<button type="button" data-style="${s}" class="${s === state.style ? "active" : ""}">${s}</button>`
  ).join("");

  el.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.style = btn.dataset.style;
      renderStyleFilters();
      renderCollections();
    });
  });
}

function renderCollections() {
  const el = document.getElementById("collection-grid");
  const items = COLLECTIONS.filter(
    (c) => state.style === "Semua" || c.style === state.style
  );

  el.innerHTML = items
    .map((item) => {
      const active = state.collectionId === item.id;
      return `
        <article class="card ${active ? "active" : ""}" data-id="${item.id}">
          <div class="card-photo">
            <img src="${item.image}" alt="${item.alt}" loading="lazy" />
            <span class="card-badge">${item.style}</span>
          </div>
          <div class="card-body">
            <div class="card-top">
              <div>
                <h3>${item.name}</h3>
                <p class="card-meta">${item.finish} · ${item.leadWeeks}</p>
              </div>
              <p class="card-price">
                ${formatRupiah(item.pricePerMeter)}
                <span>/ meter</span>
              </p>
            </div>
            <p class="card-blurb">${item.blurb}</p>
            <button type="button" class="btn ${active ? "btn-primary" : "btn-outline"}" data-select="${item.id}">
              ${active ? "Dipilih · lanjut pesan" : "Pesan koleksi ini"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  el.querySelectorAll("[data-select]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.collectionId = btn.dataset.select;
      document.getElementById("koleksi-select").value = state.collectionId;
      renderCollections();
      updateSummary();
      scrollToOrder();
    });
  });
}

function renderSelect() {
  const sel = document.getElementById("koleksi-select");
  sel.innerHTML = COLLECTIONS.map(
    (c) =>
      `<option value="${c.id}">${c.name} · ${c.style} · ${formatRupiah(c.pricePerMeter)}/m</option>`
  ).join("");
  sel.value = state.collectionId;
  sel.addEventListener("change", () => {
    state.collectionId = sel.value;
    renderCollections();
    updateSummary();
  });
}

function renderLayouts() {
  const el = document.getElementById("layout-grid");
  el.innerHTML = LAYOUTS.map((item) => {
    const active = state.layout === item.id;
    return `
      <button type="button" class="layout-btn ${active ? "active" : ""}" data-layout="${item.id}">
        ${layoutIcon(item.id)}
        <span>${item.label}</span>
        <small>${item.hint}</small>
      </button>
    `;
  }).join("");

  el.querySelectorAll("[data-layout]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.layout = btn.dataset.layout;
      renderLayouts();
      updateSummary();
    });
  });
}

function updateLengthDisplay() {
  document.getElementById("length-display").textContent = formatLength(state.lengthM) + " m";
  document.getElementById("panjang").value = state.lengthM;
  updateSummary();
}

function updateSummary() {
  const collection = getCollection(state.collectionId);
  const layout = getLayout(state.layout);
  const estimate = estimatePrice(collection.pricePerMeter, state.lengthM);
  const lengthLabel = formatLength(state.lengthM);

  document.getElementById("summary-img").src = collection.image;
  document.getElementById("summary-img").alt = collection.alt;
  document.getElementById("summary-name").textContent = collection.name;
  document.getElementById("summary-meta").textContent =
    `${collection.style} · ${collection.finish} · ${layout.label}`;
  document.getElementById("summary-price").textContent = formatRupiah(estimate);
  document.getElementById("summary-hint").textContent =
    `${lengthLabel} m × ${formatRupiah(collection.pricePerMeter)}. Belum termasuk top table, ongkir, dan pekerjaan sipil. Harga final setelah survey.`;

  const draftBox = document.getElementById("draft-box");
  const empty = document.getElementById("summary-empty");

  if (state.draft) {
    draftBox.hidden = false;
    empty.hidden = true;
    document.getElementById("draft-text").textContent = state.draft;
    document.getElementById("draft-status-text").textContent = state.copied
      ? "Ringkasan sudah disalin"
      : "Salin ringkasan, lalu buka DM";
  } else {
    draftBox.hidden = true;
    empty.hidden = false;
  }
}

function initLengthControls() {
  document.getElementById("length-minus").addEventListener("click", () => {
    state.lengthM = clampLength(state.lengthM - STEP);
    updateLengthDisplay();
  });
  document.getElementById("length-plus").addEventListener("click", () => {
    state.lengthM = clampLength(state.lengthM + STEP);
    updateLengthDisplay();
  });
  document.getElementById("panjang").addEventListener("change", (e) => {
    const next = Number(e.target.value);
    if (Number.isFinite(next)) {
      state.lengthM = clampLength(next);
      updateLengthDisplay();
    }
  });
}

function validateOrderForm() {
  const errorNama = document.getElementById("error-nama");
  const errorKota = document.getElementById("error-kota");
  const inputNama = document.getElementById("nama");
  const inputKota = document.getElementById("kota");
  let ok = true;

  if (state.name.trim().length < 2) {
    errorNama.textContent = "Isi nama lengkap.";
    errorNama.hidden = false;
    inputNama.setAttribute("aria-invalid", "true");
    ok = false;
  } else {
    errorNama.hidden = true;
    inputNama.removeAttribute("aria-invalid");
  }

  if (state.city.trim().length < 2) {
    errorKota.textContent = "Isi kota atau area.";
    errorKota.hidden = false;
    inputKota.setAttribute("aria-invalid", "true");
    ok = false;
  } else {
    errorKota.hidden = true;
    inputKota.removeAttribute("aria-invalid");
  }

  return ok;
}

async function handleOrder(channel) {
  if (!validateOrderForm()) return;

  const message = buildOrderMessage();
  const copied = await copyText(message);
  state.draft = message;
  state.copied = copied;
  updateSummary();

  const btnWa = document.getElementById("btn-wa");
  const btnIg = document.getElementById("btn-dm");
  if (btnWa) btnWa.href = whatsappOrderUrl(message);
  if (btnIg) btnIg.href = INSTAGRAM_DM_URL;

  if (channel === "whatsapp") {
    window.open(whatsappOrderUrl(message), "_blank", "noopener,noreferrer");
  } else if (channel === "instagram") {
    window.open(INSTAGRAM_DM_URL, "_blank", "noopener,noreferrer");
  }
}

function initForm() {
  document.getElementById("nama").addEventListener("input", (e) => {
    state.name = e.target.value;
  });
  document.getElementById("kota").addEventListener("input", (e) => {
    state.city = e.target.value;
  });
  document.getElementById("catatan").addEventListener("input", (e) => {
    state.notes = e.target.value;
  });

  document.getElementById("order-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  document.getElementById("btn-order-wa")?.addEventListener("click", (e) => {
    e.preventDefault();
    handleOrder("whatsapp");
  });

  document.getElementById("btn-order-ig")?.addEventListener("click", (e) => {
    e.preventDefault();
    handleOrder("instagram");
  });

  document.getElementById("btn-recopy")?.addEventListener("click", async () => {
    if (!state.draft) return;
    state.copied = await copyText(state.draft);
    updateSummary();
  });
}

/* —— Boot —— */
renderStyleFilters();
renderCollections();
renderSelect();
renderLayouts();
initLengthControls();
initForm();
updateLengthDisplay();
updateSummary();
