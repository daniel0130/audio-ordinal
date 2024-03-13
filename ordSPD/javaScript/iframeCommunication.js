// iframeCommunication.js

import { postMessageToSelectedIframes } from './IframeManager.js';

let isMuted = false;

function updateGlobalSettings(iframeId, setting, adjustmentFactor, isIncremental) {
    window.iframeSettings[iframeId] = window.iframeSettings[iframeId] || {};

    // If resetting a value, set it directly
    if (!isIncremental) {
        window.iframeSettings[iframeId][setting] = adjustmentFactor;
    } else {
        // Apply increment or multiplication factor based on the adjustment type
        window.iframeSettings[iframeId][setting] = window.iframeSettings[iframeId][setting] || 0;
        window.iframeSettings[iframeId][setting] += adjustmentFactor;
    }

    // Now, apply this updated setting directly to the iframe as well
    const messageData = {};
    messageData[setting] = window.iframeSettings[iframeId][setting];
    postMessageToSelectedIframes(setting, messageData, iframeId);
}

export function postKeyEventToIframes(keyChar, iframeId) {
    const actionMap = {
        '-': { setting: 'scheduleMultiplier', adjustmentFactor: -0.1, isIncremental: true },
        '+': { setting: 'scheduleMultiplier', adjustmentFactor: 0.1, isIncremental: true },
        ',': { setting: 'volume', adjustmentFactor: -10, isIncremental: true },
        '.': { setting: 'volume', adjustmentFactor: 10, isIncremental: true },
        '0': { setting: 'scheduleMultiplier', adjustmentFactor: 1, isIncremental: false }, // Reset value
        'm': { setting: 'mute', adjustmentFactor: isMuted ? 0 : 1, isIncremental: false }, // Toggle mute
        '{': { setting: 'playbackSpeed', adjustmentFactor: -0.1, isIncremental: true },
        '}': { setting: 'playbackSpeed', adjustmentFactor: 0.1, isIncremental: true },
        'Ctrl+Shift+{': { setting: 'playbackSpeed', adjustmentFactor: -1, isIncremental: true },
        'Ctrl+Shift+}': { setting: 'playbackSpeed', adjustmentFactor: 1, isIncremental: true }
    };

    if (keyChar in actionMap) {
        const { setting, adjustmentFactor, isIncremental } = actionMap[keyChar];
        updateGlobalSettings(iframeId, setting, adjustmentFactor, isIncremental);

        // Special case for mute toggle
        if (keyChar === 'm') {
            isMuted = !isMuted;
        }
    } else {
        console.log(`No action defined for keyChar: ${keyChar}`);
    }


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


