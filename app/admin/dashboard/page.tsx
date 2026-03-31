'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getAllUsers, getAllSubmissions, getAllPayments, getPublishedTracks } from '@/lib/firestore-utils'
import { UserProfile, TrackSubmission, Payment, Track } from '@/lib/firestore-utils'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalArtists: 0,
    pendingSubmissions: 0,
    totalTracks: 0,
    totalRevenue: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    const fetchStats = async () => {
      try {
        const [users, submissions, payments, tracks] = await Promise.all([
          getAllUsers(),
          getAllSubmissions('pending'),
          getAllPayments(),
          getPublishedTracks(1000),
        ])

        const totalRevenue = payments
          .filter((p) => p.status === 'success')
          .reduce((sum, p) => sum + p.amount, 0)

        const artists = users.filter((u) => u.role === 'artist')

        setStats({
          totalUsers: users.length,
          totalArtists: artists.length,
          pendingSubmissions: submissions.length,
          totalTracks: tracks.length,
          totalRevenue,
        })
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    )
  }

  const StatCard = ({ title, value }: { title: string; value: string | number }) => (
    <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-6 hover:border-cyan-500/50 transition">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your record label platform</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
          <StatCard title="Total Users" value={stats.totalUsers} />
          <StatCard title="Artists" value={stats.totalArtists} />
          <StatCard title="Tracks Released" value={stats.totalTracks} />
          <StatCard title="Pending Reviews" value={stats.pendingSubmissions} />
          <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} />
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Users Management */}
          <Link href="/admin/users">
            <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="text-4xl">👥</div>
                <div>
                  <h3 className="text-xl font-bold text-white">User Management</h3>
                  <p className="text-gray-400 text-sm">Manage users and roles</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Submissions Review */}
          <Link href="/admin/submissions">
            <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="text-4xl">📝</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Review Submissions</h3>
                  <p className="text-gray-400 text-sm">{stats.pendingSubmissions} pending</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Tracks Management */}
          <Link href="/admin/tracks">
            <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎵</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Manage Tracks</h3>
                  <p className="text-gray-400 text-sm">{stats.totalTracks} published</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Payments & Revenue */}
          <Link href="/admin/payments">
            <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="text-4xl">💳</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Payments & Revenue</h3>
                  <p className="text-gray-400 text-sm">View transactions</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Announcements */}
          <Link href="/admin/announcements">
            <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="text-4xl">📢</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Announcements</h3>
                  <p className="text-gray-400 text-sm">Manage releases & news</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Analytics */}
          <Link href="/admin/analytics">
            <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="text-4xl">📊</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Analytics</h3>
                  <p className="text-gray-400 text-sm">View detailed reports</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
