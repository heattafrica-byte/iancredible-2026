'use client'

import { motion } from 'framer-motion'

export default function DecodedSection({ id }: { id?: string }) {
  const features = [
    {
      title: 'Automated Workflows',
      description: 'Let technology handle the small stuff. Stay focused on what matters.',
      icon: '⚙️',
      color: '#00d9ff',
    },
    {
      title: 'Anxiety Reduced',
      description: 'Mental clarity returns when the noise finally stops.',
      icon: '🧘',
      color: '#10b981',
    },
    {
      title: 'Confidence Rebuilt',
      description: 'Rediscover who you actually are beneath the overwhelm.',
      icon: '💪',
      color: '#f59e0b',
    },
    {
      title: 'Purpose Found',
      description: 'Clarity emerges. Direction becomes obvious. Life moves forward.',
      icon: '🎯',
      color: '#d946ef',
    },
  ]

  return (
    <section id={id} className="py-24 px-4 bg-gradient-to-b from-dark-bg to-dark-surface">
      <div className="max-w-6xl mx-auto">
        {/* Hero */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-block mb-6 px-4 py-2 bg-neon-cyan/10 border border-neon-cyan/30 rounded-full">
            <span className="text-neon-cyan font-semibold text-sm">NEW: Introducing</span>
          </div>
          <h2 className="text-6xl md:text-7xl font-black mb-6 neon-glow-enhanced">
            DECODED
          </h2>
          <p className="text-2xl text-gray-300 font-semibold mb-3">
            Life and technology simplified.
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Most people aren&apos;t stuck because they&apos;re broken. They&apos;re stuck because nobody ever showed them how simple it actually is.
          </p>
        </motion.div>

        {/* Founder Story */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
            {/* Founder Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-neon-cyan/50">
                <img
                  src="/images/street-art-portrait.png"
                  alt="Ian Morrison - The Translator"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/40 to-transparent" />
              </div>
            </motion.div>

            {/* Founder Story Text */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-dark-surface/50 border border-neon-cyan/20 rounded-xl p-8 backdrop-blur-sm"
            >
              <p className="text-neon-cyan font-bold text-sm uppercase mb-4 tracking-wider">The Translator</p>
              <p className="text-gray-300 leading-relaxed text-lg">
                I grew up with nothing. Twelve schools, the foster system, survival from age six. I decoded my own life from scratch — and now I decode it for others.
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Who It&apos;s For */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-black text-center mb-12 neon-glow">
            Who This Is For
          </h3>
          <div className="bg-dark-surface/50 border border-neon-cyan/20 rounded-xl p-8 md:p-12 max-w-3xl mx-auto backdrop-blur-sm">
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              Men and women, 35-50. People with talent. Experience. Depth. But emotionally stuck and digitally overwhelmed.
            </p>
            <p className="text-gray-400 italic">
              You have everything inside you. You&apos;ve just forgotten how to see it.
            </p>
          </div>
        </motion.div>

        {/* The 90-Day Promise */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-black text-center mb-12 neon-glow">
            The 90-Day Promise
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="glass weathered-border border border-neon-cyan/30 rounded-xl p-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div
                  className="w-12 h-12 rounded-lg bg-gradient-to-br from-neon-cyan/20 to-neon-blue/20 flex items-center justify-center mb-4"
                  style={{ borderColor: feature.color, borderWidth: '1px' }}
                >
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{feature.title}</h4>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* What You Get */}
        <motion.div
          className="mb-20"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl md:text-4xl font-black text-center mb-12 neon-glow">
            What It Delivers
          </h3>
          <p className="text-center text-gray-300 text-lg mb-12 max-w-3xl mx-auto">
            A hybrid coaching community that uses technology to automate the noise of daily life — freeing the mental space to rediscover identity, confidence, and purpose.
          </p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {[
              { title: 'Group Coaching Calls', desc: 'Live strategy and breakthrough sessions' },
              { title: 'Community Connection', desc: 'People who truly get it. Real support.' },
              { title: 'Structured Learning', desc: 'Everything you need to know. Nothing you don&apos;t.' },
              { title: 'Direct Access', desc: 'Message me. Real answers. No delays.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-6 border border-neon-cyan/20 rounded-lg hover:border-neon-cyan/50 transition-colors"
                whileHover={{ scale: 1.02 }}
              >
                <h4 className="font-bold text-neon-cyan mb-2">{item.title}</h4>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Pricing & CTA */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="bg-dark-surface/50 border border-neon-cyan/20 rounded-xl p-12 max-w-3xl mx-auto backdrop-blur-sm">
            <h3 className="text-2xl font-bold mb-6 text-white">Your Investment</h3>
            
            {/* First Package Breakdown */}
            <div className="mb-8 p-6 bg-dark-bg/50 rounded-lg border border-neon-cyan/10 text-left">
              <h4 className="text-neon-cyan font-bold mb-3">First Month Package Includes:</h4>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>✓ Intake assessment & personalized clarity session</li>
                <li>✓ 2 private coaching sessions (1-on-1)</li>
                <li>✓ Monthly group coaching call access</li>
                <li>✓ Digital community workspace setup</li>
                <li>✓ Baseline clarity framework & planning tools</li>
              </ul>
            </div>

            {/* Ongoing Package Breakdown */}
            <div className="mb-8 p-6 bg-dark-bg/50 rounded-lg border border-neon-cyan/10 text-left">
              <h4 className="text-neon-cyan font-bold mb-3">Months 2-3 & Beyond Includes:</h4>
              <ul className="text-gray-300 space-y-2 text-sm">
                <li>✓ Weekly group coaching calls</li>
                <li>✓ Monthly private session (optional upgrade available)</li>
                <li>✓ Unlimited community support access</li>
                <li>✓ Structured learning modules</li>
                <li>✓ Direct messaging access for urgent guidance</li>
              </ul>
            </div>

            {/* Pricing */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div className="p-6 bg-neon-cyan/10 rounded-lg border border-neon-cyan/30">
                <p className="text-sm text-gray-400 mb-2">Local (ZAR)</p>
                <p className="text-3xl font-black text-neon-cyan">R3,500 - R5,000</p>
                <p className="text-xs text-gray-500 mt-2">per month</p>
              </div>
              <div className="p-6 bg-neon-blue/10 rounded-lg border border-neon-blue/30">
                <p className="text-sm text-gray-400 mb-2">International</p>
                <p className="text-3xl font-black text-neon-blue">$3,000 - $5,000</p>
                <p className="text-xs text-gray-500 mt-2">founding membership</p>
              </div>
            </div>
            
            <motion.button
              className="w-full px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-bg font-bold rounded-lg shadow-neon hover:shadow-lg transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply for Decoded
            </motion.button>
            <p className="text-xs text-gray-500 mt-4">Limited founding member spots available</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
