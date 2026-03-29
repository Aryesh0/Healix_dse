import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

import AdminDashboard from './dashboards/AdminDashboard';
import ReceptionistDashboard from './dashboards/ReceptionistDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import PatientDashboard from './dashboards/PatientDashboard';

// ==========================================
// ROOT DASHBOARD MANAGER
// Dynamically loads the beautiful DSA Dashboards depending on Role
// ==========================================
const DashboardPage = () => {
  const { user } = useContext(AuthContext);
  const role = user?.role || 'VIEWER';

  return (
    <div className="h-full overflow-y-auto pb-10">
      {role === 'ADMIN' && <AdminDashboard />}
      {role === 'RECEPTIONIST' && <ReceptionistDashboard />}
      {role === 'DOCTOR' && <DoctorDashboard />}
      {role === 'PATIENT' && <PatientDashboard />}
      {role === 'VIEWER' && (
        <div className="text-center p-20">
          <h2 className="text-2xl font-bold text-slate-600">Please select a valid role to access your custom dashboard.</h2>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
