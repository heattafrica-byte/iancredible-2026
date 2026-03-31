import type { Metadata } from 'next'
import './globals.css'
import RootLayoutClient from './layout-client'

export const metadata: Metadata = {
  title: 'IANCREDIBLE | Creative Technologist',
  description: 'Interactive multimedia portfolio showcasing 40 years of innovation across software, audio production, and hardware engineering.',
  keywords: ['Creative Technologist', 'Portfolio', 'Audio Production', 'Hardware Engineering', 'Software Development'],
  authors: [{ name: 'Ian Morrison' }],
  creator: 'IANCREDIBLE',
  openGraph: {
    title: 'IANCREDIBLE | Creative Technologist',
    description: 'Interactive multimedia portfolio showcasing 40 years of innovation',
    type: 'website',
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
        <RootLayoutClient>
          {children}
        </RootLayoutClient>
      </body>
    </html>
  )
}
