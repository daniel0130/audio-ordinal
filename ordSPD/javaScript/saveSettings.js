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

