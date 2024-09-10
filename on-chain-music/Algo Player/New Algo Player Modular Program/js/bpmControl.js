// bpmControl.js

function setBPM(targetBPM) {
    log("setBPM function called with targetBPM:", targetBPM);

    const newSeed = generateRandomSeed();
    log("Generated new seed for BPM:", newSeed);

    if (window.playbackStarted) {
        log("Stopping playback before reload");
        window.playbackStarted = false;
    }

    const newUrl = `${window.location.pathname}?seed=${newSeed}&bpm=${targetBPM}`;
    log("Redirecting to new URL with BPM and new seed:", newUrl);

    window.location.href = newUrl;

    setTimeout(() => {
        log("Forcing page reload");
        window.location.reload(true);
    }, 100);
}

function autoReinitializePlayer() {
    log("Auto reinitialization triggered");

    const newSeed = generateRandomSeed();
    log("Generated new seed:", newSeed);

    if (window.playbackStarted) {
        log("Stopping playback before reload");
        window.playbackStarted = false;
    }

    const newUrl = `${window.location.pathname}?seed=${newSeed}`;
    log("Redirecting to new URL with new seed:", newUrl);

    window.location.href = newUrl;

    setTimeout(() => {
        log("Forcing page reload");
        window.location.reload(true);
    }, 100);
}

// Expose functions to the global window object
window.setBPM = setBPM;
window.autoReinitializePlayer = autoReinitializePlayer;
