var inscribeButton = document.getElementById("inscribeButton");
var audionalJson;
const BASE_URL = "https://api-ordinals.gamma.io/inscription/v1";
let apiKey;
let feeRates = {};
let calculatedFee = {};
let inscriptionPreviewData = {};
let audionalJsonString;

// Fetch API key initially
getApiKey();

// Assume audionalJson exists and convert it to a string
if (window.audionalJson) {
  audionalJsonString = JSON.stringify(window.audionalJson, null, 2);
}

window.onload = function () {
  // Call API functions immediately on page load
  if (audionalJsonString) {
    calculateInscriptionRequestFee(audionalJsonString);
    getInscriptionPreview(audionalJsonString, "audional.json"); // replace "audional.json" with actual filename if necessary
  }
};

// Disable typing in the audio type input
var audioTypeInput = document.getElementById("audio_type");
audioTypeInput.addEventListener("keydown", function (e) {
  e.preventDefault();
});

// Utility functions
function generateRandomBase64String(length) {
  var chars =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ+/";
  var result = "";
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function generateId() {
  var timestamp = Math.floor(Date.now() / 1000);
  var timestampHex = timestamp.toString(16);
  var uniqueRandomBase64 = generateRandomBase64String(7);
  return timestampHex + uniqueRandomBase64;
}

// Store elements to avoid repeated DOM queries
const fileInput = document.getElementById("file");
const processButton = document.getElementById("process");
const convertButton = document.getElementById("convert");
const reminder = document.getElementById("reminder");

// Error container for user-friendly error messages
const errorContainer = document.createElement("div");
errorContainer.id = "error-container";
document.body.appendChild(errorContainer);

// Main code
var audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Make the fileInput button flash when the page loads
fileInput.classList.add("flashing");

fileInput.addEventListener("change", function () {
  var file = fileInput.files[0];
  if (file) {
    var fileType = file.name.split(".").pop();
    if (fileType !== "mp3" && fileType !== "wav") {
      errorContainer.innerHTML =
        "Invalid file type. Please select a .mp3 or .wav file.";
      fileInput.value = ""; // Clear the input.
      return;
    }
  }
  // Remove the flashing class from the file input field
  fileInput.classList.remove("flashing");
  fileInput.style.backgroundColor = "green";

  // Reset the process button to its original state
  processButton.innerText = "Process Audio File";
  processButton.disabled = false;
  processButton.classList.add("flashing");

  // Reset the audio type input
  audioTypeInput.value = "";

  // Disable the convert button
  convertButton.innerText = "Generate Audional json File";
  convertButton.disabled = true;
  convertButton.classList.remove("flashing");
  convertButton.style.backgroundColor = "grey";
});

processButton.addEventListener("click", function () {
  document.getElementById("reminder").style.color = "red";

  if (!audioTypeInput.value) {
    document.getElementById("reminder").innerText =
      "Please select the Audio Type and fill any other relevant fields before creating your Audional file!";
    convertButton.disabled = true;
  } else {
    document.getElementById("reminder").innerText =
      "Have you filled as many of the fields above as you can?\nMore detail equals better indexing which equals more users finding your samples!\nIf yes, go ahead and:";
    convertButton.disabled = false;
    convertButton.classList.add("flashing");
  }

  // Handle button flashing
  convertButton.addEventListener("animationiteration", function () {
    convertButton.style.backgroundColor =
      convertButton.style.backgroundColor === "red" ? "" : "red";
  });

  audioTypeInput.addEventListener("input", function () {
    if (audioTypeInput.value) {
      document.getElementById("reminder").innerText =
        "Have you filled as many of the fields above as you can?\nMore detail equals better indexing which equals more users finding your samples!\nIf yes, go ahead and:";
      convertButton.disabled = false;
      convertButton.classList.add("flashing");
    }
  });

  var file = fileInput.files[0];
  if (!file) {
    alert("Please select a file.");
    return;
  }

  var reader = new FileReader();
  reader.onload = function (e) {
    var audioData = e.target.result;

    audioContext.decodeAudioData(audioData, function (buffer) {
      var duration = buffer.duration;

      fileInput.sampleRate = buffer.sampleRate;
      fileInput.numberOfChannels = buffer.numberOfChannels;

      document.getElementById("duration").value = duration.toFixed(3);
      document.getElementById("fileName").value = file.name;

      processButton.classList.remove("flashing");
      processButton.style.backgroundColor = "green";
      processButton.innerText = "File Processed";
      convertButton.disabled = false;
      convertButton.classList.add("flashing");

      document.getElementById("fileName").readOnly = true;
      document.getElementById("duration").readOnly = true;

      document.getElementById("reminder").style.color = "red"; // added this line
    });
  };
  reader.onerror = function () {
    alert("Error reading file");
  };
  reader.readAsArrayBuffer(file);
});

convertButton.addEventListener("click", function () {
  var audioTypeInput = document.getElementById("audio_type");
  var fileInput = document.getElementById("file");
  var instrumentInput = document.getElementById("instrument");
  var instrumentSpecificsInput = document.getElementById(
    "instrument_specifics"
  );
  var genreInput = document.getElementById("genre");
  var keyInput = document.getElementById("key");
  var bpmInput = document.getElementById("bpm");
  var userDefinedInput = document.getElementById("user-defined");
  var noteInput = document.getElementById("note");
  var isLoopInput = document.getElementById("isLoop");
  var isLoop = isLoopInput.value.toLowerCase() === "yes" ? true : false;

  var reader = new FileReader();
  reader.onload = function (e) {
    var audioData = e.target.result;

    audioContext.decodeAudioData(audioData, function (buffer) {
      var duration = buffer.duration;

      fileInput.sampleRate = buffer.sampleRate;
      fileInput.numberOfChannels = buffer.numberOfChannels;

      document.getElementById("duration").value = duration.toFixed(3);
      document.getElementById("fileName").value = file.name;

      processButton.classList.remove("flashing");
      processButton.style.backgroundColor = "green";
      processButton.innerText = "File Processed";
      convertButton.disabled = false;
      convertButton.classList.add("flashing");

      document.getElementById("fileName").readOnly = true;
      document.getElementById("duration").readOnly = true;

      document.getElementById("reminder").style.color = "red";
    });
  };
  reader.onerror = function () {
    alert("Error reading file");
  };
  reader.readAsArrayBuffer(file);
});

convertButton.addEventListener("click", function () {
  var audioTypeInput = document.getElementById("audio_type");
  var fileInput = document.getElementById("file");
  var instrumentInput = document.getElementById("instrument");
  var instrumentSpecificsInput = document.getElementById(
    "instrument_specifics"
  );
  var genreInput = document.getElementById("genre");
  var keyInput = document.getElementById("key");
  var bpmInput = document.getElementById("bpm");
  var userDefinedInput = document.getElementById("user-defined");
  var noteInput = document.getElementById("note");
  var isLoopInput = document.getElementById("isLoop");
  var isLoop = isLoopInput.value.toLowerCase() === "yes" ? true : false;

  var file = fileInput.files[0];
  if (!file) {
    alert("Please select a file.");
    return;
  }
  if (!audioTypeInput.value) {
    alert(
      "Please select the Audio Type and add details to other fields if known."
    );
    return;
  }

  var reader = new FileReader();
  reader.onload = function (e) {
    var base64Audio = e.target.result;

    var filenameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");

    var duration = parseFloat(document.getElementById("duration").value);
    var bpm = parseFloat(bpmInput.value);
    var loopGap;
    if (bpm) {
      var beatsPerSecond = bpm / 60;
      var beatsInDuration = duration * beatsPerSecond;

      loopGap = Math.max(1, Math.round(beatsInDuration));
    } else {
      loopGap = duration * 2;
    }
    // Calculate the loop BPM
    var loopBPM;
    if (duration) {
      loopBPM = 60 / duration;
    }

    var audionalJson = {
      protocol: "audional",
      operation: "deploy",
      audionalId: generateId(),
      filename: file.name,
      audioData: base64Audio,
      metadata: {
        descriptive: {
          title: "Title of the Audio",
          creator: "Name of Creator",
          inscribersAddress: "Bitcoin Address",
          description: "Brief description about the audio",
          audioType: audioTypeInput.value,
          instrument: instrumentInput.value,
          instrumentSpecifics: instrumentSpecificsInput.value,
          genre: genreInput.value,
          key: keyInput.value,
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
        technical: {
          encodingFormat: "Base64",
          sampleRate: fileInput.sampleRate,
          numberOfChannels: fileInput.numberOfChannels,
          bitDepth: "Bit Depth of the Audio",
          duration: document.getElementById("duration").value,
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
        userDefined: userDefinedInput.value,
      },
      playbackControls: {
        note: noteInput.value,
        name: filenameWithoutExtension,
        velocity: 1.0,
        duration: document.getElementById("duration").value,
        isLoop: isLoop,
        loopGap: loopGap,
        loopBPM: loopBPM,
        playSpeed: 1.0,
        keyShift: 0,
      },
    };

    var audionalJsonString = JSON.stringify(audionalJson, null, 2);
    var audionalJsonBlob = new Blob([audionalJsonString], {
      type: "application/json",
    });
    var audionalJsonUrl = URL.createObjectURL(audionalJsonBlob);

    convertButton.classList.remove("flashing");
    convertButton.style.backgroundColor = "green";
    convertButton.innerText = "Audional JSON File Downloaded";
    document.getElementById("reminder").style.color = "grey";

    var dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(audionalJsonString);
    var downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute(
      "download",
      file.name.replace(/\.[^/.]+$/, "") + "_audional.json"
    );
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    // After downloading the file, redirect the user to audionals.com
    window.location.href = "https://www.audionals.com";

    // Enable the inscribe button when audionalJson is ready
    audionalJson = 52; // Set audionalJson to your actual JSON data
    inscribeButton.disabled = false;

    // Open new window and set audionalJson in its context when button is clicked
    inscribeButton.addEventListener("click", function () {
      var newWindow = window.open("api_call.html");
      newWindow.audionalJson = audionalJson;
    });

    reader.onerror = function () {
      alert("Error reading file");
    };

    reader.readAsDataURL(file);
  };
});
