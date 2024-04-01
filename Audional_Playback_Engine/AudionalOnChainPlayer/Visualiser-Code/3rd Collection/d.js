// d.js - Drawing Logic and Animation Control
console.log('d.js loaded');

function logColorSelection(index, color) {
    console.log(`Selected Color Index: ${index}, Color: ${color}`);
}

// Function to draw a given object with updated time-based dynamics
function drawObjectWithTimeDynamics(object, currentTime) {
    object.faces.forEach(face => {
        const vertices = face.map(index => object.vertices[index]);
        const points = vertices.map(vertex => ({
            x: Math.round(vertex.x),
            y: Math.round(vertex.y)
        }));

        // Begin path for current face
        context.beginPath();
        context.moveTo(points[0].x, points[0].y);
        points.slice(1).forEach(point => {
            context.lineTo(point.x, point.y);
        });
        context.closePath();

        // Calculate the angle for dynamic color adjustments
        let angle = Math.atan2(points[0].y - size / 2, points[0].x - size / 2) * 180 / Math.PI;
        
        // Obtain colors dynamically using the provided getColors function
        let colors = getColors(angle, currentTime, vertices, logColorSelection);
        context.fillStyle = colors[currentEffectIndex % colors.length];
        context.fill();

        context.strokeStyle = 'black';
        context.stroke();
    });
}

// Animation loop function
function animate(currentTime) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    let angleDelta;
    if (timeLastFrame === undefined) {
        angleDelta = 0;
    } else {
        const timeDifference = currentTime - timeLastFrame;
        angleDelta = rotationSpeed * timeDifference * 100;
    }
    timeLastFrame = currentTime;
    
    // Rotate shapes and draw them with updated positions
    // Make sure to replace 'centralPiece' with 'compositeShape'
    compositeShape.rotatePivot(compositeShape.cylinder.center, angleDelta);
    drawObjectWithTimeDynamics(compositeShape.cylinder, currentTime);
    drawObjectWithTimeDynamics(compositeShape.sphere1, currentTime);
    drawObjectWithTimeDynamics(compositeShape.sphere2, currentTime);
    
    requestAnimationFrame(animate);
}

// Start the animation
requestAnimationFrame(animate);

// // Testing Animation Loop - start with static draw
// console.log('Testing Animation Loop with Static Draw...');
// function testStaticDraw() {
//     context.fillStyle = 'green'; // Use a distinct color for testing
//     context.fillRect(0, 0, canvas.width, canvas.height); // Should fill the canvas with green
// }
// testStaticDraw(); // Call it once to see if canvas fills with green

// // Continue with actual animation test after static draw test succeeds
// function testAnimation(currentTime) {
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     // ... [Existing animation code remains unchanged] ...
//     requestAnimationFrame(testAnimation);
// }
// Start with testStaticDraw, then comment it out and uncomment the line below
// requestAnimationFrame(testAnimation);