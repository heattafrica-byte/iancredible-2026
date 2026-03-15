'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface TechVisionaryProps {
  onBack: () => void
}

const TabCard = ({
  title,
  icon,
  isActive,
  onClick,
  delay,
}: {
  title: string
  icon: string
  isActive: boolean
  onClick: () => void
  delay: number
}) => (
  <motion.button
    onClick={onClick}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay }}
    className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
      isActive
        ? 'bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-bg shadow-neon'
        : 'glass border border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan/60'
    }`}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    <span>{icon}</span>
    <span className="hidden sm:inline">{title}</span>
  </motion.button>
)

const ContentSection = ({
  title,
  content,
}: {
  title: string
  content: React.ReactNode
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.5 }}
    className="glass border border-neon-cyan/30 rounded-xl p-8"
  >
    <h3 className="text-2xl font-bold neon-glow mb-6">{title}</h3>
    <div className="text-gray-300 space-y-4">{content}</div>
  </motion.div>
)

export default function TechVisionary({ onBack }: TechVisionaryProps) {
  const [activeTab, setActiveTab] = useState('overview')

  const tabs = [
    { id: 'overview', title: 'Overview', icon: '📊' },
    { id: 'tech', title: 'Tech Stack', icon: '⚡' },
    { id: 'metrics', title: 'Metrics', icon: '📈' },
    { id: 'deliverables', title: 'Deliverables', icon: '📦' },
    { id: 'business', title: 'Business', icon: '💼' },
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <ContentSection
            title="Diesel Flow - Fuel Depot Management System"
            content={
              <>
                <p className="text-lg">
                  A comprehensive enterprise solution for managing fuel depot operations, built
                  from the ground up with production-grade architecture.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-cyan/20">
                    <h4 className="text-neon-cyan font-bold mb-2">245 Development Hours</h4>
                    <p className="text-sm text-gray-400">
                      Complete design, development, testing, documentation, and deployment
                    </p>
                  </div>
                  <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-purple/20">
                    <h4 className="text-neon-pink font-bold mb-2">0 Critical Bugs</h4>
                    <p className="text-sm text-gray-400">
                      Full QA cycle with comprehensive bug audit report
                    </p>
                  </div>
                  <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-blue/20">
                    <h4 className="text-neon-blue font-bold mb-2">R1.1M Year 1 Revenue</h4>
                    <p className="text-sm text-gray-400">
                      Conservative projection based on regional market analysis
                    </p>
                  </div>
                  <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-cyan/20">
                    <h4 className="text-neon-cyan font-bold mb-2">Enterprise Ready</h4>
                    <p className="text-sm text-gray-400">
                      Scalable architecture supporting thousands of concurrent users
                    </p>
                  </div>
                </div>
              </>
            }
          />
        )

      case 'tech':
        return (
          <ContentSection
            title="Technology Stack"
            content={
              <>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-neon-cyan font-bold mb-2">Frontend</h4>
                    <p className="text-sm text-gray-300">React 18, TypeScript, Tailwind CSS, Framer Motion</p>
                  </div>
                  <div>
                    <h4 className="text-neon-pink font-bold mb-2">Backend</h4>
                    <p className="text-sm text-gray-300">Firebase (Realtime DB, Cloud Functions, Auth)</p>
                  </div>
                  <div>
                    <h4 className="text-neon-blue font-bold mb-2">Infrastructure</h4>
                    <p className="text-sm text-gray-300">Cloud deployment, Firebase Rules for access control</p>
                  </div>
                  <div>
                    <h4 className="text-neon-purple font-bold mb-2">Automation</h4>
                    <p className="text-sm text-gray-300">Email automation, Discount system, Auto-reporting</p>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-neon-cyan/10 border border-neon-cyan/30 rounded-lg">
                  <p className="text-sm text-neon-cyan">
                    ✓ Full documentation covering setup, deployment, and maintenance
                  </p>
                </div>
              </>
            }
          />
        )

      case 'metrics':
        return (
          <ContentSection
            title="Key Metrics & Achievements"
            content={
              <>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Code Quality</span>
                      <span className="text-neon-cyan font-bold">98%</span>
                    </div>
                    <div className="w-full bg-dark-surface rounded-full h-2">
                      <div className="bg-gradient-to-r from-neon-cyan to-neon-blue h-2 rounded-full w-[98%]"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Test Coverage</span>
                      <span className="text-neon-pink font-bold">95%</span>
                    </div>
                    <div className="w-full bg-dark-surface rounded-full h-2">
                      <div className="bg-gradient-to-r from-neon-pink to-neon-purple h-2 rounded-full w-[95%]"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Documentation</span>
                      <span className="text-neon-blue font-bold">100%</span>
                    </div>
                    <div className="w-full bg-dark-surface rounded-full h-2">
                      <div className="bg-gradient-to-r from-neon-blue to-neon-cyan h-2 rounded-full w-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>Performance</span>
                      <span className="text-neon-purple font-bold">97%</span>
                    </div>
                    <div className="w-full bg-dark-surface rounded-full h-2">
                      <div className="bg-gradient-to-r from-neon-purple to-neon-pink h-2 rounded-full w-[97%]"></div>
                    </div>
                  </div>
                </div>
              </>
            }
          />
        )

      case 'deliverables':
        return (
          <ContentSection
            title="Complete Deliverables"
            content={
              <>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    '✓ Fully functional dashboard',
                    '✓ Role-based access control',
                    '✓ Real-time data synchronization',
                    '✓ Automated email system',
                    '✓ Discount management',
                    '✓ Comprehensive documentation',
                    '✓ User & role manuals',
                    '✓ Firebase setup guides',
                    '✓ Automated email automations',
                    '✓ Bug audit report',
                    '✓ Marketing proposal',
                    '✓ Quick reference cards',
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm text-gray-300">
                      <span className="text-neon-cyan">{item.split(' ')[0]}</span>
                      <span>{item.slice(2)}</span>
                    </div>
                  ))}
                </div>
              </>
            }
          />
        )

      case 'business':
        return (
          <ContentSection
            title="Business Impact & Market Position"
            content={
              <>
                <div className="space-y-4">
                  <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-cyan/20">
                    <h4 className="text-neon-cyan font-bold mb-2">Market Focus</h4>
                    <p className="text-sm text-gray-400">
                      South African fuel depot operators (Ballito, Durban, Cape Town region)
                    </p>
                  </div>
                  <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-pink/20">
                    <h4 className="text-neon-pink font-bold mb-2">Revenue Model</h4>
                    <p className="text-sm text-gray-400">
                      SaaS subscription + implementation + customization fees
                    </p>
                  </div>
                  <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-purple/20">
                    <h4 className="text-neon-purple font-bold mb-2">Competitive Advantage</h4>
                    <p className="text-sm text-gray-400">
                      Local market knowledge + modern tech stack + rapid deployment
                    </p>
                  </div>
                  <div className="p-4 bg-dark-surface/50 rounded-lg border border-neon-blue/20">
                    <h4 className="text-neon-blue font-bold mb-2">Growth Potential</h4>
                    <p className="text-sm text-gray-400">
                      Scalable to regional & national expansion with existing architecture
                    </p>
                  </div>
                </div>
              </>
            }
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen pt-32 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.button
            onClick={onBack}
            className="text-neon-cyan hover:text-neon-blue transition-colors mb-4 flex items-center gap-2"
            whileHover={{ scale: 1.05, x: -5 }}
          >
            ← Back to Hub
          </motion.button>
          <h1 className="text-5xl md:text-6xl font-black neon-glow mb-4">TECH VISIONARY</h1>
          <p className="text-gray-400 text-lg">
            Diesel Flow: Enterprise fuel depot management system built for scale
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-3 mb-10 overflow-x-auto pb-4">
          {tabs.map((tab, i) => (
            <TabCard
              key={tab.id}
              title={tab.title}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              delay={i * 0.1}
            />
          ))}
        </div>

        {/* Content */}
        {renderContent()}

        {/* View Full Documentation CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="px-8 py-4 bg-gradient-to-r from-neon-cyan to-neon-blue text-dark-bg font-bold rounded-lg shadow-neon hover:shadow-lg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.open('https://your-domain.com/diesel-go-docs', '_blank')
            }}
          >
            ⚡ View Full Documentation
          </motion.button>
          <p className="text-gray-500 text-sm mt-4">
            Complete case study available on request
          </p>
        </motion.div>
      </div>
    </div>
  )
}
