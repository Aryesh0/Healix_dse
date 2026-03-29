export default function ItemCard({ item, onEdit, onDelete }) {
  const fmtPrice = (p) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(p)

  return (
    <article className="item-card">
      <div className="item-card-header">
        <h3 className="item-name">{item.name}</h3>
        <span className="item-category">{item.category}</span>
      </div>

      {item.description && (
        <p className="item-description">{item.description}</p>
      )}

      <div className="item-meta">
        <div className="item-meta-item">
          <span className="item-meta-label">Price</span>
          <span className="item-meta-value price-value">{fmtPrice(item.price)}</span>
        </div>
        <div className="item-meta-item">
          <span className="item-meta-label">Qty</span>
          <span className="item-meta-value qty-value">{item.quantity}</span>
        </div>
      </div>

      <div className="item-card-actions">
        <button
          id={`edit-item-${item.id}`}
          className="btn btn-success btn-sm"
          onClick={() => onEdit(item)}
        >
          ✏️ Edit
        </button>
        <button
          id={`delete-item-${item.id}`}
          className="btn btn-danger btn-sm"
          onClick={() => onDelete(item.id)}
        >
          🗑️ Delete
        </button>
      </div>
    </article>
  )
}
