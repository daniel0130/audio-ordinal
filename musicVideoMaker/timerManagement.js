// timerManagement.js

let playbackStartTime = 0;
let totalElapsedTime = 0;
let playbackStopped = true;
let timerInterval = null;
let currentIndex = 0;
let elapsedTime = 0;
let totalPlaybackTime = 0;


function updateTimerDisplay(time) {
    const timerElement = document.getElementById('timer');
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String((time % 60).toFixed(2)).padStart(5, '0');
    timerElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function startTimer() {
    if (playbackStopped) {
        playbackStartTime = Date.now();
        playbackStopped = false;
        timerInterval = requestAnimationFrame(updateTimer);
    }
}

function stopTimer() {
    if (!playbackStopped) {
        totalElapsedTime += (Date.now() - playbackStartTime) / 1000;
        playbackStopped = true;
        cancelAnimationFrame(timerInterval);
    }
}

function resetTimer() {
    playbackStartTime = 0;
    totalElapsedTime = 0;
    playbackStopped = true;
    updateTimerDisplay(0);
    cancelAnimationFrame(timerInterval);
}

function updateTimer() {
    if (!playbackStopped) {
        const currentTime = (Date.now() - playbackStartTime) / 1000 + totalElapsedTime;
        updateTimerDisplay(currentTime);
        timerInterval = requestAnimationFrame(updateTimer);
    }
}
