// Mapping keys to their original names
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
  
  const channelMap = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)); // A-Z
  
  // Function to deserialize steps from compact format
  const deserializeSteps = compressedSteps => {
    const steps = [];
    compressedSteps.forEach(item => {
      if (typeof item === 'number') {
        steps.push({ index: item, isActive: true, isReverse: false, volume: 1, pitch: 1 });
      } else if (typeof item === 'string' && item.endsWith('r')) {
        const index = parseInt(item.slice(0, -1), 10);
        steps.push({ index: index, isActive: true, isReverse: true, volume: 1, pitch: 1 });
      } else if (typeof item === 'object' && item.r) {
        const [start, end] = item.r;
        for (let i = start; i <= end; i++) {
          steps.push({ index: i, isActive: true, isReverse: false, volume: 1, pitch: 1 });
        }
      }
    });
    return steps;
  };
  
  // Function to deserialize the entire object
  const deserialize = serializedData => {
    const deserializedData = {};
  
    for (const [key, value] of Object.entries(serializedData)) {
      const originalKey = keyMap[key] ?? key;
  
      if (originalKey === 'channelURLs') {
        deserializedData[originalKey] = value;
      } else if (Array.isArray(value)) {
        deserializedData[originalKey] = ['projectChannelNames'].includes(originalKey)
          ? value.map((v, i) => v === channelMap[i] ? v : i)
          : value.map(v => typeof v === 'number' ? v : deserialize(v));
      } else if (typeof value === 'object' && value !== null) {
        if (originalKey === 'projectSequences') {
          deserializedData[originalKey] = Object.entries(value).reduce((acc, [seqKey, channels]) => {
            const fullSeqKey = seqKey.replace('s', 'Sequence');
            acc[fullSeqKey] = Object.entries(channels).reduce((chAcc, [chKey, chValue]) => {
              const channelIndex = channelMap.indexOf(chKey);
              const fullChKey = `ch${channelIndex}`;
              chAcc[fullChKey] = {
                steps: deserializeSteps(chValue.steps ?? []),
                mute: false,
                url: ""
              };
              return chAcc;
            }, {});
            return acc;
          }, {});
        } else {
          deserializedData[originalKey] = deserialize(value);
        }
      } else {
        deserializedData[originalKey] = value;
      }
    }
  
    return deserializedData;
  };


  // Example usage in a browser:
// Assuming `compactSerializedData` is the serialized JSON you want to deserialize
// const deserializedData = deserialize(compactSerializedData);
// console.log(deserializedData);