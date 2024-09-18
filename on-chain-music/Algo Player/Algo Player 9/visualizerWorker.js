// visualizerWorker.js

// Import the visualizer scripts
// Ensure these scripts are compatible with the worker context
importScripts(
    "/content/3ab9dda407f9c7f62b46401e2664bc1496247c8950620a11a36a8601267cb42fi0", // colourPalette.js
    "/content/4a6164e05aee1d4ed77585bc85e4d4530801ef71e1c277c868ce374c4a7b9902i0", // colourSettingsaMaster.js
    "/content/0505ae5cebbe9513648fc8e4ecee22d9969764f3cdac9cd6ec33be083c77ae96i0", // colourSettingsLevel0.js
    "/content/87bb49f5617a241e29512850176e53169c3da4a76444d5d8fcd6c1e41489a4b3i0", // colourSettingsLevel1.js
    "/content/cea34b6ad754f3a4e992976125bbd1dd59213aab3de03c9fe2eb10ddbe387f76i0", // colourSettingsLevel2.js
    "/content/bcee9a2e880510772f0129c735a4ecea5bb45277f3b99ff640c1bd393dddd6dfi0", // colourSettingsLevel3.js
    "/content/90d910fe4088c53a16eb227ec2fe59802091dc4ea51564b2665090403c34f59ci0", // colourSettingsLevel4.js
    "/content/916fd1731cdecf82706a290d03448c6dc505c01d6ec44bbca20281a19723d617i0", // colourSettingsLevel5.js
    "/content/6a5e5c8b42793dd35512dfddd81dbbe211f052ac79839dd54b53461f5783a390i0", // colourSettingsLevel6.js
    "/content/c0ee69121238f6438be8398038301cf5b1d876cce30a0d45a3a5e0b927826940i0", // colourSettingsLevel7.js
    "/content/6f1def70a3290c50793773a8b1712c9a1b0561b3674ee50a06c13bc4e492f459i0", // colourSettingsLevel8.js
    "/content/c7c92a81d5279950be7d0bd3e755ad620551bc65e6e514d6f7c29b4c24465d0ai0", // initVisualiser.js
    "/content/99ecc0668e27f03cf202f9ebc49d0332ac8f594bc9b5483969108b83723a0e9di0", // visualiserLogging.js
    "/content/305829e076d38130be65851c79241929983f16d679822015ff237029f67d5d9ei0", // visualiserMessageHandling_minified.js
    "/content/0d8309856ec04e8ab5bd6aa4689429102378fb45368ad0e2787f0dfc72c66152i0", // visualiserWorkers.js
    "/content/287c837ecffc5b80d8e3c92c22b6dbf0447a3d916b95ee314c66909f6f2b2f3ci0", // visualiserGeometry.js
    "/content/214457a4f832847565746ecb0b9460ec7dc8ad93549a00a69f18b3d492c0e005i0", // visualiserDrawingColours.js
    "/content/97c042112c29d9a9ca1da99890542befdbffaec6ff17798897c187a617a62f79i0"  // PFP module
);

// Initialize OffscreenCanvas if available
let offscreen = null;
let ctx = null;

self.onmessage = function(e) {
    const { type, data } = e.data;

    switch(type) {
        case 'init':
            // Initialize the OffscreenCanvas
            if (data.canvas) {
                offscreen = data.canvas;
                ctx = offscreen.getContext('2d'); // or 'webgl' based on your visualizer
                // Initialize your visualizer with the context
                initVisualizer(ctx);
            }
            break;
        case 'audioData':
            // Receive audio data to visualize
            if (ctx) {
                // Process audio data and update visualizer
                updateVisualizer(data.audioData);
            }
            break;
        default:
            console.warn(`Unknown message type: ${type}`);
    }
};

// Example functions (These should be defined in your visualizer scripts)
function initVisualizer(context) {
    // Initialize your visualizer with the given context
    // This could set up shaders, buffers, etc.
    console.log('Visualizer initialized in worker.');
}

function updateVisualizer(audioData) {
    // Update the visualizer based on the audio data
    // Perform rendering on OffscreenCanvas
    // Example: Clear and draw
    ctx.clearRect(0, 0, offscreen.width, offscreen.height);
    // ... your drawing code based on audioData
    ctx.fillStyle = 'red';
    ctx.fillRect(10, 10, 100, 100);
}