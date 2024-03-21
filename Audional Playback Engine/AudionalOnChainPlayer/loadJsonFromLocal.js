// loadJsonFromLocal.js

const log = (message, isError = false) => console[isError ? 'error' : 'log'](message);

const validateAudioData = (data) => {
    if (!data.trimSettings || !data.projectSequences?.Sequence0?.ch0?.steps || data.projectSequences.Sequence0.ch0.steps.length !== 64 || !data.projectBPM) {
        throw new Error('Invalid or missing data in JSON');
    }
};

const readFileAsJSON = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(JSON.parse(e.target.result));
    reader.onerror = err => reject(err);
    reader.readAsText(file);
});

const analyzeJSONFormat = (data) => {
    log('Analyzing JSON format and content:', false);

    // Loop through each URL in the data and analyze its content
    if (data.projectURLs) {
        data.projectURLs.forEach(async (url, index) => {
            if (typeof url === 'string' && url.trim() !== '') {
                try {
                    const response = await fetch(url, { method: 'HEAD' }); // Using HEAD to get headers without downloading the whole file
                    const contentType = response.headers.get('content-type');

                    if (contentType.includes('audio/')) {
                        log(`URL ${index} is direct audio: ${url} with type ${contentType}`);
                    } else if (contentType.includes('application/json')) {
                        log(`URL ${index} is a JSON file that might contain audio data: ${url}`);
                    } else {
                        log(`URL ${index} is of unknown type: ${url}`);
                    }
                } catch (error) {
                    log(`Error analyzing URL ${index}: ${url} with error: ${error}`, true);
                }
            } else {
                log(`URL ${index} is invalid or empty`, true);
            }
        });
    } else {
        log('No projectURLs found in the data to analyze.', true);
    }
};

const processAndLoadAudio = async (file, loadAudioFile) => {
    log(`Processing JSON file: ${file.name}`);
    try {
        const sequenceData = await readFileAsJSON(file);
        validateAudioData(sequenceData);
        analyzeJSONFormat(sequenceData);
        return sequenceData;
    } catch (err) {
        log('Error processing file:', true);
        throw err;
    }
};
