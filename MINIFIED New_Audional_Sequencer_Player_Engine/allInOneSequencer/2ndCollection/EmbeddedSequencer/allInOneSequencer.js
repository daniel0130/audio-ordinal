// allInOneSequencer.js

const BASE_ORDINALS_URL="https://ordinals.com/content/";function isValidOrdinalsUrl(n){return new RegExp(`^${BASE_ORDINALS_URL}[a-f0-9]{64}i\\d+$`).test(n)}function formatId(n){return new RegExp("^[a-f0-9]{64}i\\d+$").test(n)?n:(console.error("Invalid ID format:",n),null)}function formatURL(n){if(n.startsWith(BASE_ORDINALS_URL))return n;const r=new RegExp(`^${BASE_ORDINALS_URL}${BASE_ORDINALS_URL}(.+)`),t=n.match(r);return t&&t[1]?BASE_ORDINALS_URL+t[1]:n.match(/^[a-f0-9]{64}i\d+$/)?BASE_ORDINALS_URL+n:n}function toFullUrl(n){return n?BASE_ORDINALS_URL+formatId(n):null}function extractIdFromUrl(n){return isValidOrdinalsUrl(n)?n.replace(BASE_ORDINALS_URL,""):(console.error("Invalid Ordinals URL:",n),null)}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


class UnifiedSequencerSettings {
    constructor() {
        this.observers = [];
        this.settings = {
            masterSettings: {
                projectName: "New Audx Project",
                projectBPM: 120,
                currentSequence: 0,
                channelURLs: new Array(16).fill(""),
                trimSettings: Array.from({ length: 16 }, () => ({ start: 0.01, end: 100, length: 0 })),
                projectChannelNames: new Array(16).fill(""),
                projectSequences: this.initializeSequences(16, 16, 64)
            }
        };
        this.checkSettings = this.checkSettings.bind(this);
        this.clearMasterSettings = this.clearMasterSettings.bind(this);
    }

    exportSettings() {
        console.log("exportSettings entered");
        const exportedSettings = JSON.parse(JSON.stringify(this.settings.masterSettings));
        for (let sequenceKey in exportedSettings.projectSequences) {
            const sequence = exportedSettings.projectSequences[sequenceKey];
            for (let channelKey in sequence) {
                const channel = sequence[channelKey];
                const activeSteps = [];
                channel.steps.forEach((step, index) => {
                    if (step) activeSteps.push(index + 1);
                });
                channel.steps = activeSteps;
            }
        }
        const jsonString = JSON.stringify(exportedSettings);
        console.log("[exportSettings] Exported Settings:", jsonString);
        return jsonString;
    }

    isValidIndex(index) {
        console.log("isValidIndex entered");
        return index >= 0 && index < 16;
    }

    loadSettings(settings) {
        console.log("[internalPresetDebug] loadSettings entered[loadSettings] URL storage after loading:", this.settings.masterSettings.channelURLs);
        try {
            console.log("[internalPresetDebug] Received JSON Settings:", settings);
            const parsedSettings = typeof settings === "string" ? JSON.parse(settings) : settings;
            console.log("[internalPresetDebug] Parsed Settings:", parsedSettings);
            this.settings.masterSettings.channelURLs = parsedSettings.channelURLs ? parsedSettings.channelURLs.map((url) => formatURL(url)) : [];
            this.settings.masterSettings.projectName = parsedSettings.projectName;
            this.settings.masterSettings.projectBPM = parsedSettings.projectBPM;
            this.settings.masterSettings.trimSettings = parsedSettings.trimSettings;
            this.settings.masterSettings.projectChannelNames = parsedSettings.projectChannelNames;
            console.log("[internalPresetDebug] Updated masterSettings with full URLs:", this.settings.masterSettings);
            if (parsedSettings.projectSequences) {
                for (let sequenceKey in parsedSettings.projectSequences) {
                    let sequence = parsedSettings.projectSequences[sequenceKey];
                    for (let channelKey in sequence) {
                        let channel = sequence[channelKey];
                        const steps = new Array(64).fill(false);
                        channel.steps.forEach(step => {
                            if (step >= 1 && step <= 64) steps[step - 1] = true;
                        });
                        channel.steps = steps;
                    }
                }
            }
            this.settings.masterSettings = parsedSettings;
            console.log("[internalPresetDebug] Master settings after update:", this.settings.masterSettings);
            this.updateAllLoadSampleButtonTexts();
            this.notifyObservers();
        } catch (error) {
            console.error("[internalPresetDebug] Error loading settings:", error);
        }
    }

    addChannelURL(index, url) {
        if (index >= 0 && index < this.settings.masterSettings.channelURLs.length) {
            console.log(`[addChannelURL] Adding URL to channel ${index}: ${url}`);
            this.settings.masterSettings.channelURLs[index] = url;
            this.notifyObservers();
        } else {
            console.error(`[addChannelURL] Invalid channel index: ${index}`);
        }
    }

    getChannelURL(index) {
        if (index >= 0 && index < this.settings.masterSettings.channelURLs.length) {
            console.log(`[getChannelURL] Retrieving URL from channel ${index}: ${this.settings.masterSettings.channelURLs[index]}`);
            return this.settings.masterSettings.channelURLs[index];
        } else {
            console.error(`[getChannelURL] Invalid channel index: ${index}`);
            return null;
        }
    }

    getProjectUrlforChannel(index) {
        console.log("getProjectUrlforChannel entered");
        return this.settings.masterSettings.channelURLs[index];
    }

    setChannelURLs(urls) {
        console.log("setProjectURLs entered");
        this.settings.masterSettings.channelURLs = urls;
        console.log("[setChannelURLs] Channel URLs set:", urls);
        this.updateAllLoadSampleButtonTexts();
    }

    setProjectName(name) {
        console.log("setProjectName entered");
        this.settings.masterSettings.projectName = name;
        console.log(`[setProjectName] Project name set to: ${name}`);
    }

    clearMasterSettings() {
        console.log("[clearMasterSettings] Current masterSettings before clearing:", this.settings.masterSettings);
        this.settings.masterSettings = {
            projectName: "",
            projectBPM: 120,
            currentSequence: 0,
            channelURLs: new Array(16).fill(""),
            trimSettings: Array.from({ length: 16 }, () => ({ start: 0.01, end: 100, length: 0 })),
            projectChannelNames: new Array(16).fill(""),
            projectSequences: this.initializeSequences(16, 16, 64)
        };
        console.log("[clearMasterSettings] Master settings cleared.");
    }

    initializeSequences(numSequences, numChannels, numSteps) {
        console.log("initializeSequences entered", numSequences, numChannels, numSteps);
        let sequences = {};
        for (let i = 0; i < numSequences; i++) {
            sequences[`Sequence${i}`] = this.initializeChannels(numChannels, numSteps);
        }
        return sequences;
    }

    initializeChannels(numChannels, numSteps) {
        console.log("initializeChannels entered", numChannels, numSteps);
        let channels = {};
        for (let i = 0; i < numChannels; i++) {
            channels[`ch${i}`] = {
                steps: new Array(numSteps).fill(false),
                mute: false,
                url: ""
            };
        }
        return channels;
    }

    initializeTrimSettings(numChannels) {
        console.log("initializeTrimSettings entered");
        if (channelIndex < 1) console.log("initializeTrimSettings", numChannels);
        return Array.from({ length: numChannels }, () => ({ start: 0, end: 100, length: 0 }));
    }

    updateTrimSettingsUI(settings) {
        console.log("Trim settings UI entered and updated:", settings);
        settings.forEach((setting, index) => {
            const startSlider = document.getElementById(`start-slider-${index}`);
            const endSlider = document.getElementById(`end-slider-${index}`);
            if (startSlider && endSlider) {
                startSlider.value = setting.start;
                endSlider.value = setting.end;
            }
        });
    }

    addObserver(observer) {
        console.log("addObserver", observer);
        this.observers.push(observer);
    }

    notifyObservers() {
        console.log("notifyObservers");
        this.observers.forEach(observer => observer(this.settings));
    }

    setTrimSettings(index, start, end) {
        console.log("setTrimSettings entered");
        if (index < 1) console.log("setTrimSettings", index, start, end);
        if (this.isValidIndex(index)) {
            const trimSetting = this.settings.masterSettings.trimSettings[index];
            if (trimSetting) {
                Object.assign(trimSetting, { start: start, end: end });
            } else {
                console.error(`Trim settings not found for channel index: ${index}`);
            }
        } else {
            console.error(`Invalid channel index: ${index}`);
        }
    }

    getTrimSettings(index) {
        console.log("getTrimSettings entered");
        if (index < 1) console.log("getTrimSettings", index);
        return this.settings.masterSettings.trimSettings[index] || { start: 0.01, end: 100 };
    }
    
    updateTrimSettingsUI(settings) {
        console.log("updateTrimSettingsUI entered", settings);
        console.log("Trim settings UI updated:", settings);
        settings.forEach((setting, index) => {
            const startSlider = document.getElementById(`start-slider-${index}`);
            const endSlider = document.getElementById(`end-slider-${index}`);
            if (startSlider && endSlider) {
                startSlider.value = setting.start;
                endSlider.value = setting.end;
            }
        });
    }
    
    setProjectName(index, name) {
        console.log("setProjectName entered");
        if (index < 1) console.log("setProjectName", index, name);
        this.settings.masterSettings.projectName[index] = name;
        this.notifyObservers();
    }
    
    setCurrentSequence(sequence) {
        console.log("[SeqDebug] setCurrentSequence entered with: ", sequence);
        this.settings.masterSettings.currentSequence = sequence;
        console.log(`[SeqDebug] [setCurrentSequence] currentSequence set to: ${sequence}`);
        console.log(`[SeqDebug] [setCurrentSequence] Object currentSequence set to: ${this.settings.masterSettings.currentSequence}`);
    }
    getCurrentSequence() {
        console.log("getCurrentSequence entered");
        return this.settings.masterSettings.currentSequence;
    }
    
    getSequenceSettings(sequenceIndex) {
        console.log("getSequenceSettings entered");
        const sequenceKey = `Sequence${sequenceIndex}`;
        return this.settings.masterSettings.projectSequences[sequenceKey];
    }
    
    setSequenceSettings(sequenceIndex, settings) {
        console.log("setSequenceSettings entered");
        const sequenceKey = `Sequence${sequenceIndex}`;
        this.settings.masterSettings.projectSequences[sequenceKey] = settings;
    }
    
    getSettings(key) {
        console.log("getSettings entered", key);
        if (key === "masterSettings") {
            console.log("[getSettings] Retrieved all masterSettings:", this.settings.masterSettings);
            return this.settings.masterSettings;
        }
        if (key) {
            const value = this.settings.masterSettings[key];
            console.log(`[getSettings] Retrieved setting for key '${key}':`, value);
            return value;
        }
        console.log("[getSettings] Retrieved all settings:", this.settings);
        return this.settings;
    }
    
    checkSettings() {
        console.log("checkSettings entered");
        console.log("[checkSettings] Current masterSettings:", this.settings.masterSettings);
        return this.settings.masterSettings;
    }
    updateProjectSequencesUI() {
        console.log("updateProjectSequencesUI entered");
        channelIndex < 1 && console.log("updateProjectSequencesUI");
        this.getSettings("projectSequences").forEach((sequence, index) => {
            updateSequenceUI(index, sequence);
        });
    }
    
    updateStepState(sequenceIndex, channelIndex, stepIndex, state) {
        console.log("updateStepState entered");
        if (channelIndex < 1) console.log(`[updateStepState] Called with Sequence: ${sequenceIndex}, Channel: ${channelIndex}, Step: ${stepIndex}, State: ${state}`);
        const sequence = this.settings.masterSettings.projectSequences[`Sequence${sequenceIndex}`];
        const channel = sequence && sequence[`ch${channelIndex}`];
        if (channel && stepIndex < channel.steps.length) {
            channel.steps[stepIndex] = state;
        } else {
            console.error("Invalid sequence, channel, or step index in updateStepState");
        }
    }
    
    getStepState(sequenceIndex, channelIndex, stepIndex) {
        console.log("getStepState entered");
        if (channelIndex < 1) console.log(`[getStepState] Called with Sequence: ${sequenceIndex}, Channel: ${channelIndex}, Step: ${stepIndex}`);
        const sequence = this.settings.masterSettings.projectSequences[`Sequence${sequenceIndex}`];
        const channel = sequence && sequence[`ch${channelIndex}`];
        return channel && stepIndex < channel.steps.length ? channel.steps[stepIndex] : (console.error("Invalid sequence, channel, or step index in getStepState"), null);
    }
    
    updateSetting(key, value, channelIndex = null) {
        console.log("updateSetting entered");
        if (channelIndex < 1) console.log(`[updateSetting] Called with key: ${key}, value: ${value}, channelIndex: ${channelIndex}`);
        if (channelIndex !== null && Array.isArray(this.settings.masterSettings[key])) {
            this.settings.masterSettings[key][channelIndex] = value;
        } else if (key in this.settings.masterSettings) {
            this.settings.masterSettings[key] = value;
        } else {
            console.error(`Setting ${key} does not exist in masterSettings`);
        }
    }
    
    updateSampleDuration(duration, channelIndex) {
        console.log("updateSampleDuration entered");
        if (channelIndex < 1) console.log(`[updateSampleDuration] Called with duration: ${duration}, channelIndex: ${channelIndex}`);
        if (this.isValidIndex(channelIndex)) {
            this.settings.masterSettings.trimSettings[channelIndex].length = duration;
        } else {
            console.error(`Invalid channel index: ${channelIndex}`);
        }
    }
    
    getBPM() {
        return this.settings.masterSettings.projectBPM;
    }
    
    setBPM(bpm) {
        this.settings.masterSettings.projectBPM = bpm;
    }

    setProjectChannelName(channelIndex, name) {
        console.log("setProjectChannelName entered");
        if (this.isValidIndex(channelIndex)) {
            if (this.settings.masterSettings.projectChannelNames[channelIndex] !== name) {
                this.settings.masterSettings.projectChannelNames[channelIndex] = name;
                console.log(`[setChannelName] Channel ${channelIndex} name set to: ${name}`);
                this.notifyObservers();
            }
        } else {
            console.error(`[setChannelName] Invalid channel index: ${channelIndex}`);
        }
    }
    
    setProjectSequences(sequences) {
        console.log("setProjectSequences entered");
        this.settings.masterSettings.projectSequences = sequences;
        console.log("[setProjectSequences] Project sequences set:", sequences);
        console.log("[setProjectSequences] currentSequence set to:", this.settings.masterSettings.currentSequence);
    }

    ensureArrayLength(array, desiredLength, defaultValue) {
        console.log("ensureArrayLength entered");
        for (; array.length < desiredLength;) {
            array.push(defaultValue);
        }
    }
    
    updateAllLoadSampleButtonTexts() {
        console.log("updateAllLoadSampleButtonTexts entered");
        document.querySelectorAll(".channel").forEach((element, index) => {
            const loadSampleButton = element.querySelector(".load-sample-button");
            if (loadSampleButton) {
                this.updateLoadSampleButtonText(index, loadSampleButton);
            }
        });
    }
    
    updateLoadSampleButtonText(channelIndex, buttonElement) {
        console.log("updateLoadSampleButtonText entered");
        let buttonText = "Load New Audional";
        const channelName = this.settings.masterSettings.projectChannelNames[channelIndex];
        const channelURL = this.settings.masterSettings.channelURLs[channelIndex];
        if (channelName) {
            buttonText = channelName;
        } else if (channelURL) {
            const parts = channelURL.split("/");
            buttonText = parts[parts.length - 1];
        }
        buttonElement.textContent = buttonText;
    }
    updateProjectNameUI(projectName) {
        console.log("Project name UI entered and updated:", projectName);
        const projectNameElement = document.getElementById("project-name");
        if (projectNameElement) {
            projectNameElement.value = projectName || "AUDX Project";
            console.log("Project name UI updated:", projectName);
        }
    }
    
    updateBPMUI(bpm) {
        const bpmSlider = document.getElementById("bpm-slider");
        const bpmDisplay = document.getElementById("bpm-display");
        if (bpmSlider && bpmDisplay) {
            bpmSlider.value = bpm;
            bpmDisplay.textContent = bpm;
            console.log("BPM UI updated:", bpm);
        }
    }
    updateProjectURLsUI(urls) {
        console.log("Project URLs UI entered and updated:", urls);
        urls.forEach((url, index) => {
            const urlInputElement = document.getElementById(`url-input-${index}`);
            if (urlInputElement) {
                urlInputElement.value = url;
            }
        });
    }
    
    updateProjectChannelNamesUI(names) {
        console.log("Project URL names UI entered and updated:", names);
        names.forEach((name, index) => {
            const urlNameElement = document.getElementById(`url-name-${index}`);
            if (urlNameElement) {
                urlNameElement.textContent = name;
            }
        });
    }
    ensureArrayLength(array, desiredLength) {
        for (; array.length < desiredLength;) {
            array.push(this.getDefaultArrayElement());
        }
    }
    
    getDefaultArrayElement() {
        return {
            start: 0.01,
            end: 100,
            length: 0
        };
    }
}

window.unifiedSequencerSettings=new UnifiedSequencerSettings;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let currentTrimmerInstance=null,currentTrimmerChannelIndex=null;function updateAudioTrimmerWithBufferHelper(e,r){if(console.log("updateAudioTrimmerWithBufferHelper entered"),audioBuffers.has(e)){updateAudioTrimmerWithBuffer(audioBuffers.get(e),r)}else console.error(`Audio buffer not found for URL: ${e}`)}function updateAudioTrimmerWithBuffer(e){console.log("updateAudioTrimmerWithBuffer entered"),currentTrimmerInstance&&(currentTrimmerInstance.setAudioBuffer(e),currentTrimmerInstance.drawWaveform(),console.log(" updateDimmedAreas method called from updateaudioTrimmerWithBuffer"),currentTrimmerInstance.updateSliderValues(),currentTrimmerInstance.updateDimmedAreas())}function playTrimmedAudioForChannel(e){console.log("playTrimmedAudioForChannel entered"),currentTrimmerInstance&&currentTrimmerChannelIndex===e?currentTrimmerInstance.playTrimmedAudio():console.error("No active trimmer instance for the channel or channel index mismatch")}function stopAudioForChannel(e){currentTrimmerInstance&&currentTrimmerInstance.channelIndex===e?currentTrimmerInstance.stopAudio():console.error("No active trimmer instance for the channel or channel index mismatch")}document.addEventListener("DOMContentLoaded",(function(){}));
class AudioTrimmer{constructor(t){console.log("[Class Functions] constructor",{channelIndex:t}),this.channelIndex=t,this.audioContext=new(window.AudioContext||window.webkitAudioContext),this.audioBuffer=null,this.isPlaying=!1,this.isLooping=!1,this.initializeSliderTrack(t);const e=getTrimSettings(this.channelIndex);console.log("getSettings read into trimSettings in AudioTrimmer class constructor",e),this.startSliderValue=e.startSliderValue,this.endSliderValue=e.endSliderValue,console.log("startSliderValue and endSliderValue in AudioTrimmer class constructor",this.startSliderValue,this.endSliderValue),this.displayTimeout=null}initializeSliderTrack(){this.sliderTrack=document.querySelector(".slider-track"),this.sliderTrack||console.error("Slider track not found")}updateTrimmedSampleDuration(){const t=this.startSliderValue,e=this.endSliderValue;this.trimmedSampleDuration=Math.max(0,e-t),this.debounceDisplayValues()}getStartSliderValue(){return this.startSliderValue}getEndSliderValue(){return this.endSliderValue}sliderValueToTimecode(t,e){return t/100*e}debounceDisplayValues(){this.displayTimeout&&clearTimeout(this.displayTimeout),this.displayTimeout=setTimeout((()=>this.displayValues()),300)}displayValues(){console.log("Start Slider Value:",this.startSliderValue),console.log("End Slider Value:",this.endSliderValue),console.log("Trimmed Sample Duration:",this.trimmedSampleDuration)}setAudioBuffer(t){console.log("[Class Functions] setAudioBuffer",{audioBuffer:t}),this.audioBuffer=t,this.drawWaveform(),console.log(" updateDimmedAreas method called from setAudioBuffer"),this.updateDimmedAreas(),this.updateSliderValues()}drawWaveform(){if(console.log("[Class Functions] drawWaveform"),!this.audioBuffer)return void console.log("[Class Functions] drawWaveform - No audio buffer");const t=this.waveformCanvas.width,e=this.waveformCanvas.height,i=this.audioBuffer.getChannelData(0),s=Math.ceil(i.length/t),o=e/2;this.ctx.clearRect(0,0,t,e),this.ctx.beginPath();for(let e=0;e<t;e++){const{min:t,max:a}=this.getMinMax(i,e*s,s);this.ctx.moveTo(e,o*(1+t)),this.ctx.lineTo(e,o*(1+a))}this.ctx.stroke()}async initialize(){console.log("[Class Functions] initialize");let t=!0;["ordinalIdInput","loadSampleButton","waveformCanvas","playbackCanvas","trimmerPlayButton","trimmerStopButton","loopButton","startDimmed","endDimmed","startSlider","endSlider"].forEach((e=>{this[e]=document.getElementById(e),this[e]||(console.error(`[Class Functions] initialize - Element not found: ${e}`),t=!1)})),t?(this.ctx=this.waveformCanvas.getContext("2d"),this.addEventListeners(),console.log(" updateDimmedAreas method called from initialize"),this.updateDimmedAreas(),this.updateSliderValues()):(console.log("[Class Functions] initialize - Waiting for elements to be available"),setTimeout((()=>this.initialize()),500));const e=getTrimSettings(this.channelIndex);this.startSlider.value=e.startSliderValue,this.endSlider.value=e.endSliderValue,this.isLooping=e.isLooping,this.updateLoopButtonState(),this.updateDimmedAreas(),this.updateSliderValues(),this.playbackCtx=this.playbackCanvas.getContext("2d"),this.playbackCtx.fillStyle="red"}updateSliderValues(){const t=this.startSliderValue/100*this.sliderTrack.offsetWidth,e=this.endSliderValue/100*this.sliderTrack.offsetWidth;this.startSlider.style.left=`${t}px`,this.endSlider.style.left=`${e}px`,this.updateDimmedAreas(),console.log("updateDimmedAreas method called from updateSliderValues"),this.updateTrimmedSampleDuration(),this.debounceDisplayValues()}updateDimmedAreas(){console.log("[Class Functions] updateDimmedAreas function entered into");const t=this.startSliderValue,e=this.endSliderValue,i=`${t}%`,s=100-e+"%";this.startDimmed.style.width=i,this.startDimmed.style.left="0",this.endDimmed.style.width=s,this.endDimmed.style.left=`${e}%`}addEventListeners(){console.log("[Class Functions] addEventListeners"),this.boundPlayTrimmedAudio=this.playTrimmedAudio.bind(this),this.boundStopAudio=this.stopAudio.bind(this),this.trimmerPlayButton.removeEventListener("click",this.boundPlayTrimmedAudio),this.trimmerStopButton.removeEventListener("click",this.boundStopAudio),this.trimmerPlayButton.addEventListener("click",this.boundPlayTrimmedAudio),this.trimmerStopButton.addEventListener("click",this.boundStopAudio),this.loopButton.addEventListener("click",this.toggleLoop.bind(this));const t=(t,e)=>{const i=e?this.startSlider:this.endSlider;if(console.log("[Slider Mouse Down] Slider: "+(e?"Start":"End")),!i)return void console.error("Slider element is undefined");const s=t.clientX-i.getBoundingClientRect().left;document.onmousemove=t=>{if(!this.sliderTrack)return void console.error("Slider track is undefined");let o=t.clientX-s-this.sliderTrack.getBoundingClientRect().left;if(o=Math.max(0,Math.min(o,this.sliderTrack.offsetWidth-i.offsetWidth)),e){const t=this.endSlider.getBoundingClientRect().left-this.sliderTrack.getBoundingClientRect().left;o=Math.min(o,t)}else{const t=this.startSlider.getBoundingClientRect().right-this.sliderTrack.getBoundingClientRect().left;o=Math.max(o,t)}i.style.left=`${o}px`;const a=o/this.sliderTrack.offsetWidth*100;e?this.startSliderValue=a:this.endSliderValue=a;let n=unifiedSequencerSettings.settings.masterSettings.trimSettings;n[this.channelIndex]={...n[this.channelIndex],startSliderValue:this.startSliderValue,endSliderValue:this.endSliderValue},updateTrimSettingsUI(n),this.updateSliderValues()},document.onmouseup=()=>{document.onmousemove=document.onmouseup=null}};this.startSlider.addEventListener("mousedown",(e=>t(e,!0))),this.endSlider.addEventListener("mousedown",(e=>t(e,!1)))}async loadSample(){if(console.log("[Class Functions] loadSample"),this.ordinalIdInput.value)try{this.audioBuffer=await fetchAudio(`https://ordinals.com/content/${this.ordinalIdInput.value}`),this.trimSettings=getTrimSettings(this.channelIndex),this.drawWaveform(),console.log(" updateDimmedAreas method called from loadSample"),this.updateSliderValues(),this.updateDimmedAreas()}catch(t){console.error("Error loading audio:",t)}}getMinMax(t,e,i){let s=1,o=-1;for(let a=0;a<i;a++){const i=t[e+a];i<s&&(s=i),i>o&&(o=i)}return{min:s,max:o}}getIsLooping(){return this.isLooping}setIsLooping(t){this.isLooping=t,this.updateLoopButtonState()}updateLoopButtonState(){console.log(`[updateLoopButtonState] isLooping: ${this.isLooping}`),this.loopButton&&(this.isLooping?(this.loopButton.classList.add("on"),this.loopButton.classList.remove("off")):(this.loopButton.classList.add("off"),this.loopButton.classList.remove("on")))}playTrimmedAudio(){if(console.log("[playTrimmedAudio] [Class Functions] playTrimmedAudio"),this.isPlaying)return void console.log("[playTrimmedAudio] Audio is already playing, not starting new playback");if(!this.audioBuffer)return void console.error("[playTrimmedAudio] No audio buffer loaded");this.isPlaying=!0,console.log("[playTrimmedAudio] isPlaying set to true, starting new playback");const t=this.sliderValueToTimecode(this.startSliderValue,this.audioBuffer.duration);this.startTime=this.audioContext.currentTime-t;const e=this.sliderValueToTimecode(this.startSliderValue,this.audioBuffer.duration),i=this.sliderValueToTimecode(this.endSliderValue,this.audioBuffer.duration);this.sourceNode&&this.sourceNode.disconnect(),this.sourceNode=this.audioContext.createBufferSource(),this.sourceNode.buffer=this.audioBuffer,this.sourceNode.connect(this.audioContext.destination),this.sourceNode.loop=this.isLooping,this.isLooping&&(this.sourceNode.loopStart=e,this.sourceNode.loopEnd=i),this.sourceNode.start(0,e,i-e),console.log("[playTrimmedAudio] Playback started"),this.animatePlayback(),this.sourceNode.onended=()=>{this.isPlaying=!1,this.isLooping?this.playTrimmedAudio():(console.log("[playTrimmedAudio] Playback ended, isPlaying set to false"),this.animationFrameRequest&&cancelAnimationFrame(this.animationFrameRequest))}}stopAudio(){console.log("[Class Functions] stopAudio"),this.setIsLooping(!1),this.isPlaying&&this.sourceNode&&(this.sourceNode.stop(),this.sourceNode.disconnect(),this.sourceNode=null,this.isPlaying=!1),this.animationFrameRequest&&cancelAnimationFrame(this.animationFrameRequest)}toggleLoop(){console.log("[Class Functions] toggleLoop"),this.isLooping=!this.isLooping,this.updateLoopButtonState(),this.isPlaying&&this.playTrimmedAudio()}getCurrentPlaybackPosition(){if(!this.isPlaying)return 0;const t=this.sliderValueToTimecode(this.startSliderValue,this.audioBuffer.duration);return(this.audioContext.currentTime-this.startTime)%this.audioBuffer.duration+t}updatePlaybackCanvas(){const t=this.audioContext.currentTime-this.startTime,e=this.sliderValueToTimecode(this.startSliderValue,this.audioBuffer.duration),i=this.sliderValueToTimecode(this.endSliderValue,this.audioBuffer.duration)-e,s=(t-e)%i;if(s<0||s>i)return;const o=this.playbackCanvas.width,a=this.playbackCanvas.height,n=this.startSliderValue/100*o,l=n+s/i*(this.endSliderValue/100*o-n);this.playbackCtx.clearRect(0,0,o,a),this.playbackCtx.beginPath(),this.playbackCtx.moveTo(l,0),this.playbackCtx.lineTo(l,a),this.playbackCtx.strokeStyle="#FF0000",this.playbackCtx.lineWidth=2,this.playbackCtx.stroke()}animatePlayback(){this.isPlaying?(console.log("[animatePlayback] Animation frame requested."),this.updatePlaybackCanvas(),this.animationFrameRequest=requestAnimationFrame((()=>this.animatePlayback()))):console.log("[animatePlayback] Animation stopped. 'isPlaying' is false.")}}
function getChannelURL(index) {
    console.log(`[getChannelURL] URL for channel ${index}:`, this.getChannelURL(index));

    // Ensure that we are accessing the 'channelURLs' array correctly
    if (index >= 0 && index < window.unifiedSequencerSettings.settings.masterSettings.channelURLs.length) {
        console.log(`Retrieving URL for channel index: ${index}`);
        return window.unifiedSequencerSettings.settings.masterSettings.channelURLs[index];
    } else {
        console.error(`Invalid channel index: ${index}`);
        return null; // Or handle the error as needed
    }
}

function updateTrimSettingsUI(e){console.log("debugGlobalObjectToUI - entered"),console.log("{debugGlobalObjectToUI} updateTrimSettingsUI: updating with trimSettings",e),console.log("Trim settings UI updated:",e),e.forEach(((e,t)=>{const n=document.getElementById(`start-slider-${t}`),o=document.getElementById(`end-slider-${t}`);n&&o&&(n.value=e.startSliderValue,o.value=e.endSliderValue)}))}function updateProjectChannelNamesUI(e){console.log("debugGlobalObjectToUI - entered"),console.log("{debugGlobalObjectToUI} updateProjectChannelNamesUI: updating with URL names",e),console.log("Project URL names UI updated:",e),e.forEach(((e,t)=>{const n=document.getElementById(`url-name-${t}`);n&&(n.textContent=e)}))}function updateBPMUI(e){console.log("debugGlobalObjectToUI - entered");const t=document.getElementById("bpm-slider"),n=document.getElementById("bpm-display");t&&n&&(t.value=e,n.textContent=e)}function updateProjectNameUI(e){console.log("debugGlobalObjectToUI - entered");const t=document.getElementById("project-name");t&&(t.value=e)}function updateSpecificStepUI(e,t,n){console.log("debugGlobalObjectToUI - entered");const o=`Sequence${e}-ch${t}-step-${n}`;console.log(`Looking for step button with ID: ${o}`);const c=document.getElementById(o);if(c){let s=window.unifiedSequencerSettings.getStepState(e,t,n);console.log(`[updateSpecificStepUI] Step button found: Sequence ${e}, Channel ${t}, Step ${n}, Current State: ${s}`),s?(c.classList.add("selected"),console.log(`[updateSpecificStepUI] Added 'selected' class to step button with ID: ${o}`)):(c.classList.remove("selected"),console.log(`[updateSpecificStepUI] Removed 'selected' class from step button with ID: ${o}`))}else console.error(`Step button not found for the given IDs: ${o}`)}function getProjectSequences(){console.log("debugGlobalObjectToUI - entered");window.unifiedSequencerSettings;return window.unifiedSequencerSettings.getSettings("projectSequences")}function setGlobalProjectURLs(e){console.log("debugGlobalObjectToUI - entered"),window.unifiedSequencerSettings.setProjectURLs(e),console.log("[setGlobalProjectURLs] Project URLs updated:",e)}

// Updated to include totalSampleDuration in the setting logic
function setTrimSettings(channelIndex, startValue, endValue, totalDuration) {
    console.log("setTrimSettings entered", channelIndex, startValue, endValue, totalDuration);
    if (this.isValidIndex(channelIndex)) {
        const trimSettings = this.settings.masterSettings.trimSettings[channelIndex];
        if (trimSettings) {
            Object.assign(trimSettings, {
                startSliderValue: startValue,
                endSliderValue: endValue,
                totalSampleDuration: totalDuration
            });
        } else {
            console.error(`Trim settings not found for channel index: ${channelIndex}`);
        }
    } else {
        console.error(`Invalid channel index: ${channelIndex}`);
    }
}

function updateProjectSequencesUI(e){console.log("debugGlobalObjectToUI - entered"),console.log("{debugGlobalObjectToUI} [updateProjectSequencesUI] updateProjectSequencesUI: updating with sequences",e),console.log(`[updateProjectSequencesUI] Total sequences to process: ${Object.keys(e).length}`),Object.keys(e).forEach((t=>{const n=e[t];console.log(`[updateProjectSequencesUI] Processing sequence: ${t}`),Object.keys(n).forEach((e=>{const o=n[e].steps;Array.isArray(o)?o.forEach(((n,o)=>{const c=`${t}-${e}-step-${o}`,s=document.getElementById(c);s&&(!0===n?s.classList.contains("selected")||s.classList.add("selected"):s.classList.contains("selected")&&(console.log(`[updateProjectSequencesUI] Removing 'selected' class from stepControl: ${c}`),s.classList.remove("selected")))})):console.log(`[updateProjectSequencesUI] Steps data for channel ${e} in sequence ${t} is not an array`)}))}))}function getTrimSettings(e){return console.log("debugGlobalObjectToUI - entered"),window.unifiedSequencerSettings.getTrimSettings(e)}document.addEventListener("DOMContentLoaded",(()=>{for(let e=0;e<16;e++)for(let t=0;t<16;t++){let n=document.querySelector(`#channel-${t}-steps-container`);n||(n=document.createElement("div"),n.id=`channel-${t}-steps-container`,n.classList.add("steps-container"),document.body.appendChild(n)),n.innerHTML="";for(let o=0;o<64;o++){const c=document.createElement("button");c.classList.add("step-button"),c.id=`Sequence${e}-ch${t}-step-${o}`,c.addEventListener("click",(()=>{let n=window.unifiedSequencerSettings.getStepState(e,t,o);console.log(`[updateSpecificStepUI] [getStepState applied] Step button clicked: Sequence ${e}, Channel ${t}, Step ${o}, Current State: ${n}`),window.unifiedSequencerSettings.updateStepState(e,t,o,!n),console.log(`[updateSpecificStepUI] Step button clicked: Sequence ${e}, Channel ${t}, Step ${o}, New State: ${!n}`),updateSpecificStepUI(e,t,o)})),n.appendChild(c)}}}));
const mainContainer=document.getElementById("app"),channelTemplateContainer=document.querySelector(".channel-template"),channelTemplate=channelTemplateContainer.querySelector(".channel"),quickPlayButtons=[];let currentActiveIndex=null;const quickPlayContainer=document.createElement("div");function setActiveSequence(e){null!==currentActiveIndex&&currentActiveIndex!==e&&(console.log(`Deactivating previously active sequence ${currentActiveIndex}`),quickPlayButtons[currentActiveIndex].classList.add("inactive")),quickPlayButtons[e].classList.remove("inactive"),quickPlayButtons.forEach((t=>{t!==quickPlayButtons[e]&&t.classList.add("inactive")})),currentActiveIndex=e}function updateActiveQuickPlayButton(){quickPlayButtons.forEach((e=>{e.classList.remove("active")}));quickPlayButtons[currentSequence].classList.add("active")}function insertQuickPlayButtons(){const e=document.getElementById("continuous-play"),t=document.getElementById("quick-play-button");if(e&&t)for(let n=0;n<16;n++){const c=createQuickPlayButton(n);e.parentNode.insertBefore(c,t)}else console.log("QUICKPLAY BUTTONS TEMPORARILY REMOVED UNTIL THEY CAN BE FIXED")}function loadAndDisplaySequence(e){currentSequence=e,console.log(`[loadAndDisplaySequence] currentSequence updated to:  ${e}`),loadSequence(e),document.getElementById("current-sequence-display").textContent=`Sequence ${currentSequence}`,updateActiveQuickPlayButton()}function createQuickPlayButton(e){const t=document.createElement("div");t.classList.add("quick-play-button","tooltip"),t.dataset.sequenceIndex=e,t.innerHTML=e;const n=document.createElement("span");return n.classList.add("tooltiptext"),n.innerHTML=`Quick Load Sequence ${e}<br><br>Right click to change button colour.`,t.appendChild(n),quickPlayButtons.push(t),t.addEventListener("click",(function(){setActiveSequence(e)})),t.addEventListener("contextmenu",(function(e){e.preventDefault(),showColorPicker(e,t)})),t}quickPlayContainer.id="quickplay-container",quickPlayContainer.style.display="flex",quickPlayContainer.style.justifyContent="center",quickPlayContainer.style.marginBottom="20px",insertQuickPlayButtons(),quickPlayButtons.forEach((e=>{e.addEventListener("click",(()=>{loadAndDisplaySequence(parseInt(e.dataset.sequenceIndex,10))}))})),quickPlayButtons.forEach((e=>e.classList.add("inactive")));for(let e=0;e<=15;e++){let t=channelTemplate.cloneNode(!0);t.id=`channel-${e}`,mainContainer.appendChild(t)}channelTemplateContainer.remove();const setupCompleteEvent=new Event("setupComplete");window.dispatchEvent(setupCompleteEvent);
let isCopyPasteEvent=!1,copiedData=null;function validateAndUpdateUI(e){isValidSequence(window.unifiedSequencerSettings.getSequenceSettings(e))?(updateUIForSequence(e),console.log(`[copyPasteDebug] UI updated for sequence index: ${e}`)):console.error(`[copyPasteDebug] Invalid sequence settings for sequence index: ${e}`)}function isValidSequence(e){if(!e||"object"!=typeof e)return console.log("[copyPasteDebug] Sequence is not an object."),!1;for(let t in e){if(!isValidChannel(e[t]))return console.log(`[copyPasteDebug] Invalid channel data in sequence: ${t}`),!1}return console.log("[copyPasteDebug] Sequence is valid for paste."),!0}function isValidChannel(e){return e&&Array.isArray(e.steps)&&"boolean"==typeof e.mute&&"string"==typeof e.url}function showConfirmationTooltip(e){const t=document.createElement("div");t.innerText=e,t.style.position="absolute",t.style.background="#333",t.style.color="white",t.style.padding="5px",t.style.borderRadius="5px",t.style.top="50%",t.style.left="50%",t.style.transform="translate(-50%, -50%)",t.style.zIndex="1000",document.body.appendChild(t),setTimeout((()=>{t.remove()}),3e3)}document.addEventListener("DOMContentLoaded",(function(){const e=document.getElementById("copy-sequence-settings"),t=document.getElementById("paste-button");e&&(console.log("[copyPasteDebug] Copy button clicked."),e.addEventListener("click",(function(){const e=window.unifiedSequencerSettings.getCurrentSequence(),n=window.unifiedSequencerSettings.getSequenceSettings(e);copiedData={type:"sequence",sequenceSettings:JSON.parse(JSON.stringify(n))},console.log("[copyPasteDebug] Sequence settings copied:",copiedData),t&&t.classList.add("flashing"),showConfirmationTooltip("[copyPasteDebug] Copied sequence settings. Select another sequence to paste to.")}))),t&&t.addEventListener("click",(function(){if(console.log("[copyPasteDebug] pasteButton clicked"),!copiedData||"sequence"!==copiedData.type)return void alert("No sequence data copied to paste!");const e=window.unifiedSequencerSettings.getCurrentSequence();console.log(`[copyPasteDebug] Current sequence index: ${e}`),window.unifiedSequencerSettings.setSequenceSettings(e,copiedData.sequenceSettings),console.log(`[copyPasteDebug] Sequence settings pasted to sequence index ${e}: ${JSON.stringify(copiedData)}`),updateUIForSequence(e),console.log(`[copyPasteDebug] updateUIForSequence called with sequence index: ${e}`),console.log(`[copyPasteDebug] Current sequence index according to the global object is now: ${window.unifiedSequencerSettings.getCurrentSequence()}`),this.classList.remove("flashing"),validateAndUpdateUI(e)}))}));
let totalSequenceCount=16,isContinuousPlay=!0;function initializeNewSequence(e){console.log("initializeNewSequence entered"),console.log(`[initializeNewSequence] Initializing new sequence. Current sequence: ${e}`);let n=Array(16).fill().map((()=>[null].concat(Array(64).fill(!1)))),t=e+1;console.log(`[initializeNewSequence] New sequence: ${e}`),window.unifiedSequencerSettings.setCurrentSequence(t,n),console.log(`[SeqDebug] [initializeNewSequence] newSequenceCreated ${e} ${n}`)}function loadSequence(e){console.log("loadSequence entered");let n=window.unifiedSequencerSettings.getSettings("projectSequences")[`Sequence${e}`];console.log(`[loadSequence] Loading sequence ${e}...`),"object"==typeof n?(updateUIForSequence(e),Object.entries(n).forEach((([n,t])=>{const o=parseInt(n.replace("ch",""),10);updateChannelUI(e,o,t.steps)}))):console.error(`Sequence ${e} is not an object.`,n)}function loadNextSequence(){console.log("loadNextSequence entered");let e=window.unifiedSequencerSettings.getCurrentSequence();if(e<totalSequenceCount-1){const n=e+1;console.log(`[SeqDebug] Calling handleSequenceTransition with sequence: ${n}`),handleSequenceTransition(n),updateSequenceDisplay(n)}else console.warn("You've reached the last sequence.")}function updateChannelUI(e,n,t){console.log("updateChannelUI entered"),console.log(`[SeqDebug] [updateChannelUI] Updating UI for sequence ${e} channel ${n}`);const o=document.querySelector(`.channel[data-id="Channel-${n}"]`);if(!o)return void console.error(`Channel element not found for index: ${n}`);o.querySelectorAll(`.step-button[id^="Sequence${e}-ch${n}"]`).forEach(((e,n)=>{t[n]?e.classList.add("selected"):e.classList.remove("selected")}))}function updateSequenceDisplay(e){const n=document.getElementById("current-sequence-display");n&&(n.textContent="Sequence "+e),updateActiveQuickPlayButton()}function updateUIForSequence(e){console.log("updateUIForSequence entered"),console.log(`[SeqDebug] [updateUIForSequence] Updating UI for Sequence ${e}`);const n=window.unifiedSequencerSettings.getSettings("masterSettings").projectSequences[`Sequence${e}`];console.log(`[SeqDebug] [debugging Step Button IDs] Sequence Settings for Sequence ${e}:`,n),e>=0&&e<64?channels.forEach(((t,o)=>{const c=t.querySelectorAll(".step-button"),u=t.querySelectorAll(".toggle-mute");console.log(`[SeqDebug] [debugging Step Button IDs][updateUIForSequence] Processing Channel: ${o}, Step Buttons Found: ${c.length}`),n&&n[`ch${o}`]&&n[`ch${o}`].steps?(c.forEach((e=>e.classList.remove("selected"))),u.forEach((e=>e.classList.remove("toggle-mute"))),n[`ch${o}`].steps.forEach(((e,n)=>{console.log(`[SeqDebug][debugging Step Button IDs] [updateUIForSequence] Channel: ${o}, Position: ${n}, Step State: ${e}`),e&&(c[n]?(c[n].classList.add("selected"),console.log(`[SeqDebug][debugging Step Button IDs][updateUIForSequence] Adding 'selected' class to Step Button at Position: ${n} in Channel: ${o}`)):console.error(`[SeqDebug][debugging Step Button IDs][updateUIForSequence] Step Button not found at Position: ${n} in Channel: ${o}`))}))):console.error(`[SeqDebug][debugging Step Button IDs][updateUIForSequence] Missing step data for Channel: ${o} in Sequence: ${e}`)})):console.error("[SeqDebug][debugging Step Button IDs] [updateUIForSequence] Invalid sequence number:",e)}function changeSequence(e){console.log("changeSequence entered"),currentSequence=e,onSequenceOrDataChange()}function updateStep(e,n,t){console.log("updateStep entered"),channelSettings[e][n]=t,window.unifiedSequencerSettings.updateStepState(currentSequence,e,n,t),console.log(`updateStepState called with sequence: ${currentSequence}, channelIndex: ${e}, stepIndex: ${n}, state: ${t}`)}document.addEventListener("DOMContentLoaded",(()=>{const e=document.getElementById("continuous-play");e.addEventListener("click",(()=>{isContinuousPlay=!isContinuousPlay,e.classList.toggle("selected",isContinuousPlay)}))})),window.addEventListener("setupComplete",(function(){loadAndDisplaySequence(0)})),document.getElementById("next-sequence").addEventListener("click",(function(){console.log("Next sequence button clicked."),loadNextSequence()})),document.getElementById("prev-sequence").addEventListener("click",(function(){console.log("Previous sequence button clicked.");let e=window.unifiedSequencerSettings.getCurrentSequence();if(console.log(`Current sequence before decrement: ${e}`),e>0){const n=e-1;console.log(`[SeqDebug] Calling handleSequenceTransition with sequence: ${n}`),handleSequenceTransition(n),updateSequenceDisplay(n)}else console.warn("You're already on the first sequence.")})),console.log("Initial channel settings:",window.unifiedSequencerSettings.getSettings("projectSequences"));



///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


const channelPlaybackBroadcast = new BroadcastChannel('channel_playback');

function emitMessage(type, data) {
    channelPlaybackBroadcast.postMessage({ type: type, data: data });
}

function emitBar(bar) {
    emitMessage("bar", { bar: bar });
}

function emitBeat(beat, bar) {
    emitMessage("beat", { beat: beat, bar: bar });
}

function emitPause() {
    emitMessage("pause", {});
}

function emitResume() {
    emitMessage("resume", {});
}

function emitStop() {
    emitMessage("stop", {});
}

function emitPlay() {
    emitMessage("play", {});
    emitMessage("beat", { beat: beatCount, bar: barCount });
}


////////////////////////////////////////////////////////////////////////////////////////////

function setChannelVolume(e,n){console.log("{channelSettings.js} setChannelVolume: channelIndex:",e,"volume:",n);const a=document.querySelector(`.channel[data-id="Channel-${e}"]`);a.dataset.volume=n,updateChannelVolume(a)}function updateChannelVolume(e){console.log("{channelSettings.js} updateChannelVolume: channel:",e);const n=parseFloat(e.dataset.volume);gainNodes[parseInt(e.dataset.id.split("-")[1])].gain.value=n}
function setupLoadSampleModalButton(e,t){const n=e.querySelector(".load-sample-button");n.textContent=window.unifiedSequencerSettings.settings.masterSettings.channelURLs[t],updateModalButtonText(n,t),openModal(t,n)}function openModal(e,t){const n=createModal(),o=createModalContent();n.appendChild(o),o.appendChild(createTextParagraph("Enter an Ordinal ID to load a Bitcoin Audional:"));const a=createInputField("Enter ORD ID:");o.appendChild(a),o.appendChild(createTextParagraph("Or, enter an IPFS ID for an off-chain Audional:"));const d=createInputField("Enter IPFS ID:");o.appendChild(d),addInputListeners(a,d),o.appendChild(createButton("Load Sample ID",(()=>handleLoad(e,a,d,n,t)),"loadButton","Load Audio from ID")),o.appendChild(createButton("Cancel",(()=>document.body.removeChild(n)),"cancelButton","Close this window"));const l=createExternalLinkButton("Search Ordinal Audio Files","https://ordinals.hiro.so/inscriptions?f=audio&s=genesis_block_height&o=asc","searchButton","Search for audio files (Copy and paste the Ordinal ID to load a sample");o.appendChild(l),document.body.appendChild(n)}function createModal(){const e=document.createElement("div");return e.className="loadSampleModalButton",e}function createModalContent(){const e=document.createElement("div");return e.className="loadSampleModalButton-content",e}function updateModalButtonText(e,t){const n=window.unifiedSequencerSettings.settings.masterSettings.projectChannelNames[t];e.textContent=n||`Load new audience (${t})`}function createTextParagraph(e){const t=document.createElement("p");return t.textContent=e,t.className="loadSampleModalButton-text",t}function createInputField(e){const t=document.createElement("input");return t.type="text",t.placeholder=e,t.className="loadSampleModalButton-input",t}function addInputListeners(e,t){e.addEventListener("input",(()=>{t.disabled=!!e.value})),t.addEventListener("input",(()=>{e.disabled=!!t.value}))}function createButton(e,t,n,o){const a=document.createElement("div");a.className="tooltip";const d=document.createElement("button");d.textContent=e,d.addEventListener("click",t),d.className=n,a.appendChild(d);const l=document.createElement("span");return l.className="tooltiptext",l.textContent=o,a.appendChild(l),a}function handleLoad(e,t,n,o,a){let d;if(console.log(`[HTML Debugging] [handleLoad] Called with index: ${e}`),t.value)d="https://ordinals.com/content/"+t.value;else{if(!n.value)return void console.log("[HTML Debugging] [handleLoad] No input value found.");d="https://ipfs.io/ipfs/"+n.value}d=formatURL(d),fetchAudio(d,e).then((()=>{console.log(`[HTML Debugging] [handleLoad] Audio loaded for channel ${e}: ${d}`),window.unifiedSequencerSettings.addChannelURL(e,d)})).catch((e=>{console.error(`[HTML Debugging] [handleLoad] Error loading audio for URL ${d}:`,e)})),document.body.removeChild(o),console.log(`[HTML Debugging] [handleLoad] Modal removed for channel ${e}`)}function createExternalLinkButton(e,t,n,o){const a=document.createElement("div");a.className="tooltip";const d=document.createElement("button");d.textContent=e,d.className=n,d.addEventListener("click",(()=>window.open(t,"_blank"))),a.appendChild(d);const l=document.createElement("span");return l.className="tooltiptext",l.textContent=o,a.appendChild(l),a}
window.addEventListener("DOMContentLoaded",(e=>{console.log("channelsForeach.js entered"),channels.forEach(((e,t)=>{e.dataset.id=`Channel-${t}`;const n=audioContext.createGain();n.gain.value=1,n.connect(audioContext.destination),gainNodes[t]=n;const o=e.querySelector(".mute-button");o.addEventListener("click",(()=>{console.log(`Mute button clicked for Channel-${t}`);const n=o.classList.toggle("selected");updateMuteState(e,n),updateDimState(e,t)}));const c=e.querySelector(".solo-button");c.addEventListener("click",(()=>{soloedChannels[t]=!soloedChannels[t],c.classList.toggle("selected",soloedChannels[t]),channels.forEach(((e,n)=>{t===n?updateMuteState(e,!1):updateMuteState(e,soloedChannels[t]),updateDimState(e,n)}))}));const l=e.querySelector(".clear-button");let a;e.querySelector(".clear-confirm"),l.addEventListener("click",(n=>{if(n.stopPropagation(),l.classList.contains("flashing")){e.querySelectorAll(".step-button").forEach((e=>{e.classList.remove("selected")}));let n=Array(64).fill(!1);for(let e=0;e<n.length;e++)window.unifiedSequencerSettings.updateStepState(currentSequence,t,e,n[e]);clearTimeout(a),l.classList.remove("flashing")}else l.classList.add("flashing"),a=setTimeout((()=>{l.classList.remove("flashing")}),2e3)})),document.addEventListener("click",(e=>{!l.contains(e.target)&&l.classList.contains("flashing")&&(clearTimeout(a),l.classList.remove("flashing"))}));const s=e.querySelector(".load-sample-button");function i(e){const t=document.querySelector(".custom-context-menu");t&&!t.contains(e.target)&&r()}function d(e,t){const n=document.createElement("div");return n.textContent=e,Object.assign(n.style,{padding:"5px 10px",cursor:"pointer"}),n.addEventListener("mouseenter",(()=>n.style.backgroundColor="#f0f0f0")),n.addEventListener("mouseleave",(()=>n.style.backgroundColor="lightgray")),n.addEventListener("click",t),n}function r(){const e=document.querySelector(".custom-context-menu");e&&e.remove()}function u(){const e=document.querySelector(".channel-naming-modal");e&&document.body.removeChild(e)}s.addEventListener("click",(()=>{setupLoadSampleModalButton(e,t)})),s.addEventListener("contextmenu",(e=>{console.log("Right-click on loadSampleButton"),e.preventDefault(),function(e,t,n,o,c){console.log("Creating custom context menu"),r();const l=function(e,t){const n=document.createElement("div");return n.className="custom-context-menu",Object.assign(n.style,{position:"absolute",top:`${t}px`,left:`${e}px`,backgroundColor:"lightgray",color:"black",padding:"10px",border:"1px solid #ddd",borderRadius:"5px",boxShadow:"0px 2px 5px rgba(0,0,0,0.2)"}),n}(t,n),a=d("Add User Channel Name",(()=>{!function(e){u();const t=document.createElement("div");t.className="channel-naming-modal";const n=document.createElement("input");n.type="text",n.placeholder="Give this channel a name",n.className="channel-name-input";const o=document.createElement("button");o.textContent="Submit",o.onclick=()=>{n.value&&window.unifiedSequencerSettings.setProjectChannelName(e,n.value),u()};const c=document.createElement("button");c.textContent="Cancel",c.onclick=u,t.appendChild(n),t.appendChild(o),t.appendChild(c),document.body.appendChild(t),document.addEventListener("click",(e=>{t.contains(e.target)||e.target.matches(".load-sample-button")||u()}),{capture:!0,once:!0})}(o),r()})),s=d("Copy Ordinal ID",(()=>{!function(e){const t=window.unifiedSequencerSettings.channelURLs(e);t?navigator.clipboard.writeText(t).then((()=>console.log("Full URL copied:",t))).catch((e=>console.error("Error copying URL:",e))):console.log("No URL found for channel:",e)}(o),console.log("Copy Ordinal ID clicked"),r()})),p=d("Copy Channel Settings (coming soon)",(()=>{console.log("Copy Channel Settings clicked"),r()})),g=d("Set Channel Colour",(()=>{console.log("Set Channel Colour option selected"),function(e,t){console.log("showColorPicker function called inside channelsForEach.js");const n=["#FF0000","#00FF00","#0000FF","#FFFF00","#00FFFF","#FF00FF","#808080","#FFFFFF","#FFA500","#800080","#008080","#000080","#800000","#008000","#FFC0CB","#D2691E"],o=document.createElement("div");o.style.position="absolute",o.style.display="grid",o.style.gridTemplateColumns="repeat(4, 1fr)",o.style.gap="1px";const c=n.length/4*20,l=e.clientY-c,a=e.clientX;console.log(`Color picker position - Top: ${l}px, Left: ${a}px`),o.style.top=l+"px",o.style.left=a+"px",n.forEach((e=>{const n=document.createElement("div");n.style.width="20px",n.style.height="20px",n.style.backgroundColor=e,n.addEventListener("click",(function(){console.log(`Color selected: ${e}`),t.style.backgroundColor=e,t.className=t.className.replace(/\bcolor-[^ ]+/g,""),t.classList.add(`color-${e.replace("#","")}`),o.remove()})),o.appendChild(n)})),document.body.appendChild(o),console.log("Color picker appended to the body. Check if it is visible in the DOM."),o.addEventListener("click",(function(e){e.stopPropagation()})),setTimeout((()=>{document.addEventListener("click",(function e(){console.log("Global click detected. Removing color picker."),o.remove(),document.removeEventListener("click",e)}))}),0),setTimeout((()=>{console.log("Removing color picker after 2 seconds."),o.remove()}),5e3)}(e,c),r()})),m=d("Paste Ordinal ID",(()=>{!function(e){navigator.clipboard.readText().then((t=>{if(isValidURL(t)){let n=[...window.unifiedSequencerSettings.settings.masterSettings.channelURLs];n[e]=t,window.unifiedSequencerSettings.setChannelURLs(n),console.log("Pasted full URL:",t)}else console.error("Invalid URL format.")})).catch((e=>console.error("Error pasting URL:",e)))}(o),r()})),h=d("Paste Channel Settings (coming soon)",(()=>{!function(e){navigator.clipboard.readText().then((t=>{let n=JSON.parse(t);window.unifiedSequencerSettings.setChannelSettings(e,n),console.log("Pasted Channel Settings:",n)})).catch((e=>console.error("Error pasting Channel Settings:",e)))}(o),r()}));l.appendChild(a),l.appendChild(g),l.appendChild(s),l.appendChild(m),l.appendChild(p),l.appendChild(h),document.body.appendChild(l),setTimeout((()=>{document.addEventListener("click",i,{capture:!0,once:!0})}),0)}(e,e.pageX,e.pageY,t,s)}))})),console.log("channelsForeach.js entered"),channels.forEach(((e,t)=>{}))}));
function createStepButtonsForSequence(){console.log("[createStepButtonsForSequence] [SeqDebug] entered"),channels.forEach(((e,t)=>{const n=e.querySelector(".steps-container");n.innerHTML="";let s=window.unifiedSequencerSettings.settings.masterSettings.currentSequence;for(let c=0;c<64;c++){const o=document.createElement("button");o.classList.add("step-button"),o.id=`Sequence${s}-ch${t}-step-${c}`,o.addEventListener("click",(()=>{let n=window.unifiedSequencerSettings.getStepState(s,t,c);if(window.unifiedSequencerSettings.updateStepState(s,t,c,!n),o.classList.toggle("selected")){const t=e.querySelector(".load-sample-button").className.match(/\bcolor-[^ ]+/);t?o.classList.add(t[0]):o.style.backgroundColor="var(--accent-color)"}else o.classList.remove(...o.classList),o.classList.add("step-button"),o.style.backgroundColor="";updateSpecificStepUI(s,t,c)})),n.appendChild(o)}console.log(`[createStepButtonsForSequence] Completed creating step buttons for Channel ${t} in Sequence ${s}.`)}))}document.addEventListener("DOMContentLoaded",createStepButtonsForSequence);
let totalNumberOfSequences=16;



function handleStep(element, controller, step) {
    console.log("handleStep entered");
    let isMuted = "true" === element.dataset.muted;
    if (controller.toggleMuteSteps.includes(step)) {
        isMuted = !isMuted;
        element.dataset.muted = isMuted ? "true" : "false";
        updateMuteState(element, isMuted);
        console.log("Mute toggled by the handleStep function");
    }
    return isMuted;
}

function renderPlayhead(elements, currentStep) {
    console.log("renderPlayhead entered");
    elements.forEach((element, index) => {
        element.classList.remove("playing");
        element.classList.remove("triggered");
        if (index === currentStep) {
            element.classList.add("playing");
        }
        if (element.classList.contains("selected")) {
            element.classList.add("triggered");
        }
    });
}

// Global flag to track if playStep has been logged
let playStepLogged = false;

function playStep() {
    const currentSequence = window.unifiedSequencerSettings.getCurrentSequence();
    console.log(`[playStep] Current sequence: ${currentSequence}`);

    // Assuming audioContext and channels are properly defined and accessible
    console.log(`[playStep] AudioContext State: ${audioContext.state}`);

    // Broadcast channel for communication with the visualizer
    const playbackChannel = new BroadcastChannel('channel_playback');

    for (let channelIndex = 0; channelIndex < 16; channelIndex++) {
        const channelSettings = window.unifiedSequencerSettings.getSequenceSettings(currentSequence)[`ch${channelIndex}`];

        if (!channelSettings) {
            console.warn(`[playStep] No sequence settings data for channel index: ${channelIndex}`);
            continue;
        }

        const isMuted = channelSettings.mute;
        console.log(`[Debug playStep] Channel ${channelIndex}, Step: ${currentStep}, Active: ${channelSettings.steps[currentStep]}, Muted: ${isMuted}`);

        const channelURL = window.unifiedSequencerSettings.getChannelURL(channelIndex);
        // Assuming steps are represented by buttons with class .step-button in your HTML
        const stepButtons = document.querySelectorAll(`#channel-${channelIndex} .step-button`);
            
        // Update the playhead position
        renderPlayhead(stepButtons, currentStep);

        // Debugging active steps
        console.log(`[Debug] Channel ${channelIndex}, Current Step: ${currentStep}, Active: ${channelSettings.steps[currentStep]}`);

        if (channelSettings.steps[currentStep] && !isMuted) {
            if (audioBuffers.has(channelURL)) {
                const audioBuffer = audioBuffers.get(channelURL);
                playTrimmedAudio(channelIndex, audioBuffer, channelURL);

                // Broadcasting a message to the visualizer with the channel index
                playbackChannel.postMessage({
                    action: 'play',
                    channelIndex: channelIndex
                });

                console.log(`[playStep] Broadcasting play for channel index: ${channelIndex}`);
            } else {
                console.error(`[playStep] No audio buffer found for URL: ${channelURL}`);
            }
        } else {
            console.log(`[playStep] Skipping playback for sequence: ${currentSequence}, channel index: ${channelIndex}, step: ${currentStep} due to mute state or inactive step.`);
        }
    }

    incrementStepCounters();
    
    if (document.getElementById("continuous-play").checked && currentStep === 0) {
        handleSequenceTransition((currentSequence + 1) % totalNumberOfSequences);
    }
}


function incrementStepCounters(){currentStep=(currentStep+1)%64,totalStepCount+=1,nextStepTime+=stepDuration,currentStep%4==0&&(beatCount++,emitBeat(beatCount)),currentStep%16==0&&(barCount+=1,emitBar(barCount)),currentStep%64==0&&(sequenceCount++,console.log(`[playStep-count] Sequence count: ${sequenceCount}`)),console.log(`[SeqDebug][playStep-count] Next step time: ${nextStepTime}`)}function handleSequenceTransition(e){console.log("[SeqDebug][stepHandling] handleSequenceTransition entered"),console.log(`[SeqDebug] handleSequenceTransition called with sequence: ${e}`),window.unifiedSequencerSettings.setCurrentSequence(e),console.log(`[SeqDebug][stepHandling] Sequence set to ${e} at ${(new Date).toLocaleTimeString()}`);const t=document.getElementById("current-sequence-display");t&&(t.innerHTML=`Sequence: ${e}`),resetCountersForNewSequence(),createStepButtonsForSequence(),setTimeout((()=>{updateUIForSequence(e),console.log(`[SeqDebug][handleSequenceTransition][stepHandling] UI updated for sequence ${e} at ${(new Date).toLocaleTimeString()}`)}),100)}function resetCountersForNewSequence(){beatCount=0,barCount=0,currentStep=0,totalStepCount=0}
function startScheduler() {

    channelPlaybackBroadcast.postMessage({ action: 'start' });
    // Assuming `channels` is a collection of DOM elements representing each channel
    channels.forEach((channel) => {
        const channelIndex = parseInt(channel.dataset.id.split("-")[1]);
        // Check if the channel is not muted before setting the volume
        if (!channelMutes[channelIndex]) {
            setChannelVolume(channelIndex, 1); // Set volume to 1
            console.log(`[startScheduler] Channel ${channelIndex} volume set to 1`);
        }
    });

    clearTimeout(timeoutId);
    audioContext.resume();
    startTime = audioContext.currentTime;
    nextStepTime = startTime;

    const bpm = window.unifiedSequencerSettings.getBPM();
    console.log(`[startScheduler] Current BPM from global settings: ${bpm}`);

    scheduleNextStep();
}
function pauseScheduler() {
    clearTimeout(timeoutId); // Stop any scheduled steps.
    if (audioContext.state !== 'suspended') {
        audioContext.suspend().then(() => {
            console.log("AudioContext suspended.");
        });
    }
    isPaused = true; // Mark the sequencer as paused.
}

function resumeScheduler() {
    if (isPaused && audioContext.state === 'suspended') {
        audioContext.resume().then(() => {
            console.log("AudioContext resumed.");
            // Calculate the time to the next step based on the current time.
            let timeSinceLastStep = audioContext.currentTime - pauseTime;
            let timeToNextStep = stepDuration - (timeSinceLastStep % stepDuration);
            nextStepTime = audioContext.currentTime + timeToNextStep;
            
            isPaused = false;
            // Ensure scheduling resumes from the next calculated step time.
            scheduleNextStep();
        });
    }
}
function scheduleNextStep(){console.log("[scheduleNextStep] Attempting to play sound for Channel:","Step:",currentStep);const e=window.unifiedSequencerSettings.getBPM()||105;console.log(`[scheduleNextStep] Current BPM: ${e}`),stepDuration=60/e/4,console.log(`[scheduleNextStep] Step Duration: ${stepDuration}`),timeoutId=setTimeout((()=>{playStep(),scheduleNextStep()}),1e3*(nextStepTime-audioContext.currentTime))}

function stopScheduler() {
    console.log("Stop pressed. Scheduler stopping...");
    channelPlaybackBroadcast.postMessage({ action: 'stop' });

    // Assuming there's a typo in your provided code snippet (consolechannels),
    // it should probably be channels.forEach
    channels.forEach((channel) => {
        const channelIndex = parseInt(channel.dataset.id.split("-")[1]);
        setChannelVolume(channelIndex, 0); // Mute or set volume to 0
    });

    clearTimeout(timeoutId);

    // Reset the sequencer's state variables
    currentStep = 0;
    beatCount = 1;
    barCount = 1;
    sequenceCount = 0;
    isPaused = false;
    pauseTime = 0;

    // Call to reset step lights
    resetStepLights();
}

function resetStepLights() {
    const buttons = document.querySelectorAll('.step-button');
    buttons.forEach(button => {
        button.classList.remove('playing');
    });
    }

const presets={preset1:{name:"Preset 1",bpm:"105",channels:[{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!0,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""},{triggers:[],mute:!1,toggleMuteSteps:[],url:""}]}};console.log("Initial Presets:",presets);
const audioBuffers=new Map;function getIDFromURL(e){console.log("[HTML Debugging] getIDFromURL entered");const t=e.split("/");return t[t.length-1]}function base64ToArrayBuffer(e){console.log("[HTML Debugging] [base64ToArrayBuffer] Entered function. Base64 sample:",e.substring(0,100));const t=atob(e),o=t.length,n=new Uint8Array(o);for(let e=0;e<o;e++)n[e]=t.charCodeAt(e);return console.log(`[HTML Debugging] [base64ToArrayBuffer] Generated Uint8Array length: ${n.length}`),n.buffer}const decodeAudioData=e=>{let t=new Uint8Array(e.slice(0,20));return console.log("[HTML Debugging] [decodeAudioData] ArrayBuffer first 20 bytes:",t.join(", ")),new Promise(((t,o)=>{audioContext.decodeAudioData(e,(e=>{console.log("[HTML Debugging] [decodeAudioData] Audio data decoded successfully."),t(e)}),(e=>{console.error("[HTML Debugging] [decodeAudioData] Detailed Error:",{message:e.message,code:e.code}),o(e)}))}))};

async function importHTMLAudioData(e,t){console.log("[importHTMLSampleData] Entered function with index: ",t);try{const t=new DOMParser,o=t.parseFromString(e,"text/html").querySelector("audio[data-audionalSampleName] source");if(o){const e=o.getAttribute("src");if(e.toLowerCase().startsWith("data:audio/wav;base64,")||e.toLowerCase().startsWith("data:audio/mp3;base64,"))return console.log("[importHTMLSampleData] Extracted base64 audio data."),e;console.error("[importHTMLSampleData] Audio data does not start with expected base64 prefix.")}else console.error("[importHTMLSampleData] Could not find the audio source element in the HTML content.")}catch(e){console.error("[importHTMLSampleData] Error parsing HTML content: ",e)}return null}


////////////////////////////////////////////////////////////////////////

function bufferToBase64(buffer) {
    console.log("bufferToBase64 entered");
    let base64String = "";
    const uint8Array = new Uint8Array(buffer);
    const byteLength = uint8Array.byteLength;
    console.log(`[HTML Debugging] [bufferToBase64] Buffer length: ${byteLength}`);
    for (let i = 0; i < byteLength; i++) {
        base64String += String.fromCharCode(uint8Array[i]);
    }
    const base64Encoded = window.btoa(base64String);
    console.log(`[HTML Debugging] [bufferToBase64] Converted to base64, length: ${base64Encoded.length}`);
    return base64Encoded;
}

function playSound(sequence, element, step) {
    console.log("playSound entered");
    const channelIndex = getChannelIndex(element);
    console.log(`[playSound Debugging] [playSound] Processing channel index: ${channelIndex}`);
    const stepState = getStepState(sequence, channelIndex, step);
    console.log(`[playSound Debugging] [playSound] setting stepState using getStepState to: ${stepState}`);
    if (!stepState) {
        console.log("[playSound Debugging] [playSound] Current step is not selected. Skipping playback.");
        return;
    }
    const audioUrl = getAudioUrl(channelIndex);
    console.log("[playSound Debugging] [playSound] Audio URL:", audioUrl);
    const audioBuffer = getAudioBuffer(audioUrl);
    if (audioBuffer) {
        console.log("[playSound Debugging] [playSound] Audio buffer:", audioBuffer);
        playTrimmedAudio(channelIndex, audioBuffer, audioUrl);
    } else {
        console.log("[playSound Debugging] [playSound] No audio buffer found for URL:", audioUrl);
    }
}

function getChannelIndex(element) {
    return parseInt(element.dataset.id.split("-")[1]);
}

function getStepState(sequence, channelIndex, step) {
    console.log(`[playSound Debugging] [getStepState called] currentSequence: ${sequence}, channelIndex: ${channelIndex}, currentStep: ${step}`);
    return window.unifiedSequencerSettings.getStepState(sequence, channelIndex, step);
}

function getAudioUrl(channelIndex) {
    return typeof window.unifiedSequencerSettings.getprojectUrlforChannel === "undefined" ?
        (console.error(`[getAudioUrl] [ playSound ] URL not found for channel index: ${channelIndex}`), "defaultURL") :
        window.unifiedSequencerSettings.getprojectUrlforChannel(channelIndex);
}

function getAudioBuffer(url) {
    return audioBuffers.get(url);
}

// Assuming `window.unifiedSequencerSettings.settings.masterSettings.trimSettings` 
// contains the trim settings array as described.

// Improved global function to retrieve trim settings.
function getGlobalTrimSettings(channelIndex) {
    console.log("[getGlobalTrimSettings] Entered for channel index:", channelIndex);
    const trimSettings = window.unifiedSequencerSettings.settings.masterSettings.trimSettings;

    if (!trimSettings || channelIndex < 0 || channelIndex >= trimSettings.length) {
        console.error("[getGlobalTrimSettings] Invalid channel index or trimSettings not found", channelIndex);
        return { startSliderValue: 0.01, endSliderValue: 100, totalSampleDuration: 1 }; // Provide default values
    }

    return trimSettings[channelIndex];
}

// Adjusted playTrimmedAudio function that handles trim settings correctly.
function playTrimmedAudio(channelIndex, audioBuffer, url) {
    console.log("[playTrimmedAudio] Entered for URL:", url);

    // Retrieve trim settings for the current channel.
    const trimSettings = getGlobalTrimSettings(channelIndex);
    let trimStart = trimSettings.startSliderValue / 100 * audioBuffer.duration;
    let trimEnd = trimSettings.endSliderValue / 100 * audioBuffer.duration;

    // Ensure trimStart and trimEnd are within valid range.
    trimStart = Math.max(0, Math.min(trimStart, audioBuffer.duration));
    trimEnd = Math.max(trimStart, Math.min(trimEnd, audioBuffer.duration));

    // Calculate the actual duration to play.
    const duration = trimEnd - trimStart;

    // Log the calculated values for debugging.
    console.log(`[playTrimmedAudio] Channel: ${channelIndex}, TrimStart: ${trimStart}, Duration: ${duration}`);

    // Ensure duration is finite, otherwise, log an error and return early.
    if (!isFinite(trimStart) || !isFinite(duration)) {
        console.error("[playTrimmedAudio] Invalid trimStart or duration", {trimStart, duration});
        return;
    }

    // Play the audio with the calculated trim settings.
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(gainNodes[channelIndex]);
    gainNodes[channelIndex].connect(audioContext.destination);
    source.start(0, trimStart, duration);
}



function calculateTrimValues(channelIndex, audioBuffer) {
    const trimSettings = getGlobalTrimSettings(channelIndex);

    // Ensure that we have valid numeric values for startSliderValue and endSliderValue
    let trimStart = (Number(trimSettings.startSliderValue) || 0) / 100 * audioBuffer.duration;
    let trimEnd = (Number(trimSettings.endSliderValue) || 100) / 100 * audioBuffer.duration;

    // Correct any potential NaN values by setting to valid defaults
    trimStart = isNaN(trimStart) ? 0 : trimStart;
    trimEnd = isNaN(trimEnd) ? audioBuffer.duration : trimEnd;

    // Ensure trimEnd is not less than trimStart
    trimEnd = Math.max(trimStart, trimEnd);

    const duration = trimEnd - trimStart;
    return { trimStart, duration };
}

async function playAuditionedSample(url) {
    console.log("playAuditionedSample entered");
    try {
        const formattedURL = formatURL(url);
        const response = await fetch(formattedURL);
        const data = await response.json();
        if (data.audioData) {
            const arrayBuffer = base64ToArrayBuffer(data.audioData.split(",")[1]);
            if (!audioContext) {
                window.AudioContext = window.AudioContext || window.webkitAudioContext;
                audioContext = new AudioContext();
            }
            const audioBuffer = await decodeAudioData(arrayBuffer);
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContext.destination);
            source.start();
        } else {
            console.log("Audional data not found in response, attempting to fetch and parse content type.");
            const contentType = await fetchAndParseContentType(url);
            console.log(`Content type found: ${contentType}`);
        }
    } catch (error) {
        console.error("Error playing auditioned sample:", error);
    }
}

function togglePlayState(isPlaying, play, pauseButton, playButton) {
    console.log("togglePlayState entered");
    if (!isPlaying) {
        isPlaying = true;
        play();
        pauseButton.classList.add("selected");
        playButton.classList.remove("selected");
    } else {
        isPlaying = false;
        pauseButton.classList.remove("selected");
        playButton.classList.add("selected");
    }
}

function updateMuteState(element, isMuted) {
    console.log("updateMuteState entered");
    console.log("updateMuteState - isMuted: " + isMuted);
    const channelIndex = parseInt(element.dataset.id.split("-")[1]);
    element.dataset.muted = isMuted ? "true" : "false";
    element.querySelector(".mute-button").classList.toggle("selected", isMuted);
    channelMutes[channelIndex] = isMuted;
    gainNodes[channelIndex].gain.value = isMuted ? 0 : 1;
    updateDimState(element, channelIndex);
}

function toggleMute(element) {
    console.log("toggleMute entered");
    const channelIndex = parseInt(element.dataset.id.split("-")[1]);
    updateMuteState(element, !channelMutes[channelIndex], channelIndex);
    console.log("Mute has been toggled by the toggleMute function");
}


///////////////////////////////////////////////////////////////////////////////////



function updateProjectNameObserver(e){console.log("[observers] updateProjectNameObserver called with:",e),e&&e.masterSettings&&e.masterSettings.projectName&&(console.log("[observers] Updating Project Name UI:",e.masterSettings.projectName),updateProjectNameUI(e.masterSettings.projectName))}function updateBPMObserver(e){console.log("[observers] updateBPMObserver called with:",e),e&&e.masterSettings&&e.masterSettings.projectBPM&&(console.log("Updating BPM UI:",e.masterSettings.projectBPM),updateBPMUI(e.masterSettings.projectBPM))}function updateProjectURLsObserver(e){console.log("[observers] updateProjectURLsObserver called with:",e),e&&e.masterSettings&&e.masterSettings.projectURLs&&(console.log("Updating Project URLs UI:",e.masterSettings.projectURLs),unifiedSequencerSettings.updateAllLoadSampleButtonTexts(),updateProjectURLsUI(e.masterSettings.projectURLs))}function updateTrimSettingsObserver(e){console.log("[observers] updateTrimSettingsObserver called with:",e),e&&e.masterSettings&&e.masterSettings.trimSettings&&(console.log("Updating Trim Settings UI:",e.masterSettings.trimSettings),updateTrimSettingsUI(e.masterSettings.trimSettings))}function updateProjectChannelNamesObserver(e){console.log("[observers] updateProjectChannelNamesObserver called with:",e),e&&e.masterSettings&&e.masterSettings.projectChannelNames&&(console.log("Updating Project channel Names UI:",e.masterSettings.projectChannelNames),e.masterSettings.projectChannelNames.forEach(((e,t)=>{const r=document.querySelector(`#channel-name-${t}`);r&&(r.textContent=e||"Default Channel Name")})))}function updateProjectSequencesObserver(e){console.log("[observers] updateProjectSequencesObserver called with:",e),e&&e.masterSettings&&e.masterSettings.projectSequences&&(console.log("Updating Project Sequences UI:",e.masterSettings.projectSequences),updateProjectSequencesUI(e.masterSettings.projectSequences))}function registerObservers(){console.log("[observers] registerObservers called"),window.unifiedSequencerSettings?(window.unifiedSequencerSettings.addObserver(updateProjectNameObserver),window.unifiedSequencerSettings.addObserver(updateBPMObserver),window.unifiedSequencerSettings.addObserver(updateProjectURLsObserver),window.unifiedSequencerSettings.addObserver(updateTrimSettingsObserver),window.unifiedSequencerSettings.addObserver(updateProjectChannelNamesObserver),window.unifiedSequencerSettings.addObserver(updateProjectSequencesObserver),window.unifiedSequencerSettings.addObserver(updateCurrentSequenceObserver),window.unifiedSequencerSettings.addObserver(updateTotalSequencesObserver)):console.error("UnifiedSequencerSettings instance not found.")}function updateCurrentSequenceObserver(e){console.log("[Observer] updateCurrentSequenceObserver called with:",e),e&&e.masterSettings&&"number"==typeof e.masterSettings.currentSequence&&console.log("[Observer] Current Sequence changed:",e.masterSettings.currentSequence)}function updateTotalSequencesObserver(e){console.log("[Observer] updateTotalSequencesObserver called with:",e),e&&e.masterSettings&&Array.isArray(e.masterSettings.projectSequences)&&console.log("[Observer] Total number of Sequences changed:",e.masterSettings.projectSequences.length)}registerObservers();
let isPlaying=!1,currentStep=0,totalStepCount=0,beatCount=1,barCount=1,sequenceCount=1,currentSequence=0;const sequenceLength=64,maxSequenceCount=64,allSequencesLength=4096,collectedURLs=Array(16).fill("");let timeoutId,audioContext,currentStepTime,startTime,nextStepTime,stepDuration,isPaused=!1,pauseTime=0,stopClickCount=0;
// Get DOM elements
const playButton = document.getElementById("play");
const stopButton = document.getElementById("stop");
const saveButton = document.getElementById("save-button");

// Initialize audio-related variables
let gainNodes = Array(16).fill(null);
let isMuted = false;
let channelMutes = [];
let muteState = false;
let volumeStates = Array(16).fill(1);
let soloedChannels = Array(16).fill(false);

// Select all channel elements
const channels = document.querySelectorAll('.channel[id^="channel-"]');
const activeChannels = 16;

// Variables for clearing and confirming clicks
let clearClickedOnce = Array(channels.length).fill(false);
let clearConfirmTimeout = Array(channels.length).fill(null);

// Check if Web Audio API is supported
if (!audioContext) {
  try {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioContext();
  } catch (e) {
    console.warn("Web Audio API is not supported in this browser");
  }
}


function updateVolume(e,t){if(console.log("updateVolume entered"),soloedChannels.some((e=>e)))gainNodes[t].gain.value=soloedChannels[t]?1:0;else{const n=e.querySelector(".mute-button").classList.contains("selected");gainNodes[t].gain.value=n?0:1}}function updateDimState(e,t){console.log("updateDimState entered"),console.log(`updateDimState called for channel ${t}`);const n=window.unifiedSequencerSettings.getCurrentSequence(),o=e.querySelectorAll(`.step-button[id^="Sequence${n}-ch${t}"]`);0===gainNodes[t].gain.value?o.forEach((e=>e.classList.add("dimmed"))):o.forEach((e=>e.classList.remove("dimmed")))}if(document.addEventListener("click",(()=>{channels.forEach(((e,t)=>{if(clearClickedOnce[t]){e.querySelector(".clear-confirm").style.display="none",clearTimeout(clearConfirmTimeout[t]),clearClickedOnce[t]=!1}}))})),playButton&&stopButton){const t=document.querySelector("#channel-0 .step-button:nth-child(4n)");t&&t.classList.add("selected");const n=document.querySelector("#channel-1 .step-button:nth-child(1)");n&&n.classList.add("selected");const o=document.querySelector("#channel-1 .step-button:nth-child(6)");o&&o.classList.add("selected");let l=!1;function checkContinuousPlay()
{document.getElementById("continuous-play").checked&&totalStepCount>=4096&&(beatCount=0,barCount=0,currentStep=0,totalStepCount=0,document.getElementById("next-sequence").click())}

if (window.self !== window.top) { // Check if in an iframe
    let presetLoaded = false; // Flag to track if the preset file has been loaded

    // Add a global click listener that toggles playback
    window.addEventListener("click", async (event) => {
        event.stopPropagation(); // Prevent event propagation

        console.log("[playbackDebug] Overlay clicked. State of audioContext:", audioContext.state);

        if (!presetLoaded) {
            try {
                const response = await fetch('BasedSong1.json'); // Adjust the path as needed
                const json = await response.json();
                console.log("[Load Process] Settings loaded:", json);

                // Assuming window.unifiedSequencerSettings exists and is ready to use
                window.unifiedSequencerSettings.loadSettings(json);
                console.log("[Load Process] Settings applied to the sequencer");

                // Process channel URLs for audio loading
                if (json.channelURLs && Array.isArray(json.channelURLs)) {
                    await processChannelURLs(json.channelURLs);
                }

                presetLoaded = true; // Mark the preset as loaded

            } catch (error) {
                console.error("[Load Process] Error loading or applying settings:", error);
            }
        }

        if (audioContext && audioContext.state === 'suspended') {
            await audioContext.resume();
            console.log("[AudioContext] AudioContext resumed.");
        }

        if (isPlaying) {
            stopScheduler();
            emitStop(); // Assume this function signals the stop event
            isPlaying = false;
            console.log("[Playback] Playback stopped.");
        } else {
            startScheduler();
            emitPlay(); // Assume this function signals the play event
            isPlaying = true;
            console.log("[Playback] Playback started.");
        }
    }, true); // Use capture phase to ensure the event is handled first
}



playButton.addEventListener("click", () => {
    console.log("[playbackDebug] Play button clicked. State of audioContext:", audioContext.state);
    
    // Check if the sequencer is already playing
    if (isPlaying) {
        // Logic to toggle pause/resume
        if (l) {
            resumeScheduler();
            emitResume();
            l = false;
        } else {
            pauseScheduler();
            emitPause();
            l = true;
        }
    } else {
        // Start playback if not already playing
        startScheduler();
        emitPlay();
        playButton.classList.add("selected");
        stopButton.classList.remove("selected");
        isPlaying = true;
        l = false;
    }

    // Continuous play check and preset loading
    let continuousPlay = document.getElementById("continuous-play").checked;
    if (continuousPlay && totalStepCount >= 4096) {
        resetSequenceProgress(); // Encapsulate sequence progress reset logic in a function for clarity
        loadNextPreset(); // Encapsulate preset loading logic in a function for clarity
    }
});

function resetSequenceProgress() {
    beatCount = 0;
    barCount = 0;
    sequenceCount = 0;
    currentStep = 0;
    totalStepCount = 0;
    sequenceCount++;
    if (sequenceCount > 64) {
        sequenceCount = 1;
    }
}

function loadNextPreset() {
    loadPreset(`preset${sequenceCount}`);
    checkContinuousPlay();
}

// Correct setup for the stopButton event listener
stopButton.addEventListener("click", () => {
    if (isPlaying) { // Assuming isPlaying is a flag indicating whether playback is active
        stopScheduler(); // Assuming this function correctly stops the playback
        emitStop(); // Assuming this function emits a stop event or similar action
        stopButton.classList.add("selected");
        playButton.classList.remove("selected");
        isPlaying = false; // Update the isPlaying flag to false
        // Assuming 'l' is a variable used in your logic, reset it as well
        l = false; // Resetting 'l' based on your logic, ensure 'l' is declared and used correctly
        // Reset playback related variables
        beatCount = 0;
        barCount = 0;
        sequenceCount = 0;
        currentStep = 0;
        totalStepCount = 0;
        resetStepLights(); // Assuming this function resets UI elements related to step lights
    }
}, false); // Adding 'false' for useCapture parameter as a best practice
}

const loadPreset=e=>{console.log("index.js loadPreset entered"),console.log(`index.js loadPreset: Loading preset: ${e}`);const t=presets[e];t?(channels.forEach(((e,n)=>{const o=t.channels[n];if(!o)return void console.warn(`No preset data for channel index: ${n}`);const l=window.unifiedSequencerSettings.getChannelURL(n),{steps:a,mute:s}=o;if(l){const e=document.querySelector(`.channel[data-id="Channel-${n}"] .load-sample-button`);fetchAudio(l,n,e).then((()=>{const t=getAudioTrimmerInstanceForChannel(n);t&&t.loadSampleFromURL(l).then((()=>{const l=o.trimSettings?.startSliderValue||.01,a=o.trimSettings?.endSliderValue||t.totalSampleDuration;t.setStartSliderValue(l),t.setEndSliderValue(a),window.unifiedSequencerSettings.setTrimSettings(n,l,a),updateLoadSampleButtonText(n,e)}))}))}a.forEach((e=>{const t=document.querySelector(`.channel[data-id="Channel-${n}"] .step-button:nth-child(${e})`);t&&t.classList.add("selected")}));const u=document.querySelector(`.channel[data-id="Channel-${n}"]`);u&&(updateMuteState(u,s),u.classList.add("ordinal-loaded"))})),console.log(e),loadChannelSettingsFromPreset(presets[e]),console.log("loadPreset: After loadPreset, gainNodes values:",gainNodes.map((e=>e.gain.value)))):console.error("Preset not found:",e)};function updateLoadSampleButtonText(e,t){console.log("updateLoadSampleButtonText entered"),console.log(`[updateLoadSampleButtonText] Called for channel index: ${e}`);const n=window.unifiedSequencerSettings.channelURLs(e);console.log(`[updateLoadSampleButtonText] Loaded URL for channel ${e}: ${n}`),n?(t.textContent=n,console.log(`[updateLoadSampleButtonText] Button text updated to: ${n}`)):(t.textContent="Load New Audional",console.log("[updateLoadSampleButtonText] Default text set for button"))}function testUpdateLoadSampleButtonText(){console.log("[testUpdateLoadSampleButtonText] Function entered");document.querySelectorAll(".channel").forEach(((e,t)=>{const n=e.querySelector(".load-sample-button");n?(n.textContent=`Channel ${t+1}`,console.log(`[testUpdateLoadSampleButtonText] Button text updated for channel ${t+1}`)):console.log(`[testUpdateLoadSampleButtonText] No loadSampleButton found for channel ${t+1}`)}))}console.log("index.js loaded");

// Global instance
// const sequencerSettings = new UnifiedSequencerSettings();
// Get the container element with id "drum-machine"
const appContainer = document.getElementById("drum-machine");

// Add event listener to the container for click events
appContainer.addEventListener("click", () => {
    // When clicked, resume the audio context
    audioContext.resume().then(() => {
        console.log("Playback resumed successfully");
    });
});

// Add event listener when the DOM content is loaded
document.addEventListener("DOMContentLoaded", () => {
    // Get elements by their respective ids
    const saveButton = document.getElementById("save-button");
    const loadFileInput = document.getElementById("load-file-input");
    const newLoadButton = document.getElementById("new-load-button");
    const loadOptions = document.getElementById("loadOptions");
    const loadJson = document.getElementById("loadJson");
    let loadClicked = false;




    // Event listener for the "New/Load" button
    newLoadButton.addEventListener("click", () => {
        console.log("[Save/Load debug] Load button clicked");
        // If load button was not clicked before, remove animation
        if (!loadClicked) {
            newLoadButton.classList.remove("smooth-wave");
            newLoadButton.style.animation = "none";
            loadClicked = true;
        }
        // Toggle display of load options
        loadOptions.style.display = loadOptions.style.display === "none" || loadOptions.style.display === "" ? "block" : "none";
    });

    // Event listener for the "Load JSON" button
    loadJson.addEventListener("click", () => {
        console.log("[Save/Load debug] loadJson clicked");
        // Simulate click on the file input element
        loadFileInput.click();
        // Hide load options
        loadOptions.style.display = "none";
    });

    // Event listener for the change event on the file input
    loadFileInput.addEventListener("change", async () => {
        console.log("[Save/Load debug] loadFileInput change event");
        // Get the selected file
        let file = loadFileInput.files[0];
        let reader = new FileReader();
        reader.onload = async function (event) {
            console.log("File read start");
            // Parse the JSON content of the file
            let data = JSON.parse(event.target.result);
            console.log("[loadFileInput] File content:", data);
            // Load settings from the parsed JSON
            window.unifiedSequencerSettings.loadSettings(data);
            // If channel URLs are present, process each URL
            if (data.channelURLs && Array.isArray(data.channelURLs)) {
                await processChannelURLs(data.channelURLs);
            }
        };
        // Read the file as text
        reader.readAsText(file);
    });
});

// Dedicated function to process channel URLs
async function processChannelURLs(channelURLs) {
    for (let i = 0; i < channelURLs.length; i++) {
        const url = channelURLs[i];
        if (url) {
            // Assuming fetchAudio is already implemented and adapted for this context
            await fetchAudio(url, i);
        }
    }
}

// Function to fetch audio data asynchronously, unchanged from original code
const fetchAudio = async (url, index, button) => {
    // Format the URL
    const formattedUrl = formatURL(url);
    console.log("[HTML Debugging] [fetchAudio] Entered function. URL:", formattedUrl, "Channel Index:", index);

    try {
        // Fetch the audio file
        const response = await fetch(formattedUrl);
        const contentType = response.headers.get("Content-Type");
        let audioBuffer;

        // Check if response contains HTML content
        if (contentType && contentType.includes("text/html")) {
            // If HTML content, import audio data
            const htmlContent = await response.text();
            const audioData = await importHTMLAudioData(htmlContent, index);
            if (!audioData) return;
            // Convert base64 data to array buffer or fetch the audio data
            audioBuffer = audioData.startsWith("data:") ? base64ToArrayBuffer(audioData.split(",")[1]) :
                await fetch(audioData).then(response => response.arrayBuffer());
        } else {
            // If not HTML content, directly convert to array buffer
            audioBuffer = await response.arrayBuffer();
        }

        // Decode the audio data
        const decodedAudioBuffer = await decodeAudioData(audioBuffer);
        // Store the audio buffer
        audioBuffers.set(formattedUrl, decodedAudioBuffer);
        console.log("[HTML Debugging] [fetchAudio] Audio buffer stored.");
    } catch (error) {
        console.error("[HTML Debugging] [fetchAudio] Error:", error);
    }
};


// Event listener for the "message" event
window.addEventListener("message", (event) => {
    // Handle message event
});

// Event listener for the "click" event on the close button
document.querySelector(".close-button").addEventListener("click", () => {
    console.log("Close button clicked");
    // Hide the audio trimmer modal
    document.getElementById("audio-trimmer-modal").style.display = "none";
    console.log("Modal closed");
});

// Event listener for clicks outside the modal
window.onclick = (event) => {
    const modal = document.getElementById("audio-trimmer-modal");
    if (event.target === modal) {
        console.log("Clicked outside the modal");
        // Hide the modal
        modal.style.display = "none";
        console.log("Modal closed");
    }
};




    // Get the input element for project name
    const projectNameInput = document.getElementById("project-name");
    // Event listener for input event on project name input
    projectNameInput.addEventListener("input", () => {
        const projectName = projectNameInput.value.trim();
        // Update project name setting
        window.unifiedSequencerSettings.updateSetting("projectName", projectName);
        // If project name is empty, set default
        if (!projectName) {
            projectNameInput.value = "Default Project Name";
        }
    });


window.addEventListener('message', (event) => {
    console.log('Received message:', event);
    // WARNING: Setting allowedOrigins to '*' accepts messages from any origin.
    // This can be a security risk. Use with caution and ensure that your application
    // validates the content of the messages and acts upon them securely.
    const allowedOrigins = '*';

    // The check against allowedOrigins is redundant when accepting all origins,
    // but left here for demonstration. In practice, if using '*', you'd remove this check.
    if (allowedOrigins !== '*' && !allowedOrigins.includes(event.origin)) {
        console.error('Received message from unauthorized origin:', event.origin);
        return;
    }

    // Attempt to parse the message data
    let data;
    try {
        data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
    } catch (error) {
        console.error('Error parsing message data:', error);
        return;
    }

    // Handle commands such as "load" or "play" based on the parsed data
    if (data.command === 'load' && data.settings) {
        console.log('Loading settings:', data.settings);
        sequencerSettings.loadSettings(data.settings); // Correct usage
    }

    if (data.command === 'play') {
        console.log('Playing the loaded settings');
        if (!sequencerSettings.isPlaying) {
            // Assuming startScheduler and emitPlay are methods of sequencerSettings
            sequencerSettings.startScheduler();
            sequencerSettings.emitPlay();
            sequencerSettings.isPlaying = true;
        }
    }
});

//     // Adjusting the "New/Load" button event listener for direct load and play
// newLoadButton.addEventListener("click", async () => {
//     console.log("[Load Process] Load button clicked, loading 'BasedSong1.json'");

//     try {
//         const response = await fetch('BasedSong1.json'); // Adjust the path as needed
//         const json = await response.json();
//         console.log("[Load Process] Settings loaded:", json);

//         // Assuming window.unifiedSequencerSettings exists and is ready to use
//         window.unifiedSequencerSettings.loadSettings(json);
//         console.log("[Load Process] Settings applied to the sequencer");

//         // Process channel URLs for audio loading
//         if (json.channelURLs && Array.isArray(json.channelURLs)) {
//             await processChannelURLs(json.channelURLs);
//         }

//         // Resume AudioContext if needed
//         if (audioContext && audioContext.state === 'suspended') {
//             await audioContext.resume();
//             console.log("[Load Process] AudioContext resumed.");
//         }

//         // Start the scheduler for playback, assuming `startScheduler` is already defined and properly sets up playback.
//         // Ensure this function exists and is designed to start playback in your application context.
//         startScheduler(); // This directly initiates playback according to your sequencer's scheduling logic.

//         console.log("[Load Process] Playback started via startScheduler.");
//     } catch (error) {
//         console.error("[Load Process] Error loading or applying settings:", error);
//     }
// });