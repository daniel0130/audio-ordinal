// midiHandler.js
import { playMS10TriangleBass } from '../audioContext.js';
import { isArpeggiatorOn, addNoteToArpeggiator } from '../arpeggiator.js';
import { recordMidiEvent } from '../midiRecording.js';

const A4_MIDI_NUMBER = 69;
const A4_FREQUENCY = 440;

export function midiNoteToFrequency(note) {
  if (note < 0 || note > 127) {
    console.error('Invalid MIDI note:', note);
    return null;
  }
  return Math.pow(2, (note - A4_MIDI_NUMBER) / 12) * A4_FREQUENCY;
}

export function onMIDISuccess(midiAccess) {
  console.log('MIDI access granted');
  const inputs = midiAccess.inputs.values();
  for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = onMIDIMessage;
  }
}

export function onMIDIFailure() {
  console.warn('Could not access your MIDI devices.');
}

export function handleNoteEvent(note, velocity, isNoteOn) {
  const frequency = midiNoteToFrequency(note);
  if (isNoteOn) {
    console.log(`Note On. MIDI note: ${note}, Frequency: ${frequency}`);
    playMS10TriangleBass(frequency);
    addNoteToArpeggiator(frequency);
  } else {
    console.log(`Note Off. MIDI note: ${note}`);
    // No action needed for Note Off
  }
}

export function onMIDIMessage(event) {
  recordMidiEvent(event); // Record the MIDI event

  const command = event.data[0] & 0xf0;
  const note = event.data[1];
  const velocity = event.data.length > 2 ? event.data[2] : 0;

  switch (command) {
    case 144: // Note on
      if (velocity > 0) {
        handleNoteEvent(note, velocity, true);
      }
      break;
    case 128: // Note off
      handleNoteEvent(note, velocity, false);
      break;
    default:
      console.log(`Unhandled MIDI message type: ${command}`);
      break;
  }
}

if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn('WebMIDI is not supported in this browser.');
}
