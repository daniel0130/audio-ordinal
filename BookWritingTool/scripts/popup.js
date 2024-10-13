// scripts/popup.js

// Utility Functions for Data Management
const STORAGE_KEYS = {
  chapters: 'bookOrganizer_chapters',
  characters: 'bookOrganizer_characters',
  timelines: 'bookOrganizer_timelines'
};

// Retrieve data from localStorage or initialize as empty array
function getData(key) {
  const data = localStorage.getItem(STORAGE_KEYS[key]);
  return data ? JSON.parse(data) : [];
}

function setData(key, data) {
  localStorage.setItem(STORAGE_KEYS[key], JSON.stringify(data));
}

// Function to render lists
function renderList(key, listElementId) {
  const data = getData(key);
  const listElement = document.getElementById(listElementId);
  listElement.innerHTML = ''; // Clear existing list

  data.forEach((item, index) => {
    const listItem = document.createElement('li');
    listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
    listItem.innerHTML = `
      <span>${item.name || item.title || `Chapter ${index + 1}`}</span>
      <div>
        <button class="btn btn-sm btn-primary edit-btn" data-key="${key}" data-index="${index}">Edit</button>
        <button class="btn btn-sm btn-danger delete-btn" data-key="${key}" data-index="${index}">Delete</button>
      </div>
    `;
    listElement.appendChild(listItem);
  });

  // Attach event listeners for edit and delete buttons
  document.querySelectorAll(`#${listElementId} .edit-btn`).forEach(button => {
    button.addEventListener('click', handleEdit);
  });

  document.querySelectorAll(`#${listElementId} .delete-btn`).forEach(button => {
    button.addEventListener('click', handleDelete);
  });
}

// Handle Edit Action
function handleEdit(event) {
  const key = event.target.getAttribute('data-key');
  const index = event.target.getAttribute('data-index');
  const data = getData(key);
  const item = data[index];

  // Prompt user for new data (for simplicity, using prompt dialogs)
  let updatedItem = { ...item };
  if (key === 'chapters') {
    updatedItem.title = prompt('Enter new chapter title:', item.title);
    if (updatedItem.title === null) return; // User cancelled
    updatedItem.summary = prompt('Enter new chapter summary:', item.summary);
    if (updatedItem.summary === null) return;
    updatedItem.content = prompt('Enter new chapter content:', item.content);
    if (updatedItem.content === null) return;
  } else if (key === 'characters') {
    updatedItem.name = prompt('Enter new character name:', item.name);
    if (updatedItem.name === null) return;
    updatedItem.biography = prompt('Enter new character biography:', item.biography);
    if (updatedItem.biography === null) return;
  } else if (key === 'timelines') {
    updatedItem.title = prompt('Enter new timeline title:', item.title);
    if (updatedItem.title === null) return;
    updatedItem.date = prompt('Enter new event date (e.g., 2135 CE):', item.date);
    if (updatedItem.date === null) return;
    updatedItem.event = prompt('Enter new event description:', item.event);
    if (updatedItem.event === null) return;
  }

  // Update data and re-render list
  data[index] = updatedItem;
  setData(key, data);
  renderAllLists();
}

// Handle Delete Action
function handleDelete(event) {
  const key = event.target.getAttribute('data-key');
  const index = event.target.getAttribute('data-index');
  let data = getData(key);

  if (confirm('Are you sure you want to delete this item?')) {
    data.splice(index, 1);
    setData(key, data);
    renderAllLists();
  }
}

// Function to render all lists
function renderAllLists() {
  renderList('chapters', 'chaptersList');
  renderList('characters', 'charactersList');
  renderList('timelines', 'timelinesList');
}

// Function to add new entries (Chapters, Characters, Timelines)
function addNewEntry(key, entry) {
  const data = getData(key);
  data.push(entry);
  setData(key, data);
  renderAllLists();
}

// Initialize Upload Info Modal with Management Features
export function initializeUploadInfoModal() {
    const modalBody = document.querySelector('#uploadInfoModal .modal-body');
    const infoContent = `
      <h5>How to Utilize the Document Reader</h5>
      <p>
        The <strong>Upload Document</strong> feature allows you to seamlessly integrate your existing documents into the Book Organizer Tool. To ensure optimal processing and categorization, please follow the guidelines below:
      </p>
      <h6>Supported File Formats</h6>
      <ul>
        <li><strong>.txt</strong>: Plain text files.</li>
        <li><strong>.md</strong>: Markdown files with basic formatting.</li>
        <li><strong>.json</strong>: JSON files structured according to the tool's schema.</li>
      </ul>
      <h6>Proper Usage and Formatting</h6>
      <p>To facilitate accurate categorization of your documents into <em>Chapters</em>, <em>Characters</em>, or <em>Timelines</em>, adhere to the following formatting conventions:</p>
      <h6>1. Chapter Documents</h6>
      <ul>
        <li><strong>Filename:</strong> Should include the word "chapter" (e.g., <code>chapter1.txt</code>).</li>
        <li><strong>Structure:</strong>
          <ul>
            <li>The first line should be the chapter title, prefixed with "Chapter" and the chapter number (e.g., <code>Chapter 1: The Awakening</code>).</li>
            <li>The second line should provide a brief summary of the chapter.</li>
            <li>The subsequent lines contain the full content of the chapter.</li>
          </ul>
        </li>
      </ul>
      <h6>2. Character Documents</h6>
      <ul>
        <li><strong>Filename:</strong> Should include the word "character" (e.g., <code>character_john_doe.txt</code>).</li>
        <li><strong>Structure:</strong>
          <ul>
            <li>The first line should be the character's name.</li>
            <li>The following lines should contain the character's biography and background information.</li>
          </ul>
        </li>
      </ul>
      <h6>3. Timeline Documents</h6>
      <ul>
        <li><strong>Filename:</strong> Should include the word "timeline" (e.g., <code>timeline_battle_of_mars.txt</code>).</li>
        <li><strong>Structure:</strong>
          <ul>
            <li><strong>Title:</strong> Start with "Title:" followed by the timeline's title.</li>
            <li><strong>Date:</strong> Start with "Date:" followed by the event date (e.g., <code>Date: 2135 CE</code>).</li>
            <li><strong>Event Description:</strong> Start with "Event:" followed by a brief description of the event.</li>
          </ul>
        </li>
      </ul>
      <h6>Examples:</h6>
      <p><strong>Chapter Document:</strong></p>
      <pre><code>Chapter 1: The Awakening
In the distant future, humanity faces unprecedented challenges...
[Full content of the chapter]
</code></pre>
      <p><strong>Character Document:</strong></p>
      <pre><code>John Doe
John is a skilled pilot with a mysterious past...
</code></pre>
      <p><strong>Timeline Document:</strong></p>
      <pre><code>Title: Battle of Mars
Date: 2135 CE
Event: The first major conflict on Mars erupts between Earth forces and Martian settlers.
</code></pre>
      <h6>Additional Tips:</h6>
      <ul>
        <li>Ensure that there are no blank lines between the defined sections unless necessary for readability.</li>
        <li>Consistently use the specified prefixes ("Chapter", "Title:", "Date:", "Event:") to aid accurate categorization.</li>
        <li>Review your documents for typos or formatting inconsistencies to enhance processing accuracy.</li>
      </ul>
      <p>
        Following these guidelines will ensure that your documents are correctly categorized and seamlessly integrated into your sci-fi epic organization workflow.
      </p>
      <button id="togglePromptButton" class="btn btn-info">Helpful Prompt for AI Assistants</button>
      <div id="aiPrompt" style="display: none; margin-top: 10px;">
        <h6>Prompt for Document Formatting:</h6>
        <p>Please read through the uploaded document and format the information according to the following guidelines to ensure it can be integrated into the Book Organizer Tool.</p>
        <h6>Document Formatting Instructions:</h6>
        <ol>
          <li><strong>Chapter Documents:</strong> Ensure the filename includes "chapter" (e.g., chapter1.txt) and follow the structure outlined.</li>
          <li><strong>Character Documents:</strong> Ensure the filename includes "character" (e.g., character_john_doe.txt) and follow the structure outlined.</li>
          <li><strong>Timeline Documents:</strong> Ensure the filename includes "timeline" (e.g., timeline_battle_of_mars.txt) and follow the structure outlined.</li>
        </ol>
        <p>Once formatted, please provide a summary of the changes made, highlighting how the document aligns with the guidelines above.</p>
      </div>

      <!-- Management Sections -->
      <hr>
      <h5>Manage Your Book</h5>

      <!-- Chapters Section -->
      <div id="chaptersSection">
        <h6>Chapters</h6>
        <button class="btn btn-sm btn-success mb-2" id="addChapterBtn">Add Chapter</button>
        <ul id="chaptersList" class="list-group">
          <!-- Dynamically populated list of chapters -->
        </ul>
      </div>

      <!-- Characters Section -->
      <div id="charactersSection" style="margin-top: 20px;">
        <h6>Characters</h6>
        <button class="btn btn-sm btn-success mb-2" id="addCharacterBtn">Add Character</button>
        <ul id="charactersList" class="list-group">
          <!-- Dynamically populated list of characters -->
        </ul>
      </div>

      <!-- Timelines Section -->
      <div id="timelinesSection" style="margin-top: 20px;">
        <h6>Timelines</h6>
        <button class="btn btn-sm btn-success mb-2" id="addTimelineBtn">Add Timeline</button>
        <ul id="timelinesList" class="list-group">
          <!-- Dynamically populated list of timelines -->
        </ul>
      </div>
    `;
    modalBody.innerHTML = infoContent;

    // Add event listener to toggle prompt visibility
    document.getElementById('togglePromptButton').addEventListener('click', () => {
        const aiPrompt = document.getElementById('aiPrompt');
        aiPrompt.style.display = aiPrompt.style.display === 'none' ? 'block' : 'none';
    });

    // Render existing lists
    renderAllLists();

    // Add event listeners for adding new entries
    document.getElementById('addChapterBtn').addEventListener('click', () => {
      const title = prompt('Enter Chapter Title:');
      if (!title) return;
      const summary = prompt('Enter Chapter Summary:');
      if (summary === null) return;
      const content = prompt('Enter Chapter Content:');
      if (content === null) return;
      addNewEntry('chapters', { title, summary, content });
    });

    document.getElementById('addCharacterBtn').addEventListener('click', () => {
      const name = prompt('Enter Character Name:');
      if (!name) return;
      const biography = prompt('Enter Character Biography:');
      if (biography === null) return;
      addNewEntry('characters', { name, biography });
    });

    document.getElementById('addTimelineBtn').addEventListener('click', () => {
      const title = prompt('Enter Timeline Title:');
      if (!title) return;
      const date = prompt('Enter Event Date (e.g., 2135 CE):');
      if (date === null) return;
      const event = prompt('Enter Event Description:');
      if (event === null) return;
      addNewEntry('timelines', { title, date, event });
    });
}
