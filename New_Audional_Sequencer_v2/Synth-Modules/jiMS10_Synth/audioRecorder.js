// audioRecorder.js

function setupMediaRecorder() {
    let context = window.audioContext;
    let gainNode = window.gainNode;

    if (!context || !gainNode) {
        console.error("AudioContext or gainNode is not initialized.");
        return; // Stop further execution if the context or gainNode isn't available
    }

    const mediaStreamDestination = context.createMediaStreamDestination();
    gainNode.connect(mediaStreamDestination);
    gainNode.connect(context.destination);

    const mimeType = MediaRecorder.isTypeSupported('audio/webm; codecs=opus') ? 'audio/webm; codecs=opus' : 'audio/webm';
    let recorder = new MediaRecorder(mediaStreamDestination.stream, { mimeType });
    let audioChunks = [];

    // Event handlers and other recorder setup
    recorder.ondataavailable = event => {
        if (event.data.size > 0) {
            audioChunks.push(event.data);
            console.log(`Received audio data size: ${event.data.size}, chunks count: ${audioChunks.length}`);
        } else {
            console.log('Received an empty audio chunk.');
        }
    };

    recorder.onerror = event => {
        console.error('Recorder Error:', event.error);
    };

    recorder.onstop = async () => {
        console.log(`Recorder stopped, total chunks: ${audioChunks.length}`);
        if (audioChunks.length > 0) {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            console.log('Blob created, converting to ArrayBuffer...');
            const arrayBuffer = await blobToArrayBuffer(audioBlob);
            
            console.log('ArrayBuffer created, posting message to parent...');
            window.parent.postMessage({
                type: 'audioData',
                data: arrayBuffer,
                mimeType: mimeType,
                filename: 'SynthSample',
                channelIndex: currentChannelIndex
            }, '*');
            console.log('Audio data sent to parent.');
        } else {
            console.error('No audio data recorded.');
        }
    };
    
    // Global access to recording controls
    window.startAudioRecording = () => {
        console.log('Global start recording triggered');
        audioChunks.length = 0;  // Clear the previous recordings
        recorder.start();
    };

    window.stopAudioRecording = () => {
        console.log('Global stop recording triggered');
        recorder.stop();
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
        let audioUrl; // Ensure this variable is defined correctly in your context or passed in
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
}


// Delayed execution or tied to a user interaction
document.addEventListener('DOMContentLoaded', setupMediaRecorder);

