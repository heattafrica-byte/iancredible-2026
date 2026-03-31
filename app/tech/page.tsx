'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import DieselFlowDemo from '@/app/components/sections/DieselGoDemo'
import Navigation from '@/app/components/Navigation'

export default function TechPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg overflow-hidden">
      <Navigation currentPath="tech" onNavigate={() => {}} />
      
      {/* Tech/Diesel Flow Section */}
      <DieselFlowDemo id="diesel" />

      {/* Navigation to Next Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-dark-surface to-dark-bg">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="px-6 py-3 rounded-lg border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-all"
            >
              ← Back to Home
            </Link>
            
            <Link
              href="/audio"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:shadow-lg transition-all"
            >
              Next: Audio Engineering →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
