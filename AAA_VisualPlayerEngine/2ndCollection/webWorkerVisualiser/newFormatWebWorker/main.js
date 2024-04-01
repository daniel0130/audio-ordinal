// main.js
const visualiserWebWorker = new Worker('visualiserWebWorker.js', { type: 'module' });


let cv, cx;

document.addEventListener('DOMContentLoaded', (event) => {
    let scaleFactor = 3;
    cv = document.getElementById('cv');
    cx = cv.getContext('2d');

    // It seems you intend to set cv.width and cv.height based on scaleFactor,
    // so you should define S before you use it to set cv dimensions.
    let S = 200 * scaleFactor;
    cv.width = window.innerWidth; // If you meant to use S here, replace window.innerWidth with S
    cv.height = 200 * scaleFactor; // This matches the intention you've described

    let R = 100 * scaleFactor,
        H = 2 * R,
        RS = (2 * Math.PI) / 2000 / 1000,
        SR = 100 * scaleFactor,
        OR = 100 * scaleFactor;

    let cci2 = 18, // Initial CCI2 value
        initialCCI2 = 18, // Store the initial value of cci2 to reset later
        seed = 9484736768571345; // Seed value, can be adjusted for production purposes

    // Enhanced randomization function using a seed
    function randomWithSeed(seedValue) {
        const x = Math.sin(seedValue) * 10000;
        return x - Math.floor(x);
    }

// Function to calculate cci2 based on channelIndex and seed, now with enhanced randomness
function calculateCCI2(channelIndex) {
    if (channelIndex === undefined) {
        console.log("Warning: channelIndex is undefined. Unable to calculate CCI2.");
        return initialCCI2; // Return a safe value or handle the case appropriately
    }
    const randomSeed = seed + channelIndex;
    const randomMultiplier = randomWithSeed(randomSeed) * 100;
    return Math.floor(randomMultiplier) + 1;
}




// Existing resetToInitialState function
function resetToInitialState() {
    cci2 = 18; // Reset to initial cci2 value
    console.log(`Stop received. CCI2 reset to initial value ${initialCCI2}.`);
    // Trigger a visual update to reflect the reset cci2 value
    requestAnimationFrame(() => d(new Date().getTime())); // Force redraw with updated cci2
}





    S = window.innerWidth;
    cv = document.getElementById('cv'),
    cx = cv.getContext('2d');

cv.width = S;
cv.height = S;

    // Global declaration of the AudioContext
    var audioCtx; // Use var to ensure it's accessible globally



    function getOrCreateAudioContext() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            console.log("AudioContext initialized.");
        }
        return audioCtx;
    }

    // Initialize or get the existing AudioContext as soon as possible
    getOrCreateAudioContext();


visualiserWebWorker.onmessage = function(e) {
    if (e.data.action === 'geometryCalculated') {
        const data = e.data.data;
        // Directly use data or reconstruct Cp instance
        const cp = reconstructCp(data.cp);
        // Now you can use cp in your drawing logic
    }
};

function reconstructCp(serializedCp) {
    // Implement logic to reconstruct a Cp instance from serialized data
    // This is a simplification
    return new Cp(serializedCp.c, serializedCp.r, serializedCp.h, serializedCp.s);
}



function handlePlay() {
    if (!audioCtx) {
        audioCtx = getOrCreateAudioContext();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume().then(() => {
            console.log("AudioContext resumed successfully.");
            // Initialize or synchronize visual playback
        });
    }
    playSignalReceived = true; // Indicate that play signal has been received
}



// d2.js

function drawObjects(data) {

console.log('d2.js loaded');

// Draw function remains unchanged, as it correctly handles drawing based on passed time.
cp.drawObjectD2 = function(obj, tm) {
    for (let f of obj.f) {
        let v = f.map((i) => obj.v[i]);
        let p = v.map((v) => ({ x: v.x, y: v.y }));
        cx.beginPath();
        cx.moveTo(p[0].x, p[0].y);
        for (let i = 1; i < p.length; i++) {
            cx.lineTo(p[i].x, p[i].y);
        }
        cx.closePath();

        let angle = Math.atan2(p[0].y - S / 2, p[0].x - S / 2) * 180 / Math.PI;
        
        let colors = getColors(angle, tm, v);
        cx.fillStyle = colors[cci2 % colors.length];
        cx.fill();

        cx.strokeStyle = 'black';
        cx.stroke();
    }
};

// Added mechanism to track when playback has stopped
let playbackStopped = true;

function d(tm) {
    let currentTime;
    if (playSignalReceived && audioCtx) {
        currentTime = audioCtx.currentTime;
        playbackStopped = false; // Playback is active
    } else {
        // Transition back to using tm * 0.001 after playback stops
        if (!playbackStopped) {
            playbackStopped = true;
            t = undefined; // Reset t to ensure smooth transition back to pre-playback state
        }
        currentTime = tm * 0.001;
    }
    cx.clearRect(0, 0, S, S);

    let a;
    if (t === undefined) {
        a = 0; // Ensure initial angle is zero if t is not defined
    } else {
        let d = tm - t;
        a = RS * d * 100; // Calculate rotation based on time difference
    }
    t = tm; // Update t to the current timestamp for next frame calculation

    // Drawing objects based on the current time
    cp.rP(cp.c, a); 
    cp.drawObjectD2(cp.cy, currentTime);
    cp.drawObjectD2(cp.sp1, currentTime);
    cp.drawObjectD2(cp.sp2, currentTime);

    requestAnimationFrame(d); // Continue the animation loop
}

requestAnimationFrame(d); // Initial call to start the animation loop


function resetVisualState() {
    // Clear the canvas for a fresh start
    cx.clearRect(0, 0, S, S);

    // Optionally, reinitialize or redraw initial visual elements here
    // For example, drawing a background or initial geometrical shapes

    // Example: Reset initial positions or states of visual elements
    // This is hypothetical and needs to be adapted to your specific needs
    // cp.resetPosition(); // Assuming cp is your central visual object and it has a reset method
}

// Example usage when playback stops
if (!playbackStopped) {
    playbackStopped = true;
    resetVisualState(); // Reset the visual state now
}}

function updateGeometry() {
    visualiserWebWorker.postMessage({
        action: 'calculateGeometry',
        data: {
            // Send necessary data for calculations
        }
    });
}

// Example animation loop
function animate() {
    requestAnimationFrame(animate);
    updateGeometry(); // Update object positions
    // drawObjects(); Call this if immediate drawing without worker response is needed
}

animate(); // Start the animation loop


const channelPlaybackListener = new BroadcastChannel('channel_playback');
channelPlaybackListener.onmessage = (event) => {
    if (event.data.action === 'stop') {
        resetToInitialState(); // Reset everything to its initial state when stop is received
    } else if (event.data.type === 'play') {
        handlePlay(); // Handle play separately
    } else {
        // Handle all other actions, including calculating cci2 based on channelIndex
        const { channelIndex } = event.data;
        cci2 = calculateCCI2(channelIndex);
        console.log(`Received channel playback: Channel ${channelIndex}. CCI2 updated to ${cci2} based on seed ${seed}.`);
    }
};

document.addEventListener('DOMContentLoaded', (event) => {
    const visualizerUI = document.getElementById('cv'); // Assuming the canvas is your visualizer UI
    var isPlaying = false; // Tracks the playback state
    
    visualizerUI.addEventListener('click', () => {
        const action = isPlaying ? 'stop' : 'start'; // Correct 'start' to align with worker
        visualiserWebWorker.postMessage({ action: isPlaying ? 'stop' : 'start' });
        isPlaying = !isPlaying; // Toggle the playback state
        console.log(`Visualizer action: ${action}`); // Debugging
    });

});

});