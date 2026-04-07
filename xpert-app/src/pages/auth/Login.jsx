import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { EnvelopeIcon, LockClosedIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const { login, verifyMfa } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [mfaCode, setMfaCode] = useState('');
  const [mfaUserId, setMfaUserId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const data = await login(form.email, form.password);
      if (data?.requires_2fa) {
        setMfaUserId(data.user_id);
      } else {
        navigate('/agents/discover');
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors || data?.details) {
        setErrors(data.errors || data.details);
      } else {
        setErrors({ email: data?.message || 'Invalid credentials' });
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleMfaSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await verifyMfa(mfaUserId, mfaCode);
      navigate('/agents/discover');
    } catch (err) {
      const data = err.response?.data;
      setErrors({ mfa: data?.message || 'Invalid verification code' });
    } finally {
      setLoading(false);
    }
  }

  if (mfaUserId) {
    return (
      <AuthLayout>
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center mb-3">
            <ShieldCheckIcon className="h-6 w-6 text-primary-500" />
          </div>
          <h2 className="text-xl font-semibold text-[var(--color-text)] mb-1">Two-Factor Authentication</h2>
          <p className="text-sm text-[var(--color-text-secondary)]">Enter the 6-digit code to continue</p>
        </div>

        <form onSubmit={handleMfaSubmit} className="space-y-4">
          <Input
            label="Verification Code"
            type="text"
            icon={ShieldCheckIcon}
            placeholder="000000"
            maxLength={6}
            value={mfaCode}
            onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            error={errors.mfa}
            required
            autoFocus
          />

          <Button type="submit" loading={loading} className="w-full" disabled={mfaCode.length !== 6}>
            Verify
          </Button>
        </form>

        <button
          onClick={() => { setMfaUserId(null); setMfaCode(''); setErrors({}); }}
          className="mt-4 w-full text-center text-sm text-[var(--color-text-secondary)] hover:text-primary-600"
        >
          Back to login
        </button>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-1">Welcome back</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">Sign in to your account</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          icon={EnvelopeIcon}
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          error={errors.email}
          required
        />
        <Input
          label="Password"
          type="password"
          icon={LockClosedIcon}
          placeholder="Enter your password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          required
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
            <input type="checkbox" className="rounded border-[var(--color-border)] text-primary-500 focus:ring-primary-500" />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-medium text-primary-600 hover:text-primary-700">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}
