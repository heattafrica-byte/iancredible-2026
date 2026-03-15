'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface FeedItem {
  id: string
  type: 'project' | 'music' | 'social' | 'update'
  title: string
  description: string
  timestamp: Date
  author: string
  likes: number
  comments: number
}

const FeedCard = ({ item, delay }: { item: FeedItem; delay: number }) => {
  const iconMap = {
    project: '💻',
    music: '🎵',
    social: '📱',
    update: '📢',
  }

  const colorMap = {
    project: 'border-neon-cyan/40',
    music: 'border-neon-pink/40',
    social: 'border-neon-purple/40',
    update: 'border-neon-blue/40',
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`glass border ${colorMap[item.type]} rounded-lg p-6 hover:bg-dark-surface/60 transition-all`}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{iconMap[item.type]}</span>
          <div>
            <h3 className="font-bold text-gray-200">{item.title}</h3>
            <p className="text-xs text-gray-500">{item.author}</p>
          </div>
        </div>
        <span className="text-xs text-gray-500">
          {item.timestamp.toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-gray-300 mb-4">{item.description}</p>

      <div className="flex gap-4 text-xs text-gray-500">
        <button className="hover:text-neon-cyan transition-colors">👍 {item.likes}</button>
        <button className="hover:text-neon-pink transition-colors">💬 {item.comments}</button>
        <button className="hover:text-neon-purple transition-colors">↗ Share</button>
      </div>
    </motion.div>
  )
}

export default function ContentFeed() {
  const [feedItems] = useState<FeedItem[]>([
    {
      id: '1',
      type: 'project',
      title: 'New Portfolio Site Launched',
      description: 'Completed the Matrix Hub interactive landing page with full neon cyberpunk aesthetic.',
      timestamp: new Date('2026-03-14'),
      author: 'IANCREDIBLE',
      likes: 42,
      comments: 8,
    },
    {
      id: '2',
      type: 'music',
      title: 'New Track: Industrial Assault',
      description: 'Raw Hardstyle production featuring heavy industrial elements and breakdowns.',
      timestamp: new Date('2026-03-10'),
      author: 'IAMIAN',
      likes: 156,
      comments: 23,
    },
    {
      id: '3',
      type: 'project',
      title: 'Diesel Flow Case Study Complete',
      description: 'Full documentation and business analysis for the fuel depot management system.',
      timestamp: new Date('2026-03-08'),
      author: 'IANCREDIBLE',
      likes: 89,
      comments: 15,
    },
    {
      id: '4',
      type: 'update',
      title: 'Hardware Expertise Expanded',
      description: 'Added drone maintenance and audio system engineering to expertise offerings.',
      timestamp: new Date('2026-03-05'),
      author: 'IANCREDIBLE',
      likes: 34,
      comments: 7,
    },
    {
      id: '5',
      type: 'music',
      title: 'New EP: Psych Wave Horizons',
      description: 'Psychedelic Goa Trance collection featuring cosmic soundscapes and meditative vibes.',
      timestamp: new Date('2026-03-01'),
      author: 'IAMIAN',
      likes: 203,
      comments: 41,
    },
    {
      id: '6',
      type: 'social',
      title: 'Behind the Scenes: PS5 Restoration',
      description: 'Time-lapse video of complete PS5 restoration with thermal management upgrade.',
      timestamp: new Date('2026-02-28'),
      author: 'IANCREDIBLE',
      likes: 127,
      comments: 31,
    },
  ])

  return (
    <section className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-black neon-glow mb-4">Content Feed</h2>
          <p className="text-gray-400">Latest updates from across the creative portfolio</p>
        </motion.div>

        {/* Feed Grid */}
        <motion.div className="space-y-6">
          {feedItems.map((item, i) => (
            <FeedCard key={item.id} item={item} delay={i * 0.1} />
          ))}
        </motion.div>

        {/* Load More */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <motion.button
            className="px-8 py-4 border-2 border-neon-cyan rounded-lg text-neon-cyan font-bold hover:bg-neon-cyan hover:text-dark-bg transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Updates
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}
