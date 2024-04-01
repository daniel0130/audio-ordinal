// AudioContextUtil.js


// Initialization of AudioContext
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
if (!audioContext) alert('Web Audio API is not supported in this browser');

const customLog = (message, isError = false) => {
    console[isError ? 'error' : 'log'](message);
};

const base64ToArrayBuffer = base64 => {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0)).buffer;
};

let audioBuffersCache = []; // Cache for audio buffers

// Function to fetch and decode audio data
// Updated function with caching mechanism
const fetchAndDecodeAudio = async (url) => {
    if (audioBuffersCache[url]) {
        return audioBuffersCache[url]; // Use cached buffer if available
    }
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const contentType = response.headers.get('content-type');
        let arrayBuffer;
        if (contentType && contentType.includes('audio/')) {
            arrayBuffer = await response.arrayBuffer(); // Directly use ArrayBuffer for audio content
        } else {
            // Additional content-type checks and conversions to ArrayBuffer
            const text = await response.text();
            if (contentType && contentType.includes('application/json')) {
                const base64String = JSON.parse(text).audioData.split(',')[1];
                arrayBuffer = base64ToArrayBuffer(base64String);
            } else if (contentType && contentType.includes('text/html')) {
                // Extract base64 audio data from HTML and convert
                const doc = new DOMParser().parseFromString(text, 'text/html');
                const audioDataElement = doc.querySelector('audio[data-base64]');
                if (!audioDataElement) throw new Error('Audio data not found in HTML');
                const base64String = audioDataElement.getAttribute('data-base64').split(',')[1];
                arrayBuffer = base64ToArrayBuffer(base64String);
            } else {
                throw new Error(`Unsupported content type: ${contentType}`);
            }
        }
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        audioBuffersCache[url] = audioBuffer; // Cache the decoded buffer
        return audioBuffer;
    } catch (error) {
        customLog(`Error loading audio file: ${error}`, true);
        return null;
    }
};

// Simplified load audio file function
const loadAudioFile = url => url ? fetchAndDecodeAudio(url) : customLog('URL is invalid or missing', true);

export { audioContext, customLog, base64ToArrayBuffer, fetchAndDecodeAudio, loadAudioFile, audioBuffersCache };
