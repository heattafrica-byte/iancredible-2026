
import React, { useState, useEffect } from 'react';
import { findNearbyStudios } from '../services/geminiService';
import { SpinnerIcon, XMarkIcon, GoogleIcon } from './Icons';

interface StudioSearchProps {
    isOpen: boolean;
    onClose: () => void;
}

const StudioSearch: React.FC<StudioSearchProps> = ({ isOpen, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<{ text: string, sources: any[] } | null>(null);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            navigator.geolocation.getCurrentPosition(async (pos) => {
                const data = await findNearbyStudios(pos.coords.latitude, pos.coords.longitude);
                setResults(data);
                setIsLoading(false);
            }, (err) => {
                alert("Location access denied. Please enable location to find local studios.");
                setIsLoading(false);
            });
        } catch (e) {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) handleSearch();
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[120] p-4 animate-fade-in">
            <div className="bg-[#10101f] border border-cyan-500/30 rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <XMarkIcon className="w-6 h-6" />
                </button>

                <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                         <svg className="w-7 h-7 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                         </svg>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white uppercase">Nearby Studios</h2>
                        <p className="text-gray-400 text-sm">Find professional recording & mastering services near you.</p>
                    </div>
                </div>

                <div className="max-h-96 overflow-y-auto pr-4 custom-scrollbar">
                    {isLoading ? (
                        <div className="py-20 text-center">
                            <SpinnerIcon className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                            <p className="text-gray-400 animate-pulse">Scanning local area via Google Maps...</p>
                        </div>
                    ) : results ? (
                        <div className="space-y-6">
                            <div className="text-gray-300 leading-relaxed whitespace-pre-line text-sm border-l-4 border-cyan-500 pl-4 bg-cyan-500/5 py-3 rounded-r">
                                {results.text}
                            </div>
                            
                            {results.sources.length > 0 && (
                                <div className="space-y-3">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Verified Locations</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {results.sources.map((s, i) => s.maps && (
                                            <a 
                                                key={i} 
                                                href={s.maps.uri} 
                                                target="_blank" 
                                                rel="noreferrer"
                                                className="bg-black/40 border border-cyan-500/20 p-3 rounded-lg hover:bg-cyan-500/10 transition-all flex items-center gap-3 group"
                                            >
                                                <div className="p-2 bg-gray-800 rounded group-hover:bg-cyan-500 group-hover:text-black transition-colors">
                                                    <GoogleIcon className="w-4 h-4" />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-white text-sm font-bold truncate">{s.maps.title || 'Studio Location'}</p>
                                                    <p className="text-cyan-400 text-[10px] uppercase font-bold tracking-tighter">View on Maps</p>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <p className="text-center py-10 text-gray-600 italic">No results found.</p>
                    )}
                </div>

                <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded font-bold text-sm uppercase tracking-widest">Close</button>
                </div>
            </div>
        </div>
    );
};

export default StudioSearch;
