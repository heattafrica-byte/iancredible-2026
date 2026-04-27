'use client'

import { useState } from 'react'
import { Sparkles, Play, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function RecordLabelPage() {
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null)

  // Static featured tracks for free tier
  const featuredTracks = [
    {
      id: '1',
      title: 'Digital Horizons',
      artist: 'IAMIAN (Sonic Architect)',
      genre: 'Electronic',
      duration: '4:32',
      image: '/images/track-1.jpg',
    },
    {
      id: '2',
      title: 'Hardware Resonance',
      artist: 'Diesel GO (Creative Technologist)',
      genre: 'Ambient',
      duration: '5:15',
      image: '/images/track-2.jpg',
    },
    {
      id: '3',
      title: 'Sonic Architecture',
      artist: 'IAMIAN',
      genre: 'Experimental',
      duration: '6:01',
      image: '/images/track-3.jpg',
    },
  ]

  const genres = ['Electronic', 'Ambient', 'Experimental', 'All']

  return (
    <main className="min-h-screen bg-dark-bg text-white overflow-hidden">
      {/* Header */}
      <div className="relative z-10 pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-6 text-cyan-400">
            <Sparkles className="w-5 h-5" />
            <span className="text-sm font-medium">Record Label</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Featured <span className="text-cyan-400">Compositions</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mb-8">
            A curated collection of sonic explorations spanning 40 years of creative evolution across electronic, ambient, and experimental soundscapes.
          </p>

          {/* Genre Filter */}
          <div className="flex gap-3 flex-wrap">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre === 'All' ? null : genre)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  (genre === 'All' ? selectedGenre === null : selectedGenre === genre)
                    ? 'bg-cyan-500 text-dark-bg'
                    : 'border border-gray-600 text-gray-300 hover:border-cyan-400'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="relative z-10 px-4 pb-24">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTracks.map((track) => (
            <div
              key={track.id}
              className="group bg-dark-surface border border-gray-800 rounded-lg overflow-hidden hover:border-cyan-400 transition-all hover:shadow-lg hover:shadow-cyan-400/20"
            >
              {/* Track Image */}
              <div className="relative w-full aspect-square bg-dark-bg overflow-hidden">
                <img
                  src={track.image}
                  alt={track.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition-colors">
                  <Play className="w-16 h-16 text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity fill-cyan-400" />
                </button>
              </div>

              {/* Track Info */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2 group-hover:text-cyan-400 transition-colors">
                  {track.title}
                </h3>
                <p className="text-sm text-gray-400 mb-1">{track.artist}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
                    {track.genre}
                  </span>
                  <span className="text-xs text-gray-500">{track.duration}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative z-10 px-4 py-24 border-t border-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Explore More</h2>
          <p className="text-gray-400 mb-8">
            Discover the complete discography and production journey
          </p>
          <Link
            href="/tech"
            className="inline-flex items-center gap-2 px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-dark-bg font-bold rounded-lg transition-colors"
          >
            Technical Details
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </main>
  )
}
