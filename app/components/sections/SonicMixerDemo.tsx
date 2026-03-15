'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { MediaLoader } from '@/app/components/MediaLoader'

const SonicMixerDemo = () => {
  const [bars, setBars] = useState<number[]>(Array(20).fill(0))
  const [activeStem, setActiveStem] = useState<string>('kick')
  const [selectedFiles, setSelectedFiles] = useState<{
    [key: string]: string
  }>({
    input_kick: 'preset_kick_01.wav',
    input_lead: 'preset_lead_01.wav',
    input_atmosphere: 'preset_atm_01.wav',
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setBars(
        Array(20)
          .fill(0)
          .map(() => Math.random() * 100)
      )
    }, 150)
    return () => clearInterval(interval)
  }, [])

  // DSP Chain stages
  const dspChain = [
    {
      stage: 'INPUT',
      description: 'Raw stem selection',
      color: '#00d9ff',
      stems: {
        kick: ['Kick - Deep House', 'Kick - Hardstyle', 'Kick - Techno'],
        lead: ['Lead - Ambient', 'Lead - Melodic', 'Lead - Atmospheric'],
        atmosphere: ['Pad - Cinematic', 'Pad - Ethereal', 'Pad - Lush'],
      },
    },
    {
      stage: 'EQUALIZATION',
      description: 'Frequency shaping & balance',
      color: '#10b981',
      params: ['Low (Hz)', 'Mid (dB)', 'High (Hz)'],
    },
    {
      stage: 'COMPRESSION',
      description: 'Dynamic range control',
      color: '#f59e0b',
      params: ['Ratio', 'Attack (ms)', 'Release (ms)'],
    },
    {
      stage: 'EFFECTS',
      description: 'Spatial & texture processing',
      color: '#d946ef',
      params: ['Reverb Mix', 'Delay Time', 'Width'],
    },
    {
      stage: 'OUTPUT',
      description: 'Final mix & visualization',
      color: '#ff00ff',
      params: ['Master Level', 'Limiter', 'Metering'],
    },
  ]

  const stems = [
    {
      id: 'kick',
      name: 'Kick Track',
      icon: '🥁',
      color: '#ff00ff',
      description: 'Deep, powerful low-end foundation',
    },
    {
      id: 'lead',
      name: 'Lead Track',
      icon: '🎹',
      color: '#00d9ff',
      description: 'Melodic synth layers',
    },
    {
      id: 'atmosphere',
      name: 'Atmosphere Track',
      icon: '☁️',
      color: '#d946ef',
      description: 'Ambient pad & texture',
    },
  ]

  return (
    <section className="py-24 px-4 bg-dark-bg">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span style={{ textShadow: '0 0 30px rgba(255, 0, 255, 0.6)' }}>SONIC ARCHITECTURE</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Interactive DSP chain demonstration: Experience professional audio processing from input through mastered output
          </p>
        </motion.div>

        {/* DSP Chain Flow Diagram */}
        <motion.div
          className="mb-16 glass weathered weathered-border scratches wet-reflection glitch-overlay shadow-neon-cyan border border-neon-cyan/30 rounded-2xl p-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold neon-glow-enhanced mb-8 text-center uppercase tracking-wider">
            Digital Signal Processing Chain
          </h3>

          {/* Flow Diagram */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8 max-h-48 overflow-x-auto overflow-y-hidden pb-4">
            {dspChain.map((stage, i) => (
              <div key={i} className="relative">
                <motion.div
                  className="glass border-2 rounded-lg p-4 text-center cursor-pointer transition-all"
                  style={{
                    borderColor: stage.color,
                    background: `${stage.color}08`,
                  }}
                  whileHover={{ scale: 1.05, background: `${stage.color}15` }}
                >
                  <p className="font-black text-sm" style={{ color: stage.color }}>
                    {stage.stage}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">{stage.description}</p>
                </motion.div>
                {i < dspChain.length - 1 && (
                  <div
                    className="hidden md:block absolute -right-2 top-1/2 transform -translate-y-1/2 text-xl"
                    style={{ color: '#00d9ff' }}
                  >
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-center text-xs text-gray-500">
            Select a stem below, choose files at each stage, then watch the processed audio in the visualizer
          </p>
        </motion.div>

        {/* Stem Selection */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-neon-pink mb-8 text-center">SELECT STEM TO PROCESS</h3>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {stems.map((stem) => (
              <motion.button
                key={stem.id}
                onClick={() => setActiveStem(stem.id)}
                className={`glass border-2 rounded-xl p-6 transition-all text-left ${
                  activeStem === stem.id ? 'ring-2 ring-offset-2' : ''
                }`}
                style={{
                  borderColor: activeStem === stem.id ? stem.color : `${stem.color}40`,
                  background:
                    activeStem === stem.id
                      ? `${stem.color}15`
                      : 'rgba(26, 31, 58, 0.4)',
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{stem.icon}</span>
                  <div>
                    <h4 className="text-lg font-bold" style={{ color: stem.color }}>
                      {stem.name}
                    </h4>
                    <p className="text-xs text-gray-400">{stem.description}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Active Stem Processing */}
        {stems.map((stem) => (
          activeStem === stem.id && (
            <motion.div
              key={stem.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-16"
            >
              <h3 className="text-2xl font-bold text-center mb-8" style={{ color: stem.color }}>
                Processing: {stem.name}
              </h3>

              {/* Step-by-step file selection */}
              <div className="space-y-4 mb-12 scrollable-lg">
                {dspChain.map((stage, i) => (
                  <motion.div
                    key={i}
                    className="glass border border-gray-700/50 rounded-xl p-6"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center font-bold"
                        style={{ background: `${stage.color}20`, color: stage.color }}
                      >
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg" style={{ color: stage.color }}>
                          {stage.stage}
                        </h4>
                        <p className="text-xs text-gray-400">{stage.description}</p>
                      </div>
                    </div>

                    {/* File options for INPUT stage, params for others */}
                    {stage.stage === 'INPUT' && stem.id in (stage.stems as any) ? (
                      <div className="grid md:grid-cols-3 gap-3">
                        {(stage.stems as any)[stem.id].map((file: string, fileIdx: number) => (
                          <motion.button
                            key={fileIdx}
                            className={`p-3 rounded-lg text-sm font-semibold transition-all border-2 text-left ${
                              selectedFiles[`input_${stem.id}`] === `preset_${stem.id}_0${fileIdx + 1}.wav`
                                ? 'ring-2 ring-offset-2'
                                : ''
                            }`}
                            style={{
                              borderColor:
                                selectedFiles[`input_${stem.id}`] === `preset_${stem.id}_0${fileIdx + 1}.wav`
                                  ? stage.color
                                  : `${stage.color}40`,
                              background:
                                selectedFiles[`input_${stem.id}`] === `preset_${stem.id}_0${fileIdx + 1}.wav`
                                  ? `${stage.color}15`
                                  : 'rgba(26, 31, 58, 0.5)',
                              color:
                                selectedFiles[`input_${stem.id}`] === `preset_${stem.id}_0${fileIdx + 1}.wav`
                                  ? stage.color
                                  : '#a0a0c0',
                            }}
                            onClick={() => {
                              setSelectedFiles({
                                ...selectedFiles,
                                [`input_${stem.id}`]: `preset_${stem.id}_0${fileIdx + 1}.wav`,
                              })
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            📄 {file}
                          </motion.button>
                        ))}
                      </div>
                    ) : stage.stage !== 'INPUT' ? (
                      <div className="grid md:grid-cols-3 gap-4">
                        {(stage.params as any).map((param: string, paramIdx: number) => (
                          <div key={paramIdx} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="text-xs font-semibold text-gray-400">{param}</label>
                              <span style={{ color: stage.color }} className="text-sm font-bold">
                                {Math.round(Math.random() * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-dark-surface rounded-full h-2 overflow-hidden">
                              <motion.div
                                className="h-full"
                                style={{ background: stage.color }}
                                animate={{ width: `${Math.round(Math.random() * 100)}%` }}
                                transition={{ duration: 0.5 }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* Upload option for each stage */}
                    <div className="mt-4 pt-4 border-t border-gray-700/30">
                      <motion.button
                        className="w-full py-2 px-4 rounded-lg text-sm font-semibold border-2 border-dashed transition-all"
                        style={{
                          borderColor: `${stage.color}60`,
                          color: stage.color,
                          background: `${stage.color}05`,
                        }}
                        whileHover={{ background: `${stage.color}10` }}
                      >
                        📤 Upload Custom File
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        ))}

        {/* Live Audio Visualizer (Output of DSP Chain) */}
        <motion.div
          className="glass weathered weathered-border scratches wet-reflection glitch-overlay shadow-neon-pink border border-neon-pink/30 rounded-2xl p-8 md:p-12 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold neon-pink-enhanced mb-8 text-center">
            ⚡ LIVE DSP OUTPUT VISUALIZER
          </h3>
          <div className="flex items-end justify-center gap-1 h-40 md:h-56 mb-8 bg-dark-surface/50 rounded-lg p-4">
            {bars.map((height, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-neon-pink via-neon-purple to-neon-cyan rounded-sm"
                animate={{ height: `${Math.max(height, 10)}%` }}
                transition={{ duration: 0.1 }}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-500">Real-time processing of "{stems.find(s => s.id === activeStem)?.name}" through DSP chain</p>
        </motion.div>

        {/* Production Details */}
        <motion.div
          className="glass weathered weathered-border scratches wet-reflection glitch-overlay shadow-neon-pink border border-neon-pink/30 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold neon-pink-enhanced mb-8">Production Mastery</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-4 md:col-span-2 scrollable-sm">
              <h4 className="font-bold text-neon-pink mb-4">DSP & Engineering</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Advanced signal flow architecture</li>
                <li>✓ Multi-band EQ & dynamic processing</li>
                <li>✓ Spatial effects & stereo imaging</li>
                <li>✓ Professional mastering workflows</li>
                <li>✓ Real-time stem management & routing</li>
              </ul>
              <h4 className="font-bold text-neon-pink mb-4 mt-6">Production Genres</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>🎵 Raw, authentic production styles</li>
                <li>🌀 Psychedelic & ambient soundscapes</li>
                <li>🥁 Complex drum programming</li>
                <li>☁️ Textural & atmospheric design</li>
                <li>🔊 Professional sound architecture</li>
              </ul>
            </div>
            {/* IntelliMix AI Visualization */}
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="relative h-64 w-full">
                <MediaLoader
                  folder="images"
                  fallbackUrl="/images/intellimix-ai.png"
                  alt="IntelliMix AI Mixing Software"
                  className="w-full h-full object-cover rounded-lg shadow-lg shadow-neon-pink/50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent rounded-lg flex items-end p-4">
                  <p className="text-sm font-bold text-neon-pink text-center">AI-powered mixing &mastering</p>
                </div>
              </div>
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
          <p className="text-gray-400 mb-6">Ready to elevate your sonic experience?</p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-neon-pink to-neon-purple text-white font-bold rounded-lg shadow-neon-pink hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Collaborate Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default SonicMixerDemo
