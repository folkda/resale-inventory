'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getPublicItems, type InventoryItem } from '@/lib/supabase'
import { Package, Search, Tag, Sparkles } from 'lucide-react'

export default function CatalogPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => {
    getPublicItems().then(setItems).catch(console.error).finally(() => setLoading(false))
  }, [])

  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.category).filter(Boolean) as string[])
    return Array.from(set).sort()
  }, [items])

  const filtered = items.filter(item => {
    if (category && item.category !== category) return false
    if (search && !item.title.toLowerCase().includes(search.toLowerCase()) &&
        !(item.description ?? '').toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <header className="bg-gradient-to-br from-ink via-ink to-brand-900 px-4 md:px-8 py-12 md:py-16">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-xs font-medium">
            <Sparkles size={14} />
            New finds added regularly
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 tracking-tight">
            Folkgoods
          </h1>
          <p className="text-ink-light text-sm md:text-base max-w-md mx-auto mb-5">
            One-of-a-kind vintage &amp; resale finds — browse what's currently available.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-ink text-sm font-medium hover:bg-white/90 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-10">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
            <input
              className="input pl-9"
              placeholder="Search items…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setCategory('')}
                className={`shrink-0 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  category === '' ? 'bg-ink text-white' : 'bg-white border border-surface-border text-ink-muted hover:border-ink-light'
                }`}
              >
                All
              </button>
              {categories.map(c => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`shrink-0 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    category === c ? 'bg-ink text-white' : 'bg-white border border-surface-border text-ink-muted hover:border-ink-light'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Count */}
        <p className="text-ink-muted text-sm mb-4">
          {loading ? 'Loading…' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
        </p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-xl bg-surface-border animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={32} className="mx-auto text-ink-light mb-3" />
            <p className="text-ink-muted text-sm">
              {items.length === 0 ? 'Nothing listed right now — check back soon.' : 'No items match your search.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {filtered.map(item => {
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

      <footer className="text-center py-8 text-ink-light text-xs">
        Interested in something?{' '}
        <Link href="/contact" className="text-brand-600 hover:underline font-medium">
          Contact us
        </Link>{' '}
        to arrange purchase.
      </footer>
    </div>
  )
}
