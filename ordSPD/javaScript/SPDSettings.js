// SPDSettings.js

// Object to store settings for each iframe by ID
const iframeSettings = {};

// Function to initialize settings for a new iframe
function initializeIframeSettings(iframeId, defaultSettings = {}) {
    iframeSettings[iframeId] = defaultSettings;
}

// Function to update a setting for a specific iframe
function updateIframeSetting(iframeId, settingKey, value) {
    if (!iframeSettings[iframeId]) {
        console.error("Iframe settings not initialized");
        return;
    }
    iframeSettings[iframeId][settingKey] = value;
}

// Function to get settings for a specific iframe
function getIframeSettings(iframeId) {
    return iframeSettings[iframeId] || null;
}

export { initializeIframeSettings, updateIframeSetting, getIframeSettings };
