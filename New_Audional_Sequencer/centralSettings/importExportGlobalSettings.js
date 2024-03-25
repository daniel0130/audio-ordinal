// importExportGlobalSettings.js

// function exportSettings() {
//     const settings = window.unifiedSequencerSettings.exportSettings();

//     // Check if settings contain trimSettings and process them
//     if (settings.masterSettings && settings.masterSettings.trimSettings) {
//         settings.masterSettings.trimSettings = settings.masterSettings.trimSettings.map(setting => ({
//             s: parseFloat(setting.startSliderValue.toFixed(2)), // Shorten and reduce precision
//             e: parseFloat(setting.endSliderValue.toFixed(2)),   // Shorten and reduce precision
//             l: parseFloat(setting.totalSampleDuration.toFixed(3)) // Shorten and reduce precision
//         }));
//     }

//     // Return the modified settings as a JSON string
//     return JSON.stringify(settings);
// }



function importSettings(jsonSettings) {
    try {
        // Parse jsonSettings if it's a string
        const parsedSettings = typeof jsonSettings === 'string' ? JSON.parse(jsonSettings) : jsonSettings;

        console.log("{debugGlobalObjectToUI} importSettings: loading settings", parsedSettings);

        // Expand trimSettings back to original property names and values
        if (parsedSettings.masterSettings && parsedSettings.masterSettings.trimSettings) {
            parsedSettings.masterSettings.trimSettings = parsedSettings.masterSettings.trimSettings.map(setting => ({
                startSliderValue: setting.s, // Expand back to original
                endSliderValue: setting.e,   // Expand back to original
                totalSampleDuration: setting.l // Expand back to original
            }));
        }

          // Load the expanded settings
          window.unifiedSequencerSettings.loadSettings(parsedSettings);

        // The observers will automatically update the UI
        // No need for explicit UI update calls here
         // Ensure correct lengths of arrays upon import
        // Ensure the `ensureArrayLength` method exists and is called appropriately here
        // Example:
        // this.ensureArrayLength(parsedSettings.masterSettings.channelURLs, 16);
        // this.ensureArrayLength(parsedSettings.masterSettings.trimSettings, 16);
        // ...and so on for other arrays if applicable

    } catch (error) {
        console.error('Error importing settings:', error);
    }
}






