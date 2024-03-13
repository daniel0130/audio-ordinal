// saveandLoadSettings.js
import { iframeValueTracker } from './IframeValueTracker.js';


// Assuming iframeValueTracker is defined and available in the scope
export function exportIframeDetailsToJSON() {
    const iframes = document.querySelectorAll('iframe');
    const iframeDetails = Array.from(iframes).map(iframe => {
        const id = iframe.id;
        const settings = iframeValueTracker.getIframeState(id); // Access iframe settings
        return { id, settings };
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
    exportIframeDetailsToJSON(); // Call the function to export settings when the save button is clicked
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
        try {
            const iframeDetails = JSON.parse(event.target.result);
            iframeDetails.forEach(detail => {
                // Note: Assuming the detail structure includes an 'id' and a 'settings' property
                const { id, settings } = detail;
                iframeValueTracker.setGlobalSettings({ [id]: settings }); // Apply loaded settings
            });
            console.log("Iframe settings loaded successfully.");
        } catch (e) {
            console.error("Failed to load iframe settings:", e);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}, false);