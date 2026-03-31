'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { createUserProfile } from '@/lib/firestore-utils'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

declare global {
  interface Window {
    grecaptcha: any
  }
}

const signupSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

export default function SignupPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const recaptchaRef = useRef<string | null>(null)

  // Load reCAPTCHA script
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
      const script = document.createElement('script')
      script.src = 'https://www.google.com/recaptcha/api.js'
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }, [])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    setError('')
    setLoading(true)

    try {
      // Verify reCAPTCHA
      if (window.grecaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        recaptchaRef.current = window.grecaptcha.getResponse()
        if (!recaptchaRef.current) {
          setError('Please complete the reCAPTCHA verification')
          setLoading(false)
          return
        }
      }

      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      )

      console.log('Firebase user created:', userCredential.user.uid)

      // Wait a moment for auth token to be fully propagated before writing to Firestore
      // This ensures the security rules can verify the auth.uid
      await new Promise(resolve => setTimeout(resolve, 500))

      // Create user profile in Firestore
      try {
        await createUserProfile(userCredential.user.uid, {
          email: data.email,
          displayName: data.displayName,
          role: 'member',
        })
        console.log('User profile created in Firestore')
      } catch (firestoreErr: any) {
        console.error('Firestore write error:', firestoreErr)
        setError(`Firestore error: ${firestoreErr.message} - Your Firebase UID is: ${userCredential.user.uid}`)
        setLoading(false)
        return
      }

      router.push('/dashboard')
    } catch (err: any) {
      console.error('Auth error:', err)
      setError(err.message || 'Failed to create account')
    } finally {
      setLoading(false)
      // Reset reCAPTCHA
      if (window.grecaptcha) {
        window.grecaptcha.reset()
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg to-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-dark-bg/50 border border-cyan-500/30 rounded-lg p-8 backdrop-blur-sm">
          <h1 className="text-3xl font-bold text-white mb-2">Join IANCREDIBLE</h1>
          <p className="text-gray-400 mb-6">Create your account to get started</p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Display Name
              </label>
              <input
                {...register('displayName')}
                type="text"
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                placeholder="Your name"
              />
              {errors.displayName && (
                <p className="text-red-400 text-sm mt-1">{errors.displayName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                {...register('email')}
                type="email"
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                {...register('password')}
                type="password"
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <input
                {...register('confirmPassword')}
                type="password"
                className="w-full bg-dark-bg border border-cyan-500/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-cyan-500 transition"
                placeholder="••••••••"
              />
              {errors.confirmPassword && (
                <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* reCAPTCHA Widget */}
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <div className="flex justify-center my-4">
                <div
                  className="g-recaptcha"
                  data-sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 text-white font-bold py-2 rounded-lg transition mt-6"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-gray-400 text-sm mt-6 text-center">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
