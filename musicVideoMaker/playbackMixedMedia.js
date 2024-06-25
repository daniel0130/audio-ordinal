// playbackMixedMedia.js

async function playMedia(media, mediaContainer, index) {
    let mediaElement;
    if (media.type === 'image') {
        mediaElement = document.createElement('img');
        mediaElement.src = media.url;
        mediaElement.onload = () => {
            console.log(`[${getCurrentTimestamp()}] Image loaded: ${media.url}`);
            console.log(`[${getCurrentTimestamp()}] Displaying image for ${media.duration} seconds`);
            const endTime = playbackStartTime + media.duration * 1000;
            scheduleNextMedia(endTime);
        };
        mediaElement.onerror = () => {
            console.error(`[${getCurrentTimestamp()}] Error loading image: ${media.url}`);
            alert(`Error loading image. Please check the URL and try again.`);
        };
    } else if (media.type === 'video') {
        mediaElement = document.createElement('video');
        mediaElement.controls = true;
        mediaElement.autoplay = true;
        mediaElement.muted = !media.audio;
        mediaElement.src = media.url;
        mediaElement.onloadeddata = () => {
            console.log(`[${getCurrentTimestamp()}] Video loaded: ${media.url}`);
            console.log(`[${getCurrentTimestamp()}] Displaying video for ${media.duration} seconds`);
            const endTime = playbackStartTime + media.duration * 1000;
            scheduleNextMedia(endTime);
        };
        mediaElement.onerror = () => {
            console.error(`[${getCurrentTimestamp()}] Error loading video: ${media.url}`);
            alert(`Error loading video. Please check the URL and try again.`);
        };
    }

    mediaContainer.innerHTML = '';
    mediaContainer.appendChild(mediaElement);
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

function getCurrentTimestamp() {
    const now = new Date();
    return now.toISOString();
}
