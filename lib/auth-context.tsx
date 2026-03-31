import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth, db } from './firebase'
import { doc, getDoc } from 'firebase/firestore'

export type UserRole = 'member' | 'artist' | 'admin'

export interface IUser extends FirebaseUser {
  role: UserRole
  email: string
  displayName: string | null
  photoURL: string | null
}

interface AuthContextType {
  user: IUser | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const DEFAULT_PROFILE_PHOTO_URL = '/images/street-art-portrait.png'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid)
      const userSnap = await getDoc(userRef)

      if (userSnap.exists()) {
        const userData = userSnap.data()
        const enrichedUser: IUser = {
          ...firebaseUser,
          role: userData.role || 'member',
          displayName: userData.displayName || firebaseUser.displayName,
          photoURL: DEFAULT_PROFILE_PHOTO_URL,
          email: userData.email || firebaseUser.email || '',
        }
        setUser(enrichedUser)
      } else {
        // User document doesn't exist, set as basic user
        const basicUser: IUser = {
          ...firebaseUser,
          role: 'member',
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        }
        setUser(basicUser)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await fetchUserData(firebaseUser)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const handleSignOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const refreshUser = async () => {
    if (auth.currentUser) {
      await fetchUserData(auth.currentUser)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut: handleSignOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
