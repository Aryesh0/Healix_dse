import { useContext } from 'react';
import { DatabaseContext } from '../context/DatabaseContext';
import { AlertCircle, UserCheck, Clock, ArrowUpCircle } from 'lucide-react';

const QueueManagementPage = () => {
  const { db, seeDoctor, markAsEmergency, sync } = useContext(DatabaseContext);

  const queueItems = db.queue.display();
  const priorityQueue = queueItems.filter(p => p.isEmergency);
  const standardQueue = queueItems.filter(p => !p.isEmergency);

  const handleNextInPriority = () => {
    // In our single-array priority queue, emergency items are always at the front.
    // Dequeuing will naturally pop the first emergency item.
    seeDoctor();
    sync();
  };

  const handleNextInStandard = () => {
    // For standard, we just pop the next one available. 
    seeDoctor();
    sync();
  };

  const bumpToPriority = (id, name) => {
    markAsEmergency(id, name);
  };


  return (
    <div className="flex flex-col gap-6">
      
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-1">Queue Management</h1>
          <p className="text-sm text-slate-500">Live DSA visualization of patient routing</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Priority Queue Column */}
        <div className="card shadow-lg shadow-red-500/5 border-red-200 dark:border-red-900/30 overflow-hidden">
          <div className="bg-red-50 dark:bg-red-900/20 p-4 border-b border-red-100 dark:border-red-900/50 flex justify-between items-center">
            <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold">
              <AlertCircle size={20} />
              Emergency Queue
            </div>
            <div className="text-xs font-semibold badge badge-red">DSA: Priority Queue</div>
          </div>
          
          <div className="p-4 flex flex-col gap-3">
            {priorityQueue.length === 0 ? (
              <div className="text-center py-8 text-slate-400 italic">No emergencies</div>
            ) : (
              priorityQueue.map(p => (
                <div key={p.id} className="p-4 rounded-lg border border-red-100 bg-white dark:bg-slate-800 dark:border-slate-700 flex justify-between items-center animate-in fade-in slide-in-from-right-4">
                  <div>
                    <h3 className="font-bold text-red-600 dark:text-red-400 mb-1">{p.name}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="badge bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">Level 1 Triage</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">Reason: {p.reason}</span>
                    </div>
                  </div>
                  <button className="btn btn-danger py-1" onClick={handleNextInPriority}>
                    <UserCheck size={16} /> Treat Next
                  </button>
                </div>
              ))
            )}
            
            {priorityQueue.length > 0 && (
              <div className="mt-2 text-xs text-center text-slate-400">
                Patients are served based on priority logic, not arrival time.
              </div>
            )}
          </div>
        </div>

        {/* Standard Queue Column */}
        <div className="card overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold">
              <Clock size={20} className="text-blue-500" />
              Standard Queue
            </div>
            <div className="text-xs font-semibold badge badge-blue">DSA: FIFO Linked List</div>
          </div>

          <div className="p-4 flex flex-col gap-3">
             {standardQueue.length === 0 ? (
              <div className="text-center py-8 text-slate-400 italic">Queue is empty</div>
            ) : (
              standardQueue.map((p, idx) => (
                <div key={p.id} className="p-4 rounded-lg border border-slate-100 bg-white dark:bg-slate-800 dark:border-slate-700 flex justify-between items-center hover:border-blue-200 transition-colors">
                  <div>
                    <h3 className="font-bold mb-1">{p.name}</h3>
                    <div className="text-xs text-slate-500 flex items-center gap-3">
                      <span>Reason: {p.reason}</span>
                      <span>ID: {p.id}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      className="btn btn-secondary py-1 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      onClick={() => bumpToPriority(p.id, p.name)}
                      title="Bump to Emergency Priority Queue"
                    >
                      <ArrowUpCircle size={18} />
                    </button>
                    {idx === 0 && priorityQueue.length === 0 && (
                      <button className="btn btn-primary py-1" onClick={handleNextInStandard}>
                        <UserCheck size={16} /> Serve
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
            
            {standardQueue.length > 0 && (
              <div className="mt-2 text-xs text-center text-slate-400">
                Patients are served strictly in First-In-First-Out (FIFO) order.
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default QueueManagementPage;
