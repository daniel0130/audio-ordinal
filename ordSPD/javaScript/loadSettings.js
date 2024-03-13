// loadSettings.js

document.getElementById('fileInput').addEventListener('change', function(event) {
    const fileReader = new FileReader();
    fileReader.onload = async function(event) {
        try {
            const projectData = JSON.parse(event.target.result);
            const iframes = document.querySelectorAll('iframe');

            projectData.forEach((detail, index) => {
                const iframe = iframes.length > index ? iframes[index] : null;
                if (!iframe) return;

                const fullURL = `https://ordinals.com/content/${detail.url}`;
                iframe.onload = function() {
                    const speed = parseFloat(detail.speed);
                    const speedMessage = { type: "playAtSpeed", data: { speed } };
                    iframe.contentWindow.postMessage(speedMessage, '*');

                    // Handle schedule multiplier adjustments similarly, ensuring timing
                    console.log(`Set playback speed for ${iframe.id} to ${speed}x.`);
                };

                // Trigger the iframe load event by setting src
                iframe.src = fullURL;
            });

            console.log("URLs and settings loaded successfully.");

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
