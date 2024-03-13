function saveGlobalSettings() {
    const settings = iframeValueTracker.getGlobalSettings();
    localStorage.setItem('iframeSettings', JSON.stringify(settings));
}

function loadGlobalSettings() {
    const settings = JSON.parse(localStorage.getItem('iframeSettings'));
    if (settings) {
        iframeValueTracker.setGlobalSettings(settings);
    }
}
