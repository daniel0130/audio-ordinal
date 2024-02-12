// In audioBufferAndPlayback.js

class AudioSamplePlayer {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sampleBuffers = {}; // Object to store loaded audio buffers
    }

    loadSample(key, url) {
        fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => this.audioContext.decodeAudioData(arrayBuffer))
            .then(decodedAudio => {
                this.sampleBuffers[key] = decodedAudio;
            })
            .catch(error => console.error("Error loading audio sample:", error));
    }

    loadSampleFromBase64(key, base64Data) {
        // Extract the base64 part of the data URL
        const base64Content = base64Data.split(',')[1];
        if (!base64Content) {
            console.error('Invalid base64 audio data');
            return;
        }

        const arrayBuffer = this.base64ToArrayBuffer(base64Content);
        this.audioContext.decodeAudioData(arrayBuffer)
            .then(decodedAudio => {
                this.sampleBuffers[key] = decodedAudio;
            })
            .catch(error => console.error("Error loading base64 audio sample:", error));
    }

    playSample(key) {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume().then(() => {
                this._playBuffer(key); // Play the buffer after ensuring the context is running
            });
        } else {
            this._playBuffer(key);
        }
    }
    
    _playBuffer(key) {
        const buffer = this.sampleBuffers[key];
        if (buffer) {
            const source = this.audioContext.createBufferSource();
            source.buffer = buffer;
            source.connect(this.audioContext.destination);
            source.start(0); // Start playback immediately
        } else {
            console.error("Sample not loaded:", key);
        }
    }

    base64ToArrayBuffer(base64) {
        const binaryString = window.atob(base64); // Decode base64
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }
}
