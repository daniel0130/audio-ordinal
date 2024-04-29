// audioRecorder.js

console.log('audioRecorder.js loaded');

let audioContext = new AudioContext();
let mediaRecorder;
let recordedChunks = [];
let isRecording = false;
let audioBuffers = new Map();

async function initializeMedia() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        mediaRecorder = new MediaRecorder(stream);
        

        mediaRecorder.ondataavailable = function(e) {
            if (e.data.size > 0) {
                recordedChunks.push(e.data);
                console.log('Audio chunk recorded:', e.data.size, 'bytes');
            } else {
                console.log('No data in chunk');
            }
        };
        

        mediaRecorder.onstop = handleRecordingStop;
        console.log('MediaRecorder initialized and ready for recording.');
    } catch (err) {
        console.error('Error accessing media devices:', err);
    }
}

async function handleRecordingStop() {
    if (recordedChunks.length > 0) {
        const blob = new Blob(recordedChunks);
        const arrayBuffer = await blob.arrayBuffer();
        decodeAndStoreAudio(arrayBuffer);
    } else {
        console.log('No audio chunks recorded.');
    }
    document.getElementById('recordButton').classList.remove('active');
    recordedChunks = [];
    console.log('Audio recording stopped and processed.');
}

async function decodeAndStoreAudio(audioData) {
    try {
        const audioBuffer = await audioContext.decodeAudioData(audioData);
        audioBuffers.set('recorded_forward', audioBuffer);
        console.log('Audio buffer stored successfully', audioBuffer);
    } catch (error) {
        console.error('Failed to decode and store audio buffer:', error);
    }
}


async function createReverseBuffer(audioBuffer) {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length;
    const sampleRate = audioBuffer.sampleRate;
    const reverseBuffer = audioContext.createBuffer(numberOfChannels, length, sampleRate);

    for (let channel = 0; channel < numberOfChannels; channel++) {
        const forwardData = audioBuffer.getChannelData(channel);
        const reverseData = reverseBuffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            reverseData[i] = forwardData[length - 1 - i];
        }
    }
    return reverseBuffer;
}

function startAudioRecording() {
    if (mediaRecorder && !isRecording) {
        mediaRecorder.start();
        isRecording = true;
        console.log('Audio Recording started');
    } else {
        console.log('Failed to start audio recording:', {mediaRecorder, isRecording});
    }
}


function stopRecording() {
    if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
        isRecording = false;
        console.log('Audio Recording stopped');
    }
}

function playRecording() {
    console.log('Attempting to play recording...');
    const audioBuffer = audioBuffers.get('recorded_forward');
    if (audioBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        source.start();
        console.log('Audio playback started', 'Buffer duration:', audioBuffer.duration);
    } else {
        console.log('No audio buffer available for playback. Check buffer storage and decoding.');
    }
}



document.getElementById('playRecordButton').addEventListener('click', playRecording);

window.onload = initializeMedia;
window.startAudioRecording = startAudioRecording;
window.stopAudioRecording = stopRecording;
