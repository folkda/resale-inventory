import ItemForm from '@/components/ItemForm'

export default function NewItemPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Add New Item</h1>
        <p className="text-ink-muted text-sm mt-0.5">Fill in the details for your new inventory item</p>
      </div>
      <ItemForm />
    </div>
  )
}
