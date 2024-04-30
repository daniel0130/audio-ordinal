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


// let audioUrl;

recorder.ondataavailable = event => {
    if (event.data.size > 0) {
        audioChunks.push(event.data);
        console.log(`Received audio data size: ${event.data.size}, chunks count: ${audioChunks.length}`);
    } else {
        console.log('Received an empty audio chunk.');
    }
};

recorder.onstop = async () => {
    console.log(`Recorder stopped, total chunks: ${audioChunks.length}`);
    if (audioChunks.length > 0) {
        const audioBlob = new Blob(audioChunks, { type: mimeType });
        const arrayBuffer = await blobToArrayBuffer(audioBlob);
        
        window.parent.postMessage({
            type: 'audioData',
            data: arrayBuffer,
            mimeType: mimeType,
            filename: 'SynthSample',
            channelIndex: 0
        }, '*');
        console.log('Audio data sent to parent.');
    } else {
        console.error('No audio data recorded.');
    }
};

function blobToArrayBuffer(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}

recorder.onerror = event => {
    console.error('Recorder Error:', event.error);
};
// recorder.onstop = () => {
//     console.log(`Recorder stopped, total chunks: ${audioChunks.length}`);
//     if (audioChunks.length > 0) {
//         const audioBlob = new Blob(audioChunks, { type: mimeType });
//         console.log('Blob size:', audioBlob.size);

//         // Convert Blob to ArrayBuffer and send to parent
//         const reader = new FileReader();
//         reader.onload = function() {
//             const arrayBuffer = reader.result;
//             window.parent.postMessage({
//                 type: 'audioData',
//                 data: arrayBuffer,
//                 channelIndex: 0 // Assuming channel index is 0; adjust as needed
//             }, '*');
//             console.log('Audio data sent to parent.');
//         };
//         reader.onerror = function(err) {
//             console.error('Error reading audio blob:', err);
//         };
//         reader.readAsArrayBuffer(audioBlob);
//     } else {
//         console.error('No audio data recorded.');
//     }
// };

// recorder.onerror = event => {
//     console.error('Recorder Error:', event.error);
// };

// Expose the start and stop recording functions globally
window.startAudioRecording = function() {
    console.log('Global start recording triggered');
    audioChunks.length = 0;  // Clear the previous recordings
    recorder.start();
};

window.stopAudioRecording = function() {
    console.log('Global stop recording triggered');
        recorder.stop();
};


document.getElementById('recordButton').addEventListener('click', window.startAudioRecording);
document.getElementById('stopRecordButton').addEventListener('click', window.stopAudioRecording);

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

document.getElementById('recordButton').addEventListener('click', () => {
    console.log('Recording started');
    audioChunks.length = 0;
    recorder.start();
});

document.getElementById('stopRecordButton').addEventListener('click', () => {
    console.log('Stopping recording');
    recorder.stop();
});