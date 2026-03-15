// lib/storage-utils.ts
// Firebase Cloud Storage Utilities

import { storage } from './firebase'
import {
  ref,
  listAll,
  getDownloadURL,
  uploadBytes,
  deleteObject,
} from 'firebase/storage'

/**
 * Get download URL for a file in Firebase Storage
 */
export async function getFileURL(path: string): Promise<string> {
  try {
    const fileRef = ref(storage, path)
    const url = await getDownloadURL(fileRef)
    return url
  } catch (error: any) {
    console.error(`Error getting download URL for ${path}:`, error.message)
    throw error
  }
}

/**
 * Get all files in a specific folder
 */
export async function listFiles(folderPath: string): Promise<string[]> {
  try {
    const folderRef = ref(storage, folderPath)
    const result = await listAll(folderRef)

    const urls: string[] = []
    for (const item of result.items) {
      const url = await getDownloadURL(item)
      urls.push(url)
    }

    return urls
  } catch (error: any) {
    console.error(`Error listing files in ${folderPath}:`, error.message)
    return []
  }
}

/**
 * Get media URLs for a specific section
 */
export async function getSectionMedia(
  sectionName: string,
  mediaType: 'images' | 'videos' | 'audio'
): Promise<string[]> {
  const folderPath = `${sectionName}/${mediaType}`
  return listFiles(folderPath)
}

/**
 * Get all images from a folder
 */
export async function getImages(folderPath: string = 'images'): Promise<string[]> {
  return listFiles(folderPath)
}

/**
 * Get all videos from a folder
 */
export async function getVideos(folderPath: string = 'videos'): Promise<string[]> {
  return listFiles(folderPath)
}

/**
 * Get all audio from a folder
 */
export async function getAudio(folderPath: string = 'audio'): Promise<string[]> {
  return listFiles(folderPath)
}

/**
 * Upload a file to Firebase Storage
 */
export async function uploadFile(
  file: File,
  path: string
): Promise<string> {
  try {
    const fileRef = ref(storage, path)
    await uploadBytes(fileRef, file)
    const url = await getDownloadURL(fileRef)
    console.log(`✓ File uploaded: ${path}`)
    return url
  } catch (error: any) {
    console.error(`Error uploading file to ${path}:`, error.message)
    throw error
  }
}

/**
 * Upload multiple files to Firebase Storage
 */
export async function uploadMultiple(
  files: File[],
  folderPath: string
): Promise<string[]> {
  try {
    const urls: string[] = []

    for (const file of files) {
      const path = `${folderPath}/${file.name}`
      const url = await uploadFile(file, path)
      urls.push(url)
    }

    console.log(`✓ ${files.length} files uploaded to ${folderPath}`)
    return urls
  } catch (error: any) {
    console.error(`Error uploading files:`, error.message)
    throw error
  }
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
    console.log(`✓ File deleted: ${path}`)
  } catch (error: any) {
    console.error(`Error deleting file at ${path}:`, error.message)
    throw error
  }
}

/**
 * Get cached media URLs with a time-to-live
 */
let mediaCache: Map<string, { urls: string[]; timestamp: number }> = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function getCachedMedia(
  folderPath: string
): Promise<string[]> {
  const now = Date.now()
  const cached = mediaCache.get(folderPath)

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.urls
  }

  const urls = await listFiles(folderPath)
  mediaCache.set(folderPath, { urls, timestamp: now })
  return urls
}

/**
 * Clear the media cache
 */
export function clearMediaCache(): void {
  mediaCache.clear()
}
