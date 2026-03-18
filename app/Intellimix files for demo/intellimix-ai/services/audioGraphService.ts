import { MixdownResult } from '../types';

export interface DSPControls {
    inputGain: GainNode;
    eq: BiquadFilterNode[];
    compressor: DynamicsCompressorNode;
    panner: StereoPannerNode;
    gain: GainNode;
    fx?: {
        dryGain: GainNode;
        saturation: {
            drive: WaveShaperNode;
            tone: BiquadFilterNode;
        };
        reverb: {
            wetGain: GainNode;
            convolver: ConvolverNode;
        };
        delay: {
            node: DelayNode;
            feedback: GainNode;
            wetGain: GainNode;
        };
        limiter?: DynamicsCompressorNode;
    };
}

// Helper to convert dB to linear gain, with a safety floor.
export const dbToLinear = (db: number) => {
    const clampedDb = Math.max(-96.0, db); // A very quiet floor
    return Math.pow(10, clampedDb / 20);
};

// Helper to create a standard soft-clipping saturation curve.
export const createSaturationCurve = (amount: number): Float32Array => {
    const k = typeof amount === 'number' && amount > 0 ? amount : 1;
    const n_samples = 44100;
    const curve = new Float32Array(n_samples);
    const deg = Math.PI / 180;
    for (let i = 0; i < n_samples; ++i) {
        const x = i * 2 / n_samples - 1;
        curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
};

// Generates a simple stereo impulse response for a synthetic reverb effect.
export const createImpulseResponse = (context: BaseAudioContext, duration: number, decay: number): AudioBuffer => {
    const sampleRate = context.sampleRate;
    const length = sampleRate * Math.max(0.1, duration); // Ensure a minimum length
    const impulse = context.createBuffer(2, length, sampleRate);
    const impulseL = impulse.getChannelData(0);
    const impulseR = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
        // Generate stereo noise
        const randomL = Math.random() * 2 - 1;
        const randomR = Math.random() * 2 - 1;
        
        // Apply exponential decay
        const t = i / length;
        const gain = Math.pow(1 - t, decay);
        impulseL[i] = randomL * gain;
        impulseR[i] = randomR * gain;
    }
    return impulse;
};


// FIX: Helper to map application EQ types to valid Web Audio API BiquadFilterType strings.
// This is critical because an invalid type string causes the node to default to a 'lowpass' filter.
export const mapEqType = (type: 'LOW_SHELF' | 'PEAK' | 'HIGH_SHELF'): BiquadFilterType => {
    switch (type) {
        case 'LOW_SHELF':
            return 'lowshelf';
        case 'PEAK':
            return 'peaking';
        case 'HIGH_SHELF':
            return 'highshelf';
        default:
            // This case should not be reached with the current types, but it's good practice.
            return 'peaking'; 
    }
};

export const buildTrackDSPChain = (
    context: BaseAudioContext,
    trackResult: MixdownResult,
    source: AudioBufferSourceNode,
): { finalNode: AudioNode; controls: DSPControls } => {
    
    const controls: Partial<DSPControls> = { eq: [] };
    let lastNode: AudioNode = source;

    const now = context.currentTime;

    // 1. Input Gain stage (pre-processing)
    controls.inputGain = context.createGain();
    controls.inputGain.gain.setValueAtTime(dbToLinear(trackResult.volume.inputGainDb ?? 0), now);
    lastNode.connect(controls.inputGain);
    lastNode = controls.inputGain;

    // 2. EQ nodes
    trackResult.eq.bands.forEach(band => {
        const filter = context.createBiquadFilter();
        // FIX: Use the mapping function to ensure the correct filter type is set.
        filter.type = mapEqType(band.type);
        filter.frequency.setValueAtTime(band.frequencyHz, now);
        filter.gain.setValueAtTime(band.gaindB, now);
        filter.Q.setValueAtTime(band.q, now);
        lastNode.connect(filter);
        lastNode = filter;
        controls.eq!.push(filter);
    });
    
    // 3. Compressor node
    controls.compressor = context.createDynamicsCompressor();
    controls.compressor.threshold.setValueAtTime(trackResult.compression.thresholddB, now);
    controls.compressor.ratio.setValueAtTime(trackResult.compression.ratio, now);
    controls.compressor.attack.setValueAtTime(trackResult.compression.attackMs / 1000, now);
    controls.compressor.release.setValueAtTime(trackResult.compression.releaseMs / 1000, now);
    lastNode.connect(controls.compressor);
    lastNode = controls.compressor;
    
    // 4. Panner node (created early to be available for FX modulation)
    controls.panner = context.createStereoPanner();
    controls.panner.pan.setValueAtTime(trackResult.panning.position, now);

    // 5. Creative FX Stage (if present)
    if (trackResult.fx) {
        let fxInput: AudioNode = lastNode;
        
        controls.fx = {
            dryGain: context.createGain(),
            saturation: {
                drive: context.createWaveShaper(),
                tone: context.createBiquadFilter(),
            },
            reverb: {
                wetGain: context.createGain(),
                convolver: context.createConvolver(),
            },
            delay: {
                node: context.createDelay(5.0),
                feedback: context.createGain(),
                wetGain: context.createGain(),
            },
        };

        // a. Saturation as an insert (with defaults to prevent NaN)
        const satControls = controls.fx.saturation;
        const drive = trackResult.fx.saturation?.drive ?? 1.0;
        const tone = trackResult.fx.saturation?.tone ?? 5.5;

        satControls.drive.curve = createSaturationCurve(drive * 5);
        satControls.drive.oversample = '4x';
        
        satControls.tone.type = 'highshelf';
        satControls.tone.frequency.setValueAtTime(3000, now);
        const toneGain = (tone - 5.5) * 1.63; // Map 1-10 to ~ -9dB to +9dB
        satControls.tone.gain.setValueAtTime(toneGain, now);

        fxInput.connect(satControls.drive);
        satControls.drive.connect(satControls.tone);
        fxInput = satControls.tone;

        // b. Auto-Pan LFO modulator (with defaults)
        const autoPan = trackResult.fx.autoPan;
        const autoPanRate = autoPan?.rateHz ?? 0;
        const autoPanDepth = autoPan?.depth ?? 0;
        if (autoPan && autoPanRate > 0 && autoPanDepth > 0) {
            const lfo = context.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.setValueAtTime(autoPanRate, now);
    
            const lfoDepth = context.createGain();
            lfoDepth.gain.setValueAtTime(autoPanDepth, now);
    
            lfo.connect(lfoDepth);
            lfoDepth.connect(controls.panner.pan);
            lfo.start(now);
        }

        // c. Delay and Reverb as parallel sends
        const fxMerger = context.createGain();
        fxInput.connect(controls.fx.dryGain);
        controls.fx.dryGain.gain.setValueAtTime(1.0, now);
        controls.fx.dryGain.connect(fxMerger);

        // Delay Send (with defaults)
        const delayControls = controls.fx.delay;
        const delayTimeMs = trackResult.fx.delay?.timeMs ?? 300;
        const feedbackPercent = trackResult.fx.delay?.feedbackPercent ?? 0;
        const mixPercent = trackResult.fx.delay?.mixPercent ?? 0;
        
        const delayMix = mixPercent / 100;
        const delayTimeSec = delayTimeMs / 1000;
        let feedbackGain = feedbackPercent / 100;
        if (delayTimeSec < 0.001 && feedbackGain >= 1.0) {
            feedbackGain = 0.999; // Prevent infinite feedback loop
        }

        delayControls.node.delayTime.setValueAtTime(delayTimeSec, now);
        delayControls.feedback.gain.setValueAtTime(feedbackGain, now);
        delayControls.wetGain.gain.setValueAtTime(delayMix, now);
        
        fxInput.connect(delayControls.wetGain);
        delayControls.wetGain.connect(delayControls.node);
        delayControls.node.connect(delayControls.feedback);
        delayControls.feedback.connect(delayControls.node);
        delayControls.node.connect(fxMerger);

        // Reverb Send (with defaults)
        const reverbControls = controls.fx.reverb;
        const reverbDecayS = trackResult.fx.reverb?.decayS ?? 1.5;
        const reverbMixPercent = trackResult.fx.reverb?.mixPercent ?? 0;
        const reverbMix = reverbMixPercent / 100;
        reverbControls.convolver.buffer = createImpulseResponse(context, reverbDecayS, reverbDecayS);
        reverbControls.wetGain.gain.setValueAtTime(reverbMix, now);

        fxInput.connect(reverbControls.wetGain);
        reverbControls.wetGain.connect(reverbControls.convolver);
        reverbControls.convolver.connect(fxMerger);


        lastNode = fxMerger;
        
        // d. Limiter as a final insert in the FX chain (with defaults)
        const limiterSettings = trackResult.fx.limiter;
        if (limiterSettings) {
            const limiter = context.createDynamicsCompressor();
            const limiterThreshold = limiterSettings.thresholddB ?? -0.3;
            const limiterRelease = limiterSettings.releaseMs ?? 50;
            // Configure compressor as a limiter: max ratio, instant attack
            limiter.threshold.setValueAtTime(limiterThreshold, now);
            limiter.release.setValueAtTime(limiterRelease / 1000, now);
            limiter.ratio.setValueAtTime(20, now); // Max ratio
            limiter.attack.setValueAtTime(0, now); // Fastest attack
            limiter.knee.setValueAtTime(0, now); // Hard knee
            
            lastNode.connect(limiter);
            lastNode = limiter;
            controls.fx.limiter = limiter;
        }
    }

    // 6. Connect previous stage to panner
    lastNode.connect(controls.panner);
    lastNode = controls.panner;

    // Apply Pan Automation
    const panAutomationPoints = trackResult.automation?.pan?.slice().sort((a, b) => a.time - b.time);
    const basePan = trackResult.panning.position;

    controls.panner.pan.cancelScheduledValues(now);
    controls.panner.pan.setValueAtTime(basePan, now);

    if (panAutomationPoints && panAutomationPoints.length > 0) {
        const initialPoint = panAutomationPoints.find(p => p.time <= 0);
        const initialValue = initialPoint ? initialPoint.value : basePan;
        controls.panner.pan.setValueAtTime(initialValue, now);
        
        panAutomationPoints.forEach(point => {
            const targetPan = Math.max(-1, Math.min(1, point.value)); // Clamp between -1 and 1
            const eventTime = now + Math.max(0, point.time);
            controls.panner!.pan.linearRampToValueAtTime(targetPan, eventTime);
        });
    }

    // 7. Gain node for channel fader (post-processing) and automation
    controls.gain = context.createGain();
    const baseGain = dbToLinear(trackResult.volume.leveldB);

    controls.gain.gain.cancelScheduledValues(now);
    controls.gain.gain.setValueAtTime(baseGain, now);

    const automationPoints = trackResult.automation?.clipGain?.slice().sort((a, b) => a.time - b.time);

    if (automationPoints && automationPoints.length > 0) {
        const initialPoint = automationPoints.find(p => p.time <= 0);
        const initialValue = baseGain * (initialPoint ? initialPoint.value : 1.0);
        controls.gain.gain.setValueAtTime(initialValue, now);
        
        automationPoints.forEach(point => {
            const targetGain = baseGain * Math.max(0, point.value);
            const eventTime = now + Math.max(0, point.time);
            controls.gain!.gain.linearRampToValueAtTime(targetGain, eventTime);
        });
    }
    
    lastNode.connect(controls.gain);
    lastNode = controls.gain;

    return { finalNode: lastNode, controls: controls as DSPControls };
};