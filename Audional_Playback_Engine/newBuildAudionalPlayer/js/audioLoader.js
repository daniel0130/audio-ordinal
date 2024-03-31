// audioLoader.js

class AudioLoader {
    constructor(audioContext) {
      this.audioContext = audioContext;
      this.audioBuffers = new Map(); // Cache audio buffers to avoid reloading
    }
  
    // Entry point for processing channel URLs
    async processChannelURLs(channelURLs) {
      for (let i = 0; i < channelURLs.length; i++) {
        const url = channelURLs[i];
        if (url) {
          await this.fetchAudio(url, i);
        }
      }
    }
  
    // Fetch and process audio data from URL
    async fetchAudio(url, index) {
      const formattedUrl = this.formatURL(url);
      console.log("Fetching Audio URL:", formattedUrl, "Channel Index:", index);
  
      try {
        const response = await fetch(formattedUrl);
        const contentType = response.headers.get("Content-Type");
        let audioBuffer;
  
        if (contentType && contentType.includes("text/html")) {
          const htmlContent = await response.text();
          audioBuffer = await this.processHTMLContent(htmlContent, index);
        } else {
          audioBuffer = await response.arrayBuffer();
        }
  
        if (audioBuffer) {
          const decodedAudioBuffer = await this.decodeAudioData(audioBuffer);
          this.audioBuffers.set(formattedUrl, decodedAudioBuffer);
          console.log("Audio buffer stored for URL:", formattedUrl);
        }
      } catch (error) {
        console.error("Error fetching audio from URL:", formattedUrl, error);
      }
    }
  
    // Handle HTML content to extract audio data
    async processHTMLContent(htmlContent, index) {
      const audioData = this.importHTMLAudioData(htmlContent, index);
      if (!audioData) return null;
      return audioData.startsWith("data:") ? this.base64ToArrayBuffer(audioData.split(",")[1]) : await fetch(audioData).then(res => res.arrayBuffer());
    }
  
    importHTMLAudioData(htmlContent, index) {
      const doc = new DOMParser().parseFromString(htmlContent, "text/html");
      const audioSource = doc.querySelector("audio source");
  
      if (audioSource && (audioSource.src.startsWith("data:audio/wav;base64,") || audioSource.src.startsWith("data:audio/mp3;base64,"))) {
        return audioSource.src;
      } else {
        console.error("No suitable audio source found in HTML content for channel index:", index);
        return null;
      }
    }
  
    base64ToArrayBuffer(base64) {
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return bytes.buffer;
    }
  
    // Decode audio data into an audio buffer
    decodeAudioData(arrayBuffer) {
      return this.audioContext.decodeAudioData(arrayBuffer)
        .then(audioBuffer => {
          console.log("Audio data decoded successfully.");
          return audioBuffer;
        })
        .catch(error => {
          console.error("Error decoding audio data:", error);
          throw error;
        });
    }
  
    // Placeholder for URL formatting function
    formatURL(url) {
      // Implement any necessary URL formatting here
      return url;
    }
  }
  
  // Example usage
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  const audioLoader = new AudioLoader(audioContext);
  
  // Assuming 'channelURLs' is an array of URLs for the audio files
  audioLoader.processChannelURLs(channelURLs)
    .then(() => {
      console.log("All audio channels processed and buffered.");
    })
    .catch(error => {
      console.error("Error processing audio channels:", error);
    });
  