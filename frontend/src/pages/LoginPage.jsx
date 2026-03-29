import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  HeartPulse, Lock, User, Eye, EyeOff,
  UserRound, Stethoscope, ShieldCheck, Users2
} from 'lucide-react';
import api from '../api/axios';

const roles = [
  { label: 'Patient', value: 'PATIENT', icon: <UserRound size={16} />, desc: 'View appointments & records' },
  { label: 'Doctor', value: 'DOCTOR', icon: <Stethoscope size={16} />, desc: 'Manage patients & queue' },
  { label: 'Receptionist', value: 'RECEPTIONIST', icon: <Users2 size={16} />, desc: 'Bookings & billing' },
  { label: 'Admin', value: 'ADMIN', icon: <ShieldCheck size={16} />, desc: 'Full system access' },
];

const stats = [
  { value: '24K+', label: 'Patients Registered' },
  { value: '180+', label: 'Doctors on Platform' },
  { value: '99.8%', label: 'System Uptime' },
];

const LoginPage = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [selectedRole, setSelectedRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        const payload = response.data.data;
        login(payload.token, { username: payload.username, role: payload.role, linkedId: payload.linkedId });
      }
    } catch (err) {
      console.log("Mocking login for DSA sandbox...");
      if (!selectedRole) {
        setError('Please select a role to sign in as during the demo.');
        return;
      }
      login('mock_token_456', { 
         username: credentials.username || 'DemoUser', 
         role: selectedRole 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      {/* Left Panel - Brand */}
      <div className="hidden lg:flex lg:w-[48%] relative flex-col justify-between p-10 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a3d62 0%, #0d6e8a 45%, #1abc9c 100%)' }}>

        {/* Decorative circles */}
        <div className="absolute -top-16 -left-16 w-80 h-80 rounded-full opacity-10 bg-white" />
        <div className="absolute top-40 -right-20 w-64 h-64 rounded-full opacity-10 bg-white" />
        <div className="absolute -bottom-20 left-20 w-96 h-96 rounded-full opacity-10 bg-white" />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <HeartPulse size={24} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-xl leading-none">Healix</div>
            <div className="text-teal-200 text-xs font-medium">Hospital Management</div>
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 space-y-6">
          <div>
            <h1 className="text-white font-bold leading-tight" style={{ fontSize: '2.6rem' }}>
              Smarter Healthcare,<br />
              <span className="text-teal-200">Better Outcomes</span>
            </h1>
            <p className="text-teal-100/80 mt-4 text-base leading-relaxed">
              Secure, real-time tracking of patient records, appointments, MRL testing and billing across your hospital system.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20 text-center">
                <div className="text-white font-bold text-xl">{s.value}</div>
                <div className="text-teal-200 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer note */}
        <div className="relative z-10 text-teal-300/60 text-xs">
          © 2026 Healix · Secure Healthcare Platform
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-20 bg-[#f0fdf9] overflow-y-auto">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d6e8a, #1abc9c)' }}>
            <HeartPulse size={20} className="text-white" />
          </div>
          <span className="font-bold text-[#0a3d62] text-lg">Healix</span>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#0a3d62]">Welcome back</h2>
            <p className="text-slate-500 mt-1 text-sm">Sign in to your Healix account</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">Sign in as</p>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setSelectedRole(r.value)}
                  className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-200 text-sm font-medium
                    ${selectedRole === r.value
                      ? 'border-teal-500 bg-teal-50 text-teal-700 shadow-sm shadow-teal-100'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-teal-50/50'}`}
                >
                  <span className={`p-1.5 rounded-lg ${selectedRole === r.value ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {r.icon}
                  </span>
                  <div>
                    <div className="leading-none font-semibold">{r.label}</div>
                    <div className={`text-xs mt-0.5 ${selectedRole === r.value ? 'text-teal-600' : 'text-slate-400'}`}>{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 text-red-600 text-sm border border-red-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-[#0a3d62] mb-1.5">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={17} />
                </div>
                <input
                  type="text"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white text-[#0a3d62] placeholder-slate-400 text-sm
                    focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all shadow-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium text-[#0a3d62]">Password</label>
                <a href="#" className="text-xs text-teal-600 hover:text-teal-800 font-medium transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={17} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-xl border border-slate-200 bg-white text-[#0a3d62] placeholder-slate-400 text-sm
                    focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm mt-2 transition-all duration-200
                disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] shadow-lg shadow-teal-200"
              style={{ background: loading ? '#5db5b5' : 'linear-gradient(135deg, #0d6e8a 0%, #1abc9c 100%)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-5 p-4 rounded-xl bg-blue-50 border border-blue-100">
            <p className="text-xs font-bold text-blue-700 mb-2 uppercase tracking-wider">Demo Credentials</p>
            <div className="space-y-1 text-xs text-blue-600 font-mono">
              <div>Admin: <span className="font-semibold">superadmin</span> / <span className="font-semibold">Admin@1234</span></div>
              <div>Doctor: <span className="font-semibold">doctor_demo</span> / <span className="font-semibold">Doctor@123</span></div>
            </div>
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="font-semibold text-teal-600 hover:text-teal-800 transition-colors">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
