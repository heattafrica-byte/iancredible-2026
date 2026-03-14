// lib/firebase-utils.ts
// Firebase Utility Functions for the IANCREDIBLE Wappsite

import { auth, db } from './firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth'
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore'

// ============================================
// AUTHENTICATION
// ============================================

export async function registerUser(email: string, password: string) {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    console.log('✓ User registered:', userCredential.user.uid)
    return userCredential.user
  } catch (error: any) {
    console.error('✗ Registration error:', error.message)
    throw error
  }
}

export async function loginUser(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    console.log('✓ User logged in:', userCredential.user.uid)
    return userCredential.user
  } catch (error: any) {
    console.error('✗ Login error:', error.message)
    throw error
  }
}

export async function logoutUser() {
  try {
    await signOut(auth)
    console.log('✓ User logged out')
  } catch (error: any) {
    console.error('✗ Logout error:', error.message)
    throw error
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser
}

// ============================================
// CONTACT FORM / COLLABORATION REQUESTS
// ============================================

export interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
  type: 'collaboration' | 'inquiry' | 'feedback' | 'hiring'
}

export async function submitContactForm(data: ContactFormData) {
  try {
    const docRef = await addDoc(collection(db, 'contact_submissions'), {
      ...data,
      timestamp: Timestamp.now(),
      status: 'new',
      read: false,
    })
    console.log('✓ Contact form submitted:', docRef.id)
    return { success: true, id: docRef.id }
  } catch (error: any) {
    console.error('✗ Contact form error:', error.message)
    throw error
  }
}

// ============================================
// NEWSLETTER SIGNUP
// ============================================

export interface NewsletterSignup {
  email: string
  name?: string
  interests?: string[]
}

export async function subscribeNewsletter(data: NewsletterSignup) {
  try {
    const docRef = await addDoc(collection(db, 'newsletter_subscribers'), {
      ...data,
      subscribedAt: Timestamp.now(),
      active: true,
    })
    console.log('✓ Newsletter signup:', docRef.id)
    return { success: true, id: docRef.id }
  } catch (error: any) {
    console.error('✗ Newsletter signup error:', error.message)
    throw error
  }
}

// ============================================
// PORTFOLIO / PROJECT SHOWCASE
// ============================================

export interface ProjectData {
  title: string
  description: string
  category: 'tech' | 'audio' | 'hardware' | 'other'
  imageUrl?: string
  links?: {
    github?: string
    demo?: string
    case_study?: string
  }
  featured: boolean
}

export async function addProject(data: ProjectData) {
  try {
    const docRef = await addDoc(collection(db, 'projects'), {
      ...data,
      createdAt: Timestamp.now(),
      views: 0,
    })
    console.log('✓ Project added:', docRef.id)
    return { success: true, id: docRef.id }
  } catch (error: any) {
    console.error('✗ Project error:', error.message)
    throw error
  }
}

export async function getFeaturedProjects() {
  try {
    const q = query(collection(db, 'projects'), where('featured', '==', true))
    const querySnapshot = await getDocs(q)
    const projects: any[] = []
    querySnapshot.forEach((doc) => {
      projects.push({ id: doc.id, ...doc.data() })
    })
    return projects
  } catch (error: any) {
    console.error('✗ Error fetching projects:', error.message)
    throw error
  }
}

// ============================================
// TESTIMONIALS / RECOMMENDATIONS
// ============================================

export interface Testimonial {
  author: string
  role: string
  company?: string
  content: string
  imageUrl?: string
  rating: number
}

export async function addTestimonial(data: Testimonial) {
  try {
    const docRef = await addDoc(collection(db, 'testimonials'), {
      ...data,
      submittedAt: Timestamp.now(),
      approved: false,
    })
    console.log('✓ Testimonial submitted:', docRef.id)
    return { success: true, id: docRef.id }
  } catch (error: any) {
    console.error('✗ Testimonial error:', error.message)
    throw error
  }
}

export async function getApprovedTestimonials() {
  try {
    const q = query(collection(db, 'testimonials'), where('approved', '==', true))
    const querySnapshot = await getDocs(q)
    const testimonials: any[] = []
    querySnapshot.forEach((doc) => {
      testimonials.push({ id: doc.id, ...doc.data() })
    })
    return testimonials
  } catch (error: any) {
    console.error('✗ Error fetching testimonials:', error.message)
    throw error
  }
}

// ============================================
// ANALYTICS / EVENTS
// ============================================

export interface AnalyticsEvent {
  event_name: string
  user_id?: string
  properties?: Record<string, any>
}

export async function logEvent(data: AnalyticsEvent) {
  try {
    await addDoc(collection(db, 'events'), {
      ...data,
      timestamp: Timestamp.now(),
    })
  } catch (error: any) {
    console.error('✗ Analytics error:', error.message)
  }
}

// Export all utilities for convenience
const firebaseUtils = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  submitContactForm,
  subscribeNewsletter,
  addProject,
  getFeaturedProjects,
  addTestimonial,
  getApprovedTestimonials,
  logEvent,
}

export default firebaseUtils
