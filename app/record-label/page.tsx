'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPublishedTracks, Track } from '@/lib/firestore-utils'
import { motion } from 'framer-motion'
import NEOAmpPlayer from '@/app/components/NEOAmpPlayer'

interface NEOAmpTrack {
  id: string
  title: string
  artist: string
  album: string
  url: string
  duration: number
  coverUrl?: string
}

export default function RecordLabelPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string | null>(null)
  const [selectedTrack, setSelectedTrack] = useState<NEOAmpTrack | null>(null)
  const [showPlayer, setShowPlayer] = useState(false)

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const data = await getPublishedTracks(50)
        setTracks(data)
      } catch (error) {
        console.error('Error fetching tracks:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTracks()
  }, [])

  const filteredTracks = filter ? tracks.filter((t) => t.genre === filter) : tracks
  const genres = Array.from(new Set(tracks.map((t) => t.genre)))

  // Convert Firestore tracks to NEO AMP format
  const neoAmpTracks: NEOAmpTrack[] = filteredTracks.map((track) => ({
    id: track.id,
    title: track.title,
    artist: track.artistName || 'Unknown Artist',
    album: track.description || 'Track',
    url: track.audioUrl || '',
    duration: 0,
    coverUrl: track.coverArt,
  }))

  const handlePlayTrack = (track: Track) => {
    const neoTrack: NEOAmpTrack = {
      id: track.id,
      title: track.title,
      artist: track.artistName || 'Unknown Artist',
      album: track.albumName || 'Unknown Album',
      url: track.audioUrl || '',
      duration: track.duration || 0,
      coverUrl: track.coverArt,
    }
    setSelectedTrack(neoTrack)
    setShowPlayer(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black">
      {/* Credible Records Header */}
      <div className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-cyan-500/30 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24">
              <img
                src="/images/IAMIAN%20Logo.png"
                alt="Credible Records Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-white mb-2">CREDIBLE RECORDS</h1>
              <p className="text-gray-300 text-lg">Discover amazing tracks from talented artists</p>
            </div>
          </div>

          {/* Integrated NEO AMP Player */}
          {showPlayer && selectedTrack && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 p-4 bg-dark-surface/50 rounded-lg border border-neon-cyan/30"
            >
              <button
                onClick={() => setShowPlayer(false)}
                className="text-neon-cyan text-sm mb-3 hover:text-neon-purple transition"
              >
                ✕ Close Player
              </button>
              <NEOAmpPlayer tracks={selectedTrack ? [selectedTrack] : []} variant="compact" />
            </motion.div>
          )}
        </div>
      </div>

      {/* Beatport Showcase Section */}
      <section className="max-w-6xl mx-auto px-4 py-12 border-b border-cyan-500/20">
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-8">
          <div className="flex items-center justify-between flex-wrap gap-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Listen on Beatport</h2>
              <p className="text-gray-300 mb-4">
                Explore our full catalog of tracks available on Beatport. Stream, download, and support our artists.
              </p>
              <a
                href="https://www.beatport.com/label/credible-records/37027"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-lg transition"
              >
                Visit on Beatport →
              </a>
            </div>
            <div className="text-6xl">🎵</div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter(null)}
            className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
              filter === null
                ? 'bg-cyan-500 text-white'
                : 'bg-dark-bg border border-cyan-500/30 text-gray-300 hover:border-cyan-500'
            }`}
          >
            All Genres
          </button>
          {genres.map((genre) => (
            <button
              key={genre}
              onClick={() => setFilter(genre)}
              className={`px-4 py-2 rounded-full font-medium whitespace-nowrap transition ${
                filter === genre
                  ? 'bg-cyan-500 text-white'
                  : 'bg-dark-bg border border-cyan-500/30 text-gray-300 hover:border-cyan-500'
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {/* Tracks Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-400">Loading tracks...</p>
          </div>
        ) : filteredTracks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No tracks found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg overflow-hidden hover:border-cyan-500/50 transition group cursor-pointer h-full flex flex-col">
                  {/* Cover Art */}
                  <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-purple-500/20 relative overflow-hidden">
                    {track.coverArt ? (
                      <img
                        src={track.coverArt}
                        alt={track.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl mb-2">♪</div>
                          <p className="text-gray-500">No cover art</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition" />
                  </div>

                  {/* Track Info */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <Link href={`/record-label/${track.id}`}>
                      <h3 className="text-white font-bold truncate group-hover:text-cyan-400 transition">
                        {track.title}
                      </h3>
                      <p className="text-gray-400 text-sm truncate">{track.artistName}</p>
                    </Link>
                    <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                      <span className="bg-cyan-500/20 px-2 py-1 rounded">{track.genre}</span>
                      <span>♪ {track.stats.plays}</span>
                    </div>

                    {/* Play Button */}
                    {track.audioUrl && (
                      <button
                        onClick={() => handlePlayTrack(track)}
                        className="mt-4 w-full py-2 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-bold rounded-lg transition flex items-center justify-center gap-2"
                      >
                        <span>▶</span>
                        <span>Play in NEO-AMP</span>
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 mt-8">
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Want to Submit Your Music?</h2>
          <p className="text-gray-300 mb-6">
            Join our community of artists and get your music heard by thousands
          </p>
          <Link
            href="/submit/track"
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg transition"
          >
            Submit Your Track
          </Link>
        </div>
      </div>
    </div>
  )
}
