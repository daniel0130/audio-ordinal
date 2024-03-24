console.log('d.js loaded');


// Function to draw an object with dynamic coloring based on time (`tm`)
cp.drawObjectD1 = function(obj, tm) {
    // Loop through each face (`f`) of the object
    for (let f of obj.f) {
        // Map the vertex indices to their corresponding vertex objects
        let v = f.map((i) => obj.v[i]);
        // Extract the x, y coordinates of each vertex
        let p = v.map((v) => ({ x: v.x, y: v.y }));
        // Begin drawing the path
        cx.beginPath();
        cx.moveTo(p[0].x, p[0].y);
        for (let i = 1; i < p.length; i++) {
            cx.lineTo(p[i].x, p[i].y);
        }
        cx.closePath();

        // Calculate the angle for color adjustment based on the object's position and size `S`
        let angle = Math.atan2(p[0].y - S / 2, p[0].x - S / 2) * 180 / Math.PI;
        
        // Dynamically obtain colors based on the angle, time, and vertices
        let colors = getColors(angle, tm, v, true); // Logs and records this selection
        // Set the fill color and fill the path
        cx.fillStyle = colors[cci2 % colors.length];
        cx.fill();

        // Set the stroke color and stroke the path
        cx.strokeStyle = 'black';
        cx.stroke();
    }
};

// Animation function that updates the drawing based on time (`tm`)
function d(tm) {
    // Clear the canvas for the next frame
    cx.clearRect(0, 0, S, S);
    let a;
    // Initialize or update the rotation angle based on the elapsed time
    if (t === undefined) {
        a = 0;
    } else {
        let d = tm - t;
        a = RS * d * 100;
    }
    // Update time for the next frame
    t = tm;
    // Rotate color patterns based on the current angle
    cp.rP(cp.c, a);

    // Draw each object with dynamic coloring
    cp.drawObjectD1(cp.cy, tm);
    cp.drawObjectD1(cp.sp1, tm);
    cp.drawObjectD1(cp.sp2, tm);
    // Request the next animation frame
    requestAnimationFrame(d);
}

// Start the animation
requestAnimationFrame(d);


