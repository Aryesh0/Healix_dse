import { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { DatabaseContext } from '../context/DatabaseContext';
import { Search, FileText, UserSquare2, Activity, Clock, ShieldAlert, CalendarCheck } from 'lucide-react';

const PatientRecordsPage = () => {
  const { db } = useContext(DatabaseContext);
  const location = useLocation();
  const navigate = useNavigate();
  
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || '';
  
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [patientData, setPatientData] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    } else {
      setPatientData(null);
      setHistory([]);
    }
    setSearchInput(initialQuery);
  }, [initialQuery, db.scheduledAppointments, db.patients]);

  const performSearch = (q) => {
    let resolvedName = '';
    let resolvedPatient = null;
    
    // 1. Is it an Appointment ID?
    if (q.toUpperCase().startsWith('APT-')) {
      const apt = db.scheduledAppointments.find(a => a.id === q.toUpperCase());
      if (apt) resolvedName = apt.patientName;
    } 
    // 2. Is it a Patient ID (number)?
    else if (!isNaN(q) && q.trim().length > 0) {
      resolvedPatient = db.patients.search(db.patients.root, parseInt(q));
      if (resolvedPatient) resolvedName = resolvedPatient.name;
    } 
    // 3. Assume it's a Name
    else {
      resolvedName = q;
    }

    if (!resolvedName) {
      setPatientData(null);
      setHistory([]);
      return;
    }

    // Try finding exact node by name if we don't have it yet (not efficient in BST but good for mock)
    if (!resolvedPatient) {
        const allPatients = db.patients.getAll();
        resolvedPatient = allPatients.find(p => p.name.toLowerCase() === resolvedName.toLowerCase());
    }

    setPatientData(resolvedPatient || { name: resolvedName, dob: 'Unknown', id: 'UNREGISTERED' });

    // Find History
    const apts = db.scheduledAppointments.filter(a => a.patientName.toLowerCase() === resolvedName.toLowerCase());
    setHistory(apts);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if(searchInput.trim()) {
        navigate(`/records?query=${encodeURIComponent(searchInput)}`);
    } else {
        navigate(`/records`);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold mb-1">Patient Health Records</h1>
          <p className="text-slate-500">Search and view comprehensive patient history and diagnosis.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-2">
         <form onSubmit={handleSearchSubmit} className="flex gap-3 max-w-2xl">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter Appointment ID (APT-...), Patient ID, or Name..." 
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
            </div>
            <button type="submit" className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-all shadow-md">
                Retrieve Records
            </button>
         </form>
      </div>

      {initialQuery && !patientData && (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
             <ShieldAlert size={40} className="mx-auto mb-3 opacity-50" />
             <h3 className="text-lg font-bold">No Records Found</h3>
             <p className="text-sm">We couldn't locate any records matching "{initialQuery}". Please try another ID or Name.</p>
          </div>
      )}

      {patientData && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             {/* Patient Overview */}
             <div className="lg:col-span-1 flex flex-col gap-6">
                <div className="bg-gradient-to-br from-[#0a3d62] to-[#0d6e8a] rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                   <UserSquare2 size={120} className="absolute -right-6 -bottom-6 opacity-10" />
                   <p className="text-teal-200 text-xs font-bold tracking-widest uppercase mb-4">Patient Profile</p>
                   <h2 className="text-2xl font-black mb-1">{patientData.name}</h2>
                   <p className="text-teal-100 text-sm mb-6">DOB: {patientData.dob || 'Not Provided'}</p>
                   
                   <div className="bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
                      <p className="text-xs text-teal-100 uppercase tracking-wider mb-1">System ID</p>
                      <p className="font-mono font-bold text-lg">{patientData.id}</p>
                   </div>
                </div>

                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex-1">
                    <h3 className="font-bold text-[#0a3d62] text-sm flex items-center gap-2 mb-4"><Activity size={16}/> Clinical Notes & Diagnosis</h3>
                    <div className="bg-yellow-50/50 border border-yellow-100 p-4 rounded-xl text-sm text-slate-700 h-[200px] overflow-y-auto">
                        <p className="italic text-slate-400 mb-2">// Auto-generated summary from recent visits</p>
                        {history.length > 0 ? (
                            <ul className="list-disc pl-4 space-y-2 text-slate-600">
                                <li><strong>Chief Complaint:</strong> {history[0].type || 'Consultation'} related issues.</li>
                                <li><strong>Vitals:</strong> Stable across recorded visits.</li>
                                <li><strong>Plan:</strong> Monitor via scheduled follow-ups. See appointment history for details.</li>
                            </ul>
                        ) : (
                            <p>No available clinical notes for this patient.</p>
                        )}
                    </div>
                </div>
             </div>

             {/* Appointment History */}
             <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                 <h3 className="font-bold text-[#0a3d62] mb-6 text-lg flex items-center gap-2"><Clock className="text-teal-500"/> Lifetime Appointment History</h3>
                 
                 {history.length === 0 ? (
                     <p className="text-slate-400 italic bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">There is no past appointment history recorded for this patient.</p>
                 ) : (
                     <div className="relative">
                         <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-100 rounded-full"></div>
                         <div className="flex flex-col gap-6 relative z-10">
                            {history.slice().reverse().map((apt, idx) => (
                                <div key={apt.id} className="relative pl-10">
                                    <div className={`absolute left-2.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${apt.status === 'Completed' ? 'bg-green-500' : apt.status === 'Cancelled' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                    <div className="bg-slate-50 border border-slate-100 p-4 rounded-2xl hover:shadow-md transition-shadow">
                                       <div className="flex justify-between items-start mb-2">
                                           <div>
                                               <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase mb-2 inline-block ${apt.status === 'Completed' ? 'bg-green-100 text-green-700' : apt.status === 'Cancelled' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                                   {apt.status}
                                               </span>
                                               <h4 className="font-bold text-slate-800 text-base">{apt.type || 'Consultation'} with {apt.doctor}</h4>
                                           </div>
                                           <span className="text-xs font-mono text-slate-400 bg-white px-2 py-1 rounded border border-slate-200">{apt.id}</span>
                                       </div>
                                       <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-2">
                                           <CalendarCheck size={14} className="text-slate-400"/> {apt.date} at {apt.time}
                                       </p>
                                    </div>
                                </div>
                            ))}
                         </div>
                     </div>
                 )}
             </div>
          </div>
      )}
    </div>
  );
};
export default PatientRecordsPage;
