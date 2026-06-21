import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ── Types ────────────────────────────────────────────────────

export type ItemStatus = 'In Storage' | 'Listed' | 'Pending' | 'Sold'
export type ItemCondition = 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor'
export type Authenticity = 'Original' | 'Reproduction' | 'Signed' | 'Certified' | 'Unknown'
export type ShippingSize = 'Small' | 'Medium' | 'Large' | 'Freight'
export type SoldPlatform = 'eBay' | 'Etsy' | 'Local Shop' | 'Other'

export interface InventoryItem {
  id: string
  created_at: string
  updated_at: string

  // Basics
  title: string
  description?: string
  category?: string
  condition?: ItemCondition
  keywords?: string
  notes?: string

  // Sourcing
  where_purchased?: string
  source_name?: string
  purchase_date?: string
  purchase_price?: number

  // Pricing & sales
  asking_price?: number
  sold_price?: number
  sold_date?: string
  sold_platform?: SoldPlatform
  status: ItemStatus

  // Where to sell
  item_platforms?: { platform_id: string; platforms: Platform }[]

  // Location
  room?: string
  bin?: string

  // Measurements
  length_in?: number
  width_in?: number
  height_in?: number
  shipping_weight_lbs?: number
  shipping_size?: ShippingSize

  // Authenticity
  authenticity?: Authenticity
  authenticity_notes?: string

  // Photos (joined)
  inventory_photos?: Photo[]
}

export interface Platform {
  id: string
  name: string
  sort_order: number
}

export interface Photo {
  id: string
  item_id: string
  storage_path: string
  url?: string
  is_primary: boolean
  sort_order: number
}

// ── Data helpers ─────────────────────────────────────────────

export async function getItems(filters?: {
  status?: ItemStatus
  category?: string
  search?: string
}) {
  let query = supabase
    .from('inventory')
    .select('*, inventory_photos(*), item_platforms(platform_id, platforms(*))')
    .order('created_at', { ascending: false })

  if (filters?.status) {
    query = query.eq('status', filters.status)
  }
  if (filters?.category) {
    query = query.eq('category', filters.category)
  }
  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,keywords.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    )
  }

  const { data, error } = await query
  if (error) throw error
  return data as InventoryItem[]
}

// Public storefront — only customer-facing fields, only Listed items
const PUBLIC_FIELDS = 'id, title, description, category, condition, asking_price, status, inventory_photos(*)'

export async function getPublicItems() {
  const { data, error } = await supabase
    .from('inventory')
    .select(PUBLIC_FIELDS)
    .eq('status', 'Listed')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data as unknown as InventoryItem[]
}

export async function getPublicItem(id: string) {
  const { data, error } = await supabase
    .from('inventory')
    .select(PUBLIC_FIELDS)
    .eq('id', id)
    .eq('status', 'Listed')
    .single()
  if (error) throw error
  return data as unknown as InventoryItem
}

export async function getItem(id: string) {
  const { data, error } = await supabase
    .from('inventory')
    .select('*, inventory_photos(*), item_platforms(platform_id, platforms(*))')
    .eq('id', id)
    .single()
  if (error) throw error
  return data as InventoryItem
}

export async function createItem(item: Partial<InventoryItem>) {
  const { data, error } = await supabase
    .from('inventory')
    .insert(item)
    .select()
    .single()
  if (error) throw error
  return data as InventoryItem
}

export async function updateItem(id: string, item: Partial<InventoryItem>) {
  const { data, error } = await supabase
    .from('inventory')
    .update(item)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data as InventoryItem
}

export async function deleteItem(id: string) {
  const { error } = await supabase
    .from('inventory')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── Platforms ────────────────────────────────────────────────

export async function getPlatforms() {
  const { data, error } = await supabase
    .from('platforms')
    .select('*')
    .order('sort_order', { ascending: true })
  if (error) throw error
  return data as Platform[]
}

export async function createPlatform(name: string, sortOrder: number) {
  const { data, error } = await supabase
    .from('platforms')
    .insert({ name, sort_order: sortOrder })
    .select()
    .single()
  if (error) throw error
  return data as Platform
}

export async function deletePlatform(id: string) {
  const { error } = await supabase.from('platforms').delete().eq('id', id)
  if (error) throw error
}

export async function setItemPlatforms(itemId: string, platformIds: string[]) {
  const { error: delError } = await supabase
    .from('item_platforms')
    .delete()
    .eq('item_id', itemId)
  if (delError) throw delError

  if (platformIds.length === 0) return

  const { error: insError } = await supabase
    .from('item_platforms')
    .insert(platformIds.map(platform_id => ({ item_id: itemId, platform_id })))
  if (insError) throw insError
}

export async function uploadPhoto(itemId: string, file: File, isPrimary = false) {
  const ext = file.name.split('.').pop()
  const path = `${itemId}/${Date.now()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('item-photos')
    .upload(path, file)
  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from('item-photos')
    .getPublicUrl(path)

  const { data, error } = await supabase
    .from('inventory_photos')
    .insert({
      item_id: itemId,
      storage_path: path,
      url: publicUrl,
      is_primary: isPrimary,
    })
    .select()
    .single()
  if (error) throw error
  return data as Photo
}

export async function deletePhoto(photo: Photo) {
  await supabase.storage.from('item-photos').remove([photo.storage_path])
  await supabase.from('inventory_photos').delete().eq('id', photo.id)
}

export function getPhotoUrl(path: string) {
  const { data } = supabase.storage.from('item-photos').getPublicUrl(path)
  return data.publicUrl
}
