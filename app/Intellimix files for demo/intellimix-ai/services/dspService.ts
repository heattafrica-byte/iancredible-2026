import { MixdownResult, TrackStates } from '../types';
import { encodeWav } from '../utils/audioUtils';
import { buildTrackDSPChain } from './audioGraphService';


export const renderMixdown = async (
    files: File[], 
    results: MixdownResult[],
    originalSampleRate: number,
    trackStates: TrackStates
): Promise<Blob> => {
    
    // 1. Decode all audio files and find the longest duration
    // We use a new AudioContext for each render to ensure no state leaks
    const targetSampleRate = 48000; // Force 48kHz for world-class quality
    const decodingContext = new AudioContext({ sampleRate: targetSampleRate });
    const audioBuffers = await Promise.all(
        files.map(file => file.arrayBuffer().then(buffer => decodingContext.decodeAudioData(buffer)))
    );
    decodingContext.close(); // Close the context after decoding is done
    
    const maxLength = Math.max(...audioBuffers.map(b => b.length));
    if (maxLength === 0) {
        // No audio data, return an empty wav file
        const emptyBuffer = new AudioContext().createBuffer(2, 1, targetSampleRate);
        return encodeWav(emptyBuffer, 24);
    }
    
    // 2. Create OfflineAudioContext at 48kHz
    const offlineCtx = new OfflineAudioContext(2, maxLength, targetSampleRate);

    const isAnyTrackSoloed = Object.values(trackStates).some(s => s.isSoloed);

    // --- MASTER MATRIX: PHASE 1 & 4 (Routing & Master Ceiling) ---
    
    // 1. Glue Compressor: 2:1 Ratio, 30ms Attack, -1 to -2dB reduction
    const masterCompressor = offlineCtx.createDynamicsCompressor();
    masterCompressor.threshold.value = -12; // Adjust to hit -1 to -2dB GR depending on input
    masterCompressor.ratio.value = 2.0;
    masterCompressor.attack.value = 0.030; // 30ms
    masterCompressor.release.value = 0.100; // 100ms

    // 2. Master Soft Clipper: Shave off top 1dB
    const softClipper = offlineCtx.createWaveShaper();
    const curve = new Float32Array(44100);
    for (let i = 0; i < 44100; ++i) {
        const x = (i * 2) / 44100 - 1;
        curve[i] = (3 + x) * x * 20 * (Math.PI / 180);
    }
    softClipper.curve = curve;
    softClipper.oversample = '4x';

    // 3. True Peak Limiter
    const masterLimiter = offlineCtx.createDynamicsCompressor();
    masterLimiter.threshold.value = -0.3; // Ceiling at -0.3dB
    masterLimiter.ratio.value = 20.0; // Brickwall
    masterLimiter.attack.value = 0.001; // 1ms
    masterLimiter.release.value = 0.050; // 50ms

    // Connect Master Chain
    masterCompressor.connect(softClipper);
    softClipper.connect(masterLimiter);
    masterLimiter.connect(offlineCtx.destination);

    // --- BUS ROUTING MATRIX ---
    
    // Anchor Lane (Kick & Snare): Bypass frequency buses, straight to Drum Bus (Master)
    const anchorBus = offlineCtx.createGain();
    
    // Surgical EQ: -4dB at 300Hz (Mud cut)
    const anchorEQ1 = offlineCtx.createBiquadFilter();
    anchorEQ1.type = 'peaking';
    anchorEQ1.frequency.value = 300;
    anchorEQ1.gain.value = -4;
    anchorEQ1.Q.value = 1.0;

    // Surgical EQ: +2dB at 3kHz (Beater/smack)
    const anchorEQ2 = offlineCtx.createBiquadFilter();
    anchorEQ2.type = 'peaking';
    anchorEQ2.frequency.value = 3000;
    anchorEQ2.gain.value = 2;
    anchorEQ2.Q.value = 1.0;

    anchorBus.connect(anchorEQ1);
    anchorEQ1.connect(anchorEQ2);
    anchorEQ2.connect(masterCompressor);

    // Bus A (Sub Bass): Strictly 0Hz - 90Hz. 24dB/oct Low-Pass at 90Hz.
    const busA = offlineCtx.createGain();
    const busA_LPF1 = offlineCtx.createBiquadFilter();
    busA_LPF1.type = 'lowpass';
    busA_LPF1.frequency.value = 90;
    const busA_LPF2 = offlineCtx.createBiquadFilter(); // Cascade for 24dB/oct
    busA_LPF2.type = 'lowpass';
    busA_LPF2.frequency.value = 90;
    busA.connect(busA_LPF1);
    busA_LPF1.connect(busA_LPF2);
    busA_LPF2.connect(masterCompressor);

    // Bus B (Mid/Instruments): Strictly 150Hz - 2kHz. 24dB/oct High-Pass at 150Hz.
    const busB = offlineCtx.createGain();
    const busB_HPF1 = offlineCtx.createBiquadFilter();
    busB_HPF1.type = 'highpass';
    busB_HPF1.frequency.value = 150;
    const busB_HPF2 = offlineCtx.createBiquadFilter(); // Cascade for 24dB/oct
    busB_HPF2.type = 'highpass';
    busB_HPF2.frequency.value = 150;
    busB.connect(busB_HPF1);
    busB_HPF1.connect(busB_HPF2);

    // --- MID/SIDE PROCESSING ON BUS B ---
    const splitter = offlineCtx.createChannelSplitter(2);
    busB_HPF2.connect(splitter);

    // Mid = (L + R) * 0.5
    const midGain = offlineCtx.createGain();
    midGain.gain.value = 0.5;
    splitter.connect(midGain, 0); // L to Mid
    splitter.connect(midGain, 1); // R to Mid

    // Side = (L - R) * 0.5
    const sideGain = offlineCtx.createGain();
    sideGain.gain.value = 0.5;
    const invertR = offlineCtx.createGain();
    invertR.gain.value = -1;
    splitter.connect(sideGain, 0); // L to Side
    splitter.connect(invertR, 1); // R to invertR
    invertR.connect(sideGain); // -R to Side

    // Process Mid: Cut -2dB at 2kHz to clear phantom center for snare
    const midEQ = offlineCtx.createBiquadFilter();
    midEQ.type = 'peaking';
    midEQ.frequency.value = 2000;
    midEQ.gain.value = -2;
    midEQ.Q.value = 1.0;
    midGain.connect(midEQ);

    // Process Side: High-Pass at 150Hz for mono compatibility
    const sideHPF = offlineCtx.createBiquadFilter();
    sideHPF.type = 'highpass';
    sideHPF.frequency.value = 150;
    sideGain.connect(sideHPF);

    // Recombine: L = Mid + Side, R = Mid - Side
    const merger = offlineCtx.createChannelMerger(2);

    // L = Mid + Side
    midEQ.connect(merger, 0, 0);
    sideHPF.connect(merger, 0, 0);

    // R = Mid - Side
    const invertSide = offlineCtx.createGain();
    invertSide.gain.value = -1;
    sideHPF.connect(invertSide);
    
    midEQ.connect(merger, 0, 1);
    invertSide.connect(merger, 0, 1);

    merger.connect(masterCompressor);

    // Bus C (Highs/Air): Strictly 2kHz and above. 24dB/oct High-Pass at 2kHz.
    const busC = offlineCtx.createGain();
    const busC_HPF1 = offlineCtx.createBiquadFilter();
    busC_HPF1.type = 'highpass';
    busC_HPF1.frequency.value = 2000;
    const busC_HPF2 = offlineCtx.createBiquadFilter(); // Cascade for 24dB/oct
    busC_HPF2.type = 'highpass';
    busC_HPF2.frequency.value = 2000;
    busC.connect(busC_HPF1);
    busC_HPF1.connect(busC_HPF2);
    busC_HPF2.connect(masterCompressor);

    // --- SIDECHAIN DUCKING (Duck & Pump) ---
    // Find the Kick track (or fallback to any Anchor track) to use as a trigger
    const kickTrackResult = results.find(r => r.busRouting === 'ANCHOR' && r.trackName.toLowerCase().includes('kick'));
    const anchorTrackResult = kickTrackResult || results.find(r => r.busRouting === 'ANCHOR');
    
    if (anchorTrackResult) {
        const anchorIndex = files.findIndex(f => f.name === anchorTrackResult.trackName);
        if (anchorIndex !== -1) {
            const anchorBuffer = audioBuffers[anchorIndex];
            const channelData = anchorBuffer.getChannelData(0);
            const threshold = 0.5; // Transient detection threshold
            const duckingDuration = 0.25; // ~1/8th note recovery envelope
            
            let lastTrigger = -duckingDuration; // Initialize to allow trigger at time 0
            for (let i = 0; i < channelData.length; i++) {
                if (Math.abs(channelData[i]) > threshold) {
                    const time = i / targetSampleRate;
                    if (time - lastTrigger > duckingDuration) {
                        const startTime = Math.max(lastTrigger + duckingDuration, time - 0.005);
                        
                        // Trigger ducking on Bus A (drops to near-zero)
                        busA.gain.setValueAtTime(1.0, startTime);
                        busA.gain.linearRampToValueAtTime(0.05, time);
                        busA.gain.exponentialRampToValueAtTime(1.0, time + duckingDuration);

                        // Trigger ducking on Bus B (drops slightly less)
                        busB.gain.setValueAtTime(1.0, startTime);
                        busB.gain.linearRampToValueAtTime(0.2, time);
                        busB.gain.exponentialRampToValueAtTime(1.0, time + duckingDuration);
                        
                        lastTrigger = time;
                    }
                }
            }
        }
    }

    // 3. Create and connect nodes for each track
    audioBuffers.forEach((buffer, index) => {
        const file = files[index];
        const trackResult = results.find(r => r.trackName === file.name);
        const trackState = trackStates[file.name];

        if (!trackResult || !trackState) return;

        const isAudible = !trackState.isMuted && (!isAnyTrackSoloed || trackState.isSoloed);
        if (!isAudible) return;

        const source = offlineCtx.createBufferSource();
        source.buffer = buffer;

        const { finalNode } = buildTrackDSPChain(offlineCtx, trackResult, source);

        // Connect track's final node to the assigned Bus
        if (trackResult.busRouting === 'ANCHOR') {
            finalNode.connect(anchorBus);
        } else if (trackResult.busRouting === 'BUS_A') {
            finalNode.connect(busA);
        } else if (trackResult.busRouting === 'BUS_B') {
            finalNode.connect(busB);
        } else if (trackResult.busRouting === 'BUS_C') {
            finalNode.connect(busC);
        } else {
            // Fallback to master if no bus assigned
            finalNode.connect(masterCompressor);
        }

        source.start(0);
    });

    // 4. Render the audio
    const renderedBuffer = await offlineCtx.startRendering();

    // 5. Encode the rendered buffer as a 24-bit WAV file
    return encodeWav(renderedBuffer, 24);
};
