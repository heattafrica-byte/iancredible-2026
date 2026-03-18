'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import EvolutionHero from './components/sections/EvolutionHero'
import GratitudeGrid from './components/sections/GratitudeGrid'
import GlobalMesh from './components/sections/GlobalMesh'
import DieselFlowDemo from './components/sections/DieselGoDemo'
import IntellimixShowcase from './components/sections/IntellimixShowcase'
import HardwareShowreel from './components/sections/HardwareShowreel'
import CreatorProfile from './components/CreatorProfile'
import CosmicFlowSection from './components/CosmicFlowSection'
import Navigation from './components/Navigation'

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg overflow-hidden">
      <Navigation currentPath="home" onNavigate={() => {}} />
      
      {/* Hero: The Evolution Story */}
      <EvolutionHero />

      {/* Functional Demo Modules & Professional Tools */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <DieselFlowDemo />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <IntellimixShowcase />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <HardwareShowreel />
      </motion.div>

      {/* Meet The Creator */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <CreatorProfile />
      </motion.div>

      {/* Community & Gratitude */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <GratitudeGrid />
      </motion.div>

      {/* Global Mesh: Social Integration */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <GlobalMesh />
      </motion.div>

      {/* Cosmic Flow: Collaborative Experience */}
      <CosmicFlowSection />
    </main>
  )
}
