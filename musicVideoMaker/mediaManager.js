// mediaManager.js

let timeline = [];

function addMedia() {
    let url = document.getElementById('media-url').value;
    const duration = parseFloat(document.getElementById('media-duration').value);
    const audio = document.getElementById('media-audio').checked;

    // Check if the input is a full URL or just an ID
    if (!url.startsWith('http')) {
        url = `https://ordinals.com/content/${url}`;
    }

    if (url && duration > 0) {
        const media = { url, duration, audio };
        timeline.push(media);
        console.log(`[${getCurrentTimestamp()}] Media added:`, media);
        console.log(`[${getCurrentTimestamp()}] Media details - URL: ${url}, Duration: ${duration}, Audio: ${audio}`);
        updateTimelineUI();
        resetControls();
    }
}

function removeMedia(index) {
    console.log(`[${getCurrentTimestamp()}] Removing media at index: ${index}`);
    timeline.splice(index, 1);
    updateTimelineUI();
}

function updateDuration(index, duration) {
    duration = parseFloat(duration);
    if (duration > 0) {
        console.log(`[${getCurrentTimestamp()}] Updating duration at index: ${index} to: ${duration}`);
        timeline[index].duration = duration;
    }
}

function updateAudio(index, audio) {
    console.log(`[${getCurrentTimestamp()}] Updating audio at index: ${index} to: ${audio}`);
    timeline[index].audio = audio;
    updateTimelineUI();
}

function resetControls() {
    document.getElementById('media-url').value = '';
    document.getElementById('media-duration').value = '2.00';
    document.getElementById('media-audio').checked = false;
}

function saveTimeline() {
    const json = JSON.stringify(timeline, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'timeline.json';
    a.click();
    URL.revokeObjectURL(url);
}

function loadTimeline(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const json = e.target.result;
            timeline = JSON.parse(json);
            updateTimelineUI();
        };
        reader.readAsText(file);
    }
}

function getCurrentTimestamp() {
    const now = new Date();
    return now.toISOString();
}

