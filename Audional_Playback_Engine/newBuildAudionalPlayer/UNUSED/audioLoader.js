// audioLoader.js

class AudioLoader {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.audioBuffers = new Map(); // Cache audio buffers to avoid reloading
  }

  // Entry point for processing channel URLs
  // Adjusted to receive an array of objects with URL and trim times
  async processChannelURLs(channels) {
    for (const channel of channels) {
      await this.fetchAudio(channel.url, channel.startTrim, channel.endTrim);
    }
  }

  // Adjusted to receive startTrim and endTrim
  async fetchAudio(url, startTrim, endTrim) {
    const formattedUrl = this.formatURL(url);
    console.log("Fetching Audio URL:", formattedUrl, "Trim Start:", startTrim, "Trim End:", endTrim);

    try {
      const response = await fetch(formattedUrl);
      const contentType = response.headers.get("Content-Type");
      let audioBuffer;

      if (contentType && contentType.includes("text/html")) {
        const htmlContent = await response.text();
        audioBuffer = await this.processHTMLContent(htmlContent);
      } else {
        audioBuffer = await response.arrayBuffer();
      }

      if (audioBuffer) {
        const decodedAudioBuffer = await this.decodeAudioData(audioBuffer);
        // Assuming you have a method to apply trimming to the decoded buffer
        const trimmedBuffer = await this.applyTrimming(decodedAudioBuffer, startTrim, endTrim);
        this.audioBuffers.set(formattedUrl, trimmedBuffer);
        console.log("Audio buffer stored for URL:", formattedUrl, "with trimming applied.");
      }
    } catch (error) {
      console.error("Error fetching audio from URL:", formattedUrl, error);
    }
  }

  // Placeholder method to demonstrate trimming
  async applyTrimming(audioBuffer, startTrim, endTrim) {
    // Implementation would go here. This could involve:
    // - Creating a new AudioBuffer of the appropriate length
    // - Copying samples from the original buffer to the new buffer based on trim times
    // - Handling cases where trim times are outside the buffer's duration
    return audioBuffer; // Placeholder
  }

  // Handle HTML content to extract audio data
  async processHTMLContent(htmlContent, index) {
    const audioData = await this.importHTMLAudioData(htmlContent, index);
    if (!audioData) return null;
    return audioData.startsWith("data:") ? this.base64ToArrayBuffer(audioData.split(",")[1]) : await fetch(audioData).then(res => res.arrayBuffer());
}

async importHTMLAudioData(htmlContent, index) {
    console.log("[importHTMLAudioData] Entered function with index: ", index);
    
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, "text/html");
        const audioSource = doc.querySelector("audio[data-audionalSampleName] source");
        
        if (audioSource) {
            const src = audioSource.getAttribute("src");
            
            if (src.toLowerCase().startsWith("data:audio/wav;base64,") || src.toLowerCase().startsWith("data:audio/mp3;base64,")) {
                console.log("[importHTMLAudioData] Extracted base64 audio data.");
                return src;
            } else {
                console.error("[importHTMLAudioData] Audio data does not start with expected base64 prefix.");
            }
        } else {
            console.error("[importHTMLAudioData] Could not find the audio source element in the HTML content.");
        }
    } catch (error) {
        console.error("[importHTMLAudioData] Error parsing HTML content: ", error);
    }
    
    return null;
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

// Proper instantiation and example usage:

// Instantiate the AudioLoader with a new AudioContext.
const audioLoader = new AudioLoader(new (window.AudioContext || window.webkitAudioContext)());

// This should be wrapped in a function or conditional to ensure 'channelURLs' is defined before use.
/*
if (typeof channelURLs !== 'undefined') {
  audioLoader.processChannelURLs(channelURLs)
      .then(() => {
          console.log("All audio channels processed and buffered.");
      })
      .catch(error => {
          console.error("Error processing audio channels:", error);
      });
}
*/

// Note: The above block using 'channelURLs' should only be executed where 'channelURLs' is defined to avoid errors.
