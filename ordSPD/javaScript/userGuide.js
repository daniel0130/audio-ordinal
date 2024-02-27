// userGuide.js

import { IframeSelectionManager } from './IframeSelectionManager.js';
import { postMessageToSelectedIframes } from './IframeManager.js';


// Now you can create an instance of IframeSelectionManager
const iframeSelectionManager = new IframeSelectionManager();

// Function to generate the user guide content
function generateUserGuide() {
    const guideContent = document.createElement('div');
    guideContent.classList.add('instructions-container');
    guideContent.id = 'guideContent';

    const h2 = document.createElement('h2');
    h2.textContent = 'User Guide';
    guideContent.appendChild(h2);

    const h3 = document.createElement('h3');
    h3.innerHTML = 'Audionals 2.0 <br> User Guide';
    guideContent.appendChild(h3);

    const p = document.createElement('p');
    p.innerHTML = '<strong>Hotkeys and Shortcuts:</strong>';
    guideContent.appendChild(p);

    const ul = document.createElement('ul');
    // Updated hotkeys array with <kbd> tags and disabled text
    const hotkeys = [
        "<kbd>-</kbd> / <kbd>+</kbd>: 1/2 or x2 Loop Length",
        "<kbd>0</kbd>: Return to Default Loop Length",
        "<kbd>&lt;</kbd> / <kbd>&gt;</kbd>: Adjust volume by 1",
        "<kbd>m</kbd>: Mute",
        "<kbd>Shift</kbd> + <kbd>{</kbd> / <kbd>}</kbd>: Adjust playback speed and pitch by 10 cents (using sample playback speed)",
        "<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>{</kbd> / <kbd>}</kbd>: Adjust playback speed and pitch by semi-tone/100 cents (using sample playback speed)"
    ];
    hotkeys.forEach(hotkey => {
        const li = document.createElement('li');
        li.innerHTML = hotkey;
        ul.appendChild(li);
    });
    guideContent.appendChild(ul);

    const subUl = document.createElement('ul');
    // Update the sub-list with <kbd> tags and disabled text
    const bpmHotkeys = [
        "<kbd>Shift</kbd> + <kbd>-</kbd> / <kbd>+</kbd>: Adjust BPM by 1 <span class='disabled-text'>(Disabled in SPD - Use Global Setting)</span>",
        "<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>+</kbd> / <kbd>-</kbd>: Adjust BPM by 10 <span class='disabled-text'>(Disabled in SPD - Use Global Setting)</span>"
    ];
    bpmHotkeys.forEach(hotkey => {
        const li = document.createElement('li');
        li.innerHTML = hotkey;
        subUl.appendChild(li);
    });
    ul.appendChild(subUl);

    console.log('Generating user guide content...');
    return guideContent;
}

// Function to toggle the visibility of the user guide
function toggleUserGuide() {
    console.log('Toggling user guide visibility...');
    const guideContent = document.getElementById('guideContent');
    if (guideContent.style.display === 'none') {
        guideContent.style.display = 'block';
        document.getElementById('toggleGuide').textContent = 'Hide User Guide';
    } else {
        guideContent.style.display = 'none';
        document.getElementById('toggleGuide').textContent = 'Show User Guide';
    }
}

// function postMessageToIframes(type, data) {
//     console.log(`Posting message to iframes: type=${type}, data=`, data);
//     const iframes = document.querySelectorAll('iframe');
//     iframes.forEach(iframe => {
//         iframe.contentWindow.postMessage({ type, data }, '*'); // Replace '*' with the actual origin for security in production
//     });
// }

// Helper function to map key text to message type
function keyToMessageType(key) {
    console.log(`Mapping key to message type: key=${key}`);
    switch (key) {
        case '-':
            return 'decreaseScheduleMultiplier';
        case '+':
            return 'increaseScheduleMultiplier';
        case '0':
            return 'updateBPM';
        case 'm':
            return 'muteControl';
        // ... add other cases as necessary
        default:
            return null;
    }
}

// Function to get the IDs of the currently selected iframes
function getSelectedIframes() {
    console.log('Getting selected iframes...');

    // Use the instance of IframeSelectionManager to get the selected pads
    const selectedIframes = Array.from(iframeSelectionManager.selectedPads);
    console.log('Selected iframes:', selectedIframes);
    return selectedIframes;
}


// // Function to handle key press simulation
// function simulateKeyPressForGuide(kbdElement) {
//     const key = kbdElement.textContent.trim();
//     const type = keyToMessageType(key);
//     const selectedIframes = getSelectedIframes(); // Get the selected iframe IDs

//     if (type && selectedIframes.length > 0) {
//         selectedIframes.forEach(iframeId => {
//             const iframe = document.getElementById(iframeId);
//             if (iframe) {
//                 iframe.contentWindow.postMessage({ type }, '*'); // Use the actual origin in production
//             }
//         });
//     }
// }

// Temporary modification for testing
function simulateKeyPressForGuide(kbdElement) {
    const key = kbdElement.textContent.trim();
    const type = keyToMessageType(key);
    const selectedIframes = getSelectedIframes(); // Ensure this gets IDs correctly

    if (type) {
        const data = {}; // Initialize an empty data object
        // Populate data based on the type, e.g., for BPM adjustment
        if (type === 'updateBPM') {
            data.bpm = 120; // Or some logic to determine the correct BPM
        }

        selectedIframes.forEach(iframeId => {
            const iframe = document.getElementById(iframeId);
            if (iframe) {
                iframe.contentWindow.postMessage({ type, data }, '*');
            }
        });
    }
}


// Function to make <kbd> elements clickable and simulate keypress
function makeGuideInteractive() {
    console.log('Making guide interactive...');

    const kbdElements = document.querySelectorAll('.instructions-container kbd');
    kbdElements.forEach(kbd => {
        kbd.style.cursor = 'pointer'; // Make it visually apparent that kbd is clickable
        kbd.addEventListener('click', () => simulateKeyPressForGuide(kbd));
    });
}

// Append the user guide content to the DOM and make <kbd> elements interactive
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');

    const rightColumn = document.querySelector('.right-column');
    const toggleGuideBtn = document.createElement('button');
    toggleGuideBtn.id = 'toggleGuide';
    toggleGuideBtn.classList.add('toggle-guide');
    toggleGuideBtn.textContent = 'Hide User Guide';
    toggleGuideBtn.addEventListener('click', toggleUserGuide);
    rightColumn.insertBefore(toggleGuideBtn, rightColumn.firstChild);

    const guideContent = generateUserGuide();
    rightColumn.appendChild(guideContent);
    makeGuideInteractive(); // Make the guide interactive after appending it
});

// simulatedKeyPresses.js

document.addEventListener('DOMContentLoaded', function () {
// Function to post a message to the child iframes
function postMessageToIframes(type, data) {
    const iframes = document.querySelectorAll('iframe');
    iframes.forEach(iframe => {
        iframe.contentWindow.postMessage({ type, data }, '*'); // Replace '*' with the actual origin for security in production
    });
}
})