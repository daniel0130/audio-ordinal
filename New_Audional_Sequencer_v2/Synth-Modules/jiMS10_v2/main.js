import './audioContext.js';
import './midiHandler.js';
import './arpeggiator.js';
import './uiHandler.js';
import './saveLoadHandler.js';
import './midiRecordingAndPlayback.js';
import { isArpeggiatorOn, adjustArpeggiatorTiming } from './arpeggiator.js'; // Import isArpeggiatorOn and adjustArpeggiatorTiming
import { startMidiRecording, stopMidiRecording, playMidiRecording, midiRecording, recordingStartTime } from './midiRecordingAndPlayback.js'; // Import midiRecording and recordingStartTime

document.addEventListener('DOMContentLoaded', () => {
  const openEffectsModuleButton = document.getElementById('openEffectsModule');
  const effectsModuleContainer = document.getElementById('effectsModuleContainer');
  const closeEffectsModuleButton = document.getElementById('closeEffectsModule');
  const effectsModuleIframe = document.getElementById('effectsModuleIframe');
  const recordMidiButton = document.getElementById('RecordMidi');
  const playMidiButton = document.getElementById('PlayMidi');
  const timingAdjustSlider = document.getElementById('timingAdjust');
  let isRecording = false;

  openEffectsModuleButton.addEventListener('click', () => {
    effectsModuleContainer.style.display = effectsModuleContainer.style.display === 'none' ? 'block' : 'none';
  });

  closeEffectsModuleButton.addEventListener('click', () => {
    effectsModuleContainer.style.display = 'none';
  });

  recordMidiButton.addEventListener('click', () => {
    if (isRecording) {
      stopMidiRecording();
      isRecording = false;
      recordMidiButton.textContent = 'Record Midi';
    } else {
      startMidiRecording();
      isRecording = true;
      recordMidiButton.textContent = 'Stop Recording';
    }
  });

  playMidiButton.addEventListener('click', playMidiRecording);

  // Nudge slider event listeners
  timingAdjustSlider.addEventListener('change', () => {
    const nudgeValue = parseFloat(timingAdjustSlider.value);

    if (isArpeggiatorOn) {
      // Adjust the timing for the next note without restarting
      adjustArpeggiatorTiming(nudgeValue);
    }
    if (midiRecording.length > 0) {
      // Adjust MIDI playback without restarting
      const nudgeOffset = (nudgeValue / 100) * (midiRecording[midiRecording.length - 1].timestamp - recordingStartTime);

      midiRecording.forEach((event, index) => {
        let adjustedTimestamp = event.timestamp + nudgeOffset;

        if (adjustedTimestamp < performance.now()) {
          adjustedTimestamp = performance.now();
        }

        const delay = adjustedTimestamp - performance.now();
        console.log(`Rescheduling event ${index + 1}/${midiRecording.length}: ${event.isNoteOn ? 'Note On' : 'Note Off'} - ${event.note} in ${delay.toFixed(2)}ms`);
        setTimeout(() => {
          handleMidiEvent(event);
        }, delay);
      });
    }

    // Snap the slider back to zero
    timingAdjustSlider.value = 0;
  });


  // Make the container draggable
  dragElement(effectsModuleContainer);

  // Listen for messages from the iframe to dynamically adjust its size
  window.addEventListener('message', (event) => {
    if (event.origin !== window.location.origin) {
      return;
    }
    if (event.data.type === 'resize') {
      const { width, height } = event.data;
      console.log(`Received resize message: width=${width}, height=${height}`);
      effectsModuleIframe.style.width = `${width}px`;
      effectsModuleIframe.style.height = `${height}px`;
    }
  });

  function dragElement(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
      e = e || window.event;
      e.preventDefault();
      pos3 = e.clientX;
      pos4 = e.clientY;
      document.onmouseup = closeDragElement;
      document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
      e = e || window.event;
      e.preventDefault();
      pos1 = pos3 - e.clientX;
      pos2 = pos4 - e.clientY;
      pos3 = e.clientX;
      pos4 = e.clientY;
      element.style.top = (element.offsetTop - pos2) + "px";
      element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
      document.onmouseup = null;
      document.onmousemove = null;
    }
  }
});
