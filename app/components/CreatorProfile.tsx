'use client'

import { motion } from 'framer-motion'

export default function CreatorProfile() {
  return (
    <section className="py-24 px-4 bg-gradient-to-b from-dark-bg via-dark-surface to-dark-bg">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="neon-cyan-enhanced">MEET THE CREATOR</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            40 years of passion, curiosity, and precision. From soldering irons to DAWs, from code to composition.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Portrait Section with Cyberpunk Frame */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Outer neon frame */}
            <div className="relative">
              {/* Glitch effect container */}
              <div className="relative group">
                {/* Primary frame */}
                <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-neon-cyan shadow-lg">
                  {/* Neon glow effect */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 rounded-2xl -z-10" />
                  
                  {/* Portrait Image */}
                  <div className="relative w-full h-full bg-dark-surface">
                    <img
                      src="/images/ian-morrison-portrait.jpg"
                      alt="Ian Morrison - Creator"
                      className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Glitch overlay effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300">
                      <div className="absolute top-0 left-0 w-full h-1 bg-neon-cyan animate-pulse" />
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-neon-pink animate-pulse" style={{ animationDelay: '0.5s' }} />
                    </div>

                    {/* Tech scan lines overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-5">
                      {[...Array(20)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-full h-px bg-neon-cyan"
                          style={{
                            top: `${(i / 20) * 100}%`,
                            animation: `scan ${2 + i * 0.1}s linear infinite`,
                          }}
                        />
                      ))}
                    </div>

                    {/* Corner brackets */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-neon-cyan opacity-50" />
                    <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-neon-pink opacity-50" />
                    <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-neon-purple opacity-50" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-neon-cyan opacity-50" />
                  </div>
                </div>

                {/* Secondary accent frame */}
                <div className="absolute -inset-1 border border-neon-purple/30 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Side tech elements */}
              <motion.div
                className="absolute -left-8 top-1/2 transform -translate-y-1/2 text-neon-cyan text-opacity-50 text-xs font-mono space-y-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div>▮▯▯</div>
                <div>SCAN</div>
                <div>▮▯▯</div>
              </motion.div>

              <motion.div
                className="absolute -right-8 top-1/2 transform -translate-y-1/2 text-neon-pink text-opacity-50 text-xs font-mono space-y-2"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <div>▯▯▮</div>
                <div>LIVE</div>
                <div>▯▯▮</div>
              </motion.div>
            </div>

            {/* Bottom info plate */}
            <motion.div
              className="mt-6 glass border border-neon-cyan/30 rounded-lg p-4 text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <p className="text-neon-cyan font-mono text-sm mb-1">▮ SYSTEM ONLINE ▮</p>
              <p className="text-gray-400 font-mono text-xs">Creative Technologist v4.0</p>
            </motion.div>
          </motion.div>

          {/* Bio Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-black mb-3 neon-cyan-enhanced">IAN MORRISON</h3>
              <p className="text-gray-300 leading-relaxed">
                Known as <span className="text-neon-pink font-semibold">Ian Credible</span> in the audio world, now operating as <span className="text-neon-cyan font-semibold">IAMIAN</span>—a convergence of decades of hands-on technical expertise, artistic mastery, and relentless problem-solving.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-neon-purple">Core Competencies</h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: '💻', label: 'Enterprise Systems', color: 'text-neon-cyan' },
                  { icon: '🎵', label: 'Audio Engineering', color: 'text-neon-pink' },
                  { icon: '⚙️', label: 'Hardware Expertise', color: 'text-neon-purple' },
                  { icon: '🎬', label: 'Cinematography', color: 'text-neon-cyan' },
                  { icon: '🔧', label: 'System Restoration', color: 'text-neon-pink' },
                  { icon: '🧠', label: 'Full-Stack Thinking', color: 'text-neon-purple' },
                ].map((skill, idx) => (
                  <motion.div
                    key={idx}
                    className={`glass border border-neon-cyan/20 rounded-lg p-3 text-center hover:border-neon-cyan/60 transition-colors ${skill.color}`}
                    whileHover={{ scale: 1.05, borderColor: 'rgb(0, 217, 255)' }}
                  >
                    <div className="text-xl mb-1">{skill.icon}</div>
                    <p className="text-xs font-semibold">{skill.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="space-y-3 pt-6 border-t border-neon-cyan/20">
              <p className="text-sm text-gray-400">
                <span className="text-neon-cyan font-mono">▮</span> 40 years of continuous learning
              </p>
              <p className="text-sm text-gray-400">
                <span className="text-neon-pink font-mono">▮</span> Mentored by industry legends
              </p>
              <p className="text-sm text-gray-400">
                <span className="text-neon-purple font-mono">▮</span> Obsessed with precision and quality
              </p>
            </div>

            <motion.button
              className="w-full mt-8 py-3 rounded-lg font-bold bg-gradient-to-r from-neon-cyan to-neon-purple text-dark-bg shadow-lg hover:shadow-xl transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                const element = document.getElementById('global')
                element?.scrollIntoView({ behavior: 'smooth' })
              }}
            >
              LET&apos;S CONNECT →
            </motion.button>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes scan {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 0;
          }
        }
      `}</style>
    </section>
  )
}
