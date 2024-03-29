const sequencerWebWorker = new Worker('EmbeddedSequencer/allInOneSequencer.js');

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

    var playSignalReceived = false; // Flag to track play signal receipt

    let cci2 = 18; // Initial CCI2 value
    const initialCCI2 = 18; // Store the initial value of cci2 to reset later
    let seed = 9484736768571345; // Seed value, can be adjusted for production purposes

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
            sequencerWebWorker.postMessage({ action: isPlaying ? 'stop' : 'start' });
            isPlaying = !isPlaying; // Toggle the playback state
            console.log(`Visualizer action: ${action}`); // Debugging
        });

    });

   // Existing resetToInitialState function
    function resetToInitialState() {
        cci2 = 18; // Reset to initial cci2 value
        console.log(`Stop received. CCI2 reset to initial value ${initialCCI2}.`);
        // Trigger a visual update to reflect the reset cci2 value
        requestAnimationFrame(() => d(new Date().getTime())); // Force redraw with updated cci2
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

    


let scaleFactor = 3,
    S = window.innerWidth,
    R = 100 * scaleFactor,
    H = 2 * R,
    RS = (2 * Math.PI) / 2000 / 1000,
    SR = 100 * scaleFactor,
    OR = 100 * scaleFactor,
    cv = document.getElementById('cv'),
    cx = cv.getContext('2d');

cv.width = S;
cv.height = S;

class Cy {
    constructor(c, r, h, s) {
        this.c = c;
        this.r = r;
        this.h = h;
        this.s = s;
        this.gV();
        this.gF();
    }

    gV() {
        this.v = [];
        for (let i = 0; i <= this.s; i++) {
            let y = this.c.y - this.h / 2 + (i / this.s) * this.h;
            for (let j = 0; j <= this.s; j++) {
                let a = (j / this.s) * 2 * Math.PI,
                    x = this.c.x + this.r * Math.cos(a),
                    z = this.c.z + this.r * Math.sin(a);
                this.v.push({ x, y, z });
            }
        }
    }

    gF() {
        this.f = [];
        for (let i = 0; i < this.s; i++) {
            for (let j = 0; j < this.s; j++) {
                let i1 = i * (this.s + 1) + j,
                    i2 = i1 + 1,
                    i3 = i1 + this.s + 1,
                    i4 = i3 + 1;
                this.f.push([i1, i2, i3]);
                this.f.push([i2, i4, i3]);
            }
        }
    }

    rP(p, a) {
        this.v = this.v.map((v) => {
            let x = v.x - p.x,
                y = v.y - p.y,
                x1 = x * Math.cos(a) - y * Math.sin(a),
                y1 = x * Math.sin(a) + y * Math.cos(a);
            return { x: x1 + p.x, y: y1 + p.y, z: v.z };
        });
    }
}

class Sp {
    constructor(c, r, s) {
        this.c = c;
        this.r = r;
        this.s = s;
        this.gV();
        this.gF();
    }

    gV() {
        this.v = [];
        for (let i = 0; i <= this.s; i++) {
            let l = (i / this.s) * Math.PI;
            for (let j = 0; j <= this.s; j++) {
                let o = (j / this.s) * 2 * Math.PI,
                    x = this.c.x + this.r * Math.sin(l) * Math.cos(o),
                    y = this.c.y + this.r * Math.sin(l) * Math.sin(o),
                    z = this.c.z + this.r * Math.cos(l);
                this.v.push({ x, y, z });
            }
        }
    }

    gF() {
        this.f = [];
        for (let i = 0; i < this.s; i++) {
            for (let j = 0; j < this.s; j++) {
                let i1 = i * (this.s + 1) + j,
                    i2 = i1 + 1,
                    i3 = i1 + this.s + 1,
                    i4 = i3 + 1;
                this.f.push([i1, i2, i3]);
                this.f.push([i2, i4, i3]);
            }
        }
    }

    rP(p, a) {
        this.v = this.v.map((v) => {
            let x = v.x - p.x,
                y = v.y - p.y,
                x1 = x * Math.cos(a) - y * Math.sin(a),
                y1 = x * Math.sin(a) + y * Math.cos(a);
            return { x: x1 + p.x, y: y1 + p.y, z: v.z };
        });
    }
}

class Cp {
    constructor(c, r, h, s) {
        this.c = c;
        this.r = r;
        this.h = h;
        this.s = s;
        this.cy = new Cy(c, r, h, s);
        this.sp1 = new Sp({ x: c.x - r, y: c.y, z: c.z }, r, s);
        this.sp2 = new Sp({ x: c.x + r, y: c.y, z: c.z }, r, s);
    }

    rP(p, a) {
        this.cy.rP(p, a);
        this.sp1.rP(p, a);
        this.sp2.rP(p, a);
    }
}

let cp = new Cp({ x: S / 2, y: S / 2, z: 0 }, R, H, 30);
let os1 = new Sp({ x: S / 2 - OR, y: S / 2, z: 0 }, SR, 30);
let os2 = new Sp({ x: S / 2 + OR, y: S / 2, z: 0 }, SR, 30);
let t;
