// audioWebworker.js

let stepDuration; // Duration of a single step in seconds
let timerID;

self.onmessage = (e) => {
    if (e.data.action === 'start') {
        stepDuration = e.data.stepDuration * 1000 * 0.5; // Convert to milliseconds and adjust for interval
        startScheduling();
    }
};

function startScheduling() {
    if (timerID) clearInterval(timerID); // Clear existing timer if any

    timerID = setInterval(() => {
        postMessage({ action: 'scheduleNotes' });
    }, stepDuration);
}
