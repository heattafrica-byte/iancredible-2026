import { NextRequest, NextResponse } from 'next/server';

// Mark as dynamic to prevent static generation
export const dynamic = 'force-dynamic'

const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;
const RECAPTCHA_VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      );
    }

    if (!RECAPTCHA_SECRET_KEY) {
      console.error('RECAPTCHA_SECRET_KEY is not set');
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA not configured' },
        { status: 500 }
      );
    }

    // Verify the token with Google
    const response = await fetch(RECAPTCHA_VERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${RECAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA verification failed', score: data.score },
        { status: 200 }
      );
    }

    // Check if score is above threshold (0.5 is a reasonable threshold)
    const threshold = 0.5;
    if (data.score < threshold) {
      return NextResponse.json(
        { success: false, message: 'reCAPTCHA score too low', score: data.score },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, score: data.score },
      { status: 200 }
    );
  } catch (error) {
    console.error('reCAPTCHA verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
