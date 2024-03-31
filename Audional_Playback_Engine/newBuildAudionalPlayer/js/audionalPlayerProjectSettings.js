// audionalPlayerProjectSettings.js

class ProjectSettings {
    constructor(projectName, bpm, channelURLs, trimSettings, channelNames, sequences) {
      this.projectName = projectName;
      this.bpm = bpm;
      this.channelURLs = channelURLs; // Array of URLs
      this.trimSettings = trimSettings; // Array of Objects for each channel's trim settings
      this.channelNames = channelNames; // Array of channel names
      this.sequences = sequences; // Object containing sequence data
    }
  }
  

  