// Unified Sequencer Settings Initialization
document.addEventListener('DOMContentLoaded', () => {
    window.unifiedSequencerSettings = new UnifiedSequencerSettings();
    let isPlaying = false;
    let currentStep = 0;
    let timeoutId;
    let startTime;
    let nextStepTime;
    let isPaused = false;
    let pauseTime = 0;
    let totalStepCount = 0;
    let beatCount = 1;
    let barCount = 1;
    let sequenceCount = 0;
    let stepDuration;
    let lastProcessedSequenceNumber = -1; // Initialize the variable

    window.addEventListener('message', (event) => {
        console.log(`[slave] Received message from parent at ${new Date().toISOString()}:`);
        console.log(JSON.stringify(event.data));
        const message = event.data;
    
        // Ensure messages are processed in the correct order
        if (message.sequenceNumber <= lastProcessedSequenceNumber) {
            console.warn(`[slave] Discarding out-of-order or duplicate message: ${message.sequenceNumber}`);
            return;
        }
        lastProcessedSequenceNumber = message.sequenceNumber;
    
        switch (message.type) {
            case 'PLAY':
                startTime = message.startTime;
                nextStepTime = startTime;
                setMasterBPM(message.bpm);
                startScheduler();
                break;
            case 'PAUSE':
                pauseTime = message.pauseTime;
                pauseScheduler();
                break;
            case 'RESUME':
                nextStepTime = message.nextStepTime;
                resumeScheduler();
                break;
            case 'STOP':
                stopScheduler();
                break;
            case 'STEP_UPDATE':
                currentStep = message.step;
                window.unifiedSequencerSettings.setCurrentSequence(message.sequence);
                playStep(currentStep, window.unifiedSequencerSettings.getCurrentSequence());
                break;
            case 'SYNC_SETTINGS':
                window.unifiedSequencerSettings.loadSettings(message.settings);
                setMasterBPM(message.bpm);
                break;
            case 'SCHEDULE_NEXT_STEP':
                nextStepTime = message.nextStepTime;
                stepDuration = message.stepDuration;
                scheduleNextStep();
                break;
            case 'RESET_STEP_LIGHTS':
                resetStepLights();
                break;
            case 'RENDER_PLAYHEAD':
                renderPlayhead(document.querySelectorAll('.step-button'), message.currentStep);
                break;
            case 'PLAY_STEP':
                playStep(message.currentStep, message.currentSequence);
                break;
            case 'INCREMENT_COUNTERS':
                incrementStepCounters(message);
                break;
            case 'SEQUENCE_TRANSITION':
                handleSequenceTransition(message.targetSequence, message.startStep);
                break;
            case 'RESET_COUNTERS':
                resetCountersForNewSequence(message.startStep);
                break;
            case 'SYNC_CONTINUOUS_PLAY':
                updateContinuousPlayUI(message.isContinuousPlay);
                break;
            case 'SYNC_CURRENT_SEQUENCE':
                window.unifiedSequencerSettings.setCurrentSequence(message.sequence);
                console.log(`[slave] Updated current sequence to ${message.sequence}`);
                break;
            default:
                console.warn(`[slave] Received unknown message type at ${new Date().toISOString()}: ${message.type}`);
        }
    });
    
    function updateContinuousPlayUI(isContinuousPlay) {
        const continuousPlayCheckbox = document.getElementById('continuous-play');
        if (continuousPlayCheckbox) {
            continuousPlayCheckbox.checked = isContinuousPlay;
            console.log(`[slave] Updated continuous play UI to ${isContinuousPlay}`);
        }
    }
    
    function incrementStepCounters(message) {
        currentStep = message.currentStep;
        totalStepCount = message.totalStepCount;
        nextStepTime = message.nextStepTime;
        beatCount = message.beatCount;
        barCount = message.barCount;
        sequenceCount = message.sequenceCount;
    }
    
    function handleSequenceTransition(targetSequence, startStep) {
        window.unifiedSequencerSettings.setCurrentSequence(targetSequence);
        console.log(`[slave] [handleSequenceTransition] Sequence set to ${targetSequence}`);
        const currentSequenceDisplay = document.getElementById('current-sequence-display');
        if (currentSequenceDisplay) {
            currentSequenceDisplay.innerHTML = `Sequence: ${targetSequence}`;
        }
        resetCountersForNewSequence(startStep);
        createStepButtonsForSequence();
    }
    
    function resetCountersForNewSequence(startStep = 0) {
        currentStep = startStep;
        beatCount = Math.floor(startStep / 4);
        barCount = Math.floor(startStep / 16);
        totalStepCount = startStep;
        console.log(`[slave] [resetCountersForNewSequence] Counters reset for new sequence starting at step ${startStep}`);
    }

    function setMasterBPM(bpm) {
        if (bpm !== undefined) {
            console.log(`[slave] Setting BPM to ${bpm} as per master's instructions.`);
            window.unifiedSequencerSettings.setBPM(bpm);
        } else {
            console.warn(`[slave] Attempted to set BPM to undefined. Ignoring.`);
        }
    }

    function startScheduler() {
        console.log(`[slave] Starting scheduler at ${new Date().toISOString()}`);
        clearTimeout(timeoutId);
        window.unifiedSequencerSettings.audioContext.resume();
        startTime = window.unifiedSequencerSettings.audioContext.currentTime;
        nextStepTime = startTime;

        const currentBPM = window.unifiedSequencerSettings.getBPM();
        console.log(`[slave] Current BPM from global settings at ${new Date().toISOString()}: ${currentBPM}`);

        scheduleNextStep();
    }

    function pauseScheduler() {
        clearTimeout(timeoutId);
        window.unifiedSequencerSettings.audioContext.suspend();
        isPaused = true;
    }

    function resumeScheduler() {
        if (isPaused) {
            window.unifiedSequencerSettings.audioContext.resume();
            nextStepTime = window.unifiedSequencerSettings.audioContext.currentTime;
            isPaused = false;
        }
        scheduleNextStep();
    }

    function scheduleNextStep() {
        const currentSequence = window.unifiedSequencerSettings.getCurrentSequence();
        console.log(`[slave] [scheduleNextStep] Scheduling next step at ${nextStepTime} for currentSequence ${currentSequence}`);
        const bpm = window.unifiedSequencerSettings.getBPM() || 120;
        stepDuration = 60 / bpm / 4;

        // Clear any existing timeouts
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
            console.log(`[slave] [scheduleNextStep] About to play step ${currentStep} of currentSequence ${currentSequence}`);
            playStep(currentStep, currentSequence);
            scheduleNextStep();
        }, (nextStepTime - window.unifiedSequencerSettings.audioContext.currentTime) * 1000);
    }

    function stopScheduler() {
        console.log('[slave] Stopping scheduler.');
        clearTimeout(timeoutId);
        resetStepLights();

        window.unifiedSequencerSettings.sourceNodes.forEach((source, index) => {
            if (source && source.started) {
                source.stop();
                source.disconnect();
                window.unifiedSequencerSettings.sourceNodes[index] = null;
            }
        });

        currentStep = 0;
        beatCount = 1;
        barCount = 1;
        sequenceCount = 0;
        isPaused = false;
        pauseTime = 0;
    }


    function handleStep(channel, channelData, totalStepCount) {
        console.log(`[slave] Handling step for channel ${channel.id}`);
        let isMuted = channel.dataset.muted === 'true';
        const isToggleMuteStep = channelData.toggleMuteSteps.includes(totalStepCount);

        if (isToggleMuteStep) {
            isMuted = !isMuted;
            channel.dataset.muted = isMuted ? 'true' : 'false';
            updateMuteState(channel, isMuted);
        }

        return isMuted;
    }

    function renderPlayhead(buttons, currentStep) {
        console.log(`[slave] Rendering playhead for step ${currentStep}`);
        buttons.forEach((button, buttonIndex) => {
            button.classList.remove('playing');
            button.classList.remove('triggered');

            if (buttonIndex === currentStep) {
                button.classList.add('playing');
            }

            if (button.classList.contains('selected')) {
                button.classList.add('triggered');
            }
        });
    }


    function playStep(currentStep, currentSequence) {
        console.log(`[slave] [playStep] Playing step ${currentStep} for currentSequence ${currentSequence} at ${new Date().toISOString()}`);
        const presetData = presets.preset1;

        for (let channelIndex = 0; channelIndex < 16; channelIndex++) {
            const channel = channels[channelIndex];
            const buttons = channel.querySelectorAll('.step-button');
            let channelData = presetData.channels[channelIndex] || {
                steps: Array(4096).fill(false),
                mute: false,
                url: null
            };

            // Ensure the correct sequence data is used
            let stepIndex = currentSequence * 64 + currentStep;
            console.log(`[slave] [playStep] Using stepIndex ${stepIndex} for sequence ${currentSequence}, channel ${channelIndex}`);

            renderPlayhead(buttons, currentStep);
            const isMuted = handleStep(channel, channelData, totalStepCount);
            if (!isMuted) {
                playSound(currentSequence, channel, currentStep);
            }
        }

        const isLastStep = currentStep === 63;
        incrementStepCounters();

        const continuousPlayCheckbox = document.getElementById('continuous-play');
        let isContinuousPlay = continuousPlayCheckbox.checked;

        if (isContinuousPlay && isLastStep) {
            let nextSequence = (currentSequence + 1) % window.unifiedSequencerSettings.numSequences;
            console.log(`[slave] [playStep] Transitioning to next sequence ${nextSequence}`);
            handleSequenceTransition(nextSequence, 0);
        } else if (isLastStep) {
            console.log("[slave] [playStep] Last step reached, but continuous play is disabled. Resetting to step 0.");
            resetCountersForNewSequence(0);
        }
    }

    function incrementStepCounters() {
        console.log('[slave] Incrementing step counters.');
        currentStep = (currentStep + 1) % 64;
        totalStepCount = (totalStepCount + 1);
        nextStepTime += stepDuration;

        if (currentStep % 4 === 0) {
            beatCount++;
            emitBeat(beatCount);
        }

        if (currentStep % 16 === 0) {
            barCount++;
            emitBar(barCount);
        }

        if (currentStep === 0) {
            sequenceCount++;
        }
    }

    function resetStepLights() {
        console.log('[slave] Resetting step lights.');
        const buttons = document.querySelectorAll('.step-button');
        buttons.forEach(button => {
            button.classList.remove('playing');
        });
    }
});
