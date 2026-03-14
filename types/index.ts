export interface Track {
  id: string
  title: string
  artist: string
  genre: 'hardstyle' | 'goa'
  platform: 'spotify' | 'youtube'
  url: string
  imageUrl?: string
  duration: number
}

export interface Playlist {
  id: string
  name: string
  description: string
  genre: 'hardstyle' | 'goa'
  tracks: Track[]
}

export interface Project {
  id: string
  title: string
  category: 'tech' | 'audio' | 'hardware'
  description: string
  image?: string
  specs: string[]
}

export interface DieselGOStats {
  developmentHours: number
  criticalBugs: number
  yearOneRevenue: string
  technologies: string[]
}
