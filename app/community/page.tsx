'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import GratitudeGrid from '@/app/components/sections/GratitudeGrid'
import GlobalMesh from '@/app/components/sections/GlobalMesh'
import CosmicFlowSection from '@/app/components/CosmicFlowSection'
import Navigation from '@/app/components/Navigation'

export default function CommunityPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg overflow-hidden">
      <Navigation currentPath="community" onNavigate={() => {}} />
      
      {/* Community Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-dark-surface to-dark-bg">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-6xl md:text-7xl font-black mb-6 neon-glow">
            COMMUNITY
          </h1>
          <p className="text-2xl text-gray-300 font-semibold mb-4">
            Free and open meeting lobby for all who connect
          </p>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto">
            A space where creativity, collaboration, and connection thrive. Whether you're here to share, learn, or simply be part of something meaningful.
          </p>
        </div>
      </section>

      {/* Gratitude Grid Section */}
      <GratitudeGrid id="gratitude" />

      {/* Global Mesh Section */}
      <GlobalMesh id="global" />

      {/* Cosmic Flow Section */}
      <CosmicFlowSection />

      {/* Navigation to Next Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-dark-surface to-dark-bg">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <Link
              href="/decoded"
              className="px-6 py-3 rounded-lg border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-all"
            >
              ← Back: Coaching
            </Link>
            
            <Link
              href="/"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:shadow-lg transition-all"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
