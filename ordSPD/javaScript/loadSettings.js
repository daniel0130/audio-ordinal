// loadSettings.js

document.getElementById('fileInput').addEventListener('change', function(event) {
    const fileReader = new FileReader();
    fileReader.onload = async function(event) {
        try {
            const projectData = JSON.parse(event.target.result);
            const iframes = document.querySelectorAll('iframe');

            // Wait for all iframes to load before applying settings
            const loadPromises = Array.from(iframes).map((iframe, index) => {
                return new Promise((resolve) => {
                    iframe.onload = resolve;
                    const detail = projectData.length > index ? projectData[index] : null;
                    if (detail) {
                        const src = `https://ordinals.com/content/${detail.url}`; // Reconstruct the full URL
                        iframe.src = src; // Trigger load
                    }
                });
            });

            await Promise.all(loadPromises);

            // After all iframes have loaded, apply play speed and schedule multiplier settings
            projectData.forEach((detail, index) => {
                const iframe = iframes[index];
                if (!iframe || !detail) return;

                // Apply play speed setting
                const speed = parseFloat(detail.speed);
                const speedMessage = { type: "playAtSpeed", data: { speed }};
                iframe.contentWindow.postMessage(speedMessage, '*');

                // Apply schedule multiplier adjustments
                const actionType = detail.action; // "increaseScheduleMultiplier" or "decreaseScheduleMultiplier"
                const repetitions = detail.times;
                for (let i = 0; i < repetitions; i++) {
                    const messageData = { type: actionType };
                    iframe.contentWindow.postMessage(messageData, '*');
                }

                console.log(`Settings applied for ${iframe.id}: Speed set to ${speed}.`);
            });

            console.log("All settings loaded successfully.");

        } catch (e) {
            console.error("Failed to load project data:", e);
        }
    };
    fileReader.readAsText(event.target.files[0]);
}, false);


// // This function needs to be defined to simulate the adjustments based on the available commands
// function adjustSettingsForIframe(iframe, settings, callback) {
//     // Example of how you might simulate increasing the volume
//     // This is a placeholder and needs to be replaced with actual logic
//     // that sends the right messages to the iframe based on the settings
//     console.log(`Adjusting settings for ${iframe.id}...`);
    
//     // Implement logic to send messages to iframe here
//     // For example, to increase volume, send 'increaseVolume' messages as needed
//     // Remember to use a delay between messages to give the iframe time to process each one

//     // Call callback once all settings are adjusted
//     // This is important for the sequential update process to continue
//     setTimeout(callback, 1000); // Placeholder delay
// }

// function updateSettingsSequentially(index, projectData) {
//     if (index >= iframes.length) return; // All iframes updated

//     let iframe = iframes[index];
//     let settings = projectData[index].settings;

//     // Adjust settings for the iframe
//     adjustSettingsForIframe(iframe, settings, () => {
//         // Callback function after settings are adjusted
//         console.log(`Settings applied for ${iframe.id}.`);
//         updateSettingsSequentially(index + 1, projectData); // Proceed to next iframe
//     });
// }
