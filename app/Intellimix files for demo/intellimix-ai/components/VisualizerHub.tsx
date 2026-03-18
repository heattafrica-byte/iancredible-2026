
import React, { useState } from 'react';
import { generateCoverArt, generateVisualizer } from '../services/geminiService';
import { SpinnerIcon, XMarkIcon, SparklesIcon, WavIcon } from './Icons';

interface VisualizerHubProps {
    isOpen: boolean;
    onClose: () => void;
    genre: string;
    tracks: string[];
}

const VisualizerHub: React.FC<VisualizerHubProps> = ({ isOpen, onClose, genre, tracks }) => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [resultUrl, setResultUrl] = useState<string | null>(null);
    const [resultType, setResultType] = useState<'image' | 'video' | null>(null);
    const [config, setConfig] = useState({ size: '1K', ratio: '1:1', prompt: '' });
    const [message, setMessage] = useState('');

    const handleGenerateImage = async () => {
        setIsGenerating(true);
        setMessage("Synthesizing cover art visuals...");
        try {
            const url = await generateCoverArt(genre, tracks, config.size as any, config.ratio);
            setResultUrl(url);
            setResultType('image');
        } catch (e) {
            alert("Image generation failed.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleGenerateVideo = async () => {
        if (!config.prompt) {
            alert("Please provide a mood prompt for the video visualizer.");
            return;
        }
        setIsGenerating(true);
        setMessage("Rendering cinematic video... This may take a few minutes.");
        try {
            const url = await generateVisualizer(config.prompt, config.ratio as any);
            setResultUrl(url);
            setResultType('video');
        } catch (e) {
            alert("Video generation failed.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[110] p-4 animate-fade-in">
            <div className="bg-[#10101f] border border-fuchsia-500/30 rounded-2xl p-8 max-w-4xl w-full shadow-2xl relative overflow-hidden flex flex-col md:flex-row gap-8">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="flex-1 space-y-6">
                    <div>
                        <h2 className="text-3xl font-bold text-white uppercase tracking-tighter text-shadow-glow-fuchsia">Project Visualizer Hub</h2>
                        <p className="text-gray-400 text-sm mt-1">Generate professional artwork and videos for your mix.</p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Size (Images)</label>
                                <select 
                                    value={config.size} 
                                    onChange={e => setConfig({...config, size: e.target.value})}
                                    className="w-full bg-black/40 border border-fuchsia-500/20 rounded p-2 text-white text-sm"
                                >
                                    <option value="1K">1K (Standard)</option>
                                    <option value="2K">2K (High Res)</option>
                                    <option value="4K">4K (Ultra HD)</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Aspect Ratio</label>
                                <select 
                                    value={config.ratio} 
                                    onChange={e => setConfig({...config, ratio: e.target.value})}
                                    className="w-full bg-black/40 border border-fuchsia-500/20 rounded p-2 text-white text-sm"
                                >
                                    <option value="1:1">1:1 (Square)</option>
                                    <option value="16:9">16:9 (Landscape)</option>
                                    <option value="9:16">9:16 (Portrait)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Mood Prompt (for Video)</label>
                            <textarea 
                                value={config.prompt}
                                onChange={e => setConfig({...config, prompt: e.target.value})}
                                placeholder="e.g., Pulsing neon city, rhythmic light streaks, cosmic dust clouds..."
                                className="w-full bg-black/40 border border-fuchsia-500/20 rounded p-3 text-white text-sm h-24 focus:outline-none focus:border-fuchsia-500/50"
                            />
                        </div>

                        <div className="flex gap-4">
                            <button 
                                onClick={handleGenerateImage}
                                disabled={isGenerating}
                                className="flex-1 bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                <SparklesIcon className="w-5 h-5" /> Generate Cover Art
                            </button>
                            <button 
                                onClick={handleGenerateVideo}
                                disabled={isGenerating}
                                className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                            >
                                <WavIcon className="w-5 h-5" /> Render Visualizer
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 bg-black/40 rounded-xl border border-white/5 flex items-center justify-center min-h-[300px] relative">
                    {isGenerating ? (
                        <div className="text-center p-8">
                            <SpinnerIcon className="w-12 h-12 text-fuchsia-400 mx-auto mb-4" />
                            <p className="text-gray-300 font-mono text-xs animate-pulse">{message}</p>
                            <p className="text-gray-600 text-[10px] mt-2">Powered by Veo & Gemini 3 Pro</p>
                        </div>
                    ) : resultUrl ? (
                        resultType === 'image' ? (
                            <img src={resultUrl} className="w-full h-full object-contain rounded-xl" alt="Generated Cover Art" />
                        ) : (
                            <video src={resultUrl} controls className="w-full h-full object-contain rounded-xl" autoPlay loop />
                        )
                    ) : (
                        <div className="text-gray-600 text-sm italic text-center p-12">
                            Your generated masterpiece will appear here.
                        </div>
                    )}
                    
                    {resultUrl && !isGenerating && (
                        <a 
                            href={resultUrl} 
                            download={`IntelliMix_Visual_${Date.now()}`}
                            className="absolute bottom-4 right-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-2 rounded-full transition-all"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VisualizerHub;
