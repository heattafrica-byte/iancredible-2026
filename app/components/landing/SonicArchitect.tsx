'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface SonicArchitectProps {
  onBack: () => void
}

const TrackCard = ({
  title,
  genre,
  platform,
  delay,
}: {
  title: string
  genre: string
  platform: 'spotify' | 'youtube'
  delay: number
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    className="glass border border-neon-pink/40 rounded-lg p-6 hover:border-neon-pink hover:bg-dark-surface/60 transition-all group cursor-pointer"
    whileHover={{ y: -5 }}
  >
    <div className="flex items-center justify-between mb-4">
      <div className="text-4xl">🎵</div>
      <span className="text-xs px-3 py-1 bg-neon-pink/20 text-neon-pink rounded-full font-semibold">{genre}</span>
    </div>
    <h3 className="text-lg font-bold text-neon-pink mb-2">{title}</h3>
    <p className="text-sm text-gray-400 mb-4">Ian Credible {genre} Production</p>
    <motion.button
      className="text-sm font-semibold text-neon-pink hover:text-neon-cyan transition-colors flex items-center gap-2"
      whileHover={{ x: 5 }}
    >
      {platform === 'spotify' ? '🎧' : '▶️'} Listen on {platform.charAt(0).toUpperCase() + platform.slice(1)}
    </motion.button>
  </motion.div>
)

const Visualizer = () => {
  const [bars, setBars] = useState<number[]>(Array(15).fill(0))

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(
        Array(15)
          .fill(0)
          .map(() => Math.random() * 100)
      )
    }, 100)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div className="flex items-end justify-center gap-2 h-32 p-8 glass border border-neon-pink/30 rounded-lg">
      {bars.map((height, i) => (
        <motion.div
          key={i}
          className="w-2 bg-gradient-to-t from-neon-pink to-neon-cyan rounded-full"
          animate={{ height: `${height}%` }}
          transition={{ duration: 0.1 }}
        />
      ))}
    </motion.div>
  )
}

export default function SonicArchitect({ onBack }: SonicArchitectProps) {
  const [activeGenre, setActiveGenre] = useState<'hardstyle' | 'goa'>('hardstyle')

  const tracks = {
    hardstyle: [
      {
        title: 'Raw Energy Pulse',
        genre: 'Hardstyle',
        platform: 'spotify' as const,
      },
      {
        title: 'Neon Breakdown',
        genre: 'Hardstyle',
        platform: 'youtube' as const,
      },
      {
        title: 'Industrial Assault',
        genre: 'Hardstyle',
        platform: 'spotify' as const,
      },
    ],
    goa: [
      {
        title: 'Psych Wave Horizon',
        genre: 'Goa Trance',
        platform: 'spotify' as const,
      },
      {
        title: 'Cosmic Ascension',
        genre: 'Goa Trance',
        platform: 'youtube' as const,
      },
      {
        title: 'Meditation Spiral',
        genre: 'Goa Trance',
        platform: 'spotify' as const,
      },
    ],
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.button
            onClick={onBack}
            className="text-neon-pink hover:text-neon-cyan transition-colors mb-4 flex items-center gap-2"
            whileHover={{ scale: 1.05, x: -5 }}
          >
            ← Back to Hub
          </motion.button>
          <h1 className="text-5xl md:text-6xl font-black mb-4" style={{ textShadow: '0 0 30px rgba(255, 0, 255, 0.6)' }}>
            SONIC ARCHITECT
          </h1>
          <p className="text-gray-400 text-lg">Ian Credible • Professional Music Production & Audio Engineering</p>
        </motion.div>

        {/* Live Audio Visualizer */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-2xl font-bold mb-6 text-neon-pink">Live Audio Visualizer</h2>
          <Visualizer />
        </motion.div>

        {/* Genre Selector */}
        <motion.div className="mb-12 flex gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          {['hardstyle', 'goa'].map((genre) => (
            <motion.button
              key={genre}
              onClick={() => setActiveGenre(genre as 'hardstyle' | 'goa')}
              className={`px-8 py-3 rounded-lg font-bold transition-all ${
                activeGenre === genre
                  ? 'bg-gradient-to-r from-neon-pink to-neon-purple text-white shadow-neon-pink'
                  : 'glass border border-neon-pink/30 text-neon-pink hover:border-neon-pink'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {genre === 'hardstyle' ? '⚡ Raw Hardstyle' : '🌀 Goa Trance'}
            </motion.button>
          ))}
        </motion.div>

        {/* Tracks Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-12"
          layout
        >
          {tracks[activeGenre].map((track, i) => (
            <TrackCard
              key={track.title}
              title={track.title}
              genre={track.genre}
              platform={track.platform}
              delay={i * 0.1}
            />
          ))}
        </motion.div>

        {/* Professional Details */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="glass border border-neon-pink/30 rounded-lg p-8">
            <h3 className="text-xl font-bold text-neon-pink mb-4">⚙️ Production Expertise</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✓ Sound design & synthesis</li>
              <li>✓ Mixing & mastering</li>
              <li>✓ Genre-specific production workflows</li>
              <li>✓ Track arrangement & composition</li>
              <li>✓ Professional audio engineering</li>
            </ul>
          </div>

          <div className="glass border border-neon-purple/30 rounded-lg p-8">
            <h3 className="text-xl font-bold text-neon-purple mb-4">🎤 Media & Presence</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>✓ Professional bio documentation</li>
              <li>✓ Press kit & media materials</li>
              <li>✓ High-resolution photography</li>
              <li>✓ Booking contract ready</li>
              <li>✓ Multi-platform distribution</li>
            </ul>
          </div>
        </motion.div>

        {/* Featured Highlights */}
        <motion.div
          className="glass border border-neon-pink/30 rounded-lg p-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3 className="text-2xl font-bold neon-glow-pink mb-6">Featured Highlights</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-pink/20">
              <p className="text-neon-pink font-bold mb-2">🎯 Ian Credible Brand</p>
              <p className="text-sm text-gray-400">
                Established professional identity with press kit, photography, and booking materials
              </p>
            </div>
            <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-purple/20">
              <p className="text-neon-purple font-bold mb-2">🎶 Rich Catalog</p>
              <p className="text-sm text-gray-400">
                Multiple genre specializations: Raw Hardstyle and Psychedelic Goa Trance
              </p>
            </div>
            <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-pink/20">
              <p className="text-neon-pink font-bold mb-2">📊 Professional Tools</p>
              <p className="text-sm text-gray-400">
                Industry-standard production & mastering equipment for studio-quality output
              </p>
            </div>
            <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-blue/20">
              <p className="text-neon-blue font-bold mb-2">🌍 Distribution Ready</p>
              <p className="text-sm text-gray-400">
                Tracks available on Spotify, YouTube, and other major streaming platforms
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-lg shadow-neon-pink hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.open('https://your-domain.com/music', '_blank')
            }}
          >
            🎵 Listen on Streaming Platforms
          </motion.button>
          <p className="text-gray-500 text-sm mt-4">Booking inquiries available via press kit</p>
        </motion.div>
      </div>
    </div>
  )
}
