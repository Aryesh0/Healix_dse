import { useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import { Stethoscope, Phone, Mail, GraduationCap } from 'lucide-react';

const DoctorDirectoryPage = () => {
  const { db } = useContext(DatabaseContext);
  const doctors = db.doctorsMap.map(d => ({
    id: d.id || 'DR-NEW', 
    name: d.name, 
    spec: d.specialty || 'General', 
    exp: d.experience || 'Not Specified', 
    phone: d.phone || 'Not Provided', 
    email: d.email || 'Not Provided', 
    status: d.days?.length > 0 ? 'Available' : 'No Schedule',
    days: d.days,
    hours: d.hours
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Doctor Directory</h1>
          <p className="text-slate-500">Manage hospital medical staff and view specializations.</p>
        </div>
        <button className="btn btn-primary px-6">
          + Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map(doc => (
          <div key={doc.id} className="card bg-white p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <span className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full flex items-center gap-1.5
                ${doc.status === 'Available' ? 'bg-green-50 text-green-600' : ''}
                ${doc.status === 'In Surgery' ? 'bg-red-50 text-red-600' : ''}
                ${doc.status === 'Consulting' ? 'bg-orange-50 text-orange-600' : ''}
                ${doc.status === 'On Leave' ? 'bg-slate-100 text-slate-500' : ''}
              `}>
                <span className={`w-1.5 h-1.5 rounded-full
                  ${doc.status === 'Available' ? 'bg-green-500' : ''}
                  ${doc.status === 'In Surgery' ? 'bg-red-500' : ''}
                  ${doc.status === 'Consulting' ? 'bg-orange-500' : ''}
                  ${doc.status === 'On Leave' || doc.status === 'No Schedule' ? 'bg-slate-400' : ''}
                `}></span>
                {doc.status}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-4 mt-2">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 text-[#2E5BFF] flex items-center justify-center border-2 border-blue-100">
                <Stethoscope size={28} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-[#1A2B6D]">{doc.name}</h3>
                <p className="text-blue-600 font-medium text-sm">{doc.spec}</p>
              </div>
            </div>

            <div className="space-y-3 mt-6 border-t border-slate-100 pt-4">
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <GraduationCap size={16} className="text-slate-400" />
                <span><strong className="text-slate-700">Experience:</strong> {doc.exp}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Phone size={16} className="text-slate-400" />
                <span>{doc.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm">
                <Mail size={16} className="text-slate-400" />
                <span>{doc.email}</span>
              </div>
            </div>
            
            <div className="mt-6 bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Active Schedule</p>
                {doc.days?.length > 0 ? (
                    <>
                       <p className="font-medium text-[#1A2B6D]">{doc.days.join(', ')}</p>
                       <p className="text-slate-500 text-xs mt-1">{doc.hours}</p>
                    </>
                ) : (
                    <p className="text-slate-400 italic">No schedule configured.</p>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DoctorDirectoryPage;
