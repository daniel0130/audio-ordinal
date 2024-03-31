// Updated geoEffects.js

// Listen for custom events to trigger each effect

function pulsateShapes(event) {
    const {time, objects, scaleFactor} = event.detail;
    objects.forEach(obj => {
        const scale = Math.sin(time / 1000) * 0.1 + 1; // Pulsate scale between 0.9 and 1.1
        obj.r = obj.originalRadius * scale * scaleFactor; // Adjusting scale based on passed scaleFactor
        // Re-generate vertices and faces if needed
        if (obj.gV && obj.gF) {
            obj.gV();
            obj.gF();
        }
    });
}

function rotateObjects(event) {
    const {time, objects, rotationAngle} = event.detail;
    // Calculate the rotation based on the rotationAngle which includes speed and direction
    const angle = (time / 1000) * rotationAngle; // Use rotationAngle directly

    objects.forEach(obj => {
        obj.rP(obj.c, angle);
    });
}


function morphGeometry(event) {
    const {time, objects} = event.detail;
    const newSegmentation = Math.floor(Math.sin(time / 5000) * 15) + 20; // Change segmentation
    objects.forEach(obj => {
        obj.s = newSegmentation;
        // Re-generate vertices and faces
        obj.gV();
        obj.gF();
    });
}

function expandContract(event) {
    const {time, objects, H} = event.detail;
    objects.forEach(obj => {
        obj.cy.h = obj.originalHeight + Math.sin(time / 1000) * 20; // Expand and contract height
        // Adjust the capsule's spheres' positions based on the new height
        obj.sp1.c.y = obj.cy.c.y - obj.cy.h / 2;
        obj.sp2.c.y = obj.cy.c.y + obj.cy.h / 2;
        // Re-generate vertices and faces if needed
        obj.cy.gV();
        obj.cy.gF();
    });
}

function oscillatePosition(event) {
    const {time, objects, amplitude, S} = event.detail;
    objects.forEach(obj => {
        obj.cy.c.y = S / 2 + Math.sin(time / 1000) * amplitude; // Oscillate vertically
        // Adjust the positions of the spheres in the capsule
        obj.sp1.c.y = obj.cy.c.y - obj.cy.h / 2;
        obj.sp2.c.y = obj.cy.c.y + obj.cy.h / 2;
        // Re-generate vertices and faces if needed
        obj.cy.gV();
        obj.cy.gF();
    });
}

function colorShift(event) {
    const {time, objects} = event.detail;
    const color = `hsl(${time % 360}, 100%, 50%)`;
    objects.forEach(obj => {
        // Assuming applyColorToShape is a function that applies the color to the shape
        applyColorToShape(obj, color);
    });
}

// Setting up listeners for each event
document.addEventListener('pulsateShapes', pulsateShapes);
document.addEventListener('rotateObjects', rotateObjects);
document.addEventListener('morphGeometry', morphGeometry);
document.addEventListener('expandContract', expandContract);
document.addEventListener('oscillatePosition', oscillatePosition);
document.addEventListener('colorShift', colorShift);
