'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const CosmicFlowSection = () => {
  const [showCosmic, setShowCosmic] = useState(false)

  // Get the server URL - will be set via environment variable
  const getCosmicFlowUrl = () => {
    if (typeof window !== 'undefined') {
      // In development (localhost), connect to local server
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000'
      }
      // In production, will be updated with actual Cloud Run URL
      return process.env.NEXT_PUBLIC_COSMIC_FLOW_URL || 'https://cosmic-flow-server-REPLACE-ME.run.app'
    }
    return 'http://localhost:3000'
  }

  if (showCosmic) {
    const cosmicUrl = getCosmicFlowUrl()
    
    return (
      <section className="fixed inset-0 z-50 bg-black overflow-hidden">
        {/* Close button */}
        <motion.button
          onClick={() => setShowCosmic(false)}
          className="fixed top-6 right-6 z-50 text-white hover:text-neon-cyan transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="text-3xl font-bold">✕</div>
          <div className="text-xs font-mono text-gray-500 mt-1">ESC</div>
        </motion.button>

        {/* Cosmic Flow Iframe */}
        <iframe
          src={cosmicUrl}
          className="w-full h-full border-0"
          title="Cosmic Flow - Collaborative Experience"
          allow="camera; microphone"
        />
      </section>
    )
  }

  return (
    <section className="py-32 px-4 bg-gradient-to-b from-dark-bg via-dark-surface to-black">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-20 text-center"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block mb-6"
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <span className="text-6xl">⚛️</span>
          </motion.div>
          
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span style={{ textShadow: '0 0 30px rgba(0, 217, 255, 0.6)' }}>
              COSMIC FLOW
            </span>
          </h2>
          
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A real-time collaborative experience where creative minds converge. 
            Spawn particles, create attractors and repulsors, and witness the emergence of collective intelligence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            {
              icon: '👥',
              title: 'Multi-Player Sync',
              description: 'Real-time synchronization with other creators. Your particles, their particles, all flowing together.',
              color: '#00d9ff',
            },
            {
              icon: '✨',
              title: 'Particle Systems',
              description: 'Spawn flowing particles with cursor movement. Create visual symphonies through motion and interaction.',
              color: '#ff00ff',
            },
            {
              icon: '🌀',
              title: 'Force Fields',
              description: 'Place attractors to pull particles, repulsors to push them. Master the physics of creative flow.',
              color: '#10b981',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="glass weathered weathered-border scratches wet-reflection glitch-overlay shadow-neon-cyan border border-neon-cyan/30 rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              viewport={{ once: true }}
              style={{
                borderColor: feature.color,
                background: `${feature.color}05`,
              }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: feature.color }}>
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Controls Info */}
        <motion.div
          className="glass weathered weathered-border scratches wet-reflection glitch-overlay shadow-neon-pink border border-neon-pink/30 rounded-2xl p-8 md:p-12 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold neon-pink-enhanced mb-8">How to Play</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🖱️</span>
                <h4 className="font-bold text-neon-cyan">Move Cursor</h4>
              </div>
              <p className="text-sm text-gray-400">Spawn flowing particles as your cursor moves across the space. Create trails of creative energy.</p>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">🖱️✨</span>
                <h4 className="font-bold text-neon-pink">Left Click</h4>
              </div>
              <p className="text-sm text-gray-400">Place an attractor node that pulls nearby particles toward it. Create vortexes of energy.</p>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">⎵ + 🖱️</span>
                <h4 className="font-bold text-neon-purple">Spacebar</h4>
              </div>
              <p className="text-sm text-gray-400">Place a repulsor node that pushes particles away. Control the flow with opposing forces.</p>
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.button
            onClick={() => setShowCosmic(true)}
            className="inline-block px-12 py-6 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink text-dark-bg font-black text-lg rounded-lg shadow-lg hover:shadow-2xl transition-all"
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(0, 217, 255, 0.8)' }}
            whileTap={{ scale: 0.95 }}
          >
            ENTER COSMIC FLOW →
          </motion.button>
          
          <p className="text-gray-500 text-xs mt-8 font-mono">
            [ A collaborative experience for creative minds ]
          </p>
        </motion.div>

        {/* Bottom note */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block glass border border-neon-cyan/30 rounded-lg px-6 py-4">
            <p className="text-sm text-gray-400 mb-2">
              ✨ Made it this far? You might be a cosmic kindred spirit.
            </p>
            <p className="text-xs text-neon-cyan font-mono">
              Step into the flow. Create with intention. Collaborate with consciousness.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default CosmicFlowSection
