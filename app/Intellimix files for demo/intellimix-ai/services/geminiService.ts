
import { GoogleGenAI, Type, Modality, GenerateContentResponse } from "@google/genai";
import { MixdownResult, EQPreset } from '../types';
import { blobToBase64 } from '../utils/audioUtils';

/**
 * Handles common API errors, specifically triggering the key selection dialog 
 * if a model is not found (often due to missing project billing or incorrect keys).
 */
const handleApiError = async (error: any) => {
    if (error?.message?.includes("Requested entity was not found") || error?.message?.includes("404")) {
        // If the window.aistudio environment is present, prompt for key selection.
        if (window.aistudio) {
            await window.aistudio.openSelectKey();
        }
        throw new Error("Model not found or API key required. Please check your project billing or select a valid key.");
    }
    throw error;
};

/**
 * Mandatory check for paid models (Veo, Gemini 3 Pro Image).
 * Users must select their own API key from a paid project.
 */
const ensurePaidApiKey = async () => {
    if (window.aistudio && !(await window.aistudio.hasSelectedApiKey())) {
        await window.aistudio.openSelectKey();
        // Following race condition mitigation: assume success after triggering dialog.
    }
};

const automationSchema = {
    type: Type.OBJECT,
    properties: {
        clipGain: {
            type: Type.ARRAY,
            description: "Optional volume automation points to create dynamic changes over time. Points must be in chronological order.",
            items: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.NUMBER, description: "The time in seconds from the start of the track." },
                    value: { type: Type.NUMBER, description: "A linear gain multiplier (e.g., 1.0 is no change, 0.5 is -6dB, 0.0 is silent, 1.2 is a slight boost). Use values between 0.0 and 2.0." },
                },
                required: ['time', 'value']
            }
        }
    },
};

const mixdownResultSchema = {
    type: Type.OBJECT,
    properties: {
        trackName: { type: Type.STRING },
        preMixAdvice: { type: Type.STRING, description: "Constructive, truthful feedback on the raw stem. What is wrong with it? How can the user improve the recording or arrangement? Be a world-class mentor." },
        busRouting: { type: Type.STRING, enum: ['ANCHOR', 'BUS_A', 'BUS_B', 'BUS_C'], description: "Strict routing assignment based on frequency content." },
        sidechain: {
            type: Type.OBJECT,
            properties: {
                enable: { type: Type.BOOLEAN },
                releaseMs: { type: Type.NUMBER, description: "Mathematical release time based on BPM (e.g., 60000 / BPM)." }
            },
            required: ['enable', 'releaseMs']
        },
        midSide: {
            type: Type.OBJECT,
            properties: {
                enable: { type: Type.BOOLEAN, description: "Enable Mid/Side processing for this track." }
            },
            required: ['enable']
        },
        volume: {
            type: Type.OBJECT,
            properties: {
                leveldB: { type: Type.NUMBER, description: "Target volume level in decibels (dB), e.g., -6.5" },
            },
            required: ['leveldB']
        },
        compression: {
            type: Type.OBJECT,
            properties: {
                thresholddB: { type: Type.NUMBER, description: "Compressor threshold in dB, e.g., -12.0" },
                ratio: { type: Type.NUMBER, description: "Compression ratio, e.g., 4" },
                attackMs: { type: Type.NUMBER, description: "Attack time in milliseconds, e.g., 15" },
                releaseMs: { type: Type.NUMBER, description: "Release time in milliseconds, e.g., 100" },
            },
            required: ['thresholddB', 'ratio', 'attackMs', 'releaseMs']
        },
        eq: {
            type: Type.OBJECT,
            properties: {
                bands: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            type: { type: Type.STRING, enum: ['LOW_SHELF', 'PEAK', 'HIGH_SHELF'] },
                            frequencyHz: { type: Type.NUMBER, description: "Center frequency in Hz, e.g., 100" },
                            gaindB: { type: Type.NUMBER, description: "Gain/cut in dB, e.g., -2.5" },
                            q: { type: Type.NUMBER, description: "Q factor (bandwidth), e.g., 1.4" },
                        },
                        required: ['type', 'frequencyHz', 'gaindB', 'q']
                    }
                }
            },
            required: ['bands']
        },
        panning: {
            type: Type.OBJECT,
            properties: {
                advice: { type: Type.STRING, description: "Creative and technical advice on where to place this track in the stereo field." },
                position: { type: Type.NUMBER, description: "The pan position, from -1.0 (hard left) to 1.0 (hard right). 0.0 is center." },
            },
            required: ['advice', 'position']
        },
        automation: { ...automationSchema, description: "Optional object for volume automation." },
    },
    required: ['trackName', 'preMixAdvice', 'volume', 'compression', 'eq', 'panning']
};

export const generateMixdownInsights = async (trackNames: string[], genre?: string, eqPresets?: EQPreset[]): Promise<MixdownResult[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const genreClause = genre ? `The genre is ${genre}.` : '';
    const presetsClause = eqPresets && eqPresets.length > 0 
        ? `The user has saved the following EQ presets: ${JSON.stringify(eqPresets)}`
        : '';

    const prompt = `System Role: You are an elite Constraint-Based DSP Mix Architect. Your objective is to sum multi-track audio into a cohesive master peaking at -4 LUFS Short-Term with a Crest Factor of 4dB to 6dB, without introducing intermodulation distortion or phase smearing.

    Execution Directives: You will not mix by "feel." You will apply rigid, mathematical constraints to the provided audio stems via programmatic DSP routing.

    Step 1: Stem Classification & Routing Matrix
    Analyze the input stems and route them strictly into the following isolated buses. Do not allow frequency overlap between buses.
    - ANCHOR: Anchor Lane (Kick & Snare): Bypass all frequency buses. Route straight to the Drum Bus. Apply surgical EQ: -4dB at 300Hz (Mud cut), +2dB at 3kHz (Beater/smack).
    - BUS_A: Bus A (Sub Bass): Strictly frequencies 0Hz - 90Hz. Force to 100% Mono. Apply a 24dB/oct Low-Pass Filter at 90Hz.
    - BUS_B: Bus B (Mid/Instruments): Strictly frequencies 150Hz - 2kHz. Apply a 24dB/oct High-Pass Filter at 150Hz.
    - BUS_C: Bus C (Highs/Air): Strictly frequencies 2kHz and above. Force width using Mid/Side processing.

    Step 2: Dynamic Traffic Control (Duck & Pump)
    Limiters fail when low-end signals sum simultaneously. You must force temporal masking.
    Calculate the tempo of the track.
    Generate a millisecond-accurate mathematical trigger locked to the Kick drum transient.
    Apply amplitude envelope ducking (sidechain) to Bus A and Bus B, triggered by the Kick. The amplitude must drop to near-zero upon the transient impact and recover smoothly within a 1/8th note envelope.

    Step 3: Mid/Side Spatial Allocation
    Analyze Bus B. Apply Mid/Side EQ. High-Pass the Side channel at 150Hz to ensure absolute mono compatibility in the low-mids. Cut the Mid channel by -2dB at 2kHz to clear the phantom center for the snare.

    Step 4: The Cascading Master Ceiling
    Sum all buses to the Master Channel and execute the following clipping hierarchy:
    VCA Bus Compression: 2:1 Ratio, 30ms Attack, Auto-Release. Target maximum -2dB gain reduction.
    Soft Clipper: Shave exactly 1dB to 1.5dB off the loudest transient peaks (Kick/Snare) to artificially increase the Crest Factor threshold.
    True Peak Limiter: 4x Oversampling ON. Ceiling at -0.3dB. Drive the input gain until the Short-Term LUFS reads -4. If the pre-limiter Crest Factor drops below 4dB, abort gain push and reduce Bus A (Sub) volume by 1dB.

    Part 2: What Your App Needs to Execute This (The Backend Architecture)
    An LLM cannot process audio directly; it only outputs text. For your app to actually do this, the LLM must act as the brain that writes a configuration script, which is then handed off to a headless DSP engine running on your Google Cloud architecture.

    Analyze the following audio track names. For each track, provide a 'preMixAdvice' string giving truthful, constructive feedback on the raw stem. Then, generate optimal settings for Volume, Compression, EQ, Panning, Bus Routing (ANCHOR, BUS_A, BUS_B, or BUS_C), Sidechain, and Mid/Side processing.
    ${genreClause} ${presetsClause} 
    Tracks: ${trackNames.join(', ')}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: mixdownResultSchema,
                },
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as MixdownResult[];
    } catch (e) {
        return handleApiError(e);
    }
};

const fxSettingsSchema = {
    type: Type.OBJECT,
    properties: {
        saturation: {
            type: Type.OBJECT,
            properties: {
                drive: { type: Type.NUMBER, description: "Amount of saturation drive (1-10)." },
                tone: { type: Type.NUMBER, description: "Tone of saturation, from dark (1) to bright (10)." },
            },
            required: ['drive', 'tone']
        },
        reverb: {
            type: Type.OBJECT,
            properties: {
                decayS: { type: Type.NUMBER, description: "Reverb decay time in seconds." },
                mixPercent: { type: Type.NUMBER, description: "Wet/dry mix percentage." },
            },
            required: ['decayS', 'mixPercent']
        },
        delay: {
            type: Type.OBJECT,
            properties: {
                timeMs: { type: Type.NUMBER, description: "Delay time in milliseconds." },
                feedbackPercent: { type: Type.NUMBER, description: "Feedback percentage." },
                mixPercent: { type: Type.NUMBER, description: "Wet/dry mix percentage." },
            },
            required: ['timeMs', 'feedbackPercent', 'mixPercent']
        },
        autoPan: {
            type: Type.OBJECT,
            properties: {
                rateHz: { type: Type.NUMBER },
                depth: { type: Type.NUMBER },
            },
            required: ['rateHz', 'depth']
        },
        limiter: {
            type: Type.OBJECT,
            properties: {
                thresholddB: { type: Type.NUMBER },
                releaseMs: { type: Type.NUMBER },
            },
            required: ['thresholddB', 'releaseMs']
        }
    },
    required: ['saturation', 'reverb', 'delay']
};

export const generateFXInsights = async (currentResults: MixdownResult[], genre?: string): Promise<MixdownResult[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const genreClause = genre ? `The genre is ${genre}.` : '';
    const prompt = `You are IntelliMix AI, creative effects specialist. Enhance existing mix with Saturation, Reverb, Delay. ${genreClause}`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            trackName: { type: Type.STRING },
                            fx: fxSettingsSchema,
                            automation: automationSchema
                        },
                        required: ['trackName', 'fx']
                    }
                },
            },
        });
        const jsonText = response.text.trim();
        const fxData = JSON.parse(jsonText);
        return currentResults.map(result => {
            const trackFxData = fxData.find((f: any) => f.trackName === result.trackName);
            return trackFxData ? { ...result, fx: trackFxData.fx, automation: trackFxData.automation || result.automation } : result;
        });
    } catch (e) {
        return handleApiError(e);
    }
};

export const generateMasteringAdvice = async (mixdownResults: MixdownResult[], genre?: string): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `System Role: You are an elite Constraint-Based DSP Mix Architect.
    
    Perform deep analysis on this mixdown: ${JSON.stringify(mixdownResults, null, 2)}. Genre: ${genre || 'Unknown'}.
    
    Provide mastering advice that STRICTLY adheres to Step 4: The Cascading Master Ceiling constraints:
    1. VCA Bus Compression: 2:1 Ratio, 30ms Attack, Auto-Release. Target maximum -2dB gain reduction.
    2. Soft Clipper: Shave exactly 1dB to 1.5dB off the loudest transient peaks (Kick/Snare) to artificially increase the Crest Factor threshold.
    3. True Peak Limiter: 4x Oversampling ON. Ceiling at -0.3dB. Drive the input gain until the Short-Term LUFS reads -4. If the pre-limiter Crest Factor drops below 4dB, abort gain push and reduce Bus A (Sub) volume by 1dB.
    
    Also, if applicable, advise on Step 2 (Dynamic Traffic Control): Remind the user to calculate exact sidechain release times using 60000 / BPM to carve space in time, rather than relying on glitchy compression.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: prompt,
            config: { thinkingConfig: { thinkingBudget: 32768 } },
        });
        return response.text.trim();
    } catch (e) {
        return handleApiError(e);
    }
};

export const getGenreResearch = async (genre: string): Promise<{ text: string, sources: string[] }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Latest mixing trends for ${genre} 2024/2025.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: prompt,
            config: { tools: [{ googleSearch: {} }] }
        });
        const sources: string[] = [];
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        chunks.forEach(chunk => { if (chunk.web?.uri) sources.push(chunk.web.uri); });
        return { text: response.text.trim(), sources: [...new Set(sources)] };
    } catch (e) {
        return handleApiError(e);
    }
};

export const transcribeAudio = async (audioBlob: Blob): Promise<string> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const base64Audio = await blobToBase64(audioBlob);
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: {
                parts: [{ inlineData: { mimeType: audioBlob.type, data: base64Audio } }, { text: "Transcribe this audio production note." }]
            }
        });
        return response.text.trim();
    } catch (e) {
        return handleApiError(e);
    }
};

export const generateCoverArt = async (genre: string, tracks: string[], size: '1K' | '2K' | '4K' = '1K', aspectRatio: string = '1:1'): Promise<string> => {
    // MANDATORY: Image models like gemini-3-pro-image-preview require user-selected API keys.
    await ensurePaidApiKey();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Album cover art for ${genre} mix: ${tracks.join(', ')}. No text.`;
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: prompt }] },
            config: { imageConfig: { aspectRatio: aspectRatio as any, imageSize: size } },
        });
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
        }
        throw new Error("No image generated");
    } catch (e) {
        return handleApiError(e);
    }
};

export const generateVisualizer = async (prompt: string, aspectRatio: '16:9' | '9:16' = '16:9'): Promise<string> => {
    // MANDATORY: Video models like Veo require user-selected API keys.
    await ensurePaidApiKey();
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: `Music visualizer: ${prompt}`,
            config: { numberOfVideos: 1, resolution: '1080p', aspectRatio: aspectRatio }
        });
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }
        const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
        const res = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
        const blob = await res.blob();
        return URL.createObjectURL(blob);
    } catch (e) {
        return handleApiError(e);
    }
};

export const findNearbyStudios = async (lat: number, lng: number): Promise<{ text: string, sources: any[] }> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
        const response = await ai.models.generateContent({
            /**
             * FIX: Maps grounding is only supported in Gemini 2.5 series models.
             * Changing from gemini-3-flash-preview to gemini-2.5-flash.
             */
            model: "gemini-2.5-flash",
            contents: "Find pro music studios near my location.",
            config: {
                tools: [{ googleMaps: {} }],
                toolConfig: { retrievalConfig: { latLng: { latitude: lat, longitude: lng } } }
            },
        });
        return { text: response.text.trim(), sources: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] };
    } catch (e) {
        return handleApiError(e);
    }
};
