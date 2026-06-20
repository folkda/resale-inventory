import { getItem } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import ItemForm from '@/components/ItemForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export const revalidate = 0

export default async function EditItemPage({ params }: { params: { id: string } }) {
  let item
  try {
    item = await getItem(params.id)
  } catch {
    notFound()
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href={`/items/${item.id}`} className="flex items-center gap-1 text-sm text-ink-muted hover:text-ink mb-4 transition-colors">
          <ChevronLeft size={16} /> Back to item
        </Link>
        <h1 className="text-2xl font-bold text-ink">Edit Item</h1>
        <p className="text-ink-muted text-sm mt-0.5">{item.title}</p>
      </div>
      <ItemForm item={item} />
    </div>
  )
}
