// UIController.js

import { createIframes, clearAllIframes } from './IframeManager.js';
import { IframeSelectionManager } from './IframeSelectionManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const padManager = new IframeSelectionManager();
    createIframes();

    // Setup event listeners and bind them to padManager methods
    const setBPMButton = document.getElementById('setBPM');
    if (setBPMButton) {
        setBPMButton.addEventListener('click', setGlobalBPM);
    }

    const toggleButton = document.getElementById('toggleGuide');
    const guideContent = document.getElementById('guideContent');
    if (toggleButton && guideContent) {
        toggleButton.addEventListener('click', () => {
            const isGuideVisible = guideContent.style.display !== 'none';
            guideContent.style.display = isGuideVisible ? 'none' : 'block';
            toggleButton.textContent = isGuideVisible ? 'Show User Guide' : 'Hide User Guide';
            document.querySelector('.right-column').classList.toggle('right-column-hidden', !isGuideVisible);
        });

        // Ensure the guide is visible on load
        guideContent.style.display = 'block';
    }

    const clearAllButton = document.getElementById('clearAllButton');
    if (clearAllButton) {
        clearAllButton.addEventListener('click', clearAllIframes);
    }
});

function setGlobalBPM() {
    const bpmInput = document.getElementById('globalBPM');
    if (bpmInput) {
        const bpm = parseInt(bpmInput.value, 10);
        document.querySelectorAll('iframe').forEach(iframe => {
            iframe.contentWindow.postMessage({ type: 'updateBPM', data: { bpm: bpm } }, '*');
        });
    }
}
  

  function initializePage() {
    document.getElementById('setBPM').addEventListener('click', setGlobalBPM);
    // Other initialization code here...
  }

  document.addEventListener('DOMContentLoaded', initializePage);