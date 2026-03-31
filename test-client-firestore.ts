import { initializeApp } from 'firebase/app'
import { getFirestore, collection, getDocs } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

async function testClientAccess() {
  try {
    console.log('Testing Firestore client-side access from browser SDK...\n')
    
    const usersRef = collection(db, 'users')
    const snapshot = await getDocs(usersRef)
    
    console.log(`✅ Successfully read ${snapshot.docs.length} users from Firestore`)
    snapshot.docs.forEach(doc => {
      console.log(`   - ${doc.id}: ${doc.data().displayName}`)
    })
    
    return true
  } catch (error: any) {
    console.error('❌ Error accessing Firestore:', error.message)
    console.error('Code:', error.code)
    return false
  }
}

testClientAccess().then(success => {
  process.exit(success ? 0 : 1)
})
