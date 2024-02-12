// contentHandlers.js

const samplePlayer = new AudioSamplePlayer();


function handleFileSelect(event) {
    const files = event.target.files;
    if (files.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            try {
                const json = JSON.parse(content);
                listJSONFields(json); // List fields if it's JSON
                processJSONContent(json, currentPad); // Process JSON content
            } catch (err) {
                processHTMLContent(content, currentPad); // Process HTML content
            }
        };
        reader.readAsText(files[0]);
        document.getElementById('modal').style.display = 'none';
    }
}

function loadFromURL(url) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.clone().json().then(json => {
                return {type: 'application/json', content: json};
            }).catch(() => {
                return response.text().then(text => {
                    return {type: 'text/html', content: text};
                });
            });
        })
        .then(({type, content}) => {
            if (type === 'application/json') {
                processJSONContent(content, currentPad); // Process JSON content
            } else if (type === 'text/html') {
                processHTMLContent(content, currentPad); // Process HTML content
            } else {
                throw new Error('Invalid content type. Expected JSON or HTML.');
            }
        })
        .catch(error => {
            console.error('Error loading or parsing URL:', error);
            alert('Failed to load or parse from URL. Make sure it is a valid JSON or HTML file.');
        });
}



function processJSONContent(json, pad) {
    console.log("Processing JSON content for pad", pad.dataset.pad);

    const audionalArtUrl = json.metadata?.recursiveURLs?.audionalArt;
    if (audionalArtUrl) {
        console.log("Found audionalArt URL:", audionalArtUrl);
        setImageToPad(audionalArtUrl, pad);
    } else {
        console.log("No audionalArt URL found in JSON, loading default image.");
        loadDefaultImage(pad); // Call function to load a default image
    }

    const base64AudioData = json.audioData;
    if (base64AudioData) {
        console.log("Found base64AudioData, attaching to pad");
        attachBase64Audio(base64AudioData, pad);
    } else {
        console.log("No base64AudioData found in JSON");
    }
}

function listJSONFields(json) {
    const fields = Object.keys(json);
    console.log('Fields in JSON:', fields);
    alert('Fields found in JSON: ' + fields.join(', '));
}

function processHTMLContent(htmlContent, pad) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    const imgSrc = doc.querySelector('img') ? doc.querySelector('img').src : '';

    clearPad(pad); // Assuming this function clears the pad of previous content

    if (imgSrc) {
        setImageToPad(imgSrc, pad); // Set the image to the pad, if any
    }

    // Extract base64 audio data from the <audio> element or its <source> child
    let base64AudioData = null;
    const audioElement = doc.querySelector('audio');
    const sourceElement = doc.querySelector('audio source');
    
    if (audioElement && audioElement.src.startsWith('data:audio')) {
        base64AudioData = audioElement.src;
    } else if (sourceElement && sourceElement.src.startsWith('data:audio')) {
        base64AudioData = sourceElement.src;
    }

    if (base64AudioData) {
        console.log("Found base64AudioData in HTML content, attaching to pad");
        attachBase64Audio(base64AudioData, pad);
    } else {
        console.error("No base64AudioData found in HTML content");
        // Optionally handle the case where no base64 audio data is found
    }

    // Additional logic to mark the pad as loaded or to add UI elements like a delete button
    pad.dataset.loaded = 'true';
    addDeleteButton(pad); // Add a delete button to the pad, if applicable
}



// Assuming the rest of the contentHandlers.js remains the same

function attachBase64Audio(base64Data, pad) {
    console.log("Preparing audio data for pad:", pad.dataset.pad);

    // Initialize AudioSamplePlayer if not already done
    if (!window.audioSamplePlayer) {
        window.audioSamplePlayer = new AudioSamplePlayer();
    }

    // Use a unique key for each pad's audio to store and retrieve from AudioSamplePlayer
    const audioKey = `padAudio_${pad.dataset.pad}`;

    // Load the base64 audio data into the sample player, if not already done
    if (!window.audioSamplePlayer.sampleBuffers[audioKey]) {
        window.audioSamplePlayer.loadSampleFromBase64(audioKey, base64Data);
    }

    // Attach event listener to play the audio when the pad is clicked
    pad.addEventListener('click', () => {
        window.audioSamplePlayer.playSample(audioKey);
    });

    console.log("Audio ready for playback on pad:", pad.dataset.pad);
    pad.dataset.loaded = 'true';
}


function attachAudio(audioSrc, pad) {
    const updatedAudioSrc = audioSrc.startsWith('http') ? audioSrc : `https://ordinals.com${audioSrc.startsWith('/') ? '' : '/'}${audioSrc}`;

    const audioPlayer = document.createElement('audio');
    audioPlayer.src = updatedAudioSrc;
    audioPlayer.controls = true;
    pad.appendChild(audioPlayer);
    pad.dataset.loaded = 'true';
    addDeleteButton(pad);
}

function setImageToPad(imgSrc, pad) {
    // Clear existing content
    pad.innerHTML = '';

    const img = new Image();
    img.onload = () => {
        pad.appendChild(img);
        img.style.display = 'block';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        addDeleteButton(pad); // Assuming this function adds a delete button
        pad.dataset.loaded = 'true';
    };
    img.onerror = () => {
        console.error("Error loading image");
        pad.innerHTML = 'Error loading image';
    };

    // Check if imgSrc is base64 data and use it directly if so
    if (imgSrc.startsWith('data:image')) {
        img.src = imgSrc;
    } else {
        // If not base64, prepend the domain if necessary
        const updatedImgSrc = imgSrc.startsWith('http') ? imgSrc : `https://ordinals.com${imgSrc.startsWith('/') ? '' : '/'}${imgSrc}`;
        img.src = updatedImgSrc;
    }
}

function loadDefaultImage(pad) {
    const defaultImageUrl = "https://ordinals.com/content/40136786a9eb1020c87f54c63de1505285ec371ff35757b44d2cc57dbd932f22i0";
    setImageToPad(defaultImageUrl, pad);
}
