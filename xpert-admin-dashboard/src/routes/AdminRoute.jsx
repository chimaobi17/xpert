import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';

export default function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-bg)]">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;

  return <Outlet />;
}
