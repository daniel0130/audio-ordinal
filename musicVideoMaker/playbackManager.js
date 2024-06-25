// playbackManager.js


async function playTimeline() {
    if (timeline.length > 0) {
        if (!playbackStopped) {
            currentIndex = 0;
            elapsedTime = 0;
            totalElapsedTime = 0;
            totalPlaybackTime = timeline.reduce((acc, media) => acc + media.duration, 0);
        }
        playbackStopped = false;
        playbackStartTime = Date.now();
        console.log(`[${getCurrentTimestamp()}] Starting timeline playback`);
        console.log(`[${getCurrentTimestamp()}] Total playback time: ${totalPlaybackTime} seconds`);
        startTimer();

        await playMediaWrapper(currentIndex);
    }
}



function stopTimeline() {
    currentIndex = 0;
    elapsedTime = 0;
    totalElapsedTime = 0;
    playbackStopped = true;
    updateTimerDisplay(0);
    document.getElementById('media-container').innerHTML = '';
    console.log(`[${getCurrentTimestamp()}] Stopping timeline playback`);
    stopTimer();
}

async function playMediaWrapper(index) {
    if (playbackStopped || index >= timeline.length) {
        if (index >= timeline.length) {
            console.log(`[${getCurrentTimestamp()}] Montage complete`);
            document.getElementById('media-container').innerHTML = 'Montage complete!';
        }
        return;
    }

    const media = timeline[index];
    const mediaContainer = document.getElementById('media-container');
    mediaContainer.innerHTML = '';

    const response = await fetch(media.url, { method: 'HEAD' });
    const contentType = response.headers.get('Content-Type');
    console.log(`[${getCurrentTimestamp()}] Content-Type: ${contentType}`);
    console.log(`[${getCurrentTimestamp()}] Media details - URL: ${media.url}, Duration: ${media.duration}, Audio: ${media.audio}`);

    if (contentType.includes('video')) {
        media.type = 'video';
    } else if (contentType.includes('image')) {
        media.type = 'image';
    } else {
        alert('Unsupported media type!');
        console.error(`[${getCurrentTimestamp()}] Unsupported media type: ${media.url}`);
        return;
    }

    playbackStartTime = Date.now();
    await playMedia(media, mediaContainer, index);

    const endTime = playbackStartTime + media.duration * 1000;
    scheduleNextMedia(endTime);
}

function scheduleNextMedia(endTime) {
    const now = Date.now();
    const delay = endTime - now;

    if (delay > 0) {
        setTimeout(() => {
            if (!playbackStopped) {
                totalElapsedTime += (endTime - playbackStartTime) / 1000;
                currentIndex++;
                console.log(`[${getCurrentTimestamp()}] Moving to next media. Current index: ${currentIndex}`);
                if (currentIndex < timeline.length) {
                    playMediaWrapper(currentIndex);
                } else {
                    document.getElementById('media-container').innerHTML = 'Montage complete!';
                    console.log(`[${getCurrentTimestamp()}] Montage complete`);
                }
            }
        }, delay);
    } else {
        if (!playbackStopped) {
            totalElapsedTime += (endTime - playbackStartTime) / 1000;
            currentIndex++;
            console.log(`[${getCurrentTimestamp()}] Moving to next media. Current index: ${currentIndex}`);
            if (currentIndex < timeline.length) {
                playMediaWrapper(currentIndex);
            } else {
                document.getElementById('media-container').innerHTML = 'Montage complete!';
                console.log(`[${getCurrentTimestamp()}] Montage complete`);
            }
        }
    }
}
