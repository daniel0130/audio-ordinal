// AUDXVisualiser.js


console.log('Visulaiser.js loaded');


    let isChannel11Active = false; // Flag to track if channel 11 effect is active


    // Enhanced randomization function using a seed
    function randomWithSeed(seedValue) {
        const x = Math.sin(seedValue) * 10000;
        return x - Math.floor(x);
    }

    // Function to calculate cci2 based on channelIndex and seed, now with enhanced randomness
    function calculateCCI2(channelIndex) {
        const randomSeed = seed + channelIndex; // Combine seed with channelIndex for unique seed per channel
        const randomMultiplier = randomWithSeed(randomSeed) * 100; // Generate a pseudo-random number [0, 100)
        return Math.floor(randomMultiplier) + 1; // Ensure CCI2 is within 1-100 range
    }

    document.addEventListener('internalAudioPlayback', function(event) {
        const { action, channelIndex, step } = event.detail; // Corrected to access `event.detail`
        
        // Adjusted conditional check to utilize the destructured `action` variable
        if (action === 'stop') {
            cci2 = initialCCI2; // Reset to initial CCI2 value when stop is received
            isChannel11Active = false; // Reset channel 11 active flag
            console.log(`Stop received. CCI2 reset to initial value ${initialCCI2}`);
            immediateVisualUpdate(); // This is a new function to be implemented
        } else if (action === "activeStep") { // Ensuring that only 'activeStep' actions are processed here
            // `channelIndex` already obtained from destructuring `event.detail`, no need to re-declare
            cci2 = calculateCCI2(channelIndex); // Update the CCI2 with enhanced randomization
            console.log(`Received channel playback: Channel ${channelIndex}. CCI2 updated to ${cci2} based on seed ${seed}.`);
        }
        // Removed redundant logging of `event.detail` here to avoid cluttering the console.
    });

    
    let needImmediateUpdate = false;

    function immediateVisualUpdate() {
        needImmediateUpdate = true; // Set the flag instead of direct drawing
    }
    
        
    // const AudionalPlayerMessages = new BroadcastChannel('channel_playback');
    AudionalPlayerMessages.onmessage = (event) => {
        if (event.data.action === 'stop') {
            cci2 = initialCCI2; // Reset to initial cci2 value when stop is received
            isChannel11Active = false; // Reset channel 11 active flag
            console.log(`Stop received. CCI2 reset to initial value ${initialCCI2}`);
        } else {
            const { channelIndex } = event.data;
            cci2 = calculateCCI2(channelIndex); // Update the CCI2 with enhanced randomization
            console.log(`Received channel playback: Channel ${channelIndex}. CCI2 updated to ${cci2} based on seed ${seed}.`);
        }
    };

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

// Convert the worker script into a string
const workerScript = `
self.onmessage = function(e) {
    const { id, vertices, pivot, angle } = e.data;
    const updatedVertices = vertices.map(v => {
        let x = v.x - pivot.x,
            y = v.y - pivot.y,
            x1 = x * Math.cos(angle) - y * Math.sin(angle),
            y1 = x * Math.sin(angle) + y * Math.cos(angle);
        return { x: x1 + pivot.x, y: y1 + pivot.y, z: v.z };
    });

    postMessage({ id, updatedVertices });
};
`;

// Use a Blob to create an internal URL for the worker script
const blob = new Blob([workerScript], { type: 'application/javascript' });
const workerScriptURL = URL.createObjectURL(blob);

// Create a new Worker using the Blob URL
const rotationWorker = new Worker(workerScriptURL);

rotationWorker.onmessage = function(e) {
    const { id, updatedVertices } = e.data;
    // Update the relevant object with new vertices
    if (id === 'cy') {
        cp.cy.updateVertices(updatedVertices);
    } else if (id.startsWith('sp')) {
        // Determine which sphere and update accordingly
        cp[id].updateVertices(updatedVertices);
    }
};

function sendRotationRequest(id, vertices, pivot, angle) {
    rotationWorker.postMessage({ id, vertices, pivot, angle });
}

function generateVerticesRequest(id, c, r, s) {
    rotationWorker.postMessage({ 
        taskType: 'generateVertices', 
        data: { id, c, r, s } 
    });
}
// Example usage
// sendRotationRequest('cy', cp.cy.v, {x: cp.c.x, y: cp.c.y}, currentAngle);

class Cy {
    constructor(c, r, h, s) {
        this.c = c;
        this.r = r;
        this.h = h;
        this.s = s;
        this.gV();
        this.gF();
    }

    updateVertices(newVertices) {
        this.v = newVertices;
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
        // Send rotation request to the web worker instead of doing it locally
        sendRotationRequest(this.id, this.v, p, a);
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

    updateVertices(newVertices) {
        this.v = newVertices;
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
        // Send rotation request to the web worker instead of doing it locally
        sendRotationRequest(this.id, this.v, p, a);
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

    updateVertices(newVertices) {
        this.v = newVertices;
    }

    rP(p, a) {
        sendRotationRequest('cy', this.cy.v, p, a);
        sendRotationRequest('sp1', this.sp1.v, p, a);
        sendRotationRequest('sp2', this.sp2.v, p, a);
    }
}


let cp = new Cp({ x: S / 2, y: S / 2, z: 0 }, R, H, 30);
let os1 = new Sp({ x: S / 2 - OR, y: S / 2, z: 0 }, SR, 30);
let os2 = new Sp({ x: S / 2 + OR, y: S / 2, z: 0 }, SR, 30);
let t;



////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// d2.js


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

        // Assuming angle, tm, and v are calculated correctly here
        let angle = Math.atan2(p[0].y - S / 2, p[0].x - S / 2) * 180 / Math.PI;
        
        // Now, obtain colors dynamically
        let colors = getColors(angle, tm, v); // Make sure to define tm and v appropriately
        cx.fillStyle = colors[cci2 % colors.length];
        cx.fill();

        cx.strokeStyle = 'black';
        cx.stroke();
    }
};




function d(tm) {
    cx.clearRect(0, 0, S, S);
    let a;
    if (t === undefined) {
        a = 0;
    } else {
        let d = tm - t;
        a = RS * d * 100;
    }
    t = tm;
    cp.rP(cp.c, a); // Adjust color patterns based on rotation

    // Pass `tm` to `cp.drawObjectD2` for dynamic color changes
    cp.drawObjectD2(cp.cy, tm);
    cp.drawObjectD2(cp.sp1, tm);
    cp.drawObjectD2(cp.sp2, tm);
    requestAnimationFrame(d);
}

requestAnimationFrame(d);
