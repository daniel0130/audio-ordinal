// keySimulation.js
import { postKeyEventToIframes } from './iframeCommunication.js';

// Simulate a key event and dispatch it
function simulateKeyEvent(keyDetails, eventType, target) {
    console.log(`[simulateKeyEvent] Simulating key event for: ${keyDetails}`);
    const evt = new KeyboardEvent(eventType, {
        bubbles: true,
        cancelable: true,
        keyCode: keyDetails.keyCode,
        shiftKey: keyDetails.shiftKey,
        ctrlKey: keyDetails.ctrlKey
    });
    target.dispatchEvent(evt);
}

// Map key characters to their event details, correcting and extending mappings
export const keyMap = {
    '=': { keyCode: 187, shiftKey: false, ctrlKey: false },
    '+': { keyCode: 187, shiftKey: true, ctrlKey: false },
    '-': { keyCode: 189, shiftKey: false, ctrlKey: false },
    '_': { keyCode: 189, shiftKey: true, ctrlKey: false },
    '0': { keyCode: 48, shiftKey: false, ctrlKey: false },
    ',': { keyCode: 188, shiftKey: false, ctrlKey: false }, // for "<"
    '.': { keyCode: 190, shiftKey: false, ctrlKey: false }, // for ">"
    '{': { keyCode: 219, shiftKey: true, ctrlKey: false },
    '}': { keyCode: 221, shiftKey: true, ctrlKey: false },
    'Ctrl+Shift+{': { keyCode: 219, shiftKey: true, ctrlKey: true },
    'Ctrl+Shift+}': { keyCode: 221, shiftKey: true, ctrlKey: true },
    'Shift+-': { keyCode: 189, shiftKey: true, ctrlKey: false },
    'Shift++': { keyCode: 187, shiftKey: true, ctrlKey: false },
    'Ctrl+Shift+-': { keyCode: 189, shiftKey: true, ctrlKey: true },
    'Ctrl+Shift++': { keyCode: 187, shiftKey: true, ctrlKey: true },
    'm': { keyCode: 77, shiftKey: false, ctrlKey: false }
};

// Handle interactive guide elements, updated to support corrected mappings
export function makeGuideInteractive() {
    document.querySelectorAll('.instructions-container kbd').forEach(kbd => {
        kbd.style.cursor = 'pointer';
        kbd.addEventListener('click', () => {
            const keyChar = kbd.textContent.trim().replace('<', ',').replace('>', '.'); // Adjust for HTML entities
            const actionKey = keyChar.includes('Ctrl') || keyChar.includes('Shift') ? keyChar : keyMap[keyChar] ? keyChar : null;
            console.log(`Simulating key press for: ${actionKey}`);
            if (actionKey && keyMap[actionKey]) {
                const target = document.activeElement.contentDocument || document;
                simulateKeyEvent(keyMap[actionKey], 'keydown', target);
                simulateKeyEvent(keyMap[actionKey], 'keyup', target);

                postKeyEventToIframes(actionKey);
            }
        });
    });
}
