// Disable typing in the audio type input
var audioTypeInput = document.getElementById("audio_type");
audioTypeInput.addEventListener("keydown", function (e) {
  e.preventDefault();
});



// Hash audioData function
async function digestMessage(message) {
  const msgUint8 = new TextEncoder().encode(message); // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest("SHA-1", msgUint8); // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer)); // convert buffer to byte array
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join(""); // convert bytes to hex string
  return hashHex;
}






// Store elements to avoid repeated DOM queries
const fileInput = document.getElementById("file");
const processButton = document.getElementById("process");
const convertButton = document.getElementById("convert");
const reminder = document.getElementById("reminder");
const audionalJsonTextarea = document.getElementById("audional-json");
const startInscriptionProcessButton = document.getElementById(
  "startInscriptionProcess"
);
const inscriptionPreviewContainer = document.getElementById(
  "inscriptionPreviewContainer"
);
const doInscribe = document.getElementById("doInscribe");
const estimatedFeesSpan = document.getElementById("estimatedFees");
const networkFeeRateSpan = document.getElementById("networkFeeRate");
const recipientAddress = document.getElementById("ordinalRecipientAddress");
const invoiceAddress = document.getElementById("invoiceAddress");
const invoiceAmount = document.getElementById("invoiceAmount");
const inscriptionInvoiceContainer = document.getElementById(
  "inscriptionInvoiceContainer"
);
const inscriptionRequestId = document.getElementById("inscriptionRequestId");

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
  convertButton.innerText = "Generate Audional JSON";
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
  var isLoopRadio = document.querySelector('input[name="isLoop"]:checked');
  var isLoop = isLoopRadio ? isLoopRadio.value.toLowerCase() === "yes" : false;

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
  var instrumentSpecificsInput = document.getElementById("instrument_specifics");
  var genreInput = document.getElementById("genre");
  var keyInput = document.getElementById("key");
  var bpmInput = document.getElementById("bpm");
  var userDefinedInput = document.getElementById("user-defined");
  var noteInput = document.getElementById("note");
  var creatorInput = document.getElementById("creator"); // Make sure this input exists in your HTML

  var audioType = audioTypeInput.value ? audioTypeInput.value : "None given";
  var file = fileInput.files.length > 0 ? fileInput.files[0] : "None given";
  var instrument = instrumentInput.value ? instrumentInput.value : "None given";
  var instrumentSpecifics = instrumentSpecificsInput.value ? instrumentSpecificsInput.value : "None given";
  var genre = genreInput.value ? genreInput.value : "None given";
  var key = keyInput.value ? keyInput.value : "None given";
  var bpm = bpmInput.value ? bpmInput.value : "None given";
  var userDefined = userDefinedInput.value ? userDefinedInput.value : "None given";
  var note = noteInput.value ? noteInput.value : "None given";
  var creator = creatorInput.value ? creatorInput.value : "None given";

  var isLoopRadio = document.querySelector('input[name="isLoop"]:checked');
  var isLoop = isLoopRadio ? isLoopRadio.value.toLowerCase() === "yes" : false;


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
  reader.onload = async function (e) {
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
   
    var hash = await digestMessage(base64Audio);
  
    var audionalJson = {
      protocol: "audional",
      operation: "deploy",
      audionalId: hash,
      filename: file.name,
      audioData: base64Audio,
      metadata: {
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
    },
    };

    var audionalJsonString = JSON.stringify(audionalJson, null, 2);
    var audionalJsonBlob = new Blob([audionalJsonString], {
      type: "application/json",
    });
    var audionalJsonUrl = URL.createObjectURL(audionalJsonBlob);

    convertButton.classList.remove("flashing");
    convertButton.style.backgroundColor = "green";
    convertButton.innerText = "Audional JSON Created";
    document.getElementById("reminder").style.color = "grey";

    var dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(audionalJsonString);
    // set audionalJsonTextarea to dataStr
    audionalJsonTextarea.value = audionalJsonString;
    // show audionalJsonTextarea
    audionalJsonTextarea.style.display = "block";

    // show startInscriptionProcessButton
    startInscriptionProcessButton.style.display = "inline";
    // enable startInscriptionProcessButton
    startInscriptionProcessButton.disabled = false;

    // var downloadAnchorNode = document.createElement("a");
    // downloadAnchorNode.setAttribute("href", dataStr);
    // downloadAnchorNode.setAttribute(
    //   "download",
    //   file.name.replace(/\.[^/.]+$/, "") + "_audional.json"
    // );
    // document.body.appendChild(downloadAnchorNode);
    // downloadAnchorNode.click();
    // downloadAnchorNode.remove();

    // After downloading the file, redirect the user to audionals.com
    //   window.location.href = "https://www.audionals.com";
  };

  reader.onerror = function () {
    alert("Error reading file");
  };

  reader.readAsDataURL(file);
});

// Start Inscription Process
startInscriptionProcessButton.addEventListener("click", async function () {
  //   console.log("startInscriptionProcessButton clicked");

  // get reccomended fee
  //   var feeRate = await getRecommendedNetworkFeeRates();

  //   console.log("feeRates", feeRate.high_fee_rate);

  var audionalJsonObject = JSON.parse(audionalJsonTextarea.value);

  var inscriptionPreview = await getInscriptionPreview(audionalJsonObject);
  //   console.log(inscriptionPreview);

  var totalFees = inscriptionPreview.calculated_fee_summary.high.total_fee_sats;

  // hide audionalJsonTextarea
  audionalJsonTextarea.style.display = "none";

  // show inscriptionPreviewArea
  inscriptionPreviewContainer.style.display = "block";

  // update span with id estimatedFees to totalFees

  estimatedFeesSpan.value = totalFees;
  networkFeeRateSpan.value =
    inscriptionPreview.calculated_fee_summary.high.network_fee_rate;
});

doInscribe.addEventListener("click", async function () {
  // get recipientAddress and verify it starts with bc1
  const recipientAddressValue = recipientAddress.value;
  if (!validateTaprootAddress(recipientAddressValue)) {
    alert("Recipient Address must be a taproot address.");
    return;
  }

  var audionalJsonObject = JSON.parse(audionalJsonTextarea.value);

  const inscriptionRequest = {
    btc_ordinal_recipient_address: recipientAddressValue,
    btc_refund_recipient_address: "",
    expected_total_fee_sats: estimatedFeesSpan.value,
    file: audionalJsonObject,
    keep_high_res: true,
    network_fee_rate: networkFeeRateSpan.value,
    submitter_email_address: "",
  };
  const inscriptionRequestResults = await requestInscription(
    inscriptionRequest
  );
  console.log(inscriptionRequestResults);

  // show inscriptionInvoiceContainer
  inscriptionInvoiceContainer.style.display = "block";

  generateBitcoinPaymentQRCode(
    inscriptionRequestResults.btc_deposit_address,
    inscriptionRequestResults.total_request_fee_sats
  );
  // update the input invoiceAmount with inscriptionRequestResults.total_request_fee_sats
  invoiceAddress.value = inscriptionRequestResults.btc_deposit_address;
  // update the input invoiceAddress with inscriptionRequestResults.btc_deposit_address
  invoiceAmount.value = inscriptionRequestResults.total_request_fee_sats;
  inscriptionRequestId.value = inscriptionRequestResults.id;
});

// TODO: Add validation for recipient address
const validateTaprootAddress = (address) => {
  const prefix = "bc1";
  return address.startsWith(prefix);
  //   const length = address.length;
  //   if (address.substring(0, prefix.length) !== prefix) {
  //     return false;
  //   }
  //   if (length !== 66) {
  //     return false;
  //   }
  //   const checksum = address.substring(length - 6);
  //   const hash = sha256(address.substring(prefix.length, length - 6));
  //   const expectedChecksum = ripemd160(hash).slice(0, 4);
  //   if (checksum !== expectedChecksum) {
  //     return false;
  //   }
  //   return true;
};

function generateBitcoinPaymentQRCode(
  btc_deposit_address,
  total_request_fee_sats
) {
  // Convert Satoshi to Bitcoin
  const satToBtc = total_request_fee_sats / 1e8;

  // Construct Bitcoin URI
  const paymentURI = `bitcoin:${btc_deposit_address}?amount=${satToBtc}&label=${encodeURIComponent(
    "Audionals.com"
  )}`;

  // Clear previous QR Code
  document.getElementById("qrcode").innerHTML = "";

  // Generate new QR Code
  new QRCode(document.getElementById("qrcode"), {
    text: paymentURI,
    width: 128,
    height: 128,
    colorDark: "#000000",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.H,
  });
}
