"use strict";
const audioCtx = new AudioContext();
var volume = 0.2;
//Read and write frequency:
// value of element / number of elements * 1100 + 132
function sound(frequency, volumeMult = 1) {
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.connect(gain);
    gain.connect(audioCtx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = 'triangle';
    let t = audioCtx.currentTime;
    oscillator.start(0);
    gain.gain.setValueAtTime(0, 0);
    gain.gain.linearRampToValueAtTime(0.05 * volume * volumeMult, t + 0.005);
    gain.gain.linearRampToValueAtTime(0, t + 0.105);
    oscillator.stop(t + 0.1);
}
const contentContainer = document.getElementById('content');
