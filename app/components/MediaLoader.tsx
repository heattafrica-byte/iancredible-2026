'use client'

import { useState, useEffect } from 'react'

interface MediaLoaderProps {
  folder: string
  fallbackUrl?: string
  alt: string
  className?: string
  as?: 'img' | 'video'
  loading?: 'eager' | 'lazy'
}

/**
 * Simplified MediaLoader - only uses static fallback URLs
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
  const [isLoading, setIsLoading] = useState(!fallbackUrl)

  useEffect(() => {
    setMediaUrl(fallbackUrl || null)
    setIsLoading(false)
  }, [fallbackUrl])

  if (!mediaUrl) {
    return (
      <div className={`bg-dark-surface/50 flex items-center justify-center ${className}`}>
        <span className="text-gray-500 text-sm">Media not available</span>
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
 * Hook - simplified to just return static URLs
 */
export function useMediaFolder(folder: string) {
  return { urls: [], isLoading: false, error: null }
}

/**
 * Hook - simplified to use only fallback
 */
export function useMedia(path: string, fallback?: string) {
  return { url: fallback || null, isLoading: false, error: null }
}
