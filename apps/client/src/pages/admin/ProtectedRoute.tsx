import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div className="boot-screen"><div className="boot-mark">N//</div><p>VERIFYING ADMIN SESSION...</p></div>;
  if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;
  return <Outlet />;
}
