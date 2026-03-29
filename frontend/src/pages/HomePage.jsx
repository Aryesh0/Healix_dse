import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { DatabaseContext } from '../context/DatabaseContext';
import { 
  HeartPulse, Database, Activity, GitFork, 
  Layers, Users, Stethoscope, ArrowRight, CheckCircle2 
} from 'lucide-react';

const HomePage = () => {
  const { db } = useContext(DatabaseContext);

  const stats = [
    { label: 'Registered Patients', value: db.patients.size, icon: <Users size={24} /> },
    { label: 'Active Specialists', value: db.doctorsMap.length, icon: <Stethoscope size={24} /> },
    { label: 'Current Queue Activity', value: db.queue.display().length, icon: <Activity size={24} /> },
    { label: 'Total Logs', value: db.logs.display().length, icon: <Database size={24} /> }
  ];

  const features = [
    {
      title: 'O(log N) Patient Indexing',
      desc: 'Instant patient medical record lookups driven by custom Binary Search Tree deployments ensuring scaling efficiency.',
      icon: <GitFork size={28} />
    },
    {
      title: 'Constant Time Triage Queue',
      desc: 'Lifesaving clinical queues powered by Priority Queue architecture. Emergencies automatically skip standard lines instantly.',
      icon: <Activity size={28} />
    },
    {
      title: 'LIFO Medical Audit Stack',
      desc: 'Total transparency into the global system with our native Stack implementations tracking every admission and discharge in real-time.',
      icon: <Layers size={28} />
    }
  ];

  return (
    <div className="min-h-screen font-sans bg-slate-50 flex flex-col selection:bg-teal-500 selection:text-white">
      
      {/* Navigation Layer */}
      <nav className="fixed w-full z-50 transition-all py-4 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md shadow-teal-500/20" style={{ background: 'linear-gradient(135deg, #0a3d62 0%, #1abc9c 100%)' }}>
                 <HeartPulse size={20} className="text-white" />
              </div>
              <div>
                <span className="font-bold text-[#0a3d62] text-xl leading-none block">Healix</span>
                <span className="text-[10px] font-bold tracking-widest uppercase text-teal-600">Core Systems</span>
              </div>
           </div>
           <div className="flex gap-4 items-center">
              <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-[#0a3d62] transition-colors">Sign In</Link>
              <Link to="/register" className="text-sm font-bold text-white px-5 py-2.5 rounded-lg shadow-lg shadow-teal-500/30 hover:scale-105 transition-all" style={{ background: 'linear-gradient(135deg, #0d6e8a 0%, #1abc9c 100%)' }}>
                 Get Access
              </Link>
           </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 overflow-hidden flex-1 flex flex-col justify-center" style={{ background: 'linear-gradient(135deg, #f0fdf9 0%, #e0fdf4 50%, #ecfeff 100%)' }}>
         <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-white rounded-full opacity-60 mix-blend-overlay -translate-y-1/2 translate-x-1/3 blur-3xl" />
         <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-teal-200 rounded-full opacity-30 mix-blend-multiply translate-y-1/2 -translate-x-1/4 blur-3xl" />
         
         <div className="max-w-7xl mx-auto px-6 relative z-10 w-full flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="max-w-3xl">
               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-teal-200 shadow-sm mb-6">
                  <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                  <span className="text-xs font-bold text-teal-700 uppercase tracking-wider">Live Algorithmic State</span>
               </div>
               
               <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-[#0a3d62] leading-[1.1] mb-6">
                  Next-generation<br/>clinical <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg, #0d6e8a 0%, #1abc9c 100%)' }}>routing & logic</span>.
               </h1>
               
               <p className="text-lg text-slate-600 mb-10 max-w-xl leading-relaxed">
                  Healix is a high-performance hospital management portal powered purely by foundational Data Structures & Algorithms. Experience real-time triage processing without the bloat.
               </p>
               
               <div className="flex flex-wrap gap-4 items-center">
                  <Link to="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white shadow-xl shadow-teal-500/30 hover:scale-105 hover:-translate-y-1 transition-all" style={{ background: 'linear-gradient(135deg, #0d6e8a 0%, #1abc9c 100%)' }}>
                     Open Portal <ArrowRight size={18} />
                  </Link>
               </div>
               
               {/* Quick Checks */}
               <div className="flex flex-wrap gap-6 mt-10">
                   {['Role-based Access Control', 'No Database Setup Needed', 'Real-time Global Sync'].map(term => (
                       <span key={term} className="flex items-center gap-2 text-sm font-semibold text-slate-600">
                           <CheckCircle2 size={16} className="text-teal-500" /> {term}
                       </span>
                   ))}
               </div>
            </div>

            {/* Right Logo Element */}
            <div className="hidden lg:flex justify-center items-center relative shrink-0">
               <div className="absolute inset-0 bg-teal-500/10 blur-3xl rounded-full scale-150" />
               <div className="w-80 h-80 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-teal-900/10 relative z-10 border-[10px] border-white/60 backdrop-blur-sm transform rotate-3" style={{ background: 'linear-gradient(135deg, #0d6e8a 0%, #1abc9c 100%)' }}>
                  <div className="absolute inset-0 rounded-[2rem] border border-white/20" />
                  <HeartPulse size={140} className="text-white drop-shadow-lg transform -rotate-3" />
               </div>
            </div>
         </div>
      </div>

      {/* Dynamic Data Counters (Direct from Context) */}
      <div className="relative z-20 -mt-10 max-w-7xl mx-auto px-6 w-full">
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-slate-100">
              {stats.map((stat, i) => (
                 <div key={i} className={`flex flex-col items-center justify-center text-center ${i===0?'pl-0':''}`}>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
                        {stat.icon}
                    </div>
                    <h3 className="text-3xl font-black text-[#0a3d62] mb-1">{stat.value}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                 </div>
              ))}
          </div>
      </div>

      {/* Internal Architecture Features */}
      <div className="py-24 bg-slate-50 relative">
         <div className="max-w-7xl mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto mb-16">
               <h2 className="text-3xl md:text-4xl font-black text-[#0a3d62] mb-4">Pure Computer Science under the hood.</h2>
               <p className="text-slate-600">No jargon. No black-box AI logic. Healix routes patients and tracks bed capacity securely natively mimicking the fastest algorithms in tech.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
               {features.map((feature, i) => (
                  <div key={i} className="bg-white border border-slate-200 rounded-3xl p-8 hover:shadow-xl hover:shadow-teal-500/10 transition-all hover:-translate-y-1 group">
                     <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0a3d62] to-[#0d6e8a] flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-900/20 group-hover:scale-110 transition-transform">
                        {feature.icon}
                     </div>
                     <h3 className="text-xl font-bold text-[#0a3d62] mb-3">{feature.title}</h3>
                     <p className="text-slate-600 leading-relaxed text-sm">
                        {feature.desc}
                     </p>
                  </div>
               ))}
            </div>
         </div>
      </div>

      <footer className="bg-[#0a3d62] text-white py-12 border-t border-blue-900">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
             <div className="md:col-span-2">
                 <div className="flex items-center gap-3 mb-4">
                    <HeartPulse size={24} className="text-teal-400" />
                    <span className="font-bold text-xl">Healix Core</span>
                 </div>
                 <p className="text-blue-200/60 text-sm max-w-sm">
                    A conceptual hospital triage and management interface demonstrating real-world applications of fundamental Computer Science algorithms.
                 </p>
             </div>
             <div>
                 <h4 className="font-bold mb-4 text-teal-300">Portals</h4>
                 <ul className="space-y-2 text-sm text-blue-200/80">
                     <li><Link to="/register" className="hover:text-white transition-colors">Patient Registration</Link></li>
                     <li><Link to="/login" className="hover:text-white transition-colors">Staff Login</Link></li>
                     <li><Link to="/dashboard" className="hover:text-white transition-colors">Access Dashboards</Link></li>
                 </ul>
             </div>
             <div>
                 <h4 className="font-bold mb-4 text-teal-300">Systems</h4>
                 <ul className="space-y-2 text-sm text-blue-200/80">
                     <li>Queue Manager</li>
                     <li>Bed Management (LL)</li>
                     <li>Doctor Master Map</li>
                 </ul>
             </div>
         </div>
         <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/10 text-center text-xs text-blue-200/40">
            © 2026 Healix System Framework
         </div>
      </footer>

    </div>
  );
};
export default HomePage;
