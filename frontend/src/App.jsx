import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { ProtectedRoute, RoleGuard } from './components/layout/RoleGuard';
import DashboardLayout from './components/layout/DashboardLayout';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PatientManagementPage from './pages/PatientManagementPage';
import QueueManagementPage from './pages/QueueManagementPage';
import HomePage from './pages/HomePage';
import AppointmentsPage from './pages/AppointmentsPage';
import BillingPage from './pages/BillingPage';
import DoctorDirectoryPage from './pages/DoctorDirectoryPage';
import PharmacyInventoryPage from './pages/PharmacyInventoryPage';
import WardsBedsPage from './pages/WardsBedsPage';
import PatientRecordsPage from './pages/PatientRecordsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DatabaseProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            
            {/* Protected Routes inside Dashboard Layout */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              
              <Route path="/dashboard" element={<DashboardPage />} />
              
              <Route element={<RoleGuard allowedRoles={['ADMIN', 'RECEPTIONIST']} />}>
                <Route path="/patients" element={<PatientManagementPage />} />
                <Route path="/billing" element={<BillingPage />} />
              </Route>

              <Route element={<RoleGuard allowedRoles={['ADMIN']} />}>
                <Route path="/doctors" element={<DoctorDirectoryPage />} />
                <Route path="/inventory" element={<PharmacyInventoryPage />} />
                <Route path="/wards" element={<WardsBedsPage />} />
              </Route>

              <Route element={<RoleGuard allowedRoles={['ADMIN', 'RECEPTIONIST', 'DOCTOR', 'PATIENT']} />}>
                <Route path="/appointments" element={<AppointmentsPage />} />
              </Route>

              <Route element={<RoleGuard allowedRoles={['ADMIN', 'DOCTOR', 'RECEPTIONIST']} />}>
                <Route path="/queue" element={<QueueManagementPage />} />
              </Route>

              <Route element={<RoleGuard allowedRoles={['ADMIN', 'DOCTOR']} />}>
                <Route path="/records" element={<PatientRecordsPage />} />
              </Route>

            </Route>
            
            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DatabaseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
