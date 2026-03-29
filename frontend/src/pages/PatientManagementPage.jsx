import { useContext, useState } from 'react';
import { Search, UserPlus, FileText, Activity, Building2 } from 'lucide-react';
import { DatabaseContext } from '../context/DatabaseContext';

const PatientManagementPage = () => {
  const { db, admitPatient } = useContext(DatabaseContext);
  const [searchQuery, setSearchQuery] = useState('');

  const patients = db.patients.getAll();

  const handleAddPatient = () => {
    const name = prompt("Enter Patient Full Name:");
    if (!name) return;
    const reason = prompt("Enter Reason for Visit:");
    const age = prompt("Enter Age or Date of Birth:");
    const blood = prompt("Enter Blood Group (e.g. O+, A-):");
    if (reason) {
      admitPatient(name, reason, age, blood);
    }
  };

  const filteredPatients = patients.filter(p => 
    (p.id && String(p.id).includes(searchQuery)) || 
    (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Patient Management</h1>
          <p className="text-sm text-slate-500">Manage patient records and histories</p>
        </div>
        <button className="btn btn-primary" onClick={handleAddPatient}>
          <UserPlus size={18} />
          Add New Patient
        </button>
      </div>

      <div className="card p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search size={18} />
            </div>
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a3d62] text-white placeholder-teal-100/60 rounded-xl border border-teal-500/30 shadow-inner focus:outline-none focus:ring-2 focus:ring-teal-400" 
              placeholder="Fast search by Patient ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="text-sm text-slate-500 font-medium badge badge-blue py-1.5 px-3">
             DSA: O(1) HashMap Lookup Simulation
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 font-medium text-sm">
                <th className="py-3 px-4">Patient ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Age / Blood</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map(patient => (
                <tr key={patient.id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-blue-600 dark:text-blue-400">{patient.id}</td>
                  <td className="py-3 px-4 font-medium">{patient.name}</td>
                  <td className="py-3 px-4 text-slate-500">{patient.dob || 'N/A'} {patient.bloodGroup ? ` / ${patient.bloodGroup}` : ''}</td>
                  <td className="py-3 px-4">
                    <span className="badge badge-green">Registered</span>
                  </td>
                  <td className="py-3 px-4 flex justify-end gap-2">
                    <button className="btn btn-secondary text-xs px-2 py-1"><FileText size={14}/></button>
                    <button className="btn btn-secondary text-xs px-2 py-1"><Activity size={14}/></button>
                  </td>
                </tr>
              ))}
              {filteredPatients.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-slate-500 italic">
                    No patients found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default PatientManagementPage;
