const KEY = "vacation_planner_v2";

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
notes: ""
};

const $ = (id) => document.getElementById(id);
const uid = () => Math.random().toString(16).slice(2) + Date.now().toString(16);

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

// inputs
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
$(id).addEventListener("input", () => {
state[id] = $(id).value;
save();
renderHeader();
});
});
}

function planRow(item) {
const row = document.createElement("div");
row.className = "row";

const day = document.createElement("input");
day.placeholder = "Day 1 / MK Day";
day.value = item.day || "";
day.addEventListener("input", () => { item.day = day.value; save(); });

const time = document.createElement("input");
time.placeholder = "8:00 AM";
time.value = item.time || "";
time.addEventListener("input", () => { item.time = time.value; save(); });

const plan = document.createElement("input");
plan.placeholder = "What are we doing?";
plan.value = item.text || "";
plan.addEventListener("input", () => { item.text = plan.value; save(); });

const del = document.createElement("button");
del.className = "icon";
del.textContent = "✕";
del.addEventListener("click", () => {
state.plans = state.plans.filter(p => p.id !== item.id);
save();
renderPlans();
});

row.append(day, time, plan, del);
return row;
}

function renderPlans() {
const wrap = $("planRows");
wrap.innerHTML = "";
state.plans.forEach(p => wrap.appendChild(planRow(p)));
}

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
state.plans.push({ id: uid(), day: "", time: "", text: "" });
save();
renderPlans();
});

$("addPack").addEventListener("click", () => {
state.packing.push({ id: uid(), text: "", done: false });
save();
renderPacking();
});

$("notes").addEventListener("input", () => {
state.notes = $("notes").value;
save();
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

function seedIfEmpty() {
if (state.plans.length === 0) {
state.plans.push(
{ id: uid(), day: "Day 1 (Arrival)", time: "", text: "Check in + pool time" },
{ id: uid(), day: "Day 2", time: "", text: "Morning fun • break • night show" }
);
}
if (state.packing.length === 0) {
state.packing.push(
{ id: uid(), text: "Power bank / chargers", done: false },
{ id: uid(), text: "Ponchos / rain jackets", done: false },
{ id: uid(), text: "Water bottles", done: false }
);
}
if (!state.notes) state.notes = "";
$("notes").value = state.notes;
}

function init() {
load();
setupIntro();
setupTabs();
setupButtons();
bindSnapshotInputs();
seedIfEmpty();
save();
renderHeader();
renderPlans();
renderPacking();
}

init();
