'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getPublishedTracks, Track, updateTrack, deleteDoc, doc, addDoc, collection } from '@/lib/firestore-utils'
import { db } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import Link from 'next/link'
import { Upload, X, Music } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TracksManagement() {
  const router = useRouter()
  const { user } = useAuth()
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showUploadForm, setShowUploadForm] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [uploadSuccess, setUploadSuccess] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    artistName: '',
    albumName: '',
    genre: '',
    description: '',
    audioFile: null as File | null,
    coverFile: null as File | null,
  })

  useEffect(() => {
    if (user?.role !== 'admin') {
      router.push('/')
      return
    }

    fetchTracks()
  }, [user, router])

  const fetchTracks = async () => {
    try {
      const data = await getPublishedTracks(100)
      setTracks(data)
    } catch (error) {
      console.error('Error fetching tracks:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTracks = tracks.filter(
    (t) =>
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.artistName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async (trackId: string) => {
    if (confirm('Are you sure you want to delete this track?')) {
      try {
        const trackRef = doc(db, 'tracks', trackId)
        await deleteDoc(trackRef)
        setTracks(tracks.filter((t) => t.id !== trackId))
      } catch (error) {
        console.error('Error deleting track:', error)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'audioFile' | 'coverFile') => {
    const file = e.target.files?.[0]
    if (file) {
      if (fileType === 'audioFile' && !file.type.startsWith('audio/')) {
        setUploadError('Please select an audio file')
        return
      }
      if (fileType === 'coverFile' && !file.type.startsWith('image/')) {
        setUploadError('Please select an image file')
        return
      }
      setFormData(prev => ({ ...prev, [fileType]: file }))
      setUploadError('')
    }
  }

  const handleUploadTrack = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.audioFile || !formData.title || !formData.artistName) {
      setUploadError('Please fill in all required fields and select an audio file')
      return
    }

    setUploading(true)
    setUploadError('')
    setUploadSuccess('')

    try {
      // Upload audio file
      const audioFileName = `tracks/${Date.now()}-${formData.audioFile.name}`
      const audioRef = ref(storage, audioFileName)
      await uploadBytes(audioRef, formData.audioFile)
      const audioUrl = await getDownloadURL(audioRef)

      // Upload cover art if provided
      let coverUrl = ''
      if (formData.coverFile) {
        const coverFileName = `covers/${Date.now()}-${formData.coverFile.name}`
        const coverRef = ref(storage, coverFileName)
        await uploadBytes(coverRef, formData.coverFile)
        coverUrl = await getDownloadURL(coverRef)
      }

      // Create track document
      const trackData = {
        title: formData.title,
        artistName: formData.artistName,
        genre: formData.genre || 'Electronic',
        description: formData.description || formData.albumName || 'Single',
        audioUrl,
        coverArt: coverUrl,
        duration: 0, // Will be set by audio metadata
        stats: {
          plays: 0,
          downloads: 0,
          likes: 0,
        },
        releaseDate: new Date(),
        publishedAt: new Date(),
        isPublished: true,
      }

      const tracksCollection = collection(db, 'tracks')
      const docRef = await addDoc(tracksCollection, trackData)

      setUploadSuccess(`Track "${formData.title}" uploaded successfully!`)
      setFormData({
        title: '',
        artistName: '',
        albumName: '',
        genre: '',
        description: '',
        audioFile: null,
        coverFile: null,
      })

      // Reset form
      setTimeout(() => {
        setShowUploadForm(false)
        fetchTracks()
      }, 1500)
    } catch (error) {
      console.error('Error uploading track:', error)
      setUploadError(error instanceof Error ? error.message : 'Error uploading track')
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center">
        <p className="text-gray-400">Loading tracks...</p>
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white">Manage Tracks</h1>
              <p className="text-gray-400 mt-2">{tracks.length} total tracks</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="flex items-center gap-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition"
            >
              <Upload className="w-5 h-5" />
              Upload Track
            </motion.button>
          </div>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-dark-surface to-dark-bg border border-neon-cyan/30 rounded-lg p-8 mb-8"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Upload New Track</h2>
              <button
                onClick={() => setShowUploadForm(false)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleUploadTrack} className="space-y-6">
              {/* Error/Success Messages */}
              {uploadError && (
                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
                  {uploadError}
                </div>
              )}
              {uploadSuccess && (
                <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400">
                  {uploadSuccess}
                </div>
              )}

              {/* Form Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Track Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter track title"
                    className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    required
                  />
                </div>

                {/* Artist Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Artist Name *
                  </label>
                  <input
                    type="text"
                    name="artistName"
                    value={formData.artistName}
                    onChange={handleInputChange}
                    placeholder="Enter artist name"
                    className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                    required
                  />
                </div>

                {/* Album Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Album Name
                  </label>
                  <input
                    type="text"
                    name="albumName"
                    value={formData.albumName}
                    onChange={handleInputChange}
                    placeholder="Enter album name"
                    className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                {/* Genre */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Genre
                  </label>
                  <select
                    name="genre"
                    value={formData.genre}
                    onChange={handleInputChange}
                    className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                  >
                    <option value="">Select a genre</option>
                    <option value="Electronic">Electronic</option>
                    <option value="House">House</option>
                    <option value="Techno">Techno</option>
                    <option value="Ambient">Ambient</option>
                    <option value="Deep House">Deep House</option>
                    <option value="Progressive">Progressive</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter track description"
                  rows={3}
                  className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                />
              </div>

              {/* File Uploads */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Audio File */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Audio File * (MP3, WAV, FLAC)
                  </label>
                  <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-500 rounded-lg p-6 text-center cursor-pointer transition">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => handleFileChange(e, 'audioFile')}
                      className="hidden"
                      id="audioFile"
                      required
                    />
                    <label htmlFor="audioFile" className="cursor-pointer">
                      <Music className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                      <p className="text-gray-300">
                        {formData.audioFile ? formData.audioFile.name : 'Click to upload audio file'}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Cover Art */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cover Art (PNG, JPG)
                  </label>
                  <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-500 rounded-lg p-6 text-center cursor-pointer transition">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'coverFile')}
                      className="hidden"
                      id="coverFile"
                    />
                    <label htmlFor="coverFile" className="cursor-pointer">
                      {formData.coverFile ? (
                        <>
                          <img
                            src={URL.createObjectURL(formData.coverFile)}
                            alt="Cover preview"
                            className="w-12 h-12 mx-auto mb-2 rounded"
                          />
                          <p className="text-gray-300">{formData.coverFile.name}</p>
                        </>
                      ) : (
                        <>
                          <Music className="w-8 h-8 text-cyan-500 mx-auto mb-2" />
                          <p className="text-gray-300">Click to upload cover art</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={uploading}
                  className="flex items-center gap-2 bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-bold py-3 px-8 rounded-lg hover:shadow-lg disabled:opacity-50 transition flex-1"
                >
                  {uploading ? 'Uploading...' : 'Upload Track'}
                </motion.button>
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-8 py-3 border border-gray-500 text-gray-300 rounded-lg hover:border-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search tracks or artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        {/* Tracks Table */}
        <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-bg/50 border-b border-cyan-500/30">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Artist</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Genre</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Plays</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">
                    Released
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTracks.map((track) => (
                  <tr key={track.id} className="border-b border-cyan-500/10 hover:bg-dark-bg/80 transition">
                    <td className="px-6 py-4 text-white font-medium">{track.title}</td>
                    <td className="px-6 py-4 text-gray-400">{track.artistName}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{track.genre}</td>
                    <td className="px-6 py-4 text-gray-400">{track.stats.plays}</td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {track.releaseDate?.toDate().toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <Link
                        href={`/record-label/${track.id}`}
                        className="text-cyan-400 hover:text-cyan-300 transition"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(track.id)}
                        className="text-red-400 hover:text-red-300 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredTracks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">No tracks found</p>
          </div>
        )}
      </div>
    </div>
  )
}
