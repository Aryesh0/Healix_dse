import { useState } from 'react'

export default function ItemForm({ initial = {}, onSave, onCancel, loading }) {
  const [form, setForm] = useState({
    name: initial.name || '',
    description: initial.description || '',
    category: initial.category || '',
    price: initial.price || '',
    quantity: initial.quantity || '',
  })

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...form,
      price: parseFloat(form.price) || 0,
      quantity: parseInt(form.quantity) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group form-full">
          <label className="form-label">Item Name *</label>
          <input
            id="item-name"
            className="form-input"
            placeholder="e.g. MacBook Pro"
            value={form.name}
            onChange={set('name')}
            required
          />
        </div>

        <div className="form-group form-full">
          <label className="form-label">Description</label>
          <textarea
            id="item-description"
            className="form-textarea"
            placeholder="Describe the item..."
            value={form.description}
            onChange={set('description')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category *</label>
          <input
            id="item-category"
            className="form-input"
            placeholder="e.g. Electronics"
            value={form.category}
            onChange={set('category')}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Price ($)</label>
          <input
            id="item-price"
            className="form-input"
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={form.price}
            onChange={set('price')}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Quantity</label>
          <input
            id="item-quantity"
            className="form-input"
            type="number"
            min="0"
            placeholder="0"
            value={form.quantity}
            onChange={set('quantity')}
          />
        </div>
      </div>

      <div className="modal-actions">
        <button id="item-form-cancel" type="button" className="btn btn-ghost" onClick={onCancel}>
          Cancel
        </button>
        <button id="item-form-save" type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving…' : initial.id ? '✏️ Update Item' : '✨ Add Item'}
        </button>
      </div>
    </form>
  )
}
