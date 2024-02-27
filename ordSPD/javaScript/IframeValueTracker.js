// IframeValueTracker.js

class IframeValueTracker {
    constructor() {
        // Object to hold state for each iframe
        this.iframeStates = {};
    }

    // Initialize or reset state for an iframe
    initializeIframeState(iframeId) {
        if (!this.iframeStates[iframeId]) {
            this.iframeStates[iframeId] = {
                volume: 50, // Assuming volume goes from 0 to 100
                scheduleMultiplier: 1, // Default multiplier
                playbackSpeed: 1, // Default playback speed
            };
        }
    }

    // Adjust volume for a specific iframe
    adjustVolume(iframeId, direction) {
        this.initializeIframeState(iframeId);
        const volumeChange = direction === 'increase' ? 10 : -10;
        this.iframeStates[iframeId].volume = Math.min(100, Math.max(0, this.iframeStates[iframeId].volume + volumeChange));
        return this.iframeStates[iframeId].volume;
    }

    // Adjust schedule multiplier for a specific iframe
    adjustScheduleMultiplier(iframeId, direction) {
        this.initializeIframeState(iframeId);
        const scheduleChange = direction === 'increase' ? 0.1 : -0.1;
        this.iframeStates[iframeId].scheduleMultiplier = Math.max(0, this.iframeStates[iframeId].scheduleMultiplier + scheduleChange);
        return this.iframeStates[iframeId].scheduleMultiplier;
    }

    // Adjust playback speed for a specific iframe, ensuring it's within the valid range
    adjustPlaybackSpeed(iframeId, adjustment) {
        this.initializeIframeState(iframeId);
        let newSpeed = this.iframeStates[iframeId].playbackSpeed + adjustment;
        // Ensure playback speed is within the allowed range
        newSpeed = Math.max(0.2, Math.min(100, newSpeed));
        this.iframeStates[iframeId].playbackSpeed = newSpeed;
        return newSpeed;
    }

    // Reset schedule multiplier for a specific iframe
    resetScheduleMultiplier(iframeId) {
        if (this.iframeStates[iframeId]) {
            this.iframeStates[iframeId].scheduleMultiplier = 1;
            return true;
        }
        return false;
    }

    // Get the current state of an iframe
    getIframeState(iframeId) {
        return this.iframeStates[iframeId];
    }
}

// Export an instance so it maintains state across the app
export const iframeValueTracker = new IframeValueTracker();
