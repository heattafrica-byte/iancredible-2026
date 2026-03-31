'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getPublishedTracks, Track } from '@/lib/firestore-utils'
import { motion } from 'framer-motion'
import NEOAmpPlayer from '@/app/components/NEOAmpPlayer'
import Navigation from '@/app/components/Navigation'
import { X, Home, Music, Share2 } from 'lucide-react'

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
  const [selectedIndex, setSelectedIndex] = useState<number>(0)
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

  const handlePlayTrack = (index: number) => {
    setSelectedIndex(index)
    setShowPlayer(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg">
      <Navigation currentPath="record-label" onNavigate={() => {}} />

      {/* Full Screen Player Modal */}
      {showPlayer && neoAmpTracks.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col"
        >
          {/* Close Button */}
          <div className="absolute top-4 right-4 z-10 flex gap-4">
            <button
              onClick={() => setShowPlayer(false)}
              className="p-3 hover:bg-cyan-600/30 rounded-lg border border-cyan-500/50 transition"
            >
              <X size={24} className="text-cyan-400" />
            </button>
          </div>

          {/* Player Container */}
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-4xl">
              <NEOAmpPlayer
                tracks={neoAmpTracks.slice(selectedIndex)}
                onTrackChange={(idx) => setSelectedIndex(selectedIndex + idx)}
                variant="full"
              />
            </div>
          </div>

          {/* Bottom Navigation */}
          <div className="border-t border-cyan-500/30 bg-black/50 p-4 flex items-center justify-between">
            <Link href="/" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition">
              <Home size={20} />
              <span>Back to Home</span>
            </Link>
            <div className="text-gray-400 text-sm">
              Playing: {selectedIndex + 1} / {neoAmpTracks.length} tracks
            </div>
            <Link href="/audio" className="text-cyan-400 hover:text-cyan-300 flex items-center gap-2 transition">
              <Music size={20} />
              <span>NEO-AMP Demo</span>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <main className="relative">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-cyan-500/15 to-purple-500/15 border-b border-cyan-500/30 py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-8 mb-8">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0"
              >
                <img
                  src="/images/IAMIAN%20Logo.png"
                  alt="Credible Records"
                  className="w-full h-full object-contain"
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
              >
                <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  CREDIBLE RECORDS
                </h1>
                <p className="text-gray-300 text-lg md:text-xl mb-4">
                  Curated electronic & dance music from emerging artists
                </p>
                <div className="flex gap-4 flex-wrap">
                  <a
                    href="https://www.beatport.com/label/credible-records/37027"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition inline-flex items-center gap-2"
                  >
                    <Music size={18} />
                    Listen on Beatport
                  </a>
                  <button
                    onClick={() => setFilter(null)}
                    className="bg-cyan-600/30 hover:bg-cyan-600/50 text-cyan-300 font-bold py-2 px-6 rounded-lg transition border border-cyan-500/50 inline-flex items-center gap-2"
                  >
                    <Share2 size={18} />
                    Share
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex gap-3 mb-12 overflow-x-auto pb-3 scrollbar-hide">
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setFilter(null)}
              className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition border ${
                filter === null
                  ? 'bg-cyan-600 text-white border-cyan-400'
                  : 'bg-dark-bg border-cyan-500/30 text-gray-300 hover:border-cyan-500'
              }`}
            >
              All Genres ({tracks.length})
            </motion.button>
            {genres.map((genre) => {
              const count = tracks.filter((t) => t.genre === genre).length;
              return (
                <motion.button
                  key={genre}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setFilter(genre)}
                  className={`px-5 py-2 rounded-full font-semibold whitespace-nowrap transition border ${
                    filter === genre
                      ? 'bg-cyan-600 text-white border-cyan-400'
                      : 'bg-dark-bg border-cyan-500/30 text-gray-300 hover:border-cyan-500'
                  }`}
                >
                  {genre} ({count})
                </motion.button>
              );
            })}
          </div>

          {/* Tracks Grid */}
          {loading ? (
            <div className="text-center py-20">
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} className="inline-block">
                <Music size={48} className="text-cyan-400 mb-4" />
              </motion.div>
              <p className="text-gray-400 text-lg">Loading tracks...</p>
            </div>
          ) : filteredTracks.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg mb-4">No tracks found in this category</p>
              <button
                onClick={() => setFilter(null)}
                className="text-cyan-400 hover:text-cyan-300 transition"
              >
                View all tracks →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {filteredTracks.map((track, index) => (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="bg-gradient-to-br from-dark-surface to-dark-bg border border-cyan-500/20 rounded-lg overflow-hidden hover:border-cyan-500/50 transition group h-full flex flex-col shadow-lg">
                    {/* Cover Art */}
                    <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-purple-500/20 relative overflow-hidden">
                      {track.coverArt ? (
                        <img
                          src={track.coverArt}
                          alt={track.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-dark-bg">
                          <div className="text-center">
                            <Music size={48} className="text-cyan-500/50 mx-auto mb-2" />
                            <p className="text-gray-500 text-sm">No cover</p>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition" />
                    </div>

                    {/* Track Info */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1 line-clamp-2 group-hover:text-cyan-400 transition">
                          {track.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">{track.artistName}</p>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="bg-cyan-500/20 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full">
                            {track.genre}
                          </span>
                          <span className="text-gray-500 text-xs">♪ {track.stats.plays} plays</span>
                        </div>

                        {/* Play Button */}
                        {track.audioUrl && (
                          <button
                            onClick={() => handlePlayTrack(filteredTracks.indexOf(track))}
                            className="w-full py-2 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-lg transition flex items-center justify-center gap-2 shadow-lg"
                          >
                            <span>▶</span>
                            <span>Play</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* CTA Section */}
        <section className="border-t border-cyan-500/30 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
          <div className="max-w-6xl mx-auto px-4 py-16">
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Want to Release Your Music?
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
                Submit your tracks to Credible Records and reach thousands of listeners worldwide. 
                We&apos;re always looking for fresh electronic and dance music.
              </p>
              <Link
                href="/submit/track"
                className="inline-block bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold py-3 px-10 rounded-lg transition shadow-lg hover:shadow-xl"
              >
                Submit Your Track
              </Link>
            </div>
          </div>
        </section>

        {/* Footer Navigation */}
        <footer className="border-t border-cyan-500/30 bg-dark-bg/50 py-8 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between flex-wrap gap-6">
            <div className="text-gray-400 text-sm">
              © 2026 Credible Records. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/" className="text-gray-400 hover:text-cyan-400 transition">
                Home
              </Link>
              <Link href="/audio" className="text-gray-400 hover:text-cyan-400 transition">
                NEO-AMP Demo
              </Link>
              <Link href="/submit/track" className="text-gray-400 hover:text-cyan-400 transition">
                Submit
              </Link>
              <a
                href="https://www.beatport.com/label/credible-records/37027"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-cyan-400 transition"
              >
                Beatport
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
