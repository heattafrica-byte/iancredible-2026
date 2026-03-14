'use client'

import { motion } from 'framer-motion'

const GlobalMesh = () => {
  const platforms = [
    {
      name: 'Linktree',
      icon: '🔗',
      url: 'https://linktr.ee/iancredible',
      description: 'All my links in one place',
      color: '#10b981',
      status: 'Active',
    },
    {
      name: 'Kick',
      icon: '📡',
      url: 'https://kick.com/iancredible',
      description: 'Live streaming & community',
      color: '#00d9ff',
      status: 'Live',
    },
    {
      name: 'Instagram',
      icon: '📸',
      url: 'https://instagram.com/iancredible',
      description: 'Behind-the-scenes & updates',
      color: '#f59e0b',
      status: 'Active',
    },
    {
      name: 'Spotify',
      icon: '🎵',
      url: 'https://open.spotify.com/artist/iamian',
      description: 'Listen to IAMIAN tracks',
      color: '#00d9ff',
      status: 'Streaming',
    },
    {
      name: 'GitHub',
      icon: '🔧',
      url: 'https://github.com/iancredible',
      description: 'Code & open-source projects',
      color: '#d946ef',
      status: 'Active',
    },
    {
      name: 'YouTube',
      icon: '▶️',
      url: 'https://youtube.com/@iamian',
      description: 'Tutorials, showcases & vlogs',
      color: '#f59e0b',
      status: 'Active',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  }

  return (
    <section className="py-24 px-4 bg-dark-bg">
      <div className="max-w-6xl mx-auto">
        {/* Header with Visual Accent */}
        <motion.div
          className="text-center mb-16 relative"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Cyberpunk portrait accent */}
          <div className="absolute -top-32 -left-40 opacity-15 pointer-events-none hidden lg:block">
            <img
              src="/images/cyberpunk-neon-portrait.png"
              alt="Cyberpunk visual accent"
              className="w-80 h-80 object-cover rounded-full blur-lg"
              style={{
                filter: 'drop-shadow(0 0 40px rgba(0, 217, 255, 0.3))',
              }}
            />
          </div>

          <h2 className="text-5xl md:text-6xl font-black mb-6 neon-glow-enhanced">GLOBAL MESH</h2>
          <p className="text-lg text-gray-300 max-w-3xl mx-auto">
            I exist across many platforms. Follow, connect, and be part of the community wherever you feel most
            comfortable.
          </p>
        </motion.div>

        {/* Platform Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {platforms.map((platform) => (
            <motion.a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noreferrer"
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl transition-all"
              whileHover={{ y: -8 }}
            >
              {/* Animated background */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: `linear-gradient(135deg, ${platform.color}20 0%, ${platform.color}05 100%)`,
                }}
              />

              {/* Card Content */}
              <div
                className="relative p-8 rounded-xl glass border-2 transition-all duration-300"
                style={{
                  borderColor: `${platform.color}60`,
                }}
              >
                {/* Top Section */}
                <div className="flex items-start justify-between mb-4">
                  <motion.div
                    className="text-5xl"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    {platform.icon}
                  </motion.div>
                  <div
                    className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest"
                    style={{
                      background: `${platform.color}20`,
                      color: platform.color,
                      border: `1px solid ${platform.color}40`,
                    }}
                  >
                    {platform.status}
                  </div>
                </div>

                {/* Platform Name */}
                <h3 className="text-2xl font-black mb-2" style={{ color: platform.color }}>
                  {platform.name}
                </h3>

                {/* Description */}
                <p className="text-gray-400 text-sm mb-4">{platform.description}</p>

                {/* CTA */}
                <motion.div
                  className="flex items-center gap-2 text-sm font-bold"
                  style={{ color: platform.color }}
                  whileHover={{ x: 5 }}
                >
                  <span>Visit</span>
                  <span>→</span>
                </motion.div>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="grid md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          viewport={{ once: true }}
        >
          {[
            { label: 'Platforms', value: '6+' },
            { label: 'Active Projects', value: '10+' },
            { label: 'Community Members', value: 'Growing' },
            { label: 'Content Updated', value: 'Daily' },
          ].map((stat, i) => (
            <div key={i} className="text-center p-6 glass border border-neon-cyan/20 rounded-lg">
              <p className="text-3xl font-black neon-glow mb-2">{stat.value}</p>
              <p className="text-gray-400 text-sm">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Community Philosophy */}
        <motion.div
          className="glass border border-neon-cyan/30 rounded-2xl p-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-neon-cyan mb-4">A Living Ecosystem</h3>
          <p className="text-gray-300 leading-relaxed max-w-2xl mx-auto">
            This global mesh isn't just about broadcasting. It's about connection. Each platform represents a
            different facet of the creative journey—from technical deep-dives to real-time community building. I
            believe in meeting you where you are, and building together.
          </p>

          {/* Social Integration Stats */}
          <div className="mt-8 flex gap-4 justify-center flex-wrap">
            <div className="px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full text-neon-cyan text-sm font-semibold">
              Content Unified
            </div>
            <div className="px-4 py-2 bg-neon-pink/10 border border-neon-pink/30 rounded-full text-neon-pink text-sm font-semibold">
              Always Accessible
            </div>
            <div className="px-4 py-2 bg-neon-purple/10 border border-neon-purple/30 rounded-full text-neon-purple text-sm font-semibold">
              Growing Daily
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default GlobalMesh
