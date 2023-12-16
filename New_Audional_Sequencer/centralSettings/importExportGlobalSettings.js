// importExportGlobalSettings.js

function exportSettings() {
    const settings = window.unifiedSequencerSettings.exportSettings();
    // Directly return the JSON string of the settings
    return settings;
}


function importSettings(jsonSettings) {
    try {
        // Parse jsonSettings if it's a string
        const parsedSettings = typeof jsonSettings === 'string' ? JSON.parse(jsonSettings) : jsonSettings;

        console.log("{debugGlobalObjectToUI} importSettings: loading settings", parsedSettings);

        // Load the new settings
        window.unifiedSequencerSettings.loadSettings(parsedSettings);

        // The observers will automatically update the UI
        // No need for explicit UI update calls here

    } catch (error) {
        console.error('Error importing settings:', error);
    }

 // Call this function for each array when loading a project
 this.ensureArrayLength(this.settings.masterSettings.projectURLs, 16);
 this.ensureArrayLength(this.settings.masterSettings.trimSettings, 16);
 // ... and so on for other arrays
}






