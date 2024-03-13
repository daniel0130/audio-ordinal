// loadSettings.js

document.getElementById('fileInput').addEventListener('change', function(event) {
    const fileReader = new FileReader();
    fileReader.onload = async function(event) { // Changed to async function
        try {
            const projectData = JSON.parse(event.target.result);
            // Load URLs into iframes
            projectData.forEach((detail, index) => {
                iframes[index].src = detail.url;
            });

            console.log("URLs loaded successfully.");

            // Wait for URLs to load and then apply settings
            await Promise.all(iframes.map(iframe => new Promise(resolve => iframe.onload = resolve)));
            console.log("All iframes have loaded their content.");

            // Sequentially update settings for each iframe
            updateSettingsSequentially(0, projectData); // Pass projectData to the function
        } catch (e) {
            console.error("Failed to load project data:", e);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}, false);

// This function needs to be defined to simulate the adjustments based on the available commands
function adjustSettingsForIframe(iframe, settings, callback) {
    // Example of how you might simulate increasing the volume
    // This is a placeholder and needs to be replaced with actual logic
    // that sends the right messages to the iframe based on the settings
    console.log(`Adjusting settings for ${iframe.id}...`);
    
    // Implement logic to send messages to iframe here
    // For example, to increase volume, send 'increaseVolume' messages as needed
    // Remember to use a delay between messages to give the iframe time to process each one

    // Call callback once all settings are adjusted
    // This is important for the sequential update process to continue
    setTimeout(callback, 1000); // Placeholder delay
}

function updateSettingsSequentially(index, projectData) {
    if (index >= iframes.length) return; // All iframes updated

    let iframe = iframes[index];
    let settings = projectData[index].settings;

    // Adjust settings for the iframe
    adjustSettingsForIframe(iframe, settings, () => {
        // Callback function after settings are adjusted
        console.log(`Settings applied for ${iframe.id}.`);
        updateSettingsSequentially(index + 1, projectData); // Proceed to next iframe
    });
}
