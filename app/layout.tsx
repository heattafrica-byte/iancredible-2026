import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'IANCREDIBLE | Creative Technologist',
  description: 'Interactive portfolio: Diesel GO (Business), IAMIAN (Audio), Hardware Expertise',
  openGraph: {
    title: 'IANCREDIBLE | Creative Technologist',
    description: 'Full-stack execution across code, sound, and hardware',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-dark-bg">
        <div className="matrix-bg" />
        {children}
      </body>
    </html>
  )
}
