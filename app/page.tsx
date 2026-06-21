'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getPublicItems, type InventoryItem } from '@/lib/supabase'
import { Package, Tag, Sparkles, ArrowRight } from 'lucide-react'

export default function HomePage() {
  const [featured, setFeatured] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPublicItems()
      .then(items => setFeatured(items.slice(0, 4)))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <header className="bg-gradient-to-br from-ink via-ink to-brand-900 px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium">
            <Sparkles size={14} />
            Curated vintage &amp; resale finds
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Folkgoods
          </h1>
          <p className="text-ink-light text-base md:text-lg max-w-md mx-auto mb-8">
            One-of-a-kind vintage goods, hand-picked and ready for a new home.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white text-ink text-sm font-semibold hover:bg-white/90 transition-colors"
            >
              Shop the Collection
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white/10 text-white text-sm font-semibold hover:bg-white/20 transition-colors border border-white/20"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </header>

      {/* Featured items */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-ink tracking-tight">Recently Listed</h2>
          <Link href="/catalog" className="text-sm font-medium text-brand-600 hover:underline flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-surface-border animate-pulse" />
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={32} className="mx-auto text-ink-light mb-3" />
            <p className="text-ink-muted text-sm">Nothing listed right now — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5">
            {featured.map(item => {
              const photo = item.inventory_photos?.find(p => p.is_primary) ?? item.inventory_photos?.[0]
              return (
                <Link
                  key={item.id}
                  href={`/catalog/${item.id}`}
                  className="group rounded-xl overflow-hidden bg-white border border-surface-border hover:border-brand-300 hover:shadow-lg transition-all duration-200"
                >
                  <div className="aspect-square bg-surface-border overflow-hidden relative">
                    {photo?.url ? (
                      <img
                        src={photo.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={28} className="text-ink-light" />
                      </div>
                    )}
                    {item.asking_price && (
                      <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur px-2.5 py-1 rounded-lg shadow-sm">
                        <p className="font-mono font-bold text-ink text-sm">${item.asking_price.toFixed(2)}</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3.5">
                    <p className="font-medium text-ink text-sm truncate group-hover:text-brand-600 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-ink-light text-xs mt-1 flex items-center gap-1">
                      <Tag size={11} />
                      {item.category ?? 'Uncategorized'}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-ink-light text-xs border-t border-surface-border">
        Folkgoods —{' '}
        <Link href="/contact" className="text-brand-600 hover:underline font-medium">
          Contact us
        </Link>{' '}
        with any questions.
      </footer>
    </div>
  )
}
