// LocalStorageUtils.js

function saveTrimSettings(channelId, trimSettings) {
    const settings = JSON.parse(localStorage.getItem('audioTrimSettings') || '{}');
    settings[channelId] = trimSettings;
    localStorage.setItem('audioTrimSettings', JSON.stringify(settings));

    // Log what's being saved
    console.log(`Saved settings for channel ${channelId}:`, trimSettings);
}

function getTrimSettings(channelId) {
    const settings = JSON.parse(localStorage.getItem('audioTrimSettings') || '{}');
    const channelSettings = settings[channelId] || null;

    // Log what's being retrieved
    if (channelSettings) {
        console.log(`Retrieved settings for channel ${channelId}:`, channelSettings);
    } else {
        console.log(`No settings found for channel ${channelId}`);
    }

    return channelSettings;
}
