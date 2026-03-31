'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export default function FirestoreTestPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    async function testFirestoreAccess() {
      try {
        setMessage('Attempting to read from Firestore...')
        
        const usersCol = collection(db, 'users')
        const snapshot = await getDocs(usersCol)
        
        setStatus('success')
        setMessage(`✅ Successfully read ${snapshot.docs.length} documents from Firestore!`)
        setData(snapshot.docs.map(d => ({ id: d.id, name: d.data().displayName })))
      } catch (error: any) {
        setStatus('error')
        setMessage(`❌ Error: ${error.message}`)
        setData({
          code: error.code,
          message: error.message,
          fullError: JSON.stringify(error, null, 2)
        })
        console.error('Full error:', error)
      }
    }

    testFirestoreAccess()
  }, [])

  return (
    <div className="min-h-screen bg-dark-bg text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Firestore Connectivity Test</h1>
        
        <div className={`p-6 rounded-lg border-2 mb-8 ${
          status === 'loading' ? 'border-yellow-500 bg-yellow-500/10' :
          status === 'success' ? 'border-green-500 bg-green-500/10' :
          'border-red-500 bg-red-500/10'
        }`}>
          <p className="text-xl font-semibold mb-4">{message}</p>
          
          {data && (
            <div className="bg-black/50 p-4 rounded text-sm font-mono overflow-auto max-h-96">
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="bg-gray-900 p-6 rounded-lg">
          <h2 className="text-xl font-bold mb-4">Debug Info:</h2>
          <ul className="space-y-2 text-sm">
            <li>Project ID: {process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}</li>
            <li>API Key: {process.env.NEXT_PUBLIC_FIREBASE_API_KEY?.slice(0, 20)}...</li>
            <li>Auth Domain: {process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
