const previousNumber = document.querySelector(".previusNumber");
const currentNumber = document.querySelector(".currentNumber");
const buttons = document.querySelectorAll("button");

let currentInput = "";
let previousInput = "";
let operator = "";

window.onload = () => {
  loadFromLocalStorage();
};

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.dataset.value;

    if (value === "clear-all") {
      clearAll();
    } else if (value === "undo") {
      undo();
    } else if (value === "negate") {
      negate();
    } else if (value === "equals") {
      calculate();
    } else if (value === "percentage" || value === "sqrt" || value === "power") {
      specialOperations(value);
    } else {
      handleInput(value);
    }

    saveToLocalStorage();
  });
});

const clearAll = () => {
  currentInput = "";
  previousInput = "";
  operator = "";
  updateDisplay();
};

const undo = () => {
  currentInput = currentInput.slice(0, -1);
  updateDisplay();
};

const negate = () => {
  if (currentInput) {
    currentInput = (parseFloat(currentInput) * -1).toString();
    updateDisplay();
  }
};

const specialOperations = (operation) => {
  let result;

  const current = parseFloat(currentInput) || 0;

  switch (operation) {
    case "percentage":
      result = current / 100;
      break;
    case "sqrt":
      result = Math.sqrt(current);
      break;
    case "power":
      result = Math.pow(current, 2);
      break;
    default:
      return;
  }

  currentInput = result.toString();
  operator = "";
  previousInput = "";
  updateDisplay();
};

const handleInput = (value) => {
  if (["+", "-", "*", "/"].includes(value)) {
    if (currentInput) {
      previousInput = currentInput;
      operator = value;
      currentInput = "";
    } else if (previousInput) {
      operator = value;
    }
    updateDisplay();
  } else {
    currentInput += value;
    updateDisplay();
  }
};

const calculate = () => {
  if (currentInput && previousInput && operator) {
    let result;

    const prev = parseFloat(previousInput);
    const current = parseFloat(currentInput);

    switch (operator) {
      case "+":
        result = prev + current;
        break;
      case "-":
        result = prev - current;
        break;
      case "*":
        result = prev * current;
        break;
      case "/":
        result = current === 0 ? "Error" : prev / current;
        break;
      default:
        return;
    }

    currentInput = result.toString();
    operator = "";
    previousInput = "";
    updateDisplay();
  }
};

const updateDisplay = () => {
  previousNumber.textContent = previousInput + " " + operator;
  currentNumber.textContent = currentInput;
};

const saveToLocalStorage = () => {
  localStorage.setItem("currentInput", currentInput);
  localStorage.setItem("previousInput", previousInput);
  localStorage.setItem("operator", operator);
};

const loadFromLocalStorage = () => {
  currentInput = localStorage.getItem("currentInput") || "";
  previousInput = localStorage.getItem("previousInput") || "";
  operator = localStorage.getItem("operator") || "";
  updateDisplay();
};
