import { getPublicItem } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Package, ArrowLeft } from 'lucide-react'

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
        <div className="max-w-3xl mx-auto">
          <Link href="/catalog" className="inline-flex items-center gap-2 text-ink-light hover:text-white text-sm">
            <ArrowLeft size={16} /> Back to listings
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="card overflow-hidden aspect-square">
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
                  <div key={p.id} className="aspect-square rounded-lg overflow-hidden bg-surface-border">
                    <img src={p.url ?? ''} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-ink mb-1">{item.title}</h1>
            <p className="text-ink-muted text-sm mb-4">{item.category ?? 'Uncategorized'}</p>

            {item.asking_price && (
              <p className="text-3xl font-bold font-mono text-brand-600 mb-4">
                ${item.asking_price.toFixed(2)}
              </p>
            )}

            {item.condition && (
              <p className="text-sm text-ink mb-4">
                <span className="text-ink-muted">Condition: </span>
                <span className="font-medium">{item.condition}</span>
              </p>
            )}

            {item.description && (
              <p className="text-sm text-ink-muted whitespace-pre-wrap">{item.description}</p>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
