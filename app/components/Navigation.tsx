'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface NavigationProps {
  currentPath: string
  onNavigate: (path: string) => void
}

export default function Navigation({ currentPath, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false) // Close menu after clicking
    }
  }

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-neon-cyan/30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo/Brand */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-xl font-bold neon-glow cursor-pointer hover:text-neon-cyan transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          ◈ IAMIAN
        </motion.button>

        {/* Navigation Items */}
        <div className="hidden md:flex gap-8 items-center">
          {[
            { id: 'story', label: '📖 Story', icon: '' },
            { id: 'diesel', label: '⚡ Tech', icon: '' },
            { id: 'sonic', label: '🎵 Audio', icon: '' },
            { id: 'hardware', label: '⚙️ Hardware', icon: '' },
            { id: 'gratitude', label: '🤝 Community', icon: '' },
            { id: 'global', label: '🌐 Connect', icon: '' },
          ].map((item) => (
            <motion.button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="text-sm font-semibold text-gray-400 hover:text-neon-cyan transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.button>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-neon-cyan text-2xl hover:text-neon-blue transition-colors py-2 px-3"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {mobileMenuOpen ? '✕' : '≡'}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          className="md:hidden glass border-t border-neon-cyan/30 bg-dark-bg/95"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="px-6 py-4 space-y-4">
            {[
              { id: 'story', label: '📖 Story' },
              { id: 'diesel', label: '⚡ Tech' },
              { id: 'sonic', label: '🎵 Audio' },
              { id: 'hardware', label: '⚙️ Hardware' },
              { id: 'gratitude', label: '🤝 Community' },
              { id: 'global', label: '🌐 Connect' },
            ].map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="block w-full text-left text-sm font-semibold text-gray-400 hover:text-neon-cyan transition-colors py-2 px-3 rounded"
                whileHover={{ x: 5, color: '#00d9ff' }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
