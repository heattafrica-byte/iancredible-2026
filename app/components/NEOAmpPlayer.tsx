'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music } from 'lucide-react';
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
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentIndex];

  // Format time as MM:SS
  const formatTime = (time: number) => {
    if (!isFinite(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play/pause
  const togglePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {
          console.log('Play failed - audio may be loading');
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

  // Handle track selection
  const handleTrackClick = (index: number) => {
    setCurrentIndex(index);
    setCurrentTime(0);
    setIsPlaying(true);
    onTrackChange?.(index);
  };

  // Update current time
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      handleNext();
    };
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
      <div className="w-full bg-gradient-to-r from-cyan-900 to-blue-900 rounded-lg p-4 text-white">
        <audio
          ref={audioRef}
          src={currentTrack.url}
          crossOrigin="anonymous"
        />

        {/* Track Info */}
        <div className="mb-4">
          <h3 className="font-bold text-lg">{currentTrack.title}</h3>
          <p className="text-sm text-gray-300">{currentTrack.artist}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-3 space-y-2">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-2 bg-gray-700 rounded cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-xs text-gray-300">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-3">
          <button
            onClick={handlePrev}
            className="p-2 hover:bg-cyan-700 rounded-full transition"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={togglePlayPause}
            disabled={isLoading}
            className="p-3 bg-cyan-500 hover:bg-cyan-600 rounded-full transition disabled:opacity-50"
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
            className="p-2 hover:bg-cyan-700 rounded-full transition"
          >
            <SkipForward size={20} />
          </button>

          <div className="flex items-center gap-2">
            <Volume2 size={16} />
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-20 h-1 bg-gray-700 rounded cursor-pointer accent-cyan-400"
            />
          </div>
        </div>
      </div>
    );
  }

  // Full variant
  return (
    <div className="w-full bg-gradient-to-br from-black via-gray-900 to-cyan-900 rounded-lg p-6 text-white">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        crossOrigin="anonymous"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Album Art */}
        <div className="flex justify-center items-center">
          <motion.div
            animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {currentTrack.coverUrl ? (
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.album}
                className="w-40 h-40 rounded-lg shadow-lg object-cover"
              />
            ) : (
              <div className="w-40 h-40 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                <Music size={64} className="text-white opacity-50" />
              </div>
            )}
          </motion.div>
        </div>

        {/* Controls & Info */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
          {/* Now Playing */}
          <div>
            <h2 className="text-3xl font-bold text-cyan-300">{currentTrack.title}</h2>
            <p className="text-xl text-gray-300">{currentTrack.artist}</p>
            <p className="text-sm text-gray-400">{currentTrack.album}</p>
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
            <div className="flex justify-between text-sm text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Media Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrev}
              className="p-3 hover:bg-cyan-700 rounded-full transition"
            >
              <SkipBack size={28} />
            </button>

            <button
              onClick={togglePlayPause}
              disabled={isLoading}
              className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-full transition disabled:opacity-50 shadow-lg"
            >
              {isLoading ? (
                <Music size={32} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={32} />
              ) : (
                <Play size={32} />
              )}
            </button>

            <button
              onClick={handleNext}
              className="p-3 hover:bg-cyan-700 rounded-full transition"
            >
              <SkipForward size={28} />
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-3 ml-4 pl-4 border-l border-gray-600">
              <Volume2 size={20} />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 h-1 bg-gray-700 rounded cursor-pointer accent-cyan-400"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Playlist */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-cyan-300">Playlist</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {tracks.map((track, index) => (
            <button
              key={track.id}
              onClick={() => handleTrackClick(index)}
              className={`w-full p-3 rounded text-left transition ${
                index === currentIndex
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                {index === currentIndex && isPlaying && (
                  <div className="w-2 h-2 bg-cyan-300 rounded-full animate-pulse" />
                )}
                <span className="font-semibold">{track.title}</span>
                <span className="text-xs text-gray-500">• {track.artist}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
