// eventListeners.js

document.addEventListener('DOMContentLoaded', () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const effectsContainer = document.getElementById('effects-container');

    try {
        const effects = {
            reverb: createReverb(audioContext),
            delay: createDelay(audioContext),
            chorus: createChorus(audioContext),
            distortion: createDistortion(audioContext),
            filter: createFilter(audioContext),
            tremolo: createTremolo(audioContext)
        };
        let activeEffect = null;

        const effectSelect = document.getElementById('effect-select');
        const controlsContainer = document.getElementById('controls-container');

        if (!effectSelect || !controlsContainer) {
            console.error("Required DOM elements not found.");
            return;
        }

        effectSelect.addEventListener('change', (event) => {
            const effectName = event.target.value;
            activeEffect = effects[effectName];
            updateControls(effectName);

            if (activeEffect && activeEffect.updateWithBPM) {
                activeEffect.updateWithBPM();
            }

            // Send resize message whenever the effect changes
            sendResizeMessage();
        });

        const updateControls = (effectName) => {
            controlsContainer.innerHTML = '';

            if (!activeEffect) return;

            switch (effectName) {
                case 'reverb':
                    addReverbControls();
                    break;
                case 'delay':
                    addControl('Delay Time', 60 / getBPM(), activeEffect.setDelayTime);
                    addControl('Feedback', 0.5, activeEffect.setFeedback);
                    addControl('Wet Level', 0.5, activeEffect.setWetLevel);
                    break;
                case 'chorus':
                    addControl('Depth', 0.002, activeEffect.setDepth);
                    addControl('Rate', 1.5, activeEffect.setRate);
                    break;
                case 'distortion':
                    addControl('Amount', 400, activeEffect.setAmount);
                    break;
                case 'filter':
                    addControl('Frequency', 1000, activeEffect.setFrequency);
                    addControl('Quality', 1, activeEffect.setQuality);
                    break;
                case 'tremolo':
                    addControl('Rate', getBPM() / 60, activeEffect.setRate);
                    addControl('Depth', 0.5, activeEffect.setDepth);
                    break;
            }
            addBypassControl();
        };

        const addReverbControls = () => {
            const reverbTypeControl = document.createElement('select');
            reverbTypeControl.innerHTML = `
                <option value="vocalBooth">Vocal Booth</option>
                <option value="mediumRoom">Medium Room</option>
                <option value="largeHall">Large Hall</option>
            `;
            reverbTypeControl.addEventListener('change', (event) => {
                activeEffect.setReverbType(event.target.value);
                sendResizeMessage(); // Send resize message after control change
            });

            const controlDiv = createControlDiv('Reverb Type');
            controlDiv.appendChild(reverbTypeControl);
            controlsContainer.appendChild(controlDiv);

            addControl('Reverb Level', 0.5, activeEffect.setReverbLevel);
            addControl('Dry Level', 0.5, activeEffect.setDryLevel);
        };

        const addControl = (label, initialValue, callback) => {
            const controlDiv = createControlDiv(label);

            const controlInput = document.createElement('input');
            controlInput.type = 'range';
            controlInput.min = '0';
            controlInput.max = '1';
            controlInput.step = '0.01';
            controlInput.value = initialValue;
            controlInput.addEventListener('input', (event) => {
                callback(parseFloat(event.target.value));
                sendResizeMessage(); // Send resize message after control change
            });
            controlDiv.appendChild(controlInput);

            controlsContainer.appendChild(controlDiv);
        };

        const createControlDiv = (labelText) => {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'control';

            const controlLabel = document.createElement('label');
            controlLabel.textContent = labelText;
            controlDiv.appendChild(controlLabel);

            return controlDiv;
        };

        const addBypassControl = () => {
            const controlDiv = document.createElement('div');
            controlDiv.className = 'switch-container';

            const controlLabel = document.createElement('label');
            controlLabel.className = 'switch-label';
            controlLabel.textContent = 'On/Off';
            controlDiv.appendChild(controlLabel);

            const switchDiv = document.createElement('label');
            switchDiv.className = 'switch';

            const switchInput = document.createElement('input');
            switchInput.type = 'checkbox';
            switchInput.checked = false; // Effect is off by default

            // Change this event listener to show a notification instead of toggling the effect
            switchInput.addEventListener('change', (event) => {
                event.preventDefault();
                showNotification('Effects package not available yet.');
                switchInput.checked = false; // Ensure it stays unchecked
            });

            switchDiv.appendChild(switchInput);

            const sliderSpan = document.createElement('span');
            sliderSpan.className = 'slider';
            switchDiv.appendChild(sliderSpan);

            controlDiv.appendChild(switchDiv);
            controlsContainer.appendChild(controlDiv);
        };
    } catch (error) {
        console.error("An error occurred while initializing the effects module:", error);
    }
});
