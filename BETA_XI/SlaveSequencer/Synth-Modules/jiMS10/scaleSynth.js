// scaleSynth.js

function scaleSynthContainer() {
    const synthContainer = document.querySelector('.synth-container');
    const parentWidth = window.innerWidth;
    const parentHeight = window.innerHeight;
    const containerWidth = synthContainer.scrollWidth;
    const containerHeight = synthContainer.scrollHeight;

    const scaleX = parentWidth / containerWidth;
    const scaleY = parentHeight / containerHeight;
    const scale = Math.min(scaleX, scaleY); // Maintain aspect ratio

    synthContainer.style.transform = `scale(${scale})`;
}

window.addEventListener('resize', scaleSynthContainer);
window.addEventListener('load', scaleSynthContainer);
