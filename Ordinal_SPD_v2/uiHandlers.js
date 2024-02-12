// uiHandlers.js

function clearPad(pad) {
    console.log(`Clearing pad ${pad.dataset.pad}`);
      // Restore the original name
      pad.innerHTML = `OrdSPD ${pad.dataset.pad}`;
      pad.style.pointerEvents = 'auto';
      delete pad.dataset.loaded;
      // Clear any associated audio data
      clearAudioFromPad(pad); // Ensure this function exists and properly removes audio data  
    console.log(`Pad ${pad.dataset.pad} cleared successfully`);
}

function clearAudioFromPad(pad) {
    console.log(`Clearing audio from pad ${pad.dataset.pad}`);
    const audioPlayer = pad.querySelector('audio');
    if (audioPlayer) {
        audioPlayer.pause(); // Stop any ongoing playback
        pad.removeChild(audioPlayer); // Remove the audio element

        const audioElements = pad.querySelectorAll('audio');
        audioElements.forEach(audio => audio.parentNode.removeChild(audio));
        // Clear data attributes related to audio
        
        // Clear base64 audio data
        delete pad.dataset.base64Audio;
        // Clear audio source URL
        delete pad.dataset.audioSrc;
        console.log(`Audio cleared from pad ${pad.dataset.pad}`);
        }   
    // If there's base64 audio data associated, remove it
    delete pad.dataset.base64Audio;
}

function addDeleteButton(pad) {
    console.log(`Adding delete button to pad ${pad.dataset.pad}`);
    const deleteBtn = document.createElement('div');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = function(event) {
        event.stopPropagation(); // Prevent triggering pad click
        console.log(`Delete button clicked on pad ${pad.dataset.pad}`);
        clearAudioFromPad(pad); // Clear any audio associated with the pad
        clearPad(pad);
    };
    pad.appendChild(deleteBtn);
    console.log(`Delete button added to pad ${pad.dataset.pad}`);
}


function showModal() {
    let modal = document.getElementById('modal');
    if (!modal) {
        modal = createModal();
        document.body.appendChild(modal);
    }
    modal.style.display = 'flex';
}

function createModal() {
    const modal = document.createElement('div');
    modal.id = 'modal';
    Object.assign(modal.style, {
        position: 'fixed', left: '0', top: '0', width: '100%', height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex',
        justifyContent: 'center', alignItems: 'center', zIndex: '1000'
    });

    const modalContent = document.createElement('div');
    Object.assign(modalContent.style, {
        background: '#fff', padding: '20px', borderRadius: '5px', textAlign: 'center'
    });

    const localButton = document.createElement('button');
    localButton.textContent = 'Load from Local Device';
    localButton.onclick = () => document.getElementById('localFile').click();

    const urlInput = document.createElement('input');
    urlInput.type = 'text';
    urlInput.placeholder = 'Enter URL';

    const loadButton = document.createElement('button');
    loadButton.textContent = 'Load from URL';
    loadButton.onclick = () => {
        loadFromURL(urlInput.value);
        modal.style.display = 'none';
    };

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Close';
    closeButton.onclick = () => modal.style.display = 'none';

    modalContent.append(localButton, urlInput, loadButton, closeButton);
    modal.appendChild(modalContent);
    return modal;
}
