'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface HardwareExpertProps {
  onBack: () => void
}

const ProjectCard = ({
  icon,
  title,
  subtitle,
  description,
  specs,
  delay,
}: {
  icon: string
  title: string
  subtitle: string
  description: string
  specs: string[]
  delay: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass border border-neon-purple/40 rounded-lg p-8 hover:border-neon-purple hover:bg-dark-surface/60 transition-all group"
    whileHover={{ y: -5 }}
  >
    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
    <h3 className="text-xl font-bold text-neon-purple mb-2">{title}</h3>
    <p className="text-sm text-gray-400 mb-4">{subtitle}</p>
    <p className="text-sm text-gray-300 mb-6">{description}</p>
    <div className="space-y-2">
      {specs.map((spec, i) => (
        <p key={i} className="text-xs text-gray-400 flex items-center gap-2">
          <span className="text-neon-purple">▸</span>
          {spec}
        </p>
      ))}
    </div>
  </motion.div>
)

export default function HardwareExpert({ onBack }: HardwareExpertProps) {
  const [selectedExpertise, setSelectedExpertise] = useState('electronics')

  const expertise = {
    electronics: {
      title: '🎮 Console & Gaming Hardware',
      description: 'Specialized in restoration and maintenance of gaming systems',
      projects: [
        {
          icon: '🎮',
          title: 'PS5 Restoration',
          subtitle: 'Playstation 5 Repair & Maintenance',
          description: 'Full diagnostic, repair, and optimization of PlayStation 5 systems including hardware replacement and thermal management upgrades.',
          specs: [
            'Thermal paste replacement & thermal management',
            'Power supply diagnostics and repair',
            'Controller connectivity troubleshooting',
            'Drive replacement and optimization',
            'Performance benchmarking',
          ],
        },
        {
          icon: '🕹️',
          title: 'Retro Console Work',
          subtitle: 'Classic Gaming Hardware Preservation',
          description: 'Restoration and preservation of vintage gaming hardware with custom modifications.',
          specs: [
            'Motherboard diagnostics and repair',
            'Power regulation circuit analysis',
            'Display output restoration',
            'ROM analysis and installation',
            'Custom cable fabrication',
          ],
        },
      ],
    },
    drones: {
      title: '🚁 Drone Maintenance & Operation',
      description: 'DJI Mavic expertise and professional drone operations',
      projects: [
        {
          icon: '🚁',
          title: 'DJI Mavic 2 Mastery',
          subtitle: 'Professional Drone Operations & Maintenance',
          description: 'Expert-level knowledge of DJI Mavic 2 platform with full maintenance, repair, and operational expertise.',
          specs: [
            'Pre-flight & post-flight inspections',
            'Gimbal calibration and repair',
            'Camera sensor maintenance',
            'Battery health diagnostics',
            'Propeller balance and replacement',
            'Obstacle avoidance system calibration',
          ],
        },
        {
          icon: '📡',
          title: 'Aerial Operations',
          subtitle: 'Professional Drone Cinematography',
          description: 'Professional-grade video capture and post-processing with custom flight planning.',
          specs: [
            ' 4K video capture & stabilization',
            'HDR photography workflows',
            'Thermal imaging applications',
            'Custom flight path planning',
            'Post-processing & color grading',
            'Real-time monitoring & safety',
          ],
        },
      ],
    },
    audio: {
      title: '🔊 Sound Engineering & Systems',
      description: 'Complete audio system design and implementation',
      projects: [
        {
          icon: '🔊',
          title: 'Sound System Engineering',
          subtitle: 'Audio Installation & Configuration',
          description: 'Professional design and implementation of audio systems for various applications including live events and venues.',
          specs: [
            'Speaker system design & placement',
            'Amplifier selection & configuration',
            'Acoustic analysis & optimization',
            'Mixing console operation',
            'Sound quality diagnostics',
            'Equipment compatibility assessment',
          ],
        },
        {
          icon: '🎙️',
          title: 'Audio Production Support',
          subtitle: 'Studio Engineering & Troubleshooting',
          description: 'Technical support for audio production with focus on hardware integration and signal flow optimization.',
          specs: [
            'Microphone selection & placement',
            'Recording interface optimization',
            'Signal chain troubleshooting',
            'Monitor system setup',
            'Latency diagnosis & solutions',
            'Equipment integration testing',
          ],
        },
      ],
    },
  }

  const categories = [
    { id: 'electronics', label: '🎮 Gaming Hardware', icon: '🎮' },
    { id: 'drones', label: '🚁 Drone Operations', icon: '🚁' },
    { id: 'audio', label: '🔊 Audio Systems', icon: '🔊' },
  ]

  const current = expertise[selectedExpertise as keyof typeof expertise]

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
            className="text-neon-purple hover:text-neon-cyan transition-colors mb-4 flex items-center gap-2"
            whileHover={{ scale: 1.05, x: -5 }}
          >
            ← Back to Hub
          </motion.button>
          <h1 className="text-5xl md:text-6xl font-black mb-4 neon-glow-purple">HARDWARE EXPERT</h1>
          <p className="text-gray-400 text-lg">
            From gaming consoles to drones: tangible expertise meets digital mastery
          </p>
        </motion.div>

        {/* Category Selector */}
        <motion.div
          className="flex gap-4 mb-12 flex-wrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {categories.map((cat) => (
            <motion.button
              key={cat.id}
              onClick={() => setSelectedExpertise(cat.id)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedExpertise === cat.id
                  ? 'bg-gradient-to-r from-neon-purple to-neon-pink text-white shadow-neon-purple'
                  : 'glass border border-neon-purple/30 text-neon-purple hover:border-neon-purple'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {cat.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Category Title */}
        <motion.div
          className="mb-12"
          key={selectedExpertise}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-neon-purple mb-2">{current.title}</h2>
          <p className="text-gray-400">{current.description}</p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-12"
          layout
        >
          {current.projects.map((project, i) => (
            <ProjectCard
              key={project.title}
              {...project}
              delay={i * 0.1}
            />
          ))}
        </motion.div>

        {/* Capabilities Overview */}
        <motion.div
          className="glass border border-neon-purple/30 rounded-lg p-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-2xl font-bold neon-glow-purple mb-6">Core Capabilities</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <h4 className="text-neon-purple font-bold flex items-center gap-2">
                <span>🔧</span> Diagnostic Skills
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>✓ Hardware troubleshooting</li>
                <li>✓ Error code analysis</li>
                <li>✓ Performance testing</li>
                <li>✓ System benchmarking</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-neon-pink font-bold flex items-center gap-2">
                <span>⚙️</span> Repair & Maintenance
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>✓ Component replacement</li>
                <li>✓ Preventive maintenance</li>
                <li>✓ Thermal management</li>
                <li>✓ Firmware updates</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-neon-cyan font-bold flex items-center gap-2">
                <span>🎯</span> Optimization
              </h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>✓ Performance tuning</li>
                <li>✓ Noise reduction</li>
                <li>✓ Power efficiency</li>
                <li>✓ Longevity optimization</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Value Proposition */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="p-8 glass border border-neon-purple/30 rounded-lg">
            <h3 className="text-xl font-bold text-neon-purple mb-4">🤝 Why Hardware Expertise Matters</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              In the intersection of software and hardware, understanding physical systems separates good engineers from great ones. This expertise demonstrates:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>✓ Deeper technical understanding</li>
              <li>✓ Real-world problem solving</li>
              <li>✓ Systems thinking approach</li>
              <li>✓ Hands-on practical skills</li>
            </ul>
          </div>

          <div className="p-8 glass border border-neon-pink/30 rounded-lg">
            <h3 className="text-xl font-bold text-neon-pink mb-4">🚀 Application to Software</h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              Hardware knowledge directly improves software engineering:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>✓ Performance architecture decisions</li>
              <li>✓ Resource optimization</li>
              <li>✓ Hardware-aware programming</li>
              <li>✓ IoT and embedded solutions</li>
            </ul>
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
            className="px-8 py-4 bg-gradient-to-r from-neon-purple to-neon-pink text-white font-bold rounded-lg shadow-neon-purple hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              // Placeholder for inquiry form or contact
              alert('Contact form coming soon')
            }}
          >
            ⚙️ Request Hardware Consultation
          </motion.button>
          <p className="text-gray-500 text-sm mt-4">Custom services and projects available</p>
        </motion.div>
      </div>
    </div>
  )
}
