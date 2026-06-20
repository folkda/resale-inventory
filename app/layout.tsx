import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Resale Inventory',
  description: 'Track your resale inventory across eBay, Etsy, and local shops',
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
