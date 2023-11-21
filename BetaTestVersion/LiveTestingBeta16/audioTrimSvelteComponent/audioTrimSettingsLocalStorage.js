// audioTrimSettingsLocalStorage.js

class AudioTrimSettings {
    constructor() {
        this.storageKey = 'audioTrimSettings';
        console.log('[AudioTrimSettings] Initialized with storageKey:', this.storageKey);
    }

    // Load settings from local storage
    loadSettings() {
        const settings = localStorage.getItem(this.storageKey);
        console.log('[AudioTrimSettings] Loading settings from localStorage:', settings);
        return settings ? JSON.parse(settings) : {};
    }

    // Save settings to local storage
    saveSettings(settings) {
        console.log('[AudioTrimSettings] Saving settings to localStorage:', settings);
        localStorage.setItem(this.storageKey, JSON.stringify(settings));
    }

    // Get trim settings for a specific channel
    getChannelSettings(channelId) {
        console.log('[AudioTrimSettings] Getting trim settings for channel:', channelId);
        const settings = this.loadSettings();
        const channelSettings = settings[channelId] || null;
        console.log(`[AudioTrimSettings] Retrieved settings for channel ${channelId}:`, channelSettings);
        return channelSettings;
    }

    // Update trim settings for a specific channel
    updateChannelSettings(channelId, trimSettings) {
        console.log(`[AudioTrimSettings] Updating trim settings for channel ${channelId}:`, trimSettings);
        const settings = this.loadSettings();
        settings[channelId] = trimSettings;
        this.saveSettings(settings);
        console.log(`[AudioTrimSettings] Updated settings in localStorage for channel ${channelId}:`, settings);
    }
}


