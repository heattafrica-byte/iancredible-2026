// Firebase SDK imports
import { initializeApp } from 'firebase/app'
import { getAuth, Auth } from 'firebase/auth'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyCqoKll_rAcRWJrO0SJ5pH7LK3-Ay_Juc8",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "iancredible-website.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "iancredible-website",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "iancredible-website.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "796662323239",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:796662323239:web:4e7c185a08c0918f941602"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase Authentication and get a reference to the service
export const auth: Auth = getAuth(app)

// Initialize Cloud Firestore and get a reference to the service
export const db: Firestore = getFirestore(app)

// Initialize Cloud Storage and get a reference to the service
export const storage: FirebaseStorage = getStorage(app)

export default app
