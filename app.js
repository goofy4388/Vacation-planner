// PASSWORD PROTECTION
const PAGE_PASSWORD = "disney"; // CHANGE THIS

document.addEventListener("DOMContentLoaded", () => {
  const lockScreen = document.getElementById("lockScreen");
  const input = document.getElementById("passwordInput");
  const btn = document.getElementById("unlockBtn");
  const error = document.getElementById("lockError");

  // already unlocked?
  if (localStorage.getItem("unlocked") === "true") {
    lockScreen.style.display = "none";
  }

  btn.addEventListener("click", unlock);
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") unlock();
  });

  function unlock() {
    if (input.value === PAGE_PASSWORD) {
      localStorage.setItem("unlocked", "true");
      lockScreen.style.display = "none";
    } else {
      error.style.display = "block";
    }
  }
});
/* =========================================================
  Vacation Planner (single-file JS)
  - Auto-saves to localStorage
  - Itinerary: park filter + add day + dining type -> restaurants
  - Dining tab: per-park restaurant list + Add to itinerary
  - Activities tab: free/paid + Add to itinerary
  - Maps tab: embedded maps
  - Hidden Finds: 82 items, checklist + editable + photo per item
  - Calendar export: .ics file
  - Backup export/import: JSON (your whole plan)
========================================================= */

const STORAGE_KEY = "vacation_planner_v1";

// ---------- Data: Parks ----------
const PARKS = [
  "Magic Kingdom",
  "EPCOT",
  "Hollywood Studios",
  "Animal Kingdom",
  "Disney Springs"
];

// ---------- Data: Resorts (starter list; editable by you via HTML if needed) ----------
const RESORTS = [
  "Select a resort…",
  "Disney's Contemporary Resort",
  "Disney's Grand Floridian Resort & Spa",
  "Disney's Polynesian Village Resort",
  "Disney's Wilderness Lodge",
  "Disney's Yacht Club Resort",
  "Disney's Beach Club Resort",
  "Disney's BoardWalk Inn",
  "Disney's Riviera Resort",
  "Disney's Coronado Springs Resort",
  "Disney's Caribbean Beach Resort",
  "Disney's Port Orleans Resort – Riverside",
  "Disney's Port Orleans Resort – French Quarter",
  "Disney's Saratoga Springs Resort & Spa",
  "Disney's Old Key West Resort",
  "Disney's Pop Century Resort",
  "Disney's Art of Animation Resort",
  "Disney's All-Star Movies Resort",
  "Disney's All-Star Music Resort",
  "Disney's All-Star Sports Resort",
  "Other / Off-site"
];

// ---------- Data: Dining (starter set, not “complete”; you can add in-app) ----------
const DINING_SEED = {
  "Magic Kingdom": {
    quick: [
      "Cosmic Ray’s Starlight Café",
      "Columbia Harbour House",
      "Casey’s Corner",
      "Pecos Bill Tall Tale Inn & Café",
      "Sleepy Hollow",
      "Pinocchio Village Haus",
      "The Friar’s Nook",
      "Sunshine Tree Terrace",
      "Gaston’s Tavern"
    ],
    table: [
      "Be Our Guest Restaurant",
      "Cinderella’s Royal Table",
      "The Crystal Palace",
      "Skipper Canteen",
      "Liberty Tree Tavern",
      "Tony’s Town Square Restaurant",
      "The Plaza Restaurant",
      "Diamond Horseshoe"
    ]
  },
  "EPCOT": {
    quick: [
      "Sunshine Seasons",
      "Connections Eatery",
      "Regal Eagle Smokehouse",
      "Les Halles Boulangerie-Patisserie",
      "Katsura Grill",
      "La Cantina de San Angel",
      "Sommerfest",
      "Yorkshire County Fish Shop"
    ],
    table: [
      "Space 220 Restaurant",
      "Le Cellier Steakhouse",
      "Akershus Royal Banquet Hall",
      "San Angel Inn Restaurante",
      "Biergarten Restaurant",
      "Garden Grill Restaurant",
      "Rose & Crown Dining Room",
      "Coral Reef Restaurant"
    ]
  },
  "Hollywood Studios": {
    quick: [
      "Docking Bay 7 Food and Cargo",
      "Ronto Roasters",
      "ABC Commissary",
      "Backlot Express",
      "Woody’s Lunch Box",
      "PizzeRizzo",
      "The Trolley Car Café",
      "Rosie’s All-American Café"
    ],
    table: [
      "Sci-Fi Dine-In Theater Restaurant",
      "50’s Prime Time Café",
      "The Hollywood Brown Derby",
      "Roundup Rodeo BBQ",
      "Mama Melrose’s Ristorante Italiano"
    ]
  },
  "Animal Kingdom": {
    quick: [
      "Satu’li Canteen",
      "Flame Tree Barbecue",
      "Harambe Market",
      "Yak & Yeti Local Food Cafes",
      "Restaurantosaurus",
      "Eight Spoon Café"
    ],
    table: [
      "Tiffins Restaurant",
      "Yak & Yeti Restaurant",
      "Tusker House Restaurant",
      "Rainforest Cafe (AK)"
    ]
  },
  "Disney Springs": {
    quick: [
      "D-Luxe Burger",
      "Chicken Guy!",
      "Earl of Sandwich",
      "Blaze Fast-Fire’d Pizza",
      "The Polite Pig (counter)",
      "Cookes of Dublin"
    ],
    table: [
      "The Boathouse",
      "Wine Bar George",
      "Homecomin’",
      "Raglan Road Irish Pub",
      "Jaleo",
      "Morimoto Asia",
      "STK Steakhouse"
    ]
  }
};

// ---------- Data: Activities ----------
const ACTIVITIES_SEED = {
  free: [
    { park:"Magic Kingdom", title:"Main Street window shopping", note:"Browse, take photos, soak in the vibes", cost:0 },
    { park:"Magic Kingdom", title:"Castle photos at golden hour", note:"Try sunset + night shots", cost:0 },
    { park:"EPCOT", title:"World Showcase stroll", note:"Explore pavilions + street performers", cost:0 },
    { park:"Hollywood Studios", title:"Character sightings (look for pop-ups)", note:"Check the app day-of", cost:0 },
    { park:"Animal Kingdom", title:"Animal trails walk", note:"Great mid-day break", cost:0 },
    { park:"Disney Springs", title:"Live music wander", note:"Evenings often have entertainment", cost:0 },
    { park:"EPCOT", title:"Kidcot-style country stamps (when available)", note:"Fun for kids", cost:0 },
    { park:"Magic Kingdom", title:"Parade viewing spot hunt", note:"Pick your best curb spot early", cost:0 }
  ],
  paid: [
    { park:"Magic Kingdom", title:"Souvenir budget stop", note:"Pick one 'must-have' souvenir", cost:25 },
    { park:"EPCOT", title:"Snack crawl", note:"Choose 3–5 snacks to try", cost:45 },
    { park:"Hollywood Studios", title:"PhotoPass moments", note:"Capture a few posed shots", cost:0 },
    { park:"Animal Kingdom", title:"Specialty drink / treat", note:"One mid-day treat", cost:15 },
    { park:"Disney Springs", title:"Dinner + dessert", note:"Plan a sit-down meal", cost:70 },
    { park:"EPCOT", title:"Festival booth tasting (if running)", note:"3–6 booths", cost:60 }
  ]
};

// ---------- Data: Hidden Finds (82 items; editable) ----------
function buildHiddenFindsSeed() {
  // 82 total: 17 MK, 17 EPCOT, 16 HS, 16 AK, 16 DS = 82
  const packs = [
    { park:"Magic Kingdom", count:17 },
    { park:"EPCOT", count:17 },
    { park:"Hollywood Studios", count:16 },
    { park:"Animal Kingdom", count:16 },
    { park:"Disney Springs", count:16 },
  ];

  const baseHints = [
    "Look near patterned stonework along the main path.",
    "Check decorative molding for a three-circle silhouette.",
    "Scan floor tiles for subtle circle groupings.",
    "Look near queue details and themed props.",
    "Check railings and carved textures near entrances.",
    "Look for circle shapes hidden in signage or graphics.",
    "Check near fountains, planters, or themed murals.",
    "Look for a three-circle shape in shadows or trim.",
  ];

  const items = [];
  let id = 1;
  for (const p of packs) {
    for (let i=1; i<=p.count; i++){
      const hint = baseHints[(id-1) % baseHints.length];
      items.push({
        id: String(id),
        park: p.park,
        title: `${p.park}: Hidden Find #${i}`,
        hint: hint,
        status: "not_found",
        checked: false,
        photoDataUrl: "" // stored as base64 when user uploads
      });
      id++;
    }
  }
  return items;
}

// ---------- Maps (embedded iframes) ----------
const MAPS = [
  { name:"Magic Kingdom", src:"https://www.google.com/maps?q=Magic%20Kingdom%20Park%20Orlando%20FL&output=embed" },
  { name:"EPCOT", src:"https://www.google.com/maps?q=EPCOT%20Orlando%20FL&output=embed" },
  { name:"Hollywood Studios", src:"https://www.google.com/maps?q=Disney's%20Hollywood%20Studios%20Orlando%20FL&output=embed" },
  { name:"Animal Kingdom", src:"https://www.google.com/maps?q=Disney's%20Animal%20Kingdom%20Orlando%20FL&output=embed" },
  { name:"Disney Springs", src:"https://www.google.com/maps?q=Disney%20Springs%20Orlando%20FL&output=embed" },
];

// ---------- Default state ----------
function defaultState(){
  return {
    trip: {
      name: "Family Vacation",
      startDate: "",
      endDate: "",
      resort: "Select a resort…",
      partySize: 4,
      budget: 2500,
      welcomeMessage: "Welcome! Let’s plan your trip ✨"
    },
    itinerary: [
      // a couple starter rows
      makeItineraryRow(1, "08:00", "Magic Kingdom", "Rope drop + first rides", "none", "", 0),
      makeItineraryRow(1, "12:30", "Magic Kingdom", "Lunch break", "quick", "Cosmic Ray’s Starlight Café", 0),
      makeItineraryRow(1, "18:00", "Magic Kingdom", "Dinner", "table", "Skipper Canteen", 0),
    ],
    packing: [
      { id: uid(), text:"Ponchos", checked:false },
      { id: uid(), text:"Sunscreen", checked:false },
      { id: uid(), text:"Portable charger", checked:false },
    ],
    notes: "",
    activities: {
      freeChecked: {},
      paidChecked: {}
    },
    diningCustom: [], // {park,type,name}
    hiddenFinds: buildHiddenFindsSeed(),
    ui: {
      activeTab: "itinerary",
      activitiesSubtab: "free"
    }
  };
}

function makeItineraryRow(day, time, park, plan, diningType, restaurant, cost){
  return {
    id: uid(),
    day: day,           // numeric day index (1..)
    time: time,         // "HH:MM"
    park: park,
    plan: plan,
    diningType: diningType, // "none" | "quick" | "table"
    restaurant: restaurant,
    cost: Number(cost || 0)
  };
}

function uid(){
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

// ---------- Load/Save ----------
function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return defaultState();
    const parsed = JSON.parse(raw);

    // If seeds were missing, patch them:
    parsed.hiddenFinds = parsed.hiddenFinds && parsed.hiddenFinds.length ? parsed.hiddenFinds : buildHiddenFindsSeed();
    parsed.diningCustom = parsed.diningCustom || [];
    parsed.itinerary = parsed.itinerary || [];
    parsed.packing = parsed.packing || [];
    parsed.trip = parsed.trip || defaultState().trip;
    parsed.ui = parsed.ui || defaultState().ui;
    parsed.activities = parsed.activities || defaultState().activities;

    return parsed;
  }catch{
    return defaultState();
  }
}
function saveState(){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

// ---------- DOM ----------
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

let state = loadState();

// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
  bindTabs();
  initSnapshot();
  initDropdowns();
  renderAll();
  bindTopActions();
  startSparkles();
});

// ---------- Tabs ----------
function bindTabs(){
  $$(".tab").forEach(btn => {
    btn.addEventListener("click", () => {
      setActiveTab(btn.dataset.tab);
    });
  });

  $$(".subtab").forEach(btn => {
    btn.addEventListener("click", () => {
      state.ui.activitiesSubtab = btn.dataset.subtab;
      saveState();
      renderActivities();
      $$(".subtab").forEach(b => b.classList.toggle("active", b.dataset.subtab === state.ui.activitiesSubtab));
    });
  });
}
function setActiveTab(tabName){
  state.ui.activeTab = tabName;
  saveState();
  $$(".tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tabName));
  $$(".tabPanel").forEach(p => p.classList.toggle("active", p.id === `tab-${tabName}`));
  // Re-render when switching if needed
  if(tabName === "maps") renderMaps();
  if(tabName === "dining") renderDining();
  if(tabName === "activities") renderActivities();
  if(tabName === "hidden") renderHiddenFinds();
}

// ---------- Snapshot ----------
function initSnapshot(){
  $("#tripName").addEventListener("input", e => { state.trip.name = e.target.value; syncHero(); saveState(); });
  $("#startDate").addEventListener("input", e => { state.trip.startDate = e.target.value; syncHero(); saveState(); });
  $("#endDate").addEventListener("input", e => { state.trip.endDate = e.target.value; syncHero(); saveState(); });
  $("#resortSelect").addEventListener("change", e => { state.trip.resort = e.target.value; syncHero(); saveState(); });
  $("#partySize").addEventListener("input", e => { state.trip.partySize = Number(e.target.value || 1); syncHero(); saveState(); });
  $("#budget").addEventListener("input", e => { state.trip.budget = Number(e.target.value || 0); renderBudget(); saveState(); });
  $("#welcomeMessage").addEventListener("input", e => { state.trip.welcomeMessage = e.target.value; syncHero(); saveState(); });
}

// ---------- Dropdowns ----------
function initDropdowns(){
  // Resort select
  const resort = $("#resortSelect");
  resort.innerHTML = "";
  RESORTS.forEach(r => {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    resort.appendChild(opt);
  });

  // Itinerary filter park + add day park
  fillParkSelect($("#itFilterPark"), true);
  fillParkSelect($("#addDayPark"), false);
  fillParkSelect($("#actParkFilter"), true);
  fillParkSelect($("#dinPark"), false);
  fillParkSelect($("#customRestaurantPark"), false);
  fillParkSelect($("#hmPark"), true);

  $("#itFilterPark").addEventListener("change", () => renderItinerary());
  $("#btnClearParkFilter").addEventListener("click", () => {
    $("#itFilterPark").value = "";
    renderItinerary();
  });

  $("#btnAddDay").addEventListener("click", () => {
    const park = $("#addDayPark").value || "Magic Kingdom";
    const nextDay = getNextDayNumber();
    // Add a row at 08:00 for that park
    state.itinerary.push(makeItineraryRow(nextDay, "08:00", park, "", "none", "", 0));
    saveState();
    renderItinerary();
    renderBudget();
  });

  $("#btnAddRow").addEventListener("click", () => {
    const nextDay = getNextDayNumber();
    state.itinerary.push(makeItineraryRow(nextDay, "12:00", "Magic Kingdom", "", "none", "", 0));
    saveState();
    renderItinerary();
  });

  // Notes
  $("#notesText").addEventListener("input", e => {
    state.notes = e.target.value;
    saveState();
  });

  // Packing
  $("#btnPackingAdd").addEventListener("click", () => {
    const val = $("#packingNew").value.trim();
    if(!val) return;
    state.packing.push({ id: uid(), text: val, checked:false });
    $("#packingNew").value = "";
    saveState();
    renderPacking();
  });
  $("#packingNew").addEventListener("keydown", (e) => {
    if(e.key === "Enter"){
      e.preventDefault();
      $("#btnPackingAdd").click();
    }
  });

  // Activities filters
  $("#actParkFilter").addEventListener("change", renderActivities);
  $("#actSearch").addEventListener("input", renderActivities);

  // Dining filters
  $("#dinPark").addEventListener("change", renderDining);
  $("#dinType").addEventListener("change", renderDining);
  $("#dinSearch").addEventListener("input", renderDining);

  // Add custom restaurant
  $("#btnAddCustomRestaurant").addEventListener("click", () => {
    const name = $("#customRestaurantName").value.trim();
    const park = $("#customRestaurantPark").value;
    const type = $("#customRestaurantType").value;
    if(!name || !park || !type) return;

    state.diningCustom.push({ id: uid(), name, park, type });
    $("#customRestaurantName").value = "";
    saveState();
    renderDining();
    renderItinerary(); // so dropdowns refresh
  });

  // Hidden finds filters
  $("#hmPark").addEventListener("change", renderHiddenFinds);
  $("#hmSearch").addEventListener("input", renderHiddenFinds);

  // Hidden find detail bindings
  $("#hmTitle").addEventListener("input", () => updateSelectedHiddenField("title", $("#hmTitle").value));
  $("#hmHint").addEventListener("input", () => updateSelectedHiddenField("hint", $("#hmHint").value));
  $("#hmStatus").addEventListener("change", () => updateSelectedHiddenField("status", $("#hmStatus").value));
  $("#hmChecked").addEventListener("change", () => updateSelectedHiddenField("checked", $("#hmChecked").checked));

  $("#hmPhoto").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const dataUrl = await fileToDataUrl(file);
    updateSelectedHiddenField("photoDataUrl", dataUrl);
    e.target.value = "";
  });

  $("#btnRemoveHmPhoto").addEventListener("click", () => {
    updateSelectedHiddenField("photoDataUrl", "");
  });
}

function fillParkSelect(selectEl, includeAll){
  selectEl.innerHTML = "";
  if(includeAll){
    const optAll = document.createElement("option");
    optAll.value = "";
    optAll.textContent = "All Parks";
    selectEl.appendChild(optAll);
  }
  for(const p of PARKS){
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    selectEl.appendChild(opt);
  }
}

// ---------- Render all ----------
function renderAll(){
  // restore UI tab
  setActiveTab(state.ui.activeTab || "itinerary");
  $$(".subtab").forEach(b => b.classList.toggle("active", b.dataset.subtab === (state.ui.activitiesSubtab || "free")));

  // load snapshot fields
  $("#tripName").value = state.trip.name || "";
  $("#startDate").value = state.trip.startDate || "";
  $("#endDate").value = state.trip.endDate || "";
  $("#resortSelect").value = state.trip.resort || "Select a resort…";
  $("#partySize").value = state.trip.partySize ?? 4;
  $("#budget").value = state.trip.budget ?? 0;
  $("#welcomeMessage").value = state.trip.welcomeMessage || "";

  $("#notesText").value = state.notes || "";

  syncHero();
  renderItinerary();
  renderPacking();
  renderActivities();
  renderDining();
  renderMaps();
  renderHiddenFinds();
  renderBudget();
}

// ---------- Hero sync ----------
function syncHero(){
  $("#heroWelcome").textContent = (state.trip.welcomeMessage || "Welcome! ✨");
  const dates = formatDateRange(state.trip.startDate, state.trip.endDate);
  $("#pillDates").textContent = `Dates: ${dates}`;
  $("#pillResort").textContent = `Resort: ${state.trip.resort || "—"}`;
  $("#pillParty").textContent = `Party: ${state.trip.partySize || "—"}`;

  $("#statDates").textContent = dates;
  $("#statResort").textContent = state.trip.resort || "—";
  $("#statParty").textContent = String(state.trip.partySize || "—");

  $("#pillDates").title = "Start → End";
  $("#pillResort").title = "Your resort/hotel";
  $("#pillParty").title = "Party size";
}

function formatDateRange(start, end){
  if(!start && !end) return "—";
  if(start && !end) return start;
  if(!start && end) return end;
  return `${start} → ${end}`;
}

// ---------- Itinerary ----------
function renderItinerary(){
  const tbody = $("#itineraryBody");
  tbody.innerHTML = "";

  const filterPark = $("#itFilterPark").value || "";

  const rows = [...state.itinerary].sort((a,b) => {
    if(a.day !== b.day) return a.day - b.day;
    return (a.time || "").localeCompare(b.time || "");
  }).filter(r => {
    if(!filterPark) return true;
    return r.park === filterPark;
  });

  for(const row of rows){
    const tr = document.createElement("tr");

    // Day
    tr.appendChild(tdInputNumber(row, "day", 1, 50, (val)=>{
      row.day = Number(val||1);
      saveState();
      renderBudget();
    }));

    // Time
    tr.appendChild(tdTime(row));

    // Park
    tr.appendChild(tdParkSelect(row));

    // Plan
    tr.appendChild(tdTextInput(row, "plan", "What are you doing?"));

    // Dining Type
    tr.appendChild(tdDiningType(row));

    // Restaurant (depends on park + dining type)
    tr.appendChild(tdRestaurant(row));

    // Cost
    tr.appendChild(tdCost(row));

    // Actions
    const tdActions = document.createElement("td");
    tdActions.className = "colActions";
    const del = document.createElement("button");
    del.className = "iconBtn danger";
    del.textContent = "✕";
    del.title = "Delete row";
    del.addEventListener("click", () => {
      state.itinerary = state.itinerary.filter(r => r.id !== row.id);
      saveState();
      renderItinerary();
      renderBudget();
    });
    tdActions.appendChild(del);
    tr.appendChild(tdActions);

    tbody.appendChild(tr);
  }

  renderBudget();
}

function tdInputNumber(row, key, min, max, onChange){
  const td = document.createElement("td");
  const input = document.createElement("input");
  input.type = "number";
  input.min = String(min);
  input.max = String(max);
  input.value = String(row[key] ?? min);
  input.addEventListener("input", () => {
    row[key] = Number(input.value || min);
    saveState();
    onChange?.(input.value);
  });
  td.appendChild(input);
  return td;
}

function tdTime(row){
  const td = document.createElement("td");
  const input = document.createElement("input");
  input.type = "time";
  input.value = row.time || "08:00";
  input.addEventListener("input", () => {
    row.time = input.value || "08:00";
    saveState();
  });
  td.appendChild(input);
  return td;
}

function tdParkSelect(row){
  const td = document.createElement("td");
  const sel = document.createElement("select");
  for(const p of PARKS){
    const opt = document.createElement("option");
    opt.value = p;
    opt.textContent = p;
    sel.appendChild(opt);
  }
  sel.value = row.park || "Magic Kingdom";
  sel.addEventListener("change", () => {
    row.park = sel.value;
    // If dining type selected, ensure restaurant is valid
    if(row.diningType === "quick" || row.diningType === "table"){
      const options = getRestaurantsFor(row.park, row.diningType);
      if(!options.includes(row.restaurant)){
        row.restaurant = options[0] || "";
      }
    } else {
      row.restaurant = "";
    }
    saveState();
    renderItinerary();
  });
  td.appendChild(sel);
  return td;
}

function tdTextInput(row, key, placeholder){
  const td = document.createElement("td");
  const input = document.createElement("input");
  input.type = "text";
  input.value = row[key] || "";
  input.placeholder = placeholder || "";
  input.addEventListener("input", () => {
    row[key] = input.value;
    saveState();
  });
  td.appendChild(input);
  return td;
}

function tdDiningType(row){
  const td = document.createElement("td");
  const sel = document.createElement("select");
  const opts = [
    { v:"none", t:"—" },
    { v:"quick", t:"Quick Service" },
    { v:"table", t:"Table Service" },
  ];
  for(const o of opts){
    const opt = document.createElement("option");
    opt.value = o.v;
    opt.textContent = o.t;
    sel.appendChild(opt);
  }
  sel.value = row.diningType || "none";
  sel.addEventListener("change", () => {
    row.diningType = sel.value;
    if(row.diningType === "none"){
      row.restaurant = "";
    }else{
      const list = getRestaurantsFor(row.park, row.diningType);
      if(!list.includes(row.restaurant)){
        row.restaurant = list[0] || "";
      }
    }
    saveState();
    renderItinerary();
  });
  td.appendChild(sel);
  return td;
}

function tdRestaurant(row){
  const td = document.createElement("td");
  if(row.diningType !== "quick" && row.diningType !== "table"){
    const input = document.createElement("input");
    input.type = "text";
    input.value = "";
    input.placeholder = "Select dining type first";
    input.disabled = true;
    td.appendChild(input);
    return td;
  }

  const sel = document.createElement("select");
  const options = getRestaurantsFor(row.park, row.diningType);
  // Add "Custom..." option at end
  options.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    sel.appendChild(opt);
  });
  const optCustom = document.createElement("option");
  optCustom.value = "__custom__";
  optCustom.textContent = "Other (type it)…";
  sel.appendChild(optCustom);

  // If current restaurant not in list and exists, show custom mode
  if(row.restaurant && !options.includes(row.restaurant)){
    sel.value = "__custom__";
  } else {
    sel.value = row.restaurant || (options[0] || "");
  }

  const customInput = document.createElement("input");
  customInput.type = "text";
  customInput.placeholder = "Type restaurant name…";
  customInput.value = row.restaurant && !options.includes(row.restaurant) ? row.restaurant : "";
  customInput.style.display = (sel.value === "__custom__") ? "block" : "none";

  sel.addEventListener("change", () => {
    if(sel.value === "__custom__"){
      customInput.style.display = "block";
      row.restaurant = customInput.value || "";
    } else {
      customInput.style.display = "none";
      row.restaurant = sel.value;
    }
    saveState();
  });

  customInput.addEventListener("input", () => {
    row.restaurant = customInput.value;
    saveState();
  });

  td.appendChild(sel);
  td.appendChild(customInput);
  return td;
}

function tdCost(row){
  const td = document.createElement("td");
  const input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.step = "1";
  input.value = String(row.cost ?? 0);
  input.addEventListener("input", () => {
    row.cost = Number(input.value || 0);
    saveState();
    renderBudget();
  });
  td.appendChild(input);
  return td;
}

function getNextDayNumber(){
  const maxDay = state.itinerary.reduce((m,r)=>Math.max(m, Number(r.day||1)), 1);
  return maxDay + 1;
}

// ---------- Budget ----------
function renderBudget(){
  const used = state.itinerary.reduce((sum,r)=>sum + (Number(r.cost)||0), 0);
  const budget = Number(state.trip.budget || 0);
  const pct = budget > 0 ? Math.min(100, Math.round((used / budget) * 100)) : 0;

  $("#budgetText").textContent = `$${used.toFixed(0)} used${budget ? ` of $${budget.toFixed(0)}` : ""}`;
  $("#budgetFill").style.width = `${pct}%`;
}

// ---------- Packing ----------
function renderPacking(){
  const list = $("#packingList");
  list.innerHTML = "";
  for(const item of state.packing){
    const row = document.createElement("div");
    row.className = "listItem";

    const left = document.createElement("div");
    left.className = "listLeft";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "check";
    cb.checked = !!item.checked;
    cb.addEventListener("change", () => {
      item.checked = cb.checked;
      saveState();
    });

    const text = document.createElement("div");
    const title = document.createElement("div");
    title.className = "listTitle";
    title.textContent = item.text;
    text.appendChild(title);

    left.appendChild(cb);
    left.appendChild(text);

    const right = document.createElement("div");
    right.className = "listRight";

    const del = document.createElement("button");
    del.className = "iconBtn danger";
    del.textContent = "✕";
    del.addEventListener("click", () => {
      state.packing = state.packing.filter(p => p.id !== item.id);
      saveState();
      renderPacking();
    });

    right.appendChild(del);
    row.appendChild(left);
    row.appendChild(right);
    list.appendChild(row);
  }
}

// ---------- Activities ----------
function renderActivities(){
  const sub = state.ui.activitiesSubtab || "free";
  const parkFilter = $("#actParkFilter").value || "";
  const q = ($("#actSearch").value || "").toLowerCase().trim();

  const root = $("#activitiesList");
  root.innerHTML = "";

  const list = (sub === "free" ? ACTIVITIES_SEED.free : ACTIVITIES_SEED.paid)
    .filter(a => !parkFilter || a.park === parkFilter)
    .filter(a => !q || (a.title.toLowerCase().includes(q) || (a.note||"").toLowerCase().includes(q)));

  for(const a of list){
    const card = document.createElement("div");
    card.className = "gridCard";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = a.title;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${a.park} • ${sub === "free" ? "Free" : `Est. $${Number(a.cost||0)}`}`;

    const note = document.createElement("div");
    note.className = "meta";
    note.textContent = a.note || "";

    const actions = document.createElement("div");
    actions.className = "actions";

    const btnAdd = document.createElement("button");
    btnAdd.className = "btn";
    btnAdd.textContent = "Add to Itinerary";
    btnAdd.addEventListener("click", () => {
      const day = guessDayFromDates();
      state.itinerary.push(makeItineraryRow(day, "12:00", a.park, a.title, "none", "", Number(a.cost||0)));
      saveState();
      renderItinerary();
      renderBudget();
      setActiveTab("itinerary");
    });

    actions.appendChild(btnAdd);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(note);
    card.appendChild(actions);

    root.appendChild(card);
  }
}

function guessDayFromDates(){
  // Add to the last day by default, or 1 if empty
  const maxDay = state.itinerary.reduce((m,r)=>Math.max(m, Number(r.day||1)), 1);
  return maxDay || 1;
}

// ---------- Dining ----------
function getRestaurantsFor(park, type){
  const base = (DINING_SEED[park] && DINING_SEED[park][type]) ? [...DINING_SEED[park][type]] : [];
  const custom = state.diningCustom
    .filter(r => r.park === park && r.type === type)
    .map(r => r.name);
  const all = [...new Set([...base, ...custom])].filter(Boolean);
  all.sort((a,b)=>a.localeCompare(b));
  return all;
}

function renderDining(){
  const park = $("#dinPark").value || "Magic Kingdom";
  const type = $("#dinType").value || "quick";
  const q = ($("#dinSearch").value || "").toLowerCase().trim();

  const root = $("#diningList");
  root.innerHTML = "";

  const restaurants = getRestaurantsFor(park, type)
    .filter(r => !q || r.toLowerCase().includes(q));

  for(const name of restaurants){
    const card = document.createElement("div");
    card.className = "gridCard";

    const title = document.createElement("div");
    title.className = "title";
    title.textContent = name;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = `${park} • ${type === "quick" ? "Quick Service" : "Table Service"}`;

    const actions = document.createElement("div");
    actions.className = "actions";

    const btn = document.createElement("button");
    btn.className = "btn";
    btn.textContent = "Add to Itinerary";
    btn.addEventListener("click", () => {
      const day = guessDayFromDates();
      // Add as a dining row, but let you set time later
      state.itinerary.push(makeItineraryRow(day, "12:00", park, "Dining", type, name, 0));
      saveState();
      renderItinerary();
      setActiveTab("itinerary");
    });

    actions.appendChild(btn);

    card.appendChild(title);
    card.appendChild(meta);
    card.appendChild(actions);

    root.appendChild(card);
  }
}

// ---------- Maps ----------
function renderMaps(){
  const grid = $("#mapGrid");
  grid.innerHTML = "";
  for(const m of MAPS){
    const card = document.createElement("div");
    card.className = "mapCard";

    const head = document.createElement("div");
    head.className = "mapCardHeader";
    head.textContent = m.name;

    const iframe = document.createElement("iframe");
    iframe.className = "mapFrame";
    iframe.loading = "lazy";
    iframe.referrerPolicy = "no-referrer-when-downgrade";
    iframe.src = m.src;

    card.appendChild(head);
    card.appendChild(iframe);
    grid.appendChild(card);
  }
}

// ---------- Hidden Finds ----------
let selectedHmId = null;

function renderHiddenFinds(){
  const park = $("#hmPark").value || "";
  const q = ($("#hmSearch").value || "").toLowerCase().trim();

  const list = $("#hmList");
  list.innerHTML = "";

  const items = state.hiddenFinds
    .filter(i => !park || i.park === park)
    .filter(i => !q || i.title.toLowerCase().includes(q) || (i.hint||"").toLowerCase().includes(q));

  for(const item of items){
    const row = document.createElement("div");
    row.className = "listItem";
    row.style.cursor = "pointer";

    const left = document.createElement("div");
    left.className = "listLeft";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.className = "check";
    cb.checked = !!item.checked;
    cb.addEventListener("click", (e) => {
      e.stopPropagation();
    });
    cb.addEventListener("change", () => {
      item.checked = cb.checked;
      item.status = item.checked ? "found" : "not_found";
      saveState();
      // update detail panel if selected
      if(selectedHmId === item.id) showHiddenDetail(item.id);
      renderHiddenFinds(); // keep list updated
    });

    const text = document.createElement("div");
    const title = document.createElement("div");
    title.className = "listTitle";
    title.textContent = item.title;

    const meta = document.createElement("div");
    meta.className = "listMeta";
    meta.textContent = `${item.park} • ${item.status === "found" ? "Found" : "Not found"}`;

    text.appendChild(title);
    text.appendChild(meta);

    left.appendChild(cb);
    left.appendChild(text);

    const right = document.createElement("div");
    right.className = "listRight";

    const badge = document.createElement("div");
    badge.className = "listMeta";
    badge.style.fontWeight = "950";
    badge.textContent = item.status === "found" ? "✅" : "🔎";

    right.appendChild(badge);

    row.appendChild(left);
    row.appendChild(right);

    row.addEventListener("click", () => showHiddenDetail(item.id));

    list.appendChild(row);
  }

  // keep selection if exists
  if(selectedHmId){
    const stillExists = state.hiddenFinds.some(i => i.id === selectedHmId);
    if(!stillExists){
      selectedHmId = null;
      hideHiddenDetail();
    }
  }
}

function showHiddenDetail(id){
  selectedHmId = id;
  const item = state.hiddenFinds.find(i => i.id === id);
  if(!item) return;

  $("#hmDetailEmpty").style.display = "none";
  $("#hmDetail").classList.remove("hidden");

  $("#hmTitle").value = item.title || "";
  $("#hmHint").value = item.hint || "";
  $("#hmStatus").value = item.status || "not_found";
  $("#hmChecked").checked = !!item.checked;

  const img = $("#hmPhotoPreview");
  const empty = $("#hmPhotoEmpty");
  if(item.photoDataUrl){
    img.src = item.photoDataUrl;
    img.style.display = "block";
    empty.style.display = "none";
  } else {
    img.removeAttribute("src");
    img.style.display = "none";
    empty.style.display = "block";
  }
}

function hideHiddenDetail(){
  $("#hmDetailEmpty").style.display = "block";
  $("#hmDetail").classList.add("hidden");
}

function updateSelectedHiddenField(field, value){
  if(!selectedHmId) return;
  const item = state.hiddenFinds.find(i => i.id === selectedHmId);
  if(!item) return;

  item[field] = value;

  // keep status/checked in sync
  if(field === "checked"){
    item.status = value ? "found" : "not_found";
    $("#hmStatus").value = item.status;
  }
  if(field === "status"){
    item.checked = (value === "found");
    $("#hmChecked").checked = item.checked;
  }

  saveState();
  showHiddenDetail(selectedHmId);
  // list refresh to show status changes
  renderHiddenFinds();
}

function fileToDataUrl(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------- Top actions ----------
function bindTopActions(){
  $("#btnReset").addEventListener("click", () => {
    const ok = confirm("Reset everything on this device? This cannot be undone.");
    if(!ok) return;
    localStorage.removeItem(STORAGE_KEY);
    state = defaultState();
    saveState();
    renderAll();
  });

  $("#btnExportBackup").addEventListener("click", () => {
    const data = JSON.stringify(state, null, 2);
    downloadFile(`vacation_planner_backup_${todayStamp()}.json`, data, "application/json");
  });

  $("#fileImportBackup").addEventListener("change", async (e) => {
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    try{
      const text = await file.text();
      const parsed = JSON.parse(text);
      // minimal validation
      if(!parsed.trip || !parsed.itinerary || !parsed.hiddenFinds){
        alert("That backup file doesn’t look right.");
        return;
      }
      state = parsed;
      saveState();
      renderAll();
      alert("Backup imported!");
    }catch{
      alert("Could not import that file.");
    }finally{
      e.target.value = "";
    }
  });

  $("#btnExportICS").addEventListener("click", () => {
    const ics = buildICS();
    downloadFile(`vacation_planner_${todayStamp()}.ics`, ics, "text/calendar");
    alert("Calendar file downloaded (.ics). Import it into Google Calendar or iOS Calendar.");
  });
}

function todayStamp(){
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return `${yyyy}-${mm}-${dd}`;
}

function downloadFile(filename, content, mime){
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ---------- ICS (Calendar Export) ----------
function buildICS(){
  // Uses trip.startDate + day offset
  // Each itinerary row becomes a VEVENT if it has a park/plan
  const startDate = state.trip.startDate;
  if(!startDate){
    alert("Add a Start date first (Trip Snapshot).");
    return "";
  }

  const events = state.itinerary
    .slice()
    .sort((a,b)=> (a.day-b.day) || (a.time||"").localeCompare(b.time||""))
    .map(row => rowToEvent(row, startDate))
    .filter(Boolean);

  const lines = [];
  lines.push("BEGIN:VCALENDAR");
  lines.push("VERSION:2.0");
  lines.push("PRODID:-//Vacation Planner//EN");
  lines.push("CALSCALE:GREGORIAN");
  lines.push("METHOD:PUBLISH");

  for(const ev of events){
    lines.push("BEGIN:VEVENT");
    lines.push(`UID:${ev.uid}`);
    lines.push(`DTSTAMP:${ev.dtstamp}`);
    lines.push(`DTSTART:${ev.dtstart}`);
    lines.push(`DTEND:${ev.dtend}`);
    lines.push(`SUMMARY:${escapeICS(ev.summary)}`);
    lines.push(`DESCRIPTION:${escapeICS(ev.description)}`);
    lines.push(`LOCATION:${escapeICS(ev.location)}`);
    lines.push("END:VEVENT");
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n");
}

function rowToEvent(row, tripStart){
  // Compute date: tripStart + (day-1)
  const base = new Date(tripStart + "T00:00:00");
  if(isNaN(base.getTime())) return null;

  const dayOffset = Math.max(0, Number(row.day||1) - 1);
  const date = new Date(base);
  date.setDate(base.getDate() + dayOffset);

  // Parse time
  const t = row.time || "12:00";
  const [hh, mm] = t.split(":").map(n => Number(n||0));
  date.setHours(hh, mm, 0, 0);

  const end = new Date(date);
  end.setMinutes(end.getMinutes() + 60); // default 1 hour block

  const summaryParts = [];
  if(row.park) summaryParts.push(row.park);
  if(row.plan) summaryParts.push(row.plan);
  const summary = summaryParts.join(" — ").slice(0, 180);

  let description = "";
  if(row.diningType === "quick" || row.diningType === "table"){
    description += `Dining: ${row.diningType === "quick" ? "Quick Service" : "Table Service"}`;
    if(row.restaurant) description += ` • ${row.restaurant}`;
    description += "\\n";
  }
  if(row.cost) description += `Cost: $${Number(row.cost||0)}\\n`;
  description += `Trip: ${state.trip.name || "Vacation"}\\n`;

  return {
    uid: `${row.id}@vacation-planner`,
    dtstamp: toICSDateTime(new Date()),
    dtstart: toICSDateTime(date),
    dtend: toICSDateTime(end),
    summary: summary || "Vacation Plan",
    description,
    location: row.park || "Walt Disney World"
  };
}

function toICSDateTime(d){
  // floating local time: YYYYMMDDTHHMMSS
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  const hh = String(d.getHours()).padStart(2,"0");
  const mi = String(d.getMinutes()).padStart(2,"0");
  const ss = String(d.getSeconds()).padStart(2,"0");
  return `${yyyy}${mm}${dd}T${hh}${mi}${ss}`;
}

function escapeICS(s){
  return String(s || "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

// ---------- Sparkles (fairy dust) ----------
function startSparkles(){
  const canvas = $("#sparkles");
  const ctx = canvas.getContext("2d");
  let w=0,h=0;
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  function resize(){
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    ctx.setTransform(DPR,0,0,DPR,0,0);
  }
  window.addEventListener("resize", resize);
  resize();

  const particles = [];
  const max = 85;

  function spawn(){
    if(particles.length >= max) return;
    particles.push({
      x: Math.random()*w,
      y: Math.random()*h,
      r: 0.8 + Math.random()*2.2,
      a: 0.15 + Math.random()*0.45,
      vx: -0.15 + Math.random()*0.3,
      vy: -0.10 + Math.random()*0.25,
      tw: 0.01 + Math.random()*0.03,
      t: Math.random()*Math.PI*2
    });
  }
  for(let i=0;i<max;i++) spawn();

  function tick(){
    ctx.clearRect(0,0,w,h);
    for(const p of particles){
      p.t += p.tw;
      p.x += p.vx;
      p.y += p.vy;

      // wrap
      if(p.x < -20) p.x = w+20;
      if(p.x > w+20) p.x = -20;
      if(p.y < -20) p.y = h+20;
      if(p.y > h+20) p.y = -20;

      const twinkle = (Math.sin(p.t)*0.5+0.5);
      const alpha = p.a * (0.35 + twinkle*0.95);

      // glow dot
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fill();

      // tiny cross sparkle sometimes
      if(twinkle > 0.85){
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x - p.r*2.4, p.y);
        ctx.lineTo(p.x + p.r*2.4, p.y);
        ctx.moveTo(p.x, p.y - p.r*2.4);
        ctx.lineTo(p.x, p.y + p.r*2.4);
        ctx.stroke();
      }
    }
    requestAnimationFrame(tick);
  }
  tick();
}

// ---------- Final: initial render helpers ----------
function bindTopActionsOnce(){}

function renderBackupStuff(){}

// ---------- Boot ----------
function bindTopActionsOnceNoop(){}

function renderItineraryOnce(){}

// ---------- Ensure UI reflects active tab on load ----------
(function(){
  // nothing here; DOMContentLoaded handles it
})();