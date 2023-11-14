// audioTrimSettingsLocalStorage.js

class AudioTrimSettings {
    constructor() {
        this.storageKey = 'audioTrimSettings';
    }

    // Load settings from local storage
    loadSettings() {
        const settings = localStorage.getItem(this.storageKey);
        return settings ? JSON.parse(settings) : {};
    }

    // Save settings to local storage
    saveSettings(settings) {
        localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }

    // Get trim settings for a specific channel
    getChannelSettings(channelId) {
        const settings = this.loadSettings();
        return settings[channelId] || null;
    }

    // Update trim settings for a specific channel
    updateChannelSettings(channelId, trimSettings) {
        const settings = this.loadSettings();
        settings[channelId] = trimSettings;
        this.saveSettings(settings);
    }
}


