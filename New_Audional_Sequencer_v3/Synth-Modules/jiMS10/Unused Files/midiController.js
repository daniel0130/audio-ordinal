/**
 * This script manages MIDI recording and playback functionality in a web application.
 * It provides an interface for recording MIDI input, playing back recorded MIDI data,
 * and adjusting the timing of the MIDI playback.

 * Imports:
 * - `isArpeggiatorOn`, `adjustArpeggiatorTiming` from 'arpeggiator.js'
 * - `startMidiRecording`, `stopMidiRecording`, `playMidiRecording`, `handleNoteEvent`, `onMIDISuccess`, `onMIDIFailure` from 'midiUtils.js'
 * - `getIsRecording`, `getMidiRecording`, `getRecordingStartTime` from 'midiRecording.js'
 * - `getChannelIndex` from 'activeSynthChannelIndex.js'

 * Key functionalities:
 * - Sets up event listeners for DOM elements to handle recording and playback actions.
 * - Toggles MIDI recording state and updates the Record button's label accordingly.
 * - Plays back the recorded MIDI data when the Play button is clicked.
 * - Adjusts the timing of MIDI playback based on user input from a timing adjustment slider.
 * - Initializes the WebMIDI API if supported by the browser, handling success and failure cases.
 */


import { isArpeggiatorOn, adjustArpeggiatorTiming } from './arpeggiator.js';
import { startMidiRecording, stopMidiRecording, playMidiRecording, handleNoteEvent, onMIDISuccess, onMIDIFailure } from './midiUtils.js';
import { getIsRecording, getMidiRecording, getRecordingStartTime } from './midiRecording.js';
import { getChannelIndex } from './activeSynthChannelIndex.js';

document.addEventListener('DOMContentLoaded', () => {
    const recordMidiButton = document.getElementById('RecordMidi');
    const playMidiButton = document.getElementById('PlayMidi');
    const timingAdjustSlider = document.getElementById('timingAdjust');
    const channelIndex = getChannelIndex();

    console.log(`[DOMContentLoaded] Channel Index: ${channelIndex}`);

    recordMidiButton.addEventListener('click', () => {
        const currentChannelIndex = getChannelIndex();
        if (getIsRecording()) {
            stopMidiRecording(currentChannelIndex);
            recordMidiButton.textContent = 'Record Midi';
        } else {
            startMidiRecording(currentChannelIndex);
            recordMidiButton.textContent = 'Stop Recording';
        }
        console.log(`[RecordMidiButton] Channel Index: ${currentChannelIndex}`);
    });

    playMidiButton.addEventListener('click', () => {
        const currentChannelIndex = getChannelIndex();
        playMidiRecording(currentChannelIndex); // Call with channelIndex
        console.log(`[PlayMidiButton] Channel Index: ${currentChannelIndex}`);
    });

    timingAdjustSlider.addEventListener('change', () => {
        const currentChannelIndex = getChannelIndex();
        const nudgeValue = parseFloat(timingAdjustSlider.value);
        if (isArpeggiatorOn) {
            adjustArpeggiatorTiming(nudgeValue);
        }
        const midiRecording = getMidiRecording(currentChannelIndex);
        if (midiRecording.length > 0) {
            const recordingStartTime = getRecordingStartTime(currentChannelIndex);
            const nudgeOffset = (nudgeValue / 100) * (midiRecording[midiRecording.length - 1].timestamp - recordingStartTime);
            midiRecording.forEach((event, index) => {
                let adjustedTimestamp = event.timestamp + nudgeOffset;
                if (adjustedTimestamp < performance.now()) {
                    adjustedTimestamp = performance.now();
                }
                const delay = adjustedTimestamp - performance.now();
                console.log(`[TimingAdjustSlider] Rescheduling event ${index + 1}/${midiRecording.length}: Note On - ${event.note} in ${delay.toFixed(2)}ms for channel: ${currentChannelIndex}`);
                setTimeout(() => {
                    handleNoteEvent(event.note, event.velocity, event.isNoteOn);
                }, delay);
            });
        }
        timingAdjustSlider.value = 0;
        console.log(`[TimingAdjustSlider] Channel Index: ${currentChannelIndex}`);
    });
});

if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
    console.warn('WebMIDI is not supported in this browser.');
}
