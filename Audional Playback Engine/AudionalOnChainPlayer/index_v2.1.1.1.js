// index_v2.1.1.js

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
if (!audioContext) alert('Web Audio API is not supported in this browser');

let trimSettings, BPM, sequenceData, isLooping = true, isStoppedManually = false, cumulativeOffset = 0;
const activeSources = new Set();

const customLog = (message, isError = false) => (isError ? console.error : console.log)(message);

const base64ToArrayBuffer = base64 => {
    const binaryString = atob(base64), len = binaryString.length, bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes.buffer;
};

const decodeAudioData = audioData => audioContext.decodeAudioData(audioData).catch(console.error);

const fetchAndDecodeAudioFromHTML = async url => {
    const response = await fetch(url), html = await response.text(), doc = new DOMParser().parseFromString(html, 'text/html'), audioDataElement = doc.querySelector('audio[data-base64]');
    if (!audioDataElement) throw new Error('Audio data not found in HTML');
    return base64ToArrayBuffer(audioDataElement.getAttribute('data-base64').split(',')[1]);
};

const loadAudioFile = async url => {
    if (!url) return customLog('URL is invalid or missing', true), null;
    try {
        const response = await fetch(url), contentType = response.headers.get('content-type'), audioData = await (async () => {
            if (contentType.includes('audio/')) return response.arrayBuffer();
            if (contentType.includes('application/json')) {
                const {audioData} = await response.json();
                return audioData && typeof audioData === 'string' ? base64ToArrayBuffer(audioData.split(',')[1]) : customLog('JSON does not contain base64 encoded audio data', true), null;
            }
            if (contentType.includes('text/html')) return fetchAndDecodeAudioFromHTML(url);
            customLog(`Unknown content type: ${contentType}`, true);
            return null;
        })();
        return audioData ? decodeAudioData(audioData) : null;
    } catch (error) {
        customLog(`Error loading audio file: ${error}`, true);
        return null;
    }
};

const calculateTrimTimes = (trimSetting, totalDuration) => {
    const startTime = Math.max(0, (trimSetting.startSliderValue / 100) * totalDuration), endTime = (trimSetting.endSliderValue / 100) * totalDuration;
    return { startTime, duration: Math.max(0, endTime - startTime) };
};

const calculateStepTime = () => 60 / BPM / 4;

const createAndStartAudioSource = (audioBuffer, trimSetting, playbackTime) => {
    if (!audioBuffer) return;
    const { startTime, duration } = calculateTrimTimes(trimSetting, audioBuffer.duration), source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(audioContext.currentTime + playbackTime + cumulativeOffset, startTime, duration);
    source.onended = () => handleSourceEnd(source);
    activeSources.add(source);
};

const handleSourceEnd = source => {
    activeSources.delete(source);
    if (activeSources.size === 0 && isLooping && !isStoppedManually) playAudio();
};

const schedulePlaybackForStep = (audioBuffer, trimSetting, stepIndex) => createAndStartAudioSource(audioBuffer, trimSetting, stepIndex * calculateStepTime());

const playAudio = async () => {
    if (!sequenceData || !sequenceData.projectURLs || !sequenceData.projectSequences) return customLog("No valid sequence data available. Cannot play audio.", true);
    const { projectURLs, projectSequences, projectBPM, trimSettings } = sequenceData;
    BPM = projectBPM;

    stopAudio();

    cumulativeOffset = 0;

    const audioBuffers = await Promise.all(projectURLs.map(loadAudioFile));
    if (!audioBuffers.some(buffer => buffer)) return customLog("No valid audio data available for any channel. Cannot play audio.", true);

    Object.entries(projectSequences).forEach(([sequenceName, channels]) => {
        const sequenceDuration = 64 * calculateStepTime();

        Object.entries(channels).forEach(([channelName, channelData], channelIndex) => {
            const {steps} = channelData, audioBuffer = audioBuffers[channelIndex], trimSetting = trimSettings[channelIndex];
            if (audioBuffer && steps) steps.forEach((active, stepIndex) => active && schedulePlaybackForStep(audioBuffer, trimSetting, stepIndex));
        });

        cumulativeOffset += sequenceDuration;
    });

    isStoppedManually = false;
};

const stopAudio = () => {
    activeSources.forEach(source => {
        source.stop();
        source.disconnect();
    });
    activeSources.clear();
};

const setupUIHandlers = () => {
    const playButton = document.getElementById('playButton'),
          stopButton = document.getElementById('stopButton'),
          fileInput = document.getElementById('fileInput');

    if (playButton) playButton.addEventListener('click', () => { isLooping = true; playAudio(); });
    if (stopButton) stopButton.addEventListener('click', () => { isStoppedManually = true; stopAudio(); });

    if (fileInput) {
        fileInput.addEventListener('change', async (event) => {
            try {
                sequenceData = await processAndLoadAudio(event.target.files[0], loadAudioFile);
                playButton.disabled = !sequenceData || !sequenceData.projectURLs.some(url => url);
            } catch (err) {
                playButton.disabled = true;
                customLog(`Error processing sequence data: ${err}`, true);
            }
        });
    }
};

setupUIHandlers();

const log = (message, isError = false) => console[isError ? 'error' : 'log'](message);

const validateAudioData = (data) => {
    const steps = data.projectSequences?.Sequence0?.ch0?.steps;
    if (!data.trimSettings || !steps || steps.length !== 64 || !data.projectBPM) {
        throw new Error('Invalid or missing data in JSON');
    }
};

const readFileAsJSON = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(JSON.parse(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
});

const analyzeJSONFormat = async (data) => {
    log('Analyzing JSON format and content:');
    if (!data.projectURLs || data.projectURLs.length === 0) {
        return log('No projectURLs found in the data to analyze.', true);
    }

    for (const [index, url] of data.projectURLs.entries()) {
        if (typeof url === 'string' && url.trim() !== '') {
            try {
                const response = await fetch(url, { method: 'HEAD' });
                const contentType = response.headers.get('content-type');
                const logMessage = `URL ${index} is ${contentType.includes('audio/') ? 'direct audio' : contentType.includes('application/json') ? 'a JSON file that might contain audio data' : 'of unknown type'}: ${url}`;
                log(logMessage);
            } catch (error) {
                log(`Error analyzing URL ${index}: ${url} with error: ${error}`, true);
            }
        } else {
            log(`URL ${index} is invalid or empty`, true);
        }
    }
};

const processAndLoadAudio = async (file, loadAudioFile) => {
    log(`Processing JSON file: ${file.name}`);
    try {
        const sequenceData = await readFileAsJSON(file);
        validateAudioData(sequenceData);
        await analyzeJSONFormat(sequenceData); // Ensure this runs asynchronously
        return sequenceData;
    } catch (err) {
        log(`Error processing file: ${err}`, true);
        throw err;
    }
};
