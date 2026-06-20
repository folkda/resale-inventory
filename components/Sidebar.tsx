'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  Tag,
  TrendingUp,
} from 'lucide-react'
import clsx from 'clsx'

const nav = [
  { href: '/dashboard',   label: 'Dashboard',    icon: LayoutDashboard },
  { href: '/items',       label: 'All Items',     icon: Package },
  { href: '/items/new',   label: 'Add Item',      icon: PlusCircle },
]

export default function Sidebar() {
  const path = usePathname()

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 min-h-screen bg-ink flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
              <Tag size={16} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm leading-tight">Resale</p>
              <p className="text-ink-light text-xs">Inventory</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = path === href || (href !== '/dashboard' && path.startsWith(href))
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all',
                  active
                    ? 'bg-brand-600 text-white'
                    : 'text-ink-light hover:text-white hover:bg-white/10'
                )}
              >
                <Icon size={18} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-ink-light text-xs">Track · List · Sell</p>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="md:hidden flex items-center gap-2.5 px-4 py-3 bg-ink sticky top-0 z-20">
        <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
          <Tag size={14} className="text-white" />
        </div>
        <p className="text-white font-semibold text-sm">Resale Inventory</p>
      </header>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-ink border-t border-white/10 flex pb-[env(safe-area-inset-bottom)]">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = path === href || (href !== '/dashboard' && path.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              className={clsx(
                'flex-1 flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors',
                active ? 'text-brand-400' : 'text-ink-light'
              )}
            >
              <Icon size={20} />
              {label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
