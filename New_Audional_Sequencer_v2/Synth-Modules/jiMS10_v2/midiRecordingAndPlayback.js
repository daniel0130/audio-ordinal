// midiRecordingAndPlayback.js

import { playMS10TriangleBass } from './audioContext.js';
import { midiNoteToFrequency } from './midiHandler.js';

let isPlaying = false;
let isRecording = false;
export let midiRecording = [];
export let recordingStartTime = 0;
let playbackTimeouts = []; // Array to store timeouts for playback

export function startMidiRecording() {
  isRecording = true;
  midiRecording = [];
  recordingStartTime = 0; // Reset start time
  console.log('MIDI recording started');
}

export function stopMidiRecording() {
  isRecording = false;
  console.log('MIDI recording stopped');
  console.log(`Total events recorded: ${midiRecording.length}`);
}

export function playMidiRecording() {
  if (midiRecording.length === 0) {
    console.log('No MIDI recording to play');
    return;
  }

  if (isPlaying) {
    stopMidiPlayback();
    return;
  }

  isPlaying = true;
  document.getElementById('PlayMidi').innerText = 'Stop Midi Recording';

  const nudgeValue = parseFloat(document.getElementById('timingAdjust').value);
  const nudgeOffset = (nudgeValue / 100) * (midiRecording[midiRecording.length - 1].timestamp - recordingStartTime);

  midiRecording.forEach((event, index) => {
    let adjustedTimestamp = event.timestamp + nudgeOffset;
    const delay = adjustedTimestamp - recordingStartTime;

    console.log(`Scheduling event ${index + 1}/${midiRecording.length}: ${event.isNoteOn ? 'Note On' : 'Note Off'} - ${event.note} in ${delay.toFixed(2)}ms`);
    const timeoutId = setTimeout(() => {
      handleMidiEvent(event);
    }, delay);
    playbackTimeouts.push(timeoutId);
  });

  // Snap the slider back to zero
  document.getElementById('timingAdjust').value = 0;
}

export function stopMidiPlayback() {
  playbackTimeouts.forEach(clearTimeout); // Clear all scheduled timeouts
  playbackTimeouts = []; // Reset the timeouts array
  isPlaying = false;
  document.getElementById('PlayMidi').innerText = 'Play Midi Recording';
  console.log('MIDI playback stopped');
}

function handleMidiEvent(event) {
  const { note, velocity, isNoteOn } = event;
  const frequency = midiNoteToFrequency(note);
  console.log(`Handling event: ${isNoteOn ? 'Note On' : 'Note Off'} - ${note}, Frequency: ${frequency}`);
  if (isNoteOn) {
    playMS10TriangleBass(frequency);
  } else {
    // Handle Note Off if needed
  }
}

export function recordMidiEvent(event) {
  console.log('recordMidiEvent called');
  if (!isRecording) {
    console.log('Recording is not active');
    return;
  }

  const timestamp = performance.now();
  const command = event.data[0] & 0xf0;
  const note = event.data[1];
  const velocity = event.data.length > 2 ? event.data[2] : 0;

  const isNoteOn = command === 144 && velocity > 0;
  const isNoteOff = command === 128 || (command === 144 && velocity === 0);

  console.log(`MIDI command: ${command}, note: ${note}, velocity: ${velocity}`);
  console.log(`isNoteOn: ${isNoteOn}, isNoteOff: ${isNoteOff}`);

  if (isNoteOn || isNoteOff) {
    if (!recordingStartTime) {
      recordingStartTime = timestamp; // Set the start time to the first note's timestamp
      console.log(`First note recorded. Start time set to ${recordingStartTime}`);
    }
    midiRecording.push({ note, velocity, isNoteOn, timestamp });
    console.log(`MIDI event recorded: ${isNoteOn ? 'Note On' : 'Note Off'} - ${note} at ${timestamp}`);
  }
}
