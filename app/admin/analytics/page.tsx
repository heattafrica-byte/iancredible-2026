'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  getPublishedTracks,
  getAllUsers,
  getAllPayments,
  getAnnouncements,
} from '@/lib/firestore-utils'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function AnalyticsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalTracks: 0,
    totalPlays: 0,
    totalLikes: 0,
    averagePlays: 0,
    topTrack: null as any,
    genreBreakdown: {} as Record<string, number>,
    userGrowth: 0,
    revenueByType: {} as Record<string, number>,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    const fetchAnalytics = async () => {
      try {
        const [tracks, users, payments] = await Promise.all([
          getPublishedTracks(1000),
          getAllUsers(),
          getAllPayments(),
        ])

        const totalPlays = tracks.reduce((sum, t) => sum + t.stats.plays, 0)
        const totalLikes = tracks.reduce((sum, t) => sum + t.stats.likes, 0)

        // Genre breakdown
        const genreBreakdown: Record<string, number> = {}
        tracks.forEach((t) => {
          genreBreakdown[t.genre] = (genreBreakdown[t.genre] || 0) + 1
        })

        // Revenue by type
        const successPayments = payments.filter((p) => p.status === 'success')
        const revenueByType: Record<string, number> = {}
        successPayments.forEach((p) => {
          revenueByType[p.type] = (revenueByType[p.type] || 0) + p.amount
        })

        // Top track
        const topTrack = [...tracks].sort((a, b) => b.stats.plays - a.stats.plays)[0]

        // Luser growth (members only)
        const memberCount = users.filter((u) => u.role === 'member').length
        const artistCount = users.filter((u) => u.role === 'artist').length

        setStats({
          totalTracks: tracks.length,
          totalPlays,
          totalLikes,
          averagePlays: tracks.length > 0 ? Math.round(totalPlays / tracks.length) : 0,
          topTrack,
          genreBreakdown,
          userGrowth: memberCount,
          revenueByType,
        })
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center">
        <p className="text-gray-400">Loading analytics...</p>
      </div>
    )
  }

  const StatCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/50 transition"
    >
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-gray-500 text-xs mt-2">{subtitle}</p>}
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white">Analytics</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          <StatCard title="Total Tracks" value={stats.totalTracks} />
          <StatCard title="Total Plays" value={stats.totalPlays.toLocaleString()} />
          <StatCard title="Total Likes" value={stats.totalLikes.toLocaleString()} />
          <StatCard title="Avg Plays/Track" value={stats.averagePlays} />
        </div>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {/* Genre Breakdown */}
          <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Tracks by Genre</h2>
            <div className="space-y-3">
              {Object.entries(stats.genreBreakdown)
                .sort(([, a], [, b]) => b - a)
                .map(([genre, count]) => (
                  <div key={genre} className="flex items-center justify-between">
                    <span className="text-gray-300">{genre}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-dark-bg rounded-full h-2">
                        <div
                          className="bg-cyan-500 h-2 rounded-full"
                          style={{
                            width: `${(count / stats.totalTracks) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-gray-400 text-sm w-8">{count}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Revenue by Type */}
          <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Revenue by Type</h2>
            <div className="space-y-3">
              {Object.entries(stats.revenueByType).map(([type, amount]) => (
                <div key={type} className="flex items-center justify-between">
                  <span className="text-gray-300 capitalize">{type}</span>
                  <span className="text-cyan-400 font-bold">${amount.toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-cyan-500/20 pt-3 mt-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 font-semibold">Total Revenue</span>
                  <span className="text-cyan-400 font-bold text-lg">
                    ${Object.values(stats.revenueByType).reduce((a, b) => a + b, 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Track */}
        {stats.topTrack && (
          <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Top Track</h2>
            <div className="flex items-center gap-4">
              {stats.topTrack.coverArt && (
                <img
                  src={stats.topTrack.coverArt}
                  alt={stats.topTrack.title}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              )}
              <div>
                <h3 className="text-lg font-bold text-white">{stats.topTrack.title}</h3>
                <p className="text-gray-400">{stats.topTrack.artistName}</p>
                <p className="text-cyan-400 font-semibold mt-2">
                  {stats.topTrack.stats.plays.toLocaleString()} plays
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
