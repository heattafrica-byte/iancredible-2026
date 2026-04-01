import { NextRequest, NextResponse } from 'next/server'

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    console.log('Testing Firestore access...')
    
    // Use Admin SDK (server-side)
    const admin = require('firebase-admin')
    const path = require('path')
    const fs = require('fs')
    
    // Check if already initialized
    if (admin.apps.length === 0) {
      const keyPath = path.join(process.cwd(), 'service-account-key.json')
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'))
      
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: 'iancredible-website'
      })
    }
    
    const db = admin.firestore()
    
    // Read all users
    const usersSnapshot = await db.collection('users').get()
    const users = usersSnapshot.docs.map((doc: any) => ({
      id: doc.id,
      displayName: doc.data().displayName,
      email: doc.data().email,
      role: doc.data().role
    }))
    
    // Read all tracks
    const tracksSnapshot = await db.collection('tracks').get()
    
    // Read all  submissions
    const submissionsSnapshot = await db.collection('submissions').get()
    
    return NextResponse.json({
      status: 'success',
      message: 'Firestore connection working',
      data: {
        users: {
          count: usersSnapshot.docs.length,
          items: users
        },
        tracks: {
          count: tracksSnapshot.docs.length
        },
        submissions: {
          count: submissionsSnapshot.docs.length
        }
      }
    })
  } catch (error: any) {
    console.error('Error:', error)
    return NextResponse.json({
      status: 'error',
      error: error.message,
      code: error.code,
      stack: error.stack
    }, { status: 500 })
  }
}
