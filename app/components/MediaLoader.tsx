'use client'

import { useState, useEffect } from 'react'
import { getCachedMedia } from '@/lib/storage-utils'

interface MediaLoaderProps {
  folder: string
  fallbackUrl?: string
  alt: string
  className?: string
  as?: 'img' | 'video'
  loading?: 'eager' | 'lazy'
}

/**
 * Component that loads media from Firebase Storage with fallback to static assets
 */
export function MediaLoader({
  folder,
  fallbackUrl,
  alt,
  className = '',
  as = 'img',
  loading = 'lazy',
}: MediaLoaderProps) {
  const [mediaUrl, setMediaUrl] = useState<string | null>(fallbackUrl || null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Always try to load from Firebase Storage first, even if fallback exists
    const loadMedia = async () => {
      try {
        const urls = await getCachedMedia(folder)
        if (urls.length > 0) {
          setMediaUrl(urls[0]) // Use first file in the folder
          setError(null)
        } else if (!fallbackUrl) {
          setError(`No media found in ${folder}`)
        }
      } catch (err: any) {
        // If Firebase fails and no fallback, show error
        if (!fallbackUrl) {
          setError(`Firebase error: ${err.message}`)
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (fallbackUrl) {
      // If fallback provided, use it immediately and try Firebase in background
      setMediaUrl(fallbackUrl)
      setIsLoading(false)
      loadMedia().catch(() => {}) // Try to update from Firebase silently
    } else {
      // No fallback, must load from Firebase
      loadMedia()
    }
  }, [folder, fallbackUrl])

  if (!mediaUrl) {
    return (
      <div className={`bg-dark-surface/50 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">
          {error || 'Loading media...'}
        </span>
      </div>
    )
  }

  if (as === 'video') {
    return (
      <video
        src={mediaUrl}
        className={className}
        controls
        playsInline
      />
    )
  }

  return (
    <img
      src={mediaUrl}
      alt={alt}
      className={className}
      loading={loading}
    />
  )
}

/**
 * Hook to load multiple media items from a Firebase Storage folder
 */
export function useMediaFolder(folder: string) {
  const [urls, setUrls] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadMedia = async () => {
      try {
        const mediaUrls = await getCachedMedia(folder)
        setUrls(mediaUrls)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadMedia()
  }, [folder])

  return { urls, isLoading, error }
}

/**
 * Hook to load a single media item from Firebase Storage
 */
export function useMedia(path: string, fallback?: string) {
  const [url, setUrl] = useState<string | null>(fallback || null)
  const [isLoading, setIsLoading] = useState(!fallback)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (fallback) {
      setIsLoading(false)
      return
    }

    const loadMedia = async () => {
      try {
        const { getFileURL } = await import('@/lib/storage-utils')
        const fileUrl = await getFileURL(path)
        setUrl(fileUrl)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadMedia()
  }, [path, fallback])

  return { url, isLoading, error }
}
