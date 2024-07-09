let isChannelIndexLocked = false; // Flag to indicate if the channel index is locked

// Retrieves the channel index from storage, or sets it to a default value if not found
function getChannelIndex() {
    const storedIndex = localStorage.getItem('synthChannelIndex');
    return storedIndex !== null ? parseInt(storedIndex, 10) : null;  // Returns null if not set
}

// Sets the channel index in storage if it's not locked
function setChannelIndex(index) {
    if (!isChannelIndexLocked && index !== undefined && index !== null) {
        localStorage.setItem('synthChannelIndex', index.toString());
    }
}

// Resets the channel index in storage and unlocks it
function resetChannelIndex() {
    localStorage.removeItem('synthChannelIndex');
    isChannelIndexLocked = false;
}

// Optionally, a function to initialize the channel index when a synth is opened
function initializeChannelIndex(index) {
    if (!isChannelIndexLocked && getChannelIndex() === null) {  // Only set if not already set
        setChannelIndex(index);
        isChannelIndexLocked = true; // Lock the channel index after it is set
    }
}

// Export the functions to be used in other parts of the application
export { getChannelIndex, setChannelIndex, resetChannelIndex, initializeChannelIndex };
