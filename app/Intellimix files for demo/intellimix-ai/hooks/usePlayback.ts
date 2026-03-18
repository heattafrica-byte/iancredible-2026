import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { MixdownResult, TrackStates } from '../types';
import { buildTrackDSPChain, DSPControls, dbToLinear, createSaturationCurve, mapEqType, createImpulseResponse } from '../services/audioGraphService';

type TrackNodes = {
    source: AudioBufferSourceNode;
    controls: DSPControls;
};

type AudioGraph = {
    context: AudioContext;
    trackNodes: Map<string, TrackNodes>;
    analyser: AnalyserNode; // For spectrum
    vuAnalysers: { left: AnalyserNode, right: AnalyserNode }; // For VU Meters
    masterGain: GainNode;
};

export const usePlayback = (
    sampleRate: number, 
    results: MixdownResult[],
    audioBuffers: Map<string, AudioBuffer> | null
) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const isLoading = !audioBuffers;
    const audioGraphRef = useRef<AudioGraph | null>(null);

    const trackDurations = useMemo(() => {
        const durations = new Map<string, number>();
        if (audioBuffers) {
            for (const [name, buffer] of audioBuffers.entries()) {
                durations.set(name, buffer.duration);
            }
        }
        return durations;
    }, [audioBuffers]);


    // Effect to update audio parameters in real-time when results change
    useEffect(() => {
        const graph = audioGraphRef.current;
        if (!graph || !isPlaying) return;

        const now = graph.context.currentTime;
        const rampTime = now + 0.05; // 50ms ramp to avoid clicks

        results.forEach(trackResult => {
            const nodes = graph.trackNodes.get(trackResult.trackName);
            if (!nodes) return;

            const { controls } = nodes;
            const { fx, eq, volume, automation } = trackResult;

            // Update Input Gain
            if (controls.inputGain && volume.inputGainDb !== undefined) {
                controls.inputGain.gain.linearRampToValueAtTime(dbToLinear(volume.inputGainDb), rampTime);
            }

            // Update Automation and Channel Fader
            if (controls.gain) {
                const baseGain = dbToLinear(volume.leveldB);
                const automationPoints = automation?.clipGain?.slice().sort((a, b) => a.time - b.time);
                
                // Cancel any future gain changes and set the new base value.
                controls.gain.gain.cancelScheduledValues(now);
                
                // If there's no automation, just set the fader level.
                if (!automationPoints || automationPoints.length === 0) {
                    controls.gain.gain.linearRampToValueAtTime(baseGain, rampTime);
                } else {
                    // If there is automation, re-apply the entire curve.
                    // This is crucial for real-time updates as the user drags points.
                    const initialPoint = automationPoints.find(p => p.time <= 0);
                    const initialValue = baseGain * (initialPoint ? initialPoint.value : 1.0);
                    controls.gain.gain.setValueAtTime(initialValue, now);
                    
                    automationPoints.forEach(point => {
                        const targetGain = baseGain * Math.max(0, point.value);
                        const eventTime = now + Math.max(0, point.time);
                        controls.gain!.gain.linearRampToValueAtTime(targetGain, eventTime);
                    });
                }
            }
            
            // Update EQ
            if (controls.eq && eq) {
                eq.bands.forEach((band, i) => {
                    const filter = controls.eq[i];
                    // FIX: Use mapEqType to correctly check the filter type before updating parameters.
                    // This allows real-time EQ adjustments to work as expected after the initial graph is built correctly.
                    if (filter && filter.type === mapEqType(band.type)) {
                        filter.frequency.linearRampToValueAtTime(band.frequencyHz, rampTime);
                        filter.gain.linearRampToValueAtTime(band.gaindB, rampTime);
                        filter.Q.linearRampToValueAtTime(band.q, rampTime);
                    }
                });
            }
            
            // Update FX in real-time
            if (fx && controls.fx) {
                // Saturation
                controls.fx.saturation.drive.curve = createSaturationCurve(fx.saturation.drive * 5);
                // Tone is mapped from 1-10 to a gain of -9dB to +9dB
                const toneGain = (fx.saturation.tone - 5.5) * 1.63; // approx -9 to +9
                controls.fx.saturation.tone.gain.linearRampToValueAtTime(toneGain, rampTime);
                
                // Reverb - Both Mix and Decay can be updated in real-time.
                // Regenerating the impulse response on-the-fly may cause a slight change in the reverb character, which is expected.
                controls.fx.reverb.convolver.buffer = createImpulseResponse(graph.context, fx.reverb.decayS, fx.reverb.decayS);
                controls.fx.reverb.wetGain.gain.linearRampToValueAtTime(fx.reverb.mixPercent / 100, rampTime);

                // Delay
                const delayMix = fx.delay.mixPercent / 100;
                controls.fx.delay.node.delayTime.linearRampToValueAtTime(fx.delay.timeMs / 1000, rampTime);
                controls.fx.delay.feedback.gain.linearRampToValueAtTime(fx.delay.feedbackPercent / 100, rampTime);
                // FIX: Use linear mapping for the wet send gain.
                controls.fx.delay.wetGain.gain.linearRampToValueAtTime(delayMix, rampTime);

                // FIX: Dry gain is now fixed at unity (1.0) and does not need updating.

                // Limiter
                if (fx.limiter && controls.fx.limiter) {
                    controls.fx.limiter.threshold.linearRampToValueAtTime(fx.limiter.thresholddB, rampTime);
                    controls.fx.limiter.release.linearRampToValueAtTime(fx.limiter.releaseMs / 1000, rampTime);
                }
            }
        });

    }, [results, isPlaying]);


    const stopPlayback = useCallback((cleanup = true) => {
        const graphToClose = audioGraphRef.current;
        if (!graphToClose) {
            return;
        }
        audioGraphRef.current = null;

        if (graphToClose.context.state !== 'closed') {
            graphToClose.trackNodes.forEach(({ source }) => {
                try {
                    source.stop();
                } catch (e) {
                    // Source may have already finished.
                }
                source.disconnect();
            });
            graphToClose.context.close();
        }

        if (cleanup) {
            setIsPlaying(false);
        }
    }, []);

    useEffect(() => {
        return () => {
            stopPlayback();
        };
    }, [stopPlayback]);

    const togglePlayback = useCallback(async (trackStates: TrackStates) => {
        if (isLoading) return;

        if (audioGraphRef.current && audioGraphRef.current.context.state === 'running') {
            audioGraphRef.current.context.suspend();
            setIsPlaying(false);
            return;
        }

        if (audioGraphRef.current && audioGraphRef.current.context.state === 'suspended') {
            audioGraphRef.current.context.resume();
            setIsPlaying(true);
            return;
        }

        try {
            const context = new AudioContext({ sampleRate });
            const masterGain = context.createGain();
            
            // Create analysers for spectrum and VU meters
            const analyser = context.createAnalyser(); // For spectrum
            const splitter = context.createChannelSplitter(2); // For VU meters
            const analyserL = context.createAnalyser();
            const analyserR = context.createAnalyser();
            
            // Main audio path
            masterGain.connect(analyser);
            analyser.connect(context.destination);

            // Analysis path for VU meters (does not affect audio output)
            masterGain.connect(splitter);
            splitter.connect(analyserL, 0);
            splitter.connect(analyserR, 1);

            const isAnyTrackSoloed = Object.values(trackStates).some(s => s.isSoloed);
            const trackNodes = new Map<string, TrackNodes>();

            results.forEach(result => {
                const trackName = result.trackName;
                const trackResult = results.find(r => r.trackName === trackName);
                const trackState = trackStates[trackName];
                const buffer = audioBuffers!.get(trackName);

                if (!trackResult || !trackState || !buffer) return;
                
                // Mute/Solo Logic
                const isAudible = !trackState.isMuted && (!isAnyTrackSoloed || trackState.isSoloed);

                if (!isAudible) {
                    return;
                }

                const source = context.createBufferSource();
                source.buffer = buffer;
                
                const { finalNode, controls } = buildTrackDSPChain(context, trackResult, source);
                finalNode.connect(masterGain);
                trackNodes.set(trackName, { source, controls });
            });
            
            trackNodes.forEach(({source}) => source.start(0));

            audioGraphRef.current = { 
                context, 
                trackNodes, 
                analyser, 
                vuAnalysers: { left: analyserL, right: analyserR }, 
                masterGain 
            };
            setIsPlaying(true);

            context.onstatechange = () => {
                if(context.state !== 'running') {
                    setIsPlaying(false);
                }
            };

        } catch (error) {
            console.error("Error setting up playback:", error);
            stopPlayback();
        }

    }, [sampleRate, isLoading, stopPlayback, results, audioBuffers]);


    return {
        isPlaying,
        isLoading,
        analyserNode: audioGraphRef.current?.analyser ?? null,
        vuAnalyserNodes: audioGraphRef.current?.vuAnalysers ?? { left: null, right: null },
        togglePlayback,
        stopPlayback,
        trackDurations,
    };
};