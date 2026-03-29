import { useState } from 'react';
import { Download, CreditCard, Search } from 'lucide-react';

const mockBills = [
  { id: 'INV-2041', patient: 'Alice Johnson', amount: '$450.00', date: '2026-03-28', status: 'Unpaid' },
  { id: 'INV-2042', patient: 'Bob Williams', amount: '$120.00', date: '2026-03-27', status: 'Paid' },
  { id: 'INV-2043', patient: 'Charlie Brown', amount: '$890.50', date: '2026-03-25', status: 'Paid' },
  { id: 'INV-2044', patient: 'David Clark', amount: '$200.00', date: '2026-03-28', status: 'Unpaid' },
];

const BillingPage = () => {
  const [bills, setBills] = useState(mockBills);

  const markPaid = (id) => {
    setBills(bills.map(b => b.id === id ? { ...b, status: 'Paid' } : b));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Billing & Invoices</h1>
          <p className="text-slate-500">Manage patient transactions and generate new invoices.</p>
        </div>
        <button className="btn btn-primary px-6">
          + Generate Invoice
        </button>
      </div>

      <div className="card border-none shadow-sm flex-1 bg-white overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-sm">
              <th className="p-4 font-medium pl-6">Invoice #</th>
              <th className="p-4 font-medium">Patient Name</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Total Amount</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {bills.map(bill => (
              <tr key={bill.id} className="hover:bg-slate-50">
                <td className="p-4 pl-6 font-medium text-[#1A2B6D]">{bill.id}</td>
                <td className="p-4 text-slate-700">{bill.patient}</td>
                <td className="p-4 text-slate-500">{bill.date}</td>
                <td className="p-4 font-semibold">{bill.amount}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold
                    ${bill.status === 'Paid' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
                  `}>
                    {bill.status}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right flex justify-end gap-2">
                  {bill.status === 'Unpaid' && (
                    <button onClick={() => markPaid(bill.id)} className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg" title="Process Payment">
                      <CreditCard size={18} />
                    </button>
                  )}
                  <button className="p-2 hover:bg-slate-100 text-slate-500 rounded-lg" title="Download PDF">
                    <Download size={18} />
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

export default BillingPage;
