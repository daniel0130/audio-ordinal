// uiInteractions.js

// Debugging utility to log contextual information
function debugLog(message, data = '') {
    console.log(`[Debug] ${message}`, data);
}

// Check if running inside an iframe
function isInIframe() {
    const insideIframe = window.location !== window.parent.location;
    debugLog('Is in iframe:', insideIframe);
    return insideIframe;
}

// Highlight the currently selected iframe
function highlightSelectedIframe() {
    if (isInIframe()) {
        document.body.style.boxShadow = '0 0 10px 5px yellow';
        debugLog('Iframe highlighted');
    }
}

// Play sample once, with debug logging
function playSampleOnce() {
    debugLog('Playing sample once');
    // Assuming playSampleOnce is defined elsewhere
}

// Fetch and decode audio data
async function fetchAndDecodeAudio(elementId) {
    debugLog(`Fetching and decoding audio for element: ${elementId}`);
    const audioElement = document.getElementById(elementId);
    if (!audioElement) {
        console.error("Audio element not found:", elementId);
        return;
    }

    const audioSrc = audioElement.querySelector('source')?.src || audioElement.src;
    if (!audioSrc) {
        console.error("Audio source not found for element:", elementId);
        return;
    }

    try {
        const arrayBuffer = await (await fetch(audioSrc)).arrayBuffer();
        audioContext.decodeAudioData(arrayBuffer, buffer => {
            state.audioBuffer = buffer;
            debugLog("Audio data fetched and decoded successfully.", buffer);
        }, error => console.error("Error decoding audio data:", error));
    } catch (error) {
        console.error("Error fetching audio data:", error);
    }
}

// Initialize event listeners after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    debugLog('DOM fully loaded and parsed');
    fetchAndDecodeAudio("audionalData");
});

// Click event listener for the OB1_Image
document.getElementById("OB1_Image").addEventListener("click", async () => {
    debugLog('OB1_Image clicked');
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
        debugLog('Audio context resumed');
    }
    const loopingState = state.isLooping ? "STOP" : "START";
    console.log(`[Click Event] Looping state: ${loopingState}`);
    state.isLooping ? stopAudioPlayback() : playAudioBuffer();
});

// Global keydown event listener
document.addEventListener('keydown', event => {
    debugLog('Keydown event detected', `Key: ${event.key}, KeyCode: ${event.keyCode}`);

    // Space key functionality
    if ((event.key === ' ' || event.keyCode === 32) && (!isInIframe() || document.body.classList.contains('selected-iframe'))) {
        playSampleOnce();
    }

    // BPM adjustment functionality
    if (!isInIframe() && (event.key === 'b' || event.keyCode === 66)) {
        const bpmChangeEvent = new CustomEvent('bpmChange', { detail: { adjustment: 5 } });
        document.dispatchEvent(bpmChangeEvent);
        debugLog('BPM change event dispatched');
    }

    highlightSelectedIframe();
});

// BPM and multiplier change event listeners
document.addEventListener('bpmChange', event => {
    debugLog('BPM change detected', event.detail.adjustment);
    updateBPM(state.bpm + event.detail.adjustment);
});

document.addEventListener('multiplierChange', event => {
    debugLog('Multiplier change detected', event.detail.multiplier);
    if (event.detail.multiplier !== 1) {
        state.scheduleMultiplier = Math.max(1 / 32, Math.min(32, state.scheduleMultiplier * event.detail.multiplier));
    } else {
        state.scheduleMultiplier = 1;
    }
    displayUpdate('BPM', `Multiplier: ${state.scheduleMultiplier.toFixed(2)}`);
});

// Display update function with CSS transition and debug logging
function displayUpdate(elementId, text, duration = 3000) {
    debugLog(`Updating display for ${elementId} with text: ${text}`);
    const element = document.getElementById(elementId);
    element.textContent = text.startsWith("Multiplier:") ? calculateDisplayTextForMultiplier(text.split(": ")[1]) : text;
    element.classList.add('show');
    setTimeout(() => element.classList.remove('show'), duration);
}

// Simplify multiplier display calculation with debug logging
function calculateDisplayTextForMultiplier(rawMultiplierText) {
    const multiplier = parseFloat(rawMultiplierText);
    const displayText = multiplier !== 1 ? (multiplier > 1 ? `x${multiplier}` : `1/${1 / multiplier}`) : '1:1';
    debugLog(`Calculated display text for multiplier: ${rawMultiplierText} is ${displayText}`);
    return displayText;
}
