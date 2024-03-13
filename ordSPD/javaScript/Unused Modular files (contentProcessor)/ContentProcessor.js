// ContentProcessor.js
// 
// Focused on handling different content types (e.g., JSON, HTML) and applying custom processing logic. This includes processing JSON content, placing audio or image data, and handling content loading with promises for asynchronous operations.
// 
// Functions: loadContentFromURL, processJSONContent, isValidAudionalJSON, placeAudioData, placeImageData, manageContentLoadingPromise.
// 

import { manageContentLoading } from './UrlManager.js';

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

async function fetchWithRetry(url, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Network response was not ok: ${response.statusText}`);
            return response; // Resolve with the response if successful
        } catch (error) {
            if (i === retries - 1) throw error; // If last retry, throw the error
            await new Promise(resolve => setTimeout(resolve, delay)); // Wait for a bit before retrying
        }
    }
}

async function processJSONContent(url, iframe, loadButton) {
    try {
        const response = await fetchWithRetry(url); // Use fetchWithRetry instead of fetch
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

// Modified manageContentLoading to return a Promise for asynchronous operations
// Modified manageContentLoading to return a Promise
export function manageContentLoadingPromise(iframe, url, loadButton) {
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
