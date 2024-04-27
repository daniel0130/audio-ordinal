// instructions.js

// Define the instructional content
const instructionsContent = {
    title: "Help - Audional Sequencer Instructions"
    ,
    leftColumnContent: `
      
        <p class="modal-text-small">
            <strong>BPM (Beats Per Minute):</strong> Drag to adjust the BPM of the sequence. <span class="tooltiptext">Drag the slider to adjust the tempo of the sequence.</span>
        </p>
        <p class="modal-text-small">
            <strong>Save:</strong> Save your work. <span class="tooltiptext">Click to save the current sequence into a JSON file.</span>
        </p>
        <p class="modal-text-small">
            <strong>Load:</strong><span class="tooltiptext">Load a preset sequence from the dropdown or your own JSON settings file from your local drive.</span>
        </p>
        <p class="modal-text-small">
        <strong>Copy:</strong> Copy current sequence. <span class="tooltiptext">Click to copy the current sequence steps for pasting to a new sequence.</span>
    </p>
    <p class="modal-text-small">
        <strong>Paste:</strong> Paste a sequence. <span class="tooltiptext">Click to paste a copied sequence to a new empty sequence.</span>
    </p>
    <h3 class="modal-header">Step Button Functions</h3>
    <p class="modal-text-small">
        <span class="step-button demo" style="background-color: red;"></span>
        <span class="step-button demo" style="background-color: green;"></span>
        <strong>Step Buttons:</strong> 
        Left-click to activate a step (red square). Right-click to set reverse play (green square). Grey indicates inactive.
    </p>
    `,
    rightColumnContent: `
       
        <h3 class="modal-header">Channel Control Buttons</h3>
        <p class="modal-text-small">
            <button class="control-button volume-button tooltip" style="background-color: rgb(255, 145, 0);">V</button>
            <strong>Volume (V):</strong> Adjusts channel volume. <span class="tooltiptext">Click to adjust the volume for the current channel.</span>
        </p>
        <p class="modal-text-small">
            <button class="control-button playback-speed-button tooltip" style="background-color: rgb(144, 0, 255);">P</button>
            <strong>Pitch (P):</strong> Adjusts pitch using playback speed. <span class="tooltiptext">Click to adjust the pitch using the playback speed for the current channel.</span>
        </p>
        <p class="modal-text-small">
            <button class="control-button audio-trim-button tooltip" style="background-color: blue;">T</button>
            <strong>Audio Trim (T):</strong> Opens Audio Trimmer. <span class="tooltiptext">Click to open the audio trimmer for the current channel.</span>
        </p>
        <p class="modal-text-small">
            <button class="control-button clear-button tooltip">C</button>
            <strong>Clear Channel (C):</strong> Clears channel's active steps. <span class="tooltiptext">Click to clear the current channel's sequence of active steps.</span>
        </p>
        <p class="modal-text-small">
            <button class="control-button mute-button tooltip">M</button>
            <strong>Mute Channel (M):</strong><span class="tooltiptext">Click to mute or unmute the current channel.</span>
        </p>
        <p class="modal-text-small">
            <button class="control-button solo-button tooltip">S</button>
            <strong>Solo Channel (S):</strong><span class="tooltiptext">Click to solo the current channel.</span>
        </p>
        <h3 class="modal-header">Pattern Manipulation</h3>
        <p class="modal-text-small">
            <button class="control-button fwd-pattern-selection tooltip">
                <span class="emoji">🔲</span>
            </button>
            <strong>Auto-draw Patterns:</strong> Automatically generate trigger patterns. <span class="tooltiptext">Click to auto-draw a pattern for the current channel. Click multiple times to scroll through options. Right click to reverse all inactive steps for siren effect</span>
        </p>
        <p class="modal-text-small">
            <button class="control-button pattern-shift-right tooltip">
                <span class="emoji">➡️</span>
            </button>
            <strong>Pattern Shift:</strong> Shifts the entire pattern one step to the right. <span class="tooltiptext">Click to shift the pattern of the current channel one step to the right.</span>
        </p>
    `
};

// Function to set content
function setContent() {
    document.getElementById('modal-title').textContent = instructionsContent.title;
    document.getElementById('modal-left-column').innerHTML = instructionsContent.leftColumnContent;
    document.getElementById('modal-right-column').innerHTML = instructionsContent.rightColumnContent;
}


// Get the modal
var modal = document.getElementById('help-modal');

// Get the button that opens the modal
var btn = document.getElementById('instruction-button');

// Get the element that closes the modal
var span = document.getElementsByClassName('close')[0];

// Get the elements where dynamic content will be inserted
var modalTitle = document.getElementById('modal-title');
var modalLeftColumn = document.getElementById('modal-left-column'); // corrected ID
var modalRightColumn = document.getElementById('modal-right-column'); // corrected ID



// When the user clicks the button, toggle the modal and set content
btn.onclick = function() {
    setContent(); // Set content each time the button is clicked to ensure updates are shown
    modal.style.display = modal.style.display === "none" ? "block" : "none";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};

