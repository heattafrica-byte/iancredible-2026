'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

const DieselFlowDemo = () => {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'demo', label: 'Live Demo', icon: '🎮' },
    { id: 'metrics', label: 'Metrics', icon: '📈' },
  ]

  const tabContent = {
    overview: (
      <div className="space-y-6 scrollable-md">
        <h3 className="text-2xl font-bold text-neon-cyan mb-4">Diesel Flow: Fuel Depot Management System</h3>
        <p className="text-gray-300 leading-relaxed">
          A production-ready enterprise portal for managing fuel depot operations. Built with tested architecture, rigorously reviewed code, and comprehensive documentation.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
            <p className="font-bold text-neon-cyan mb-2">Development Hours</p>
            <p className="text-2xl font-black text-neon-cyan">245</p>
            <p className="text-xs text-gray-400">Full cycle design to deployment</p>
          </div>
          <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
            <p className="font-bold text-green-400 mb-2">Testing Coverage</p>
            <p className="text-2xl font-black text-green-400">95%</p>
            <p className="text-xs text-gray-400">Rigorous QA process</p>
          </div>
          <div className="p-4 bg-blue-400/10 border border-blue-400/30 rounded-lg">
            <p className="font-bold text-blue-300 mb-2">Year 1 Revenue</p>
            <p className="text-2xl font-black text-blue-300">R1.1M</p>
            <p className="text-xs text-gray-400">Conservative estimate</p>
          </div>
        </div>
      </div>
    ),
    demo: (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-neon-cyan mb-4">Interactive Dashboard Preview</h3>
        <div className="bg-dark-surface/80 border border-neon-cyan/20 rounded-lg p-8 aspect-video flex items-center justify-center">
          <div className="text-center">
            <p className="text-5xl mb-4">🎮</p>
            <p className="text-gray-400 mb-2">Live dashboard simulation loading...</p>
            <p className="text-xs text-gray-500">
              This would be an interactive version of the Diesel Flow portal showing:
            </p>
            <ul className="text-left mt-4 text-sm text-gray-300 space-y-1 inline-block">
              <li>✓ Real-time fuel inventory tracking</li>
              <li>✓ Role-based access control</li>
              <li>✓ Automated discount application</li>
              <li>✓ Email notification system</li>
            </ul>
          </div>
        </div>
      </div>
    ),
    metrics: (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-neon-cyan mb-4">Quality Metrics</h3>
        <div className="space-y-4">
          {[
            { label: 'Code Quality', value: 98, color: '#00d9ff' },
            { label: 'Test Coverage', value: 95, color: '#10b981' },
            { label: 'Documentation', value: 100, color: '#f59e0b' },
            { label: 'Performance', value: 97, color: '#d946ef' },
          ].map((metric, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2">
                <span className="text-gray-300 font-semibold">{metric.label}</span>
                <span style={{ color: metric.color }} className="font-bold">
                  {metric.value}%
                </span>
              </div>
              <div className="w-full bg-dark-bg rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: metric.color }}
                  initial={{ width: 0 }}
                  whileInView={{ width: `${metric.value}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                  viewport={{ once: true }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  }

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-dark-bg to-dark-surface">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-4">
            <span className="neon-glow">DIESEL FLOW</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Enterprise Software Demonstration: The precision and reliability you can expect from my builds
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          className="flex gap-3 mb-8 justify-center flex-wrap"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-bg shadow-neon'
                  : 'glass border border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="glass weathered weathered-border scratches wet-reflection glitch-overlay shadow-neon-cyan border border-neon-cyan/20 rounded-xl p-8 md:p-12"
        >
          {tabContent[activeTab as keyof typeof tabContent]}
        </motion.div>

        {/* CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 mb-6">Ready to see this in action?</p>
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-bg font-bold rounded-lg shadow-neon hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Request Full Documentation
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default DieselFlowDemo
