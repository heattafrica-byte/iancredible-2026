import { getTrack, Track } from '@/lib/firestore-utils'
import Link from 'next/link'

export default async function TrackPage({ params }: { params: { trackId: string } }) {
  const track = await getTrack(params.trackId)

  if (!track) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Track not found</h2>
          <Link
            href="/record-label"
            className="inline-block bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            Back to Record Label
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link href="/record-label" className="text-cyan-400 hover:text-cyan-300 mb-8 inline-block">
          ← Back to Record Label
        </Link>

        {/* Header */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Cover Art */}
          <div>
            {track.coverArt ? (
              <img
                src={track.coverArt}
                alt={track.title}
                className="w-full aspect-square object-cover rounded-lg mb-4"
              />
            ) : (
              <div className="w-full aspect-square bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-lg flex items-center justify-center mb-4">
                <div className="text-6xl">♪</div>
              </div>
            )}
          </div>

          {/* Track Info */}
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold text-white mb-2">{track.title}</h1>
            <h2 className="text-2xl text-cyan-400 mb-6">
              <Link href={`/artist/${track.artistId}`} className="hover:text-cyan-300">
                {track.artistName}
              </Link>
            </h2>

            {/* Metadata */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2">
                <span className="bg-cyan-500/20 px-3 py-1 rounded-full text-sm text-cyan-300">
                  {track.genre}
                </span>
              </div>

              <p className="text-gray-300">
                Released {new Date(track.releaseDate.toDate()).toLocaleDateString()}
              </p>

              <div className="text-gray-400 space-y-1">
                <p>♪ Plays: {track.stats.plays.toLocaleString()}</p>
                <p>❤️ Likes: {track.stats.likes.toLocaleString()}</p>
                <p>⬇️ Downloads: {track.stats.downloads.toLocaleString()}</p>
              </div>
            </div>

            {/* Player */}
            <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-4 mb-6">
              <audio src={track.audioUrl} controls className="w-full" />
            </div>

            {/* Distribution Links */}
            {track.distributionLinks && Object.keys(track.distributionLinks).length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Listen On</h3>
                <div className="flex flex-wrap gap-3">
                  {track.distributionLinks.spotify && (
                    <a
                      href={track.distributionLinks.spotify}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Spotify
                    </a>
                  )}
                  {track.distributionLinks.appleMusic && (
                    <a
                      href={track.distributionLinks.appleMusic}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      Apple Music
                    </a>
                  )}
                  {track.distributionLinks.soundcloud && (
                    <a
                      href={track.distributionLinks.soundcloud}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition"
                    >
                      SoundCloud
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {track.description && (
          <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-white mb-4">About This Track</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{track.description}</p>
          </div>
        )}
      </div>
    </div>
  )
}
