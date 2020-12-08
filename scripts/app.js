import * as formula from "./formulaUtility.js";
import { presets, defaultMessages } from "./presets.js";

//////////////////////////////
// DOM EVENTS
//////////////////////////////

const populatePresets = () => {
  presets.forEach((preset, i) => {
    const newOption = document.createElement("option");
    newOption.value = i;
    newOption.text = preset.info;
    presetSelector.add(newOption);
  });
};

// Clearing + Updating fields
// Update preset
const updatePreset = () => {
  let presetVal = Number(presetSelector.value);
  clearAlerts();

  // if changed to 0, clear fields and return
  if (!presetVal) return clearFields();

  // Update only relevant fields
  let heights = document.querySelectorAll(".mm-h-input");
  heights.forEach((elem) => (elem.value = presets[presetVal].h));

  let widths = document.querySelectorAll(".mm-w-input");
  widths.forEach((elem) => (elem.value = presets[presetVal].w));
};

// Clear fields
const clearFields = () => {
  let fields = document.querySelectorAll("input");
  fields.forEach((field) => (field.value = ""));
};
const clearAlerts = () => {
  let alerts = document.querySelectorAll(".alert");
  for (let i = 0; i < alerts.length; i++) {
    alerts[i].textContent = defaultMessages[i];
  }
};
const clearAll = () => {
  clearFields();
  clearAlerts();
  presetSelector.value = 0;
};

// Calculating answers

// PPI result object
const gatherPPI = () => ({
  arg1: Number(document.getElementById("ppi-mm").value),
  arg2: Number(document.getElementById("ppi-pixels").value),
  alert: document.querySelector(".alert-danger"),
  solve: function () {
    const answer = formula.getPPI(this.arg1, this.arg2);
    this.alert.textContent = `${answer} pixels / inch`;
  },
});

// PIXELS result object
const gatherPixels = () => ({
  arg1: [
    Number(document.getElementById("pixels-height").value),
    Number(document.getElementById("pixels-width").value),
  ],
  arg2: Number(document.getElementById("pixels-ppi").value),
  alert: document.querySelector(".alert-success"),
  solve: function () {
    const answer = formula.getPixDimensions(this.arg1, this.arg2);
    this.alert.textContent = `${answer[0]} x ${answer[1]} pixels`;
  },
});

// SIZE result object
const gatherSize = () => ({
  arg1: [
    Number(document.getElementById("size-height").value),
    Number(document.getElementById("size-width").value),
  ],
  arg2: Number(document.getElementById("size-ppi").value),
  alert: document.querySelector(".alert-primary"),
  solve: function () {
    const answer = formula.getMMDimensions(this.arg1, this.arg2);
    this.alert.textContent = `${answer[0]} x ${answer[1]} mm`;
  },
});

// General Calculating Event Handler
const calculate = (event) => {
  // utility
  const check = (arg) =>
    typeof arg === "number" ? !!arg : arg.every((item) => !!item);
  let response;
  const targetId = event.target.id;

  // the target card determines the calculating function
  if (targetId.startsWith("ppi")) {
    response = gatherPPI();
  } else if (targetId.startsWith("pixels")) {
    response = gatherPixels();
  } else if (targetId.startsWith("size")) {
    response = gatherSize();
  } else return "Invalid target, returning...";

  // handle invalid
  if (!(check(response.arg1) && check(response.arg2))) {
    response.alert.textContent = "Invalid input";
    return;
  }
  response.solve();
};

//////////////////////////////
// ASSIGNING LISTENERS
//////////////////////////////
const presetSelector = document.getElementById("preset-select");
const clearFieldsBtn = document.getElementById("clear-preset");
const calcButtons = document.querySelectorAll("[data-info='calc']");
const inputListeners = document.querySelectorAll("input");

(function () {
  // Populate preset selector
  populatePresets();

  // Assign preset onchange
  presetSelector.addEventListener("change", updatePreset);

  // Assign clear fields button
  clearFieldsBtn.addEventListener("click", clearAll);

  // Assign onclick to buttons
  calcButtons.forEach((btn) => btn.addEventListener("click", calculate));

  // Assign oninput to inputs
  inputListeners.forEach((input) => input.addEventListener("input", calculate));
})();
