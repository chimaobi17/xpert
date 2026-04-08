import { useNavigate } from 'react-router-dom';
import { ShieldExclamationIcon } from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';
import Button from '../components/ui/Button';
import logoIcon from '../assets/logo-icon.svg';

export default function BlockedScreen() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-4">
      <div className="w-full max-w-md text-center">
        <img src={logoIcon} alt="Xpert" className="mx-auto h-14 mb-4" />

        <div className="rounded-xl border border-red-200 bg-red-50 p-8">
          <ShieldExclamationIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-red-700 mb-2">Account Suspended</h1>

          {user?.ban_reason && (
            <div className="rounded-lg bg-white border border-red-100 p-4 mt-4 text-left">
              <p className="text-xs font-medium text-red-600 mb-1">Reason</p>
              <p className="text-sm text-gray-700">{user.ban_reason}</p>
            </div>
          )}

          {user?.banned_until && (
            <p className="text-sm text-red-600 mt-4">
              Suspended until: <span className="font-medium">{new Date(user.banned_until).toLocaleDateString()}</span>
            </p>
          )}

          {!user?.banned_until && user?.ban_reason && (
            <p className="text-sm text-red-600 mt-4 font-medium">This suspension is permanent.</p>
          )}

          <p className="text-sm text-gray-500 mt-4">
            If you believe this is a mistake, please contact support.
          </p>

          <div className="mt-6 space-y-3">
            <a
              href="mailto:support@xpert.test"
              className="block text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact Support
            </a>
            <Button variant="outline" onClick={handleLogout} className="w-full">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
