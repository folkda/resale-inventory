'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  createItem, updateItem, uploadPhoto, deletePhoto,
  getPlatforms, setItemPlatforms,
  type InventoryItem, type Photo, type Platform,
} from '@/lib/supabase'
import { Upload, X, Star, Loader2 } from 'lucide-react'
import clsx from 'clsx'

interface Props {
  item?: InventoryItem
}

const CONDITIONS    = ['New', 'Like New', 'Good', 'Fair', 'Poor']
const STATUSES      = ['In Storage', 'Listed', 'Pending', 'Sold']
const AUTHENTICITIES = ['Original', 'Reproduction', 'Signed', 'Certified', 'Unknown']
const SHIPPING_SIZES = ['Small', 'Medium', 'Large', 'Freight']

export default function ItemForm({ item }: Props) {
  const router = useRouter()
  const fileRef = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  // Photos state
  const [photos, setPhotos] = useState<Photo[]>(item?.inventory_photos ?? [])

  // Platforms
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [selectedPlatformIds, setSelectedPlatformIds] = useState<string[]>(
    item?.item_platforms?.map(ip => ip.platform_id) ?? []
  )

  useEffect(() => {
    getPlatforms().then(setPlatforms).catch(e => setError(e.message))
  }, [])

  function togglePlatform(id: string) {
    setSelectedPlatformIds(ids => ids.includes(id) ? ids.filter(i => i !== id) : [...ids, id])
  }

  // Form state
  const [form, setForm] = useState({
    title:               item?.title ?? '',
    description:         item?.description ?? '',
    category:            item?.category ?? '',
    condition:           item?.condition ?? '',
    keywords:            item?.keywords ?? '',
    notes:               item?.notes ?? '',
    where_purchased:     item?.where_purchased ?? '',
    source_name:         item?.source_name ?? '',
    purchase_date:       item?.purchase_date ?? '',
    purchase_price:      item?.purchase_price?.toString() ?? '',
    asking_price:        item?.asking_price?.toString() ?? '',
    sold_price:          item?.sold_price?.toString() ?? '',
    sold_date:           item?.sold_date ?? '',
    sold_platform:       item?.sold_platform ?? '',
    status:              item?.status ?? 'In Storage',
    room:                item?.room ?? '',
    bin:                 item?.bin ?? '',
    length_in:           item?.length_in?.toString() ?? '',
    width_in:            item?.width_in?.toString() ?? '',
    height_in:           item?.height_in?.toString() ?? '',
    shipping_weight_lbs: item?.shipping_weight_lbs?.toString() ?? '',
    shipping_size:       item?.shipping_size ?? '',
    authenticity:        item?.authenticity ?? '',
    authenticity_notes:  item?.authenticity_notes ?? '',
  })

  function set(field: string, value: string | boolean) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function handleSave() {
    if (!form.title.trim()) { setError('Title is required.'); return }
    setSaving(true); setError('')
    try {
      const payload: Partial<InventoryItem> = {
        ...form,
        purchase_price:      form.purchase_price      ? parseFloat(form.purchase_price)      : undefined,
        asking_price:        form.asking_price        ? parseFloat(form.asking_price)        : undefined,
        sold_price:          form.sold_price          ? parseFloat(form.sold_price)          : undefined,
        length_in:           form.length_in           ? parseFloat(form.length_in)           : undefined,
        width_in:            form.width_in            ? parseFloat(form.width_in)            : undefined,
        height_in:           form.height_in           ? parseFloat(form.height_in)           : undefined,
        shipping_weight_lbs: form.shipping_weight_lbs ? parseFloat(form.shipping_weight_lbs) : undefined,
        condition:           (form.condition  || undefined) as any,
        shipping_size:       (form.shipping_size  || undefined) as any,
        authenticity:        (form.authenticity || undefined) as any,
        sold_platform:       (form.sold_platform || undefined) as any,
        purchase_date:       form.purchase_date || undefined,
        sold_date:           form.sold_date || undefined,
        status:              form.status as any,
      }

      if (item) {
        await updateItem(item.id, payload)
        await setItemPlatforms(item.id, selectedPlatformIds)
        router.push(`/items/${item.id}`)
      } else {
        const created = await createItem(payload)
        await setItemPlatforms(created.id, selectedPlatformIds)
        router.push(`/items/${created.id}`)
      }
    } catch (e: any) {
      setError(e.message ?? 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  async function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length || !item) return
    setUploading(true)
    try {
      for (const file of files) {
        const photo = await uploadPhoto(item.id, file, photos.length === 0)
        setPhotos(p => [...p, photo])
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setUploading(false)
    }
  }

  async function handleDeletePhoto(photo: Photo) {
    await deletePhoto(photo)
    setPhotos(p => p.filter(ph => ph.id !== photo.id))
  }

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-0">
      {error && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-6">

        {/* ── Basics ── */}
        <Section title="Item Details">
          <Field label="Title *">
            <input className="input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. Vintage Blue Mason Jar" />
          </Field>
          <Field label="Description">
            <textarea className="input min-h-24 resize-y" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Describe the item…" />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Category">
              <input className="input" value={form.category} onChange={e => set('category', e.target.value)} placeholder="e.g. Glassware, Clothing…" />
            </Field>
            <Field label="Condition">
              <select className="input" value={form.condition} onChange={e => set('condition', e.target.value)}>
                <option value="">Select…</option>
                {CONDITIONS.map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Keywords / Tags">
            <input className="input" value={form.keywords} onChange={e => set('keywords', e.target.value)} placeholder="vintage, blue, glass, 1940s — copy to eBay/Etsy tags" />
          </Field>
          <Field label="Notes">
            <textarea className="input resize-y" value={form.notes} onChange={e => set('notes', e.target.value)} placeholder="Private notes…" />
          </Field>
        </Section>

        {/* ── Sourcing ── */}
        <Section title="When and Where Item Was Acquired">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Where Purchased">
              <input className="input" value={form.where_purchased} onChange={e => set('where_purchased', e.target.value)} placeholder="Garage Sale, Thrift Store…" />
            </Field>
            <Field label="Source Name">
              <input className="input" value={form.source_name} onChange={e => set('source_name', e.target.value)} placeholder="Store or person name" />
            </Field>
            <Field label="Purchase Date">
              <input type="date" className="input" value={form.purchase_date} onChange={e => set('purchase_date', e.target.value)} />
            </Field>
            <Field label="Purchase Price ($)">
              <input type="number" step="0.01" className="input" value={form.purchase_price} onChange={e => set('purchase_price', e.target.value)} placeholder="0.00" />
            </Field>
          </div>
        </Section>

        {/* ── Pricing & Status ── */}
        <Section title="Pricing & Status">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Asking Price ($)">
              <input type="number" step="0.01" className="input" value={form.asking_price} onChange={e => set('asking_price', e.target.value)} placeholder="0.00" />
            </Field>
            <Field label="Status">
              <select className="input" value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
            {form.status === 'Sold' && <>
              <Field label="Sold Price ($)">
                <input type="number" step="0.01" className="input" value={form.sold_price} onChange={e => set('sold_price', e.target.value)} placeholder="0.00" />
              </Field>
              <Field label="Sold Date">
                <input type="date" className="input" value={form.sold_date} onChange={e => set('sold_date', e.target.value)} />
              </Field>
              <Field label="Sold Platform" className="col-span-2">
                <select className="input" value={form.sold_platform} onChange={e => set('sold_platform', e.target.value)}>
                  <option value="">Select…</option>
                  {platforms.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                  <option value="Other">Other</option>
                </select>
              </Field>
            </>}
          </div>

          {/* Platforms to sell on */}
          <div>
            <label className="label">Sell On</label>
            {platforms.length === 0 ? (
              <p className="text-xs text-ink-light">
                No platforms configured yet. <a href="/admin" className="text-brand-600 underline">Add some in Admin →</a>
              </p>
            ) : (
              <div className="flex flex-wrap gap-4">
                {platforms.map(p => (
                  <label key={p.id} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded accent-brand-600"
                      checked={selectedPlatformIds.includes(p.id)}
                      onChange={() => togglePlatform(p.id)}
                    />
                    <span className="text-sm text-ink">{p.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* ── Location ── */}
        <Section title="Physical Location">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Room">
              <input className="input" value={form.room} onChange={e => set('room', e.target.value)} placeholder="Garage, Basement, Bedroom 2…" />
            </Field>
            <Field label="Bin / Shelf">
              <input className="input" value={form.bin} onChange={e => set('bin', e.target.value)} placeholder="Bin A3, Shelf 2, Box 7…" />
            </Field>
          </div>
        </Section>

        {/* ── Measurements ── */}
        <Section title="Measurements & Shipping">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Field label="Length (in)">
              <input type="number" step="0.1" className="input" value={form.length_in} onChange={e => set('length_in', e.target.value)} placeholder="0.0" />
            </Field>
            <Field label="Width (in)">
              <input type="number" step="0.1" className="input" value={form.width_in} onChange={e => set('width_in', e.target.value)} placeholder="0.0" />
            </Field>
            <Field label="Height (in)">
              <input type="number" step="0.1" className="input" value={form.height_in} onChange={e => set('height_in', e.target.value)} placeholder="0.0" />
            </Field>
            <Field label="Ship Weight (lbs)">
              <input type="number" step="0.1" className="input" value={form.shipping_weight_lbs} onChange={e => set('shipping_weight_lbs', e.target.value)} placeholder="0.0" />
            </Field>
            <Field label="Shipping Size" className="col-span-2">
              <select className="input" value={form.shipping_size} onChange={e => set('shipping_size', e.target.value)}>
                <option value="">Select…</option>
                {SHIPPING_SIZES.map(s => <option key={s}>{s}</option>)}
              </select>
            </Field>
          </div>
        </Section>

        {/* ── Authenticity ── */}
        <Section title="Authenticity">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Authenticity">
              <select className="input" value={form.authenticity} onChange={e => set('authenticity', e.target.value)}>
                <option value="">Select…</option>
                {AUTHENTICITIES.map(a => <option key={a}>{a}</option>)}
              </select>
            </Field>
            <Field label="Authenticity Notes">
              <input className="input" value={form.authenticity_notes} onChange={e => set('authenticity_notes', e.target.value)} placeholder="COA included, signed on back…" />
            </Field>
          </div>
        </Section>

        {/* ── Photos ── */}
        {item && (
          <Section title="Photos">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
              {photos.map(photo => (
                <div key={photo.id} className="relative group rounded-lg overflow-hidden aspect-square bg-surface-border">
                  <img src={photo.url ?? ''} alt="" className="w-full h-full object-cover" />
                  {photo.is_primary && (
                    <div className="absolute top-1 left-1 bg-brand-600 rounded p-0.5">
                      <Star size={10} className="text-white" />
                    </div>
                  )}
                  <button
                    onClick={() => handleDeletePhoto(photo)}
                    className="absolute top-1 right-1 bg-red-600 rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={10} className="text-white" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="aspect-square rounded-lg border-2 border-dashed border-surface-border hover:border-brand-400 flex flex-col items-center justify-center gap-1 text-ink-light hover:text-brand-600 transition-colors disabled:opacity-50"
              >
                {uploading
                  ? <Loader2 size={20} className="animate-spin" />
                  : <><Upload size={20} /><span className="text-xs">Add Photo</span></>
                }
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handlePhotoUpload}
            />
            <p className="text-xs text-ink-light">
              {item ? 'Upload photos for this item.' : 'Save the item first, then add photos.'}
            </p>
          </Section>
        )}

        {!item && (
          <div className="card p-4 bg-blue-50 border-blue-200">
            <p className="text-sm text-blue-700">
              📷 <strong>Photos:</strong> Save this item first, then you can upload photos from the item detail page.
            </p>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex items-center gap-3 pt-2">
          <button onClick={handleSave} disabled={saving} className="btn-primary">
            {saving ? <><Loader2 size={16} className="animate-spin" /> Saving…</> : 'Save Item'}
          </button>
          <button onClick={() => router.back()} className="btn-secondary">
            Cancel
          </button>
        </div>

      </div>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card p-4 md:p-6">
      <h2 className="font-semibold text-ink mb-4 pb-3 border-b border-surface-border">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, children, className }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className="label">{label}</label>
      {children}
    </div>
  )
}
