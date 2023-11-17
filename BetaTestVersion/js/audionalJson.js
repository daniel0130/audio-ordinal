export function audionalJsonTemplate(
  hash,
  file,
  base64Audio,
  fileInput,
  filenameWithoutExtension,
  creator,
  audioType,
  instrument,
  instrumentSpecifics,
  genre,
  key,
  userDefined,
  note,
  isLoop,
  loopGap,
  loopBPM,
  loopTrimStart,
  loopTrimEnd
) {
  var audionalJsonTemplate = {
    protocol: "audional",
    operation: "deploy",
    audionalId: hash,
    filename: file.name,
    audioData: base64Audio,
    metadata: {
      recursiveURLs: {
        audionalArt:
          "/content/40136786a9eb1020c87f54c63de1505285ec371ff35757b44d2cc57dbd932f22i0",
        coverArt: "Recursive URL for own cover art",
        otherArt: "Additional link for recursive artwork/other functions",
      },
      descriptive: {
        title: filenameWithoutExtension,
        creator: creator,
        description: "Brief description about the audio",
        audioType: audioType,
        technical: {
          encodingFormat: "Base64",
          sampleRate: fileInput.sampleRate,
          numberOfChannels: fileInput.numberOfChannels,
          bitDepth: "Bit Depth of the Audio",
          duration: document.getElementById("duration").value,
        },
        instrument: instrument,
        instrumentSpecifics: instrumentSpecifics,
        genre: genre,
        key: key,
        speechSpecific: {
          language: "Language of Speech",
          speaker: "Speaker Name",
          context: "Speech Context",
        },
        natureSpecific: {
          environment: "Type of Environment",
          timeOfDay: "Time of Day",
          weatherConditions: "Weather Conditions",
          animalSounds: {
            animalSpecies: "Species of Animal",
            animalBehavior: "Behavioral Context of the Sound",
            groupSize: "Size of the Animal Group",
          },
          geographicLocation: "Exact Geographic Location",
          season: "Season during the Recording",
          naturalPhenomenon:
            "Specific Natural Phenomenon (e.g. Thunderstorm, Waterfall, etc.)",
        },
        sfxSpecific: {
          source: "Source of Sound Effect",
          method: "Method of Production",
        },
        otherSpecific: {
          customField1: "Custom Field Value",
          customField2: "Custom Field Value",
        },
      },
      structural: {
        sequenceInfo:
          "Information about the sequence of audio if it's a part of larger work",
        hierarchyInfo:
          "Information about hierarchy if the audio is a part of a collection",
      },
      administrative: {
        ownershipInfo: "Information about ownership",
        rightsInfo: "Information about rights and restrictions",
        source: "Information about the source of the audio",
        preservationHistory: "Information about preservation steps taken",
      },
      contextual: {
        recordingLocation: "Location where the recording was made",
        culturalContext: "Cultural context of the audio",
        historicalContext: "Historical context of the audio",
      },
      preservation: {
        preservationSteps: "Steps taken for preserving the audio",
        futurePreservationPlan: "Any future plans for preserving the audio",
      },
      userDefined: userDefined,
    },
    playbackControls: {
      note: note,
      name: filenameWithoutExtension,
      velocity: 1.0,
      duration: document.getElementById("duration").value,
      isLoop: isLoop,
      loopGap: loopGap,
      loopBPM: loopBPM,
      playSpeed: 1.0,
      keyShift: 0,
      loopTrimStart: loopTrimStart,
      loopTrimEnd: loopTrimEnd,
    },
  };
  return audionalJsonTemplate;
}
