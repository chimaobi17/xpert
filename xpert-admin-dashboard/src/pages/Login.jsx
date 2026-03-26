import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AuthLayout from '../components/layout/AuthLayout';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        setErrors(data.errors);
      } else {
        setErrors({ email: data?.message || 'Invalid credentials or insufficient permissions' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-1">Admin Login</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">Sign in to the admin panel</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          icon={EnvelopeIcon}
          placeholder="admin@xpert.test"
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
        <Button type="submit" loading={loading} className="w-full">
          Sign In
        </Button>
      </form>
    </AuthLayout>
  );
}
