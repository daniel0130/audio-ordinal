async function playStillMedia(media, mediaContainer, index) {
    let mediaElement = document.createElement('img');
    mediaElement.src = media.url;
    mediaElement.onload = () => {
        console.log('Image loaded:', media.url);
        setTimeout(() => {
            currentIndex++;
            if (currentIndex < timeline.length) {
                playMedia(currentIndex);
            } else {
                mediaContainer.innerHTML = 'Montage complete!';
                console.log('Montage complete');
            }
        }, media.duration * 1000);
    };
    mediaElement.onerror = () => {
        console.error('Error loading image:', media.url);
    };
    mediaContainer.appendChild(mediaElement);
}
