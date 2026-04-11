import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { UserIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      await register(form.name, form.email, form.password, form.password_confirmation);
      navigate('/agents/discover');
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors || data?.details) {
        setErrors(data.errors || data.details);
      } else {
        setErrors({ email: data?.message || 'Registration failed' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
      <Link to="/" className="inline-flex items-center text-xs font-black uppercase tracking-widest text-primary-500 hover:text-primary-600 mb-8 group transition-all">
        <span className="mr-2 group-hover:-translate-x-1 transition-transform">←</span> Back to home
      </Link>
      <h2 className="text-2xl sm:text-3xl font-black text-[var(--color-text)] mb-2 tracking-tight">Create your account</h2>
      <p className="text-sm sm:text-base text-[var(--color-text-secondary)] font-medium mb-8">Start using AI-powered prompts today</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          type="text"
          icon={UserIcon}
          placeholder="John Doe"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          error={errors.name}
          required
        />
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
          placeholder="Create a password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          error={errors.password}
          required
        />
        <Input
          label="Confirm Password"
          type="password"
          icon={LockClosedIcon}
          placeholder="Confirm your password"
          value={form.password_confirmation}
          onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
          error={errors.password_confirmation}
          required
        />

        <Button type="submit" loading={loading} className="w-full">
          Create Account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
