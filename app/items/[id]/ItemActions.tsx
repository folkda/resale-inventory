'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteItem, type InventoryItem } from '@/lib/supabase'
import { Trash2, Loader2 } from 'lucide-react'

export default function ItemActions({ item }: { item: InventoryItem }) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    if (!confirm(`Delete "${item.title}"? This cannot be undone.`)) return
    setDeleting(true)
    try {
      await deleteItem(item.id)
      router.push('/items')
    } catch (e: any) {
      alert(e.message)
      setDeleting(false)
    }
  }

  return (
    <button onClick={handleDelete} disabled={deleting} className="btn-danger">
      {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
      Delete
    </button>
  )
}
