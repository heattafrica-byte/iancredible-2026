import { useState, useEffect } from 'react'
import { Track } from '@/types/index'

/**
 * Hook for managing Spotify playback and track data
 * Requires NEXT_PUBLIC_SPOTIFY_CLIENT_ID to be set
 */
export const useSpotifyIntegration = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID
  const clientSecret = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET

  /**
   * Initialize Spotify API connection
   */
  const initializeSpotify = async () => {
    if (!clientId || !clientSecret) {
      setError('Spotify credentials not configured')
      return
    }

    try {
      setLoading(true)
      // Get access token
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `grant_type=client_credentials&client_id=${clientId}&client_secret=${clientSecret}`,
      })

      if (!response.ok) {
        throw new Error('Failed to authenticate with Spotify')
      }

      const data = await response.json()
      return data.access_token
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Spotify integration error')
      return null
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch playlist tracks from Spotify
   */
  const fetchPlaylistTracks = async (playlistId: string) => {
    const token = await initializeSpotify()
    if (!token) return

    try {
      setLoading(true)
      const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch playlist')
      }

      const data = await response.json()
      const formattedTracks: Track[] = data.items.map(
        (item: any): Track => ({
          id: item.track.id,
          title: item.track.name,
          artist: item.track.artists[0]?.name || 'Unknown',
          genre: 'hardstyle', // You would determine this based on playlist
          platform: 'spotify',
          url: item.track.external_urls.spotify,
          imageUrl: item.track.album?.images[0]?.url,
          duration: item.track.duration_ms,
        })
      )

      setTracks(formattedTracks)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching tracks')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Play a specific track
   */
  const playTrack = (track: Track) => {
    setCurrentTrack(track)
    setIsPlaying(true)
  }

  /**
   * Toggle playback
   */
  const togglePlayback = () => {
    setIsPlaying(!isPlaying)
  }

  return {
    isPlaying,
    currentTrack,
    tracks,
    loading,
    error,
    playTrack,
    togglePlayback,
    fetchPlaylistTracks,
  }
}
