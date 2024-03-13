// ContentLoader.js

 // Array of URLs to preload
 const preloadUrls = [
    "https://ordinals.com/content/e7d344ef3098d0889856978c4d2e81ccf2358f7f8b66feecc71e03036c59ad48i0",
    "https://ordinals.com/content/ef5707e6ecf4d5b6edb4c3a371ca1c57b5d1057c6505ccb5f8bdc8918b0c4d94i0",
    "https://ordinals.com/content/d030eb3d8bcd68b0ed02b0c67fdb981342eea40b0383814f179a48e76927db93i0",
    "https://ordinals.com/content/3b7482a832c4f27c32fc1da7cc4249bbbac1cbdfbdb8673079cad0c33486d233i0",
    "https://ordinals.com/content/5a42d7b2e2fe01e4f31cbad5dd671997f87339d970faaab37f6355c4a2f3be5ai0",
    "https://ordinals.com/content/ddc1838c1a6a3c45b2c6e19ff278c3b51b0797c3f1339c533370442d23687a68i0",
    "https://ordinals.com/content/1e3c2571e96729153e4b63e2b561d85aec7bc5ba372d293af469a525dfa3ed59i0",
    "https://ordinals.com/content/91f52a4ca00bb27383ae149f24b605d75ea99df033a6cbb6de2389455233bf51i0",
    "https://ordinals.com/content/437868aecce108d49f9b29c2f477987cb5834ffdf639a650335af7f0fdd5e55bi0",
    "https://ordinals.com/content/3be1f8e37b718f5b9874aecad792504c5822dc8dfc727ad4928594f7725db987i0"
  ];

  export function preloadContent() {
    const iframes = document.querySelectorAll('iframe');
    const loadButtons = document.querySelectorAll('.load-button'); // Ensure there's a load button for each iframe
  
    // Load the first 5 URLs into the first 10 iframes, twice each
    for (let i = 0; i < 10; i += 2) {
        manageContentLoading(iframes[i], preloadUrls[i / 2], loadButtons[i]);
        manageContentLoading(iframes[i + 1], preloadUrls[i / 2], loadButtons[i + 1]);
    }
  
    // Load four instances of the 6th, 7th, and 8th URLs into the next 12 iframes
    for (let i = 10, urlIndex = 5; i < 22; i += 4) {
        for (let j = 0; j < 4; j++) {
            manageContentLoading(iframes[i + j], preloadUrls[urlIndex], loadButtons[i + j]);
        }
        urlIndex++;
    }
  
    // Load the last two URLs into the final four iframes, twice each
    for (let i = 22, urlIndex = 8; i < iframes.length && i < 26; i += 2) {
        manageContentLoading(iframes[i], preloadUrls[urlIndex], loadButtons[i]);
        manageContentLoading(iframes[i + 1], preloadUrls[urlIndex], loadButtons[i + 1]);
        urlIndex++;
    }
  }


  export function loadContentFromURL(iframe, loadButton) {
    const url = prompt("Please enter the URL:");
    if (!url) return;

    // Hide the load button initially, to be shown again in case of loading failure
    loadButton.classList.add('hidden');

    const jsonUrlPattern = /\.json$/; // Example pattern for JSON URLs

    if (jsonUrlPattern.test(url)) {
        // Delegate to JSON content handler
        processJSONContent(url, iframe, loadButton);
    } else {
        // Delegate to HTML content handler
        manageContentLoading(iframe, url, loadButton);
      }
}




async function processJSONContent(url, iframe, loadButton) {
  try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
      const jsonData = await response.json();

      if (!isValidAudionalJSON(jsonData)) {
          throw new Error("Invalid JSON format for audional content");
      }

      // Process and place the audio data directly into the pad
      placeAudioData(jsonData.audioData, iframe);

      // Optionally, process and place image data if exists
      if (jsonData.imageData) {
          placeImageData(jsonData.imageData, iframe);
      }

      console.log("JSON content processed successfully");
      loadButton.classList.add('hidden'); // Hide load button upon successful loading
  } catch (error) {
      console.error('Error:', error);
      alert("There was an issue loading the JSON content.");
      loadButton.classList.remove('hidden'); // Show load button again upon failure
  }
}

function isValidAudionalJSON(jsonData) {
  return jsonData.protocol === "audional" && jsonData.operation === "deploy" && jsonData.audioData;
}

function placeAudioData(audioData, iframe) {
  // Custom logic to place audio data into the pad
  console.log("Placing audio data into the pad...");
  // Example implementation might involve decoding the base64 audio data and attaching it to an audio element
}

function placeImageData(imageData, iframe) {
  // Custom logic to place image data into the pad
  console.log("Placing image data into the pad...");
  // Example implementation might involve decoding the base64 image data and displaying it alongside the audio
}
   



  
  function randomizeSamplesAndLoad() {
    const iframes = document.querySelectorAll('iframe');
    if (iframes.length !== 36) {
      console.error('Expected 36 iframes for sample placement.');
      return;
    }
  
    // Function to get a random sample mix
    function getRandomSampleMix() {
      let mix = [];
      for (let i = 0; i < 36; i++) {
        const randomIndex = Math.floor(Math.random() * preloadUrls.length);
        mix.push(randomIndex);
      }
      return mix;
    }
  
  
    // Load the randomized samples into the iframes and wait for all to load
    const randomMix = getRandomSampleMix();
    const loadPromises = randomMix.map((index, iframeIndex) => {
      const url = preloadUrls[index];
      const iframe = iframes[iframeIndex];
      const loadButton = document.querySelectorAll('.load-button')[iframeIndex];
      return manageContentLoadingPromise(iframe, url, loadButton);
    });
  
    // Wait for all iframes to load their content, then randomize play speeds
    // Wait for all iframes to load their content, then randomize play speeds and schedule multipliers
    Promise.all(loadPromises).then(() => {
      console.log('All samples loaded, randomizing play speeds and schedule multipliers...');
      randomizePlaySpeeds();
      randomizeScheduleMultipliers(); // Ensure this function is called here
    }).catch(error => {
      console.error('An error occurred while loading samples:', error);
    });

  }
  
  // Attach this function to your random mix button's click event
  document.querySelector('.random-mix-btn').addEventListener('click', randomizeSamplesAndLoad);
  


  export function randomizePlaySpeeds() {
    const iframes = document.querySelectorAll('iframe');
  
    iframes.forEach((iframe) => {
      const src = iframe.getAttribute('src');
      const origin = new URL(src).origin;
      let randomSpeed;
  
      // Determine the speed range based on the specified probabilities
      const rand = Math.random();
      if (rand < 0.33) {
        // 33% chance for speed to be between 0.2 and 0.8
        randomSpeed = (Math.random() * (0.8 - 0.2) + 0.2).toFixed(2);
      } else if (rand < 0.63) { // 33% + 30%
        // 30% chance for speed to be between 0.8 and 2
        randomSpeed = (Math.random() * (2 - 0.8) + 0.8).toFixed(2);
      } else {
        // Remaining 37% chance for speed to be between 3 and 100
        randomSpeed = (Math.random() * (100 - 3) + 3).toFixed(2);
      }
  
      const messageData = { type: "playAtSpeed", data: { speed: randomSpeed } };

      // Update global settings object
      window.iframeSettings[iframe.id] = window.iframeSettings[iframe.id] || {};
      window.iframeSettings[iframe.id].playSpeed = randomSpeed; // Record the playSpeed

  
      // Directly post the message to the iframe's contentWindow
      if (iframe.contentWindow) {
        iframe.contentWindow.postMessage(messageData, origin);
        console.log(`Randomized play speed for ${iframe.id || "an iframe"} to ${randomSpeed}x.`);
      }
    });
  }
  
  window.randomizePlaySpeeds = randomizePlaySpeeds;
  
  export function randomizeScheduleMultipliers() {
    const iframes = document.querySelectorAll('iframe');
  
    iframes.forEach((iframe) => {
      const src = iframe.getAttribute('src');
      const origin = new URL(src).origin;
  
      // Randomly decide to increase or decrease the schedule multiplier
      const actionType = Math.random() < 0.5 ? "increaseScheduleMultiplier" : "decreaseScheduleMultiplier";
  
      // Randomly decide how many times to simulate the key press (1, 2, or 3 times)
      const repetitions = Math.floor(Math.random() * 3) + 1;
  
      // Post the message the decided number of times
      for (let i = 0; i < repetitions; i++) {
        const messageData = { type: actionType };
        // Since multiple messages might be posted, consider how to reflect this in settings.
        // For simplicity, we'll record the actionType and repetitions.
        window.iframeSettings[iframe.id] = window.iframeSettings[iframe.id] || {};
        window.iframeSettings[iframe.id].scheduleMultiplierAction = actionType; // Example way to record
        window.iframeSettings[iframe.id].scheduleMultiplierRepetitions = repetitions; // Record repetitions

  
        // Directly post the message to the iframe's contentWindow
        if (iframe.contentWindow) {
          iframe.contentWindow.postMessage(messageData, origin);
          console.log(`Simulated ${actionType} ${i + 1} time(s) for iframe with src ${src}.`);
        }
      }
    });
  }
  
  window.randomizeScheduleMultipliers = randomizeScheduleMultipliers;
  


  // Function to manage content loading with visibility control for the load button
  function manageContentLoading(iframe, url, loadButton) {
    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
        return response.text();
      })
      .then(html => {
        const blob = new Blob([html], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);
        iframe.src = blobUrl;
        iframe.onload = () => {
          URL.revokeObjectURL(blobUrl);
          // Hide the load button once content is successfully loaded
          if (loadButton) {
            loadButton.classList.add('hidden');
          }
        };
      })
      .catch(error => {
        console.error('Error:', error);
        alert("There was an issue loading the content.");
        // Show the load button again if content loading fails
        if (loadButton) {
          loadButton.classList.remove('hidden');
        }
      });
  }
  
  
      // Modified manageContentLoading to return a Promise
      function manageContentLoadingPromise(iframe, url, loadButton) {
        return new Promise((resolve, reject) => {
          fetch(url)
            .then(response => {
              if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
              return response.text();
            })
            .then(html => {
              const blob = new Blob([html], { type: 'text/html' });
              const blobUrl = URL.createObjectURL(blob);
              iframe.src = blobUrl;
              iframe.onload = () => {
                URL.revokeObjectURL(blobUrl);
                if (loadButton) loadButton.classList.add('hidden');
                resolve(); // Resolve the promise when content is successfully loaded
              };
            })
            .catch(error => {
              console.error('Error:', error);
              if (loadButton) loadButton.classList.remove('hidden');
              reject(error); // Reject the promise if loading fails
            });
        });
      }