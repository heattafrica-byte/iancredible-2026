'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import { MediaLoader } from '@/app/components/MediaLoader'

const HardwareShowreel = () => {
  const [selectedCategory, setSelectedCategory] = useState('video')

  const categories = {
    video: {
      title: 'Video Operations & Cinematography',
      icon: '🎬',
      color: '#00d9ff',
      description: 'Professional video production from capture through post-processing and delivery',
      showcases: [
        {
          type: 'Cinematic Capture',
          details: '4K footage with professional color grading',
          skills:
            'Camera operation, stabilization, shot planning, real-time monitoring, multi-cam coordination',
        },
        {
          type: 'Post-Production',
          details: 'Advanced color grading and visual effects',
          skills: 'Color correction, sound design, visual effects, motion graphics, timeline management',
        },
        {
          type: 'Live Production',
          details: 'Professional live event capture and streaming',
          skills: 'Multi-camera switching, audio mixing, technical direction, broadcast quality control',
        },
      ],
    },
    hardware: {
      title: 'Hardware Restoration & Engineering',
      icon: '⚙️',
      color: '#f59e0b',
      description:
        'Precision work on complex systems: PS5 restoration, component-level repairs, thermal optimization',
      showcases: [
        {
          type: 'PS5 Restoration',
          details: 'Full diagnostic, repair, and optimization',
          skills:
            'Thermal management, component replacement, firmware updates, QA testing',
        },
        {
          type: 'Motherboard Diagnostics',
          details: 'Complex circuit analysis and repair',
          skills:
            'Schematic reading, soldering, component testing, signal integrity',
        },
        {
          type: 'System Integration',
          details: 'Multi-component system architecture',
          skills: 'Problem diagnosis, solution design, preventive maintenance',
        },
      ],
    },
    audio: {
      title: 'Audio Systems & Sound Engineering',
      icon: '🔊',
      color: '#d946ef',
      description: 'Professional audio system design, implementation, and optimization',
      showcases: [
        {
          type: 'Speaker System Design',
          details: 'Acoustic optimization for venues',
          skills:
            'Acoustic analysis, DSP tuning, impedance matching, frequency response shaping',
        },
        {
          type: 'Signal Chain Engineering',
          details: 'Professional mixing console & routing',
          skills: 'Gain staging, EQ/compression, microphone placement, latency management',
        },
        {
          type: 'Studio Setup',
          details: 'Complete recording environment optimization',
          skills:
            'Room acoustics, equipment selection, integration testing, calibration',
        },
      ],
    },
  }

  const current = categories[selectedCategory as keyof typeof categories]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-dark-surface to-dark-bg">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span style={{ textShadow: '0 0 30px rgba(120, 81, 255, 0.6)' }}>HARDWARE FIELD OPS</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Precision engineering meets creative vision: From PS5 restoration to cinematic drone operations
          </p>
        </motion.div>

        {/* Category Selector */}
        <motion.div
          className="flex gap-4 mb-12 justify-center flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          {Object.entries(categories).map(([key, cat]) => (
            <motion.button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                selectedCategory === key
                  ? 'text-white shadow-lg'
                  : 'glass border text-gray-400 hover:text-white'
              }`}
              style={
                selectedCategory === key
                  ? {
                      background: `linear-gradient(to right, ${cat.color}, ${cat.color}dd)`,
                      boxShadow: `0 0 20px ${cat.color}80`,
                    }
                  : {
                      borderColor: `${cat.color}40`,
                    }
              }
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{cat.icon}</span>
              <span className="hidden sm:inline">{cat.title.split('&')[0].trim()}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Category Content */}
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          {/* Title & Description with Image Gallery */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <p className="text-5xl mb-4">{current.icon}</p>
              <h3 className="text-3xl font-bold mb-4" style={{ color: current.color }}>
                {current.title}
              </h3>
              <p className="text-gray-300 max-w-2xl mx-auto">{current.description}</p>
            </div>

            {/* Video Operations Image Gallery */}
            {selectedCategory === 'video' && (
              <motion.div
                className="grid md:grid-cols-2 gap-6 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="relative overflow-hidden rounded-lg h-64 group">
                  <MediaLoader
                    folder="images"
                    fallbackUrl="/images/heat-gear-landscape-1.png"
                    alt="Professional video production gear"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent flex items-end p-4">
                    <p className="text-sm font-semibold text-neon-cyan">Professional field operations setup</p>
                  </div>
                </div>
                <div className="relative overflow-hidden rounded-lg h-64 group">
                  <MediaLoader
                    folder="images"
                    fallbackUrl="/images/heat-gear-landscape-2.png"
                    alt="Motocross and action sports cinematography"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent flex items-end p-4">
                    <p className="text-sm font-semibold text-neon-cyan">Action sports & extreme environments</p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Showcases Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {current.showcases.map((showcase, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="group relative overflow-hidden rounded-xl"
              >
                {/* Card */}
                <div
                  className="p-8 glass weathered scratches border-2 rounded-xl transition-all duration-300 hover:bg-dark-surface/60 scrollable-sm"
                  style={{
                    borderColor: `${current.color}60`,                    boxShadow: `0 0 10px ${current.color}20, inset 0 0 10px ${current.color}10`,                  }}
                >
                  {/* Type */}
                  <h4 className="text-lg font-bold mb-2" style={{ color: current.color }}>
                    {showcase.type}
                  </h4>

                  {/* Details */}
                  <p className="text-gray-300 text-sm mb-6">{showcase.details}</p>

                  {/* Skills Section */}
                  <div className="pt-6 border-t border-gray-700">
                    <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Technical Skills</p>
                    <p className="text-xs text-gray-300 leading-relaxed">{showcase.skills}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Unified Value Statement */}
        <motion.div
          className="glass border border-neon-purple/30 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-neon-purple mb-6">The Engineering Philosophy</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-neon-cyan text-lg">Why Hardware Expertise Matters</h4>
              <p className="text-gray-300 leading-relaxed text-sm">
                Understanding physical systems—how they work, break, and can be optimized—gives software
                engineers a unique perspective. Every system, digital or physical, follows the same principles:
                input, processing, output, and feedback loops.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-neon-pink text-lg">Application to Software</h4>
              <p className="text-gray-300 leading-relaxed text-sm">
                This hardware knowledge directly improves my software architecture. I understand performance
                optimization, resource constraints, and system design at a fundamental level. It makes me a better
                engineer across all disciplines.
              </p>
            </div>
          </div>

          {/* Unified Capabilities */}
          <div className="mt-8 pt-8 border-t border-neon-purple/30">
            <p className="text-center font-bold text-neon-purple mb-6">Full-Stack Capabilities</p>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                '🎯 Diagnostics',
                '🔧 Repair & Restoration',
                '⚡ Optimization',
                '📚 Documentation',
              ].map((cap, i) => (
                <div
                  key={i}
                  className="p-4 text-center bg-dark-surface/50 rounded-lg border border-neon-purple/20 text-sm font-semibold text-gray-300"
                >
                  {cap}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-6">Need technical expertise or custom projects?</p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold rounded-lg shadow-neon-purple hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Inquire About Services
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default HardwareShowreel
