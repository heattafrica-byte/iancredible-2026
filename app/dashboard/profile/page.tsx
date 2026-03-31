'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getUserProfile, updateUserProfile } from '@/lib/firestore-utils'
import { useForm } from 'react-hook-form'

interface ProfileForm {
  displayName: string
  bio: string
  twitter: string
  instagram: string
  spotify: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { user, refreshUser } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { register, handleSubmit, reset } = useForm<ProfileForm>()

  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
      return
    }

    const fetchProfile = async () => {
      try {
        const profile = await getUserProfile(user.uid)
        if (profile) {
          reset({
            displayName: profile.displayName,
            bio: profile.bio || '',
            twitter: profile.socialLinks?.twitter || '',
            instagram: profile.socialLinks?.instagram || '',
            spotify: profile.socialLinks?.spotify || '',
          })
        }
      } catch (err) {
        console.error('Error fetching profile:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, reset, router])

  const onSubmit = async (data: ProfileForm) => {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      if (user) {
        await updateUserProfile(user.uid, {
          displayName: data.displayName,
          bio: data.bio,
          socialLinks: {
            twitter: data.twitter,
            instagram: data.instagram,
            spotify: data.spotify,
          },
        })
        await refreshUser()
        setSuccess('Profile updated successfully!')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black py-12">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your profile information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-8 backdrop-blur-sm">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
              <input
                {...register('displayName')}
                type="text"
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bio</label>
              <textarea
                {...register('bio')}
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition resize-none"
                rows={4}
                placeholder="Tell us about yourself..."
              />
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Social Links</h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Twitter</label>
                <input
                  {...register('twitter')}
                  type="text"
                  className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                  placeholder="@yourhandle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Instagram</label>
                <input
                  {...register('instagram')}
                  type="text"
                  className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                  placeholder="@yourhandle"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Spotify</label>
                <input
                  {...register('spotify')}
                  type="text"
                  className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                  placeholder="Spotify/user/username"
                />
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg p-4">
              <p className="text-sm text-gray-400">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                <span className="font-medium">Role:</span> {user?.role}
              </p>
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={saving}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-bold py-3 rounded-lg transition"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
