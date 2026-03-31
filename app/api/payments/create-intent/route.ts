import { NextRequest, NextResponse } from 'next/server'
import { initializePayment } from '@/lib/stripe-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, amount, type, relatedId, metadata } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const result = await initializePayment({
      userId,
      email,
      amount,
      type,
      relatedId,
      metadata,
    })

    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Payment initialization error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

