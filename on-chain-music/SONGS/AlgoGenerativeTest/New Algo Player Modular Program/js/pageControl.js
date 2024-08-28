// pageControl.js

function resetPage() {
    log("RESET PAGE button clicked.");

    if (window.self !== window.top) {
        log("Running inside an iframe. Refreshing iframe.");
        window.location.reload(true); // Force iframe reload
    } else {
        log("Running as a standalone page.");

        clearIntervalsAndTimeouts();
        closeAudioContext();
        removeEventListeners();

        log("Stopping further resource loading.");
        window.stop();

        const baseUrl = `${window.location.origin}${window.location.pathname}`;
        log("Resetting page to base URL:", baseUrl);

        setTimeout(() => {
            log("Forcing page reload using location.replace()");
            window.location.replace(baseUrl);
        }, 300);
    }
}

// Event listener to reset page on before unload
window.addEventListener('beforeunload', () => {
    log("Before unload event triggered. Stopping all further execution.");
    resetPage();
});

// Event listener to reload the page forcefully
document.getElementById('reloadButton').addEventListener('click', function() {
    // Use location.replace to ensure no history entry is created
    window.location.replace(window.location.href);
});

// Expose functions to the global window object
window.resetPage = resetPage;
