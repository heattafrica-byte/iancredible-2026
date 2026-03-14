'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface MatrixHubProps {
  onPathSelect: (path: 'code' | 'sound' | 'hardware') => void
}

const MatrixPathCard = ({
  icon,
  title,
  subtitle,
  description,
  color,
  onClick,
  delay,
}: {
  icon: string
  title: string
  subtitle: string
  description: string
  color: 'cyan' | 'pink' | 'purple'
  onClick: () => void
  delay: number
}) => {
  const colorMap = {
    cyan: {
      glow: 'shadow-neon',
      border: 'border-neon-cyan/40',
      hover: 'hover:border-neon-cyan',
      text: 'text-neon-cyan',
    },
    pink: {
      glow: 'shadow-neon-pink',
      border: 'border-neon-pink/40',
      hover: 'hover:border-neon-pink',
      text: 'text-neon-pink',
    },
    purple: {
      glow: 'shadow-neon-purple',
      border: 'border-neon-purple/40',
      hover: 'hover:border-neon-purple',
      text: 'text-neon-purple',
    },
  }

  const styles = colorMap[color]

  return (
    <motion.button
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, y: -10 }}
      whileTap={{ scale: 0.95 }}
      className={`relative w-full h-80 group cursor-pointer overflow-hidden`}
    >
      <div
        className={`absolute inset-0 glass ${styles.border} ${styles.hover} ${styles.glow} border-2 rounded-2xl transition-all duration-300 group-hover:bg-dark-surface/60`}
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern
                id={`grid-${color}`}
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <path d={`M 40 0 L 0 0 0 40`} fill="none" stroke={`var(--color-${color})`} strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#grid-${color})`} />
          </svg>
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            className="text-6xl mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {icon}
          </motion.div>

          <h3 className={`text-2xl font-bold mb-2 ${styles.text}`}>{title}</h3>
          <p className="text-sm text-gray-400 mb-6">{subtitle}</p>

          <motion.div
            className="text-gray-300 text-sm leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-300"
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
          >
            <p>{description}</p>
            <motion.div
              className={`mt-4 inline-block px-6 py-2 border-2 ${styles.border} rounded-lg ${styles.text} font-semibold group-hover:bg-dark-surface/40 transition-all`}
              whileHover={{ scale: 1.1 }}
            >
              Enter →
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.button>
  )
}

export default function MatrixHub({ onPathSelect }: MatrixHubProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      {/* Animated background cursor effect */}
      <motion.div
        className="pointer-events-none fixed w-96 h-96 bg-gradient-to-r from-neon-cyan/10 to-neon-purple/10 rounded-full filter blur-3xl opacity-20"
        animate={{ x: mousePosition.x - 192, y: mousePosition.y - 192 }}
        transition={{ type: 'spring', damping: 30, mass: 0.2 }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-6xl md:text-7xl font-black mb-4 neon-glow">
            MATRIX HUB
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Choose your path through the multidimensional portfolio of a{' '}
            <span className="text-neon-cyan font-semibold">Creative Technologist</span>
          </p>
          <motion.div
            className="mt-8 flex justify-center gap-4 flex-wrap"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {['⚡ CODE', '🎵 SOUND', '⚙️ HARDWARE'].map((tag, i) => (
              <motion.span
                key={tag}
                className="text-sm px-4 py-2 border border-neon-cyan/50 rounded-full text-neon-cyan"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 3, delay: i * 0.3, repeat: Infinity }}
              >
                {tag}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>

        {/* Path Selection Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <MatrixPathCard
            icon="⚡"
            title="TECH VISIONARY"
            subtitle="Code • Business • Scale"
            description="245 dev hours. React/Firebase. R1.1M YoY revenue potential. From zero to production-ready enterprise solutions."
            color="cyan"
            onClick={() => onPathSelect('code')}
            delay={0.1}
          />

          <MatrixPathCard
            icon="🎵"
            title="SONIC ARCHITECT"
            subtitle="Audio • Music • Production"
            description="Raw Hardstyle. Goa Trance. Professional music production & engineering expertise with industry presence."
            color="pink"
            onClick={() => onPathSelect('sound')}
            delay={0.2}
          />

          <MatrixPathCard
            icon="⚙️"
            title="HARDWARE EXPERT"
            subtitle="Maker • Enduro • Drone"
            description="PS5 restoration. DJI Mavic 2 mastery. Sound system engineering. Tangible expertise meets digital skills."
            color="purple"
            onClick={() => onPathSelect('hardware')}
            delay={0.3}
          />
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-gray-400 text-sm">
            Click any path to explore | Navigate using the menu above
          </p>
        </motion.div>
      </div>
    </div>
  )
}
