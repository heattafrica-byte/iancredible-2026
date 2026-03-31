'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getAllSubmissions, TrackSubmission, updateSubmission, createTrack, getSubmission } from '@/lib/firestore-utils'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'

export default function SubmissionsManagement() {
  const router = useRouter()
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState<TrackSubmission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'pending' | 'all'>('pending')
  const [selectedSubmission, setSelectedSubmission] = useState<TrackSubmission | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    const fetchSubmissions = async () => {
      try {
        const allSubmissions = await getAllSubmissions(filter === 'pending' ? 'pending' : undefined)
        setSubmissions(allSubmissions)
      } catch (error) {
        console.error('Error fetching submissions:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSubmissions()
  }, [user, router, filter])

  const handleApprove = async (submissionId: string) => {
    setActionLoading(true)
    try {
      const submission = await getSubmission(submissionId)
      if (submission) {
        // Create track from submission
        await createTrack({
          title: submission.trackTitle,
          artistId: submission.artistId,
          artistName: submission.artistName,
          audioUrl: submission.audioUrl,
          coverArt: submission.coverArtUrl,
          description: submission.bio,
          genre: submission.genre,
          releaseDate: Timestamp.now(),
          status: 'published',
          stats: {
            plays: 0,
            downloads: 0,
            likes: 0,
          },
        })

        // Update submission status
        await updateSubmission(submissionId, {
          status: 'approved',
          reviewedAt: Timestamp.now(),
          reviewedBy: user?.uid,
        })

        setSubmissions(submissions.filter((s) => s.id !== submissionId))
        setSelectedSubmission(null)
      }
    } catch (error) {
      console.error('Error approving submission:', error)
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (submissionId: string) => {
    setActionLoading(true)
    try {
      await updateSubmission(submissionId, {
        status: 'rejected',
        feedback,
        reviewedAt: Timestamp.now(),
        reviewedBy: user?.uid,
      })

      setSubmissions(submissions.filter((s) => s.id !== submissionId))
      setSelectedSubmission(null)
      setFeedback('')
    } catch (error) {
      console.error('Error rejecting submission:', error)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center">
        <p className="text-gray-400">Loading submissions...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/admin/dashboard" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-bold text-white">Review Submissions</h1>
          <p className="text-gray-400 mt-2">{submissions.length} submissions to review</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Submissions List */}
          <div className="lg:col-span-2">
            <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg overflow-hidden">
              {submissions.map((submission) => (
                <div
                  key={submission.id}
                  onClick={() => setSelectedSubmission(submission)}
                  className={`border-b border-cyan-500/10 p-4 cursor-pointer transition hover:bg-dark-bg/80 ${
                    selectedSubmission?.id === submission.id ? 'bg-dark-bg/80 border-l-4 border-l-cyan-500' : ''
                  }`}
                >
                  <h3 className="text-white font-bold">{submission.trackTitle}</h3>
                  <p className="text-gray-400 text-sm">{submission.artistName}</p>
                  <p className="text-gray-500 text-xs mt-1">{submission.genre}</p>
                </div>
              ))}
            </div>

            {submissions.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <p>No submissions to review</p>
              </div>
            )}
          </div>

          {/* Submission Details */}
          {selectedSubmission && (
            <div className="lg:col-span-1">
              <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-6 sticky top-4">
                <h2 className="text-xl font-bold text-white mb-4">{selectedSubmission.trackTitle}</h2>

                <div className="space-y-3 mb-6 text-sm">
                  <div>
                    <p className="text-gray-400">Artist</p>
                    <p className="text-white">{selectedSubmission.artistName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Genre</p>
                    <p className="text-white">{selectedSubmission.genre}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white text-xs break-all">{selectedSubmission.artistEmail}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Bio</p>
                    <p className="text-white text-xs">{selectedSubmission.bio}</p>
                  </div>
                </div>

                {/* Preview Audio */}
                {selectedSubmission.audioUrl && (
                  <div className="mb-6">
                    <p className="text-gray-400 text-sm mb-2">Preview</p>
                    <audio
                      src={selectedSubmission.audioUrl}
                      controls
                      className="w-full"
                    />
                  </div>
                )}

                {/* Feedback */}
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Optional feedback for rejection..."
                  className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-cyan-500 transition resize-none mb-4"
                  rows={3}
                />

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => handleApprove(selectedSubmission.id)}
                    disabled={actionLoading}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white font-bold py-2 rounded-lg transition"
                  >
                    {actionLoading ? 'Processing...' : '✓ Approve'}
                  </button>
                  <button
                    onClick={() => handleReject(selectedSubmission.id)}
                    disabled={actionLoading}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:bg-gray-600 text-white font-bold py-2 rounded-lg transition"
                  >
                    {actionLoading ? 'Processing...' : '✗ Reject'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
