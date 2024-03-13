// loadSettings.js

document.getElementById('fileInput').addEventListener('change', async function(event) {
    const fileReader = new FileReader();

    fileReader.onload = async function(event) {
        try {
            const fileContent = event.target.result;
            const projectData = JSON.parse(fileContent);
            const iframes = document.querySelectorAll('iframe');

            // Store iframes in an array for performance
            const iframeArray = Array.from(iframes);

            projectData.forEach((detail, index) => {
                const iframeId = `iframe-${index}`;
                const iframe = iframeArray[index];
                
                // Initialize window.iframeSettings for the current iframe
                window.iframeSettings = window.iframeSettings || {};
                window.iframeSettings[iframeId] = window.iframeSettings[iframeId] || {};

                if (detail && iframe) {
                    const src = `https://ordinals.com/content/${detail.url}`;
                    iframe.src = src; // Trigger load

                    // Update settings
                    if (detail.speed !== undefined) {
                        window.iframeSettings[iframeId].speed = detail.speed;
                    }
                    if (detail.action !== undefined && detail.times !== undefined) {
                        window.iframeSettings[iframeId].action = detail.action;
                        window.iframeSettings[iframeId].times = detail.times;
                    }
                }
            });

            // Wait for all iframes to load before applying settings
            await Promise.all(iframeArray.map(iframe => new Promise(resolve => iframe.onload = resolve)));

            // Apply settings
            iframeArray.forEach(iframe => {
                const iframeId = iframe.id;
                const settings = window.iframeSettings[iframeId];
                if (!settings) return; // Skip if settings are not found

                // Apply play speed setting
                if (settings.speed !== undefined) {
                    const speedMessage = { type: "playAtSpeed", data: { speed: settings.speed }};
                    iframe.contentWindow.postMessage(speedMessage, '*');
                }

                // Apply schedule multiplier adjustments based on the action and times
                if (settings.action !== undefined && settings.times !== undefined) {
                    for (let i = 0; i < settings.times; i++) {
                        const messageData = { type: settings.action };
                        iframe.contentWindow.postMessage(messageData, '*');
                    }
                    console.log(`[loadSettings] Applied URL for iframe-${iframe.id.split('-')[1]}:`, iframe.src);
                }
                console.log(`[loadSettings] DEBUG Applying settings for iframe ${iframe.id}:`, window.iframeSettings[iframe.id]);

            });

            console.log("All settings loaded and applied successfully.");

        } catch (e) {
            console.error("Failed to load project data:", e);
        }
        console.log("[loadSettings] DEBUG Settings loaded and applied from file:", window.iframeSettings);

    };

    fileReader.readAsText(event.target.files[0]);
    console.log("[loadSettings] DEBUG After loading, iframeSettings:", JSON.stringify(window.iframeSettings));

}, false);
