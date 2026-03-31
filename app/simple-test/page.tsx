'use client'

import { useEffect, useState } from 'react'

export default function SimpleFirestoreTest() {
  const [result, setResult] = useState<string>('Loading...')

  useEffect(() => {
    // Test Firebase SDK initialization on client
    async function test() {
      try {
        // Dynamically import firebase to test if it loads
        const { db } = await import('@/lib/firebase')
        const { collection, getDocs } = await import('firebase/firestore')
        
        console.log('Firebase SDK loaded successfully')
        console.log('DB instance:', db)
        
        // Try to read users collection
        const usersRef = collection(db, 'users')
        console.log('Collection reference created:', usersRef)
        
        const snapshot = await getDocs(usersRef)
        console.log('Snapshot:', snapshot)
        
        setResult(`✅ Success! Found ${snapshot.docs.length} users`)
      } catch (err: any) {
        console.error('Full error object:', err)
        setResult(`❌ Error: ${err.message}\nCode: ${err.code}`)
      }
    }
    
    test()
  }, [])

  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
      {result}
    </div>
  )
}
