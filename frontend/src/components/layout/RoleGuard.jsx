import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

export const RoleGuard = ({ allowedRoles }) => {
  const { user, isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Handle case where specific roles are required
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // Redirect to dashboard (or an unauthorized page)
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
