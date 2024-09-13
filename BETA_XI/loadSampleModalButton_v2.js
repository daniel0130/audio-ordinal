
// loadSampleModalButton_v2.js


// New Dropdown for Og Audional sample inscriptions
const ogSampleUrls = [
    { value: 'https://ordinals.com/content/e7d344ef3098d0889856978c4d2e81ccf2358f7f8b66feecc71e03036c59ad48i0#', text:'OB1 #1 - 808 Kick' },
    { value: 'https://ordinals.com/content/ef5707e6ecf4d5b6edb4c3a371ca1c57b5d1057c6505ccb5f8bdc8918b0c4d94i0',text: 'OB1 #2 - 808 Snare' },
    { value: 'https://ordinals.com/content/d030eb3d8bcd68b0ed02b0c67fdb981342eea40b0383814f179a48e76927db93i0',text: 'OB1 #3 - Closed Hat' },
    { value: 'https://ordinals.com/content/3b7482a832c4f27c32fc1da7cc4249bbbac1cbdfbdb8673079cad0c33486d233i0',text: 'OB1 #4 - 808 Clap'  },
    { value: 'https://ordinals.com/content/5a42d7b2e2fe01e4f31cbad5dd671997f87339d970faaab37f6355c4a2f3be5ai0',text: 'OB1 #5 - Crash' },
    { value: 'https://ordinals.com/content/ddc1838c1a6a3c45b2c6e19ff278c3b51b0797c3f1339c533370442d23687a68i0',text: 'OB1 #6 - Synth Bass 1' },
    { value: 'https://ordinals.com/content/91f52a4ca00bb27383ae149f24b605d75ea99df033a6cbb6de2389455233bf51i0',text: 'OB1 #7 - Synth Bass 2' },
    { value: 'https://ordinals.com/content/1e3c2571e96729153e4b63e2b561d85aec7bc5ba372d293af469a525dfa3ed59i0',text: 'OB1 #8 - Synth Bass 3' },
    { value: 'https://ordinals.com/content/437868aecce108d49f9b29c2f477987cb5834ffdf639a650335af7f0fdd5e55bi0',text: 'OB1 #9 - Hard Kick'},
    { value: 'https://ordinals.com/content/3be1f8e37b718f5b9874aecad792504c5822dc8dfc727ad4928594f7725db987i0',text: 'OB1 #10 - Hard Snare' },
    { value: 'https://ordinals.com/content/1bda678460ef08fb64435b57c9b69fd78fd4556822ccd8e9839b4eb71b3621edi0',text: 'OB1 #11 - Small Click' },
    { value: 'https://ordinals.com/content/228947e9fc52e44d3a22e84aed7bbaeff08d60c5f925aa6be7e265d210425c28i0',text: 'OB1 #12 - DJ Scratch' },
    { value: 'https://ordinals.com/content/578aa9d3b29ceceafc659ecee22cb7ef1a063ba5b71474db8fe84949746cdeefi0',text: 'OB1 #13 - Glockenspiel' },
    { value: 'https://ordinals.com/content/3e5fe7bc10e37a145a75f7ddd71debd9079b05568c5b9c5e6b4de3d959a4c46bi0',text: 'OB1 #14 - Cowbell' },
    { value: 'https://ordinals.com/content/b77fb3b299477ca55ab2626dbbc12c0d5fa9d4cf51ae00850caae6e36baef745i0',text: 'OB1 #16 - Bass Drop' },



    { value: 'https://ordinals.com/content/752bd66406185690c6f14311060785170df91a887b42740e1dde27e5fbf351cbi0#', text: 'MS10 Woop.mp3' },
    { value: 'https://ordinals.com/content/6d962189218b836cf33e2dc1adbc981e90242aa395f0868178773065f76f144ei0', text: 'audinalSample#1' },
    { value: 'https://ordinals.com/content/0b8eff3f39f4095d0f129bb8dd75f29159f8725c7e66046bf41f70ebb9f60d93i0', text: 'melophonicSynthBassSample1' },
    { value: 'https://ordinals.com/content/6d8be8186e63b4557e51edd66184a567bc6f5f9f5ba4bb34ba8c67e652c1934ei0', text: 'Step for man.mp3' },
    { value: 'https://ordinals.com/content/6c01b1214fc4d4016d683380d066849e6bc645276b102604c098bd35fd77f791i0', text: 'melophonic_Snare_1.mp3' },
    { value: 'https://ordinals.com/content/43efcebb84113c6df56bf5b8a455685c043492de9f5635d4108c4211c1f6841fi0', text: 'PumpIt_COLOR.mp3' },
    { value: 'https://ordinals.com/content/3364803cb3032ce95f4138a214c15a9b36dcb70f574a477f27615d448e1cdeb8i0', text: 'Drums 8 bit beat - 2.429 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/fef956676f3cbd6019a03d75c1a4a295c25b33653644b8f6ebde387971f9a677i0', text: 'wobble-bass.mp3' },
    { value: 'https://ordinals.com/content/8fa54ad2d9e297c79b225eff67a481ebc8682dacf4fe9dbf5b692a60b237c163i0', text: 'Entertainment - Quiet Loop (2) (1).mp3' },
    { value: 'https://ordinals.com/content/695368ae1092c0633ef959dc795ddb90691648e43f560240d96da0e2753a0a08i0', text: 'Melody O  - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/d4ce1d1e80e90378d8fc49fd7e0e24e7f2310b2f5eb95d0c2318c47b6c9cd645i0', text: 'Melody K - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/e4cb3caff3b4a5192adf0f2ab5cd9da378bacfbafce56c3d4fb678a313607970i0', text: 'Melody I - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/898cba6dc32faab5be09f13092b7500b13eb22f1e7b3d604c8e6e47b0becd139i0', text: 'Melody C-MP3 - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/ed13d5389ae6273839342698b6d5bd3342c51eb472f32b8306e60f8e1e903ce8i0', text: 'Mel Fill 3 - 2.429 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/c41587924f9d93d01cb71ca925fd664d6e50f1ac8e3c975d5e1e1f1bb0ff11b3i0', text: 'Audional-Jim.mp3' },
    { value: 'https://ordinals.com/content/b0fb7f9eb0fe6c368a8d140b1117234431da0cd8725e9f78e6573bb7f0f61dadi0', text: 'Melody N  - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/0e38f29c76b29e471f5f0022a5e98f9ae64b5b1d8f25673f85e02851daf22526i0', text: 'Mel Fill 4 - 2.429 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/244c785d6df173f8425d654cfc6d2b006c7bb47a605c7de576ed87022e42c7dfi0', text: 'Melody D - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/a72adee5a07200a623c40831ae5979bc7562b542788c3ded35d9e81e39c6014fi0', text: 'Melody B-MP3 - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/6a84401579707b76d9b9a77cc461e767f7ea8f08cc0e46dee0d21e5023cdde33i0', text: 'Melody J - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/c6decce29948ea64df9a24e689340c5907b6da207d74d13973fc5ca4dd3bd80ai0', text: 'Melody G - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/83174080310b0ab71c7a725461f3bd9e486bb62727b73134ee2c67f191d9d586i0', text: 'Mel Fill 5 - 2.429 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/4f9bed6449d99ef3cbb0fabefac6890c20ef17db2bfe7c07f1386cb43277f220i0', text: 'Melody H - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/e9885c35376ae95dd291bb02075b0763fb3e655d51dc981984130b8366a6d3c8i0', text: 'Mel Fill 2 - 2.429 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/34e73ef718034a3c0fdeba53899a2af8ee7771f252c419ab63cd13b0a39f6b10i0', text: 'Mel Fill 1 - 2.429 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/435c5c22eaf0c1791e09cb46d56ce942eb312372376abf5b5420200b1424ff7fi0', text: 'Melody E - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/ccf99852fb85d63b5f65124fe506b08c11eb400a7b1da75cd3e0c9538fc49977i0', text: 'Drums Beat - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/ef8fdd599beee731e06aba4a9ed02d9c7bfe62147b27f6b6deaf22c8c067ab11i0', text: 'Melody A-MP3 - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/187a8c18ebfe07c18aea0e86cd99b3100474c1c53f56f02ee096723f1a35ce70i0', text: 'Drums Crash  - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/2b6b23199eae0760ee26650a0cc02c49b94fc8fd1f519a95417f0f8478246610i0', text: 'Melody M  - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/474f2b0aab9020757826b168ce58725871fd2abb26c6ca805de4b07e314416d1i0', text: 'Outro Fill 1 - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/1aa69c9d3b451ab3b584dba57ba6d6fedc6e9cb3df6830b9da270e84e51ea72di0', text: 'Melody L - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/81f9e6afc38b8c647d4ea258c29f13b81f6c1a2d40afd9c0a385d03126b4d11di0', text: 'Melody F - 1.254 - Bitcoin Step - Longstreet.btc.mp3' },
    { value: 'https://ordinals.com/content/4c40da69e783cfa96d2900bd15622c1ea60ad31e8ce9459cec13d155f39c463fi0', text: 'Intro Fill 1 - 1.254 - Bitcoin Step - Longstreet.btc.mp3' }
];


let openModals = [];
let copiedOrdinalId = null; // Variable to store the copied ordinal ID
let copiedChannelName = ''; // Global variable to store the copied channel name
let copiedChannel = null;


function setupLoadSampleButton(channel, index) {
    const loadSampleButton = channel.querySelector('.load-sample-button');
    if (!loadSampleButton) {
        console.error("Load sample button not found.");
        return;
    }

    loadSampleButton.id = `load-sample-button-${index}`; // Ensure ID is set correctly
    loadSampleButton.dataset.ordinalId = getOrdinalId(index); // Set the ordinal ID here

    // Attach event handlers
    loadSampleButton.onclick = function() {
        const modal = openModal(index, loadSampleButton); // Capture the modal returned by openModal
        openModals.push(modal); // Add this modal to the tracking array
    };

    // Updating the button text possibly when a modal submits
    loadSampleButton.textContent = getButtonText(index);

    // Handle context menu separately if needed
    loadSampleButton.oncontextmenu = function(event) {
        event.preventDefault();
        showCustomContextMenu(event, event.pageX, event.pageY, index, loadSampleButton);
    };
}

function extractOrdinalIdFromUrl(url) {
    if (!url) return '';
    const parts = url.split('/');
    return parts[parts.length - 1];
}

function setOrdinalIdInUrl(index, ordinalId) {
    const baseUrl = 'https://ordinals.com/content/';
    window.unifiedSequencerSettings.settings.masterSettings.channelURLs[index] = `${baseUrl}${ordinalId}`;
}


function getOrdinalId(index) {
    // Assuming the ordinal ID is stored in window.unifiedSequencerSettings or another global object
    return extractOrdinalIdFromUrl(window.unifiedSequencerSettings.settings.masterSettings.channelURLs[index]);
}

function openModal(index, loadSampleButton) {
    const modal = createElement('div', 'loadSampleModalButton');
    const modalContent = createElement('div', 'loadSampleModalButton-content');

    // Apply flexbox column layout
    modalContent.style.display = 'flex';
    modalContent.style.flexDirection = 'column';
    modalContent.style.alignItems = 'flex-start'; // Align inputs and text to the left
    modal.appendChild(modalContent);
    openModals.push(modal);

    // Set a consistent width for all elements
    const consistentWidth = '400px'; // Set the width to a desired size

    const inputs = [
        { placeholder: 'Enter ORD ID:', type: 'text', className: 'audional-input', text: 'Enter an Ordinal ID to load a Bitcoin Audional:' },
        { placeholder: 'Enter IPFS ID:', type: 'text', className: 'ipfs-input', text: 'Or, enter an IPFS ID for an off-chain audio sample:' },
        { placeholder: 'Enter sOrdinal ID:', type: 'text', className: 'sOrdinal-input', text: 'Or, enter an sOrdinal ID for a layer 2 audio sample:' }
    ];

    const ogAudionalDropdown = createOGDropdown('Load any OB1 or OG Audional Inscription:', ogSampleUrls);
    ogAudionalDropdown.querySelector('select').id = `og-audional-dropdown-${index}`;

    // Set the width of the dropdown
    ogAudionalDropdown.style.width = consistentWidth;

    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        @keyframes pulse-green {
            0% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(0, 255, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(0, 255, 0, 0); }
        }
        .pulse-green {
            animation: pulse-green 2s infinite;
        }
        @keyframes pulse-orange {
            0% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 165, 0, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 165, 0, 0); }
        }
        .pulse-orange {
            animation: pulse-orange 2s infinite;
        }
        .tooltip {
            position: relative;
            display: inline-block;
        }
        .tooltip .tooltiptext {
            visibility: hidden;
            width: 220px;
            background-color: black;
            color: #fff;
            text-align: center;
            border-radius: 6px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            margin-left: -110px;
            opacity: 0;
            transition: opacity 0.3s;
        }
        .tooltip:hover .tooltiptext {
            visibility: visible;
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    ogAudionalDropdown.classList.add('pulse-green');
    modalContent.appendChild(ogAudionalDropdown);
    ogAudionalDropdown.querySelector('select').addEventListener('change', (event) => handleDropdownChange(event, index, modal, loadSampleButton));

    inputs.forEach(({ text, placeholder, type, className }) => {
        const containerDiv = document.createElement('div');
        containerDiv.style.display = 'flex';
        containerDiv.style.flexDirection = 'column'; // Ensure vertical stacking
        containerDiv.style.marginBottom = '10px'; // Add spacing between input sections

        const textPara = createTextParagraph(text);
        textPara.style.marginBottom = '5px'; // Add space between label and input

        const inputElement = createElement('input', className, { type: type, placeholder: placeholder });
        inputElement.style.width = consistentWidth; // Ensure uniform width across inputs
        inputElement.style.boxSizing = 'border-box'; // Ensure padding doesn't affect width

        containerDiv.appendChild(textPara);
        containerDiv.appendChild(inputElement);
        modalContent.appendChild(containerDiv);
    });

    const actions = [
        { text: 'Load Audio', action: () => handleAction(index, modal, loadSampleButton) },
        { text: 'Cancel', action: () => closeModal(modal) },
        { 
            text: 'Search for more on-chain audio', 
            action: () => window.open('https://ordinals.hiro.so/inscriptions?f=audio', '_blank'), 
            tooltip: 'Find any onchain audio you like. Simply copy the ordinal ID and paste it into the form above to load it into the sequencer for remixing.',
            className: 'pulse-orange'
        }
    ];

    actions.forEach(({ text, action, tooltip, className }) => {
        const button = createButton(text, action);
        if (tooltip) {
            const tooltipSpan = document.createElement('span');
            tooltipSpan.className = 'tooltiptext';
            tooltipSpan.textContent = tooltip;
            
            const tooltipDiv = document.createElement('div');
            tooltipDiv.className = 'tooltip';
            tooltipDiv.appendChild(button);
            tooltipDiv.appendChild(tooltipSpan);
            
            if (className) {
                button.classList.add(className);
            }
            
            modalContent.appendChild(tooltipDiv);
        } else {
            if (className) {
                button.classList.add(className);
            }
            modalContent.appendChild(button);
        }
    });

    document.body.appendChild(modal);
    return modal;
}

function createOGDropdown(label, options) {
    const container = createElement('div', 'dropdown-container');
    container.style.marginTop = '20px';  // Add 20px space above the dropdown

    const labelElement = createElement('label', 'dropdown-label', { textContent: label });
    const select = createElement('select', 'dropdown-select');

    // Add a default, non-selectable option as the first item
    const defaultOption = createElement('option', '', { value: '', textContent: 'Select Audional sample to load' });
    defaultOption.disabled = true;  // Make it non-selectable
    defaultOption.selected = true;  // Make it selected by default
    select.appendChild(defaultOption);

    // Append other options from the provided array
    options.forEach(({ value, text }) => {
        const option = createElement('option', '', { value: value, textContent: text });
        select.appendChild(option);
    });

    // Set consistent width for the dropdown
    const consistentWidth = '400px';  // Use the same width as inputs
    select.style.width = consistentWidth;
    select.style.boxSizing = 'border-box';  // Ensure padding/borders don't affect width

    container.appendChild(labelElement);
    container.appendChild(select);
    return container;
}


function handleAction(index, modal, loadSampleButton) {
    const audionalInput = modal.querySelector('.audional-input');
    const ipfsInput = modal.querySelector('.ipfs-input');
    const sOrdinalInput = modal.querySelector('.sOrdinal-input');
    // const fileInput = modal.querySelector('.file-input');

    // console.log('File Input:', fileInput);
    // console.log('Files Available:', fileInput.files);

    handleLoad(index, audionalInput, ipfsInput, sOrdinalInput, modal, loadSampleButton);
}

// Simplified createElement function to reduce redundancy
function createElement(type, className, attributes = {}) {
    const element = document.createElement(type);
    element.className = className;
    Object.keys(attributes).forEach(key => {
        element[key] = attributes[key];
    });
    return element;
}
// function createElement(type, className, properties = {}) {
//     const element = document.createElement(type);
//     element.className = className;
//     Object.keys(properties).forEach(key => element[key] = properties[key]);
//     return element;
// }

function createTextParagraph(text) {
    const p = document.createElement('p');
    p.textContent = text;
    return p;
}



function closeModal(modal) {
    if (modal && document.body.contains(modal)) {
        document.body.removeChild(modal);
        openModals = openModals.filter(m => m !== modal);  // Update the openModals array
    }
}

function closeAllModals() {
    console.log('Closing all modals. Current open modals:', openModals);
    openModals.forEach(modal => {
        if (document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
    });
    openModals = [];  // Clear the array after removing all modals
    console.log('All modals closed. Current open modals:', openModals);
}

function handleDropdownChange(event, index, modal, loadSampleButton) {
    const selectedValue = event.target.value;
    const audionalInput = modal.querySelector('.audional-input');
    const ipfsInput = modal.querySelector('.ipfs-input');
    const sOrdinalInput = modal.querySelector('.sOrdinal-input');

    // Check if the selected value is valid (not the default disabled option)
    if (selectedValue) {
        // Call handleLoad directly from here, assuming you have a valid URL or input
        handleLoad(index, audionalInput, ipfsInput, sOrdinalInput, modal, loadSampleButton);
    }
}

function updateProjectChannelNamesUI(channelIndex, name) {
    console.log("[updateProjectChannelNamesUI] Project channel names UI updated:", channelIndex, name);
    const nameDisplay = document.getElementById(`channel-name-${channelIndex}`);
    if (nameDisplay) {
        nameDisplay.textContent = name;
    }
    // Update the global settings object with new channel names
    window.unifiedSequencerSettings.setChannelName(channelIndex, name);
    console.log("[updateProjectChannelNamesUI] Project channel names updated:", window.unifiedSequencerSettings.settings.masterSettings.projectChannelNames);
}

function showChannelNamingModal(channelIndex, loadSampleButton) {
    // Close any existing modals first
    closeAllModals();  // Ensure all modals are closed before opening a new one

    // Create the channel naming modal
    const modal = createElement('div', 'channel-naming-modal');
    openModals.push(modal); // Add this modal to the tracking array
    const input = createInputField('Give this channel a name', 'text');

    const submitFunction = () => {
        if (input.value.trim()) {
            window.unifiedSequencerSettings.setChannelName(channelIndex, input.value.trim());
            updateProjectChannelNamesUI(channelIndex, input.value.trim());
            loadSampleButton.textContent = input.value.trim();  // Update the button text
            closeAllModals();  // Close all modals after submitting
            closeCustomContextMenu(); // Close any custom context menu
        }
    };

    const submitButton = createButton('Submit', submitFunction);

    const cancelButton = createButton('Cancel', () => closeAllModals());

    // Append elements to the modal
    modal.appendChild(input);
    modal.appendChild(submitButton);
    modal.appendChild(cancelButton);

    // Listen for Enter key press event
    input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            submitFunction(); // Call the submit function when Enter is pressed
        }
    });

    // Append the modal to the document
    document.body.appendChild(modal);
    input.focus();  // Focus the input for user convenience
}

function handleLoad(index, audionalInput, ipfsInput, sOrdinalInput, modal, loadSampleButton, directUrl = null, directSampleName = null) {
    console.log(`[HTML Debugging] [handleLoad] Called with index: ${index}`);
    let url = directUrl;
    let sampleName = directSampleName;

    // If direct URL and sample name aren't provided, check other inputs
    if (!url) {
        const ogAudionalDropdown = modal.querySelector(`#og-audional-dropdown-${index}`);
        const ob1AudionalDropdown = modal.querySelector('#ob1-dropdown');

        if (audionalInput && audionalInput.value.trim()) {
            url = 'https://ordinals.com/content/' + audionalInput.value.trim();
            sampleName = audionalInput.value.trim().split('/').pop();
        } else if (ipfsInput && ipfsInput.value.trim()) {
            url = 'https://ipfs.io/ipfs/' + ipfsInput.value.trim();
            sampleName = ipfsInput.value.trim().split('/').pop();
        } else if (sOrdinalInput && sOrdinalInput.value.trim()) {
            url = 'https://content.sordinals.io/inscription-data/' + sOrdinalInput.value.trim();
            sampleName = sOrdinalInput.value.trim().split('/').pop();
        // Uncomment and adjust the following if file input handling is re-enabled:
        // } else if (fileInput && fileInput.files.length > 0) {
        //     url = URL.createObjectURL(fileInput.files[0]);
        //     sampleName = fileInput.files[0].name;
        } else if (ogAudionalDropdown && ogAudionalDropdown.value) {
            url = ogAudionalDropdown.value;
            sampleName = ogAudionalDropdown.options[ogAudionalDropdown.selectedIndex].text;
        } else if (ob1AudionalDropdown && ob1AudionalDropdown.value) {
            url = ob1AudionalDropdown.value;
            sampleName = ob1AudionalDropdown.options[ob1AudionalDropdown.selectedIndex].text;
        } else {
            console.error("[HTML Debugging] [handleLoad] No valid input value or file selected.");
            alert("Please enter an ID, select a file, or choose from a dropdown.");
            return; // Exit if no valid input is found
        }
    }

    if (url && sampleName) {
        processLoad(url, sampleName, index, loadSampleButton, modal);
    } else {
        console.error("[HTML Debugging] [handleLoad] Error: No URL or sample name defined.");
        alert("Failed to identify the audio to load. Please check your selections.");
    }
}



function processLoad(url, sampleName, index, loadSampleButton, modal) {
    if (url) {
        fetchAudio(url, index, sampleName).then(() => {
            updateProjectChannelNamesUI(index, sampleName);
            loadSampleButton.textContent = sampleName;
            closeAllModals();  // Close all modals upon successful loading
        }).catch(error => {
            console.error("[HTML Debugging] [handleLoad] Error loading audio:", error);
            alert("Failed to load audio. Please check the console for details.");
        });
    }
}

function copyOrdinalId(channelIndex) {
    const url = window.unifiedSequencerSettings.settings.masterSettings.channelURLs[channelIndex];
    copiedOrdinalId = extractOrdinalIdFromUrl(url);
    console.log(`Copied Ordinal ID: ${copiedOrdinalId}`);
    showVisualMessage(`Copied ID: ${copiedOrdinalId}`);
}

function pasteOrdinalId(channelIndex, loadSampleButton) {
    if (copiedOrdinalId) {
        setOrdinalIdInUrl(channelIndex, copiedOrdinalId);
        console.log(`Pasted Ordinal ID: ${copiedOrdinalId} into channel ${channelIndex}`);
        const url = window.unifiedSequencerSettings.settings.masterSettings.channelURLs[channelIndex];
        const sampleName = copiedOrdinalId;
        processLoad(url, sampleName, channelIndex, loadSampleButton, null);
        updateButtonText(channelIndex, loadSampleButton); // Update button text
    } else {
        console.warn('No Ordinal ID copied');
    }
}

function pasteOrdinalIdToAllChannels(loadSampleButton) {
    if (!copiedOrdinalId) {
        console.warn('No Ordinal ID copied');
        return;
    }

    const confirmation = confirm('Are you sure you want to paste this ID across all channels? Existing channels will be lost.');
    if (confirmation) {
        const totalChannels = window.unifiedSequencerSettings.settings.masterSettings.channelURLs.length;
        for (let i = 0; i < totalChannels; i++) {
            setOrdinalIdInUrl(i, copiedOrdinalId);
            const url = window.unifiedSequencerSettings.settings.masterSettings.channelURLs[i];
            const sampleName = copiedOrdinalId;
            processLoad(url, sampleName, i, loadSampleButton, null);
            updateButtonText(i, loadSampleButton); // Update button text for each channel
        }
        showVisualMessage('Pasted ID to all channels');
    }
}

function copyChannelName(channelIndex) {
    const { projectChannelNames } = window.unifiedSequencerSettings.settings.masterSettings;
    if (projectChannelNames && projectChannelNames[channelIndex]) {
        copiedChannelName = projectChannelNames[channelIndex];
        console.log(`Copied Channel Name: ${copiedChannelName}`);
        showVisualMessage(`Copied Channel Name: ${copiedChannelName}`);
    } else {
        console.warn('No Channel Name to copy');
    }
}

function pasteChannelName(channelIndex, loadSampleButton) {
    if (copiedChannelName) {
        window.unifiedSequencerSettings.settings.masterSettings.projectChannelNames[channelIndex] = copiedChannelName;
        updateProjectChannelNamesUI(channelIndex, copiedChannelName);
        loadSampleButton.textContent = copiedChannelName;
        console.log(`Pasted Channel Name: ${copiedChannelName} into channel ${channelIndex}`);
        showVisualMessage(`Pasted Channel Name: ${copiedChannelName}`);
    } else {
        console.warn('No Channel Name copied');
    }
}

function copyChannel(channelIndex) {
    const settings = window.unifiedSequencerSettings.settings.masterSettings;

    console.log('Copying channel:', {
        channelIndex,
        settings
    });

    if (!settings.channelSettings) {
        settings.channelSettings = {};
    }

    const channelSettings = settings.channelSettings[`ch${channelIndex}`] || { volume: 1, pitch: 1 };
    const playbackSpeed = window.unifiedSequencerSettings.channelPlaybackSpeed[channelIndex] || 1;
    const trimSettings = window.unifiedSequencerSettings.getTrimSettings(channelIndex);

    // Calculate total sample duration
    const totalSampleDuration = trimSettings.totalSampleDuration || 1; // Assuming a default value of 1 if not present

    // Collect steps from all sequences
    const allSteps = {};
    for (const sequenceKey in settings.projectSequences) {
        const sequence = settings.projectSequences[sequenceKey];
        if (sequence[`ch${channelIndex}`]) {
            allSteps[sequenceKey] = sequence[`ch${channelIndex}`].steps.map(step => ({ ...step }));
        }
    }

    const channelData = {
        url: settings.channelURLs[channelIndex],
        name: settings.projectChannelNames[channelIndex],
        volume: channelSettings.volume || 1,
        pitch: channelSettings.pitch || 1,
        playbackSpeed: playbackSpeed,
        trimSettings: {
            ...trimSettings,
            totalSampleDuration: totalSampleDuration
        },
        steps: allSteps
    };
    copiedChannel = channelData;
    console.log('Copied Channel:', copiedChannel);
    showVisualMessage('Copied Channel');
}





function pasteChannel(channelIndex, loadSampleButton) {
    if (copiedChannel) {
        const settings = window.unifiedSequencerSettings.settings.masterSettings;

        console.log('Pasting channel:', {
            channelIndex,
            copiedChannel,
            settings
        });

        if (!settings.channelSettings) {
            settings.channelSettings = {};
        }
        if (!settings.channelSettings[`ch${channelIndex}`]) {
            settings.channelSettings[`ch${channelIndex}`] = {};
        }

        console.log('Before applying settings:', settings.channelSettings[`ch${channelIndex}`]);

        // Paste URL and name
        settings.channelURLs[channelIndex] = copiedChannel.url;
        settings.projectChannelNames[channelIndex] = copiedChannel.name;
        loadSampleButton.textContent = copiedChannel.name;

        // Paste volume and pitch
        settings.channelSettings[`ch${channelIndex}`].volume = copiedChannel.volume;
        settings.channelSettings[`ch${channelIndex}`].pitch = copiedChannel.pitch;

        // Apply the volume immediately
        setChannelVolume(channelIndex, copiedChannel.volume);

        // Paste playback speed
        window.unifiedSequencerSettings.setChannelPlaybackSpeed(channelIndex, copiedChannel.playbackSpeed);

        // Log after applying volume and playback speed
        console.log('After applying volume and playback speed:', settings.channelSettings[`ch${channelIndex}`]);

        // Paste steps across all sequences
        for (const sequenceKey in copiedChannel.steps) {
            const sequence = settings.projectSequences[sequenceKey];
            if (!sequence) {
                console.warn(`Invalid sequence index: ${sequenceKey} in pasteChannel`);
                continue;
            }
            if (!sequence[`ch${channelIndex}`]) {
                sequence[`ch${channelIndex}`] = { steps: [] };
            }
            sequence[`ch${channelIndex}`].steps = copiedChannel.steps[sequenceKey].map(step => ({ ...step }));
        }

        // Paste trim settings
        const trimSettings = copiedChannel.trimSettings;
        console.log('Pasting trim settings:', trimSettings);
        window.unifiedSequencerSettings.setTrimSettings(channelIndex, trimSettings.start, trimSettings.end);

        // Update global settings with new trim settings
        settings.trimSettings[channelIndex] = trimSettings;

        // Notify observers about the trim settings change
        window.unifiedSequencerSettings.notifyObservers();

        // Update trim settings UI
        if (isModalOpen) { // Check if the modal is open
            window.unifiedSequencerSettings.updateTrimSettingsUI([trimSettings]);
        }

        // Process load to ensure the audio sample is fully integrated
        processLoad(copiedChannel.url, copiedChannel.name, channelIndex, loadSampleButton, null);

        // Update button text
        updateButtonText(channelIndex, loadSampleButton);

        console.log('Pasted Channel:', copiedChannel);
        showVisualMessage('Pasted Channel');

        // Log the full settings object after pasting
        console.log('Full settings after pasting:', JSON.stringify(settings));
    } else {
        console.warn('No Channel copied');
        showVisualMessage('No Channel copied');
    }
}













function updateButtonText(index, loadSampleButton) {
    const { projectChannelNames } = window.unifiedSequencerSettings.settings.masterSettings;
    if (projectChannelNames && index < projectChannelNames.length) {
        loadSampleButton.textContent = projectChannelNames[index] || 'Load New Audio into Channel';
    }
}

function showVisualMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'visual-message';
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.remove();
    }, 2000); // Remove message after 2 seconds
}

function showCustomContextMenu(contextEvent, x, y, channelIndex, loadSampleButton) {
    console.log('Creating custom context menu');

    closeCustomContextMenu();

    const menu = createContextMenu(x, y);
    menu.style.position = 'absolute';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    menu.className = 'custom-context-menu';

    const options = [
        { 
            label: 'Add User Channel Name', 
            action: () => {
                showChannelNamingModal(channelIndex, loadSampleButton);
                closeCustomContextMenu();
            } 
        },
        { 
            label: 'Copy Channel Name', 
            action: () => {
                copyChannelName(channelIndex);
                closeCustomContextMenu();
            } 
        },
        { 
            label: 'Paste Channel Name', 
            action: () => {
                pasteChannelName(channelIndex, loadSampleButton);
                closeCustomContextMenu();
            } 
        },
        { 
            label: 'Copy Ordinal ID', 
            action: () => {
                copyOrdinalId(channelIndex);
                closeCustomContextMenu();
            } 
        },
        { 
            label: 'Paste Ordinal ID', 
            action: () => {
                pasteOrdinalId(channelIndex, loadSampleButton);
                closeCustomContextMenu();
            } 
        },
        { 
            label: 'Paste Ordinal ID to All Channels', 
            action: () => {
                pasteOrdinalIdToAllChannels(loadSampleButton);
                closeCustomContextMenu();
            } 
        },
        { 
            label: 'Copy Channel', 
            action: () => {
                copyChannel(channelIndex);
                closeCustomContextMenu();
            } 
        },
        { 
            label: 'Paste Channel', 
            action: () => {
                pasteChannel(channelIndex, loadSampleButton);
                closeCustomContextMenu();
            } 
        }
        // { 
        //     label: 'Reset Channel Pitch & Volume to 1', 
        //     action: () => {
        //         resetChannelToDefault(channelIndex);
        //         closeCustomContextMenu();
        //     } 
        // }
    ];

    options.forEach(option => {
        const menuItem = document.createElement('div');
        menuItem.className = 'context-menu-item';
        menuItem.textContent = option.label;
        menuItem.onclick = option.action;
        menu.appendChild(menuItem);
    });

    document.body.appendChild(menu);

    setTimeout(() => {
        closeCustomContextMenu();
    }, 60000);

    setTimeout(() => {
        document.addEventListener('click', (event) => handleClickOutsideMenu(event, menu), { capture: true, once: true });
    }, 0);
}

function resetChannelToDefault(channelIndex) {
    console.log(`Resetting channel ${channelIndex} to default settings`);
    window.unifiedSequencerSettings.setChannelVolume(channelIndex, 1);
    window.unifiedSequencerSettings.setChannelPlaybackSpeed(channelIndex, 1);
}

function handleClickOutsideMenu(event, menu) {
    if (!menu.contains(event.target)) {
        closeCustomContextMenu();
    }
}

function closeCustomContextMenu() {
    const existingMenu = document.querySelector('.custom-context-menu');
    if (existingMenu) {
        existingMenu.remove();
    }
}

function createContextMenu(x, y) {
    const menu = document.createElement('div');
    menu.className = 'custom-context-menu';
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
    return menu;
}

function createMenuOption(label, action) {
    const menuOption = document.createElement('div');
    menuOption.className = 'custom-context-menu-option';
    menuOption.textContent = label;
    menuOption.onclick = action;
    return menuOption;
}

function getButtonText(index) {
    const { projectChannelNames } = window.unifiedSequencerSettings.settings.masterSettings;
    if (projectChannelNames && index < projectChannelNames.length && projectChannelNames[index]) {
        return projectChannelNames[index];
    }
    return 'Load New Audio into Channel'; // Default text if no name is set
}

function createInputField(placeholder, type = 'text') {
    return createElement('input', 'loadSampleModalButton-input', {type: type, placeholder: placeholder});
}

function createButton(text, onClick) {
    const button = document.createElement('button');
    button.textContent = text;
    button.onclick = onClick;
    return button;
}


export { setupLoadSampleButton };


