// uiManager.js

function updateTimelineUI() {
    const timelineDiv = document.getElementById('timeline');
    timelineDiv.innerHTML = '';
    timeline.forEach((media, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'timeline-item';
        itemDiv.innerHTML = `
            <span>${media.url} (${media.duration.toFixed(2)}s, Audio: ${media.audio ? 'On' : 'Off'})</span>
            <input type="number" value="${media.duration.toFixed(2)}" min="0.01" step="0.01" onchange="updateDuration(${index}, this.value)">
            <label>
                <input type="checkbox" ${media.audio ? 'checked' : ''} onchange="updateAudio(${index}, this.checked)"> Audio
            </label>
            <button onclick="removeMedia(${index})">Remove</button>
        `;
        timelineDiv.appendChild(itemDiv);
    });
}

function updateTimerDisplay(time) {
    const timerElement = document.getElementById('timer');
    const hours = String(Math.floor(time / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((time % 3600) / 60)).padStart(2, '0');
    const seconds = String((time % 60).toFixed(2)).padStart(5, '0');
    timerElement.textContent = `${hours}:${minutes}:${seconds}`;
}

