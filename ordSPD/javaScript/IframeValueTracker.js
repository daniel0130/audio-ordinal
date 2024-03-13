// IframeValueTracker.js
import { postMessageToSelectedIframes } from './IframeManager.js';


class IframeValueTracker {
    constructor() {
        // Object to hold state for each iframe
        this.iframeStates = {};
    }

    // Initialize or reset state for an iframe, now including URL
    initializeIframeState(iframeId, url = '') { // Added URL parameter with default empty string
        if (!this.iframeStates[iframeId]) {
            this.iframeStates[iframeId] = {
                volume: 50, // Default volume
                scheduleMultiplier: 1, // Default multiplier
                playbackSpeed: 1, // Default playback speed
                url: url // URL of the iframe content
            };
        }
    }

    // Method to update an iframe's URL
    updateIframeURL(iframeId, url) {
        if (!this.iframeStates[iframeId]) {
            this.initializeIframeState(iframeId);
        }
        this.iframeStates[iframeId].url = url;
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

   // Get the current state of an iframe, including URL
   getIframeState(iframeId) {
        this.initializeIframeState(iframeId); // Ensure state is initialized even if just querying
        return this.iframeStates[iframeId];
    }


    // Method to get the global settings object
    getGlobalSettings() {
        return this.iframeStates; // Returns the current state of all iframes
    }

    // Method to set global settings from an object, including URL updates
    setGlobalSettings(settings) {
        Object.keys(settings).forEach(iframeId => {
            if (!this.iframeStates[iframeId]) {
                this.initializeIframeState(iframeId);
            }
            this.iframeStates[iframeId] = { ...this.iframeStates[iframeId], ...settings[iframeId] };

            // Update iframe src if URL is provided
            const iframe = document.getElementById(iframeId);
            if (iframe && settings[iframeId].url) {
                iframe.src = settings[iframeId].url;
            }

            // Apply additional settings through messaging
            // Assume that `postMessageToSelectedIframes` can target a specific iframe by ID
            this.applySettingsThroughMessaging(iframeId, settings[iframeId]);
        });
    }

    // // New helper method to apply settings via messaging
    // applySettingsThroughMessaging(iframeId, settings) {
    //     // Extract settings that need to be communicated
    //     const { volume, playbackSpeed, scheduleMultiplier } = settings;

    //     // Prepare message data for each setting
    //     if (volume !== undefined) {
    //         postMessageToSelectedIframes('adjustVolume', { volume }, iframeId);
    //     }
    //     if (playbackSpeed !== undefined) {
    //         postMessageToSelectedIframes('adjustPlaybackSpeed', { speed: playbackSpeed }, iframeId);
    //     }
    //     if (scheduleMultiplier !== undefined) {
    //         postMessageToSelectedIframes('adjustScheduleMultiplier', { scheduleMultiplier }, iframeId);
    //     }
    // }
}


// Export an instance so it maintains state across the app
export const iframeValueTracker = new IframeValueTracker();

