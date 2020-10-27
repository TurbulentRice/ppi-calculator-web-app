// GLOBAL OBJECTS

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

// PRESETS
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


// FORMULAE
// Three different types of starting/target data we can have:

//1) mm dimensions & ppi => pixel dimensions
// Calculate pixels from ppi and length(mm):
const getPixels = (length, ppi) => Math.round(ppi * convert.mmToIn(length));
const getPixDimensions = (lengths, ppi) => lengths.map(mm => getPixels(mm, ppi))

//2) pixel dimensions & ppi => mm dimensions
// Calculate length(mm) from pixels and ppi:
const getLength = (pixels, ppi) => Math.round(convert.inToMM(pixels / ppi));
const getMMDimensions = (pixels, ppi) => pixels.map(pix => getLength(pix, ppi))

//3) mm dimensions & pixel dimensions => ppi
// Caclulate ppi from pixels and mm dimensions
// Only needs one measurement (l || w), assumes even pixel distribution
const getPPI = (length, pixels) => Math.round(pixels / convert.mmToIn(length));


// Diagonal Method
const diagonal = (h, w) => Math.sqrt(h**2 + w**2)
const ppi = (pixels, length) => diagonal(pixels) / diagonal(length)


///////////////////////
// Assigning Events
///////////////////////


// Clearing + Updating fields

// Update preset
const updatePreset = () => {
	// Get the preset value, clear alerts
	let presetVal = Number(presetSelector.value)
	clearAlerts()

	// if changed to 0, clear fields and return
	if (!presetVal) return clearFields();

	// Otherwise, update only relevant mm fields
	let heights = document.querySelectorAll(".mm-h-input")
	heights.forEach(elem => elem.value = presets[presetVal].h)

	let widths = document.querySelectorAll(".mm-w-input")
	widths.forEach(elem => elem.value = presets[presetVal].w)
};

// Assign preset onchange
const presetSelector = document.getElementById("preset-select");
presetSelector.addEventListener("change", updatePreset)


clearFields = () => {
	// get all input elements and replace with empty string
	let fields = document.querySelectorAll("input");
	fields.forEach(field => field.value = "")
}
clearAlerts = () => {
	// reset alert fields
	let alerts = document.querySelectorAll(".alert")
	for (let i =0; i<alerts.length; i++) {
		alerts[i].textContent = defaultMessages[i]
	}
}
// Clear all inputs and reset selector
clearAll = () => {
	clearFields();
	clearAlerts();
	presetSelector.value = 0;
}

// Assign clear fields button
const clearFieldsBtn = document.getElementById("clear-preset")
clearFieldsBtn.addEventListener("click", clearAll)

// Calculating

const calculate = (event) => {
	// check inputs function
	const check = arg => typeof(arg) === "number" ? !!arg : arg.every(item => !!item);
	let response

	//determine target
	const target = event.target;
	console.log(target.id)
	switch (target.id) {
		case "get-ppi":
			response = gatherPPI();
			break;
		case "get-pixels":	
			response = gatherPixels();
			break;
		case "get-size":
			response = gatherSize();
			break;
	}
		// handle invalid
		console.log(response)
		if (!(check(response.arg1) && check(response.arg2))) {
			response.alert.textContent = "Invalid input";
			return
		};

		// call curried function, populating appropriate box with answer
		response.solve();
};


// curry function
// gathered data, returns object with values and solve function

//PPI

const gatherPPI = () => ({
	arg1: Number(document.getElementById("ppi-mm").value),
	arg2: Number(document.getElementById("ppi-pixels").value),
	alert: document.querySelector(".alert-danger"),
	solve: function () {
		const answer = getPPI(this.arg1, this.arg2)
		console.log(answer)
		this.alert.textContent = `${answer} pixels / inch`
	}
});

// PIXELS
const gatherPixels = () => ({
	arg1: [Number(document.getElementById("pixels-height").value), Number(document.getElementById("pixels-width").value)],
	arg2: Number(document.getElementById("pixels-ppi").value),
	alert: document.querySelector(".alert-success"),
	solve: function () {
		const answer = getPixDimensions(this.arg1, this.arg2)
		this.alert.textContent = `${answer[0]} x ${answer[1]} pixels`
	}
});

// SIZE
const gatherSize = () => ({
	arg1: [Number(document.getElementById("size-height").value), Number(document.getElementById("size-width").value)],
	arg2: Number(document.getElementById("size-ppi").value),
	alert: document.querySelector(".alert-primary"),
	solve: function () {
		const answer = getMMDimensions(this.arg1, this.arg2)
		this.alert.textContent = `${answer[0]} x ${answer[1]} mm`
	}
});


// Add event listeners with IIFE
const calcButtons = document.querySelectorAll("[data-calc]");
(function () {
	calcButtons.forEach(btn => btn.addEventListener("click", calculate))
})();