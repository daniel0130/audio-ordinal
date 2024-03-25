// // loadSettings.js
// console.log("[loadSettings] loadSettings.js loaded.");
// document.getElementById('fileInput').addEventListener('change', async function(event) {
//     const fileReader = new FileReader();

//     fileReader.onload = async function(event) {
//         try {
//             const fileContent = event.target.result;
            
//             // Attempt to parse the JSON data and validate it
//             const projectData = JSON.parse(fileContent);
//             if (!Array.isArray(projectData) || !projectData.every(detail => 'url' in detail && 'speed' in detail && 'action' in detail && 'times' in detail)) {
//                 throw new Error("Invalid JSON format: Missing required properties");
//             }

//             const iframes = document.querySelectorAll('iframe');
//             const iframeArray = Array.from(iframes);

//             // Initialize window.iframeSettings if not already initialized
//             window.iframeSettings = window.iframeSettings || {};

//             projectData.forEach((detail, index) => {
//                 if (index >= iframeArray.length) {
//                     console.warn(`No iframe available for index ${index}. Skipping settings application.`);
//                     return; // Skip if there are more settings than iframes
//                 }

//                 const iframe = iframeArray[index];
//                 const iframeId = iframe.id || `iframe-${index}`;
//                 iframe.id = iframeId; // Ensure iframe has an ID

//                 window.iframeSettings[iframeId] = {
//                     url: `https://ordinals.com/content/${detail.url}`,
//                     speed: detail.speed,
//                     action: detail.action,
//                     times: detail.times
//                 };

//                 iframe.src = window.iframeSettings[iframeId].url; // Trigger iframe to load new content
//             });

//             console.log("[loadSettings] Loading iframe content based on project data...");

//             await Promise.all(iframeArray.slice(0, projectData.length).map(iframe => 
//                 new Promise(resolve => {
//                     iframe.onload = () => {
//                         console.log(`[loadSettings] iframe ${iframe.id} loaded.`);
//                         resolve();
//                     };
//                     iframe.onerror = (error) => {
//                         console.error(`[loadSettings] Failed to load content for iframe ${iframe.id}:`, error);
//                         resolve(); // Resolve to continue despite the error
//                     };
//                 })
//             ));

//             // Apply additional settings post-load
//             iframeArray.forEach(iframe => {
//                 const iframeId = iframe.id;
//                 const settings = window.iframeSettings[iframeId];
//                 if (!settings) return;

//                 if (settings.speed !== undefined) {
//                     const speedMessage = { type: "playAtSpeed", data: { speed: settings.speed }};
//                     iframe.contentWindow.postMessage(speedMessage, '*');
//                 }

//                 if (settings.action !== undefined && settings.times !== undefined) {
//                     for (let i = 0; i < settings.times; i++) {
//                         const messageData = { type: settings.action };
//                         iframe.contentWindow.postMessage(messageData, '*');
//                     }
//                     console.log(`[loadSettings] Applied settings for iframe-${iframe.id}: speed=${settings.speed}, action=${settings.action}, times=${settings.times}`);
//                 }
//             });

//             // After all settings have been applied successfully
//             console.log("All settings loaded and applied successfully.");

//             // Additional log to show the current state of window.iframeSettings
//             console.log("[loadSettings] Final state of window.iframeSettings:", JSON.stringify(window.iframeSettings, null, 2));

//         } catch (e) {
//             console.error("Failed to load project data:", e);
//         }
//     };

//     fileReader.readAsText(event.target.files[0]);
// }, false);

