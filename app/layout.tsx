import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Folkgoods',
  description: 'Curated vintage and resale goods, hand-picked and ready for a new home.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
