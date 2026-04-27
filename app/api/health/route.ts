import { NextRequest, NextResponse } from 'next/server'

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic'

// This is a health check endpoint for the API
export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    message: 'Portfolio API is running',
    timestamp: new Date().toISOString(),
  })
}
