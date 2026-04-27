'use client'

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="matrix-bg" />
      {children}
    </div>
  )
}
