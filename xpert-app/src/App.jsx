import { Component, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster, toast } from 'react-hot-toast';
import { registerApiHandlers } from './lib/apiClient';
import ProtectedRoute from './routes/ProtectedRoute';
import GuestRoute from './routes/GuestRoute';
import useAuth from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import Spinner from './components/ui/Spinner';

// Lazy-loaded pages for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword'));
const VerifyEmail = lazy(() => import('./pages/auth/VerifyEmail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Workspace = lazy(() => import('./pages/Workspace'));
const AgentDiscover = lazy(() => import('./pages/agents/AgentDiscover'));
const AgentWorkspace = lazy(() => import('./pages/agents/AgentWorkspace'));
const Library = lazy(() => import('./pages/Library'));
const Settings = lazy(() => import('./pages/settings/Settings'));
const Notifications = lazy(() => import('./pages/Notifications'));
const Help = lazy(() => import('./pages/Help'));
const NotFound = lazy(() => import('./pages/NotFound'));
const BlockedScreen = lazy(() => import('./pages/BlockedScreen'));

function PageLoader() {
  return (
    <div className="flex justify-center items-center py-24">
      <Spinner size="lg" />
    </div>
  );
}

class ErrorBoundary extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-semibold text-[var(--color-text)]">Something went wrong</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            className="mt-4 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

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

function RootRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-bg)]">
        <Spinner size="lg" className="text-primary-500" />
      </div>
    );
  }

  if (user) {
    const isNew = sessionStorage.getItem('xpert_just_registered');
    return <Navigate to={isNew === 'true' ? "/agents/discover" : "/workspace"} replace />;
  }

  return <Landing />;
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
      >
        {(t) => (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg transition-all ${
              t.visible ? 'animate-enter' : 'animate-leave'
            }`}
            style={{
              background: 'var(--color-surface)',
              color: 'var(--color-text)',
              border: '1px solid var(--color-border)',
              backdropFilter: 'blur(8px)',
            }}
          >
            {t.type === 'success' && <span className="text-primary-500 text-lg shrink-0">&#10003;</span>}
            {t.type === 'error' && <span className="text-red-500 text-lg shrink-0">&#10007;</span>}
            <span className="flex-1 text-sm font-medium">{typeof t.message === 'function' ? t.message(t) : t.message}</span>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="shrink-0 rounded-lg p-1 text-text-tertiary hover:text-foreground hover:bg-surface-hover transition-colors"
              aria-label="Close notification"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </Toaster>
      <ApiHandlerRegistration />
      <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<GuestRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
          </Route>

          <Route path="/blocked" element={<BlockedScreen />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/verify-email" element={<VerifyEmail />} />
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

          <Route path="/" element={<RootRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      </ErrorBoundary>
    </>
  );
}
