import clsx from 'clsx'
import type { ItemStatus } from '@/lib/supabase'

const styles: Record<ItemStatus, string> = {
  'In Storage': 'bg-slate-100 text-slate-600',
  'Listed':     'bg-blue-100 text-blue-700',
  'Pending':    'bg-amber-100 text-amber-700',
  'Sold':       'bg-green-100 text-green-700',
}

export default function StatusBadge({ status }: { status: ItemStatus }) {
  return (
    <span className={clsx('status-badge', styles[status])}>
      {status}
    </span>
  )
}
