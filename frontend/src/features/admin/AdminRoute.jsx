import { Navigate, Outlet } from 'react-router-dom';
import { getAdminToken } from './adminAuthApi';

export function AdminRoute() {
  const token = getAdminToken();

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}