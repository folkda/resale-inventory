import { getPublicItem } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Package, ArrowLeft, Tag } from 'lucide-react'

export const revalidate = 0

export default async function PublicItemPage({ params }: { params: { id: string } }) {
  let item
  try {
    item = await getPublicItem(params.id)
  } catch {
    notFound()
  }

  const primaryPhoto = item.inventory_photos?.find(p => p.is_primary) ?? item.inventory_photos?.[0]
  const otherPhotos  = item.inventory_photos?.filter(p => p.id !== primaryPhoto?.id) ?? []

  return (
    <div className="min-h-screen bg-surface">
      <header className="bg-ink px-4 md:px-8 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-ink-light hover:text-white text-sm transition-colors">
            <ArrowLeft size={16} /> Back to listings
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
          <div className="space-y-3">
            <div className="rounded-xl overflow-hidden aspect-square bg-white border border-surface-border shadow-sm">
              {primaryPhoto?.url ? (
                <img src={primaryPhoto.url} alt={item.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-surface">
                  <Package size={48} className="text-ink-light" />
                </div>
              )}
            </div>
            {otherPhotos.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {otherPhotos.map(p => (
                  <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-surface-border border border-surface-border">
                    <img src={p.url ?? ''} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <p className="text-ink-light text-xs font-medium uppercase tracking-wide mb-2 flex items-center gap-1">
              <Tag size={12} />
              {item.category ?? 'Uncategorized'}
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-ink mb-3 tracking-tight">{item.title}</h1>

            {item.asking_price && (
              <p className="text-3xl font-bold font-mono text-brand-600 mb-5">
                ${item.asking_price.toFixed(2)}
              </p>
            )}

            {item.condition && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 text-sm font-medium mb-5">
                Condition: {item.condition}
              </div>
            )}

            {item.description && (
              <p className="text-sm text-ink-muted whitespace-pre-wrap leading-relaxed mb-6">{item.description}</p>
            )}

            <Link href="/contact" className="btn-primary inline-flex">
              Contact About This Item
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
