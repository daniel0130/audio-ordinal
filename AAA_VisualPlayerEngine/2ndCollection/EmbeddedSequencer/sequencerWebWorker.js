// sequencerWebWorker.js

var unifiedSequencerSettings = new UnifiedSequencerSettings();


let isPlaying = false;

self.addEventListener('message', (event) => {
    // Listen for messages from the main thread
    const { action } = event.data;
    
    switch (action) {
        case 'start':
            // Start the sequencer logic
            // This could involve starting the scheduler and handling the necessary initialization
            // Trigger any function or event here that corresponds to starting the sequencer
            console.log("[Sequencer Worker] Start playback.");
            // Placeholder for startScheduler() or equivalent logic
            break;
        case 'stop':
            // Stop the sequencer logic
            // This would involve stopping the scheduler and handling the cleanup
            console.log("[Sequencer Worker] Stop playback.");
            // Placeholder for stopScheduler() or equivalent logic
            break;
        case 'loadSettings':
            // Adapt this to fit how your sequencer logic handles settings
            console.log("[Worker] Loading settings:", event.data.settings);
            loadSequencerSettings(event.data.settings);
            break;
        case 'togglePlayback':
            if (isPlaying) {
                stopScheduler();
                console.log("[Worker] Playback stopped.");
            } else {
                startScheduler();
                console.log("[Worker] Playback started.");
            }
            isPlaying = !isPlaying;
            break;
        // Additional actions can be handled here
        default:
            // Handle unrecognized actions
            console.log("[Worker] Unrecognized action:", action);
    }
});
