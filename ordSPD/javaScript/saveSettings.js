// saveSettings.js

window.iframeSettings = window.iframeSettings || {};

// Assuming iframeValueTracker is defined and available in the scope
export function exportIframeDetailsToJSON() {
    // Utilize the global iframeSettings for exporting
    const iframeDetails = Object.keys(window.iframeSettings).map(id => {
        const settings = window.iframeSettings[id]; // Directly access the settings
        return { id: id, url: settings.url, speed: settings.speed, action: settings.action, times: settings.times };
    });

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(iframeDetails));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "iframeDetails.json");
    document.body.appendChild(downloadAnchorNode); // Required for Firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    }
    
    document.getElementById('saveSettingsButton').addEventListener('click', function() {
    exportIframeDetailsToJSON(); // Use the updated function to export settings
    });



    // // Function to update iframe settings in iframeValueTracker
// export function updateIframeSettings(id, settingType, value) {
//     let currentSettings = iframeValueTracker.getIframeState(id) || {};
//     currentSettings[settingType] = value;
//     iframeValueTracker.setIframeState(id, currentSettings); // Assuming setIframeState updates the tracker
// }

// Helper to capture settings for all iframes after randomization
// export function captureIframeSettingsPostRandomization() {
//     const iframes = document.querySelectorAll('iframe');
//     iframes.forEach(iframe => {
//         // Assume these functions return the latest settings applied to the iframes
//         const playSpeed = iframe.contentWindow.getPlaySpeed(); // Placeholder, replace with actual method to get play speed
//         const scheduleMultiplier = iframe.contentWindow.getScheduleMultiplier(); // Placeholder, replace with actual method to get multiplier
//         const volume = iframe.contentWindow.getVolume(); // Placeholder, replace with actual method to get volume
//         const url = iframe.src;

//         // Update settings in iframeValueTracker
//         updateIframeSettings(iframe.id, 'playSpeed', playSpeed);
//         updateIframeSettings(iframe.id, 'scheduleMultiplier', scheduleMultiplier);
//         updateIframeSettings(iframe.id, 'volume', volume);
//         updateIframeSettings(iframe.id, 'url', url);
//     });
// }

