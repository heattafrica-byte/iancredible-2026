export const playStartupSound = () => {
    // Create an audio context, checking for browser compatibility.
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (!audioContext) {
        console.warn("Web Audio API is not supported in this browser.");
        return;
    }

    // Attempt to resume the context if it's suspended by browser autoplay policies.
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Define the notes of a Cmaj7 arpeggio, ending on a high C for a sense of resolution.
    const notes = [
        261.63, // C4
        329.63, // E4
        392.00, // G4
        493.88, // B4
        523.25, // C5
    ];

    const noteDuration = 0.12;
    const startTime = audioContext.currentTime + 0.1; // Add a tiny delay for stability.

    notes.forEach((freq, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.type = 'sine'; // A clean, pure tone.
        osc.frequency.setValueAtTime(freq, 0);
        gain.connect(audioContext.destination);
        osc.connect(gain);

        const noteStartTime = startTime + index * noteDuration;
        
        // A simple volume envelope for each note to avoid clicks and create a softer sound.
        gain.gain.setValueAtTime(0, noteStartTime);
        gain.gain.linearRampToValueAtTime(0.15, noteStartTime + 0.01); // Quick attack.
        gain.gain.linearRampToValueAtTime(0, noteStartTime + noteDuration - 0.01); // Fade out before note ends.

        osc.start(noteStartTime);
        osc.stop(noteStartTime + noteDuration);
    });

    // The audio context will be garbage collected after all scheduled sounds finish playing.
};
