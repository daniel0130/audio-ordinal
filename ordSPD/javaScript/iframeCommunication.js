// iframeCommunication.js

import { postMessageToSelectedIframes } from './IframeManager.js';
import { iframeValueTracker } from './IframeValueTracker.js'; // Ensure this is correctly imported

let isMuted = false;

export function postKeyEventToIframes(keyChar, iframeId) { // Assuming iframeId is passed to identify the target iframe
    const actionMap = {
        '-': 'decreaseScheduleMultiplier',
        '+': 'increaseScheduleMultiplier',
        ',': 'decreaseVolume',
        '.': 'increaseVolume',
        '0': 'resetSchedulerValue',
        'm': 'muteControl',
        '{': 'playAtSpeed',
        '}': 'playAtSpeed',
        'Ctrl+Shift+{': 'playAtSpeed',
        'Ctrl+Shift+}': 'playAtSpeed'
    };

    const messageType = actionMap[keyChar];
    let messageData = {};

    // Handle mute toggle separately as before
    if (keyChar === 'm') {
        isMuted = !isMuted;
        messageData = { mute: isMuted };
    }

    // Now handle volume and schedule adjustments with the tracking mechanism
    switch (keyChar) {
        case ',':
            messageData = { volume: iframeValueTracker.adjustVolume(iframeId, 'decrease') };
            break;
        case '.':
            messageData = { volume: iframeValueTracker.adjustVolume(iframeId, 'increase') };
            break;
        case '-':
            messageData = { scheduleMultiplier: iframeValueTracker.adjustScheduleMultiplier(iframeId, 'decrease') };
            break;
        case '+':
            messageData = { scheduleMultiplier: iframeValueTracker.adjustScheduleMultiplier(iframeId, 'increase') };
            break;
        case '0':
            if (iframeValueTracker.resetScheduleMultiplier(iframeId)) {
                messageData = { scheduleMultiplier: 1 };
            }
            break;
        // Speed control cases as before, assuming these do not interact with the new tracking mechanism directly
        // Adjust the playback speed based on key presses
        case '{':
            messageData = { speed: iframeValueTracker.adjustPlaybackSpeed(iframeId, -0.1) }; // Decrease by 0.1
            break;
        case '}':
            messageData = { speed: iframeValueTracker.adjustPlaybackSpeed(iframeId, 0.1) }; // Increase by 0.1
            break;
        case 'Ctrl+Shift+{':
            messageData = { speed: iframeValueTracker.adjustPlaybackSpeed(iframeId, -1) }; // Decrease by 1
            break;
        case 'Ctrl+Shift+}':
            messageData = { speed: iframeValueTracker.adjustPlaybackSpeed(iframeId, 1) }; // Increase by 1
            break;
    }

    if (messageType) {
        postMessageToSelectedIframes(messageType, messageData);
    } else {
        console.log(`No action defined for keyChar: ${keyChar}`);
    }
}


