//////////////////////////////
// GLOBAL OBJECTS
//////////////////////////////

// PRESET FORMATS
const presets = {
	0: undefined,
	1: {h:15, w:22.5},
	2: {h:16, w:24},
	3: {h:24, w:36},
	4: {h:32.9, w:43.8},
	5: {h:40, w:53.4},
	6: {h:45, w:60},
	7: {h:60, w:60},
	8: {h:60, w:90},
	9: {h:102, w:127}
}

const defaultMessages = ["pixels / inch", "pixels x pixels", "mm x mm"]

// CONVERTERS
const convert = {
	// Convert pixels to megapixels
	pixToMP: (pixels) => pixels / 1000000,
	// Convert megapixels to pixels
	mpToPix: (mp) => mp * 1000000,
	// Convert between MM and IN
	mmToIn: (mm) => mm / 25.4,
	inToMM: (inch) => inch * 25.4
}

// FORMULAE

//1) PPI formula
// mm dimensions & pixel dimensions => ppi
// Only needs one measurement (l || w), assumes even pixel distribution
const getPPI = (length, pixels) => Math.round(pixels / convert.mmToIn(length));

//2) Pixels formula
// mm dimensions & ppi => pixel dimensions
const getPixels = (length, ppi) => Math.round(ppi * convert.mmToIn(length));
const getPixDimensions = (lengths, ppi) => lengths.map(mm => getPixels(mm, ppi))

//3) Size (mm) formula
// pixel dimensions & ppi => mm dimensions
const getLength = (pixels, ppi) => Math.round(convert.inToMM(pixels / ppi));
const getMMDimensions = (pixels, ppi) => pixels.map(pix => getLength(pix, ppi))


//////////////////////////////
// DOM EVENTS
//////////////////////////////

// Clearing + Updating fields

// Update preset
const updatePreset = () => {
	let presetVal = Number(presetSelector.value)
	clearAlerts()

	// if changed to 0, clear fields and return
	if (!presetVal) return clearFields();

	// Update only relevant fields
	let heights = document.querySelectorAll(".mm-h-input")
	heights.forEach(elem => elem.value = presets[presetVal].h)

	let widths = document.querySelectorAll(".mm-w-input")
	widths.forEach(elem => elem.value = presets[presetVal].w)
};

// Clear fields
clearFields = () => {
	let fields = document.querySelectorAll("input");
	fields.forEach(field => field.value = "")
}
clearAlerts = () => {
	let alerts = document.querySelectorAll(".alert")
	for (let i =0; i<alerts.length; i++) {
		alerts[i].textContent = defaultMessages[i]
	}
}
clearAll = () => {
	clearFields();
	clearAlerts();
	presetSelector.value = 0;
}

// Calculating answers

// PPI result object
const gatherPPI = () => ({
	arg1: Number(document.getElementById("ppi-mm").value),
	arg2: Number(document.getElementById("ppi-pixels").value),
	alert: document.querySelector(".alert-danger"),
	solve: function () {
		const answer = getPPI(this.arg1, this.arg2)
		this.alert.textContent = `${answer} pixels / inch`
	}
});

// PIXELS result object
const gatherPixels = () => ({
	arg1: [Number(document.getElementById("pixels-height").value), Number(document.getElementById("pixels-width").value)],
	arg2: Number(document.getElementById("pixels-ppi").value),
	alert: document.querySelector(".alert-success"),
	solve: function () {
		const answer = getPixDimensions(this.arg1, this.arg2)
		this.alert.textContent = `${answer[0]} x ${answer[1]} pixels`
	}
});

// SIZE result object
const gatherSize = () => ({
	arg1: [Number(document.getElementById("size-height").value), Number(document.getElementById("size-width").value)],
	arg2: Number(document.getElementById("size-ppi").value),
	alert: document.querySelector(".alert-primary"),
	solve: function () {
		const answer = getMMDimensions(this.arg1, this.arg2)
		this.alert.textContent = `${answer[0]} x ${answer[1]} mm`
	}
});

// General Calculating Event Handler
const calculate = (event) => {
	// input checker function
	const check = arg => typeof(arg) === "number" ? !!arg : arg.every(item => !!item);
	let response;
	const targetId = event.target.id;

	// the target card determines the calculating function
	if (targetId.startsWith("ppi")) {
		response = gatherPPI();
	} else if (targetId.startsWith('pixels')) {
		response = gatherPixels();
	} else if (targetId.startsWith("size")) {
		response = gatherSize();
	} else return "Invalid target, returning..."

		// handle invalid
		if (!(check(response.arg1) && check(response.arg2))) {
			response.alert.textContent = "Invalid input";
			return
		};

		response.solve();
};



//////////////////////////////
// ASSIGNING LISTENERS
//////////////////////////////

// Assign preset onchange
const presetSelector = document.getElementById("preset-select");
presetSelector.addEventListener("change", updatePreset)

// Assign clear fields button
const clearFieldsBtn = document.getElementById("clear-preset")
clearFieldsBtn.addEventListener("click", clearAll)

// Assign onclick to buttons
const calcButtons = document.querySelectorAll("[data-info='calc']");
(function () {
	calcButtons.forEach(btn => btn.addEventListener("click", calculate))
})();

// Assign oninput to inputs
const inputListeners = document.querySelectorAll("input");
(function () {
	inputListeners.forEach(input => input.addEventListener("input", calculate))
})();
