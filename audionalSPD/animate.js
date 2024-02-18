// animate.js
let animationTimeoutId = null;


// Function to start animation
function startAnimation(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;

    // element.classList.add('shake-animation');
    //
    element.classList.add('shake-all-directions-animation');
    //
    // element.classList.add('bounce-zoom-in-animation');
    //
    // element.classList.add('zoom-out-animation');
    //
    // element.classList.add('pulse-animation');
    //
    // element.classList.add('spin-animation');


    // Clear any existing timeout to prevent stopping the animation prematurely
    if (animationTimeoutId) {
        clearTimeout(animationTimeoutId);
        animationTimeoutId = null;
    }

    // Set a timeout to remove the animation class if there are no further calls
    animationTimeoutId = setTimeout(() => {
        // element.classList.remove('shake-animation');
        //
        element.classList.remove('shake-all-directions-animation');
        //
        // element.classList.remove('bounce-zoom-in-animation');
        //
        // element.classList.remove('zoom-out-animation');
        //
        // element.classList.remove('pulse-animation');
        //
        // element.classList.remove('spin-animation');


        animationTimeoutId = null;
    }, 150); // Adjust timeout duration as needed based on testing
}

// Function to stop animation
function stopAnimation(elementId) {
    const element = document.getElementById(elementId);
    if (!element) return;
    // Remove shake animation class
    // element.classList.remove('shake-animation');
    //
    element.classList.remove('shake-all-directions-animation');
    //
    // element.classList.remove('bounce-zoom-in-animation');
    //
    // Optionally, reset any style properties modified by the animation
    //
    // element.classList.remove('zoom-out-animation');
    //
    // element.classList.remove('pulse-animation');
    //
    // element.classList.remove('spin-animation');

}


// element.classList.add('shake-all-directions-animation');
// element.classList.remove('shake-all-directions-animation');


// element.classList.add('bounce-zoom-in-animation');
// element.classList.remove('bounce-zoom-in-animation');


// element.classList.add('zoom-out-animation');
// element.classList.remove('zoom-out-animation');

// element.classList.add('pulse-animation');
// element.classList.remove('pulse-animation');


// element.classList.add('spin-animation');
// element.classList.remove('spin-animation');


// @keyframes shake {
//     0%, 100% { transform: translateX(0); }
//     10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//     20%, 40%, 60%, 80% { transform: translateX(5px); }
// }

// .shake-animation {
//     animation: shake 0.15s cubic-bezier(.36,.07,.19,.97) both infinite;
//     transform: translate3d(0, 0, 0);
//     backface-visibility: hidden;
//     perspective: 1000px;
// }


// /* Bounce - Zoom In */
    
// @keyframes bounce-zoom-in {
//     0%, 100% { transform: scale(1); }
//     50% { transform: scale(1.05); }
// }

// .bounce-zoom-in-animation {
//     animation: bounce-zoom-in 0.15s cubic-bezier(.36,.07,.19,.97) both infinite;
// }


// /* Zoom Out */

// @keyframes zoom-out {
//     0%, 100% { transform: scale(1); }
//     50% { transform: scale(0.95); }
// }

// .zoom-out-animation {
//     animation: zoom-out 0.15s cubic-bezier(.36,.07,.19,.97) both infinite;
// }



// /* Pulse */

// @keyframes pulse {
//     0%, 100% { transform: scale(1); }
//     50% { transform: scale(1.1); }
// }

// .pulse-animation {
//     animation: pulse 0.6s cubic-bezier(.36,.07,.19,.97) both infinite;
// }



// /* Spin */

// @keyframes spin {
//     0% { transform: rotate(0deg); }
//     100% { transform: rotate(360deg); }
// }

// .spin-animation {
//     animation: spin 0.15s linear both infinite;
// }
