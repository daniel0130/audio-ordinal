// core.js

// Simplified logging function for repetitive logs
function log(message, ...args) {
    console.log(`[Debug] ${message}`, ...args);
}

// Function to generate a random seed
function generateRandomSeed() {
    return Math.floor(Math.random() * 100000) + 1; // Random seed between 1 and 100,000
}

// Function to clear all intervals and timeouts
function clearIntervalsAndTimeouts() {
    log("Clearing intervals and timeouts.");

    let highestIntervalId = window.setInterval(() => {}, 0);
    for (let i = 0; i <= highestIntervalId; i++) window.clearInterval(i);
    log("All intervals cleared.");

    let highestTimeoutId = window.setTimeout(() => {}, 0);
    for (let i = 0; i <= highestTimeoutId; i++) window.clearTimeout(i);
    log("All timeouts cleared.");
}

// Function to close the AudioContext if it's open
function closeAudioContext() {
    if (window.audioContext && typeof window.audioContext.close === 'function') {
        log("Closing AudioContext.");
        window.audioContext.close().then(() => log("AudioContext closed."));
    } else {
        log("No active AudioContext found.");
    }
}

// Function to remove event listeners
function removeEventListeners() {
    log("Removing event listeners.");
    document.removeEventListener("playbackStarted", handlePlaybackEvent);
    document.removeEventListener("playbackStopped", handlePlaybackEvent);
}

// Function to extract seed value from the URL
function getSeedFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const seed = parseInt(urlParams.get('seed'), 10) || 1;  // Default to 1 if no seed is provided
    log("Extracted seed from URL:", seed);
    return seed;
}

// Function to generate a random number based on the seed
function seededRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
}

// Function to select BPM based on the seed
function selectBPM(availableBPMs, seed) {
    const seededIndex = Math.floor(seededRandom(seed) * availableBPMs.length);
    log("Selecting BPM from seed:", seed, "resulted in index:", seededIndex);
    return availableBPMs[seededIndex];
}

// Function to shuffle an array based on a seed
function shuffleArray(array, seed) {
    let currentSeed = seed; // Initialize current seed
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(currentSeed) * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        currentSeed += 1; // Increment seed manually after each use
    }
    return array;
}

// Expose functions to the global window object
window.log = log;
window.generateRandomSeed = generateRandomSeed;
window.clearIntervalsAndTimeouts = clearIntervalsAndTimeouts;
window.closeAudioContext = closeAudioContext;
window.removeEventListeners = removeEventListeners;
window.getSeedFromUrl = getSeedFromUrl;
window.seededRandom = seededRandom;
window.selectBPM = selectBPM;
window.shuffleArray = shuffleArray;
