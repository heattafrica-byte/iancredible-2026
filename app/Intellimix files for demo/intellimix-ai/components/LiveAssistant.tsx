
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { SpinnerIcon, XMarkIcon } from './Icons';

interface LiveAssistantProps {
    isOpen: boolean;
    onClose: () => void;
}

const LiveAssistant: React.FC<LiveAssistantProps> = ({ isOpen, onClose }) => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'active'>('idle');
    const [transcription, setTranscription] = useState<string[]>([]);
    const sessionRef = useRef<any>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

    const decode = (base64: string) => {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
    };

    const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
        const dataInt16 = new Int16Array(data.buffer);
        const frameCount = dataInt16.length / numChannels;
        const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
        for (let channel = 0; channel < numChannels; channel++) {
            const channelData = buffer.getChannelData(channel);
            for (let i = 0; i < frameCount; i++) {
                channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
            }
        }
        return buffer;
    };

    const encode = (bytes: Uint8Array) => {
        let binary = '';
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    };

    const createBlob = (data: Float32Array) => {
        const l = data.length;
        const int16 = new Int16Array(l);
        for (let i = 0; i < l; i++) {
            int16[i] = data[i] * 32768;
        }
        return {
            data: encode(new Uint8Array(int16.buffer)),
            mimeType: 'audio/pcm;rate=16000',
        };
    };

    const startAssistant = useCallback(async () => {
        setStatus('connecting');
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
        const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        audioContextRef.current = outCtx;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const sessionPromise = ai.live.connect({
            model: 'gemini-2.5-flash-native-audio-preview-09-2025',
            callbacks: {
                onopen: () => {
                    setStatus('active');
                    const source = inCtx.createMediaStreamSource(stream);
                    const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
                    scriptProcessor.onaudioprocess = (e) => {
                        const inputData = e.inputBuffer.getChannelData(0);
                        const pcmBlob = createBlob(inputData);
                        sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
                    };
                    source.connect(scriptProcessor);
                    scriptProcessor.connect(inCtx.destination);
                },
                onmessage: async (message: LiveServerMessage) => {
                    const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
                    if (base64Audio) {
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
                        const buffer = await decodeAudioData(decode(base64Audio), outCtx, 24000, 1);
                        const source = outCtx.createBufferSource();
                        source.buffer = buffer;
                        source.connect(outCtx.destination);
                        source.onended = () => sourcesRef.current.delete(source);
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += buffer.duration;
                        sourcesRef.current.add(source);
                    }

                    if (message.serverContent?.outputTranscription) {
                        setTranscription(prev => [...prev, message.serverContent!.outputTranscription!.text]);
                    }
                    if (message.serverContent?.interrupted) {
                        sourcesRef.current.forEach(s => s.stop());
                        sourcesRef.current.clear();
                        nextStartTimeRef.current = 0;
                    }
                },
                onerror: (e) => console.error('Live Assistant Error', e),
                onclose: () => setStatus('idle'),
            },
            config: {
                responseModalities: [Modality.AUDIO],
                outputAudioTranscription: {},
                systemInstruction: "You are IntelliMix Voice, a helpful hands-free mixing assistant. You guide users through mix decisions and offer technical support verbally."
            }
        });

        sessionRef.current = await sessionPromise;
    }, []);

    const stopAssistant = useCallback(() => {
        if (sessionRef.current) sessionRef.current.close();
        if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
        setStatus('idle');
    }, []);

    useEffect(() => {
        if (isOpen && status === 'idle') startAssistant();
        return () => { if (isOpen) stopAssistant(); };
    }, [isOpen, startAssistant, stopAssistant]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-fade-in">
            <div className="bg-[#10101f] border-2 border-cyan-500/50 rounded-2xl p-8 max-w-md w-full shadow-[0_0_50px_rgba(0,255,255,0.3)] relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="flex flex-col items-center gap-6">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-500 ${status === 'active' ? 'bg-cyan-500 shadow-[0_0_30px_rgba(0,255,255,0.8)] scale-110' : 'bg-gray-800'}`}>
                        {status === 'connecting' ? <SpinnerIcon className="w-10 h-10 text-white" /> : 
                         <svg className={`w-12 h-12 ${status === 'active' ? 'text-black' : 'text-cyan-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                         </svg>}
                    </div>

                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-white uppercase tracking-widest mb-2">Live Assistant</h2>
                        <p className="text-cyan-400/70 text-sm">
                            {status === 'connecting' ? 'Establishing secure voice link...' : 
                             status === 'active' ? 'Listening... Go ahead and ask questions.' : 'Assistant Ready.'}
                        </p>
                    </div>

                    <div className="w-full bg-black/40 rounded-lg p-4 h-48 overflow-y-auto border border-cyan-500/20 text-gray-300 text-sm italic font-mono space-y-2">
                        {transcription.length === 0 ? <p className="opacity-30">Transcript will appear here...</p> : 
                         transcription.map((t, i) => <p key={i} className="animate-fade-in">{t}</p>)}
                    </div>

                    <button 
                        onClick={onClose}
                        className="w-full bg-red-600/20 hover:bg-red-600/40 text-red-400 font-bold py-3 rounded-lg border border-red-500/30 transition-all uppercase tracking-widest"
                    >
                        End Session
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LiveAssistant;
