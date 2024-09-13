// audioTrimModule.js

class AudioTrimmer {
    constructor(channelIndex) {
        console.log("[Class Functions] constructor", { channelIndex });

        this.channelIndex = channelIndex;

        // Fetch initial trim settings from the global object or use default values
        const globalSettings = window.unifiedSequencerSettings.getTrimSettings(channelIndex) || { start: 0.01, end: 100 };
        this.startSliderValue = globalSettings.start;
        this.endSliderValue = globalSettings.end;

        console.log("startSliderValue and endSliderValue in AudioTrimmer class constructor", this.startSliderValue, this.endSliderValue);

        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioBuffer = null;
        this.isPlaying = false;
        this.isLooping = false;

        this.initializeSliderTrack();

        // Set default values if not already provided
        const trimSettings = getTrimSettings(channelIndex) || { startSliderValue: 0, endSliderValue: 100 };
        this.startSliderValue = trimSettings.startSliderValue || 0;
        this.endSliderValue = trimSettings.endSliderValue || 100;

        this.displayTimeout = null;
    }

    initializeSliderTrack() {
        this.sliderTrack = document.querySelector('.slider-track');
        if (!this.sliderTrack) {
            console.error('Slider track not found');
        }
    }

    async initialize() {
        console.log("[Class Functions] initialize");

        const elementIds = [
            'ordinalIdInput', 'loadSampleButton', 'waveformCanvas', 'playbackCanvas',
            'trimmerPlayButton', 'trimmerStopButton', 'loopButton', 'startDimmed', 'endDimmed', 'startSlider', 'endSlider'
        ];
        const allElementsAvailable = elementIds.every(id => this[id] = document.getElementById(id));

        if (allElementsAvailable) {
            this.ctx = this.waveformCanvas.getContext('2d');
            this.addEventListeners();
            this.updateSliderValues();
        } else {
            console.log("[Class Functions] initialize - Waiting for elements to be available");
            setTimeout(() => this.initialize(), 500); // Retry initialization after a delay
        }

        const trimSettings = getTrimSettings(this.channelIndex);
        this.startSlider.value = trimSettings.startSliderValue;
        this.endSlider.value = trimSettings.endSliderValue;
        this.isLooping = trimSettings.isLooping;

        this.updateSliderValues();
        this.playbackCtx = this.playbackCanvas.getContext('2d');
        this.playbackCtx.fillStyle = 'red';
    }

    updateSliderValues() {
        const startLeft = (this.startSliderValue / 100) * this.sliderTrack.offsetWidth;
        const endLeft = (this.endSliderValue / 100) * this.sliderTrack.offsetWidth;

        this.startSlider.style.left = `${startLeft}px`;
        this.endSlider.style.left = `${endLeft}px`;

        this.updateDimmedAreas();
        this.updateTrimmedSampleDuration();
        this.debounceDisplayValues();
    }

    updateDimmedAreas() {
        if (this.startSliderValue === undefined || this.endSliderValue === undefined) {
            console.error("Slider values are undefined, skipping update of dimmed areas.");
            return;
        }

        this.startDimmed.style.width = `${this.startSliderValue}%`;
        this.endDimmed.style.width = `${100 - this.endSliderValue}%`;
        this.endDimmed.style.left = `${this.endSliderValue}%`;
    }

    updateTrimmedSampleDuration() {
        this.trimmedSampleDuration = Math.max(0, this.endSliderValue - this.startSliderValue);
        this.debounceDisplayValues();
    }

    debounceDisplayValues() {
        clearTimeout(this.displayTimeout);
        this.displayTimeout = setTimeout(() => this.displayValues(), 300);
    }

    displayValues() {
        console.log("Start Slider Value:", this.startSliderValue);
        console.log("End Slider Value:", this.endSliderValue);
        console.log("Trimmed Sample Duration:", this.trimmedSampleDuration);
    }

    // Method to convert slider values to timecode based on total duration
    sliderValueToTimecode(sliderValue, totalDuration) {
        return (sliderValue / 100) * totalDuration;
    }


    // Method to get the current value of the start slider
    getStartSliderValue() {
        return this.startSliderValue;
    }

    // Method to get the current value of the end slider
    getEndSliderValue() {
        return this.endSliderValue;
    }

    sliderValueToTimecode(sliderValue, totalDuration) {
        return (sliderValue / 100) * totalDuration;
    }

    setAudioBuffer(audioBuffer) {
        if (!audioBuffer) {
            console.log("setAudioBuffer called with null or undefined audioBuffer");
            return;
        }
        this.audioBuffer = audioBuffer;
        this.updateSliderValues();
        this.drawWaveform();
    }

    drawWaveform() {
        if (!this.audioBuffer || !this.waveformCanvas) return;

        const { width, height } = this.waveformCanvas;
        const channelData = this.audioBuffer.getChannelData(0);
        const step = Math.ceil(channelData.length / width);
        const amp = height / 2;
        const ctx = this.waveformCanvas.getContext('2d');

        ctx.clearRect(0, 0, width, height);
        ctx.beginPath();

        for (let i = 0; i < width; i++) {
            const { min, max } = this.getMinMax(channelData, i * step, step);
            ctx.moveTo(i, amp - amp * min);
            ctx.lineTo(i, amp - amp * max);
        }
        ctx.stroke();
    }

    addEventListeners() {
        this.boundPlayTrimmedAudio = this.playTrimmedAudio.bind(this);
        this.boundStopAudio = this.stopAudio.bind(this);

        this.trimmerPlayButton.addEventListener('click', this.boundPlayTrimmedAudio);
        this.trimmerStopButton.addEventListener('click', this.boundStopAudio);
        this.loopButton.addEventListener('click', this.toggleLoop.bind(this));

        const sliderMouseDown = (event, isStartSlider) => {
            const slider = isStartSlider ? this.startSlider : this.endSlider;
            if (!slider) return;

            const shiftX = event.clientX - slider.getBoundingClientRect().left;
            document.onmousemove = (e) => {
                if (!this.sliderTrack) return;

                let newLeft = e.clientX - shiftX - this.sliderTrack.getBoundingClientRect().left;
                newLeft = Math.max(0, Math.min(newLeft, this.sliderTrack.offsetWidth - slider.offsetWidth));

                if (isStartSlider) {
                    newLeft = Math.min(newLeft, this.endSlider.getBoundingClientRect().left - this.sliderTrack.getBoundingClientRect().left);
                } else {
                    newLeft = Math.max(newLeft, this.startSlider.getBoundingClientRect().right - this.sliderTrack.getBoundingClientRect().left);
                }

                slider.style.left = `${newLeft}px`;
                const newValue = (newLeft / this.sliderTrack.offsetWidth) * 100;
                if (isStartSlider) {
                    this.startSliderValue = newValue;
                } else {
                    this.endSliderValue = newValue;
                }

                unifiedSequencerSettings.settings.masterSettings.trimSettings[this.channelIndex] = {
                    startSliderValue: this.startSliderValue,
                    endSliderValue: this.endSliderValue
                };

                updateTrimSettingsUI(unifiedSequencerSettings.settings.masterSettings.trimSettings);
                this.updateSliderValues();
            };

            document.onmouseup = () => {
                document.onmousemove = document.onmouseup = null;
            };
        };

        this.startSlider.addEventListener('mousedown', (event) => sliderMouseDown(event, true));
        this.endSlider.addEventListener('mousedown', (event) => sliderMouseDown(event, false));
    }

    async loadSample() {
        if (!this.ordinalIdInput.value) return;

        try {
            this.audioBuffer = await fetchAudio(`https://ordinals.com/content/${this.ordinalIdInput.value}`);
            const trimSettings = getTrimSettings(this.channelIndex);
            this.trimSettings = { ...trimSettings, totalSampleDuration: this.audioBuffer.duration };

            this.drawWaveform();
            this.updateSliderValues();
        } catch (error) {
            console.error('Error loading audio:', error);
        }
    }

    // Method to play the trimmed audio segment
    playTrimmedAudio() {
        if (!this.audioBuffer || this.isPlaying) return;

        const startTime = this.sliderValueToTimecode(this.startSliderValue, this.audioBuffer.duration);
        const endTime = this.sliderValueToTimecode(this.endSliderValue, this.audioBuffer.duration);

        console.log("[playTrimmedAudio] isPlaying set to true, starting new playback");

        this.isPlaying = true;

        const source = this.audioContext.createBufferSource();
        source.buffer = this.audioBuffer;

        source.connect(this.audioContext.destination);
        source.start(0, startTime, endTime - startTime);

        source.onended = () => {
            this.isPlaying = false;
            console.log("[playTrimmedAudio] Playback finished");
        };
    }

    getMinMax(channelData, startIndex, step) {
        let min = channelData[startIndex], max = min; // Start with the first element
        for (let i = 1; i < step; i++) {  // Start loop from 1 to skip re-checking the first element
            const datum = channelData[startIndex + i];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
        }
        return { min, max };
    }
    
    // Method to get the current value of the isLooping flag
    getIsLooping() {
        return this.isLooping;
    }
    
    // Method to set the isLooping flag
    setIsLooping(isLooping) {
        this.isLooping = isLooping;
        this.updateLoopButtonState(); // Only one responsibility in this method
    }
    
    // Method to update the loop button's visual state based on isLooping flag
    updateLoopButtonState() {
        if (!this.loopButton) return;
        const action = this.isLooping ? 'add' : 'remove';
        this.loopButton.classList[action]('on');
        this.loopButton.classList[action === 'add' ? 'remove' : 'add']('off');
    }
    
    playTrimmedAudio() {
        console.log("[playTrimmedAudio] [Class Functions] playTrimmedAudio");
    
        if (this.isPlaying || !this.audioBuffer) {
            console.log("[playTrimmedAudio] Audio is already playing or no audio buffer loaded");
            return;
        }
    
        this.isPlaying = true;
        console.log("[playTrimmedAudio] isPlaying set to true, starting new playback");
    
        const startOffset = this.sliderValueToTimecode(this.startSliderValue, this.audioBuffer.duration);
        const endTime = this.sliderValueToTimecode(this.endSliderValue, this.audioBuffer.duration);
    
        if (this.sourceNode) this.sourceNode.disconnect();
    
        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = this.audioBuffer;
        this.sourceNode.connect(this.audioContext.destination);
        
        this.sourceNode.loop = this.isLooping;
        if (this.isLooping) {
            this.sourceNode.loopStart = startOffset;
            this.sourceNode.loopEnd = endTime;
        }
    
        this.sourceNode.start(0, startOffset, endTime - startOffset);
        console.log("[playTrimmedAudio] Playback started");
        this.animatePlayback();
    
        this.sourceNode.onended = () => {
            this.isPlaying = false;
            console.log("[playTrimmedAudio] Playback ended");
            if (this.isLooping) {
                this.playTrimmedAudio();  // Restart if looping
            } else if (this.animationFrameRequest) {
                cancelAnimationFrame(this.animationFrameRequest);
            }
        };
    }
    
    stopAudio() {
        console.log("[Class Functions] stopAudio");
        this.setIsLooping(false);
    
        if (this.isPlaying) {
            this.sourceNode?.stop();
            this.sourceNode?.disconnect();
            this.sourceNode = null;
            this.isPlaying = false;
        }
        cancelAnimationFrame(this.animationFrameRequest);
    }
    
    toggleLoop() {
        this.setIsLooping(!this.isLooping);  // Use setIsLooping for consistent state management
        if (this.isPlaying) this.playTrimmedAudio();  // Restart playback if already playing
    }
    
    getCurrentPlaybackPosition() {
        if (!this.isPlaying) return 0;
        const startOffset = this.sliderValueToTimecode(this.startSliderValue, this.audioBuffer.duration);
        return ((this.audioContext.currentTime - this.startTime) % this.audioBuffer.duration) + startOffset;
    }
    
    updatePlaybackCanvas() {
        const actualCurrentPosition = this.audioContext.currentTime - this.startTime;
        const startOffset = this.sliderValueToTimecode(this.startSliderValue, this.audioBuffer.duration);
        const endOffset = this.sliderValueToTimecode(this.endSliderValue, this.audioBuffer.duration);
        const trimmedDuration = endOffset - startOffset;
    
        const relativePosition = (actualCurrentPosition - startOffset) % trimmedDuration;
        if (relativePosition < 0 || relativePosition > trimmedDuration) return;
    
        const canvasWidth = this.playbackCanvas.width;
        const startSliderCanvasPosition = (this.startSliderValue / 100) * canvasWidth;
        const endSliderCanvasPosition = (this.endSliderValue / 100) * canvasWidth;
        const xPosition = startSliderCanvasPosition + (relativePosition / trimmedDuration) * (endSliderCanvasPosition - startSliderCanvasPosition);
    
        this.playbackCtx.clearRect(0, 0, canvasWidth, this.playbackCanvas.height);
        this.playbackCtx.beginPath();
        this.playbackCtx.moveTo(xPosition, 0);
        this.playbackCtx.lineTo(xPosition, this.playbackCanvas.height);
        this.playbackCtx.strokeStyle = '#FF0000';
        this.playbackCtx.lineWidth = 2;
        this.playbackCtx.stroke();
    }
    
    animatePlayback() {
        if (this.isPlaying) {
            this.updatePlaybackCanvas();
            this.animationFrameRequest = requestAnimationFrame(() => this.animatePlayback());
        }
    }
}    