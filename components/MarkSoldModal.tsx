'use client'

import { useState } from 'react'
import { updateItem, type InventoryItem } from '@/lib/supabase'
import { Loader2, X } from 'lucide-react'

interface Props {
  item: InventoryItem
  onClose: () => void
  onSaved: (updated: InventoryItem) => void
}

export default function MarkSoldModal({ item, onClose, onSaved }: Props) {
  const [soldPrice, setSoldPrice] = useState(item.sold_price?.toString() ?? item.asking_price?.toString() ?? '')
  const [soldDate, setSoldDate] = useState(item.sold_date ?? new Date().toISOString().slice(0, 10))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true); setError('')
    try {
      const updated = await updateItem(item.id, {
        status: 'Sold',
        sold_price: soldPrice ? parseFloat(soldPrice) : undefined,
        sold_date: soldDate || undefined,
      })
      onSaved(updated)
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="card p-5 w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-ink">Mark "{item.title}" as Sold</h2>
          <button onClick={onClose} className="text-ink-light hover:text-ink">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mb-4 px-3 py-2 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-5">
          <div>
            <label className="label">Sold Price ($)</label>
            <input
              type="number"
              step="0.01"
              autoFocus
              className="input"
              value={soldPrice}
              onChange={e => setSoldPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="label">Sold Date</label>
            <input
              type="date"
              className="input"
              value={soldDate}
              onChange={e => setSoldDate(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 justify-center">
            {saving ? <Loader2 size={16} className="animate-spin" /> : 'Mark Sold'}
          </button>
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
