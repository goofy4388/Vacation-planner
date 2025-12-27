const KEY = "vacation_planner_v7";

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
  paidActivities: [],
  hiddenMickeys: [],
  hmFilter: ""
};

const $ = (id) => document.getElementById(id);
const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

function showError(msg) {
  const bar = $("errorBar");
  if (!bar) return;
  bar.textContent = "JS Error: " + msg;
  bar.classList.remove("hidden");
}

window.addEventListener("error", (e) => showError(e.message || "Unknown error"));
window.addEventListener("unhandledrejection", (e) => showError(e.reason?.message || String(e.reason) || "Promise error"));

/* ---------- OPTIONS ---------- */

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

const DINING_TYPES = [
  { value: "", label: "—" },
  { value: "Quick Service", label: "Quick Service" },
  { value: "Table Service", label: "Table Service" },
  { value: "Snack", label: "Snack" },
  { value: "Character Dining", label: "Character Dining" },
  { value: "Lounge / Bar", label: "Lounge / Bar" }
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

/* Dining database starter.
   You can expand this list as big as you want.
   Format: { park, type, name }
*/
const DINING_DB = [
  // MAGIC KINGDOM (starter)
  { park: "Magic Kingdom", type: "Quick Service", name: "Columbia Harbour House" },
  { park: "Magic Kingdom", type: "Quick Service", name: "Cosmic Ray’s Starlight Café" },
  { park: "Magic Kingdom", type: "Quick Service", name: "Pecos Bill Tall Tale Inn and Café" },
  { park: "Magic Kingdom", type: "Quick Service", name: "Casey’s Corner" },
  { park: "Magic Kingdom", type: "Table Service", name: "Be Our Guest Restaurant" },
  { park: "Magic Kingdom", type: "Table Service", name: "Cinderella’s Royal Table" },
  { park: "Magic Kingdom", type: "Table Service", name: "Skipper Canteen" },

  // EPCOT (starter)
  { park: "EPCOT", type: "Quick Service", name: "Sunshine Seasons" },
  { park: "EPCOT", type: "Quick Service", name: "Connections Eatery" },
  { park: "EPCOT", type: "Table Service", name: "Space 220" },
  { park: "EPCOT", type: "Table Service", name: "Le Cellier Steakhouse" },
  { park: "EPCOT", type: "Table Service", name: "Via Napoli Ristorante e Pizzeria" },

  // HOLLYWOOD STUDIOS (starter)
  { park: "Hollywood Studios", type: "Quick Service", name: "Docking Bay 7 Food and Cargo" },
  { park: "Hollywood Studios", type: "Quick Service", name: "Woody’s Lunch Box" },
  { park: "Hollywood Studios", type: "Table Service", name: "Sci-Fi Dine-In Theater Restaurant" },
  { park: "Hollywood Studios", type: "Table Service", name: "50’s Prime Time Café" },

  // ANIMAL KINGDOM (starter)
  { park: "Animal Kingdom", type: "Quick Service", name: "Satu’li Canteen" },
  { park: "Animal Kingdom", type: "Quick Service", name: "Flame Tree Barbecue" },
  { park: "Animal Kingdom", type: "Table Service", name: "Tiffins Restaurant" },
  { park: "Animal Kingdom", type: "Table Service", name: "Tusker House Restaurant" },

  // DISNEY SPRINGS (starter)
  { park: "Disney Springs", type: "Quick Service", name: "Earl of Sandwich" },
  { park: "Disney Springs", type: "Table Service", name: "The BOATHOUSE" },
  { park: "Disney Springs", type: "Table Service", name: "Raglan Road Irish Pub" }
  const QUICK_SERVICE_LOCATIONS = {
  "Magic Kingdom": [
    "Cosmic Ray’s Starlight Café",
    "Pecos Bill Tall Tale Inn",
    "Columbia Harbour House",
    "Casey’s Corner",
    "Sleepy Hollow",
    "Pinocchio Village Haus"
  ],
  "EPCOT": [
    "Sunshine Seasons",
    "Connections Eatery",
    "Regal Eagle Smokehouse",
    "Les Halles Boulangerie"
  ],
  "Hollywood Studios": [
    "Woody’s Lunch Box",
    "ABC Commissary",
    "Docking Bay 7",
    "Backlot Express"
  ],
  "Animal Kingdom": [
    "Satu’li Canteen",
    "Flame Tree Barbecue",
    "Harambe Market"
  ]
};

const TABLE_SERVICE_LOCATIONS = {
  "Magic Kingdom": [
    "Be Our Guest",
    "Cinderella’s Royal Table",
    "Skipper Canteen",
    "Liberty Tree Tavern",
    "The Crystal Palace"
  ],
  "EPCOT": [
    "Space 220",
    "Le Cellier Steakhouse",
    "Via Napoli",
    "San Angel Inn",
    "Chefs de France"
  ],
  "Hollywood Studios": [
    "Sci-Fi Dine-In Theater",
    "50’s Prime Time Café",
    "Hollywood Brown Derby"
  ],
  "Animal Kingdom": [
    "Tiffins",
    "Yak & Yeti Restaurant",
    "Rainforest Café"
  ]
};
];

/* ---------- ACTIVITIES DEFAULTS ---------- */

const DEFAULT_FREE = [
  "Resort pool time / splash pad",
  "Resort movie under the stars",
  "Resort campfire vibe (bring your own marshmallows)",
  "Disney Springs window shopping + live entertainment",
  "BoardWalk stroll (night vibes)",
  "Animal Kingdom Lodge: watch animals from overlooks",
  "Resort hopping for photos",
  "Transportation tour (Skyliner/boats/monorail)",
  "Hidden Mickey hunt",
  "Photo tour day"
];

const DEFAULT_PAID = [
  { name: "Genie+ / Lightning Lane day (if available)", cost: "" },
  { name: "Character dining reservation", cost: "" },
  { name: "Mini golf", cost: "" },
  { name: "Droid Depot build", cost: "" },
  { name: "Specialty dining experience", cost: "" }
];

/* Hidden Mickey starter examples (you can replace/expand). */
const HM_STARTER = [
  { park: "Magic Kingdom", area: "Main Street U.S.A.", hint: "Look for a Mickey shape in the pavement details." },
  { park: "Magic Kingdom", area: "Fantasyland", hint: "Check decorative trim near queues; a Mickey may be hiding in patterns." },
  { park: "EPCOT", area: "World Celebration", hint: "Scan mural/pattern sections where circles repeat." },
  { park: "Hollywood Studios", area: "Sunset Boulevard", hint: "Look for subtle shapes in props/decoration." },
  { park: "Animal Kingdom", area: "Africa", hint: "Check carved or painted patterns where 3 circles could align." }
];

/* ---------- STORAGE ---------- */

function save() {
  localStorage.setItem(KEY, JSON.stringify(state));
}

function load() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    Object.assign(state, data);
  } catch {
    showError("Could not load saved data");
  }
}

/* ---------- HELPERS ---------- */

function parkIcon(parkValue) {
  const found = PARKS.find(p => p.value === parkValue);
  return found ? found.icon : "✨";
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

function nextDayNumber() {
  let max = 0;
  for (const p of state.plans) {
    const m = (p.day || "").match(/day\s*(\d+)/i);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

function pad2(n) { return String(n).padStart(2, "0"); }

/* Dining helpers */
function diningOptionsFor(park, type) {
  if (!park || !type) return [];
  return DINING_DB
    .filter(x => x.park === park && x.type === type)
    .map(x => x.name)
    .sort((a,b) => a.localeCompare(b));
}

/* ---------- SNAPSHOT ---------- */

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

/* ---------- TABS ---------- */

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

/* ---------- ITINERARY ---------- */

function filteredPlans() {
  if (!state.parkFilter) return state.plans;
  return state.plans.filter(p => (p.park || "") === state.parkFilter);
}

function updateRowCount() {
  const total = state.plans.length;
  const shown = filteredPlans().length;
  $("rowCount").textContent = state.parkFilter ? `${shown}/${total} rows` : `${total} rows`;
}

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

  const parkWrap = document.createElement("div");
  parkWrap.className = "parkCell";

  const icon = document.createElement("div");
  icon.className = "parkIcon";
  icon.textContent = parkIcon(item.park || "");

  const parkSel = makeSelect(
    PARK_ROW_OPTIONS,
    item.park || PARK_ROW_OPTIONS[0].value,
    (val) => {
      item.park = val;
      icon.textContent = parkIcon(val);
      // If park changes, refresh restaurant list if dining type already set
      item.restaurant = item.restaurant || "";
      save();
      renderPlans();
    },
    (opt) => `${opt.icon} ${opt.label}`
  );

  parkWrap.append(icon, parkSel);

  const plan = document.createElement("input");
  plan.placeholder = "What are we doing?";
  plan.value = item.text || "";
  plan.addEventListener("input", () => { item.text = plan.value; save(); });

  const diningTypeSel = makeSelect(
    DINING_TYPES,
    item.diningType || "",
    (val) => {
      item.diningType = val;
      // reset restaurant if type changes
      item.restaurant = "";
      save();
      renderPlans();
    }
  );

  // Restaurant dropdown depends on park + dining type
  const restaurantSel = document.createElement("select");
  const buildRestaurantOptions = () => {
    restaurantSel.innerHTML = "";
    const base = document.createElement("option");
    base.value = "";
    base.textContent = item.diningType ? "Select…" : "Pick dining type first";
    restaurantSel.appendChild(base);

    const opts = diningOptionsFor(item.park, item.diningType);
    opts.forEach(name => {
      const o = document.createElement("option");
      o.value = name;
      o.textContent = name;
      restaurantSel.appendChild(o);
    });

    restaurantSel.value = item.restaurant || "";
    restaurantSel.disabled = !item.diningType || opts.length === 0;
  };

  buildRestaurantOptions();

  restaurantSel.addEventListener("change", () => {
    item.restaurant = restaurantSel.value;
    save();
  });

  const transportSel = makeSelect(TRANSPORT, item.transport || "", (val) => { item.transport = val; save(); });

  const del = document.createElement("button");
  del.className = "icon";
  del.textContent = "✕";
  del.title = "Delete row";
  del.addEventListener("click", () => {
    state.plans = state.plans.filter(p => p.id !== item.id);
    save();
    renderPlans();
  });

  row.append(day, time, parkWrap, plan, diningTypeSel, restaurantSel, transportSel, del);
  return row;
}

function renderPlans() {
  const wrap = $("planRows");
  wrap.innerHTML = "";
  filteredPlans().forEach(p => wrap.appendChild(planRow(p)));
  updateRowCount();
}

function setupParkFilterUI() {
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

function setupAddParkDay() {
  const sel = $("addParkSelect");
  sel.innerHTML = "";
  PARK_ROW_OPTIONS.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = `${opt.icon} ${opt.label}`;
    sel.appendChild(o);
  });

  $("addParkDay").addEventListener("click", () => {
    const park = sel.value || "Magic Kingdom";
    const n = nextDayNumber();
    state.plans.push({
      id: uid(),
      day: `Day ${n}`,
      time: "",
      park,
      text: "Park day",
      diningType: "",
      restaurant: "",
      transport: ""
    });
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
  cb.addEventListener("change", () => { item.done = cb.checked; save(); });

  const text = document.createElement("input");
  text.placeholder = "Ponchos, chargers, snacks…";
  text.value = item.text || "";
  text.addEventListener("input", () => { item.text = text.value; save(); });

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

function addActivityToItinerary(name, cost) {
  const n = nextDayNumber();
  const costText = (cost === 0) ? " ($0)" : (cost ? ` ($${cost})` : "");
  state.plans.push({
    id: uid(),
    day: `Day ${n}`,
    time: "",
    park: "Other",
    text: `${name}${costText}`,
    diningType: "",
    restaurant: "",
    transport: ""
  });
}

function activityRow(item, kind) {
  const row = document.createElement("div");
  row.className = "activityItem";

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = !!item.done;
  cb.addEventListener("change", () => { item.done = cb.checked; save(); });

  const name = document.createElement("input");
  name.value = item.name || "";
  name.addEventListener("input", () => { item.name = name.value; save(); });

  let costEl;
  if (kind === "free") {
    costEl = document.createElement("div");
    costEl.className = "cost";
    costEl.textContent = "$0";
  } else {
    const cost = document.createElement("input");
    cost.type = "number";
    cost.min = "0";
    cost.placeholder = "Cost";
    cost.value = item.cost ?? "";
    cost.addEventListener("input", () => { item.cost = cost.value; save(); });
    costEl = cost;
  }

  const addBtn = document.createElement("button");
  addBtn.className = "btn ghost addBtn";
  addBtn.textContent = "Add to Itinerary";
  addBtn.addEventListener("click", () => {
    const nm = (item.name || "").trim();
    if (!nm) return;
    const cost = (kind === "free") ? 0 : (item.cost || "");
    addActivityToItinerary(nm, cost);
    save();
    renderPlans();
  });

  row.append(cb, name, costEl, addBtn);
  return row;
}

function renderActivities() {
  const freeWrap = $("freeActivities");
  const paidWrap = $("paidActivities");
  freeWrap.innerHTML = "";
  paidWrap.innerHTML = "";

  state.freeActivities.forEach(a => freeWrap.appendChild(activityRow(a, "free")));
  state.paidActivities.forEach(a => paidWrap.appendChild(activityRow(a, "paid")));
}

/* ---------- HIDDEN MICKEYS ---------- */

function hmFiltered() {
  if (!state.hmFilter) return state.hiddenMickeys;
  return state.hiddenMickeys.filter(x => x.park === state.hmFilter);
}

function updateHmCount() {
  const total = state.hiddenMickeys.length;
  const found = state.hiddenMickeys.filter(x => x.found).length;
  $("hmCount").textContent = `${found}/${total} found`;
}

function setupHmFilters() {
  const sel = $("hmFilter");
  const addSel = $("hmAddPark");
  sel.innerHTML = "";
  addSel.innerHTML = "";

  // filter
  PARKS.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = `${opt.icon} ${opt.label}`;
    sel.appendChild(o);
  });
  sel.value = state.hmFilter || "";
  sel.addEventListener("change", () => {
    state.hmFilter = sel.value;
    save();
    renderHiddenMickeys();
  });

  $("hmClear").addEventListener("click", () => {
    state.hmFilter = "";
    sel.value = "";
    save();
    renderHiddenMickeys();
  });

  // add park options (no "All Parks")
  PARK_ROW_OPTIONS.forEach(opt => {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = `${opt.icon} ${opt.label}`;
    addSel.appendChild(o);
  });
}

let hmPhotoTargetId = null;

function openPhotoPickerFor(id) {
  hmPhotoTargetId = id;
  const input = $("hmPhotoInput");
  input.value = "";
  input.click();
}

function setupHmPhotoInput() {
  const input = $("hmPhotoInput");
  input.addEventListener("change", async () => {
    const file = input.files && input.files[0];
    if (!file || !hmPhotoTargetId) return;

    // Convert to base64 data URL (simple, but can hit localStorage limits if you add too many photos)
    const dataUrl = await new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(file);
    });

    const item = state.hiddenMickeys.find(x => x.id === hmPhotoTargetId);
    if (item) {
      item.photo = dataUrl;
      save();
      renderHiddenMickeys();
    }
    hmPhotoTargetId = null;
  });
}

function hmRow(item) {
  const row = document.createElement("div");
  row.className = "hmItem";

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = !!item.found;
  cb.addEventListener("change", () => {
    item.found = cb.checked;
    save();
    updateHmCount();
  });

  const park = document.createElement("div");
  park.textContent = item.park;

  const area = document.createElement("div");
  area.textContent = item.area || "—";

  const hint = document.createElement("div");
  hint.className = "hint";
  hint.textContent = item.hint || "";

  const photoWrap = document.createElement("div");
  photoWrap.className = "hmPhotoWrap";

  if (item.photo) {
    const img = document.createElement("img");
    img.className = "hmThumb";
    img.src = item.photo;
    img.alt = "Hidden Mickey photo";
    photoWrap.appendChild(img);
  }

  const btn = document.createElement("button");
  btn.className = "btn ghost";
  btn.textContent = item.photo ? "Replace Photo" : "Add Photo";
  btn.addEventListener("click", () => openPhotoPickerFor(item.id));

  photoWrap.appendChild(btn);

  row.append(cb, park, area, hint, photoWrap);
  return row;
}

function renderHiddenMickeys() {
  const wrap = $("hmList");
  wrap.innerHTML = "";
  hmFiltered().forEach(x => wrap.appendChild(hmRow(x)));
  updateHmCount();
}

function setupHmAdd() {
  $("hmAddBtn").addEventListener("click", () => {
    const park = $("hmAddPark").value;
    const area = $("hmAddArea").value.trim();
    const hint = $("hmAddHint").value.trim();

    if (!park) return;

    state.hiddenMickeys.push({
      id: uid(),
      park,
      area,
      hint,
      found: false,
      photo: ""
    });

    $("hmAddArea").value = "";
    $("hmAddHint").value = "";
    save();
    renderHiddenMickeys();
  });
}

/* ---------- EXPORT ---------- */

function buildICS() {
  if (!state.startDate) {
    alert("Set a Start Date first, then try Calendar (.ics) export.");
    return null;
  }

  const lines = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//Vacation Planner//EN");

  const now = new Date();
  const stamp = `${now.getUTCFullYear()}${pad2(now.getUTCMonth()+1)}${pad2(now.getUTCDate())}T${pad2(now.getUTCHours())}${pad2(now.getUTCMinutes())}${pad2(now.getUTCSeconds())}Z`;

  for (const p of state.plans) {
    const m = (p.day || "").match(/day\s*(\d+)/i);
    if (!m) continue;

    const dayNum = Number(m[1]);
    const base = new Date(state.startDate + "T00:00:00");
    if (isNaN(base.getTime())) continue;
    base.setDate(base.getDate() + (dayNum - 1));

    const yyyy = base.getFullYear();
    const mm = pad2(base.getMonth() + 1);
    const dd = pad2(base.getDate());
    const ymd = `${yyyy}${mm}${dd}`;

    let hh = 9, min = 0;
    const ts = (p.time || "").trim().toUpperCase();
    const ampm = ts.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/);
    if (ampm) {
      hh = Number(ampm[1]);
      min = ampm[2] ? Number(ampm[2]) : 0;
      const ap = ampm[3];
      if (ap === "PM" && hh !== 12) hh += 12;
      if (ap === "AM" && hh === 12) hh = 0;
    }

    const dtStart = `${ymd}T${pad2(hh)}${pad2(min)}00`;
    const endMin = (min + 60) % 60;
    const endHour = (hh + Math.floor((min + 60) / 60)) % 24;
    const dtEnd = `${ymd}T${pad2(endHour)}${pad2(endMin)}00`;

    const diningPart = p.restaurant ? ` • ${p.restaurant}` : "";
    const summary = `${(p.park ? p.park + " — " : "")}${(p.text || "Plan").trim()}${diningPart}`.trim();

    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${uid()}@vacation-planner`);
    lines.push(`DTSTAMP:${stamp}`);
    lines.push(`DTSTART:${dtStart}`);
    lines.push(`DTEND:${dtEnd}`);
    lines.push(`SUMMARY:${summary.replace(/,/g,"\\,")}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function setupButtons() {
  $("addPlan").addEventListener("click", () => {
    state.plans.push({
      id: uid(),
      day: "",
      time: "",
      park: "Magic Kingdom",
      text: "",
      diningType: "",
      restaurant: "",
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

  $("export").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vacation-planner.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  $("exportCalendar").addEventListener("click", () => {
    const ics = buildICS();
    if (!ics) return;
    const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "vacation-planner.ics";
    document.body.appendChild(a);
    a.click();
    a.remove();
  });

  $("reset").addEventListener("click", () => {
    localStorage.removeItem(KEY);
    location.reload();
  });
}

/* ---------- SEED + NORMALIZE ---------- */

function normalize() {
  state.plans = (state.plans || []).map(p => ({
    id: p.id || uid(),
    day: p.day || "",
    time: p.time || "",
    park: p.park || "Magic Kingdom",
    text: p.text || "",
    diningType: p.diningType || "",
    restaurant: p.restaurant || "",
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
    done: !!a.done
  }));

  state.paidActivities = (state.paidActivities || []).map(a => ({
    id: a.id || uid(),
    name: a.name || "",
    cost: a.cost ?? "",
    done: !!a.done
  }));

  state.hiddenMickeys = (state.hiddenMickeys || []).map(h => ({
    id: h.id || uid(),
    park: h.park || "Magic Kingdom",
    area: h.area || "",
    hint: h.hint || "",
    found: !!h.found,
    photo: h.photo || ""
  }));

  state.notes = state.notes || "";
}

function seedIfEmpty() {
  if (state.plans.length === 0) {
    state.plans.push(
      { id: uid(), day: "Day 1 (Arrival)", time: "3:00 PM", park: "Resort Day", text: "Check in + pool time", diningType: "", restaurant: "", transport: "Car / Uber / Lyft" },
      { id: uid(), day: "Day 2", time: "9:00 AM", park: "Magic Kingdom", text: "Rope drop + classics", diningType: "Quick Service", restaurant: "Pecos Bill Tall Tale Inn and Café", transport: "Bus" }
    );
  }

  if (state.packing.length === 0) {
    state.packing.push(
      { id: uid(), text: "Power bank / chargers", done: false },
      { id: uid(), text: "Ponchos / rain jackets", done: false }
    );
  }

  if (state.freeActivities.length === 0) {
    state.freeActivities = DEFAULT_FREE.map(name => ({ id: uid(), name, done: false }));
  }

  if (state.paidActivities.length === 0) {
    state.paidActivities = DEFAULT_PAID.map(x => ({ id: uid(), name: x.name, cost: x.cost, done: false }));
  }

  if (state.hiddenMickeys.length === 0) {
    state.hiddenMickeys = HM_STARTER.map(x => ({ id: uid(), ...x, found: false, photo: "" }));
  }
}

/* ---------- INIT ---------- */

function setupHmFiltersUI() {
  setupHmFilters();
  setupHmAdd();
  setupHmPhotoInput();
}

function setupTabsExtras() {
  setupActivitiesSubtabs();
}

function setupParkFilterUIAll() {
  setupParkFilterUI();
  setupAddParkDay();
}

function setupNotesUI() {
  setupNotes();
}

function setupTabsUI() {
  setupTabs();
  setupTabsExtras();
}

function init() {
  load();
  normalize();
  seedIfEmpty();
  save();

  setupTabsUI();
  setupButtons();
  setupParkFilterUIAll();
  bindSnapshotInputs();
  setupNotesUI();

  setupHmFiltersUI();

  renderHeader();
  renderPlans();
  renderPacking();
  renderActivities();
  renderHiddenMickeys();

  $("footerStatus").textContent = "JS Loaded ✅ | Dining dropdowns + Hidden Mickeys + Calendar export ready";
}

init();
const HIDDEN_MICKEYS = [
  {
    park: "Magic Kingdom",
    location: "Pirates of the Caribbean",
    hint: "Look at the wall above the jail cell."
  },
  {
    park: "Magic Kingdom",
    location: "Haunted Mansion",
    hint: "In the ballroom chandelier scene."
  },
  {
    park: "EPCOT",
    location: "The Seas Pavilion",
    hint: "Near the coral reef tank."
  },
  {
    park: "Hollywood Studios",
    location: "Star Tours queue",
    hint: "On the radar screen."
  },
  {
    park: "Animal Kingdom",
    location: "Tree of Life",
    hint: "Animal carvings form a Mickey shape."
  }
];
if (state.hiddenMickeys.length === 0) {
  state.hiddenMickeys = HIDDEN_MICKEYS.map(h => ({
    id: uid(),
    park: h.park,
    location: h.location,
    hint: h.hint,
    found: false,
    photo: ""
  }));
}