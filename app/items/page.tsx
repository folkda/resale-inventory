'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getItems, type InventoryItem, type ItemStatus } from '@/lib/supabase'
import StatusBadge from '@/components/StatusBadge'
import { Search, PlusCircle, Package, Filter } from 'lucide-react'

const STATUSES: ItemStatus[] = ['In Storage', 'Listed', 'Pending', 'Sold']

export default function ItemsPage() {
  const [items, setItems] = useState<InventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ItemStatus | ''>('')

  useEffect(() => {
    load()
  }, [search, statusFilter])

  async function load() {
    setLoading(true)
    try {
      const data = await getItems({
        search: search || undefined,
        status: statusFilter || undefined,
      })
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-ink">All Items</h1>
          <p className="text-ink-muted text-sm mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/items/new" className="btn-primary">
          <PlusCircle size={16} />
          Add Item
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
          <input
            className="input pl-9"
            placeholder="Search title, keywords, description…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-light" />
          <select
            className="input pl-9 pr-8 appearance-none cursor-pointer"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as ItemStatus | '')}
          >
            <option value="">All Statuses</option>
            {STATUSES.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-ink-muted text-sm">Loading…</div>
        ) : items.length === 0 ? (
          <div className="py-16 text-center">
            <Package size={32} className="mx-auto text-ink-light mb-3" />
            <p className="text-ink-muted text-sm">No items found.</p>
            <Link href="/items/new" className="btn-primary mt-4 inline-flex">
              Add your first item
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface border-b border-surface-border">
              <tr>
                <th className="text-left px-4 py-3 text-ink-muted font-medium">Item</th>
                <th className="text-left px-4 py-3 text-ink-muted font-medium">Category</th>
                <th className="text-left px-4 py-3 text-ink-muted font-medium">Location</th>
                <th className="text-left px-4 py-3 text-ink-muted font-medium">Status</th>
                <th className="text-right px-4 py-3 text-ink-muted font-medium">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-surface transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/items/${item.id}`} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-surface-border overflow-hidden shrink-0">
                        {item.inventory_photos?.[0]?.url ? (
                          <img
                            src={item.inventory_photos[0].url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={16} className="text-ink-light" />
                          </div>
                        )}
                      </div>
                      <span className="font-medium text-ink hover:text-brand-600 transition-colors">
                        {item.title}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{item.category ?? '—'}</td>
                  <td className="px-4 py-3 text-ink-muted font-mono text-xs">
                    {[item.room, item.bin].filter(Boolean).join(' / ') || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-4 py-3 text-right font-mono font-medium text-ink">
                    {item.asking_price ? `$${item.asking_price.toFixed(2)}` : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
