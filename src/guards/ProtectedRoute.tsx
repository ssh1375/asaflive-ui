import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <div>در حال بارگذاری...</div>;
  
  if (!user) return <Navigate to="/" replace />;

  return <Outlet />;
}
