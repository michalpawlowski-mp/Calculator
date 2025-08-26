const prevDisplay = document.querySelector(".previousNumber");
const currDisplay = document.querySelector(".currentNumber");
const buttons = document.querySelectorAll("button");

let current = "";
let previous = "";
let operator = "";

window.onload = loadState;

function clearAll() {
  current = "";
  previous = "";
  operator = "";
  updateDisplay();
}

function undo() {
  current = current.slice(0, -1);
  updateDisplay();
}

function negate() {
  if (current) {
    current = String(-parseFloat(current));
    updateDisplay();
  }
}

function special(op) {
  let num = parseFloat(current) || 0;
  if (op === "percentage") num /= 100;
  if (op === "sqrt") num = Math.sqrt(num);
  if (op === "power") num = num * num;
  current = String(num);
  previous = "";
  operator = "";
  updateDisplay();
}

function handleInput(value) {
  if (["+", "-", "*", "/"].includes(value)) {
    if (current) {
      previous = current;
      operator = value;
      current = "";
    } else if (previous) {
      operator = value;
    }
  } else {
    if (value === ".") {
      if (current.includes(".")) return;
      if (current === "") current = "0";
    }

    if (value === "0") {
      if (current === "0") return;
    }

    if (/[1-9]/.test(value)) {
      if (current === "0") current = "";
    }

    current += value;
  }
  updateDisplay();
}

function calculate() {
  if (!current || !previous || !operator) return;

  let a = parseFloat(previous);
  let b = parseFloat(current);
  let result = 0;

  if (operator === "+") result = a + b;
  if (operator === "-") result = a - b;
  if (operator === "*") result = a * b;
  if (operator === "/") result = b === 0 ? "Error" : a / b;

  current = String(result);
  previous = "";
  operator = "";
  updateDisplay();
}

function updateDisplay() {
  prevDisplay.textContent = previous + " " + operator;
  currDisplay.textContent = current;
  saveState();
}

function saveState() {
  localStorage.setItem("current", current);
  localStorage.setItem("previous", previous);
  localStorage.setItem("operator", operator);
}

function loadState() {
  current = localStorage.getItem("current") || "";
  previous = localStorage.getItem("previous") || "";
  operator = localStorage.getItem("operator") || "";
  updateDisplay();
}

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    let v = btn.dataset.value;

    if (v === "clear-all") clearAll();
    else if (v === "undo") undo();
    else if (v === "negate") negate();
    else if (v === "equals") calculate();
    else if (["percentage", "sqrt", "power"].includes(v)) special(v);
    else handleInput(v);
  });
});
