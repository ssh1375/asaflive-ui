import React, { useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useUIStore } from '../store/useUIStore'; 
import axios from 'axios';

const fetchCurrentUser = async () => {
  const response = await axios.get('/api/auth/me');
  return response.data;
};

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = useUIStore((s) => s.isAuthenticated);
  const setAuth = useUIStore((s) => s.setAuth);
  
  const location = useLocation();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['auth-check'],
    queryFn: fetchCurrentUser,
    enabled: !isAuthenticated, 
    retry: false, 
    staleTime: 1000 * 60 * 5, 
  });
  console.log(isError);
  
  
  useEffect(() => {
    if (data && !isAuthenticated) {
      setAuth(data);
    }
  }, [data, isAuthenticated, setAuth]);


  if (isLoading && !isAuthenticated) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <span>در حال بررسی اعتبار شما...</span>
      </div>
    );
  }

  if (!isAuthenticated && (isError || !data)) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isAuthenticated || data) {
    return children ? <>{children}</> : <Outlet />;
  }

  return null; 
};
