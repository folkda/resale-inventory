import { getItem } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import StatusBadge from '@/components/StatusBadge'
import ItemActions from './ItemActions'
import { Package, Edit } from 'lucide-react'

export const revalidate = 0

export default async function ItemDetailPage({ params }: { params: { id: string } }) {
  let item
  try {
    item = await getItem(params.id)
  } catch {
    notFound()
  }

  const primaryPhoto = item.inventory_photos?.find(p => p.is_primary) ?? item.inventory_photos?.[0]
  const otherPhotos  = item.inventory_photos?.filter(p => p.id !== primaryPhoto?.id) ?? []

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-ink">{item.title}</h1>
            <StatusBadge status={item.status} />
          </div>
          <p className="text-ink-muted text-sm">{item.category ?? 'Uncategorized'}</p>
        </div>
        <div className="flex gap-2">
          <Link href={`/items/${item.id}/edit`} className="btn-secondary">
            <Edit size={16} /> Edit
          </Link>
          <ItemActions item={item} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Photos */}
        <div className="lg:col-span-1 space-y-3">
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
          <Link href={`/items/${item.id}/edit`} className="btn-secondary w-full justify-center text-xs">
            Manage Photos
          </Link>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 space-y-4">

          {/* Pricing */}
          <div className="card p-5">
            <h2 className="font-semibold text-ink mb-3">Pricing</h2>
            <div className="grid grid-cols-3 gap-4">
              <PriceCell label="Paid"   value={item.purchase_price} />
              <PriceCell label="Asking" value={item.asking_price} highlight />
              <PriceCell label="Sold"   value={item.sold_price} green />
            </div>
            {item.asking_price && item.purchase_price && (
              <p className="text-xs text-ink-muted mt-3">
                Potential profit: <span className="text-green-600 font-semibold">
                  ${(item.asking_price - item.purchase_price).toFixed(2)}
                </span>
              </p>
            )}
          </div>

          {/* Sell on */}
          <div className="card p-5">
            <h2 className="font-semibold text-ink mb-3">Platforms</h2>
            <div className="flex gap-3">
              {[
                { key: 'sell_on_ebay', label: 'eBay' },
                { key: 'sell_on_etsy', label: 'Etsy' },
                { key: 'sell_local',   label: 'Local Shop' },
              ].map(({ key, label }) => (
                <span
                  key={key}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    item[key as keyof typeof item]
                      ? 'bg-brand-100 text-brand-700'
                      : 'bg-surface text-ink-light line-through'
                  }`}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Location */}
          <div className="card p-5">
            <h2 className="font-semibold text-ink mb-3">Location</h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Room" value={item.room} />
              <InfoRow label="Bin / Shelf" value={item.bin} />
            </div>
          </div>

          {/* Sourcing */}
          <div className="card p-5">
            <h2 className="font-semibold text-ink mb-3">Sourced From</h2>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Where Purchased" value={item.where_purchased} />
              <InfoRow label="Source Name"     value={item.source_name} />
              <InfoRow label="Purchase Date"   value={item.purchase_date} />
              <InfoRow label="Condition"       value={item.condition} />
            </div>
          </div>

          {/* Measurements */}
          {(item.length_in || item.width_in || item.height_in || item.shipping_weight_lbs) && (
            <div className="card p-5">
              <h2 className="font-semibold text-ink mb-3">Measurements & Shipping</h2>
              <div className="grid grid-cols-2 gap-4">
                {item.length_in && item.width_in && item.height_in && (
                  <InfoRow label="Dimensions" value={`${item.length_in}" × ${item.width_in}" × ${item.height_in}"`} />
                )}
                <InfoRow label="Ship Weight" value={item.shipping_weight_lbs ? `${item.shipping_weight_lbs} lbs` : undefined} />
                <InfoRow label="Ship Size"   value={item.shipping_size} />
              </div>
            </div>
          )}

          {/* Authenticity */}
          {item.authenticity && (
            <div className="card p-5">
              <h2 className="font-semibold text-ink mb-3">Authenticity</h2>
              <div className="grid grid-cols-2 gap-4">
                <InfoRow label="Type"  value={item.authenticity} />
                <InfoRow label="Notes" value={item.authenticity_notes} />
              </div>
            </div>
          )}

          {/* Keywords */}
          {item.keywords && (
            <div className="card p-5">
              <h2 className="font-semibold text-ink mb-3">Keywords</h2>
              <div className="flex flex-wrap gap-2">
                {item.keywords.split(',').map(k => (
                  <span key={k} className="px-2.5 py-1 bg-surface rounded-full text-xs text-ink-muted border border-surface-border">
                    {k.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {item.notes && (
            <div className="card p-5">
              <h2 className="font-semibold text-ink mb-2">Notes</h2>
              <p className="text-sm text-ink-muted whitespace-pre-wrap">{item.notes}</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

function PriceCell({ label, value, highlight, green }: {
  label: string; value?: number | null; highlight?: boolean; green?: boolean
}) {
  return (
    <div className="text-center p-3 bg-surface rounded-lg">
      <p className="text-xs text-ink-muted mb-1">{label}</p>
      <p className={`text-lg font-bold font-mono ${green ? 'text-green-600' : highlight ? 'text-brand-600' : 'text-ink'}`}>
        {value != null ? `$${value.toFixed(2)}` : '—'}
      </p>
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-xs text-ink-muted mb-0.5">{label}</p>
      <p className="text-sm text-ink font-medium">{value ?? '—'}</p>
    </div>
  )
}
