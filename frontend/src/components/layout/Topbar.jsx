import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Bell, Search, HeartPulse } from 'lucide-react';
import { Link } from 'react-router-dom';

const Topbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <header className="sticky top-0 z-10 w-full h-16 bg-white/90 backdrop-blur-sm border-b border-slate-100/80 flex items-center justify-between px-6 shadow-[0_1px_12px_rgba(0,0,0,0.04)]">
      {/* Left: Page context */}
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="text-xs font-medium text-slate-400 hover:text-teal-600 transition-colors flex items-center gap-1.5"
        >
          <span className="text-slate-300">←</span>
          Public Home
        </Link>
        <span className="w-px h-4 bg-slate-200" />
        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
          <HeartPulse size={12} className="text-teal-500" />
          <span className="font-medium text-slate-500">Healix HMS</span>
        </div>
      </div>

      {/* Right: User actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center
            text-slate-500 hover:text-teal-600 hover:border-teal-200 hover:bg-teal-50 transition-all"
          title="Notifications"
        >
          <Bell size={16} strokeWidth={2} />
          {/* badge */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-teal-500 border-2 border-white" />
        </button>

        <div className="h-7 w-px bg-slate-200" />

        {/* User info */}
        <div className="flex items-center gap-2.5">
          <div className="flex flex-col items-end">
            <span className="text-sm font-semibold text-[#0a3d62] leading-none">{user?.username}</span>
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5"
              style={{
                background: 'linear-gradient(135deg, #e0fdf4, #ccfbf1)',
                color: '#0d6e8a',
                border: '1px solid #99f6e4',
              }}
            >
              {user?.role}
            </span>
          </div>

          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold text-white shadow-sm"
            style={{ background: 'linear-gradient(135deg, #0d6e8a, #1abc9c)' }}
          >
            {user?.username?.slice(0, 2).toUpperCase() || 'HX'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
