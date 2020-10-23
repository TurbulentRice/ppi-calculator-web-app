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
// Assigning Actions
///////////////////////

// PPI button
const ppiBtn = document.getElementById("get-ppi");
ppiBtn.onclick = () => {
	// get widths and solve
	const mm = Number(document.getElementById("ppi-mm").value)
	const pixels = Number(document.getElementById("ppi-pixels").value)

	// handle invalid
	if (!(mm && pixels)) {
		document.querySelector(".alert-danger").textContent = "Invalid input";
		return
	}

	// get answer
	const answer = getPPI(mm, pixels)

	// update alert field with answer
	let update = `${answer} pixels / inch`
	console.log(update)
	document.querySelector(".alert-danger").textContent = update
};

// Pixels button
const pixelsBtn = document.getElementById("get-pixels")
pixelsBtn.onclick = () => {
	// get width, height, ppi, and solve
	const mmHeight = Number(document.getElementById("pixels-height").value)
	const mmWidth = Number(document.getElementById("pixels-width").value)
	const ppi = Number(document.getElementById("pixels-ppi").value)

	// handle invalid
	if (!(mmHeight && mmWidth && ppi)) {
		document.querySelector(".alert-success").textContent = "Invalid input";
		return;
	}

	// get answer
	const answer = getPixDimensions([mmHeight, mmWidth], ppi)

	// update alert field with answer
	let update = `${answer[0]} x ${answer[1]} pixels`
	console.log(update)
	document.querySelector(".alert-success").textContent = update
};

// Size button
const sizeBtn = document.getElementById("get-size")
sizeBtn.onclick = () => {
	// get width, height, ppi, and solve
	const pxHeight = Number(document.getElementById("size-height").value)
	const pxWidth = Number(document.getElementById("size-width").value)
	const ppi = Number(document.getElementById("size-ppi").value)

	// handle invalid
	if (!(pxHeight && pxWidth && ppi)) {
		document.querySelector(".alert-primary").textContent = "Invalid input";
		return;
	}

	// get answer, update alert field
	const answer = getMMDimensions([pxHeight, pxWidth], ppi)
	let update = `${answer[0]} x ${answer[1]} mm`
	console.log(update)
	document.querySelector(".alert-primary").textContent = update
};


// On preset change, populate relevant fields
const presetSelect = document.getElementById("preset-select");
presetSelect.onchange = () => {
	// Get the preset value
	let val = Number(presetSelect.value)

	// do nothing if 0
	if (!val) return;

	// Otherwise, change only relevant mm fields
	let heights = document.querySelectorAll(".mm-h-input")
	heights.forEach(elem => elem.value = presets[val].h)

	let widths = document.querySelectorAll(".mm-w-input")
	widths.forEach(elem => elem.value = presets[val].w)
};

const clearFields = document.getElementById("clear-preset")
clearFields.onclick = () => {

	// get all input elements and replace with empty string
	let fields = document.querySelectorAll("input");
	fields.forEach(field => field.value = "")
	// reset alert fields
	let alerts = document.querySelectorAll(".alert")
	for (let i =0; i<alerts.length; i++) {
		alerts[i].textContent = defaultMessages[i]
	}

	// Reset the preset selector
	presetSelect.value = 0;
}

