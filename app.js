const KEY = "vacation_planner_v4";

const state = {
  tripName: "",
  startDate: "",
  endDate: "",
  resort: "",
  party: "",
  budget: "",
  welcome: "",
  plans: [],
  packing: [],
  notes: "",
  parkFilter: "",
  freeActivities: [],
  paidActivities: []
};

const $ = (id) => document.getElementById(id);
const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

const PARKS = [
  { value: "", icon: "🌈", label: "All Parks" },
  { value: "Magic Kingdom", icon: "🏰", label: "Magic Kingdom" },
  { value: "EPCOT", icon: "🌐", label: "EPCOT" },
  { value: "Hollywood Studios", icon: "🎬", label: "Hollywood Studios" },
  { value: "Animal Kingdom", icon: "🦁", label: "Animal Kingdom" },
  { value: "Disney Springs", icon: "🛍️", label: "Disney Springs" },
  { value: "Typhoon Lagoon", icon: "🌊", label: "Typhoon Lagoon" },
  { value: "Blizzard Beach", icon: "❄️", label: "Blizzard Beach" },
  { value: "Resort Day", icon: "🏖️", label: "Resort Day" },
  { value: "Other", icon: "✨", label: "Other" }
];

const PARK_ROW_OPTIONS = PARKS.filter(p => p.value !== "");

const DINING = [
  { value: "", label: "Select…" },
  { value: "Quick Service", label: "Quick Service" },
  { value: "Table Service", label: "Table Service" },
  { value: "Snack", label: "Snack" },
  { value: "Character Dining", label: "Character Dining" },
  { value: "Lounge / Bar", label: "Lounge / Bar" },
  { value: "Grocery / In-room", label: "Grocery / In-room" }
];

const TRANSPORT = [
  { value: "", label: "Select…" },
  { value: "Walk", label: "Walk" },
  { value: "Bus", label: "Bus" },
  { value: "Monorail", label: "Monorail" },
  { value: "Skyliner", label: "Skyliner" },
  { value: "Boat", label: "Boat" },
  { value: "Car / Uber / Lyft", label: "Car / Uber / Lyft" },
  { value: "Minnie Van", label: "Minnie Van" },
  { value: "Other", label: "Other" }
];

/* Big starter lists (editable) */
const DEFAULT_FREE_ACTIVITIES = [
  "Resort pool time / splash pad",
  "Resort movie under the stars",
  "Resort campfire (marshmallows if you bring them)",
  "Playground time at the resort",
  "Disney Springs window shopping + live entertainment",
  "Disney Springs photo spots (World of Disney, mural walls)",
  "BoardWalk stroll (street performers at night)",
  "Animal Kingdom Lodge: watch animals from overlooks",
  "Grand Floridian lobby + live piano (when available)",
  "Polynesian beach sunset view",
  "Contemporary observation deck views",
  "Skyliner ride (if you have park/resort access; just ride around)",
  "Monorail ride (if you have access; great for vibes)",
  "Fort Wilderness: walk the grounds / trails",
  "Resort hopping (lobby + theming photos)",
  "Pin trading (look for boards/cast members)",
  "PhotoPass “own” photos (take your own photo tour)",
  "Park: free atmosphere shows (streetmosphere)",
  "Park: parades / cavalcades",
  "Park: fireworks viewing (from outside areas if available)",
  "Park: explore gift shops + hidden details hunt",
  "Park: meet-and-greet lines (if included with your ticket)",
  "Hidden Mickey hunt day",
  "Transportation tour: boats/buses/Skyliner for exploring",
  "Take a “snack budget” walk but don’t buy—rank your top snacks",
  "Watch a resort lobby documentary loop / ambience",
  "People-watching + journaling",
  "Disney Springs: LEGO store displays",
  "Disney Springs: World of Disney browse"
];

const DEFAULT_PAID_ACTIVITIES = [
  "Genie+ / Lightning Lane day (if available)",
  "Character dining reservation",
  "Dessert party (fireworks dessert party)",
  "After Hours event ticket",
  "Special ticketed parties (seasonal events)",
  "Souvenir budget shopping at Disney Springs",
  "Mini golf (Fantasia Gardens / Winter Summerland)",
  "Golf or footgolf",
  "Savi’s Workshop (lightsaber build)",
  "Droid Depot build",
  "Bibbidi Bobbidi Boutique",
  "Behind-the-scenes tours (varies)",
  "Fishing excursion (varies)",
  "Horse carriage ride (if offered)",
  "Spa day (Grand Floridian / etc.)",
  "Paid photo session / prints",
  "Boat rental (if offered)",
  "Dining “progressive” meal at resorts",
  "Specialty coffee + treat tour",
  "Merch scavenger hunt challenge (buy 1 thing per land)"
];

function parkIcon(parkValue) {
  const found = PARKS.find(p => p.value === parkValue);
  return found ? found.icon : "✨";
}

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    Object.assign(state, data);
  } catch {}
}

function renderHeader() {
  $("heroTitle").textContent = state.welcome?.trim() || "Welcome! ✨";

  const dates = state.startDate && state.endDate
    ? `${state.startDate} → ${state.endDate}`
    : "—";

  $("chipDates").textContent = `Dates: ${dates}`;
  $("chipResort").textContent = `Resort: ${state.resort || "—"}`;
  $("chipParty").textContent = `Party: ${state.party || "—"}`;

  $("tripName").value = state.tripName || "";
  $("startDate").value = state.startDate || "";
  $("endDate").value = state.endDate || "";
  $("resort").value = state.resort || "";
  $("party").value = state.party || "";
  $("budget").value = state.budget || "";
  $("welcome").value = state.welcome || "";
}

function bindSnapshotInputs() {
  const ids = ["tripName","startDate","endDate","resort","party","budget","welcome"];
  ids.forEach((id) => {
    const el = $(id);
    const handler = () => {
      state[id] = el.value;
      save();
      renderHeader();
    };
    el.addEventListener("input", handler);
    el.addEventListener("change", handler);
  });
}

function makeSelect(options, value, onChange, labelFn) {
  const sel = document.createElement("select");
  options.forEach((opt) => {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = labelFn ? labelFn(opt) : opt.label;
    sel.appendChild(o);
  });
  sel.value = value ?? "";
  sel.addEventListener("change", () => onChange(sel.value));
  return sel;
}

/* ---------- ITINERARY ---------- */

function planRow(item) {
  const row = document.createElement("div");
  row.className = "row";

  const day = document.createElement("input");
  day.placeholder = "Day 1 / Arrival";
  day.value = item.day || "";
  day.addEventListener("input", () => { item.day = day.value; save(); });

  const time = document.createElement("input");
  time.placeholder = "8:00 AM";
  time.value = item.time || "";
  time.addEventListener("input", () => { item.time = time.value; save(); });

  // Park icon + select
  const parkWrap = document.createElement("div");
  parkWrap.className = "parkCell";

  const icon = document.createElement("div");
  icon.className = "parkIcon";
  icon.textContent = parkIcon(item.park || "");

  const parkSel = makeSelect(
    PARK_ROW_OPTIONS,
    item.park || "",
    (val) => {
      item.park = val;
      icon.textContent = parkIcon(val);
      save();
      if (state.parkFilter) renderPlans();
      updateRowCount();
    },
    (opt) => `${opt.icon} ${opt.label}`
  );

  parkWrap.append(icon, parkSel);

  const plan = document.createElement("input");
  plan.placeholder = "What are we doing?";
  plan.value = item.text || "";
  plan.addEventListener("input", () => { item.text = plan.value; save(); });

  const diningSel = makeSelect(DINING, item.dining || "", (val) => {
    item.dining = val;
    save();
  });

  const transportSel = makeSelect(TRANSPORT, item.transport || "", (val) => {
    item.transport = val;
    save();
  });

  const del = document.createElement("button");
  del.className = "icon";
  del.textContent = "✕";
  del.addEventListener("click", () => {
    state.plans = state.plans.filter(p => p.id !== item.id);
    save();
    renderPlans();
  });

  row.append(day, time, parkWrap, plan, diningSel, transportSel, del);
  return row;
}

function filteredPlans() {
  if (!state.parkFilter) return state.plans;
  return state.plans.filter(p => (p.park || "") === state.parkFilter);
}

function updateRowCount() {
  const total = state.plans.length;
  const shown = filteredPlans().length;
  $("rowCount").textContent = state.parkFilter ? `${shown}/${total} rows` : `${total} rows`;
}

function renderPlans() {
  const wrap = $("planRows");
  wrap.innerHTML = "";
  filteredPlans().forEach(p => wrap.appendChild(planRow(p)));
  updateRowCount();
}

function setupParkFilter() {
  const sel = $("parkFilter");
  sel.innerHTML = "";

  PARKS.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = `${opt.icon} ${opt.label}`;
    sel.appendChild(o);
  });

  sel.value = state.parkFilter || "";

  sel.addEventListener("change", () => {
    state.parkFilter = sel.value;
    save();
    renderPlans();
  });

  $("clearFilter").addEventListener("click", () => {
    state.parkFilter = "";
    sel.value = "";
    save();
    renderPlans();
  });
}

/* ---------- PACKING ---------- */

function packRow(item) {
  const row = document.createElement("div");
  row.className = "packItem";

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = !!item.done;
  cb.addEventListener("change", () => {
    item.done = cb.checked;
    save();
  });

  const text = document.createElement("input");
  text.placeholder = "Ponchos, chargers, snacks…";
  text.value = item.text || "";
  text.addEventListener("input", () => {
    item.text = text.value;
    save();
  });

  const del = document.createElement("button");
  del.className = "icon";
  del.textContent = "✕";
  del.addEventListener("click", () => {
    state.packing = state.packing.filter(x => x.id !== item.id);
    save();
    renderPacking();
  });

  row.append(cb, text, del);
  return row;
}

function renderPacking() {
  const wrap = $("packRows");
  wrap.innerHTML = "";
  state.packing.forEach(i => wrap.appendChild(packRow(i)));
}

/* ---------- NOTES ---------- */

function setupNotes() {
  $("notes").value = state.notes || "";
  $("notes").addEventListener("input", () => {
    state.notes = $("notes").value;
    save();
  });
}

/* ---------- ACTIVITIES ---------- */

function activityRow(item, kind) {
  const row = document.createElement("div");
  row.className = "activityItem";

  const name = document.createElement("input");
  name.placeholder = kind === "free" ? "Free activity…" : "Paid activity…";
  name.value = item.name || "";
  name.addEventListener("input", () => {
    item.name = name.value;
    save();
  });

  const cost = document.createElement("input");
  cost.type = "number";
  cost.min = "0";
  cost.placeholder = kind === "free" ? "0" : "Cost";
  cost.value = item.cost ?? (kind === "free" ? 0 : "");
  cost.addEventListener("input", () => {
    item.cost = cost.value === "" ? "" : Number(cost.value);
    save();
    updateActivityCounts();
  });

  if (kind === "free") {
    cost.value = 0;
    cost.disabled = true;
  }

  const del = document.createElement("button");
  del.className = "icon";
  del.textContent = "✕";
  del.addEventListener("click", () => {
    if (kind === "free") {
      state.freeActivities = state.freeActivities.filter(x => x.id !== item.id);
    } else {
      state.paidActivities = state.paidActivities.filter(x => x.id !== item.id);
    }
    save();
    renderActivities();
  });

  row.append(name, cost, del);
  return row;
}

function updateActivityCounts() {
  $("freeCount").textContent = `${state.freeActivities.length} items`;
  $("paidCount").textContent = `${state.paidActivities.length} items`;
}

function renderActivities() {
  const freeWrap = $("freeActivities");
  const paidWrap = $("paidActivities");
  freeWrap.innerHTML = "";
  paidWrap.innerHTML = "";

  state.freeActivities.forEach(a => freeWrap.appendChild(activityRow(a, "free")));
  state.paidActivities.forEach(a => paidWrap.appendChild(activityRow(a, "paid")));

  updateActivityCounts();
}

function setupActivitiesSubtabs() {
  document.querySelectorAll(".subtab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".subtab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".subpanel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`sub-${btn.dataset.subtab}`).classList.add("active");
    });
  });
}

/* ---------- UI BASICS ---------- */

function setupTabs() {
  document.querySelectorAll(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
      document.querySelectorAll(".tabpanel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });
}

function setupIntro() {
  $("enter").addEventListener("click", () => {
    $("intro").classList.add("hidden");
  });
}

function setupButtons() {
  $("addPlan").addEventListener("click", () => {
    state.plans.push({
      id: uid(),
      day: "",
      time: "",
      park: "",
      text: "",
      dining: "",
      transport: ""
    });
    save();
    renderPlans();
  });

  $("addPack").addEventListener("click", () => {
    state.packing.push({ id: uid(), text: "", done: false });
    save();
    renderPacking();
  });

  $("addFreeActivity").addEventListener("click", () => {
    state.freeActivities.push({ id: uid(), name: "", cost: 0 });
    save();
    renderActivities();
  });

  $("addPaidActivity").addEventListener("click", () => {
    state.paidActivities.push({ id: uid(), name: "", cost: "" });
    save();
    renderActivities();
  });

  $("export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vacation-planner.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  $("reset").addEventListener("click", () => {
    localStorage.removeItem(KEY);
    location.reload();
  });
}

function normalizeExistingData() {
  state.plans = (state.plans || []).map(p => ({
    id: p.id || uid(),
    day: p.day || "",
    time: p.time || "",
    park: p.park || "",
    text: p.text || "",
    dining: p.dining || "",
    transport: p.transport || ""
  }));

  state.packing = (state.packing || []).map(i => ({
    id: i.id || uid(),
    text: i.text || "",
    done: !!i.done
  }));

  state.freeActivities = (state.freeActivities || []).map(a => ({
    id: a.id || uid(),
    name: a.name || "",
    cost: 0
  }));

  state.paidActivities = (state.paidActivities || []).map(a => ({
    id: a.id || uid(),
    name: a.name || "",
    cost: a.cost ?? ""
  }));

  state.notes = state.notes || "";
}

function seedIfEmpty() {
  if (state.plans.length === 0) {
    state.plans.push(
      { id: uid(), day: "Day 1 (Arrival)", time: "3:00 PM", park: "Resort Day", text: "Check in + pool time", dining: "Quick Service", transport: "Car / Uber / Lyft" },
      { id: uid(), day: "Day 2", time: "9:00 AM", park: "Magic Kingdom", text: "Rope drop + classics", dining: "Table Service", transport: "Bus" }
    );
  }

  if (state.packing.length === 0) {
    state.packing.push(
      { id: uid(), text: "Power bank / chargers", done: false },
      { id: uid(), text: "Ponchos / rain jackets", done: false },
      { id: uid(), text: "Water bottles", done: false }
    );
  }

  if (state.freeActivities.length === 0) {
    state.freeActivities = DEFAULT_FREE_ACTIVITIES.map(name => ({ id: uid(), name, cost: 0 }));
  }

  if (state.paidActivities.length === 0) {
    state.paidActivities = DEFAULT_PAID_ACTIVITIES.map(name => ({ id: uid(), name, cost: "" }));
  }
}

function init() {
  load();
  normalizeExistingData();

  setupIntro();
  setupTabs();
  setupActivitiesSubtabs();
  setupButtons();
  setupParkFilter();
  bindSnapshotInputs();
  setupNotes();

  seedIfEmpty();
  save();

  renderHeader();
  renderPlans();
  renderPacking();
  renderActivities();
}

init();