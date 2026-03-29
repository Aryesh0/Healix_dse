import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  HeartPulse, User, Mail, Lock, Phone, Eye, EyeOff,
  UserRound, Stethoscope, ShieldCheck, Users2, Briefcase,
  CheckCircle2
} from 'lucide-react';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { DatabaseContext } from '../context/DatabaseContext';

const roles = [
  {
    label: 'Patient',
    value: 'PATIENT',
    icon: <UserRound size={20} />,
    desc: 'Register to manage your appointments & health records',
  },
  {
    label: 'Doctor',
    value: 'DOCTOR',
    icon: <Stethoscope size={20} />,
    desc: 'Join the platform to manage patients & consultations',
  },
  {
    label: 'Receptionist',
    value: 'RECEPTIONIST',
    icon: <Users2 size={20} />,
    desc: 'Handle bookings, billing and patient check-ins',
  },
  {
    label: 'Admin',
    value: 'ADMIN',
    icon: <ShieldCheck size={20} />,
    desc: 'Full system access and management control',
  },
];

const bloodGroups = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const RegisterPage = () => {
  const [role, setRole] = useState('PATIENT');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '', password: '', email: '',
    fullName: '', phone: '',
    specialization: '',
    dateOfBirth: '', gender: 'MALE', bloodGroup: 'O+', address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const { login } = useContext(AuthContext); // Added access to login
  const { db, sync } = useContext(DatabaseContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    // Add Doctor to DB Context automatically during MOCK
    const addDoctorToDb = () => {
       if (role === 'DOCTOR' && formData.specialization) {
          const docName = `Dr. ${formData.username || formData.fullName}`;
          const exists = db.doctorsMap.find(d => d.name === docName);
          if (!exists) {
            db.doctorsMap.push({ 
                id: `D${Math.floor(Math.random()*1000)}`, 
                name: docName, 
                specialty: formData.specialization, 
                phone: formData.phone,
                email: formData.email,
                days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], 
                hours: '09:00 - 17:00' 
            });
            sync();
          }
       }
    };

    try {
      const payload = { ...formData, role };
      const response = await api.post('/auth/register', payload);
      if (response.data.success) {
        addDoctorToDb();
        login(response.data.data?.token || 'mock_token', { 
           username: formData.username || formData.fullName, 
           role: role 
        });
      }
    } catch (err) {
      console.log("Auto-mocking registration for DSA demo since backend is unavailable");
      addDoctorToDb();
      login('mock_token_123', { 
         username: formData.username || formData.fullName, 
         role: role 
      });
    } finally {
      setLoading(false);
    }
  };

  const inputCls = `w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[#0a3d62] placeholder-slate-400 text-sm
    focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all shadow-sm`;
  const labelCls = 'block text-sm font-medium text-[#0a3d62] mb-1.5';
  const selectCls = `w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[#0a3d62] text-sm
    focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent transition-all shadow-sm appearance-none`;

  return (
    <div className="min-h-screen flex font-sans" style={{ background: 'linear-gradient(135deg, #e0fdf4 0%, #f0fdf9 50%, #ecfeff 100%)' }}>
      {/* Decorative Left Accent */}
      <div className="hidden xl:flex xl:w-[36%] relative flex-col justify-between p-10 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0a3d62 0%, #0d6e8a 50%, #1abc9c 100%)' }}>

        {/* Decorative blobs */}
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full opacity-10 bg-white" />
        <div className="absolute bottom-24 -left-16 w-80 h-80 rounded-full opacity-10 bg-teal-200" />

        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
            <HeartPulse size={24} className="text-white" />
          </div>
          <div>
            <div className="text-white font-bold text-xl leading-none">Healix</div>
            <div className="text-teal-200 text-xs font-medium">Hospital Management</div>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-white font-bold leading-tight" style={{ fontSize: '2.2rem' }}>
              Join Healix<br />
              <span className="text-teal-200">Today</span>
            </h2>
            <p className="text-teal-100/80 mt-3 text-sm leading-relaxed">
              Create your account to access the full suite of hospital management features.
            </p>
          </div>

          {/* Feature list */}
          <ul className="space-y-3">
            {[
              'Instant appointment booking',
              'Real-time health record access',
              'Secure billing & payments',
              'Role-based access control',
            ].map((f, i) => (
              <li key={i} className="flex items-center gap-3 text-teal-100 text-sm">
                <CheckCircle2 size={16} className="text-teal-300 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-teal-300/60 text-xs">
          © 2026 Healix · Secure Healthcare Platform
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex flex-col justify-center py-10 px-6 sm:px-12 xl:px-16 overflow-y-auto">
        {/* Mobile Logo */}
        <div className="flex xl:hidden items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0d6e8a, #1abc9c)' }}>
            <HeartPulse size={20} className="text-white" />
          </div>
          <span className="font-bold text-[#0a3d62] text-lg">Healix</span>
        </div>

        <div className="w-full max-w-xl mx-auto">
          {/* Header */}
          <div className="mb-7">
            <h1 className="text-2xl font-bold text-[#0a3d62]">Create your account</h1>
            <p className="text-slate-500 text-sm mt-1">Join the Healix Hospital Management System</p>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">I am registering as</p>
            <div className="grid grid-cols-2 gap-2.5">
              {roles.map(r => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value)}
                  className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200
                    ${role === r.value
                      ? 'border-teal-500 bg-teal-50 shadow-sm shadow-teal-100'
                      : 'border-slate-200 bg-white hover:border-teal-200 hover:bg-teal-50/40'}`}
                >
                  <span className={`p-2 rounded-lg mt-0.5 shrink-0 transition-all ${role === r.value ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {r.icon}
                  </span>
                  <div>
                    <div className={`text-sm font-semibold leading-tight ${role === r.value ? 'text-teal-700' : 'text-[#0a3d62]'}`}>
                      {r.label}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 leading-snug">{r.desc}</div>
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
            {/* Full Name */}
            <div>
              <label className={labelCls}>Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User size={16} />
                </div>
                <input
                  type="text" name="fullName" value={formData.fullName}
                  onChange={handleChange} placeholder="Your full name"
                  required className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            {/* Username + Email */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className={labelCls}>Username</label>
                <input
                  type="text" name="username" value={formData.username}
                  onChange={handleChange} placeholder="username"
                  required className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail size={16} />
                  </div>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} placeholder="email@example.com"
                    required className={`${inputCls} pl-10`}
                  />
                </div>
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className={labelCls}>Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Phone size={16} />
                </div>
                <input
                  type="tel" name="phone" value={formData.phone}
                  onChange={handleChange} placeholder="10-digit mobile number"
                  className={`${inputCls} pl-10`}
                />
              </div>
            </div>

            {/* Doctor Specific */}
            {role === 'DOCTOR' && (
              <div className="p-4 rounded-xl border border-teal-200 bg-teal-50/60 space-y-3">
                <p className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center gap-2">
                  <Stethoscope size={13} /> Doctor Details
                </p>
                <div>
                  <label className={labelCls}>Specialization</label>
                  <select
                    name="specialization" value={formData.specialization}
                    onChange={handleChange} required className={selectCls}
                  >
                    <option value="">Select Specialty</option>
                    <option value="Cardiologist">Cardiologist</option>
                    <option value="Neurologist">Neurologist</option>
                    <option value="Gastroenterologist">Gastroenterologist</option>
                    <option value="Dermatologist">Dermatologist</option>
                    <option value="Orthopedic">Orthopedic</option>
                    <option value="Pediatrician">Pediatrician</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>
            )}

            {/* Patient Specific */}
            {role === 'PATIENT' && (
              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/60 space-y-3">
                <p className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-2">
                  <UserRound size={13} /> Patient Details
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Date of Birth</label>
                    <input
                      type="date" name="dateOfBirth" value={formData.dateOfBirth}
                      onChange={handleChange} required className={inputCls}
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} className={selectCls}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Blood Group</label>
                    <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={selectCls}>
                      {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Address (optional)</label>
                    <input
                      type="text" name="address" value={formData.address}
                      onChange={handleChange} placeholder="City, State"
                      className={inputCls}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <label className={labelCls}>Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password" value={formData.password}
                  onChange={handleChange} placeholder="Min 8 chars, uppercase, number, special char"
                  required className={`${inputCls} pl-10 pr-12`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-teal-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-1.5">Must contain uppercase, lowercase, number and special character (e.g. Test@1234)</p>
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
                  Creating Account...
                </span>
              ) : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-teal-600 hover:text-teal-800 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
