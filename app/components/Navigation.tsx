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
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo/Brand */}
        <motion.button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* IAMIAN Logo Image */}
          <div className="h-10 w-auto">
            <img
              src="/images/IAMIAN%20Logo.png"
              alt="IAMIAN Logo"
              className="h-10 object-contain"
            />
          </div>
          {/* Fallback text if image not loaded */}
          <span className="font-bold neon-glow text-lg hidden sm:inline">IAMIAN</span>
        </motion.button>

        {/* Navigation Items */}
        <div className="hidden md:flex gap-8 items-center">
          {[
            { id: 'story', label: '📖 Story', icon: '', href: '/' },
            { id: 'tech', label: '⚡ Tech', icon: '', href: '/tech' },
            { id: 'audio', label: '🎵 Audio', icon: '', href: '/audio' },
            { id: 'hardware', label: '⚙️ Hardware', icon: '', href: '/hardware' },
            { id: 'record-label', label: '🎼 Record Label', icon: '', href: '/record-label' },
            { id: 'decoded', label: '🔓 Decoded', icon: '', href: '/decoded' },
            { id: 'community', label: '🤝 Community', icon: '', href: '/community' },
          ].map((item) => (
            <motion.a
              key={item.id}
              href={item.href}
              className="text-sm font-semibold text-gray-400 hover:text-neon-cyan transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.label}
            </motion.a>
          ))}

          {/* Auth Buttons */}
          <div className="flex gap-4 ml-4 border-l border-neon-cyan/30 pl-4">
            <motion.a
              href="/auth/login"
              className="text-sm font-semibold text-neon-cyan hover:text-neon-blue transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.a>
            <motion.a
              href="/auth/signup"
              className="text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-bg hover:shadow-lg hover:shadow-neon-cyan/50 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.a>
          </div>
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

            {/* Mobile Auth Buttons */}
            <div className="border-t border-neon-cyan/30 pt-4 mt-4 space-y-2">
              <motion.a
                href="/auth/login"
                className="block w-full text-center text-sm font-semibold text-neon-cyan hover:text-neon-blue py-2 px-3 rounded transition-colors"
                whileHover={{ backgroundColor: 'rgba(0, 217, 255, 0.1)' }}
              >
                Login
              </motion.a>
              <motion.a
                href="/auth/signup"
                className="block w-full text-center text-sm font-semibold px-4 py-2 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-bg hover:shadow-lg hover:shadow-neon-cyan/50 transition-all"
                whileHover={{ scale: 1.05 }}
              >
                Sign Up
              </motion.a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  )
}
