'use client'

import { motion } from 'framer-motion'
import { MediaLoader } from '@/app/components/MediaLoader'

const GratitudeGrid = () => {
  const mentorCategories = [
    {
      role: 'The Sonic Mentors',
      emoji: '🎧',
      impact:
        'Those who shared the alchemy of Goa Trance and Sound Engineering, passing on priceless knowledge of frequency and flow without expectation of remuneration.',
      theme: '#00d9ff',
      contribution: 'Foundation of artistic excellence',
    },
    {
      role: 'The Tech Architects',
      emoji: '🏗️',
      impact:
        'The engineers who taught me to see code as a craft, enabling the 245-hour precision required for systems like Diesel Flow.',
      theme: '#10b981',
      contribution: 'Engineering discipline & systems thinking',
    },
    {
      role: 'The Makers & Greasemonkeys',
      emoji: '🔧',
      impact:
        'The hands-on experts who showed me that everything—from a PS5 to a DJI drone—is a puzzle waiting to be solved.',
      theme: '#f59e0b',
      contribution: 'Hands-on problem-solving mentality',
    },
    {
      role: 'The Community Catalysts',
      emoji: '🌐',
      impact:
        'Those who believe in collective growth, who share knowledge openly and foster environments where creativity thrives through collaboration and mutual respect.',
      theme: '#d946ef',
      contribution: 'The philosophy of paying it forward',
    },
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-dark-surface to-dark-bg">
      <div className="max-w-6xl mx-auto">
        {/* Section Header with Visual */}
        <motion.div
          className="text-center mb-20 relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Background street art accent */}
          <div className="absolute -top-20 -right-32 opacity-20 pointer-events-none hidden lg:block">
            <MediaLoader
              folder="images"
              fallbackUrl="/images/street-art-portrait.png"
              alt="Street art accent"
              className="w-96 h-96 object-cover rounded-full blur-sm"
            />
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6 neon-glow-enhanced">THE GRATITUDE GRID</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed relative z-10">
            I believe it is through the amazing creative professionals I have met that I have catapulted forward.
            Their willingness to pass on experience with no expectation of remuneration, fueled by shared passion,
            is the foundation of everything I build today. This grid honors those mentors and celebrates the
            philosophy of community-driven growth.
          </p>
        </motion.div>

        {/* Mentor Grid */}
        <motion.div
          className="grid md:grid-cols-2 gap-8 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          viewport={{ once: true }}
        >
          {mentorCategories.map((mentor, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-2xl"
            >
              {/* Background with gradient overlay */}
              <div
                className="absolute inset-0 transition-all duration-500 opacity-0 group-hover:opacity-100"
                style={{
                  background: `linear-gradient(135deg, ${mentor.theme}20 0%, ${mentor.theme}05 100%)`,
                }}
              />

              {/* Card */}
              <div
                className="relative p-8 md:p-10 rounded-2xl border-2 transition-all duration-300 glass"
                style={{
                  borderColor: `${mentor.theme}60`,
                }}
              >
                {/* Icon */}
                <motion.div
                  className="text-6xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 10 }}
                >
                  {mentor.emoji}
                </motion.div>

                {/* Title */}
                <h3 className="text-2xl font-black mb-3" style={{ color: mentor.theme }}>
                  {mentor.role}
                </h3>

                {/* Impact text */}
                <p className="text-gray-300 leading-relaxed mb-6 text-sm md:text-base">
                  {mentor.impact}
                </p>

                {/* Contribution badge */}
                <motion.div
                  className="inline-block px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-widest transition-all"
                  style={{
                    background: `${mentor.theme}20`,
                    color: mentor.theme,
                    border: `1px solid ${mentor.theme}40`,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {mentor.contribution}
                </motion.div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Community Philosophy */}
        <motion.div
          className="mt-20 glass border border-neon-cyan/30 rounded-2xl p-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-black neon-glow mb-6">OUR SHARED MISSION</h3>
          <p className="text-xl text-gray-300 italic mb-8 leading-relaxed max-w-3xl mx-auto">
            "To pay it forward by sharing my extensive knowledge base with the same fiery passion that was gifted
            to me—creating a cycle of growth where every creative professional elevates the next generation."
          </p>

          {/* Action Items */}
          <div className="grid md:grid-cols-3 gap-6 mt-12 pt-12 border-t border-neon-cyan/20">
            <div className="space-y-3">
              <p className="text-3xl">📚</p>
              <h4 className="font-bold text-neon-cyan">Knowledge Sharing</h4>
              <p className="text-sm text-gray-400">
                Code snippets, sound design tips, and workflow automations freely available
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-3xl">🤝</p>
              <h4 className="font-bold text-neon-pink">Community Collaboration</h4>
              <p className="text-sm text-gray-400">
                Fostering connections between creatives for mutual growth and support
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-3xl">🔥</p>
              <h4 className="font-bold text-neon-purple">Passionate Mentorship</h4>
              <p className="text-sm text-gray-400">
                Guided by the same patient brilliance I received, expecting nothing but shared passion
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm mb-6">
            If you've been part of this journey or are interested in collaborating:
          </p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-bg font-bold rounded-lg shadow-neon hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Connect & Collaborate
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default GratitudeGrid
