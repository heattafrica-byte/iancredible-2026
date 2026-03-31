'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  url: string;
  duration?: number;
  coverUrl?: string;
}

interface NEOAmpPlayerProps {
  tracks: Track[];
  onTrackChange?: (trackIndex: number) => void;
  variant?: 'full' | 'compact';
}

export default function NEOAmpPlayer({
  tracks,
  onTrackChange,
  variant = 'full'
}: NEOAmpPlayerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [intensity, setIntensity] = useState(0.7);
  const [visualizerBars, setVisualizerBars] = useState(Array(32).fill(0));
  const audioRef = useRef<HTMLAudioElement>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const currentTrack = tracks[currentIndex];

  // Format time as MM:SS
  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Initialize audio context for visualization
  useEffect(() => {
    if (!audioRef.current || analyserRef.current) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      const source = (audioContext as any).createMediaElementAudioSource(audioRef.current);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
    } catch (e) {
      console.log('Audio context not supported');
    }
  }, []);

  // Update visualizer
  useEffect(() => {
    if (!analyserRef.current || !isPlaying) return;

    const animate = () => {
      const dataArray = new Uint8Array(analyserRef.current!.frequencyBinCount);
      analyserRef.current!.getByteFrequencyData(dataArray);

      const scaledBars = Array.from(dataArray)
        .slice(0, 32)
        .map(v => (v / 255) * intensity);
      
      setVisualizerBars(scaledBars);
      requestAnimationFrame(animate);
    };

    animate();
  }, [isPlaying, intensity]);

  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          console.log('Play failed');
        });
      }
      setIsPlaying(!isPlaying);
    }
  }, [isPlaying]);

  // Handle next track
  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % tracks.length;
    setCurrentIndex(nextIndex);
    setCurrentTime(0);
    setIsPlaying(false);
    onTrackChange?.(nextIndex);
  }, [currentIndex, tracks.length, onTrackChange]);

  // Handle previous track
  const handlePrev = useCallback(() => {
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    setCurrentIndex(prevIndex);
    setCurrentTime(0);
    setIsPlaying(false);
    onTrackChange?.(prevIndex);
  }, [currentIndex, tracks.length, onTrackChange]);

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => handleNext();
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [handleNext]);

  // Handle seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Auto-play when track changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch(() => {
        console.log('Auto-play failed');
      });
    }
  }, [currentIndex, isPlaying]);

  if (!currentTrack) {
    return (
      <div className="w-full bg-black rounded-lg p-4 text-white text-center">
        <p>No tracks available</p>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className="w-full bg-gradient-to-r from-cyan-900 to-blue-900 rounded-lg p-4 text-white border border-cyan-500/30">
        <audio ref={audioRef} src={currentTrack.url} crossOrigin="anonymous" />

        <div className="mb-4">
          <h3 className="font-bold text-lg text-cyan-300">{currentTrack.title}</h3>
          <p className="text-sm text-gray-300">{currentTrack.artist}</p>
        </div>

        <div className="mb-3 space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-700 rounded cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="p-2 hover:bg-cyan-700/50 rounded border border-cyan-500/50 transition"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="p-3 bg-cyan-600 hover:bg-cyan-500 rounded border border-cyan-400 transition disabled:opacity-50"
          >
            {isLoading ? (
              <Music size={24} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={24} />
            ) : (
              <Play size={24} />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 hover:bg-cyan-700/50 rounded border border-cyan-500/50 transition"
          >
            <SkipForward size={20} />
          </button>

          <div className="flex items-center gap-2 ml-2">
            <Volume2 size={16} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-16 h-1 bg-gray-700 rounded cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </div>
    );
  }

  // Full variant - NEO AMP desktop style
  return (
    <div className="w-full bg-gradient-to-b from-slate-950 via-cyan-950 to-slate-950 rounded-lg p-6 text-white border border-cyan-500/30 shadow-2xl" style={{ boxShadow: '0 0 30px rgba(0, 217, 255, 0.3)' }}>
      <audio ref={audioRef} src={currentTrack.url} crossOrigin="anonymous" />

      <div className="space-y-6">
        {/* Visualizer */}
        <div className="w-full h-32 bg-gradient-to-b from-cyan-900/30 to-slate-900/50 rounded border border-cyan-500/40 p-4 flex items-end gap-1 justify-center" style={{ boxShadow: 'inset 0 0 20px rgba(0, 217, 255, 0.1)' }}>
          {visualizerBars.map((height, i) => (
            <motion.div
              key={i}
              className="flex-1 bg-gradient-to-t from-cyan-500 to-cyan-300 rounded-sm"
              animate={{ height: `${Math.max(10, height * 100)}%` }}
              transition={{ duration: 0.1 }}
              style={{ boxShadow: '0 0 10px rgba(0, 217, 255, 0.6)' }}
            />
          ))}
        </div>

        {/* Controls Row 1 - Intensity & Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-cyan-400 font-semibold">INTENSITY</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={intensity}
              onChange={(e) => setIntensity(parseFloat(e.target.value))}
              className="w-full h-1 bg-gray-700 rounded cursor-pointer accent-cyan-400"
            />
            <div className="text-xs text-gray-400">{(intensity * 100).toFixed(0)}%</div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-cyan-400 font-semibold">VOLUME</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-700 rounded cursor-pointer accent-cyan-400"
            />
            <div className="text-xs text-gray-400">{(volume * 100).toFixed(0)}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-xs text-cyan-400 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Track Info */}
        <div className="space-y-2 border-t border-cyan-500/30 pt-4">
          <h2 className="text-2xl font-bold text-cyan-300">{currentTrack.title}</h2>
          <p className="text-gray-300">{currentTrack.artist}</p>
          <p className="text-sm text-gray-400">{currentTrack.album}</p>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center justify-center gap-3 bg-slate-900/50 rounded border border-cyan-500/30 p-4">
          <button
            onClick={handlePrev}
            className="p-3 hover:bg-cyan-600/50 rounded border border-cyan-500/50 transition"
          >
            <SkipBack size={24} />
          </button>

          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="p-4 bg-gradient-to-r from-cyan-600 to-cyan-400 hover:from-cyan-500 hover:to-cyan-300 rounded border-2 border-cyan-300 transition disabled:opacity-50"
            style={{ boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)' }}
          >
            {isLoading ? (
              <Music size={28} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={28} />
            ) : (
              <Play size={28} />
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-3 hover:bg-cyan-600/50 rounded border border-cyan-500/50 transition"
          >
            <SkipForward size={24} />
          </button>

          <div className="ml-4 pl-4 flex items-center gap-2 border-l border-cyan-500/30">
            <Zap size={20} className="text-cyan-400" />
            <span className="text-sm font-mono text-cyan-300">NEO-AMP</span>
          </div>
        </div>

        {/* Playlist */}
        <div className="space-y-2 border-t border-cyan-500/30 pt-4">
          <h3 className="text-sm font-semibold text-cyan-400 uppercase tracking-widest">Playlist</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
            {tracks.map((track, index) => (
              <button
                key={track.id}
                onClick={() => {
                  setCurrentIndex(index);
                  setCurrentTime(0);
                  setIsPlaying(true);
                  onTrackChange?.(index);
                }}
                className={`p-3 rounded text-left text-sm transition border ${
                  index === currentIndex
                    ? 'bg-cyan-600/50 border-cyan-400 text-cyan-100'
                    : 'bg-slate-900/50 border-cyan-500/30 hover:bg-slate-800/50 text-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {index === currentIndex && isPlaying && (
                    <div className="w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse" />
                  )}
                  <div className="flex-1 truncate">
                    <div className="font-semibold">{track.title}</div>
                    <div className="text-xs text-gray-500">{track.artist}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
