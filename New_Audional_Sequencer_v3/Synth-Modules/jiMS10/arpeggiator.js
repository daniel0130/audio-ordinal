// arpeggiator.js

import { playMS10TriangleBass, stopMS10TriangleBass, context } from './audioContext.js';
import { SYNTH_CHANNEL } from './iframeMessageHandling.js';

const sequencerChannel = new BroadcastChannel('sequencerChannel');

export let isArpeggiatorOn = false;
export let arpNotes = [];
export let isLatchModeOn = false;

let currentArpIndex = 0;
let nextNoteTime = 0;
let isNudgeActive = false;
let timerID = null;

const LOOKAHEAD = 15.0; // milliseconds
const SCHEDULE_AHEAD_TIME = 0.05; // seconds
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const A4_FREQUENCY = 440;
const A4_MIDI_NUMBER = 69;



export const startArpeggiator = () => {
  console.log('Starting arpeggiator');
  isArpeggiatorOn = true;
  currentArpIndex = 0;

  const nudgeValue = parseFloat(document.getElementById('timingAdjust').value);
  const nudgeOffset = (nudgeValue / 100) * (60 / parseFloat(document.getElementById('arpTempo').value));
  nextNoteTime = context.currentTime + 0.1 + nudgeOffset;
  console.log(`Initial nextNoteTime set to: ${nextNoteTime}`);

  scheduleArpeggiator();
  // Toggle button class
  document.getElementById('startStopArp').classList.add('on');
};


export const stopArpeggiator = () => {
  if (!isArpeggiatorOn) {
    console.log('Arpeggiator is already stopped.');
    return;
  }
  console.log('Stopping arpeggiator');
  isArpeggiatorOn = false;
  if (timerID) {
    clearTimeout(timerID);
    timerID = null;
  }
  stopMS10TriangleBass();  // Ensure this function stops the synth effectively
  // Toggle button class
  document.getElementById('startStopArp').classList.remove('on');
};

const frequencyToNoteName = (frequency) => {
  const midiNote = Math.round(12 * Math.log2(frequency / A4_FREQUENCY) + A4_MIDI_NUMBER);
  return `${NOTE_NAMES[midiNote % 12]}${Math.floor(midiNote / 12) - 1}`;
};

const saveArpNotesToLocalStorage = () => {
  const arpSettings = {
      channel: SYNTH_CHANNEL,
      notes: arpNotes
  };
  localStorage.setItem(`arp_settings_channel_${SYNTH_CHANNEL}`, JSON.stringify(arpSettings));
  console.log(`Arpeggiator notes for channel ${SYNTH_CHANNEL} saved to local storage.`);
};

export const loadArpNotesFromLocalStorage = () => {
  const savedSettings = localStorage.getItem(`arp_settings_channel_${SYNTH_CHANNEL}`);
  if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      arpNotes = settings.notes;
      updateArpNotesDisplay();
      console.log(`Loaded arpeggiator notes for channel ${SYNTH_CHANNEL} from local storage.`);
  } else {
      console.log(`No saved arpeggiator notes found for channel ${SYNTH_CHANNEL}. Using default configuration.`);
  }
};

export const addNoteToArpeggiator = (frequency) => {
  console.log(`Trying to add note with frequency: ${frequency}`);
  console.log(`Latch mode is ${isLatchModeOn ? 'enabled' : 'disabled'}`);
  if (isLatchModeOn) {
    console.log(`Channel ${SYNTH_CHANNEL}: Adding note to arpeggiator: ${frequency}`);
    arpNotes.push(frequency);
    updateArpNotesDisplay();
    sequencerChannel.postMessage({ type: 'updateArpNotes', arpNotes });
    saveArpNotesToLocalStorage();  // Save changes to local storage
  }
};



export const deleteLastNote = () => {
  console.log(`Channel ${SYNTH_CHANNEL}: Deleting last note from arpeggiator`);
  arpNotes.pop();
  updateArpNotesDisplay();
  sequencerChannel.postMessage({ type: 'updateArpNotes', arpNotes });
  saveArpNotesToLocalStorage();  // Save changes to local storage
};

export const setArpNotes = (notes) => {
  if (Array.isArray(notes)) {
      arpNotes = notes;
      updateArpNotesDisplay();
      console.log(`Channel ${SYNTH_CHANNEL}: Arpeggiator notes updated: ${JSON.stringify(arpNotes)}`);
      saveArpNotesToLocalStorage();  // Save changes to local storage
  } else {
      console.error(`Channel ${SYNTH_CHANNEL}: Invalid Arpeggiator notes format: ${typeof notes}`);
  }
};


const updateArpIndex = {
  increment: () => currentArpIndex = (currentArpIndex + 1) % arpNotes.length,
  decrement: () => currentArpIndex = (currentArpIndex - 1 + arpNotes.length) % arpNotes.length,
  randomize: () => currentArpIndex = Math.floor(Math.random() * arpNotes.length),
  upDown: (() => {
    let goingUp = true;
    return () => {
      goingUp ? updateArpIndex.increment() : updateArpIndex.decrement();
      if (currentArpIndex === 0 || currentArpIndex === arpNotes.length - 1) {
        goingUp = !goingUp;
      }
    };
  })(),
  doubleStep: () => currentArpIndex = (currentArpIndex + 2) % arpNotes.length,
  randomWithRests: () => {
    if (Math.random() > 0.8) updateArpIndex.randomize();
  }
};

export const updateArpNotesDisplay = () => {
  const display = document.getElementById('arpNotesDisplay');
  const ctx = display.getContext('2d');
  const synthContainer = document.querySelector('.synth-container');
  display.width = synthContainer.clientWidth - 40;

  ctx.clearRect(0, 0, display.width, display.height);
  ctx.font = 'bold 11px Arial';
  ctx.fillStyle = '#FFFFFF';

  const noteWidth = ctx.measureText('W#').width + 5;
  const groupSpacing = 15;
  let x = 10, y = 30, count = 0;
  const notesPerRow = Math.floor(display.width / noteWidth);

  console.log(`Channel ${SYNTH_CHANNEL}: Updating arpeggiator notes display`);

  arpNotes.forEach((note, index) => {
    const noteName = note !== null ? frequencyToNoteName(note) : 'R';
    console.log(`Channel ${SYNTH_CHANNEL}: Displaying note: ${noteName}`);

    ctx.fillStyle = index === currentArpIndex ? '#FF0000' : '#FFFFFF';
    ctx.font = index === currentArpIndex ? 'bold 14px Arial' : 'bold 11px Arial';

    if (x + noteWidth > display.width || count >= notesPerRow) {
      count = 0;
      x = 10;
      y += 30;
    }

    if (index % 4 === 0 && index !== 0) {
      x += groupSpacing;
    }

    ctx.fillText(noteName, x, y);
    x += noteWidth;
    count++;
  });
};


export const toggleLatchMode = () => {
  console.log(`Toggling latch mode. Current state: ${isLatchModeOn}`);
  isLatchModeOn = !isLatchModeOn;
  document.getElementById('latchMode').style.backgroundColor = isLatchModeOn ? 'red' : '';
  console.log(`Latch mode ${isLatchModeOn ? 'enabled' : 'disabled'}`);
};


const applySpeedModifier = (interval) => {
  const speed = document.getElementById('arpSpeed').value;
  const speedMap = {
    'normal': interval,
    'double-time': interval / 2,
    'half-time': interval * 2,
    'quadruple-time': interval / 4,
    'octuple-time': interval / 8,
  };
  return speedMap[speed] || interval;
};

const scheduleArpeggiator = () => {
  const nudgeValue = parseFloat(document.getElementById('timingAdjust').value);
  const nudgeFactor = 1 - (nudgeValue / 100);

  while (nextNoteTime < context.currentTime + SCHEDULE_AHEAD_TIME) {
    playArpNote();
    nextNoteTime += getNoteInterval() * nudgeFactor;
    console.log(`Scheduled next note at: ${nextNoteTime}`);
  }

  if (isArpeggiatorOn) {
    timerID = setTimeout(() => {
      console.log('Scheduling next batch of notes');
      scheduleArpeggiator();
    }, LOOKAHEAD);
  }
};

const getNoteInterval = () => {
  const baseInterval = (60 / parseFloat(document.getElementById('arpTempo').value)) * 1000;
  let interval = applySpeedModifier(baseInterval) / 1000;
  if (isNudgeActive) {
    interval *= 1 - (parseFloat(document.getElementById('timingAdjust').value) / 100);
  }
  console.log(`Calculated note interval: ${interval}`);
  return interval;
};

const playArpNote = () => {
  if (!isArpeggiatorOn || !arpNotes.length) return;

  updateArpNotesDisplay();

  const currentNote = arpNotes[currentArpIndex];
  const currentTime = context.currentTime;
  console.log(`Playing note at: ${currentTime}, Note: ${currentNote !== null ? currentNote : 'Rest'}`);
  if (currentNote !== null) {
    playMS10TriangleBass(currentNote);
  }

  const pattern = document.getElementById('arpPattern').value;
  const updatePattern = {
    'up': updateArpIndex.increment,
    'down': updateArpIndex.decrement,
    'random': updateArpIndex.randomize,
    'up-down': updateArpIndex.upDown,
    'double-step': updateArpIndex.doubleStep,
    'random-rest': updateArpIndex.randomWithRests,
  };

  updatePattern[pattern] ? updatePattern[pattern]() : console.error('Unknown arpeggiator pattern:', pattern);
};

export const toggleArpeggiator = () => {
  const button = document.getElementById('startStopArp');
  if (isArpeggiatorOn) {
    button.innerText = 'Start Arpeggiator';
    stopArpeggiator();
  } else {
    button.innerText = 'Stop Arpeggiator';
    startArpeggiator();
  }
};

export const adjustArpeggiatorTiming = (nudgeValue) => {
  const nudgeFactor = 1 - (nudgeValue / 100);
  nextNoteTime = context.currentTime + (nextNoteTime - context.currentTime) * nudgeFactor;
  console.log(`Adjusted nextNoteTime to: ${nextNoteTime}`);
};

const setupEventListeners = () => {
  document.getElementById('startStopArp').addEventListener('click', () => {
    console.log('Start/Stop Arpeggiator button clicked');
    toggleArpeggiator();
  });

  document.getElementById('addRest').addEventListener('click', () => {
    console.log('Add Rest button clicked');
    arpNotes.push(null);
    if (isArpeggiatorOn) {
      currentArpIndex = currentArpIndex % arpNotes.length;
    }
    updateArpNotesDisplay();
    sequencerChannel.postMessage({ type: 'updateArpNotes', arpNotes });
  });

  document.getElementById('deleteLastNote').addEventListener('click', () => {
    console.log('Delete Last Note button clicked');
    deleteLastNote();
  });

  document.getElementById('latchMode').addEventListener('click', () => {
    console.log('Latch Mode button clicked');
    toggleLatchMode();
  });

  document.getElementById('timingAdjust').addEventListener('input', () => {
    isNudgeActive = true;
  });

  document.getElementById('timingAdjust').addEventListener('change', () => {
    isNudgeActive = false;
    if (isArpeggiatorOn) {
      adjustArpeggiatorTiming(parseFloat(document.getElementById('timingAdjust').value));
    }
  });
};

// Call the function to set up the event listeners
setupEventListeners();

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
  // if (event.data.type === 'setMidiRecording') {
  //     const receivedMidiRecording = event.data.midiRecording;
  //     console.log(`[main.js] Received MIDI recording: ${JSON.stringify(receivedMidiRecording)}`);
  //     setMidiRecording(receivedMidiRecording);
  // }
  if (event.data.type === 'setArpNotes') {
      const receivedArpNotes = event.data.arpNotes;
      console.log(`[main.js] Received Arpeggiator notes: ${JSON.stringify(receivedArpNotes)}`);
      setArpNotes(receivedArpNotes);
  }
});
