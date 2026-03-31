'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { useCanPerform } from '@/lib/permissions'
import { createSubmission } from '@/lib/firestore-utils'

import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

const submissionSchema = z.object({
  trackTitle: z.string().min(1, 'Track title is required'),
  genre: z.string().min(1, 'Genre is required'),
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  coverArt: z.string().optional(),
  twitter: z.string().optional(),
  instagram: z.string().optional(),
})

type SubmissionFormData = z.infer<typeof submissionSchema>

export default function SubmitTrackPage() {
  const router = useRouter()
  const { user } = useAuth()
  const canSubmit = useCanPerform('create:submission')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>()
  const [coverFile, setCoverFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Sign In Required</h2>
          <p className="text-gray-400 mb-6">You must be logged in to submit a track</p>
          <a
            href="/auth/login"
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Sign In
          </a>
        </div>
      </div>
    )
  }

  if (!canSubmit) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Submission Not Available</h2>
          <p className="text-gray-400 mb-6">You don't have permission to submit tracks</p>
        </div>
      </div>
    )
  }

  const onSubmit = async (data: SubmissionFormData) => {
    setError('')
    setLoading(true)

    try {
      // Validate audio file exists
      if (!audioFile) {
        setError('Audio file is required')
        setLoading(false)
        return
      }

      // Upload audio file
      let audioUrl = ''
      if (audioFile) {
        const audioRef = ref(storage, `submissions/${user.uid}/${audioFile.name}`)
        await uploadBytes(audioRef, audioFile)
        audioUrl = await getDownloadURL(audioRef)
      }

      // Upload cover art if provided
      let coverArtUrl = ''
      if (coverFile) {
        const coverRef = ref(storage, `submissions/${user.uid}/cover-${coverFile.name}`)
        await uploadBytes(coverRef, coverFile)
        coverArtUrl = await getDownloadURL(coverRef)
      }

      // Create submission
      const submission = await createSubmission({
        artistId: user.uid,
        artistName: user.displayName || 'Unknown Artist',
        artistEmail: user.email,
        trackTitle: data.trackTitle,
        genre: data.genre,
        audioUrl,
        coverArtUrl,
        bio: data.bio,
        socialLinks: {
          twitter: data.twitter,
          instagram: data.instagram,
        },
        status: 'pending',
        paymentStatus: 'pending',
        feedback: undefined,
      })

      // Initialize Paystack payment (R100 submission fee)
      const paymentResult = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          email: user.email,
          amount: 100, // R100 in ZAR
          type: 'submission',
          relatedId: submission.id,
        }),
      }).then((res) => res.json())

      if (!paymentResult.authorizationUrl) {
        throw new Error('Failed to initialize payment')
      }

      // Redirect to Paystack checkout
      window.location.href = paymentResult.authorizationUrl
    } catch (err: any) {
      setError(err.message || 'Failed to submit track')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Submit Your Track</h1>
          <p className="text-gray-400">
            Share your music with our audience. Submission fee: R100.00 ZAR
          </p>
        </div>

        {/* Form */}
        <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-8 backdrop-blur-sm">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Track Title */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Track Title</label>
              <input
                {...register('trackTitle')}
                type="text"
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                placeholder="My Amazing Track"
              />
              {errors.trackTitle && (
                <p className="text-red-400 text-sm mt-1">{errors.trackTitle.message}</p>
              )}
            </div>

            {/* Genre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
              <select
                {...register('genre')}
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="">Select a genre</option>
                <option value="Electronic">Electronic</option>
                <option value="Hip-Hop">Hip-Hop</option>
                <option value="Ambient">Ambient</option>
                <option value="House">House</option>
                <option value="Techno">Techno</option>
                <option value="Other">Other</option>
              </select>
              {errors.genre && (
                <p className="text-red-400 text-sm mt-1">{errors.genre.message}</p>
              )}
            </div>

            {/* Audio File */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Audio File</label>
              <input
                type="file"
                accept="audio/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setAudioFile(file)
                  }
                }}
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-cyan-500 file:text-white focus:outline-none focus:border-cyan-500 transition"
                required
              />
              {audioFile && <p className="text-cyan-400 text-sm mt-2">✓ {audioFile.name}</p>}
            </div>

            {/* Cover Art */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Cover Art (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setCoverFile(file)
                  }
                }}
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-cyan-500 file:text-white focus:outline-none focus:border-cyan-500 transition"
              />
              {coverFile && <p className="text-cyan-400 text-sm mt-2">✓ {coverFile.name}</p>}
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tell us about yourself
              </label>
              <textarea
                {...register('bio')}
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition resize-none"
                rows={4}
                placeholder="Who are you and what's your music about?"
              />
              {errors.bio && (
                <p className="text-red-400 text-sm mt-1">{errors.bio.message}</p>
              )}
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Twitter (Optional)
                </label>
                <input
                  {...register('twitter')}
                  type="text"
                  className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                  placeholder="@yourhandle"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Instagram (Optional)
                </label>
                <input
                  {...register('instagram')}
                  type="text"
                  className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                  placeholder="@yourhandle"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !audioFile}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition mt-8"
            >
              {loading ? 'Processing...' : 'Submit Track & Pay R100 (Paystack)'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
