// audioRecorder.js
const context = window.context;

// Create a MediaStreamDestination to capture the audio from the context
const mediaStreamDestination = context.createMediaStreamDestination();
// Connect the global gain node to the MediaStreamDestination to capture all audio
window.gainNode.connect(mediaStreamDestination);

// Connect the global gain node also to the context's destination to ensure it's still audible
window.gainNode.connect(context.destination);

const mimeType = MediaRecorder.isTypeSupported('audio/webm; codecs=opus') ? 'audio/webm; codecs=opus' : 'audio/webm';
const recorder = new MediaRecorder(mediaStreamDestination.stream, { mimeType });
const audioChunks = [];
let audioUrl;

recorder.ondataavailable = event => {
    if (event.data.size > 0) {
        audioChunks.push(event.data);
        console.log(`Received audio data size: ${event.data.size}, chunks count: ${audioChunks.length}`);
    } else {
        console.log('Received an empty audio chunk.');
    }
};

recorder.onstop = () => {
    console.log(`Recorder stopped, total chunks: ${audioChunks.length}`);
    if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        console.log('Blob size:', audioBlob.size);
        audioUrl = URL.createObjectURL(audioBlob);
        console.log('Recording stopped and processed, URL created:', audioUrl);

        // Convert Blob to ArrayBuffer to send via postMessage
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result;
            sendAudioToParent(arrayBuffer, globalSequencerChannelIndex);
            console.log('Audio data sent to parent.');
        };
        reader.onerror = (e) => {
            console.error('Failed to read audio blob:', e);
        };
        reader.readAsArrayBuffer(audioBlob);

    } else {
        console.error('No audio data recorded.');
    }
};


recorder.onerror = event => {
    console.error('Recorder Error:', event.error);
};

// Expose the start and stop recording functions globally
window.startAudioRecording = function() {
    console.log('Global start recording triggered');
    audioChunks.length = 0;  // Clear the previous recordings
    recorder.start();
};

window.stopAudioRecording = function() {
    console.log('Global stop recording triggered');
    // Wait for a few seconds to capture the tail of the last note
        recorder.stop();
        console.log('Recorder stopped after delay to capture tail sounds.');
};


// document.getElementById('recordButton').addEventListener('click', window.startAudioRecording);
// document.getElementById('stopRecordButton').addEventListener('click', window.stopAudioRecording);

document.getElementById('playRecordButton').addEventListener('click', () => {
    if (context.state === 'suspended') {
        context.resume().then(() => {
            console.log("AudioContext resumed successfully");
            playRecordedAudio();
        }).catch(e => console.error('Error resuming the audio context:', e));
    } else {
        playRecordedAudio();
    }
});

function playRecordedAudio() {
    if (audioUrl) {
        console.log('Playing from URL:', audioUrl);
        const audio = new Audio(audioUrl);
        audio.play().then(() => {
            console.log('Playback started');
        }).catch(e => {
            console.error('Error playing the audio:', e);
        });
    } else {
        console.error('Audio URL is not defined.');
    }
}

// Ensure the correct channel index is used when sending audio data
function sendAudioToParent(audioData, channelIndex) {
    console.log(`Sending audio to parent with channel index: ${channelIndex}`);
    // Make sure to use 'parent' directly
    parent.postMessage({
        type: 'audioData',
        data: audioData,
        channelIndex: channelIndex
    }, '*');  // Consider specifying a more restrictive target origin for security
}


// Listen for messages in the synthesizer iframe
window.addEventListener('message', function(event) {
    // Check if the message is intended for this iframe and is from the trusted parent
    if (event.origin === window.location.origin) { // Replace with the actual expected origin
        if (event.data.channelIndex !== undefined) {
            console.log(`Synthesizer loaded for channel index: ${event.data.channelIndex}`);
            // You can now use this channelIndex to tag any audio data or processing
        }
    } else {
        console.error('Received message from untrusted source');
    }
}, false);

