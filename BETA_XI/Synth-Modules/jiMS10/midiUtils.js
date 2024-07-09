//midiUtils.js

import { playMS10TriangleBass } from './audioContext.js';
import { getMidiRecording, recordMidiEvent } from './midiRecording.js';
import { getChannelIndex } from './activeSynthChannelIndex.js'; 
import { SYNTH_CHANNEL } from './iframeMessageHandling.js';
import { addNoteToArpeggiator } from './arpeggiator.js';


const A4_MIDI_NUMBER = 69;
const A4_FREQUENCY = 440;



export function onMIDISuccess(midiAccess) {
    const inputs = midiAccess.inputs.values();
    for (let input = inputs.next(); input && !input.done; input = inputs.next()) {
        input.value.onmidimessage = (event) => {
            recordMidiEvent(event, SYNTH_CHANNEL); // Using SYNTH_CHANNEL directly
        };
    }
    console.log('MIDI devices are connected and ready.');
}

export function onMIDIFailure() {
    console.error('Failed to access MIDI devices.');
}



export function onMIDIMessage(event) {
    const channelIndex = getChannelIndex();
    if (channelIndex === undefined) {
        console.error('[onMIDIMessage] Undefined channel index.');
        return; // Optionally skip processing this message, or choose a default channel index
    }
    console.log(`[onMIDIMessage] Channel Index: ${channelIndex}`);

    if (isRecording) {
        recordMidiEvent(event, channelIndex);
    } else {
        handleArpeggiatorMIDIEvent(event, channelIndex);
    }
}


function handleArpeggiatorMIDIEvent(event, channelIndex) {
    const command = event.data[0] & 0xf0;
    const note = event.data[1];
    const velocity = event.data.length > 2 ? event.data[2] : 0;
    if (command === 144 && velocity > 0) { // Note on
        handleNoteEvent(note, velocity, true);
    } else {
        console.log(`[handleArpeggiatorMIDIEvent] Unhandled MIDI message type: ${command}, Channel Index: ${channelIndex}`);
    }
}

// handleNoteEvent function
export function handleNoteEvent(note, velocity, isNoteOn) {
    if (!isNoteOn) return;
    const channelIndex = SYNTH_CHANNEL;
    const frequency = midiNoteToFrequency(note);
    console.log(`[handleNoteEvent] Playing note. MIDI note: ${note}, Frequency: ${frequency}, Channel Index: ${channelIndex}`);
    
    // Play the note
    playMS10TriangleBass(frequency);
    
    // Add note to arpeggiator if latch mode is on
    addNoteToArpeggiator(frequency);
  }
  
export function midiNoteToFrequency(note) {
    if (note < 0 || note > 127) {
        console.error('[midiNoteToFrequency] Invalid MIDI note:', note);
        return null;
    }
    return Math.pow(2, (note - A4_MIDI_NUMBER) / 12) * A4_FREQUENCY;
}

export function notifyParentOfUpdate(type, data, channelIndex) {
    window.parent.postMessage({ type, data, channelIndex }, '*');
}
