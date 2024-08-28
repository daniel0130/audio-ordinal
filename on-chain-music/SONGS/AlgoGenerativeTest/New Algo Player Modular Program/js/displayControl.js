// displayControl.js

function createTextElement(text, className) {
    const element = document.createElement("div");
    element.textContent = text;
    element.classList.add("text-element", className);
    document.body.appendChild(element);
    return element;
}

function initialFadeIn() {
    const fadeOverlay = document.getElementById("fadeOverlay");
    setTimeout(() => {
        fadeOverlay.style.opacity = "0";
    }, 100);
}

function displayText() {
    const texts = [
        { text: "? ? ?", className: "freedom", fadeIn: 0, fadeOut: 15740 },
        { text: "me?op?onic", className: "melophonic", fadeIn: 15740, fadeOut: 31480 },
        { text: "SQ?ZY", className: "sqyzy", fadeIn: 31480, fadeOut: 47800 }
    ];

    texts.forEach(({ text, className, fadeIn, fadeOut }) => {
        const textElement = createTextElement(text, className);
        setTimeout(() => textElement.style.opacity = "1", fadeIn);
        setTimeout(() => textElement.style.opacity = "0", fadeOut);
    });
}

function displayPlayText() {
    const playTextElement = document.createElement("div");
    playTextElement.textContent = "? ? ?";
    playTextElement.className = "play-text";
    document.body.appendChild(playTextElement);
    setTimeout(() => {
        playTextElement.style.opacity = "0";
    }, 100);
}

// Window onload event to initialize display elements
window.onload = function () {
    log("Window onload event triggered");

    window.AccessLevel = 10;
    window.isTrippy = true;
    window.playbackLoopCount = 1000;
    window.clearCanvas = false;

    log("Initial values set");

    initialFadeIn();
    document.title = "Freedom to Transact";
    displayText();

    const enforceClearCanvas = setInterval(() => {
        if (window.clearCanvas) {
            window.clearCanvas = false;
            log("clearCanvas enforced to false");
        }
    }, 1000);

    if (typeof handlePlaybackStateChange === "function") {
        handlePlaybackStateChange();
        log("handlePlaybackStateChange called");
    }

    setTimeout(() => clearInterval(enforceClearCanvas), 20000);
};

// Expose functions to the global window object
window.createTextElement = createTextElement;
window.initialFadeIn = initialFadeIn;
window.displayText = displayText;
window.displayPlayText = displayPlayText;
