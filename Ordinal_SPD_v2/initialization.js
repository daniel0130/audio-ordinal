// initialization.js

const rolandContainer = document.querySelector('.roland-container');

document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('localFile');
    fileInput.addEventListener('change', handleFileSelect);

    rolandContainer.addEventListener('click', function(event) {
        const pad = event.target.closest('.pad');
        const isDeleteButton = event.target.classList.contains('delete-btn');

        if (pad && !isDeleteButton) {
            if (!pad.dataset.loaded) {
                currentPad = pad;
                showModal();
            } else {
                const audioPlayer = pad.querySelector('audio');
                if (audioPlayer) {
                    if (!audioPlayer.paused) {
                        audioPlayer.pause(); // Optional: Ensure playback stops before resetting
                    }
                    audioPlayer.currentTime = 0; // Reset playback to start
                    audioPlayer.play(); // Play the audio again from the start
                }
            }
        } else if (isDeleteButton) {
            clearPad(pad);
        }
    });
});
