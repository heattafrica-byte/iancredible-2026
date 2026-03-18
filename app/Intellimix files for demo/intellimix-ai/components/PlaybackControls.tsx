import React from 'react';
import { PlayIcon, PauseIcon, StopIcon, SpinnerIcon } from './Icons';

interface PlaybackControlsProps {
    isPlaying: boolean;
    isLoading: boolean;
    onTogglePlayback: () => void;
    onStopPlayback: () => void;
}

const PlaybackControls: React.FC<PlaybackControlsProps> = ({ isPlaying, isLoading, onTogglePlayback, onStopPlayback }) => {
    return (
        <div className="flex items-center gap-4">
            <button
                onClick={onStopPlayback}
                disabled={isLoading}
                className="p-3 bg-[#1a1a2e] hover:bg-red-500/20 border border-red-500/30 text-gray-300 hover:text-red-400 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Stop playback"
            >
                <StopIcon className="w-6 h-6" />
            </button>
            <button
                onClick={onTogglePlayback}
                disabled={isLoading}
                className="p-4 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-2xl flex items-center justify-center w-16 h-16 shadow-[0_0_15px_rgba(255,0,243,0.5)]"
                aria-label={isPlaying ? "Pause playback" : "Play playback"}
            >
                {isLoading ? (
                    <SpinnerIcon className="w-8 h-8"/>
                ) : isPlaying ? (
                    <PauseIcon className="w-8 h-8" />
                ) : (
                    <PlayIcon className="w-8 h-8" />
                )}
            </button>
        </div>
    );
}

export default PlaybackControls;