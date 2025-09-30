// Default food items
const defaultItems = [
  { name: "Roti", calories: 120, unit: "1 pc" },
  { name: "Rice", calories: 200, unit: "1 bowl" },
  { name: "Milk", calories: 150, unit: "250 ml" },
  { name: "Egg", calories: 70, unit: "1 pc" },
  { name: "Chhena", calories: 250, unit: "100 g" },
  { name: "Sprouts", calories: 100, unit: "1 bowl" },
  { name: "Potato", calories: 130, unit: "1 pc" },
  { name: "Paneer", calories: 300, unit: "100 g" },
  { name: "Paratha", calories: 220, unit: "1 pc" },
  { name: "Banana", calories: 100, unit: "1 pc" }
];

let foodItems = [];
let consumed = 0;
let target = 5000;

// --- Local Storage Keys ---
const STORAGE_KEY = "calorieTrackerData";
const DATE_KEY = "calorieTrackerDate";

// --- Get Today’s Date (12 AM – 12 PM cycle) ---
function getTodayKey() {
  const now = new Date();
  // Format: YYYY-MM-DD
  return now.toISOString().slice(0, 10);
}

// --- Load Saved Data ---
function loadData() {
  const savedDate = localStorage.getItem(DATE_KEY);
  const today = getTodayKey();

  if (savedDate !== today) {
    // New day → reset data
    localStorage.setItem(DATE_KEY, today);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: defaultItems, target: 5000 }));
    return { items: defaultItems, target: 5000 };
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    return JSON.parse(saved);
  }
  return { items: defaultItems, target: 5000 };
}

// --- Save Data ---
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ items: foodItems, target }));
  localStorage.setItem(DATE_KEY, getTodayKey());
}

// --- Render Food Table ---
function renderTable() {
  const tbody = document.querySelector("#foodTable tbody");
  tbody.innerHTML = "";
  foodItems.forEach((item, index) => {
    item.qty = item.qty || 0;
    let total = item.calories * item.qty;
    tbody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.calories}</td>
        <td>${item.unit}</td>
        <td>
          <div class="qty-control">
            <button onclick="updateQty(${index}, 1)">➕</button>
            <span class="qty-number">${item.qty}</span>
            <button onclick="updateQty(${index}, -1)">➖</button>
          </div>
        </td>
        <td>${total}</td>
      </tr>
    `;
  });
  updateSummary();
}

// --- Update Quantity ---
function updateQty(index, change) {
  if (foodItems[index].name === "Sprouts" && foodItems[index].qty >= 1 && change > 0) {
    alert("Sprouts can only be taken once a day!");
    return;
  }
  foodItems[index].qty = Math.max(0, (foodItems[index].qty || 0) + change);
  saveData();
  renderTable();
}

// --- Update Summary ---
function updateSummary() {
  consumed = foodItems.reduce((sum, item) => sum + (item.calories * item.qty), 0);
  target = parseInt(document.getElementById("targetCalories").value) || 0;
  let remaining = target - consumed;

  document.getElementById("consumedCalories").innerText = consumed;
  document.getElementById("remainingCalories").innerText = remaining >= 0 ? remaining : 0;
  document.getElementById("progress").style.width = `${Math.min((consumed / target) * 100, 100)}%`;

  saveData();
}

// --- Add New Item ---
document.getElementById("addItemBtn").addEventListener("click", () => {
  let name = prompt("Enter item name:");
  let cal = prompt("Enter calories per unit:");
  let unit = prompt("Enter unit (e.g. 1 bowl, 100g, 250ml):");
  if (name && cal) {
    foodItems.push({ name, calories: parseInt(cal), unit, qty: 0 });
    saveData();
    renderTable();
  }
});

// --- Update target ---
document.getElementById("targetCalories").addEventListener("input", () => {
  target = parseInt(document.getElementById("targetCalories").value) || 0;
  saveData();
  updateSummary();
});

// --- On Load ---
const savedData = loadData();
foodItems = savedData.items;
target = savedData.target;
document.getElementById("targetCalories").value = target;

renderTable();
