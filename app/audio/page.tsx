'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Download, Code, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import IntellimixShowcase from '@/app/components/sections/IntellimixShowcase'
import Navigation from '@/app/components/Navigation'
import NEOAmpPlayer from '@/app/components/NEOAmpPlayer'

export default function AudioPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Sample demo tracks for NEO AMP
  const demoTracks = [
    {
      id: '1',
      title: 'Midnight Neon',
      artist: 'IAMIAN',
      album: 'Cyberpunk Nights',
      url: '/audio/demo-tracks/midnight-neon.mp3',
      duration: 180,
      coverUrl: '/images/neoamp-cover-1.png',
    },
    {
      id: '2',
      title: 'Digital Dreams',
      artist: 'IAMIAN',
      album: 'Cyberpunk Nights',
      url: '/audio/demo-tracks/digital-dreams.mp3',
      duration: 220,
      coverUrl: '/images/neoamp-cover-2.png',
    },
    {
      id: '3',
      title: 'Synth Wave',
      artist: 'IAMIAN',
      album: 'Cyberpunk Nights',
      url: '/audio/demo-tracks/synth-wave.mp3',
      duration: 200,
      coverUrl: '/images/neoamp-cover-3.png',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg overflow-hidden">
      <Navigation currentPath="audio" onNavigate={() => {}} />
      
      {/* NEO AMP Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-dark-bg to-dark-surface border-b border-neon-cyan/20">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4"
          >
            <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink bg-clip-text text-transparent">
              NEO-AMP
            </h2>
            <p className="text-xl text-gray-300">
              Cyberpunk Audio Player with Advanced Visualizations
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Experience music like never before with NEO-AMP's cutting-edge audio player featuring real-time visualizations, 
              advanced equalizer controls, and cyberpunk aesthetics.
            </p>
          </motion.div>

          {/* Live Demo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Live Player Demo</h3>
            <NEOAmpPlayer tracks={demoTracks} variant="full" />
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid md:grid-cols-3 gap-4"
          >
            {[
              {
                title: 'Advanced Visualizer',
                description: 'Real-time audio visualizations with multiple display modes',
                icon: '🎨',
              },
              {
                title: 'Equalizer',
                description: 'Professional 10-band equalizer with preset configurations',
                icon: '🎚️',
              },
              {
                title: 'Theme Engine',
                description: 'Customizable cyberpunk themes and color schemes',
                icon: '🎭',
              },
              {
                title: 'Playlist Management',
                description: 'Organize and manage your music collection seamlessly',
                icon: '📚',
              },
              {
                title: 'Sleep Timer',
                description: 'Fade out playback when you fall asleep',
                icon: '😴',
              },
              {
                title: 'Discord Integration',
                description: 'Show now playing status on your Discord profile',
                icon: '💜',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ translateY: -8 }}
                className="bg-gradient-to-br from-dark-surface to-dark-bg border border-neon-cyan/20 rounded-lg p-6 space-y-2 hover:border-neon-purple/40 transition-colors"
              >
                <div className="text-3xl mb-2">{feature.icon}</div>
                <h4 className="font-bold text-white">{feature.title}</h4>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Download Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 border border-neon-cyan/30 rounded-lg p-8 space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Download NEO-AMP</h3>
              <p className="text-gray-300">
                Available for Windows, macOS, and Linux. Install on your desktop to experience the full power of NEO-AMP.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              {[
                { name: 'Windows', icon: '🪟', url: '#download-windows' },
                { name: 'macOS', icon: '🍎', url: '#download-macos' },
                { name: 'Linux', icon: '🐧', url: '#download-linux' },
              ].map((platform) => (
                <a
                  key={platform.name}
                  href={platform.url}
                  className="flex items-center justify-center gap-3 bg-dark-bg border border-neon-cyan/30 hover:border-neon-cyan hover:bg-neon-cyan/5 rounded-lg p-4 transition-all group"
                >
                  <span className="text-2xl">{platform.icon}</span>
                  <div className="text-left">
                    <p className="font-bold text-white">{platform.name}</p>
                    <p className="text-xs text-gray-400">Download</p>
                  </div>
                  <Download className="w-4 h-4 text-neon-cyan group-hover:translate-y-1 transition-transform" />
                </a>
              ))}
            </div>

            {/* GitHub Link */}
            <div className="flex items-center justify-center gap-2 pt-4 border-t border-neon-cyan/20">
              <Code className="w-5 h-5 text-neon-cyan" />
              <a
                href="https://github.com/your-repo/neoamp"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neon-cyan hover:text-neon-purple transition-colors flex items-center gap-1"
              >
                View on GitHub
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Audio/Intellimix Section */}
      <IntellimixShowcase id="sonic" />

      {/* Navigation to Next Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-dark-surface to-dark-bg">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <Link
              href="/tech"
              className="px-6 py-3 rounded-lg border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-all"
            >
              ← Back: Tech
            </Link>
            
            <Link
              href="/hardware"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:shadow-lg transition-all"
            >
              Next: Hardware →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
