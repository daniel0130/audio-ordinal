// scripts/app.js

import { updateBookMetadata, getBookMetadata } from './bookMetadata.js';
import { addChapter, getChapters } from './chapters.js';
import { addCharacter, getCharacters } from './characters.js';
import { addTimelineEvent, getTimelines } from './timelines.js';
import { initializeUploadInfoModal } from './popup.js'; // Import the popup module

// Initialize the JSON structure
let bookData = {
  book: {
    title: "",
    synopsis: "",
    chapters: [],
    characters: [],
    timelines: []
  }
};

// Function to format date and time for the filename
function formatDateForFilename() {
  const now = new Date();
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const dateString = now.toLocaleString('en-GB', options).replace(/[\/:]/g, '-'); // Replace slashes and colons for safe filename
  return dateString;
}

// Function to update the JSON output display
function updateJSONOutput() {
  const jsonOutput = document.getElementById('jsonOutput');
  jsonOutput.textContent = JSON.stringify(bookData, null, 2);
}

// Function to download the JSON file
export function downloadJSON() {
  const formattedDate = formatDateForFilename();
  const safeTitle = bookData.book.title.replace(/[<>:"/\\|?*]/g, ''); // Remove illegal characters for filenames
  const filename = `${safeTitle || 'book'}_${formattedDate}.json`;
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bookData, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", filename);
  downloadAnchor.click();
}

// Function to upload a JSON file
export function uploadJSON(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const content = e.target.result;
      bookData = JSON.parse(content);
      populateChapterFormSelections();
      updateJSONOutput();
      alert("JSON file uploaded successfully!");
      // Populate metadata fields
      document.getElementById('bookTitle').value = bookData.book.title;
      document.getElementById('bookSynopsis').value = bookData.book.synopsis;
    } catch (error) {
      alert("Error parsing JSON file.");
    }
  };
  reader.readAsText(file);
}

// Function to search within JSON data
export function searchJSON() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  if (!query) {
    alert("Please enter a search term.");
    return;
  }
  
  const results = [];

  // Search Chapters
  getChapters(bookData).forEach(chapter => {
    if (chapter.title.toLowerCase().includes(query) || chapter.summary.toLowerCase().includes(query)) {
      results.push(`Chapter ${chapter.chapter_number}: ${chapter.title}`);
    }
  });

  // Search Characters
  getCharacters(bookData).forEach(character => {
    if (character.name.toLowerCase().includes(query) || character.bio.toLowerCase().includes(query)) {
      results.push(`Character: ${character.name}`);
    }
  });

  // Search Timelines
  getTimelines(bookData).forEach(timeline => {
    if (timeline.title.toLowerCase().includes(query)) {
      results.push(`Timeline: ${timeline.title}`);
    }
    timeline.events.forEach(event => {
      if (event.event.toLowerCase().includes(query)) {
        results.push(`Timeline Event in ${timeline.title}: ${event.event}`);
      }
    });
  });

  // Display Results
  const searchResults = document.getElementById('searchResults');
  searchResults.innerHTML = "";
  if (results.length > 0) {
    searchResults.innerHTML = "<ul class='list-group'>" + results.map(item => `<li class="list-group-item">${item}</li>`).join('') + "</ul>";
  } else {
    searchResults.textContent = "No results found.";
  }
}

// Function to populate character and timeline selections in the chapter form
function populateChapterFormSelections() {
  const chapterCharacters = document.getElementById('chapterCharacters');
  const chapterTimelines = document.getElementById('chapterTimelines');

  // Clear existing options
  chapterCharacters.innerHTML = "";
  chapterTimelines.innerHTML = "";

  // Populate characters
  getCharacters(bookData).forEach(character => {
    const option = document.createElement('option');
    option.value = character.id;
    option.textContent = character.name;
    chapterCharacters.appendChild(option);
  });

  // Populate timelines
  getTimelines(bookData).forEach(timeline => {
    const option = document.createElement('option');
    option.value = timeline.id;
    option.textContent = timeline.title;
    chapterTimelines.appendChild(option);
  });
}

// Function to save to local storage
function saveToLocalStorage() {
  localStorage.setItem('bookData', JSON.stringify(bookData));
}

// Function to load from local storage
function loadFromLocalStorage() {
  const data = localStorage.getItem('bookData');
  if (data) {
    bookData = JSON.parse(data);
    populateChapterFormSelections();
    updateJSONOutput();
    // Populate metadata fields
    document.getElementById('bookTitle').value = bookData.book.title;
    document.getElementById('bookSynopsis').value = bookData.book.synopsis;
  }
}

// Function to update and save book metadata
function updateBookMetadataAndSave(title, synopsis) {
  updateBookMetadata(bookData, title, synopsis);
  updateJSONOutput();
  saveToLocalStorage();
}

// Function to add chapter and save
function addChapterAndSave(title, summary, content, characters, timelines) {
  addChapter(bookData, title, summary, content);
  const newChapter = bookData.book.chapters[bookData.book.chapters.length - 1];
  newChapter.character_references = characters;
  newChapter.timeline_references = timelines;
  updateJSONOutput();
  saveToLocalStorage();
}

// Function to add character and save
function addCharacterAndSave(name, bio) {
  addCharacter(bookData, name, bio);
  populateChapterFormSelections();
  updateJSONOutput();
  saveToLocalStorage();
}

// Function to add timeline event and save
function addTimelineEventAndSave(title, date, eventDesc) {
  addTimelineEvent(bookData, title, date, eventDesc);
  populateChapterFormSelections();
  updateJSONOutput();
  saveToLocalStorage();
}

// Function to load a book from JSON (exposed to window)
export function loadBookFromJSON(event) {
  const file = event.target.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const content = e.target.result;
      const loadedData = JSON.parse(content);
      
      // Confirm overwriting title and synopsis if they already exist
      if (bookData.book.title || bookData.book.synopsis) {
        const overwriteWarning = confirm("Warning: This will overwrite the current title and synopsis. Do you want to proceed?");
        if (!overwriteWarning) {
          return; // Stop if user doesn't want to overwrite
        }
      }

      // Load the new book data
      bookData = loadedData;
      populateChapterFormSelections();
      updateJSONOutput();
      alert("Book loaded successfully!");

      // Populate metadata fields
      document.getElementById('bookTitle').value = bookData.book.title;
      document.getElementById('bookSynopsis').value = bookData.book.synopsis;
    } catch (error) {
      alert("Error parsing JSON file.");
    }
  };
  reader.readAsText(file);
}

// Function to handle document uploads and processing
document.getElementById('uploadDocumentForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const fileInput = document.getElementById('documentFile');
  const file = fileInput.files[0];
  const statusDiv = document.getElementById('documentProcessingStatus');

  if (!file) {
    alert("Please select a document to upload.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const content = e.target.result;
    processDocument(content, file.name, statusDiv);
  };
  reader.readAsText(file);
});

// Function to process the uploaded document
function processDocument(text, filename, statusDiv) {
  statusDiv.textContent = "Processing document...";
  
  // Simple categorization logic using Compromise
  const doc = nlp(text);
  
  let category = "Unknown";

  // Determine category based on keywords or structure
  if (filename.toLowerCase().includes("chapter")) {
    category = "Chapter";
  } else if (filename.toLowerCase().includes("character")) {
    category = "Character";
  } else if (filename.toLowerCase().includes("timeline")) {
    category = "Timeline";
  } else {
    // Further analysis using Compromise
    if (doc.has("#Person")) {
      category = "Character";
    } else if (doc.has("#Date")) {
      category = "Timeline";
    } else {
      category = "Chapter";
    }
  }

  // Integrate into bookData based on category
  switch(category) {
    case "Chapter":
      // Extract title, summary, content
      const chapterTitle = extractChapterTitle(text) || `Chapter ${bookData.book.chapters.length + 1}`;
      const chapterSummary = extractChapterSummary(text) || "No summary provided.";
      const chapterContent = text;
      addChapterAndSave(chapterTitle, chapterSummary, chapterContent, [], []);
      statusDiv.textContent = `Document categorized as Chapter: "${chapterTitle}" and added successfully.`;
      break;

    case "Character":
      // Extract name and bio
      const characterName = extractCharacterName(text) || "Unnamed Character";
      const characterBio = text;
      addCharacterAndSave(characterName, characterBio);
      statusDiv.textContent = `Document categorized as Character: "${characterName}" and added successfully.`;
      break;

    case "Timeline":
      // Extract timeline title, date, event description
      const timelineTitle = extractTimelineTitle(text) || "Untitled Timeline";
      const timelineDate = extractTimelineDate(text) || "Unknown Date";
      const timelineEvent = extractTimelineEvent(text) || "No description provided.";
      addTimelineEventAndSave(timelineTitle, timelineDate, timelineEvent);
      statusDiv.textContent = `Document categorized as Timeline Event: "${timelineEvent}" and added successfully.`;
      break;

    default:
      statusDiv.textContent = "Unable to categorize the document.";
  }

  updateJSONOutput();
}

// Helper functions to extract information (simple implementations)
function extractChapterTitle(text) {
  // Example: Assume the first line is the title
  const lines = text.split('\n');
  return lines[0].trim();
}

function extractChapterSummary(text) {
  // Example: Assume the second line is the summary
  const lines = text.split('\n');
  return lines[1]?.trim() || "No summary provided.";
}

function extractCharacterName(text) {
  // Example: Look for the first occurrence of a proper noun (using Compromise)
  const doc = nlp(text);
  const people = doc.people().out('array');
  return people[0] || "Unnamed Character";
}

function extractTimelineTitle(text) {
  // Example: Look for a line starting with "Title:"
  const match = text.match(/Title:\s*(.*)/i);
  return match ? match[1].trim() : "Untitled Timeline";
}

function extractTimelineDate(text) {
  // Example: Look for a line starting with "Date:"
  const match = text.match(/Date:\s*(.*)/i);
  return match ? match[1].trim() : "Unknown Date";
}

function extractTimelineEvent(text) {
  // Example: Look for a line starting with "Event:"
  const match = text.match(/Event:\s*(.*)/i);
  return match ? match[1].trim() : "No description provided.";
}

// Initialize the Upload Info Modal
initializeUploadInfoModal();

// Event Listeners for Forms
document.getElementById('bookMetadataForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('bookTitle').value.trim();
  const synopsis = document.getElementById('bookSynopsis').value.trim();

  if (!title || !synopsis) {
    alert("Please fill out all book metadata fields.");
    return;
  }

  updateBookMetadataAndSave(title, synopsis);
  alert("Book metadata updated!");
  this.reset();
});

document.getElementById('addChapterForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('chapterTitle').value.trim();
  const summary = document.getElementById('chapterSummary').value.trim();
  const content = document.getElementById('chapterContent').value.trim();
  const selectedCharacters = Array.from(document.getElementById('chapterCharacters').selectedOptions).map(option => option.value);
  const selectedTimelines = Array.from(document.getElementById('chapterTimelines').selectedOptions).map(option => option.value);

  if (!title || !summary || !content) {
    alert("Please fill out all chapter fields.");
    return;
  }

  addChapterAndSave(title, summary, content, selectedCharacters, selectedTimelines);
  alert("New chapter added with links!");
  this.reset();
});

document.getElementById('addCharacterForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('characterName').value.trim();
  const bio = document.getElementById('characterBio').value.trim();

  if (!name || !bio) {
    alert("Please fill out all character fields.");
    return;
  }

  addCharacterAndSave(name, bio);
  alert("New character added!");
  this.reset();
});

document.getElementById('addTimelineForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const title = document.getElementById('timelineTitle').value.trim();
  const date = document.getElementById('timelineDate').value.trim();
  const eventDesc = document.getElementById('timelineEvent').value.trim();

  if (!title || !date || !eventDesc) {
    alert("Please fill out all timeline fields.");
    return;
  }

  addTimelineEventAndSave(title, date, eventDesc);
  alert("New timeline event added!");
  this.reset();
});

// Initial population of chapter form selections
populateChapterFormSelections();

// Load data from local storage on initial load
loadFromLocalStorage();

// Attach utility functions to the global window object for accessibility
window.downloadJSON = downloadJSON;
window.uploadJSON = uploadJSON;
window.searchJSON = searchJSON;
window.loadBookFromJSON = loadBookFromJSON;

// Initial display
updateJSONOutput();
