// CONVERTERS

// Consider putting all in one class, exporting class

// Convert pixels to megapixels
export const pixToMP = (pixels) => pixels / 1000000
// Convert megapixels to pixels
export const mpToPix = (mp) => mp * 1000000
// Convert between MM and IN
export const mmToIn = (mm) => mm / 25.4
export const inToMM = (inch) => inch * 25.4

// FORMULAE

//1) PPI formula
// mm dimensions & pixel dimensions => ppi
// Only needs one measurement (l || w), assumes even pixel distribution
export const getPPI = (length, pixels) => Math.round(pixels / mmToIn(length));

//2) Pixels formula
// mm dimensions & ppi => pixel dimensions
export const getPixels = (length, ppi) => Math.round(ppi * mmToIn(length));
export const getPixDimensions = (lengths, ppi) => lengths.map(mm => getPixels(mm, ppi))

//3) Size (mm) formula
// pixel dimensions & ppi => mm dimensions
export const getLength = (pixels, ppi) => Math.round(inToMM(pixels / ppi));
export const getMMDimensions = (pixels, ppi) => pixels.map(pix => getLength(pix, ppi))

// export * from '/scripts/formulaUtility.js'