'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import DecodedSection from '@/app/components/sections/DecodedSection'
import Navigation from '@/app/components/Navigation'

export default function DecodedPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg overflow-hidden">
      <Navigation currentPath="decoded" onNavigate={() => {}} />
      
      {/* Decoded Section */}
      <DecodedSection id="decoded" />

      {/* Navigation to Next Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-dark-surface to-dark-bg">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            <Link
              href="/hardware"
              className="px-6 py-3 rounded-lg border border-neon-cyan/30 text-neon-cyan hover:bg-neon-cyan/10 transition-all"
            >
              ← Back: Hardware
            </Link>
            
            <Link
              href="/community"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-neon-purple to-neon-pink text-white hover:shadow-lg transition-all"
            >
              Next: Community →
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
