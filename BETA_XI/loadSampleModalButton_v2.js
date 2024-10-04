

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




// Centralized State Management
const AppState = {
    openModals: [],
    // Removed copiedChannel as we'll use the clipboard
};

// Utility Functions

/**
 * Creates a DOM element with optional className and attributes.
 * @param {string} type - The type of the element (e.g., 'div', 'button').
 * @param {string|string[]} [className] - Class or classes to add.
 * @param {Object} [attributes] - Additional attributes to set.
 * @returns {HTMLElement} The created DOM element.
 */
function createElement(type, className, attributes = {}) {
    const element = document.createElement(type);
    if (className) {
        if (Array.isArray(className)) {
            element.classList.add(...className);
        } else {
            element.classList.add(className);
        }
    }
    Object.entries(attributes).forEach(([key, value]) => {
        if (key === 'textContent' || key === 'innerHTML') {
            element[key] = value;
        } else {
            element.setAttribute(key, value);
        }
    });
    return element;
}

/**
 * Creates a standardized modal with given content.
 * @param {HTMLElement} content - The content to insert into the modal.
 * @returns {HTMLElement} The modal overlay element.
 */
function createModal(content) {
    const overlay = createElement('div', 'modal-overlay', {
        style: `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.5); z-index: 1000;
            display: flex; justify-content: center; align-items: center;
        `,
    });
    overlay.appendChild(content);

    // Close modal when clicking outside content
    overlay.addEventListener('click', (event) => {
        if (!content.contains(event.target)) {
            closeModal(overlay);
        }
    });

    return overlay;
}

/**
 * Closes a specific modal.
 * @param {HTMLElement} modalOverlay - The modal overlay to close.
 */
function closeModal(modalOverlay) {
    if (modalOverlay && document.body.contains(modalOverlay)) {
        document.body.removeChild(modalOverlay);
        AppState.openModals = AppState.openModals.filter(m => m !== modalOverlay);
        console.log(`[Modal] Closed:`, modalOverlay);
    }
}

/**
 * Closes all open modals.
 */
function closeAllModals() {
    AppState.openModals.forEach(modal => {
        if (modal && document.body.contains(modal)) {
            document.body.removeChild(modal);
            console.log(`[Modal] Closed:`, modal);
        }
    });
    AppState.openModals = [];
    console.log('All modals closed.');
}

/**
 * Displays a temporary visual message to the user.
 * @param {string} message - The message to display.
 */
function showVisualMessage(message) {
    const messageDiv = createElement('div', 'visual-message', { textContent: message });
    Object.assign(messageDiv.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#333',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '5px',
        zIndex: '1001',
        opacity: '0.9',
    });
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 2000);
}

/**
 * Standardizes error handling with logging and user alerts.
 * @param {string} context - The context or location of the error.
 * @param {Error|string} error - The error object or message.
 * @param {string} [userMessage] - Optional message to display to the user.
 */
function handleError(context, error, userMessage = 'An unexpected error occurred.') {
    console.error(`[Error][${context}]`, error);
    if (userMessage) alert(userMessage);
}

/**
 * Updates the button text based on channel name or defaults.
 * @param {number} index - The channel index.
 * @param {HTMLElement} button - The button element to update.
 */
function updateButtonText(index, button) {
    const name = window.unifiedSequencerSettings.settings.masterSettings.projectChannelNames[index];
    button.textContent = name || 'Load New Audio into Channel';
}

/**
 * Retrieves the ordinal ID from a given URL.
 * @param {string} url - The URL to extract from.
 * @returns {string} The extracted ordinal ID.
 */
function extractOrdinalId(url) {
    return url ? url.split('/').pop() : '';
}

/**
 * Sets the ordinal ID in the URL for a given channel.
 * @param {number} index - The channel index.
 * @param {string} ordinalId - The ordinal ID to set.
 */
function setOrdinalId(index, ordinalId) {
    const baseUrl = 'https://ordinals.com/content/';
    window.unifiedSequencerSettings.settings.masterSettings.channelURLs[index] = `${baseUrl}${ordinalId}`;
}

/**
 * Generates button text based on channel name.
 * @param {number} index - The channel index.
 * @returns {string} The button text.
 */
function getButtonText(index) {
    const name = window.unifiedSequencerSettings.settings.masterSettings.projectChannelNames[index];
    return name || 'Load New Audio into Channel';
}

// Modal Creation Functions

/**
 * Creates input fields within a modal.
 * @param {Array} fields - An array of field definitions.
 * @param {string} width - The width of the input fields.
 * @returns {HTMLElement} The container with input fields.
 */
function createInputFields(fields, width) {
    const container = createElement('div', 'modal-inputs');
    fields.forEach(({ label, placeholder, className }) => {
        const inputContainer = createElement('div', 'input-container', { style: 'margin-bottom: 10px;' });
        const labelElem = createElement('label', null, { textContent: label, style: 'margin-bottom: 5px;' });
        const input = createElement('input', className, { type: 'text', placeholder, style: `width: ${width}; box-sizing: border-box;` });
        inputContainer.appendChild(labelElem);
        inputContainer.appendChild(input);
        container.appendChild(inputContainer);
    });
    return container;
}

/**
 * Creates a dropdown within a modal.
 * @param {string} labelText - The label for the dropdown.
 * @param {Array} options - The dropdown options.
 * @param {string} width - The width of the dropdown.
 * @param {number} index - The channel index for unique ID.
 * @returns {HTMLElement} The container with the dropdown.
 */
function createDropdown(labelText, options, width, index) {
    const container = createElement('div', 'dropdown-container', { style: 'margin-bottom: 10px;' });
    const label = createElement('label', null, { textContent: labelText });
    const select = createElement('select', null, { id: `audional-dropdown-${index}`, style: `width: ${width};` });
    options.forEach(opt => select.appendChild(createElement('option', null, { textContent: opt.text, value: opt.value })));
    container.appendChild(label);
    container.appendChild(select);
    return container;
}

/**
 * Creates action buttons within a modal.
 * @param {Array} actions - An array of action definitions.
 * @returns {HTMLElement} The container with action buttons.
 */
function createActionButtons(actions) {
    const container = createElement('div', 'action-buttons', { style: 'display: flex; gap: 10px; margin-top: 20px;' });
    actions.forEach(({ text, action, tooltip, className }) => {
        const button = createElement('button', ['action-button', className], { textContent: text, title: tooltip });
        button.addEventListener('click', action);
        container.appendChild(button);
    });
    return container;
}

/**
 * Opens the Load Sample Modal.
 * @param {number} index - The channel index.
 * @param {HTMLElement} loadSampleButton - The button that triggered the modal.
 */
function openLoadSampleModal(index, loadSampleButton) {
    const modalContent = createElement('div', 'modal-content', {
        style: `
            background: #fff; padding: 20px; border-radius: 5px; width: 400px;
            display: flex; flex-direction: column;
        `,
    });

    const inputFields = createInputFields([
        { label: 'Enter ORD ID:', placeholder: 'Enter ORD ID:', className: 'audional-input' },
        { label: 'Enter sOrdinal ID:', placeholder: 'Enter sOrdinal ID:', className: 'sOrdinal-input' },
        { label: 'Enter IPFS ID:', placeholder: 'Enter IPFS ID:', className: 'ipfs-input' },
    ], '100%');

    const dropdown = createDropdown('Load any OB1 or OG Audional Inscription:', ogSampleUrls, '100%', index);
    const selectElement = dropdown.querySelector('select');
    selectElement.addEventListener('change', (event) => handleLoad(index, event, loadSampleButton));

    const actionButtons = createActionButtons([
        { text: 'Load', action: () => handleLoad(index, null, loadSampleButton), className: 'green-button' },
        { text: 'Cancel', action: () => closeModal(modalOverlay), className: 'red-button' },
        { text: 'Find More Samples', action: () => window.open('https://ordinals.hiro.so/inscriptions?f=audio', '_blank'), tooltip: 'Find any onchain audio you like. Simply copy the ordinal ID and paste it into the form above to load it into the sequencer for remixing.', className: 'yellow-button' },
    ]);

    modalContent.appendChild(inputFields);
    modalContent.appendChild(dropdown);
    modalContent.appendChild(actionButtons);

    const modalOverlay = createModal(modalContent);
    AppState.openModals.push(modalOverlay);
    document.body.appendChild(modalOverlay);

    return modalOverlay;
}

// Event Handlers

/**
 * Handles the Load action from the modal or dropdown.
 * @param {number} index - The channel index.
 * @param {Event|null} event - The event object, if triggered by dropdown.
 * @param {HTMLElement} loadSampleButton - The button to update upon loading.
 */
function handleLoad(index, event, loadSampleButton) {
    try {
        let url, sampleName;
        const modal = AppState.openModals.find(modal => modal.querySelector('.modal-content'));
        const audionalInput = modal?.querySelector('.audional-input')?.value.trim();
        const ipfsInput = modal?.querySelector('.ipfs-input')?.value.trim();
        const sOrdinalInput = modal?.querySelector('.sOrdinal-input')?.value.trim();
        const dropdown = modal?.querySelector(`#audional-dropdown-${index}`);
        const dropdownValue = dropdown?.value;
        const dropdownText = dropdown?.selectedOptions[0]?.text;

        if (event?.target) { // Dropdown change
            if (dropdownValue) {
                url = dropdownValue;
                sampleName = dropdownText;
            }
        } else { // Load button clicked
            if (audionalInput) {
                url = `https://ordinals.com/content/${audionalInput}`;
                sampleName = audionalInput.split('/').pop();
            } else if (ipfsInput) {
                url = `https://ipfs.io/ipfs/${ipfsInput}`;
                sampleName = ipfsInput.split('/').pop();
            } else if (sOrdinalInput) {
                url = `https://content.sordinals.io/inscription-data/${sOrdinalInput}`;
                sampleName = sOrdinalInput.split('/').pop();
            } else if (dropdownValue) {
                url = dropdownValue;
                sampleName = dropdownText;
            }
        }

        if (url && sampleName) {
            processLoad(url, sampleName, index, loadSampleButton, modal);
        } else {
            alert("Please enter an ID, select a file, or choose from a dropdown.");
        }
    } catch (error) {
        handleError('handleLoad', error, 'Failed to load the sample.');
    }
}

/**
 * Processes the loading of audio from a given URL.
 * @param {string} url - The URL to fetch the audio from.
 * @param {string} sampleName - The name of the sample.
 * @param {number} index - The channel index.
 * @param {HTMLElement} loadSampleButton - The button to update upon loading.
 * @param {HTMLElement|null} modal - The modal element to close upon success.
 */
async function processLoad(url, sampleName, index, loadSampleButton, modal) {
    try {
        console.log(`[Load] Fetching audio from ${url} as ${sampleName}`);
        await fetchAudio(url, index, sampleName); // Assuming fetchAudio is defined elsewhere
        window.unifiedSequencerSettings.setChannelName(index, sampleName);
        updateButtonText(index, loadSampleButton);
        showVisualMessage(`Loaded: ${sampleName}`);
        closeAllModals();
    } catch (error) {
        handleError('processLoad', error, determineErrorMessage(error));
    }
}

/**
 * Determines user-friendly error messages based on error content.
 * @param {Error} error - The error object.
 * @returns {string} The user-friendly error message.
 */
function determineErrorMessage(error) {
    if (error.message.includes('404')) {
        return "Audio not found (404). Please check the URL or input.";
    } else if (error.message.includes('network')) {
        return "Network error occurred while loading audio. Please check your connection.";
    }
    return "Failed to load audio. Please check the console for details.";
}

/**
 * Handles the creation and display of custom context menus.
 * @param {Event} event - The context menu event.
 * @param {number} channelIndex - The channel index.
 * @param {HTMLElement} loadSampleButton - The associated load sample button.
 */
function showCustomContextMenu(event, channelIndex, loadSampleButton) {
    event.preventDefault();
    closeCustomContextMenu();

    const menu = createElement('div', 'custom-context-menu', {
        style: `
            position: absolute; left: ${event.pageX}px; top: ${event.pageY}px;
            background: #fff; border: 1px solid #ccc; border-radius: 5px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2); z-index: 1002;
            color: #000;  // Ensures all text is black for visibility
        `,
    });

    const menuOptions = [
        { label: 'Add User Channel Name', action: () => { showChannelNamingModal(channelIndex, loadSampleButton); } },
        { label: 'Copy Channel', action: () => { copyChannel(channelIndex); } },
        { label: 'Paste Channel', action: () => { pasteChannel(channelIndex, loadSampleButton); } },
    ];

    menuOptions.forEach(({ label, action }) => {
        const item = createElement('div', 'context-menu-item', {
            textContent: label,
            style: 'padding: 8px 12px; cursor: pointer;',
        });
        item.addEventListener('click', () => { action(); closeCustomContextMenu(); });
        menu.appendChild(item);
    });

    document.body.appendChild(menu);

    // Close the menu when clicking outside
    const outsideClickListener = (e) => {
        if (!menu.contains(e.target)) {
            closeCustomContextMenu();
            document.removeEventListener('click', outsideClickListener);
        }
    };
    document.addEventListener('click', outsideClickListener);
}

/**
 * Closes any existing custom context menu.
 */
function closeCustomContextMenu() {
    const existingMenu = document.querySelector('.custom-context-menu');
    if (existingMenu) existingMenu.remove();
}

/**
 * Handles the context menu event.
 * @param {Event} event - The context menu event.
 * @param {number} channelIndex - The channel index.
 * @param {HTMLElement} loadSampleButton - The associated load sample button.
 */
function handleContextMenu(event, channelIndex, loadSampleButton) {
    showCustomContextMenu(event, channelIndex, loadSampleButton);
}

// Channel Naming Modal

/**
 * Displays a modal to rename a channel.
 * @param {number} channelIndex - The channel index.
 * @param {HTMLElement} loadSampleButton - The associated load sample button.
 */
function showChannelNamingModal(channelIndex, loadSampleButton) {
    closeAllModals();

    const modalContent = createElement('div', 'channel-naming-modal', {
        style: `
            background: #fff; padding: 20px; border-radius: 5px; width: 300px;
            display: flex; flex-direction: column; gap: 10px;
        `,
    });

    const input = createElement('input', 'channel-name-input', {
        type: 'text',
        placeholder: 'Give this channel a name',
        style: `
            width: 100%; padding: 8px; box-sizing: border-box;
            border: 1px solid #ccc; border-radius: 3px;
        `,
    });

    const buttons = createActionButtons([
        { text: 'Submit', action: () => submitChannelName(), className: 'green-button' },
        { text: 'Cancel', action: () => closeAllModals(), className: 'red-button' },
    ]);

    modalContent.appendChild(input);
    modalContent.appendChild(buttons);

    const modalOverlay = createModal(modalContent);
    AppState.openModals.push(modalOverlay);
    document.body.appendChild(modalOverlay);
    input.focus();

    // Handle Enter key submission
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitChannelName();
    });

    function submitChannelName() {
        const name = input.value.trim();
        if (name) {
            window.unifiedSequencerSettings.setChannelName(channelIndex, name);
            updateProjectChannelNamesUI(channelIndex, name);
            loadSampleButton.textContent = name;
            showVisualMessage('Channel name updated.');
            closeAllModals();
        } else {
            alert('Channel name cannot be empty.');
        }
    }
}

// Channel Operations

/**
 * Updates the UI with the new channel name.
 * @param {number} channelIndex - The channel index.
 * @param {string} name - The new channel name.
 */
function updateProjectChannelNamesUI(channelIndex, name) {
    const nameDisplay = document.getElementById(`channel-name-${channelIndex}`);
    if (nameDisplay) nameDisplay.textContent = name;
    window.unifiedSequencerSettings.setChannelName(channelIndex, name);
    console.log(`[UI] Updated channel name for ${channelIndex}: ${name}`);
}

/**
 * Copies the entire channel configuration to the clipboard.
 * @param {number} channelIndex - The channel index.
 */
function copyChannel(channelIndex) {
    try {
        const settings = window.unifiedSequencerSettings.settings.masterSettings;
        const channelSettings = settings.channelSettings[`ch${channelIndex}`] || { volume: 1, pitch: 1 };
        const playbackSpeed = window.unifiedSequencerSettings.channelPlaybackSpeed[channelIndex] || 1;
        const trimSettings = window.unifiedSequencerSettings.getTrimSettings(channelIndex) || { start: 0, end: 0, totalSampleDuration: 1 };
        const allSteps = Object.keys(settings.projectSequences).reduce((acc, seqKey) => {
            if (settings.projectSequences[seqKey][`ch${channelIndex}`]) {
                acc[seqKey] = settings.projectSequences[seqKey][`ch${channelIndex}`].steps.map(step => ({ ...step }));
            }
            return acc;
        }, {});

        const copiedData = {
            ordinalId: extractOrdinalId(settings.channelURLs[channelIndex]),
            name: settings.projectChannelNames[channelIndex],
            volume: channelSettings.volume,
            pitch: channelSettings.pitch,
            playbackSpeed,
            trimSettings,
            steps: allSteps,
        };

        // Serialize the copied data
        const serializedData = JSON.stringify(copiedData);

        // Write to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(serializedData)
                .then(() => {
                    showVisualMessage('Copied Channel to Clipboard.');
                    console.log('Copied Channel:', copiedData);
                })
                .catch(err => {
                    handleError('copyChannel', err, 'Failed to copy channel to clipboard.');
                });
        } else {
            // Fallback for older browsers
            fallbackCopyTextToClipboard(serializedData, 'Channel Data');
        }
    } catch (error) {
        handleError('copyChannel', error, 'Failed to copy channel.');
    }
}

/**
 * Fallback method to copy text to clipboard for older browsers.
 * @param {string} text - The text to copy.
 * @param {string} label - The label for the copied data.
 */
function fallbackCopyTextToClipboard(text, label) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('aria-label', label);
    textArea.style.position = 'fixed';  // Avoid scrolling to bottom
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showVisualMessage(`Copied ${label}.`);
            console.log(`Copied ${label}:`, text);
        } else {
            throw new Error('Fallback: Copy command was unsuccessful.');
        }
    } catch (err) {
        handleError('fallbackCopyTextToClipboard', err, `Failed to copy ${label}.`);
    }

    document.body.removeChild(textArea);
}

/**
 * Pastes the copied channel configuration from the clipboard into a specific channel.
 * @param {number} channelIndex - The channel index.
 * @param {HTMLElement} loadSampleButton - The associated load sample button.
 */
function pasteChannel(channelIndex, loadSampleButton) {
    try {
        if (navigator.clipboard && navigator.clipboard.readText) {
            navigator.clipboard.readText()
                .then(text => {
                    let copiedData;
                    try {
                        copiedData = JSON.parse(text);
                    } catch (parseError) {
                        throw new Error('Clipboard data is not valid JSON.');
                    }

                    // Validate the copied data structure
                    const requiredFields = ['ordinalId', 'name', 'volume', 'pitch', 'trimSettings', 'steps'];
                    const isValid = requiredFields.every(field => copiedData.hasOwnProperty(field));
                    if (!isValid) {
                        throw new Error('Clipboard data does not contain all required channel fields.');
                    }

                    // Apply Ordinal ID
                    setOrdinalId(channelIndex, copiedData.ordinalId);

                    // Apply Channel Name
                    window.unifiedSequencerSettings.setChannelName(channelIndex, copiedData.name);
                    loadSampleButton.textContent = copiedData.name;
                    updateProjectChannelNamesUI(channelIndex, copiedData.name);

                    // Apply Volume and Pitch
                    window.unifiedSequencerSettings.settings.masterSettings.channelSettings[`ch${channelIndex}`] = {
                        volume: copiedData.volume,
                        pitch: copiedData.pitch,
                    };
                    setChannelVolume(channelIndex, copiedData.volume); // Assuming setChannelVolume is defined elsewhere

                    // Apply Playback Speed
                    window.unifiedSequencerSettings.setChannelPlaybackSpeed(channelIndex, copiedData.playbackSpeed);

                    // Apply Trim Settings
                    window.unifiedSequencerSettings.setTrimSettings(channelIndex, copiedData.trimSettings.start, copiedData.trimSettings.end);
                    window.unifiedSequencerSettings.settings.masterSettings.trimSettings[channelIndex] = copiedData.trimSettings;
                    window.unifiedSequencerSettings.notifyObservers();
                    window.unifiedSequencerSettings.updateTrimSettingsUI([copiedData.trimSettings]);

                    // Apply Steps
                    Object.entries(copiedData.steps).forEach(([seqKey, steps]) => {
                        if (window.unifiedSequencerSettings.settings.masterSettings.projectSequences[seqKey]) {
                            window.unifiedSequencerSettings.settings.masterSettings.projectSequences[seqKey][`ch${channelIndex}`] = { steps: steps.map(step => ({ ...step })) };
                        }
                    });

                    // Load the sample
                    const url = `https://ordinals.com/content/${copiedData.ordinalId}`;
                    processLoad(url, copiedData.name, channelIndex, loadSampleButton, null);

                    showVisualMessage('Pasted Channel from Clipboard.');
                    console.log('Pasted Channel:', copiedData);
                })
                .catch(err => {
                    handleError('pasteChannel', err, 'Failed to paste channel from clipboard.');
                });
        } else {
            // Fallback for older browsers or if clipboard API is not supported
            alert('Clipboard API not supported. Please manually copy the channel data.');
        }
    } catch (error) {
        handleError('pasteChannel', error, 'Failed to paste channel.');
    }
}

/**
 * Copies the entire channel configuration across all channels.
 * @param {HTMLElement} loadSampleButton - The associated load sample button.
 */
function pasteChannelToAll(channelIndex, loadSampleButton) {
    // Optional: Implement if needed to paste to all channels
}

/**
 * Copies the channel name to a global state.
 * Deprecated: Using consolidated copyChannel instead.
 */

/**
 * Pastes the channel name from the global state.
 * Deprecated: Using consolidated pasteChannel instead.
}

// Setup Functions

/**
 * Initializes the load sample button for a channel.
 * @param {HTMLElement} channel - The channel element.
 * @param {number} index - The channel index.
 */
function setupLoadSampleButton(channel, index) {
    const loadSampleButton = channel.querySelector('.load-sample-button');
    if (!loadSampleButton) {
        console.error("Load sample button not found.");
        return;
    }

    loadSampleButton.id = `load-sample-button-${index}`;
    loadSampleButton.dataset.ordinalId = extractOrdinalId(window.unifiedSequencerSettings.settings.masterSettings.channelURLs[index]);
    loadSampleButton.textContent = getButtonText(index);

    // Click to open modal
    loadSampleButton.addEventListener('click', () => {
        const modal = openLoadSampleModal(index, loadSampleButton);
        AppState.openModals.push(modal);
    });

    // Right-click to open custom context menu
    loadSampleButton.addEventListener('contextmenu', (event) => {
        handleContextMenu(event, index, loadSampleButton);
    });
}

// Exported Function
export { setupLoadSampleButton };
