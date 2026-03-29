import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard, Users, UserRoundCog, HeartPulse,
  BedDouble, CalendarCheck, Receipt, Package, Clock, LogOut, FileText
} from 'lucide-react';

const Sidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const role = user?.role;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={19} />, roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'] },
    { name: 'Patients', path: '/patients', icon: <Users size={19} />, roles: ['ADMIN', 'RECEPTIONIST'] },
    { name: 'Patient Records', path: '/records', icon: <FileText size={19} />, roles: ['ADMIN', 'DOCTOR'] },
    { name: 'Doctors', path: '/doctors', icon: <UserRoundCog size={19} />, roles: ['ADMIN'] },
    { name: 'Appointments', path: '/appointments', icon: <CalendarCheck size={19} />, roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT'] },
    { name: 'Waiting Queue', path: '/queue', icon: <Clock size={19} />, roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST'] },
    { name: 'Billing', path: '/billing', icon: <Receipt size={19} />, roles: ['ADMIN', 'RECEPTIONIST'] },
    { name: 'Pharmacy', path: '/inventory', icon: <Package size={19} />, roles: ['ADMIN'] },
    { name: 'Wards & Beds', path: '/wards', icon: <BedDouble size={19} />, roles: ['ADMIN'] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(role));

  const initials = user?.username?.slice(0, 2).toUpperCase() || 'HX';

  return (
    <aside
      className="fixed left-0 top-0 h-full w-[240px] flex flex-col z-20 border-r border-white/10"
      style={{ background: 'linear-gradient(180deg, #0a3d62 0%, #0b4f7a 60%, #0d6e8a 100%)' }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'linear-gradient(135deg, #1abc9c, #0d6e8a)' }}>
            <HeartPulse size={20} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-base leading-tight">Healix</div>
            <div className="text-teal-300/70 text-[10px] font-medium">Hospital Management</div>
          </div>
        </div>
      </div>

      {/* User Card */}
      <div className="mx-3 mt-4 p-3 rounded-xl bg-white/10 border border-white/10 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
          style={{ background: 'linear-gradient(135deg, #1abc9c, #16a085)' }}>
          {initials}
        </div>
        <div className="overflow-hidden">
          <div className="text-white text-sm font-semibold truncate">{user?.username}</div>
          <div className="text-teal-300/80 text-[10px] font-medium mt-0.5">{user?.role}</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 p-3 flex-1 mt-3 overflow-y-auto">
        <p className="text-teal-400/50 text-[10px] font-bold uppercase tracking-widest px-3 mb-2">Navigation</p>
        {filteredNavItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all font-medium text-sm
              ${isActive
                ? 'bg-white/20 text-white shadow-sm'
                : 'text-teal-200/70 hover:bg-white/10 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-teal-500/80 text-white' : 'text-teal-300/60'}`}>
                  {item.icon}
                </span>
                {item.name}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-red-300/80 hover:bg-red-500/20 hover:text-red-200 transition-all"
        >
          <span className="p-1.5 rounded-lg text-red-300/60">
            <LogOut size={19} />
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
