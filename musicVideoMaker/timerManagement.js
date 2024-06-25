// timerManagement.js

function updateTimerDisplay(time) {
    const timerElement = document.getElementById('timer');
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String((time % 60).toFixed(2)).padStart(5, '0');
    timerElement.textContent = `${hours}:${minutes}:${seconds}`;
}


function updateTimer() {
    if (!playbackStopped) {
        const currentTime = (Date.now() - playbackStartTime) / 1000 + totalElapsedTime;
        updateTimerDisplay(currentTime);
        requestAnimationFrame(updateTimer);
    }
}

function updateTimerDisplay(time) {
    const timerElement = document.getElementById('timer');
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String((time % 60).toFixed(2)).padStart(5, '0');
    timerElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function getCurrentTimestamp() {
    const now = new Date();
    return now.toISOString();
}

