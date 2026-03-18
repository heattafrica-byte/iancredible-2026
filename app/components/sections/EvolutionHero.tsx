'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

type EraType = 'morrison' | 'credible' | 'iamian'

const EraCard = ({
  era,
  title,
  subtitle,
  description,
  icon,
  color,
  isActive,
  onClick,
  delay,
}: {
  era: EraType
  title: string
  subtitle: string
  description: string
  icon: string
  color: string
  isActive: boolean
  onClick: () => void
  delay: number
}) => (
  <motion.button
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    onClick={onClick}
    className={`relative h-96 rounded-2xl overflow-hidden transition-all cursor-pointer group ${
      isActive ? 'ring-2 ring-offset-2 ring-offset-dark-bg' : ''
    }`}
    style={{
      borderColor: color,
    }}
    whileHover={{ scale: 1.05, y: -10 }}
  >
    <div
      className={`absolute inset-0 glass border-2 transition-all ${
        isActive ? 'border-opacity-100' : 'border-opacity-30'
      }`}
      style={{
        borderColor: color,
        background: isActive
          ? `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`
          : 'rgba(26, 31, 58, 0.4)',
      }}
    >
      {/* Animated background gradient */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isActive ? 'opacity-100' : 'opacity-20'
        }`}
        style={{
          background: `radial-gradient(circle at 50% 50%, ${color}20 0%, transparent 70%)`,
        }}
      />
    </div>

    {/* Content */}
    <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
      <motion.div
        className="text-6xl mb-4"
        animate={isActive ? { scale: 1.2 } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.div>

      <h3
        className="text-2xl font-black mb-2 transition-colors"
        style={{ color: isActive ? color : '#a0a0c0' }}
      >
        {title}
      </h3>

      <p className="text-xs text-gray-400 mb-4 font-semibold tracking-wider uppercase">
        {subtitle}
      </p>

      <motion.p
        initial={{ opacity: 0, maxHeight: 0 }}
        animate={
          isActive
            ? { opacity: 1, maxHeight: 500 }
            : { opacity: 0, maxHeight: 0 }
        }
        transition={{ duration: 0.3 }}
        className="text-sm text-gray-300 leading-relaxed overflow-auto max-h-48"
      >
        {description}
      </motion.p>

      {isActive && (
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-6 h-0.5 w-12 rounded-full"
          style={{ background: color }}
        />
      )}
    </div>
  </motion.button>
)

export default function EvolutionHero() {
  const [activeEra, setActiveEra] = useState<EraType>('morrison')

  const eras = {
    morrison: {
      title: 'IAN MORRISON',
      subtitle: 'The Foundation (40 Years)',
      description:
        'From the soldering iron to the DAW, from the terminal to the track. A lifetime of curiosity, hands-on learning, and an unrelenting drive to understand how things work—from Dell Inspiron 5100s to PlayStation 5s. The foundation of everything I am today.',
      icon: '🧬',
      color: '#10b981',
    },
    credible: {
      title: 'IAN CREDIBLE',
      subtitle: 'The Professional Emergence',
      description:
        'The establishment of authority. A Sound Architect exploring, experiencing, and mastering as many sonic genres as possible, building professional reputation through priceless mentorship and tireless craftsmanship. This era proved that passion and precision create lasting impact in the music industry.',
      icon: '🎵',
      color: '#f59e0b',
    },
    iamian: {
      title: 'IAMIAN',
      subtitle: 'The Current Synthesis',
      description:
        'The convergence. Raw authentic Production Key focus, Enterprise System Grade Programming, Cinematography Hardware, and Hardware Technician Mastery—all fueled by the same fiery passion that has driven me from the beginning. I am the synthesis of what I was, what I became, and what I am becoming.',
      icon: '⚡',
      color: '#00d9ff',
    },
  }

  return (
    <section className="min-h-screen pt-32 pb-16 px-4 flex flex-col items-center justify-center">
      <div className="max-w-6xl mx-auto w-full">
        {/* Opening Statement with Logo */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-black mb-6 neon-glow-enhanced">
            THIS IS MY STORY
          </h1>
        </motion.div>

        {/* Era Selection */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          {Object.entries(eras).map(([key, era], i) => (
            <EraCard
              key={key}
              era={key as EraType}
              title={era.title}
              subtitle={era.subtitle}
              description={era.description}
              icon={era.icon}
              color={era.color}
              isActive={activeEra === key}
              onClick={() => setActiveEra(key as EraType)}
              delay={i * 0.1 + 0.3}
            />
          ))}
        </motion.div>

        {/* Description Section */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
            I am Ian Morrison. I have evolved through many identities—Ian Credible, now IAMIAN—shaped by 40
            years of personal experience, professional growth, and the generosity of a fiery creative community
            that believed in passing on priceless knowledge without expectation of remuneration.
          </p>
        </motion.div>

        {/* Core Value Statement */}
        <motion.div
          className="text-center max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="glass weathered weathered-border scratches wet-reflection glitch-overlay shadow-neon-cyan border border-neon-cyan/30 rounded-xl p-8 md:p-12">
            <h2 className="text-3xl font-black neon-glow-enhanced mb-6">WHAT I OFFER</h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-8">
              I am a <span className="text-neon-cyan font-bold">Full-Stack Creator</span> offering:
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <p className="text-2xl">⚡</p>
                <h3 className="font-bold text-neon-cyan">Enterprise Architecture</h3>
                <p className="text-sm text-gray-400">
                  Production-ready system design with rigorous testing, scaled to commercial grade performance
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl">🎵</p>
                <h3 className="font-bold text-neon-pink">Sonic Architecture</h3>
                <p className="text-sm text-gray-400">
                  Professional production, mixing, mastering, and sound engineering across all sonic genres
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-2xl">⚙️</p>
                <h3 className="font-bold text-neon-purple">Hardware Field Ops</h3>
                <p className="text-sm text-gray-400">
                  System restoration, video operations, technical problem-solving, and technician-level precision
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="mt-16 text-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p className="text-gray-500 text-sm mb-2">Scroll to explore functional demos</p>
          <p className="text-2xl">↓</p>
        </motion.div>
      </div>
    </section>
  )
}
