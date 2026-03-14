'use client'

import { motion } from 'framer-motion'

interface NavigationProps {
  currentPath: string
  onNavigate: (path: string) => void
}

export default function Navigation({ currentPath, onNavigate }: NavigationProps) {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
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

        {/* Mobile Menu Indicator */}
        <div className="md:hidden text-neon-cyan text-xl">≡</div>
      </div>
    </motion.nav>
  )
}
