import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DatabaseContext } from '../../context/DatabaseContext';
import { Users, Plus, LayoutGrid, Clock, ArrowRight, AlertTriangle, ArrowUpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const weekData = [
  { day: 'Mon', patients: 120 }, { day: 'Tue', patients: 132 }, { day: 'Wed', patients: 101 },
  { day: 'Thu', patients: 143 }, { day: 'Fri', patients: 190 }, { day: 'Sat', patients: 230 }, { day: 'Sun', patients: 154 }
];
const MAX = Math.max(...weekData.map(d => d.patients));
const MiniBarChart = () => (
  <div className="flex items-end gap-2 h-40 w-full px-1 pt-4">
    {weekData.map((d, i) => (
      <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
        <span className="text-[10px] text-slate-400 font-medium">{d.patients}</span>
        <div className="w-full rounded-t-lg transition-all duration-700 bg-gradient-to-t from-[#0d6e8a] to-[#1abc9c]"
             style={{ height: `${(d.patients / MAX) * 100}%`, opacity: i === 6 ? 1 : 0.55 + (d.patients / MAX) * 0.45 }}/>
        <span className="text-[10px] text-slate-500 font-semibold">{d.day}</span>
      </div>
    ))}
  </div>
);

const ReceptionistDashboard = () => {
  const { user } = useContext(AuthContext);
  const { db, admitPatient, admitEmergency, markAsEmergency } = useContext(DatabaseContext);
  const [name, setName] = useState('');
  const [reason, setReason] = useState('');
  
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  const queueList = db.queue.display();

  const handleAdd = (e, isEmergency = false) => {
    e.preventDefault();
    if (!name.trim()) return;
    if (isEmergency) {
      admitEmergency(name, reason || 'Emergency Triage');
    } else {
      admitPatient(name, reason || 'General Checkup');
    }
    setName(''); setReason('');
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Premium Welcome Banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a3d62 0%, #0d6e8a 60%, #1abc9c 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-4 right-24 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative z-10">
          <p className="text-teal-200 text-sm font-medium">{greeting},</p>
          <h1 className="text-2xl font-bold text-white mt-0.5">{user?.username} <span className="ml-3 text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full border border-white/20">RECEPTIONIST</span></h1>
          <p className="text-teal-200/70 text-xs mt-1.5">Manage live hospital admissions and priority triage tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Registration Form (Enqueue) */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80">
          <h2 className="text-base font-bold text-[#0a3d62] mb-1">Admit New Patient</h2>
          <p className="text-xs text-orange-500 font-bold mb-5 uppercase tracking-widest bg-orange-50 inline-block px-1.5 rounded">Exp 4 Enqueue</p>
          
          <form className="flex flex-col gap-3">
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" required 
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white" />
            <input type="text" value={reason} onChange={e => setReason(e.target.value)} placeholder="Condition (Optional)" 
                   className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-teal-400 focus:bg-white" />
            <div className="flex gap-2 mt-2 flex-col xl:flex-row">
              <button type="button" onClick={(e) => handleAdd(e, false)} className="flex-1 btn btn-primary bg-gradient-to-r from-[#0d6e8a] to-[#1abc9c] border-none text-white font-bold py-3 shadow border border-teal-500">
                NORMAL
              </button>
              <button type="button" onClick={(e) => handleAdd(e, true)} className="flex-1 btn bg-red-600 hover:bg-red-700 text-white font-bold py-3 shadow border border-red-700">
                <AlertTriangle size={14} className="inline mr-1"/> EMG (JUMP)
              </button>
            </div>
          </form>
        </div>

        {/* Live Traffic */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 lg:col-span-2">
           <h2 className="text-base font-bold text-[#0a3d62] mb-1">Hospital Traffic Overview</h2>
           <MiniBarChart />
        </div>
      </div>

      {/* Visual Live Queue Track (FIFO / Priority) */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80">
         <h2 className="text-base font-bold text-[#0a3d62] mb-2 flex items-center gap-2"><Clock/> Priority Queue (Triage Waitlist)</h2>
         <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex gap-3 overflow-x-auto min-h-[160px] items-center">
             {queueList.length === 0 ? <p className="m-auto text-slate-400 italic font-medium">No patients currently queued.</p> : null}
             {queueList.map((p, idx) => (
                <div key={p.id} className={`shrink-0 bg-white border ${p.isEmergency ? 'border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-teal-200 shadow-sm'} p-4 rounded-xl w-48 relative animate-fade-in-up flex flex-col justify-between`}>
                    {idx === 0 && <span className="absolute -top-2.5 -left-2 bg-teal-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow border border-white">FRONT</span>}
                    {idx === queueList.length-1 && queueList.length>1 && <span className="absolute -top-2.5 -right-2 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow border border-white">REAR</span>}
                    {p.isEmergency && <span className="absolute -top-2.5 right-2 bg-red-500 text-white text-[9px] px-2 py-0.5 rounded-full font-black shadow border border-white tracking-widest"><AlertTriangle size={10} className="inline"/> EMG</span>}
                    
                    <div>
                      <h3 className={`font-black truncate ${p.isEmergency ? 'text-red-700' : 'text-[#0a3d62]'}`}>{p.name}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">ID: {p.id}</p>
                    </div>

                    {!p.isEmergency && idx !== 0 && (
                      <button onClick={() => markAsEmergency(p.id, p.name)} className="mt-3 w-full border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-[10px] font-bold py-1.5 rounded flex items-center justify-center gap-1 transition-colors">
                        <ArrowUpCircle size={12}/> Prioritize (Jump Line)
                      </button>
                    )}
                </div>
             ))}
         </div>
      </div>
    </div>
  );
};
export default ReceptionistDashboard;
