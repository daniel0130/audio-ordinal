// DynamicLoader.js
// 
// Handles user interactions and dynamic content loading scenarios, such as randomizing samples and adjusting play speeds or schedule multipliers. This file focuses on the interactive parts of the content loading process that depend on user actions or specific loading strategies.
// 
// Functions: randomizeSamplesAndLoad, randomizePlaySpeeds, randomizeScheduleMultipliers.
// Event listener for .random-mix-btn.

import { preloadUrls } from './UrlManager.js';
import { manageContentLoadingPromise } from './ContentProcessor.js';

function randomizeSamplesAndLoad() {
  const iframes = document.querySelectorAll('iframe');
  if (iframes.length !== 36) {
    console.error('Expected 36 iframes for sample placement.');
    return;
  }

  // Function to get a random sample mix
  function getRandomSampleMix() {
    let mix = [];
    for (let i = 0; i < 36; i++) {
      const randomIndex = Math.floor(Math.random() * preloadUrls.length);
      mix.push(randomIndex);
    }
    return mix;
  }

  // Load the randomized samples into the iframes and wait for all to load
  const randomMix = getRandomSampleMix();
    const loadPromises = randomMix.map((index, iframeIndex) => {
        const url = preloadUrls[index];
        const iframe = iframes[iframeIndex];
        const loadButton = document.querySelectorAll('.load-button')[iframeIndex];
        return manageContentLoadingPromise(iframe, url, loadButton);
    });

  // Wait for all iframes to load their content, then randomize play speeds and schedule multipliers
    Promise.all(loadPromises).then(() => {
        console.log('All samples loaded, randomizing play speeds and schedule multipliers...');
        randomizePlaySpeeds();
        randomizeScheduleMultipliers(); // Make sure this is called
    }).catch(error => {
        console.error('An error occurred while loading samples:', error);
    });
}

export function randomizePlaySpeeds() {
  const iframes = document.querySelectorAll('iframe');

  iframes.forEach((iframe) => {
    const src = iframe.getAttribute('src');
    const origin = new URL(src).origin;
    let randomSpeed;

    // Determine the speed range based on the specified probabilities
    const rand = Math.random();
    if (rand < 0.33) {
      // 33% chance for speed to be between 0.2 and 0.8
      randomSpeed = (Math.random() * (0.8 - 0.2) + 0.2).toFixed(2);
    } else if (rand < 0.63) {
      // 30% chance for speed to be between 0.8 and 2
      randomSpeed = (Math.random() * (2 - 0.8) + 0.8).toFixed(2);
    } else {
      // Remaining 37% chance for speed to be between 3 and 100
      randomSpeed = (Math.random() * (100 - 3) + 3).toFixed(2);
    }

    const messageData = { type: "playAtSpeed", data: { speed: randomSpeed } };

    // Directly post the message to the iframe's contentWindow
    if (iframe.contentWindow) {
      iframe.contentWindow.postMessage(messageData, origin);
      console.log(`Randomized play speed for ${iframe.id || "an iframe"} to ${randomSpeed}x.`);
    }
  });
}

function randomizeScheduleMultipliers() {
    const iframes = document.querySelectorAll('iframe');
  
    iframes.forEach(iframe => {
      const src = iframe.getAttribute('src');
      const origin = new URL(src).origin;
      // Randomly decide to increase or decrease the schedule multiplier
      const adjustmentType = Math.random() < 0.5 ? 'increase' : 'decrease';
      const messageData = { type: "adjustScheduleMultiplier", data: { adjustmentType: adjustmentType } };
  
      // Directly post the message to the iframe's contentWindow
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(messageData, origin);
        console.log(`Randomized schedule multiplier for ${iframe.id || "an iframe"} to ${adjustmentType}.`);
      }
    });
  }
  
  
  window.randomizeScheduleMultipliers = randomizeScheduleMultipliers;
  

// Event listener setup for user-initiated actions
document.addEventListener('DOMContentLoaded', () => {
  const randomMixButton = document.querySelector('.random-mix-btn');
  if (randomMixButton) {
    randomMixButton.addEventListener('click', randomizeSamplesAndLoad);
  }
});
