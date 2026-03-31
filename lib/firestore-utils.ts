import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  Query,
  QueryConstraint,
  Timestamp,
  addDoc,
} from 'firebase/firestore'
import { db } from './firebase'

// Export Timestamp and helper functions
export { Timestamp, doc, deleteDoc, addDoc, collection }

// Type definitions
export interface UserProfile {
  uid: string
  email: string
  displayName: string
  role: 'member' | 'artist' | 'admin'
  avatar?: string
  bio?: string
  socialLinks?: {
    twitter?: string
    instagram?: string
    spotify?: string
  }
  subscriptionStatus: 'free' | 'premium'
  subscriptionId?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  onboardingComplete: boolean
  preferences: {
    notifications: boolean
    newsletter: boolean
  }
}

export interface Track {
  id: string
  title: string
  artistId: string
  artistName: string
  coverArt?: string
  audioUrl: string
  description: string
  genre: string
  releaseDate: Timestamp
  status: 'draft' | 'published' | 'archived'
  distributionLinks?: {
    spotify?: string
    appleMusic?: string
    soundcloud?: string
  }
  stats: {
    plays: number
    downloads: number
    likes: number
  }
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface TrackSubmission {
  id: string
  artistId: string
  artistName: string
  artistEmail: string
  trackTitle: string
  genre: string
  audioUrl: string
  coverArtUrl?: string
  bio: string
  socialLinks?: object
  status: 'pending' | 'approved' | 'rejected'
  feedback?: string
  submittedAt: Timestamp
  reviewedAt?: Timestamp
  reviewedBy?: string
  paymentStatus: 'pending' | 'paid' | 'free'
  paymentId?: string
}

export interface Payment {
  id: string
  userId: string
  stripePaymentId: string
  stripeCustomerId: string
  amount: number
  currency: string
  status: 'pending' | 'success' | 'failed'
  type: 'submission' | 'subscription' | 'other'
  relatedId?: string
  createdAt: Timestamp
  completedAt?: Timestamp
  metadata?: object
}

export interface Announcement {
  id: string
  title: string
  description: string
  coverImage?: string
  trackId?: string
  artistName: string
  releaseDate: Timestamp
  status: 'upcoming' | 'released'
  createdAt: Timestamp
  updatedAt: Timestamp
}

// User Profile Operations
export async function createUserProfile(userId: string, data: Partial<UserProfile>) {
  const userRef = doc(db, 'users', userId)
  
  // Build profile object, only including defined values
  const userProfile: any = {
    uid: userId,
    email: data.email || '',
    displayName: data.displayName || '',
    role: data.role || 'member',
    subscriptionStatus: 'free',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
    onboardingComplete: false,
    preferences: {
      notifications: true,
      newsletter: true,
    },
  }
  
  // Only add optional fields if they're defined
  if (data.avatar !== undefined) userProfile.avatar = data.avatar
  if (data.bio !== undefined) userProfile.bio = data.bio
  if (data.socialLinks !== undefined) userProfile.socialLinks = data.socialLinks
  
  await setDoc(userRef, userProfile as UserProfile)
  return userProfile as UserProfile
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const userRef = doc(db, 'users', userId)
  const userSnap = await getDoc(userRef)
  return userSnap.exists() ? (userSnap.data() as UserProfile) : null
}

export async function updateUserProfile(userId: string, data: Partial<UserProfile>) {
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function getAllUsers(role?: string): Promise<UserProfile[]> {
  const constraints: QueryConstraint[] = []
  if (role) {
    constraints.push(where('role', '==', role))
  }
  const q = query(collection(db, 'users'), ...constraints)
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as UserProfile)
}

// Track Operations
export async function createTrack(trackData: Omit<Track, 'id' | 'createdAt' | 'updatedAt'>) {
  const tracksRef = collection(db, 'tracks')
  const newTrackRef = doc(tracksRef)

  const track: Track = {
    id: newTrackRef.id,
    ...trackData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  await setDoc(newTrackRef, track)
  return track
}

export async function getTrack(trackId: string): Promise<Track | null> {
  const trackRef = doc(db, 'tracks', trackId)
  const trackSnap = await getDoc(trackRef)
  return trackSnap.exists() ? (trackSnap.data() as Track) : null
}

export async function updateTrack(trackId: string, data: Partial<Track>) {
  const trackRef = doc(db, 'tracks', trackId)
  await updateDoc(trackRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function getPublishedTracks(pageSize = 20, lastDoc?: any): Promise<Track[]> {
  const constraints: QueryConstraint[] = [
    where('status', '==', 'published'),
    orderBy('releaseDate', 'desc'),
    limit(pageSize),
  ]

  if (lastDoc) {
    constraints.push(startAfter(lastDoc))
  }

  const q = query(collection(db, 'tracks'), ...constraints)
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as Track)
}

export async function getArtistTracks(artistId: string): Promise<Track[]> {
  const q = query(
    collection(db, 'tracks'),
    where('artistId', '==', artistId),
    where('status', '==', 'published'),
    orderBy('releaseDate', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as Track)
}

// Submission Operations
export async function createSubmission(
  submissionData: Omit<TrackSubmission, 'id' | 'submittedAt'>
) {
  const submissionsRef = collection(db, 'submissions')
  const newSubmissionRef = doc(submissionsRef)

  const submission: TrackSubmission = {
    id: newSubmissionRef.id,
    ...submissionData,
    submittedAt: Timestamp.now(),
  }

  await setDoc(newSubmissionRef, submission)
  return submission
}

export async function getSubmission(submissionId: string): Promise<TrackSubmission | null> {
  const submissionRef = doc(db, 'submissions', submissionId)
  const submissionSnap = await getDoc(submissionRef)
  return submissionSnap.exists() ? (submissionSnap.data() as TrackSubmission) : null
}

export async function getAllSubmissions(status?: string): Promise<TrackSubmission[]> {
  const constraints: QueryConstraint[] = [orderBy('submittedAt', 'desc')]
  if (status) {
    constraints.unshift(where('status', '==', status))
  }
  const q = query(collection(db, 'submissions'), ...constraints)
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as TrackSubmission)
}

export async function getArtistSubmissions(artistId: string): Promise<TrackSubmission[]> {
  const q = query(
    collection(db, 'submissions'),
    where('artistId', '==', artistId),
    orderBy('submittedAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as TrackSubmission)
}

export async function updateSubmission(
  submissionId: string,
  data: Partial<TrackSubmission>
) {
  const submissionRef = doc(db, 'submissions', submissionId)
  await updateDoc(submissionRef, data)
}

// Payment Operations
export async function createPayment(paymentData: Omit<Payment, 'id' | 'createdAt'>) {
  const paymentsRef = collection(db, 'payments')
  const newPaymentRef = doc(paymentsRef)

  const payment: Payment = {
    id: newPaymentRef.id,
    ...paymentData,
    createdAt: Timestamp.now(),
  }

  await setDoc(newPaymentRef, payment)
  return payment
}

export async function getPayment(paymentId: string): Promise<Payment | null> {
  const paymentRef = doc(db, 'payments', paymentId)
  const paymentSnap = await getDoc(paymentRef)
  return paymentSnap.exists() ? (paymentSnap.data() as Payment) : null
}

export async function updatePayment(paymentId: string, data: Partial<Payment>) {
  const paymentRef = doc(db, 'payments', paymentId)
  await updateDoc(paymentRef, data)
}

export async function getUserPayments(userId: string): Promise<Payment[]> {
  const q = query(
    collection(db, 'payments'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  )
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as Payment)
}

export async function getAllPayments(): Promise<Payment[]> {
  const q = query(collection(db, 'payments'), orderBy('createdAt', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as Payment)
}

// Announcement Operations
export async function createAnnouncement(
  announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>
) {
  const announcementsRef = collection(db, 'announcements')
  const newAnnouncementRef = doc(announcementsRef)

  const announcement: Announcement = {
    id: newAnnouncementRef.id,
    ...announcementData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  await setDoc(newAnnouncementRef, announcement)
  return announcement
}

export async function getAnnouncements(): Promise<Announcement[]> {
  const q = query(collection(db, 'announcements'), orderBy('releaseDate', 'desc'))
  const querySnapshot = await getDocs(q)
  return querySnapshot.docs.map((doc) => doc.data() as Announcement)
}

export async function updateAnnouncement(announcementId: string, data: Partial<Announcement>) {
  const announcementRef = doc(db, 'announcements', announcementId)
  await updateDoc(announcementRef, {
    ...data,
    updatedAt: Timestamp.now(),
  })
}

export async function deleteAnnouncement(announcementId: string) {
  const announcementRef = doc(db, 'announcements', announcementId)
  await deleteDoc(announcementRef)
}
