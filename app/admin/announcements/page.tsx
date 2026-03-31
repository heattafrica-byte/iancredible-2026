'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
  Announcement,
} from '@/lib/firestore-utils'
import { Timestamp } from 'firebase/firestore'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

interface AnnouncementForm {
  title: string
  description: string
  coverImage: string
  trackId: string
  artistName: string
  releaseDate: string
  status: 'upcoming' | 'released'
}

export default function AnnouncementsManagement() {
  const router = useRouter()
  const { user } = useAuth()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { register, handleSubmit, reset, setValue } = useForm<AnnouncementForm>()

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    const fetchAnnouncements = async () => {
      try {
        const data = await getAnnouncements()
        setAnnouncements(data)
      } catch (error) {
        console.error('Error fetching announcements:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncements()
  }, [user, router])

  const onSubmit = async (data: AnnouncementForm) => {
    try {
      if (editingId) {
        await updateAnnouncement(editingId, {
          title: data.title,
          description: data.description,
          coverImage: data.coverImage,
          trackId: data.trackId || undefined,
          artistName: data.artistName,
          releaseDate: Timestamp.fromDate(new Date(data.releaseDate)),
          status: data.status,
        })
        setAnnouncements(
          announcements.map((a) =>
            a.id === editingId
              ? {
                  ...a,
                  title: data.title,
                  description: data.description,
                  coverImage: data.coverImage,
                  releaseDate: Timestamp.fromDate(new Date(data.releaseDate)),
                  status: data.status,
                }
              : a
          )
        )
      } else {
        const announcement = await createAnnouncement({
          title: data.title,
          description: data.description,
          coverImage: data.coverImage,
          trackId: data.trackId || undefined,
          artistName: data.artistName,
          releaseDate: Timestamp.fromDate(new Date(data.releaseDate)),
          status: data.status,
        })
        setAnnouncements([...announcements, announcement])
      }
      setIsCreating(false)
      setEditingId(null)
      reset()
    } catch (error) {
      console.error('Error saving announcement:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Delete this announcement?')) {
      try {
        await deleteAnnouncement(id)
        setAnnouncements(announcements.filter((a) => a.id !== id))
      } catch (error) {
        console.error('Error deleting announcement:', error)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin/dashboard" className="text-cyan-400 hover:text-cyan-300 mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-white">Announcements</h1>
          </div>
          <button
            onClick={() => {
              setIsCreating(!isCreating)
              setEditingId(null)
              reset()
            }}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            {isCreating ? 'Cancel' : '+ New Announcement'}
          </button>
        </div>

        {/* Create/Edit Form */}
        {isCreating && (
          <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-white mb-4">
              {editingId ? 'Edit Announcement' : 'Create New Announcement'}
            </h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <input
                {...register('title')}
                placeholder="Title"
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                required
              />
              <textarea
                {...register('description')}
                placeholder="Description"
                rows={3}
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition resize-none"
                required
              />
              <input
                {...register('artistName')}
                placeholder="Artist Name"
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                required
              />
              <input
                {...register('coverImage')}
                placeholder="Cover Image URL"
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
              />
              <input
                {...register('releaseDate')}
                type="datetime-local"
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                required
              />
              <select
                {...register('status')}
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
              >
                <option value="upcoming">Upcoming</option>
                <option value="released">Released</option>
              </select>
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 rounded-lg transition"
              >
                Save Announcement
              </button>
            </form>
          </div>
        )}

        {/* Announcements List */}
        <div className="grid gap-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white">{announcement.title}</h3>
                  <p className="text-gray-400 mt-1">{announcement.description}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                    <span>{announcement.artistName}</span>
                    <span>{new Date(announcement.releaseDate.toDate()).toLocaleDateString()}</span>
                    <span
                      className={`px-2 py-1 rounded ${
                        announcement.status === 'upcoming'
                          ? 'bg-yellow-500/20 text-yellow-300'
                          : 'bg-green-500/20 text-green-300'
                      }`}
                    >
                      {announcement.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingId(announcement.id)
                      setIsCreating(true)
                      setValue('title', announcement.title)
                      setValue('description', announcement.description)
                      setValue('artistName', announcement.artistName)
                      setValue('coverImage', announcement.coverImage || '')
                      setValue('releaseDate', announcement.releaseDate.toDate().toISOString().slice(0, 16))
                      setValue('status', announcement.status)
                    }}
                    className="text-cyan-400 hover:text-cyan-300 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="text-red-400 hover:text-red-300 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {announcements.length === 0 && !isCreating && (
          <div className="text-center py-12">
            <p className="text-gray-400">No announcements yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
