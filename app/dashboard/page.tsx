import { getItems } from '@/lib/supabase'
import Link from 'next/link'
import { Package, DollarSign, TrendingUp, Clock, PlusCircle } from 'lucide-react'
import StatusBadge from '@/components/StatusBadge'

export const revalidate = 0

export default async function DashboardPage() {
  const items = await getItems()

  const stats = {
    total:     items.length,
    inStorage: items.filter(i => i.status === 'In Storage').length,
    listed:    items.filter(i => i.status === 'Listed').length,
    pending:   items.filter(i => i.status === 'Pending').length,
    sold:      items.filter(i => i.status === 'Sold').length,
    totalCost: items.reduce((s, i) => s + (i.purchase_price ?? 0), 0),
    totalAsking: items.reduce((s, i) => s + (i.asking_price ?? 0), 0),
    totalSold: items.filter(i => i.status === 'Sold').reduce((s, i) => s + (i.sold_price ?? 0), 0),
  }

  const recent = items.slice(0, 5)

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-ink">Dashboard</h1>
          <p className="text-ink-muted text-sm mt-0.5">Your inventory at a glance</p>
        </div>
        <Link href="/items/new" className="btn-primary self-start sm:self-auto">
          <PlusCircle size={16} />
          Add Item
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <StatCard label="Total Items"    value={stats.total}     icon={Package}     color="blue" />
        <StatCard label="Listed"         value={stats.listed}    icon={Clock}       color="amber" />
        <StatCard label="Sold"           value={stats.sold}      icon={TrendingUp}  color="green" />
        <StatCard
          label="Revenue"
          value={`$${stats.totalSold.toFixed(2)}`}
          icon={DollarSign}
          color="emerald"
        />
      </div>

      {/* Status breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6 md:mb-8">
        <div className="card p-5">
          <h2 className="font-semibold text-ink mb-4">Status Breakdown</h2>
          <div className="space-y-3">
            {([
              ['In Storage', stats.inStorage],
              ['Listed',     stats.listed],
              ['Pending',    stats.pending],
              ['Sold',       stats.sold],
            ] as const).map(([label, count]) => (
              <div key={label} className="flex items-center justify-between">
                <StatusBadge status={label} />
                <span className="font-mono text-sm font-medium text-ink">{count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-ink mb-4">Financial Summary</h2>
          <div className="space-y-3">
            <FinRow label="Total invested" value={stats.totalCost} />
            <FinRow label="Total asking"   value={stats.totalAsking} />
            <FinRow label="Total sold"     value={stats.totalSold} highlight />
            <div className="pt-2 border-t border-surface-border">
              <FinRow
                label="Profit so far"
                value={stats.totalSold - stats.totalCost}
                highlight
              />
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="font-semibold text-ink mb-4">Quick Actions</h2>
          <div className="space-y-2">
            <Link href="/items/new" className="btn-primary w-full justify-center">
              <PlusCircle size={16} /> Add New Item
            </Link>
            <Link href="/items?status=In+Storage" className="btn-secondary w-full justify-center">
              <Package size={16} /> View Storage
            </Link>
            <Link href="/items?status=Listed" className="btn-secondary w-full justify-center">
              <Clock size={16} /> View Listed
            </Link>
          </div>
        </div>
      </div>

      {/* Recent items */}
      <div className="card">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="font-semibold text-ink">Recently Added</h2>
          <Link href="/items" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View all →
          </Link>
        </div>
        {recent.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Package size={32} className="mx-auto text-ink-light mb-3" />
            <p className="text-ink-muted text-sm">No items yet.</p>
            <Link href="/items/new" className="btn-primary mt-4 inline-flex">
              Add your first item
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {recent.map(item => (
              <Link
                key={item.id}
                href={`/items/${item.id}`}
                className="flex items-center gap-4 px-6 py-4 hover:bg-surface transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-surface-border flex items-center justify-center shrink-0">
                  {item.inventory_photos?.[0]?.url ? (
                    <img
                      src={item.inventory_photos[0].url}
                      alt={item.title}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  ) : (
                    <Package size={18} className="text-ink-light" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-ink text-sm truncate">{item.title}</p>
                  <p className="text-ink-muted text-xs">{item.category ?? 'Uncategorized'}</p>
                </div>
                <div className="text-right shrink-0">
                  <StatusBadge status={item.status} />
                  {item.asking_price && (
                    <p className="text-sm font-medium text-ink mt-1">
                      ${item.asking_price.toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label, value, icon: Icon, color,
}: {
  label: string
  value: string | number
  icon: React.ElementType
  color: string
}) {
  const colors: Record<string, string> = {
    blue:    'bg-blue-50 text-blue-600',
    amber:   'bg-amber-50 text-amber-600',
    green:   'bg-green-50 text-green-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }
  return (
    <div className="card p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <p className="text-2xl font-bold text-ink">{value}</p>
      <p className="text-ink-muted text-sm mt-0.5">{label}</p>
    </div>
  )
}

function FinRow({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-ink-muted">{label}</span>
      <span className={`text-sm font-semibold font-mono ${highlight ? 'text-green-600' : 'text-ink'}`}>
        ${value.toFixed(2)}
      </span>
    </div>
  )
}
