// saveLoadHandler.js

import { context, currentOscillator, playMS10TriangleBass, stopMS10TriangleBass } from './audioContext.js';
import { arpNotes, isArpeggiatorOn, startArpeggiator, stopArpeggiator } from './arpeggiator.js';
import { updateUIFromSettings } from './uiHandler.js';

export function saveSettings() {
  const settings = {
    waveform: document.getElementById('waveform').value,
    attack: document.getElementById('attack').value,
    release: document.getElementById('release').value,
    cutoff: document.getElementById('cutoff').value,
    resonance: document.getElementById('resonance').value,
    volume: document.getElementById('volume').value,
    arpTempo: document.getElementById('arpTempo').value,
    arpPattern: document.getElementById('arpPattern').value,
    arpSpeed: document.getElementById('arpSpeed').value,
    useSequencerTiming: document.getElementById('useSequencerTiming').checked,
    timingAdjust: document.getElementById('timingAdjust').value,
    arpNotes: arpNotes
  };

  const settingsJson = JSON.stringify(settings, null, 2);
  const blob = new Blob([settingsJson], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'synth_settings.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function loadSettings(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const settings = JSON.parse(e.target.result);

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
    
    // Load the arpeggiator notes
    arpNotes.length = 0; // Clear existing notes
    settings.arpNotes.forEach(note => arpNotes.push(note));

    // Restart arpeggiator if it was on
    if (isArpeggiatorOn) {
      stopArpeggiator();
      startArpeggiator();
    }

    // Update the UI with the new settings
    updateUIFromSettings(settings);
  };
  reader.readAsText(file);
}

// Attach event listeners
document.getElementById('saveSettings').addEventListener('click', saveSettings);
document.getElementById('loadSettingsFile').addEventListener('change', loadSettings);
document.getElementById('loadSettingsButton').addEventListener('click', () => {
  document.getElementById('loadSettingsFile').click();
});
