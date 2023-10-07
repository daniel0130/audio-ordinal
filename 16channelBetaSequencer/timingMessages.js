// timingMessages.js

const sequencerChannel = new BroadcastChannel('sequencerChannel');

function emitMessage(type, data) {
    console.log(`[Sequencer] Emitting message of type "${type}" with data:`, data);
    sequencerChannel.postMessage({ type, data });
}

function emitBar(barCount) {
    emitMessage('bar', { bar: barCount });
}

function emitBeat(beatCount, barCount) {
    emitMessage('beat', { beat: beatCount, bar: barCount });
}

function emitPause() {
    emitMessage('pause', {});
}

function emitResume() {
    emitMessage('resume', {});
}

function emitStop() {
    emitMessage('stop', {});
}