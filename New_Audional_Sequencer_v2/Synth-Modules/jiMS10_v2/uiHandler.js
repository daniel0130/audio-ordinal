// uiHandler.js

import { handleNoteEvent, onMIDISuccess, onMIDIFailure } from './midiHandler.js';
import { updateArpNotesDisplay } from './arpeggiator.js';
import { recordMidiEvent } from './midiRecordingAndPlayback.js'; // Import recordMidiEvent

// Helper function to update UI elements from settings
export function updateUIFromSettings(settings) {
  document.getElementById('waveform').value = settings.waveform;
  document.getElementById('attack').value = settings.attack;
  document.getElementById('release').value = settings.release;
  document.getElementById('cutoff').value = settings.cutoff;
  document.getElementById('resonance').value = settings.resonance;
  document.getElementById('volume').value = settings.volume;
  document.getElementById('arpTempo').value = settings.arpTempo;
  document.getElementById('arpPattern').value = settings.arpPattern;
  document.getElementById('arpSpeed').value = settings.arpSpeed;
  document.getElementById('useSequencerTiming').checked = settings.useSequencerTiming;
  document.getElementById('timingAdjust').value = settings.timingAdjust;

  // Update the arpeggiator notes display
  updateArpNotesDisplay();
}

// Keyboard Mapping and Event Handling
let baseOctave = 1;

const keyToMIDINote = (key) => {
  const baseNote = 29; // F0
  const keyMap = {
    'a': baseNote,       // F0
    'w': baseNote + 1,   // F#0
    's': baseNote + 2,   // G0
    'e': baseNote + 3,   // G#0
    'd': baseNote + 4,   // A0
    'r': baseNote + 5,   // A#0
    'f': baseNote + 6,   // B0
    't': baseNote + 7,   // C1
    'g': baseNote + 8,   // C#1
    'y': baseNote + 9,   // D1
    'h': baseNote + 10,  // D#1
    'u': baseNote + 11,  // E1
    'j': baseNote + 12,  // F1
    'i': baseNote + 13,  // F#1
    'k': baseNote + 14,  // G1
    'o': baseNote + 15,  // G#1
    'l': baseNote + 16,  // A1
    'p': baseNote + 17,  // A#1
    ';': baseNote + 18,  // B1
    '\'': baseNote + 19, // C2

    'z': baseNote + 20,  // C#2
    'x': baseNote + 21,  // D2
    'c': baseNote + 22,  // D#2
    'v': baseNote + 23,  // E2
    'b': baseNote + 24,  // F2
    'n': baseNote + 25,  // F#2
    'm': baseNote + 26,  // G2
    ',': baseNote + 27,  // G#2
    '.': baseNote + 28,  // A2
    '/': baseNote + 29,  // A#2

    'q': baseNote + 30,  // B2
    '1': baseNote + 31,  // C3
    '2': baseNote + 32,  // C#3
    '3': baseNote + 33,  // D3
    '4': baseNote + 34,  // D#3
    '5': baseNote + 35,  // E3
    '6': baseNote + 36,  // F3
    '7': baseNote + 37,  // F#3
    '8': baseNote + 38,  // G3
    '9': baseNote + 39,  // G#3
    '0': baseNote + 40,  // A3
    '-': baseNote + 41,  // A#3
    '=': baseNote + 42   // B3
  };

  if (key >= '0' && key <= '9') {
    baseOctave = parseInt(key);
    console.log(`Base octave set to ${baseOctave}`);
    return null;
  }

  const note = keyMap[key.toLowerCase()];
  if (note !== undefined) {
    const octaveOffset = (baseOctave - 1) * 12;
    const midiNote = note + octaveOffset;
    console.log(`Key ${key} mapped to MIDI note ${midiNote}`);
    return midiNote;
  }

  console.log(`Key ${key} not mapped to any MIDI note`);
  return null;
};

// MIDI Initialization
if (navigator.requestMIDIAccess) {
  navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
  console.warn('WebMIDI is not supported in this browser.');
}

// Keyboard Event Listeners
document.addEventListener('keydown', (event) => {
  const note = keyToMIDINote(event.key);
  if (note !== null) {
    const velocity = 127;
    handleNoteEvent(note, velocity, true);
    // Record MIDI event
    recordMidiEvent({
      data: [144, note, velocity]
    });
  }
});

document.addEventListener('keyup', (event) => {
  const note = keyToMIDINote(event.key);
  if (note !== null) {
    handleNoteEvent(note, 0, false);
    // Record MIDI event
    recordMidiEvent({
      data: [128, note, 0]
    });
  }
});
