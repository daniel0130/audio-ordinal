// arpeggiator.js

import { playMS10TriangleBass, stopMS10TriangleBass, context } from './audioContext.js';

export let isArpeggiatorOn = false;
export let arpNotes = [];
let currentArpIndex = 0;
let nextNoteTime = 0; 
let isNudgeActive = false;
let timerID;
let isLatchModeOn = false;
let initialNextNoteTime = 0; // Add this line to declare the variable


const LOOKAHEAD = 15.0; // milliseconds
const SCHEDULE_AHEAD_TIME = 0.05; // seconds
const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const A4_FREQUENCY = 440;
const A4_MIDI_NUMBER = 69;

const frequencyToNoteName = (frequency) => {
  const midiNote = Math.round(12 * Math.log2(frequency / A4_FREQUENCY) + A4_MIDI_NUMBER);
  return `${NOTE_NAMES[midiNote % 12]}${Math.floor(midiNote / 12) - 1}`;
};

export const startArpeggiator = () => {
  console.log('Starting arpeggiator');
  isArpeggiatorOn = true;
  currentArpIndex = 0;
  
  // Apply the nudge value to the initial nextNoteTime
  const nudgeValue = parseFloat(document.getElementById('timingAdjust').value);
  const nudgeOffset = (nudgeValue / 100) * (60 / parseFloat(document.getElementById('arpTempo').value));
  nextNoteTime = context.currentTime + 0.1 + nudgeOffset; // Adding a small buffer to ensure proper scheduling
  console.log(`Initial nextNoteTime set to: ${nextNoteTime}`);
  
  scheduleArpeggiator();
};

export const stopArpeggiator = () => {
  console.log('Stopping arpeggiator');
  isArpeggiatorOn = false;
  clearTimeout(timerID);
  stopMS10TriangleBass();
};

export const toggleLatchMode = () => {
  isLatchModeOn = !isLatchModeOn;
  const button = document.getElementById('latchMode');
  button.style.backgroundColor = isLatchModeOn ? 'red' : '';
  console.log(`Latch mode ${isLatchModeOn ? 'enabled' : 'disabled'}`);
};

export const addNoteToArpeggiator = (frequency) => {
  if (isLatchModeOn) {
    console.log(`Adding note to arpeggiator: ${frequency}`);
    arpNotes.push(frequency);
    updateArpNotesDisplay();
  }
};

export const deleteLastNote = () => {
  console.log('Deleting last note from arpeggiator');
  arpNotes.pop();
  updateArpNotesDisplay();
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
    nextNoteTime += getNoteInterval() * nudgeFactor; // Adjust the interval by the nudge factor
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

  updateArpNotesDisplay(); // Update display to show the active note

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

  if (updatePattern[pattern]) {
    updatePattern[pattern]();
  } else {
    console.error('Unknown arpeggiator pattern:', pattern);
  }
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

export const updateArpNotesDisplay = () => {
  const display = document.getElementById('arpNotesDisplay');
  const ctx = display.getContext('2d');
  
  // Adjust canvas width to match the parent container
  const synthContainer = document.querySelector('.synth-container');
  display.width = synthContainer.clientWidth - 40; // Adjust for padding/margin

  // Clear the canvas
  ctx.clearRect(0, 0, display.width, display.height);

  // Set font style
  ctx.font = 'bold 11px Arial';
  ctx.fillStyle = '#FFFFFF';

  // Calculate note width dynamically
  const noteWidth = ctx.measureText('W#').width + 5; // Slightly reduced spacing
  const groupSpacing = 15; // Extra space between groups of four notes
  let x = 10, y = 30, count = 0;
  const notesPerRow = Math.floor(display.width / noteWidth);

  console.log('Updating arpeggiator notes display');
  arpNotes.forEach((note, index) => {
    const noteName = note !== null ? frequencyToNoteName(note) : 'Rest';
    console.log(`Displaying note: ${noteName}`);
    
    // Highlight the current note
    if (index === currentArpIndex) {
      ctx.fillStyle = '#FF0000'; // Highlight current note in red
      ctx.font = 'bold 14px Arial'; // Enlarge font for current note
    } else {
      ctx.fillStyle = '#FFFFFF'; // Default color for other notes
      ctx.font = 'bold 11px Arial'; // Default font size for other notes
    }
    
    // Check if we need to wrap to the next line
    if (x + noteWidth > display.width || count >= notesPerRow) {
      count = 0;
      x = 10;
      y += 30;
    }
    
    // Add a separator for every group of four notes
    if (index % 4 === 0 && index !== 0) {
      x += groupSpacing; // Add extra space for separator
    }
    
    // Draw the note name
    ctx.fillText(noteName, x, y);
    x += noteWidth;
    count++;
  });
};

export const adjustArpeggiatorTiming = (nudgeValue) => {
  const nudgeFactor = 1 - (nudgeValue / 100);
  nextNoteTime = context.currentTime + (nextNoteTime - context.currentTime) * nudgeFactor;
  console.log(`Adjusted nextNoteTime to: ${nextNoteTime}`);
};

// Event Listeners for Arpeggiator Controls
const setupEventListeners = () => {
  document.getElementById('latchMode').addEventListener('click', toggleLatchMode);
  document.getElementById('startStopArp').addEventListener('click', toggleArpeggiator);
  document.getElementById('addRest').addEventListener('click', () => {
    console.log('Adding rest to arpeggiator');
    arpNotes.push(null);
    if (isArpeggiatorOn) {
      currentArpIndex = currentArpIndex % arpNotes.length; // Adjust index if necessary
    }
    updateArpNotesDisplay();
  });
  document.getElementById('deleteLastNote').addEventListener('click', deleteLastNote);
  document.getElementById('timingAdjust').addEventListener('input', () => isNudgeActive = true);
  document.getElementById('timingAdjust').addEventListener('change', () => {
    isNudgeActive = false;
    if (isArpeggiatorOn) {
      adjustArpeggiatorTiming(parseFloat(document.getElementById('timingAdjust').value));
    }
  });
};

setupEventListeners();
