'use client'

import { motion } from 'framer-motion'

const IntellimixShowcase = () => {
  return (
    <section className="py-24 px-4 bg-dark-bg">
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
            <span style={{ textShadow: '0 0 30px rgba(0, 217, 255, 0.6)' }}>
              INTELLIMIX AI
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            Professional audio mixing powered by AI. Real-time DSP processing, mastering insights, and intelligent audio workflows.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-6 mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
          viewport={{ once: true }}
        >
          {[
            {
              icon: '🎚️',
              title: 'Pro Mixing Engine',
              description: 'Multi-track mixing with professional-grade EQ, compression, and effects',
              color: '#00d9ff',
            },
            {
              icon: '🤖',
              title: 'AI Mastering',
              description: 'Gemini-powered insights for professional mastering recommendations',
              color: '#10b981',
            },
            {
              icon: '📊',
              title: 'Real-Time Analysis',
              description: 'Live visualization, metering, and audio analysis during processing',
              color: '#ff00ff',
            },
          ].map((feature, idx) => (
            <motion.div
              key={idx}
              className="glass weathered weathered-border scratches wet-reflection glitch-overlay shadow-neon-cyan border border-neon-cyan/30 rounded-2xl p-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              style={{
                borderColor: feature.color,
                background: `${feature.color}05`,
              }}
            >
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3" style={{ color: feature.color }}>
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-8 text-lg">
            Launch the full IntelliMix AI Studio for professional audio mixing and mastering
          </p>
          <motion.a
            href="https://intellimix-ai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-5 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold rounded-lg shadow-lg transition-all"
            whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 217, 255, 0.8)' }}
            whileTap={{ scale: 0.95 }}
          >
            🚀 Launch IntelliMix AI Studio
          </motion.a>
          <p className="text-xs text-gray-500 mt-6">
            Opens in a new window • Requires authentication
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          className="mt-16 glass weathered weathered-border scratches wet-reflection glitch-overlay shadow-neon-pink border border-neon-pink/30 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold neon-pink-enhanced mb-8 text-center">
            Capabilities
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="font-bold text-neon-cyan mb-4">Mixing & Processing</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Multi-track mixdown with real-time rendering</li>
                <li>✓ Advanced EQ with parametric control</li>
                <li>✓ Compression and dynamic processing</li>
                <li>✓ Reverb, delay, and spatial effects</li>
                <li>✓ Automation editing and recording</li>
                <li>✓ Track linking and grouping</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-neon-pink mb-4">AI & Intelligence</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>✓ Gemini-powered mastering insights</li>
                <li>✓ Genre-based processing recommendations</li>
                <li>✓ Audio analysis and suggestions</li>
                <li>✓ FX recommendations per track</li>
                <li>✓ Cloud project storage & sync</li>
                <li>✓ Professional audio export</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default IntellimixShowcase
