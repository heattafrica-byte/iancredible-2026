'use client'

import { AuthProvider } from '@/lib/auth-context'
import { ReCaptchaProvider } from '@/lib/recaptcha-provider'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ReCaptchaProvider>
      <AuthProvider>
        <div className="matrix-bg" />
        {children}
      </AuthProvider>
    </ReCaptchaProvider>
  )
}
