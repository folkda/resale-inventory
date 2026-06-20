'use client'

import { useEffect, useState } from 'react'
import { getPlatforms, createPlatform, deletePlatform, type Platform } from '@/lib/supabase'
import { Plus, Trash2, Loader2, Tag } from 'lucide-react'

export default function AdminPage() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    try {
      setPlatforms(await getPlatforms())
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleAdd() {
    const name = newName.trim()
    if (!name) return
    setAdding(true); setError('')
    try {
      const nextSortOrder = platforms.length > 0 ? Math.max(...platforms.map(p => p.sort_order)) + 1 : 0
      const created = await createPlatform(name, nextSortOrder)
      setPlatforms(p => [...p, created])
      setNewName('')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setAdding(false)
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id); setError('')
    try {
      await deletePlatform(id)
      setPlatforms(p => p.filter(pl => pl.id !== id))
    } catch (e: any) {
      setError(e.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="p-4 md:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-ink">Admin</h1>
        <p className="text-ink-muted text-sm mt-0.5">Manage where you can list/sell items</p>
      </div>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="card p-4 md:p-6">
        <h2 className="font-semibold text-ink mb-4 pb-3 border-b border-surface-border">Sell-On Platforms</h2>

        <div className="flex gap-2 mb-5">
          <input
            className="input flex-1"
            placeholder="e.g. Facebook Marketplace, Poshmark…"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />
          <button onClick={handleAdd} disabled={adding || !newName.trim()} className="btn-primary">
            {adding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
            Add
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-ink-muted py-4 text-center">Loading…</p>
        ) : platforms.length === 0 ? (
          <p className="text-sm text-ink-muted py-4 text-center">No platforms yet — add one above.</p>
        ) : (
          <ul className="space-y-2">
            {platforms.map(p => (
              <li key={p.id} className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-surface">
                <div className="flex items-center gap-2.5">
                  <Tag size={14} className="text-ink-light" />
                  <span className="text-sm font-medium text-ink">{p.name}</span>
                </div>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="text-ink-light hover:text-red-600 transition-colors p-1"
                  title="Delete platform"
                >
                  {deletingId === p.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-ink-light mt-4">
        Deleting a platform removes it as an option from all items that had it selected.
      </p>
    </div>
  )
}
