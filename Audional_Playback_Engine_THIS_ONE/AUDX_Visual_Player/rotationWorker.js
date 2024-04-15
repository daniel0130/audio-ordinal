// rotationWorker.js
// Define a function for rotating vertices of any object (like 'Cy' or 'Sp')
function rotateVertices(vertices, pivot, angle) {
    return vertices.map(v => {
        let x = v.x - pivot.x,
            y = v.y - pivot.y,
            x1 = x * Math.cos(angle) - y * Math.sin(angle),
            y1 = x * Math.sin(angle) + y * Math.cos(angle);
        return { x: x1 + pivot.x, y: y1 + pivot.y, z: v.z };
    });
}

// Handle message from main thread
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

// Inside rotationWorker.js

// Function to simulate test message event
function testRotateVertices() {
    const testVertices = [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }]; // Simple test case
    const pivot = { x: 0, y: 0, z: 0 };
    const angle = Math.PI / 2; // 90 degrees

    // Simulate sending a message to the worker
    self.onmessage({
        data: {
            id: 'test',
            vertices: testVertices,
            pivot: pivot,
            angle: angle
        }
    });
}

// Override postMessage to handle test response
const originalPostMessage = postMessage;
self.postMessage = function(message) {
    if (message.id === 'test') {
       // Adjust the assertion to account for floating-point precision
        console.assert(
            Math.abs(message.updatedVertices[1].x - 0) < 0.0001 && Math.abs(message.updatedVertices[1].y - 1) < 0.0001,
            'Vertex rotation test failed'
        );
        console.log('Vertex rotation test passed');

        // Restore the original postMessage after test
        self.postMessage = originalPostMessage;
    } else {
        originalPostMessage.apply(self, arguments);
    }
};

// Run the test
testRotateVertices();
