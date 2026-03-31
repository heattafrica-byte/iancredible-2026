import { getArtistTracks, getUserProfile, Track, UserProfile } from '@/lib/firestore-utils'
import Link from 'next/link'

export default async function ArtistPage({ params }: { params: { artistId: string } }) {
  const artist = await getUserProfile(params.artistId)
  const tracks = await getArtistTracks(params.artistId)

  if (!artist) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Artist not found</h2>
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
      <div className="max-w-6xl mx-auto px-4">
        {/* Back Link */}
        <Link href="/record-label" className="text-cyan-400 hover:text-cyan-300 mb-8 inline-block">
          ← Back to Record Label
        </Link>

        {/* Artist Header */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-500/30 rounded-lg p-8 mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">{artist.displayName}</h1>
          {artist.bio && <p className="text-gray-300 mb-4">{artist.bio}</p>}

          {/* Social Links */}
          {artist.socialLinks && (
            <div className="flex gap-3 mt-4">
              {artist.socialLinks.twitter && (
                <a
                  href={`https://twitter.com/${artist.socialLinks.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 transition"
                >
                  Twitter
                </a>
              )}
              {artist.socialLinks.instagram && (
                <a
                  href={`https://instagram.com/${artist.socialLinks.instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-400 hover:text-pink-300 transition"
                >
                  Instagram
                </a>
              )}
              {artist.socialLinks.spotify && (
                <a
                  href={artist.socialLinks.spotify}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition"
                >
                  Spotify
                </a>
              )}
            </div>
          )}
        </div>

        {/* Tracks */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Tracks ({tracks.length})
          </h2>

          {tracks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400">No tracks released yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tracks.map((track) => (
                <Link
                  key={track.id}
                  href={`/record-label/${track.id}`}
                  className="group"
                >
                  <div className="bg-dark-bg/50 border border-cyan-500/20 rounded-lg overflow-hidden hover:border-cyan-500/50 transition h-full">
                    <div className="aspect-square bg-gradient-to-br from-cyan-500/20 to-purple-500/20 relative overflow-hidden">
                      {track.coverArt ? (
                        <img
                          src={track.coverArt}
                          alt={track.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-4xl">♪</div>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="text-white font-bold truncate group-hover:text-cyan-400 transition">
                        {track.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{track.genre}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
