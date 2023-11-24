// storeSettingsMaster.js

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


function saveTrimSettings(channelId, trimSettings) {
    const settings = JSON.parse(localStorage.getItem('audioTrimSettings') || '{}');
    settings[channelId] = trimSettings;
    localStorage.setItem('[LocalStorageUtils.js] audioTrimSettings', JSON.stringify(settings));

    // Log what's being saved
    console.log(`[LocalStorageUtils.js] Saved settings for channel ${channelId}:`, trimSettings);
}

function getTrimSettings(projectName, channelId) {
    const settings = JSON.parse(localStorage.getItem('audioTrimSettings') || '{}');
    const channelSettings = settings[channelId] || null;

    // Log what's being retrieved
    if (channelSettings) {
        console.log(`[LocalStorageUtils.js] Retrieved settings for channel ${channelId}:`, channelSettings);
    } else {
        console.log(`[LocalStorageUtils.js] No settings found for channel ${channelId}`);
    }

    return channelSettings;
}


window.trimSettings = (function() {
    let settings = JSON.parse(localStorage.getItem('audioTrimSettings') || '{}');

    function update(channelIndex, newSettings) {
        settings[channelIndex] = newSettings;
        localStorage.setItem('audioTrimSettings', JSON.stringify(settings));
    }

    function get(channelIndex) {
        return settings[channelIndex] || { start: 0.01, end: 100 };
    }

    return { update, get };
})();