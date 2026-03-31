import { NextRequest, NextResponse } from 'next/server'
import app, { auth, db } from '@/lib/firebase'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'

// This is a health check endpoint for the API
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Record Label API is running',
    timestamp: new Date().toISOString(),
  })
}
