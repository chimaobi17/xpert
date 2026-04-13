import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { UserIcon, EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    job_title: '',
    purpose: '',
    field_of_specialization: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const { name, email, password, password_confirmation, ...extra } = form;
      await register(name, email, password, password_confirmation, extra);
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

  const specializations = [
    { value: '', label: 'Select Specialized Field (Optional)' },
    { value: 'technology', label: 'Technology' },
    { value: 'creative', label: 'Creative' },
    { value: 'business', label: 'Business' },
    { value: 'research', label: 'Research' },
    { value: 'language', label: 'Language' },
  ];

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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={LockClosedIcon}
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
            required
            suffix={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-text-tertiary hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            }
          />
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            icon={LockClosedIcon}
            placeholder="Confirm password"
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
            error={errors.password_confirmation}
            required
            suffix={
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-text-tertiary hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            }
          />
        </div>

        <div className="pt-4 border-t border-border mt-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-6">Personalize your Workspace (Optional)</p>
          <div className="space-y-4">
            <Input
              label="Job Title"
              placeholder="e.g. Content Writer"
              value={form.job_title}
              onChange={(e) => setForm({ ...form, job_title: e.target.value })}
            />
            <Input
              label="Main Goal with Xpert"
              placeholder="e.g. Generate social media posts"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase tracking-widest text-text-tertiary ml-1">Specialization</label>
              <select
                className="block w-full rounded-2xl border border-border/80 bg-background px-4 py-3.5 text-sm text-foreground focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10 transition-all duration-300"
                value={form.field_of_specialization}
                onChange={(e) => setForm({ ...form, field_of_specialization: e.target.value })}
              >
                {specializations.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full mt-6 scale-100">
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
