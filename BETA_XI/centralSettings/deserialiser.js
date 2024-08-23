
const keyMap = {
    0: 'projectName',
    1: 'artistName',
    2: 'projectBPM',
    3: 'currentSequence',
    4: 'channelURLs',
    5: 'channelVolume',
    6: 'channelPlaybackSpeed',
    7: 'trimSettings',
    8: 'projectChannelNames',
    9: 'startSliderValue',
    10: 'endSliderValue',
    11: 'totalSampleDuration',
    12: 'start',
    13: 'end',
    14: 'projectSequences',
    15: 'steps'
};

const reverseKeyMap = Object.fromEntries(Object.entries(keyMap).map(([k, v]) => [v, +k]));
const channelMap = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A-Z

const deserialize = (data) => {
    const deserializedData = {};

    for (const [key, value] of Object.entries(data)) {
        const originalKey = keyMap[key] ?? key;

        if (originalKey === 'channelURLs' || originalKey === 'projectChannelNames') {
            deserializedData[originalKey] = value; // Just map the array directly
        } else if (Array.isArray(value)) {
            deserializedData[originalKey] = ['projectChannelNames'].includes(originalKey)
                ? value.map((v, i) => channelMap[i] ?? v)
                : value.map(v => typeof v === 'number' ? v : deserialize(v));
        } else if (typeof value === 'object' && value !== null) {
            deserializedData[originalKey] = originalKey === 'projectSequences'
                ? Object.entries(value).reduce((acc, [seqKey, channels]) => {
                    const originalSeqKey = seqKey.replace('s', 'Sequence');
                    const restoredChannels = Object.entries(channels).reduce((chAcc, [chKey, chValue]) => {
                        const index = channelMap.indexOf(chKey);
                        const originalChKey = `ch${index !== -1 ? index : chKey}`;
                        if (chValue[reverseKeyMap['steps']]?.length) {
                            chAcc[originalChKey] = { steps: decompressSteps(chValue[reverseKeyMap['steps']]) };
                        }
                        return chAcc;
                    }, {});
                    if (Object.keys(restoredChannels).length) acc[originalSeqKey] = restoredChannels;
                    return acc;
                }, {})
                : deserialize(value);
        } else {
            deserializedData[originalKey] = value;
        }
    }

    return deserializedData;
};

// Decompress steps that were compressed during serialization
const decompressSteps = steps => {
    const decompressed = [];

    steps.forEach(step => {
        if (typeof step === 'number') {
            decompressed.push(step);
        } else if (typeof step === 'object' && step.r) {
            for (let i = step.r[0]; i <= step.r[1]; i++) {
                decompressed.push(i);
            }
        } else if (typeof step === 'string' && step.endsWith('r')) {
            decompressed.push({ index: parseInt(step.slice(0, -1), 10), reverse: true });
        }
    });

    return decompressed;
};
