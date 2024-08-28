// seedControl.js

window.seed = getSeedFromUrl();

// Array of possible BPMs
const availableBPMs = [80, 100, 120, 140, 160, 180, 240];

// Select the base BPM using the seed
const baseBPM = selectBPM(availableBPMs, window.seed);
log("Selected base BPM:", baseBPM);

// Expose baseBPM to the global window object
window.baseBPM = baseBPM;
