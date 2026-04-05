import { useEffect, useState } from 'react';
import { PackagePlus, RefreshCcw } from 'lucide-react';
import api from '../api/axios';

const PharmacyInventoryPage = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    category: '',
    unit: '',
    stock: 0,
    lowStockThreshold: 50
  });

  const fetchInventory = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/inventory');
      setItems(res.data.data || []);
    } catch (e) {
      setError('Unable to load inventory. Please ensure you are logged in.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'stock' || name === 'lowStockThreshold' ? Number(value) : value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/inventory', form);
      setShowForm(false);
      setForm({ name: '', category: '', unit: '', stock: 0, lowStockThreshold: 50 });
      fetchInventory();
    } catch (e) {
      setError('Failed to add item. Admin access required.');
    }
  };

  const handleRestock = async (itemId) => {
    const amount = Number(prompt('Enter restock quantity:', '50'));
    if (!amount || Number.isNaN(amount)) return;
    try {
      await api.patch(`/inventory/${itemId}/stock`, null, { params: { delta: amount } });
      fetchInventory();
    } catch (e) {
      setError('Failed to restock item.');
    }
  };

  const totalItems = items.length;
  const lowStock = items.filter(i => i.status === 'Low Stock').length;
  const outOfStock = items.filter(i => i.status === 'Out of Stock').length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Pharmacy Inventory</h1>
          <p className="text-slate-500">Track medication stocks and handle reorders.</p>
        </div>
        <button className="btn btn-primary px-6" onClick={() => setShowForm(v => !v)}>
          <PackagePlus size={18} /> Add Stock
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
          {error}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleAdd} className="card p-5 bg-white shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-5 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Medication name" required className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
          <input name="unit" value={form.unit} onChange={handleChange} placeholder="Unit (e.g. Tablets)" required className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
          <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} placeholder="Initial stock" required className="px-3 py-2 rounded-lg border border-slate-200 text-sm" />
          <button type="submit" className="btn btn-primary">Save Item</button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="card p-6 border-l-4 border-l-blue-500 bg-white shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm mb-1">Total Items</h3>
          <p className="text-3xl font-bold text-[#1A2B6D]">{totalItems}</p>
        </div>
        <div className="card p-6 border-l-4 border-l-orange-500 bg-white shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm mb-1">Low Stock Alerts</h3>
          <p className="text-3xl font-bold text-[#1A2B6D]">{lowStock}</p>
        </div>
        <div className="card p-6 border-l-4 border-l-red-500 bg-white shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm mb-1">Out of Stock</h3>
          <p className="text-3xl font-bold text-[#1A2B6D]">{outOfStock}</p>
        </div>
      </div>

      <div className="card border-none shadow-sm flex-1 bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm">
              <th className="p-4 font-medium pl-6">Item Code</th>
              <th className="p-4 font-medium">Medication Name</th>
              <th className="p-4 font-medium">Category</th>
              <th className="p-4 font-medium">Stock Level</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right pr-6">Reorder</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!loading && items.map(item => (
              <tr key={item.id} className="hover:bg-slate-50">
                <td className="p-4 pl-6 font-medium text-slate-500">{item.id}</td>
                <td className="p-4 font-semibold text-[#1A2B6D]">{item.name}</td>
                <td className="p-4 text-slate-600">{item.category}</td>
                <td className="p-4 font-medium text-lg text-slate-700">{item.stock} <span className="text-sm font-normal text-slate-400">{item.unit}</span></td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold
                    ${item.status === 'In Stock' ? 'bg-green-50 text-green-600' : ''}
                    ${item.status === 'Low Stock' ? 'bg-orange-50 text-orange-600' : ''}
                    ${item.status === 'Out of Stock' ? 'bg-red-50 text-red-600' : ''}
                  `}>
                    {item.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right">
                  <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg" title="Request Restock" onClick={() => handleRestock(item.id)}>
                    <RefreshCcw size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {loading && (
              <tr>
                <td colSpan="6" className="p-6 text-center text-slate-400">Loading inventory...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PharmacyInventoryPage;
