let dailyTarget = 5000;
let consumed = 0;

const defaultFoods = [
  { name: "Roti", unit: "1 piece", calories: 80 },
  { name: "Rice", unit: "1 bowl", calories: 200 },
  { name: "Milk", unit: "250ml", calories: 150 },
  { name: "Egg", unit: "1 piece", calories: 70 },
  { name: "Chhena", unit: "100g", calories: 265 },
  { name: "Paneer", unit: "100g", calories: 300 },
  { name: "Sprouts", unit: "1 bowl", calories: 120 },
  { name: "Potato", unit: "1 medium", calories: 110 },
  { name: "Paratha", unit: "1 piece", calories: 180 },
  { name: "Banana", unit: "1 piece", calories: 100 }
];

let foods = [];

function renderTable() {
  const table = document.getElementById("foodTable");
  table.innerHTML = "";

  foods.forEach((food, index) => {
    const total = food.calories * food.qty;
    const row = `
      <tr>
        <td>${index + 1}</td>
        <td>${food.name}</td>
        <td>${food.unit}</td>
        <td>${food.calories}</td>
        <td>
          <button class="quantity-btn" onclick="updateQty(${index}, -1)">-</button>
          ${food.qty}
          <button class="quantity-btn" onclick="updateQty(${index}, 1)">+</button>
        </td>
        <td>${total}</td>
      </tr>
    `;
    table.innerHTML += row;
  });

  updateStats();
}

function updateQty(index, change) {
  if (foods[index].qty + change >= 0) {
    foods[index].qty += change;
  }
  renderTable();
}

function updateStats() {
  consumed = foods.reduce((sum, f) => sum + f.calories * f.qty, 0);
  document.getElementById("consumed").innerText = consumed;
  document.getElementById("remaining").innerText = dailyTarget - consumed;

  const percent = Math.min((consumed / dailyTarget) * 100, 100);
  document.getElementById("progressBar").style.width = percent + "%";
}

function changeTarget(amount) {
  dailyTarget = parseInt(document.getElementById("dailyTarget").value) + amount;
  if (dailyTarget < 0) dailyTarget = 0;
  document.getElementById("dailyTarget").value = dailyTarget;
  updateStats();
}

document.getElementById("dailyTarget").addEventListener("input", (e) => {
  dailyTarget = parseInt(e.target.value) || 0;
  updateStats();
});

document.getElementById("addItemBtn").addEventListener("click", () => {
  const name = prompt("Enter item name:");
  const unit = prompt("Enter unit (e.g. 1 bowl, 100g, 1 piece):");
  const calories = parseInt(prompt("Enter calories per unit:")) || 0;

  if (name && unit && calories) {
    foods.push({ name, unit, calories, qty: 0 });
    renderTable();
  }
});

// Profile dropdown
document.getElementById("profilePic").addEventListener("click", () => {
  document.getElementById("profileMenu").style.display =
    document.getElementById("profileMenu").style.display === "block"
      ? "none"
      : "block";
});

// Initialize
foods = defaultFoods.map(f => ({ ...f, qty: 0 }));
renderTable();
