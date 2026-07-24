import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAdminAuthenticated } = useAuth();
  const token = localStorage.getItem('nexorae-admin-token');
  
  if (!isAdminAuthenticated && !token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
