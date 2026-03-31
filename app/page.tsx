'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import EvolutionHero from './components/sections/EvolutionHero'
import CreatorProfile from './components/CreatorProfile'
import Navigation from './components/Navigation'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const sections = [
    {
      id: 'tech',
      title: 'DIESEL FLOW',
      description: 'Advanced workflow automation and technical innovation',
      icon: '⚡',
      link: '/tech',
      color: '#00d9ff',
    },
    {
      id: 'audio',
      title: 'INTELLIMIX AI',
      description: 'Professional audio mixing and sonic engineering',
      icon: '🔊',
      link: '/audio',
      color: '#d946ef',
    },
    {
      id: 'hardware',
      title: 'HARDWARE FIELD OPS',
      description: 'Precision engineering and restoration',
      icon: '⚙️',
      link: '/hardware',
      color: '#f59e0b',
    },
    {
      id: 'decoded',
      title: 'DECODED',
      description: 'Coaching program for clarity and purpose',
      icon: '🎯',
      link: '/decoded',
      color: '#10b981',
    },
    {
      id: 'community',
      title: 'COMMUNITY',
      description: 'Free and open meeting lobby for all who connect',
      icon: '🤝',
      link: '/community',
      color: '#06b6d4',
    },
  ]

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg overflow-hidden">
      <Navigation currentPath="home" onNavigate={() => {}} />
      
      {/* Hero: The Evolution Story */}
      <EvolutionHero id="story" />

      {/* Simplified Services Grid */}
      <section className="py-24 px-4 bg-gradient-to-b from-dark-surface to-dark-bg">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl md:text-6xl font-black mb-4">
              <span style={{ textShadow: '0 0 30px rgba(120, 81, 255, 0.6)' }}>SERVICES</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Explore specialized expertise across technology, audio, hardware, and personal development
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {sections.map((section, i) => (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link href={section.link} className="block h-full">
                  <div
                    className="h-full p-8 rounded-xl border border-opacity-20 hover:border-opacity-50 transition-all duration-300 hover:shadow-lg cursor-pointer group bg-dark-surface/50 backdrop-blur-sm"
                    style={{
                      borderColor: section.color,
                      boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.1)',
                    }}
                  >
                    <div
                      className="text-4xl mb-4"
                      style={{ opacity: 0.8 }}
                    >
                      {section.icon}
                    </div>
                    <h3
                      className="text-2xl font-bold mb-2 group-hover:opacity-100 transition-opacity"
                      style={{ color: section.color }}
                    >
                      {section.title}
                    </h3>
                    <p className="text-gray-400 mb-4">{section.description}</p>
                    <div className="flex items-center text-sm" style={{ color: section.color }}>
                      Explore →
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet The Creator */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <CreatorProfile />
      </motion.div>
    </main>
  )
}
