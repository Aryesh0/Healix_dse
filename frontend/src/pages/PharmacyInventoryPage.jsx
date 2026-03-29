import { PackagePlus, RefreshCcw } from 'lucide-react';

const inventory = [
  { id: 'MED-01', name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 1200, unit: 'Tablets', status: 'In Stock' },
  { id: 'MED-02', name: 'Ibuprofen 400mg', category: 'Painkiller', stock: 45, unit: 'Tablets', status: 'Low Stock' },
  { id: 'MED-03', name: 'Saline Solution 500ml', category: 'IV Fluid', stock: 0, unit: 'Bottles', status: 'Out of Stock' },
  { id: 'MED-04', name: 'Omeprazole 20mg', category: 'Antacid', stock: 350, unit: 'Capsules', status: 'In Stock' },
];

const PharmacyInventoryPage = () => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Pharmacy Inventory</h1>
          <p className="text-slate-500">Track medication stocks and handle reorders.</p>
        </div>
        <button className="btn btn-primary px-6">
          <PackagePlus size={18} /> Add Stock
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
        <div className="card p-6 border-l-4 border-l-blue-500 bg-white shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm mb-1">Total Items</h3>
          <p className="text-3xl font-bold text-[#1A2B6D]">1,452</p>
        </div>
        <div className="card p-6 border-l-4 border-l-orange-500 bg-white shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm mb-1">Low Stock Alerts</h3>
          <p className="text-3xl font-bold text-[#1A2B6D]">14</p>
        </div>
        <div className="card p-6 border-l-4 border-l-red-500 bg-white shadow-sm">
          <h3 className="text-slate-500 font-medium text-sm mb-1">Out of Stock</h3>
          <p className="text-3xl font-bold text-[#1A2B6D]">3</p>
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
            {inventory.map(item => (
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
                  <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg" title="Request Restock">
                    <RefreshCcw size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PharmacyInventoryPage;
