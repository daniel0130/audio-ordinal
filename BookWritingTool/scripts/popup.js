// scripts/popup.js

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
  `;
  
  modalBody.innerHTML = infoContent;

  // Add event listener to toggle prompt visibility
  document.getElementById('togglePromptButton').addEventListener('click', () => {
      const aiPrompt = document.getElementById('aiPrompt');
      aiPrompt.style.display = aiPrompt.style.display === 'none' ? 'block' : 'none';
  });
}
