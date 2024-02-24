// UIController.js

import { createIframes, clearAllIframes } from './IframeManager.js';
import { IframeSelectionManager } from './IframeSelectionManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const padManager = new IframeSelectionManager();
    // Setup event listeners and bind them to padManager methods
});

function setGlobalBPM() {
    const bpm = parseInt(document.getElementById('globalBPM').value, 10);
    document.querySelectorAll('iframe').forEach(iframe => {
      iframe.contentWindow.postMessage({ type: 'updateBPM', data: { bpm: bpm } }, '*');
    });
  }

  document.getElementById('setBPM').addEventListener('click', setGlobalBPM);


  document.addEventListener('DOMContentLoaded', () => {
    createIframes();
    });

  document.addEventListener('DOMContentLoaded', function() {
    // Get references to the toggle and clear all buttons
    var toggleButton = document.getElementById('toggleGuide');
    var clearAllButton = document.getElementById('clearAllButton'); // Get the clear all button by ID
    var rightColumn = document.querySelector('.right-column');
    var guideContent = document.getElementById('guideContent');

    // Set up the click event listener for the toggle guide button
    toggleButton.addEventListener('click', function() {
      var isGuideVisible = guideContent.style.display !== 'none';
      guideContent.style.display = isGuideVisible ? 'none' : 'block';
      toggleButton.textContent = isGuideVisible ? 'Show User Guide' : 'Hide User Guide';
      rightColumn.classList.toggle('right-column-hidden');
    });

    // Ensure the guide is visible on load
    if (guideContent.style.display === '') {
      guideContent.style.display = 'block';
    }
  });


  document.addEventListener('DOMContentLoaded', function() {
    // Get the existing 'Clear All Pads' button from the HTML
    const clearAllButton = document.getElementById('clearAllButton');

    // Attach the 'clearAllIframes' function to the 'onclick' event of the button
    clearAllButton.onclick = clearAllIframes;
  });


  

  function initializePage() {
    document.getElementById('setBPM').addEventListener('click', setGlobalBPM);
    // Other initialization code here...
  }

  document.addEventListener('DOMContentLoaded', initializePage);