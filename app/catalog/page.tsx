import { getPublicItems } from '@/lib/supabase'
import Link from 'next/link'
import { Package, Tag } from 'lucide-react'

export const revalidate = 0

export default async function CatalogPage() {
  const items = await getPublicItems()

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-ink px-4 md:px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
            <Tag size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold leading-tight">For Sale</p>
            <p className="text-ink-light text-xs">{items.length} item{items.length !== 1 ? 's' : ''} available</p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8">
        {items.length === 0 ? (
          <div className="py-20 text-center">
            <Package size={32} className="mx-auto text-ink-light mb-3" />
            <p className="text-ink-muted text-sm">Nothing listed right now — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {items.map(item => {
              const photo = item.inventory_photos?.find(p => p.is_primary) ?? item.inventory_photos?.[0]
              return (
                <Link key={item.id} href={`/catalog/${item.id}`} className="card overflow-hidden group">
                  <div className="aspect-square bg-surface-border overflow-hidden">
                    {photo?.url ? (
                      <img
                        src={photo.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package size={28} className="text-ink-light" />
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-medium text-ink text-sm truncate">{item.title}</p>
                    <p className="text-ink-muted text-xs mt-0.5">{item.category ?? 'Uncategorized'}</p>
                    {item.asking_price && (
                      <p className="font-mono font-semibold text-ink text-sm mt-1.5">
                        ${item.asking_price.toFixed(2)}
                      </p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
