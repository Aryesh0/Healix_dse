import { useContext, useState } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import { CalendarCheck, Search, Clock, CheckCircle } from 'lucide-react';

const AppointmentsPage = () => {
  const { db, sync } = useContext(DatabaseContext);
  const [searchTerm, setSearchTerm] = useState('');

  const handleComplete = (id) => {
    const apt = db.scheduledAppointments.find(a => a.id === id);
    if(apt) {
        apt.status = 'Completed';
        db.logs.push({ action: `APT ${id} marked completed`, time: new Date().toLocaleTimeString(), type: 'appointment', color: 'bg-green-500' });
        sync();
    }
  };

  const filteredAppointments = db.scheduledAppointments.filter(a => 
    a.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    a.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Appointments</h1>
          <p className="text-slate-500">Live Global Schedule Tracker.</p>
        </div>
      </div>

      <div className="card border-none shadow-sm flex-1 flex flex-col overflow-hidden bg-white rounded-2xl">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by patient or doctor name..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm">
                <th className="p-4 font-medium pl-6">ID</th>
                <th className="p-4 font-medium">Patient</th>
                <th className="p-4 font-medium">Doctor</th>
                <th className="p-4 font-medium">Schedule</th>
                <th className="p-4 font-medium">Type</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppointments.map(app => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6 font-medium text-blue-600">{app.id}</td>
                  <td className="p-4 font-semibold text-[#1A2B6D]">{app.patientName}</td>
                  <td className="p-4 text-slate-600">{app.doctor}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-medium text-slate-700">{app.date}</span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><Clock size={12}/> {app.time}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{app.type}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                      ${app.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' : ''}
                      ${app.status === 'Completed' ? 'bg-green-50 text-green-600' : ''}
                      ${app.status === 'Cancelled' ? 'bg-red-50 text-red-600' : ''}
                    `}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    {app.status === 'Scheduled' && (
                      <button 
                        onClick={() => handleComplete(app.id)}
                        className="p-2 bg-slate-100 hover:bg-green-100 hover:text-green-600 text-slate-400 rounded-lg transition-colors"
                        title="Mark Completed"
                      >
                        <CheckCircle size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {filteredAppointments.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-8 text-center text-slate-400 italic">
                    No scheduled appointments found in the system.
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
export default AppointmentsPage;
