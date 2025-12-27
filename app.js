/* =========================
   Vacation Planner (Magic Theme)
   - Auto-save (localStorage)
   - Itinerary + add days + filter park
   - Activities (free/paid) checklist add-to-itinerary
   - Dining database + add-to-itinerary
   - Embedded maps
   - Hidden Finds checklist + photo per item
   - Export calendar (.ics) + backup JSON
   ========================= */

const STORAGE_KEY = "vacationPlanner.v1";

/* ---------- Seed Data (edit these to expand, safely) ---------- */

const PARKS = [
  "Magic Kingdom",
  "EPCOT",
  "Hollywood Studios",
  "Animal Kingdom",
  "Disney Springs",
  "Resort Day"
];

const RESORTS = [
  "Select a resort…",
  // Deluxe
  "Grand Floridian Resort",
  "Polynesian Village Resort",
  "Contemporary Resort",
  "Wilderness Lodge",
  "Animal Kingdom Lodge",
  "Beach Club Resort",
  "Yacht Club Resort",
  "BoardWalk Inn",
  // Moderate
  "Caribbean Beach Resort",
  "Coronado Springs Resort",
  "Port Orleans – French Quarter",
  "Port Orleans – Riverside",
  // Value
  "Pop Century Resort",
  "Art of Animation Resort",
  "All-Star Movies Resort",
  "All-Star Music Resort",
  "All-Star Sports Resort",
  // Other
  "Off-Site Hotel"
];

// Dining starter database (expand freely)
const DINING_DB = {
  quick: {
    "Magic Kingdom": [
      { name: "Columbia Harbour House", area: "Liberty Square" },
      { name: "Pecos Bill Tall Tale Inn", area: "Frontierland" },
      { name: "Cosmic Ray’s Starlight Café", area: "Tomorrowland" },
      { name: "Casey’s Corner", area: "Main Street" },
      { name: "Sleepy Hollow", area: "Liberty Square" }
    ],
    "EPCOT": [
      { name: "Connections Eatery", area: "World Celebration" },
      { name: "Sunshine Seasons", area: "The Land" },
      { name: "Regal Eagle Smokehouse", area: "America Pavilion" },
      { name: "Les Halles Boulangerie", area: "France" }
    ],
    "Hollywood Studios": [
      { name: "Woody’s Lunch Box", area: "Toy Story Land" },
      { name: "Docking Bay 7", area: "Galaxy’s Edge" },
      { name: "ABC Commissary", area: "Commissary Lane" },
      { name: "Backlot Express", area: "Echo Lake" }
    ],
    "Animal Kingdom": [
      { name: "Satu’li Canteen", area: "Pandora" },
      { name: "Flame Tree Barbecue", area: "Discovery Island" },
      { name: "Harambe Market", area: "Africa" }
    ]
  },
  table: {
    "Magic Kingdom": [
      { name: "Skipper Canteen", area: "Adventureland" },
      { name: "Liberty Tree Tavern", area: "Liberty Square" },
      { name: "The Crystal Palace", area: "Main Street" },
      { name: "Be Our Guest", area: "Fantasyland" }
    ],
    "EPCOT": [
      { name: "Via Napoli", area: "Italy" },
      { name: "Le Cellier Steakhouse", area: "Canada" },
      { name: "San Angel Inn", area: "Mexico" },
      { name: "Chefs de France", area: "France" }
    ],
    "Hollywood Studios": [
      { name: "Sci-Fi Dine-In Theater", area: "Commissary Lane" },
      { name: "50’s Prime Time Café", area: "Echo Lake" },
      { name: "Hollywood Brown Derby", area: "Hollywood Blvd" }
    ],
    "Animal Kingdom": [
      { name: "Yak & Yeti Restaurant", area: "Asia" },
      { name: "Tiffins", area: "Discovery Island" }
    ]
  }
};

// Activities (not deletable). Add more anytime.
const SEED_ACTIVITIES = {
  free: [
    { title: "Resort pool time / splash pad", park: "Resort Day", cost: 0 },
    { title: "Character sightings (no reservation)", park: "Magic Kingdom", cost: 0 },
    { title: "Street performances / atmosphere", park: "EPCOT", cost: 0 },
    { title: "Fireworks viewing spot (arrive early)", park: "Magic Kingdom", cost: 0 },
    { title: "Photo challenges (family poses)", park: "Hollywood Studios", cost: 0 },
    { title: "Animal trails & exhibits", park: "Animal Kingdom", cost: 0 }
  ],
  paid: [
    { title: "Special dessert / treat budget", park: "Magic Kingdom", cost: 25 },
    { title: "Souvenir budget (ears / shirts)", park: "Disney Springs", cost: 60 },
    { title: "Table-service meal (estimate)", park: "EPCOT", cost: 160 },
    { title: "Mini-golf (estimate)", park: "Resort Day", cost: 80 }
  ]
};

// “Hidden Finds” (your checklist idea). Add many more here safely.
// NOTE: Avoid official branding assets; this is a generic “hidden-shape scavenger list”.
const SEED_HIDDEN_FINDS = [
  { park: "Magic Kingdom", location: "Adventureland walkway", hint: "Look near patterned stonework along the main path." },
  { park: "Magic Kingdom", location: "Haunted ride exit area", hint: "Check decorative molding for a three-circle silhouette." },
  { park: "EPCOT", location: "Near a fountain plaza", hint: "Look for circles hidden inside tile patterns." },
  { park: "Hollywood Studios", location: "Sci-fi themed queue", hint: "A screen graphic may hide a familiar three-circle shape." },
  { park: "Animal Kingdom", location: "Tree carvings area", hint: "Sometimes the shape appears in clusters of circles." },
  { park: "Disney Springs", location: "Outdoor walkway near murals", hint: "Scan repeating art patterns for three-circle groupings." }
];

// Embedded maps (uses Google Maps embed links; safe and easy)
const MAPS = [
  {
    title: "Magic Kingdom",
    embed: "https://www.google.com/maps?q=Magic%20Kingdom%20Park&output=embed",
    open: "https://www.google.com/maps?q=Magic%20Kingdom%20Park"
  },
  {
    title: "EPCOT",
    embed: "https://www.google.com/maps?q=EPCOT&output=embed",
    open: "https://www.google.com/maps?q=EPCOT"
  },
  {
    title: "Hollywood Studios",
    embed: "https://www.google.com/maps?q=Disney%27s%20Hollywood%20Studios&output=embed",
    open: "https://www.google.com/maps?q=Disney%27s%20Hollywood%20Studios"
  },
  {
    title: "Animal Kingdom",
    embed: "https://www.google.com/maps?q=Disney%27s%20Animal%20Kingdom&output=embed",
    open: "https://www.google.com/maps?q=Disney%27s%20Animal%20Kingdom"
  },
  {
    title: "Disney Springs",
    embed: "https://www.google.com/maps?q=Disney%20Springs&output=embed",
    open: "https://www.google.com/maps?q=Disney%20Springs"
  }
];

/* ---------- Helpers ---------- */

const $ = (id) => document.getElementById(id);
const fmtMoney = (n) => {
  const v = Number(n || 0);
  return v.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 });
};
const uid = () => Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.style.opacity = "1";
  setTimeout(() => (el.style.opacity = "0"), 2200);
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  $("saveStatus").textContent = "Saved on this device.";
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/* ---------- State ---------- */

let state = load() || {
  trip: {
    name: "Family Vacation",
    startDate: "",
    endDate: "",
    resort: RESORTS[0],
    partySize: 4,
    budget: 2500,
    welcomeMsg: "Welcome! Let’s plan your trip ✨"
  },
  filterPark: "",
  days: [
    { id: uid(), label: "Day 1", park: "Magic Kingdom" },
    { id: uid(), label: "Day 2", park: "EPCOT" }
  ],
  itinerary: [
    { id: uid(), dayId: null, time: "08:00", park: "Magic Kingdom", plan: "Rope drop + photos", dining: "", cost: 0 },
    { id: uid(), dayId: null, time: "12:30", park: "Magic Kingdom", plan: "Lunch plan", dining: "Quick Service", cost: 0 }
  ],
  packing: [],
  notes: "",
  activities: {
    free: SEED_ACTIVITIES.free.map(a => ({ id: uid(), ...a })),
    paid: SEED_ACTIVITIES.paid.map(a => ({ id: uid(), ...a }))
  },
  hiddenFinds: SEED_HIDDEN_FINDS.map(h => ({ id: uid(), ...h, found: false, photo: "" })),
  ui: {
    tab: "itinerary",
    activitySeg: "free",
    selectedActivityId: "",
    selectedDiningKey: "",
    selectedHiddenId: ""
  }
};

// attach dayId for initial items if missing
(function fixInitialDayIds() {
  const firstDay = state.days[0]?.id || null;
  state.itinerary = state.itinerary.map((it, i) => ({
    ...it,
    dayId: it.dayId || firstDay
  }));
})();

/* ---------- DOM Fillers ---------- */

function fillSelect(el, options, { includeAll = false, allLabel = "All Parks" } = {}) {
  el.innerHTML = "";
  if (includeAll) {
    const opt = document.createElement("option");
    opt.value = "";
    opt.textContent = allLabel;
    el.appendChild(opt);
  }
  for (const o of options) {
    const opt = document.createElement("option");
    opt.value = o.value ?? o;
    opt.textContent = o.label ?? o;
    el.appendChild(opt);
  }
}

function dayLabel(dayId) {
  return state.days.find(d => d.id === dayId)?.label || "Day";
}

/* ---------- Rendering ---------- */

function renderTrip() {
  $("tripName").value = state.trip.name;
  $("startDate").value = state.trip.startDate;
  $("endDate").value = state.trip.endDate;
  $("partySize").value = state.trip.partySize;
  $("budget").value = state.trip.budget;
  $("welcomeMsg").value = state.trip.welcomeMsg;

  // hero
  $("heroWelcome").textContent = state.trip.welcomeMsg?.trim() || "Welcome! ✨";
  $("heroDates").textContent = `Dates: ${state.trip.startDate || "—"} → ${state.trip.endDate || "—"}`;
  $("heroResort").textContent = `Resort: ${state.trip.resort && state.trip.resort !== "Select a resort…" ? state.trip.resort : "—"}`;
  $("heroParty").textContent = `Party: ${state.trip.partySize || "—"}`;

  // stats
  const items = state.itinerary.length;
  const cost = state.itinerary.reduce((s, x) => s + Number(x.cost || 0), 0);
  const budget = Number(state.trip.budget || 0);
  const left = budget - cost;

  $("statItems").textContent = String(items);
  $("statCost").textContent = fmtMoney(cost);
  $("statLeft").textContent = fmtMoney(left);
}

function renderItinerary() {
  const body = $("itineraryBody");
  body.innerHTML = "";

  const rows = state.itinerary
    .filter(it => !state.filterPark || it.park === state.filterPark)
    .map(it => {
      const tr = document.createElement("tr");

      // Day
      const tdDay = document.createElement("td");
      const selDay = document.createElement("select");
      fillSelect(selDay, state.days.map(d => ({ value: d.id, label: `${d.label} (${d.park})` })));
      selDay.value = it.dayId || state.days[0]?.id || "";
      selDay.addEventListener("change", () => {
        it.dayId = selDay.value;
        save();
        renderAll();
      });
      tdDay.appendChild(selDay);

      // Time
      const tdTime = document.createElement("td");
      const inpTime = document.createElement("input");
      inpTime.type = "time";
      inpTime.value = it.time || "08:00";
      inpTime.addEventListener("change", () => {
        it.time = inpTime.value;
        save();
      });
      tdTime.appendChild(inpTime);

      // Park
      const tdPark = document.createElement("td");
      const selPark = document.createElement("select");
      fillSelect(selPark, PARKS);
      selPark.value = it.park || "Magic Kingdom";
      selPark.addEventListener("change", () => {
        it.park = selPark.value;
        save();
        renderAll();
      });
      tdPark.appendChild(selPark);

      // Plan
      const tdPlan = document.createElement("td");
      const inpPlan = document.createElement("input");
      inpPlan.type = "text";
      inpPlan.value = it.plan || "";
      inpPlan.placeholder = "What are you doing?";
      inpPlan.addEventListener("input", () => {
        it.plan = inpPlan.value;
        save();
      });
      tdPlan.appendChild(inpPlan);

      // Dining
      const tdDining = document.createElement("td");
      const selDining = document.createElement("select");
      fillSelect(selDining, [
        { value: "", label: "—" },
        { value: "Quick Service", label: "Quick Service" },
        { value: "Table Service", label: "Table Service" },
        { value: "Snack", label: "Snack / Treat" }
      ]);
      selDining.value = it.dining || "";
      selDining.addEventListener("change", () => {
        it.dining = selDining.value;
        save();
      });
      tdDining.appendChild(selDining);

      // Cost
      const tdCost = document.createElement("td");
      const inpCost = document.createElement("input");
      inpCost.type = "number";
      inpCost.min = "0";
      inpCost.step = "1";
      inpCost.value = Number(it.cost || 0);
      inpCost.addEventListener("change", () => {
        it.cost = clamp(Number(inpCost.value || 0), 0, 999999);
        save();
        renderTrip();
      });
      tdCost.appendChild(inpCost);

      // Actions
      const tdAct = document.createElement("td");
      tdAct.className = "cellActions";
      const btnDup = document.createElement("button");
      btnDup.className = "iconBtn";
      btnDup.textContent = "Duplicate";
      btnDup.addEventListener("click", () => {
        state.itinerary.push({ ...it, id: uid() });
        save();
        renderAll();
        toast("Duplicated.");
      });

      const btnDel = document.createElement("button");
      btnDel.className = "iconBtn danger";
      btnDel.textContent = "Delete";
      btnDel.addEventListener("click", () => {
        state.itinerary = state.itinerary.filter(x => x.id !== it.id);
        save();
        renderAll();
        toast("Deleted.");
      });

      tdAct.appendChild(btnDup);
      tdAct.appendChild(btnDel);

      tr.appendChild(tdDay);
      tr.appendChild(tdTime);
      tr.appendChild(tdPark);
      tr.appendChild(tdPlan);
      tr.appendChild(tdDining);
      tr.appendChild(tdCost);
      tr.appendChild(tdAct);

      return tr;
    });

  for (const tr of rows) body.appendChild(tr);
}

function renderPacking() {
  const list = $("packList");
  list.innerHTML = "";
  for (const item of state.packing) {
    const row = document.createElement("div");
    row.className = "checkItem";

    const left = document.createElement("div");
    left.className = "checkLeft";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!item.done;
    cb.addEventListener("change", () => {
      item.done = cb.checked;
      save();
    });
    const text = document.createElement("div");
    const t1 = document.createElement("div");
    t1.className = "checkText";
    t1.textContent = item.text;
    const t2 = document.createElement("div");
    t2.className = "checkSub";
    t2.textContent = item.done ? "Packed" : "Not packed";
    text.appendChild(t1);
    text.appendChild(t2);

    left.appendChild(cb);
    left.appendChild(text);

    const right = document.createElement("div");
    right.className = "checkRight";
    const del = document.createElement("button");
    del.className = "iconBtn danger";
    del.textContent = "Remove";
    del.addEventListener("click", () => {
      state.packing = state.packing.filter(x => x.id !== item.id);
      save();
      renderPacking();
    });
    right.appendChild(del);

    row.appendChild(left);
    row.appendChild(right);
    list.appendChild(row);
  }

  // Tips
  const tips = [
    "Bring a small poncho + a zip bag for phones.",
    "Pack sunscreen + blister bandaids in your day bag.",
    "Refillable water bottle saves money.",
    "Portable charger = hero move.",
    "Set a meeting spot in case someone gets separated."
  ];
  const ul = $("packTips");
  ul.innerHTML = "";
  tips.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    ul.appendChild(li);
  });
}

function renderNotes() {
  $("notesText").value = state.notes || "";
  const reminder = [
    "Take a mid-day break if anyone gets cranky.",
    "Snack + water solves 70% of problems.",
    "Early photos = best lighting + less crowds.",
    "Pick 1–2 must-dos per day; everything else is bonus."
  ];
  const wrap = $("reminders");
  wrap.innerHTML = "";
  reminder.forEach(r => {
    const div = document.createElement("div");
    div.className = "callout";
    div.textContent = r;
    wrap.appendChild(div);
  });
}

function renderActivities() {
  const seg = state.ui.activitySeg;
  const list = $("activityList");
  list.innerHTML = "";

  const items = state.activities[seg];
  $("activityTitle").textContent = seg === "free" ? "Free Activities" : "Activities That Cost Money";

  items.forEach(a => {
    const card = document.createElement("div");
    card.className = "activityCard" + (state.ui.selectedActivityId === a.id ? " active" : "");
    card.addEventListener("click", () => {
      state.ui.selectedActivityId = a.id;
      save();
      renderActivities();
      $("actSelectedInfo").textContent = `Selected: ${a.title}`;
    });

    const name = document.createElement("div");
    name.className = "activityName";
    name.textContent = a.title;

    const meta = document.createElement("div");
    meta.className = "activityMeta";
    meta.textContent = `${a.park} • ${a.cost ? fmtMoney(a.cost) : "Free"}`;

    card.appendChild(name);
    card.appendChild(meta);
    list.appendChild(card);
  });

  fillSelect($("actDay"), state.days.map(d => ({ value: d.id, label: `${d.label} (${d.park})` })));
  fillSelect($("actPark"), PARKS);
}

function currentDiningList() {
  const park = $("diningPark").value;
  const type = $("diningType").value;
  const q = $("diningSearch").value.trim().toLowerCase();
  const src = DINING_DB[type][park] || [];
  return src.filter(x => !q || x.name.toLowerCase().includes(q));
}

function renderDining() {
  fillSelect($("diningPark"), ["Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom"]);
  fillSelect($("dinPark"), PARKS);
  fillSelect($("dinDay"), state.days.map(d => ({ value: d.id, label: `${d.label} (${d.park})` })));

  const list = $("diningList");
  list.innerHTML = "";

  const type = $("diningType").value;
  const park = $("diningPark").value;

  const items = currentDiningList();
  items.forEach(x => {
    const key = `${type}::${park}::${x.name}`;
    const card = document.createElement("div");
    card.className = "diningCard" + (state.ui.selectedDiningKey === key ? " active" : "");
    card.addEventListener("click", () => {
      state.ui.selectedDiningKey = key;
      save();
      renderDining();
      $("dinSelectedInfo").textContent = `Selected: ${x.name}`;
    });

    const name = document.createElement("div");
    name.className = "diningName";
    name.textContent = x.name;

    const sub = document.createElement("div");
    sub.className = "diningSub";
    sub.textContent = `${park} • ${type === "quick" ? "Quick Service" : "Table Service"} • ${x.area || "Area"}`;

    card.appendChild(name);
    card.appendChild(sub);
    list.appendChild(card);
  });
}

function renderMaps() {
  const grid = $("mapsGrid");
  grid.innerHTML = "";
  MAPS.forEach(m => {
    const card = document.createElement("div");
    card.className = "mapCard";

    const title = document.createElement("div");
    title.className = "mapTitle";
    title.textContent = m.title;

    const frameWrap = document.createElement("div");
    frameWrap.className = "mapFrame";

    const iframe = document.createElement("iframe");
    iframe.title = `${m.title} map`;
    iframe.src = m.embed;
    iframe.width = "100%";
    iframe.height = "100%";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.style.border = "0";

    frameWrap.appendChild(iframe);

    const actions = document.createElement("div");
    actions.className = "mapActions";
    const open = document.createElement("a");
    open.className = "btn ghost";
    open.href = m.open;
    open.target = "_blank";
    open.rel = "noreferrer";
    open.textContent = "Open Full Map";

    actions.appendChild(open);

    card.appendChild(title);
    card.appendChild(frameWrap);
    card.appendChild(actions);
    grid.appendChild(card);
  });
}

function renderHiddenFinds() {
  fillSelect($("hiddenPark"), [{ value: "", label: "All Parks" }, ...PARKS.map(p => ({ value: p, label: p }))]);
  const park = $("hiddenPark").value;
  const q = $("hiddenSearch").value.trim().toLowerCase();

  const list = $("hiddenList");
  list.innerHTML = "";

  const items = state.hiddenFinds.filter(h => {
    const okPark = !park || h.park === park;
    const blob = `${h.location} ${h.hint}`.toLowerCase();
    const okQ = !q || blob.includes(q);
    return okPark && okQ;
  });

  items.forEach(h => {
    const row = document.createElement("div");
    row.className = "hiddenRow" + (state.ui.selectedHiddenId === h.id ? " active" : "");
    row.addEventListener("click", () => {
      state.ui.selectedHiddenId = h.id;
      save();
      renderHiddenFinds();
      renderHiddenPhoto();
    });

    const top = document.createElement("div");
    top.className = "hiddenTopLine";

    const title = document.createElement("div");
    title.className = "hiddenTitle";
    title.textContent = `${h.park}: ${h.location}`;

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.textContent = h.found ? "Found ✅" : "Not found";

    top.appendChild(title);
    top.appendChild(badge);

    const hint = document.createElement("div");
    hint.className = "hiddenHint";
    hint.textContent = `Hint: ${h.hint}`;

    const line = document.createElement("div");
    line.className = "checkLeft";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.checked = !!h.found;
    cb.addEventListener("click", (e) => e.stopPropagation());
    cb.addEventListener("change", () => {
      h.found = cb.checked;
      save();
      renderHiddenFinds();
      renderHiddenPhoto();
    });
    line.appendChild(cb);

    row.appendChild(top);
    row.appendChild(hint);
    row.appendChild(line);
    list.appendChild(row);
  });
}

function renderHiddenPhoto() {
  const preview = $("photoPreview");
  const sel = state.hiddenFinds.find(h => h.id === state.ui.selectedHiddenId);
  if (!sel) {
    preview.textContent = "No item selected.";
    $("photoHelp").textContent = "Select an item to add a photo.";
    return;
  }

  if (!sel.photo) {
    preview.textContent = "No photo yet.";
  } else {
    preview.innerHTML = "";
    const img = document.createElement("img");
    img.src = sel.photo;
    img.alt = "Hidden find photo";
    preview.appendChild(img);
  }
  $("photoHelp").textContent = `Selected: ${sel.location} (${sel.park})`;
}

function renderFilterAndDayUI() {
  fillSelect($("filterPark"), PARKS, { includeAll: true, allLabel: "All Parks" });
  $("filterPark").value = state.filterPark || "";
  fillSelect($("addDayPark"), PARKS);
  $("addDayPark").value = "Magic Kingdom";
}

function renderTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.tab === state.ui.tab);
  });
  document.querySelectorAll(".tabPanel").forEach(p => {
    p.classList.toggle("active", p.id === `tab-${state.ui.tab}`);
  });
}

function renderAll() {
  renderTrip();
  renderTabs();
  renderFilterAndDayUI();

  renderItinerary();
  renderPacking();
  renderNotes();
  renderActivities();
  renderDining();
  renderMaps();
  renderHiddenFinds();
  renderHiddenPhoto();

  // fill shared “Day” selects that depend on days
  fillSelect($("actDay"), state.days.map(d => ({ value: d.id, label: `${d.label} (${d.park})` })));
  fillSelect($("dinDay"), state.days.map(d => ({ value: d.id, label: `${d.label} (${d.park})` })));
}

/* ---------- Actions ---------- */

function addDay(park) {
  const nextNum = state.days.length + 1;
  state.days.push({ id: uid(), label: `Day ${nextNum}`, park });
  save();
  renderAll();
  toast(`Added Day ${nextNum}.`);
}

function addItineraryItem(partial = {}) {
  state.itinerary.push({
    id: uid(),
    dayId: state.days[0]?.id || "",
    time: "09:00",
    park: partial.park || "Magic Kingdom",
    plan: partial.plan || "",
    dining: partial.dining || "",
    cost: Number(partial.cost || 0)
  });
  save();
  renderAll();
  toast("Added itinerary item.");
}

function autoCreateDaysFromDates() {
  const s = state.trip.startDate;
  const e = state.trip.endDate;
  if (!s || !e) {
    toast("Add start and end dates first.");
    return;
  }
  const start = new Date(s + "T00:00:00");
  const end = new Date(e + "T00:00:00");
  const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;
  if (!Number.isFinite(diffDays) || diffDays <= 0) {
    toast("Date range looks invalid.");
    return;
  }
  const keep = confirm(`Create ${diffDays} days from your dates? This will replace your current Day list.`);
  if (!keep) return;

  state.days = [];
  for (let i = 1; i <= diffDays; i++) {
    state.days.push({ id: uid(), label: `Day ${i}`, park: i === 1 ? "Magic Kingdom" : "Resort Day" });
  }

  // keep itinerary dayId valid
  const first = state.days[0]?.id || "";
  state.itinerary = state.itinerary.map(it => ({ ...it, dayId: first }));

  save();
  renderAll();
  toast("Days created from dates.");
}

function exportJSON() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vacation-planner-backup.json";
  a.click();
  URL.revokeObjectURL(url);
  toast("Backup exported.");
}

function importJSON(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(String(reader.result || ""));
      if (!data || typeof data !== "object") throw new Error("bad");
      state = data;
      save();
      renderAll();
      toast("Backup imported.");
    } catch {
      toast("Import failed. File might be invalid.");
    }
  };
  reader.readAsText(file);
}

/* ---------- Calendar Export (ICS) ---------- */

function toICSDate(dt) {
  // dt should be Date
  const pad = (n) => String(n).padStart(2, "0");
  return (
    dt.getUTCFullYear() +
    pad(dt.getUTCMonth() + 1) +
    pad(dt.getUTCDate()) +
    "T" +
    pad(dt.getUTCHours()) +
    pad(dt.getUTCMinutes()) +
    "00Z"
  );
}

function buildICS() {
  // We try to map Day N to real dates using startDate. If no start date, we export all-day events without date.
  const start = state.trip.startDate ? new Date(state.trip.startDate + "T00:00:00") : null;

  const lines = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//Vacation Planner//EN");
  lines.push("CALSCALE:GREGORIAN");
  lines.push("METHOD:PUBLISH");

  // Group itinerary by day order
  const dayIndex = new Map(state.days.map((d, i) => [d.id, i]));
  const items = [...state.itinerary].sort((a, b) => (dayIndex.get(a.dayId) ?? 0) - (dayIndex.get(b.dayId) ?? 0));

  items.forEach((it) => {
    const dIdx = dayIndex.get(it.dayId) ?? 0;

    let eventStart = null;
    let eventEnd = null;

    if (start) {
      const base = new Date(start.getTime());
      base.setDate(base.getDate() + dIdx);

      const [hh, mm] = (it.time || "09:00").split(":").map(x => parseInt(x, 10));
      const sdt = new Date(base.getFullYear(), base.getMonth(), base.getDate(), hh || 9, mm || 0, 0);
      const edt = new Date(sdt.getTime() + 60 * 60 * 1000); // 1 hour default
      eventStart = sdt;
      eventEnd = edt;
    }

    const summary = `${(it.park || "Plan")} — ${it.plan || "Itinerary item"}`.replace(/\n/g, " ");
    const descParts = [];
    if (it.dining) descParts.push(`Dining: ${it.dining}`);
    if (it.cost) descParts.push(`Estimated cost: ${fmtMoney(it.cost)}`);
    descParts.push(`Day: ${dayLabel(it.dayId)}`);
    const description = descParts.join("\\n");

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${it.id}@vacationplanner`);
    lines.push(`DTSTAMP:${toICSDate(new Date())}`);
    lines.push(`SUMMARY:${summary}`);
    lines.push(`DESCRIPTION:${description}`);
    if (eventStart && eventEnd) {
      lines.push(`DTSTART:${toICSDate(eventStart)}`);
      lines.push(`DTEND:${toICSDate(eventEnd)}`);
    } else {
      // floating event with no date
      lines.push(`COMMENT:No startDate set in Trip Snapshot; set dates to export timed events.`);
    }
    lines.push("END:VEVENT");
  });

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function exportICS() {
  const ics = buildICS();
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "vacation-planner-calendar.ics";
  a.click();
  URL.revokeObjectURL(url);
  toast("Calendar exported (.ics). Import into Google/iOS Calendar.");
}

/* ---------- Sparkle Background ---------- */

function startSparkles() {
  const canvas = $("sparkleCanvas");
  const ctx = canvas.getContext("2d");

  let w = 0, h = 0;
  function resize() {
    w = canvas.width = Math.floor(window.innerWidth * devicePixelRatio);
    h = canvas.height = Math.floor(window.innerHeight * devicePixelRatio);
  }
  window.addEventListener("resize", resize);
  resize();

  const rand = (a, b) => a + Math.random() * (b - a);

  const sparkles = Array.from({ length: 140 }, () => ({
    x: rand(0, w),
    y: rand(0, h),
    r: rand(0.8, 2.4) * devicePixelRatio,
    vx: rand(-0.12, 0.12) * devicePixelRatio,
    vy: rand(-0.22, 0.28) * devicePixelRatio,
    a: rand(0.15, 0.75),
    tw: rand(0.002, 0.01),
    hue: rand(180, 320)
  }));

  function tick() {
    ctx.clearRect(0, 0, w, h);

    // soft glow overlay
    ctx.globalCompositeOperation = "lighter";

    for (const s of sparkles) {
      s.x += s.vx;
      s.y += s.vy;
      s.a += Math.sin(Date.now() * s.tw) * 0.008;

      if (s.x < -50) s.x = w + 50;
      if (s.x > w + 50) s.x = -50;
      if (s.y < -50) s.y = h + 50;
      if (s.y > h + 50) s.y = -50;

      const alpha = clamp(s.a, 0.05, 0.85);
      const grad = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 10);
      grad.addColorStop(0, `hsla(${s.hue}, 90%, 75%, ${alpha})`);
      grad.addColorStop(1, `hsla(${s.hue}, 90%, 75%, 0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 10, 0, Math.PI * 2);
      ctx.fill();

      // tiny star point
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalCompositeOperation = "source-over";
    requestAnimationFrame(tick);
  }
  tick();
}

/* ---------- Wire up events ---------- */

function bind() {
  // Trip fields
  $("tripName").addEventListener("input", (e) => { state.trip.name = e.target.value; save(); });
  $("startDate").addEventListener("change", (e) => { state.trip.startDate = e.target.value; save(); renderTrip(); });
  $("endDate").addEventListener("change", (e) => { state.trip.endDate = e.target.value; save(); renderTrip(); });
  $("partySize").addEventListener("change", (e) => { state.trip.partySize = clamp(Number(e.target.value || 1), 1, 30); save(); renderTrip(); });
  $("budget").addEventListener("change", (e) => { state.trip.budget = clamp(Number(e.target.value || 0), 0, 999999); save(); renderTrip(); });
  $("welcomeMsg").addEventListener("input", (e) => { state.trip.welcomeMsg = e.target.value; save(); renderTrip(); });

  // Resorts
  fillSelect($("resortSelect"), RESORTS.map((r, i) => ({ value: r, label: r })));
  $("resortSelect").value = state.trip.resort || RESORTS[0];
  $("resortSelect").addEventListener("change", (e) => {
    state.trip.resort = e.target.value;
    save();
    renderTrip();
  });

  // Tabs
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      state.ui.tab = btn.dataset.tab;
      save();
      renderTabs();
    });
  });

  // Filter
  $("filterPark").addEventListener("change", (e) => {
    state.filterPark = e.target.value;
    save();
    renderItinerary();
  });
  $("btnClearFilter").addEventListener("click", () => {
    state.filterPark = "";
    $("filterPark").value = "";
    save();
    renderItinerary();
  });

  // Add day
  $("btnAddDay").addEventListener("click", () => addDay($("addDayPark").value));

  // Add itinerary item
  $("btnAddItem").addEventListener("click", () => addItineraryItem({}));
  $("btnExpandDays").addEventListener("click", autoCreateDaysFromDates);

  // Packing
  $("packAdd").addEventListener("click", () => {
    const text = $("packNew").value.trim();
    if (!text) return;
    state.packing.push({ id: uid(), text, done: false });
    $("packNew").value = "";
    save();
    renderPacking();
    toast("Added packing item.");
  });

  // Notes
  $("notesText").addEventListener("input", (e) => {
    state.notes = e.target.value;
    save();
  });

  // Activities segmented
  document.querySelectorAll(".seg").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".seg").forEach(x => x.classList.remove("active"));
      btn.classList.add("active");
      state.ui.activitySeg = btn.dataset.seg;
      state.ui.selectedActivityId = "";
      $("actSelectedInfo").textContent = "No activity selected.";
      save();
      renderActivities();
    });
  });

  $("btnAddActivityToItinerary").addEventListener("click", () => {
    const id = state.ui.selectedActivityId;
    const seg = state.ui.activitySeg;
    const act = state.activities[seg].find(a => a.id === id);
    if (!act) {
      toast("Select an activity first.");
      return;
    }
    const dayId = $("actDay").value || state.days[0]?.id;
    const time = $("actTime").value || "10:00";
    const park = $("actPark").value || act.park || "Resort Day";
    const extraCost = Number($("actCost").value || 0);
    const baseCost = Number(act.cost || 0);
    addItineraryItem({
      park,
      plan: act.title,
      dining: "",
      cost: baseCost + extraCost
    });
    // set values on last item
    const last = state.itinerary[state.itinerary.length - 1];
    last.dayId = dayId;
    last.time = time;
    last.park = park;
    save();
    renderAll();
    toast("Added activity to itinerary.");
  });

  // Dining
  $("diningPark").addEventListener("change", renderDining);
  $("diningType").addEventListener("change", renderDining);
  $("diningSearch").addEventListener("input", renderDining);

  $("btnAddDiningToItinerary").addEventListener("click", () => {
    const key = state.ui.selectedDiningKey;
    if (!key) {
      toast("Select a dining option first.");
      return;
    }
    const [type, park, name] = key.split("::");
    const dayId = $("dinDay").value || state.days[0]?.id;
    const time = $("dinTime").value || "12:00";
    const itPark = $("dinPark").value || park || "Resort Day";
    const cost = Number($("dinCost").value || 0);

    addItineraryItem({
      park: itPark,
      plan: `Dining: ${name}`,
      dining: type === "quick" ? "Quick Service" : "Table Service",
      cost
    });
    const last = state.itinerary[state.itinerary.length - 1];
    last.dayId = dayId;
    last.time = time;
    last.park = itPark;
    save();
    renderAll();
    toast("Added dining plan to itinerary.");
  });

  // Hidden finds filters
  $("hiddenPark").addEventListener("change", renderHiddenFinds);
  $("hiddenSearch").addEventListener("input", renderHiddenFinds);

  // Photo pick
  $("photoPick").addEventListener("change", async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const sel = state.hiddenFinds.find(h => h.id === state.ui.selectedHiddenId);
    if (!sel) { toast("Select a hidden find first."); return; }

    const dataUrl = await fileToDataURL(file);
    sel.photo = dataUrl;
    sel.found = true;
    save();
    renderHiddenFinds();
    renderHiddenPhoto();
    toast("Photo saved.");
    e.target.value = "";
  });

  $("btnRemovePhoto").addEventListener("click", () => {
    const sel = state.hiddenFinds.find(h => h.id === state.ui.selectedHiddenId);
    if (!sel) { toast("Select an item first."); return; }
    sel.photo = "";
    save();
    renderHiddenPhoto();
    toast("Photo removed.");
  });

  // Export / Import / Reset / Calendar
  $("btnExportICS").addEventListener("click", exportICS);
  $("btnExportJSON").addEventListener("click", exportJSON);
  $("fileImportJSON").addEventListener("change", (e) => {
    const f = e.target.files?.[0];
    if (f) importJSON(f);
    e.target.value = "";
  });

  $("btnReset").addEventListener("click", () => {
    const ok = confirm("Reset this device planner? This cannot be undone.");
    if (!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });
}

function fileToDataURL(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

/* ---------- Init ---------- */

function init() {
  // default selects
  fillSelect($("resortSelect"), RESORTS);
  $("resortSelect").value = state.trip.resort || RESORTS[0];

  fillSelect($("filterPark"), PARKS, { includeAll: true, allLabel: "All Parks" });
  $("filterPark").value = state.filterPark || "";

  fillSelect($("addDayPark"), PARKS);
  fillSelect($("actPark"), PARKS);
  fillSelect($("dinPark"), PARKS);

  // activity segmented initial
  document.querySelectorAll(".seg").forEach(b => b.classList.toggle("active", b.dataset.seg === state.ui.activitySeg));

  // dining defaults
  $("diningPark").value = "Magic Kingdom";
  $("diningType").value = "quick";

  bind();
  renderAll();
  startSparkles();
  toast("Ready ✨");
}

document.addEventListener("DOMContentLoaded", init);