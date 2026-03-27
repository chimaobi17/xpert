import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { registerApiHandlers } from './lib/apiClient';
import ProtectedRoute from './routes/ProtectedRoute';
import GuestRoute from './routes/GuestRoute';
import AppLayout from './components/layout/AppLayout';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Workspace from './pages/Workspace';
import AgentDiscover from './pages/agents/AgentDiscover';
import AgentWorkspace from './pages/agents/AgentWorkspace';
import Library from './pages/Library';
import Settings from './pages/settings/Settings';
import Notifications from './pages/Notifications';
import Help from './pages/Help';
import NotFound from './pages/NotFound';
import BlockedScreen from './pages/BlockedScreen';

function ApiHandlerRegistration() {
  const navigate = useNavigate();

  useEffect(() => {
    registerApiHandlers({
      onUpgrade: (message) => {
        toast(message || 'Upgrade your plan to access this feature.', { icon: '⬆️' });
        navigate('/settings?tab=plan');
      },
      onLogin: () => navigate('/login'),
      onBlocked: (error) => {
        navigate('/blocked', { state: error });
      },
      onToast: (message, type) => {
        if (type === 'error') toast.error(message);
        else if (type === 'warning') toast(message, { icon: '⚠️' });
        else if (type === 'info') toast(message, { icon: 'ℹ️' });
        else toast.success(message);
      },
    });
  }, [navigate]);

  return null;
}

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text)',
            border: '1px solid var(--color-border)',
            backdropFilter: 'blur(8px)',
          },
        }}
      />
      <ApiHandlerRegistration />
      <Routes>
        <Route element={<GuestRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Route>

        <Route path="/blocked" element={<BlockedScreen />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/workspace" element={<Workspace />} />
            <Route path="/agents/discover" element={<AgentDiscover />} />
            <Route path="/agents/:id" element={<AgentWorkspace />} />
            <Route path="/library" element={<Library />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/help" element={<Help />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
