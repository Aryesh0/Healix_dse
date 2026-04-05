import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { DatabaseContext } from '../../context/DatabaseContext';
import { Users, CalendarCheck, BedDouble, Receipt, TrendingUp, ArrowRight, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const { db } = useContext(DatabaseContext);
  
  const [allPatients, setAllPatients] = useState([]);
  const [availableBeds, setAvailableBeds] = useState(0);
  const logs = db.logs.display();           // Stack Traversal - LIFO Exp 2
  const [dataError, setDataError] = useState('');
  
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening');
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      setDataError('');
      try {
        const [patientsRes, bedsRes] = await Promise.all([
          api.get('/patients'),
          api.get('/beds/summary')
        ]);
        setAllPatients(patientsRes.data.data || []);
        setAvailableBeds(bedsRes.data.data?.available || 0);
      } catch (e) {
        setDataError('Live stats unavailable. Please ensure you are logged in.');
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { title: 'Total Patients (BST Nodes)', value: allPatients.length, icon: <Users size={22} />, iconBg: 'from-blue-400 to-blue-600', bg: 'from-blue-50 to-blue-100/50', badge: 'Indexed globally' },
    { title: 'Stack Activity Logs', value: logs.length, icon: <CalendarCheck size={22} />, iconBg: 'from-teal-400 to-teal-600', bg: 'from-teal-50 to-teal-100/50', badge: 'LIFO Tracked' },
    { title: 'Available Beds (Linked List)', value: availableBeds, icon: <BedDouble size={22} />, iconBg: 'from-green-400 to-green-600', bg: 'from-green-50 to-green-100/50', badge: 'Dynamic Capacity' },
    { title: 'System Alerts', value: 0, icon: <Receipt size={22} />, iconBg: 'from-orange-400 to-orange-500', bg: 'from-orange-50 to-orange-100/50', badge: '0 Pending' },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Premium Welcome Banner */}
      <div className="rounded-2xl p-6 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a3d62 0%, #0d6e8a 60%, #1abc9c 100%)' }}>
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
        <div className="absolute top-4 right-24 w-24 h-24 rounded-full bg-white/5" />
        <div className="relative z-10">
          <p className="text-teal-200 text-sm font-medium">{greeting},</p>
          <h1 className="text-2xl font-bold text-white mt-0.5">{user?.username} <span className="ml-3 text-sm font-medium bg-white/20 px-2 py-0.5 rounded-full border border-white/20">ADMIN SYSTEM</span></h1>
          <p className="text-teal-200/70 text-xs mt-1.5">Full System Overview based on Live Data Structures.</p>
        </div>
      </div>

      {/* Stats Grid */}
      {dataError && (
        <div className="p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100">
          {dataError}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className={`bg-gradient-to-br ${stat.bg} rounded-2xl p-5 border border-white/80 shadow-sm`}>
            <div className="flex justify-between mb-3">
              <p className="text-xs font-semibold text-slate-500 uppercase">{stat.title}</p>
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.iconBg} flex items-center justify-center text-white shadow-md`}>{stat.icon}</div>
            </div>
            <h3 className="text-3xl font-black text-[#0a3d62] mb-2">{stat.value}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 bg-white rounded-full text-[#0a3d62]`}>{stat.badge}</span>
          </div>
        ))}
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80 lg:col-span-2">
            <h2 className="text-base font-bold text-[#0a3d62] mb-4">Patient Indexing (BST Traversal)</h2>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 overflow-y-auto max-h-[300px]">
                {allPatients.map(p => (
                   <div key={p.id} className="p-3 bg-white border border-slate-100 mb-2 rounded-lg flex justify-between shadow-sm">
                      <span className="font-bold text-[#0a3d62]">{p.name}</span>
                      <span className="text-xs text-slate-400">Node ID: {p.id}</span>
                   </div>
                ))}
            </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100/80">
          <h2 className="text-base font-bold text-[#0a3d62] mb-4">Live System Stack (LIFO)</h2>
          <div className="flex flex-col gap-3 overflow-y-auto max-h-[300px]">
            {logs.map((a, i) => (
              <div key={i} className={`flex items-center gap-4 py-3 rounded-xl px-2 transition-colors ${i===0?'bg-orange-50 border border-orange-100':'hover:bg-slate-50'}`}>
                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${a.color}`} />
                <span className="text-sm text-slate-700 flex-1 font-medium">{a.action}</span>
                <span className="text-xs text-slate-400 whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
