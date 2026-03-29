import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DatabaseContext } from '../../context/DatabaseContext';
import { CalendarCheck, UserMinus, Search, Clock, Users, Activity, CalendarDays, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const { db, seeDoctor, sync, updateDoctorAvailability } = useContext(DatabaseContext);
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const nextPatient = db.queue.front();
  const queueLength = db.queue.display().length;
  
  const doctorInfo = db.doctorsMap.find(d => d.name === `Dr. ${user?.username}`);
  const specialty = doctorInfo?.specialty || 'PHYSICIAN';

  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId) return;
    navigate(`/records?query=${encodeURIComponent(searchId)}`);
  };

  const myAppointments = db.scheduledAppointments.filter(a => a.doctor === `Dr. ${user?.username}`);

  const handleComplete = (id) => {
    const apt = db.scheduledAppointments.find(a => a.id === id);
    if(apt) {
        apt.status = 'Completed';
        db.logs.push({ action: `APT ${id} marked completed by Dr`, time: new Date().toLocaleTimeString(), type: 'appointment', color: 'bg-green-500' });
        sync();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Premium Welcome Banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a3d62 0%, #0d6e8a 60%, #1abc9c 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-4 right-24 w-24 h-24 rounded-full bg-white/5" />
        <div className="flex items-center justify-between relative z-10">
          <div>
             <p className="text-teal-200 text-sm font-medium">{greeting},</p>
             <h1 className="text-2xl font-bold text-white mt-0.5">Dr. {user?.username} <span className="ml-3 text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full border border-white/20 uppercase">{specialty}</span></h1>
             <p className="text-teal-200/70 text-xs mt-1.5">Your Clinical Waiting Queue (FIFO) is updated live.</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
            <Activity className="text-teal-200" size={22} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Patient Card (FIFO Dequeue) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 lg:col-span-2 flex flex-col justify-center bg-gradient-to-br from-teal-50 to-white">
          <h2 className="text-lg font-bold text-[#0a3d62] mb-1 flex items-center gap-2"><Clock /> Active Queue Manager (Exp 4)</h2>
          <p className="text-xs text-slate-400 mb-6">You currently have {queueLength} patients waiting.</p>
          
          {nextPatient === "No elements" ? (
            <div className="text-center p-10 bg-white rounded-xl border border-teal-100 shadow-sm">
              <p className="text-teal-600 font-bold">You have cleared the queue!</p>
            </div>
          ) : (
            <div className={`bg-white p-5 rounded-xl border shadow-sm mb-4 relative ${nextPatient.isEmergency ? 'border-red-400 bg-red-50/30' : 'border-teal-100'}`}>
              <div className="flex justify-between items-start">
                  <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${nextPatient.isEmergency ? 'text-red-600' : 'text-teal-600'}`}>FRONT OF QUEUE</p>
                  {nextPatient.isEmergency && <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black shadow border border-white tracking-widest animate-pulse">EMERGENCY</span>}
              </div>
              <h3 className={`text-3xl font-black ${nextPatient.isEmergency ? 'text-red-700' : 'text-[#0a3d62]'}`}>{nextPatient.name}</h3>
              <p className="text-sm text-slate-500 mt-2">Symptom/Reason: <span className="font-medium text-slate-700">{nextPatient.reason}</span></p>
              <p className="text-xs text-slate-400 mt-2">Internal ID: {nextPatient.id}</p>
            </div>
          )}

          <button 
            onClick={() => seeDoctor()}
            disabled={nextPatient === "No elements"}
            className="w-full btn bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 py-3 rounded-xl flex justify-center gap-2 font-bold shadow-md shadow-blue-200"
          >
            <UserMinus size={18} /> Call Next Patient (Dequeue)
          </button>
        </div>

        <div className="flex flex-col gap-6">
          {/* BST Lookup Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80">
            <h2 className="text-base font-bold text-[#0a3d62] mb-1"><Search size={18} className="inline mr-1"/> Patient Records</h2>
            <p className="text-[11px] text-slate-400 mb-5 tracking-widest uppercase font-bold text-orange-500">Exp 6: O(log N) BST Lookup</p>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <input 
                type="text" value={searchId} onChange={e => setSearchId(e.target.value)}
                placeholder="Enter APT ID, Patient ID, or Name" className="flex-1 px-3 py-2 border rounded-lg text-sm"
              />
              <button type="submit" className="btn bg-slate-900 text-white hover:bg-slate-800 px-4">Find</button>
            </form>
          </div>

          {/* Working Hours Card */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 h-full">
            <h2 className="text-base font-bold text-[#0a3d62] mb-1"><CalendarCheck size={18} className="inline mr-1"/> Configure Availability</h2>
            <p className="text-[11px] text-slate-400 mb-4 tracking-widest uppercase font-bold text-teal-600">Syncs to Appointment Portal</p>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              updateDoctorAvailability(`Dr. ${user?.username}`, e.target.days.value.split(',').map(d => d.trim()), e.target.hours.value);
              e.target.reset();
            }} className="flex flex-col gap-3">
              <input name="days" placeholder="Days (e.g. Mon, Wed, Fri)" required className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              <input name="hours" placeholder="Hours (e.g. 09:00-14:00)" required className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
              <button type="submit" className="bg-teal-600 hover:bg-teal-700 py-2 rounded-lg text-white font-bold text-sm">Save Hours</button>
            </form>

            <div className="mt-4 p-4 bg-teal-50/50 border border-teal-100 rounded-xl text-sm">
                <p className="text-teal-700 text-[10px] uppercase font-bold tracking-widest mb-2">Current Active Schedule</p>
                <div className="flex flex-col gap-1.5 shadow-sm bg-white p-3 rounded-lg border border-teal-50">
                   <p className="text-slate-600"><span className="font-semibold text-slate-800">Days:</span> {doctorInfo?.days?.join(', ') || 'Not Set'}</p>
                   <p className="text-slate-600"><span className="font-semibold text-slate-800">Hours:</span> {doctorInfo?.hours || 'Not Set'}</p>
                </div>
            </div>
          </div>
        </div>
      </div>

      {/* My Scheduled Appointments Section */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
         <h3 className="font-bold text-[#0a3d62] mb-4 text-lg flex items-center gap-2"><CalendarDays className="text-blue-500"/> My Scheduled Consultations</h3>
         {myAppointments.length === 0 ? (
             <p className="text-sm text-slate-400 italic">You have no scheduled appointments at this time.</p>
         ) : (
             <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                     <thead>
                         <tr className="text-slate-400 border-b border-slate-100">
                             <th className="pb-3 font-medium">ID</th>
                             <th className="pb-3 font-medium">Patient</th>
                             <th className="pb-3 font-medium">Date & Time</th>
                             <th className="pb-3 font-medium">Status</th>
                             <th className="pb-3 font-medium text-right">Action</th>
                         </tr>
                     </thead>
                     <tbody>
                         {myAppointments.map(a => (
                             <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                                 <td className="py-3 font-bold text-blue-600">{a.id}</td>
                                 <td className="py-3 text-slate-700 font-medium">{a.patientName}</td>
                                 <td className="py-3 text-slate-600">{a.date} <span className="text-slate-400 ml-2">{a.time}</span></td>
                                 <td className="py-3">
                                     <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${a.status === 'Scheduled' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>{a.status}</span>
                                 </td>
                                 <td className="py-3 text-right">
                                    {a.status === 'Scheduled' && (
                                      <button 
                                        onClick={() => handleComplete(a.id)}
                                        className="p-1.5 bg-slate-100 hover:bg-green-100 hover:text-green-600 text-slate-400 rounded-lg transition-colors"
                                        title="Mark Completed"
                                      >
                                        <CheckCircle size={16} />
                                      </button>
                                    )}
                                 </td>
                             </tr>
                         ))}
                     </tbody>
                 </table>
             </div>
         )}
      </div>

    </div>
  );
};
export default DoctorDashboard;
