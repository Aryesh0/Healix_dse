import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DatabaseContext } from '../../context/DatabaseContext';
import { Activity, CheckCircle2, HeartPulse, PlusCircle, CalendarDays, Clock, Info } from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useContext(AuthContext);
  const { db, bookAppointment, scheduleAppointment } = useContext(DatabaseContext);
  
  const [symptom, setSymptom] = useState('');
  
  // Scheduled Appointments
  const [selectedDocDropdown, setSelectedDocDropdown] = useState('');
  const [selectedSpecialtyDropdown, setSelectedSpecialtyDropdown] = useState('');
  const [aptDate, setAptDate] = useState('');

  const queueList = db.queue.display();
  const queuePos = queueList.findIndex(p => p.name === (user?.username || 'Guest'));
  const isQueued = queuePos !== -1;

  const myAppointments = db.scheduledAppointments.filter(a => a.patientName === (user?.username || 'Guest'));

  const handleWalkIn = (e) => {
    e.preventDefault();
    if (!symptom.trim()) return;
    bookAppointment(user?.username || 'Guest', symptom);
    setSymptom('');
  };

  const handleSchedule = (e) => {
    e.preventDefault();
    if ((!selectedDocDropdown && !selectedSpecialtyDropdown) || !aptDate) return;
    
    let docName = '';
    if (selectedDocDropdown) {
       docName = selectedDocDropdown;
    } else {
       const isSpecialty = db.doctorsMap.find(d => d.specialty.toLowerCase() === selectedSpecialtyDropdown.toLowerCase());
       docName = isSpecialty ? isSpecialty.name : `Any ${selectedSpecialtyDropdown}`;
    }
    
    scheduleAppointment(user?.username || 'Guest', docName, aptDate, 'TBD');
    setSelectedDocDropdown(''); 
    setSelectedSpecialtyDropdown(''); 
    setAptDate(''); 
  };

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full">
      {/* Banner */}
      <div className="bg-gradient-to-br from-[#1abc9c] to-[#0a3d62] rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
        <Activity size={300} className="absolute -right-20 -bottom-20 opacity-10" />
        <h2 className="text-4xl font-black mb-2 relative z-10">Your Health Portal</h2>
        <p className="text-teal-100 text-sm relative z-10 max-w-md mt-4 leading-relaxed">
          Welcome back, {user?.username}. Access your history, monitor upcoming appointments, and track your live waitlist status directly below.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Status Tracker */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center flex flex-col items-center justify-center min-h-[300px]">
             <h3 className="text-lg font-bold text-[#0a3d62] mb-6 flex items-center gap-2"><Clock /> Live Triage Waitlist</h3>
             {isQueued ? (
               <div className="flex flex-col items-center animate-fade-in-up">
                 <div className="w-32 h-32 rounded-full border-[6px] border-teal-500 flex items-center justify-center bg-teal-50 text-teal-600 mb-6 shadow-[0_0_40px_rgba(20,184,166,0.2)]">
                   <span className="text-5xl font-black">{queuePos + 1}</span>
                 </div>
                 <p className="font-semibold text-slate-700 text-lg">You are position #{queuePos + 1} in the waiting room.</p>
                 <p className="text-sm text-slate-400 mt-2 bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">Live linear Search executed over Queue.</p>
               </div>
             ) : (
               <div className="flex flex-col items-center w-full">
                 <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100 shadow-inner">
                    <CheckCircle2 size={30} className="text-green-500 shadow-sm rounded-full" />
                 </div>
                 <p className="font-semibold text-slate-700 mb-4">No immediate Walk-in tracked.</p>
                 
                 {/* Walk-in Enqueue Form */}
                 <form onSubmit={handleWalkIn} className="w-full flex justify-center flex-col gap-2 bg-teal-50/50 p-4 rounded-2xl border border-teal-100">
                   <p className="text-xs font-bold text-teal-700 uppercase mb-1">Queue for Walk-In Waitlist</p>
                   <input type="text" value={symptom} onChange={(e) => setSymptom(e.target.value)} placeholder="Condition / Reason" required className="px-3 py-2 text-sm rounded-lg border border-slate-200" />
                   <button type="submit" className="flex items-center justify-center gap-1.5 p-2 bg-teal-600 text-white rounded-lg text-sm font-bold shadow hover:bg-teal-700"><PlusCircle size={16}/> Enqueue Self</button>
                 </form>
               </div>
             )}
          </div>

          <div className="flex flex-col gap-6">
              {/* Schedule Appointment Block */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 h-full">
                  <h3 className="font-bold text-[#0a3d62] mb-1 flex items-center gap-2"><CalendarDays className="text-blue-500"/> Schedule Appointment</h3>
                  <p className="text-xs text-slate-400 mb-5">Set a date/time using Doctor Name or Specialty (e.g. Neurologist, Dr. Aryesh).</p>
                  
                  <form onSubmit={handleSchedule} className="flex flex-col gap-3">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <select 
                           value={selectedDocDropdown} 
                           onChange={(e) => { setSelectedDocDropdown(e.target.value); setSelectedSpecialtyDropdown(''); }} 
                           className="w-full px-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                           required={!selectedSpecialtyDropdown}
                        >
                           <option value="">Search Doctor</option>
                           {db.doctorsMap.map(d => (
                              <option key={d.id} value={d.name}>{d.name} ({d.specialty})</option>
                           ))}
                        </select>
                        
                        <select 
                           value={selectedSpecialtyDropdown} 
                           onChange={(e) => { setSelectedSpecialtyDropdown(e.target.value); setSelectedDocDropdown(''); }} 
                           className="w-full px-4 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                           required={!selectedDocDropdown}
                        >
                           <option value="">Search by Specialty</option>
                           <option value="Cardiologist">Cardiologist</option>
                           <option value="Neurologist">Neurologist</option>
                           <option value="Gastroenterologist">Gastroenterologist</option>
                           <option value="Dermatologist">Dermatologist</option>
                           <option value="Orthopedic">Orthopedic</option>
                           <option value="Pediatrician">Pediatrician</option>
                           <option value="General">General</option>
                        </select>
                     </div>
                     <div className="relative">
                        <input type="date" value={aptDate} onChange={(e) => setAptDate(e.target.value)} required className="w-full px-3 py-2.5 bg-slate-50 text-sm rounded-xl border border-slate-200" />
                     </div>
                     <button type="submit" className="w-full py-3 bg-[#0a3d62] text-white rounded-xl text-sm font-bold shadow-md hover:bg-[#1A2B6D] transition-all">Book Schedule</button>
                  </form>
                  
                  <div className="mt-4 bg-blue-50 p-3 rounded-xl border border-blue-100 flex items-start gap-2">
                     <Info size={14} className="text-blue-500 mt-0.5" />
                     <p className="text-[10px] text-blue-700 leading-tight">Appointments are pushed to the global <strong>scheduledAppointments</strong> structure.</p>
                  </div>
              </div>
          </div>
      </div>

      {/* Appointment History */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
         <h3 className="font-bold text-[#0a3d62] mb-4 text-lg">My Appointments History</h3>
         {myAppointments.length === 0 ? (
             <p className="text-sm text-slate-400 italic">You have no scheduled appointments.</p>
         ) : (
             <div className="overflow-x-auto">
                 <table className="w-full text-left text-sm">
                     <thead>
                         <tr className="text-slate-400 border-b border-slate-100">
                             <th className="pb-3 font-medium">ID</th>
                             <th className="pb-3 font-medium">Doctor</th>
                             <th className="pb-3 font-medium">Date & Time</th>
                             <th className="pb-3 font-medium">Status</th>
                         </tr>
                     </thead>
                     <tbody>
                         {myAppointments.map(a => (
                             <tr key={a.id} className="border-b border-slate-50 hover:bg-slate-50">
                                 <td className="py-3 font-bold text-blue-600">{a.id}</td>
                                 <td className="py-3 text-slate-700 font-medium">{a.doctor}</td>
                                 <td className="py-3 text-slate-600">{a.date} <span className="text-slate-400 ml-2">{a.time}</span></td>
                                 <td className="py-3">
                                     <span className="px-2.5 py-1 bg-green-50 text-green-600 rounded-lg text-xs font-bold">{a.status}</span>
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
export default PatientDashboard;
