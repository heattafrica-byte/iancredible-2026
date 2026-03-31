'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getArtistSubmissions, getUserProfile, TrackSubmission } from '@/lib/firestore-utils'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState<TrackSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const fetchData = async () => {
      if (user.role === 'artist' || user.role === 'admin') {
        try {
          const userSubmissions = await getArtistSubmissions(user.uid)
          setSubmissions(userSubmissions)
        } catch (error) {
          console.error('Error fetching submissions:', error)
        }
      }
      setLoading(false)
    }

    fetchData()
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center">
        <p className="text-gray-400">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome, {user?.displayName}</h1>
          <p className="text-gray-400">Role: {user?.role}</p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Link href="/dashboard/profile">
            <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="text-4xl">👤</div>
                <div>
                  <h3 className="text-xl font-bold text-white">My Profile</h3>
                  <p className="text-gray-400 text-sm">Edit profile information</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/record-label">
            <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition cursor-pointer h-full">
              <div className="flex items-center gap-4">
                <div className="text-4xl">🎵</div>
                <div>
                  <h3 className="text-xl font-bold text-white">Record Label</h3>
                  <p className="text-gray-400 text-sm">Browse released tracks</p>
                </div>
              </div>
            </div>
          </Link>

          {(user?.role === 'artist' || user?.role === 'admin') && (
            <Link href="/submit/track">
              <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition cursor-pointer h-full">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">📤</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Submit Track</h3>
                    <p className="text-gray-400 text-sm">Upload your music</p>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {user?.role === 'admin' && (
            <Link href="/admin/dashboard">
              <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg p-6 hover:border-cyan-500/50 transition cursor-pointer h-full">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">⚙️</div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Admin Panel</h3>
                    <p className="text-gray-400 text-sm">Manage platform</p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* My Submissions */}
        {(user?.role === 'artist' || user?.role === 'admin') && submissions.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">My Submissions</h2>
            <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg overflow-hidden">
              {submissions.map((submission: any) => (
                <div
                  key={submission.id}
                  className="border-b border-cyan-500/10 p-4 hover:bg-dark-bg/80 transition"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-bold">{submission.trackTitle}</h3>
                      <p className="text-gray-400 text-sm">{submission.genre}</p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        submission.status === 'approved'
                          ? 'bg-green-500/20 text-green-300'
                          : submission.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-red-500/20 text-red-300'
                      }`}
                    >
                      {submission.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
