import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RequireAdmin() {
  const { user } = useAuth();
  if (user?.rol !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
}
