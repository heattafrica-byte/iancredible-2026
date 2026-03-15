'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import EvolutionHero from './components/sections/EvolutionHero'
import GratitudeGrid from './components/sections/GratitudeGrid'
import GlobalMesh from './components/sections/GlobalMesh'
import DieselFlowDemo from './components/sections/DieselGoDemo'
import SonicMixerDemo from './components/sections/SonicMixerDemo'
import HardwareShowreel from './components/sections/HardwareShowreel'
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

      {/* Functional Demo Modules */}
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
        <SonicMixerDemo />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <HardwareShowreel />
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
    </main>
  )
}
