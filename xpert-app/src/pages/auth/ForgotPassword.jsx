import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../../components/layout/AuthLayout';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    // Mock: simulate API call
    setTimeout(() => {
      setSent(true);
      setLoading(false);
    }, 1000);
  }

  return (
    <AuthLayout>
      <h2 className="text-xl font-semibold text-[var(--color-text)] mb-1">Reset your password</h2>
      <p className="text-sm text-[var(--color-text-secondary)] mb-6">
        Enter your email and we&apos;ll send you a reset link
      </p>

      {sent ? (
        <div className="rounded-lg bg-primary-50 p-4 text-center">
          <p className="text-sm font-medium text-primary-700">
            Check your email for a password reset link.
          </p>
          <Link to="/login" className="mt-3 inline-block text-sm text-primary-600 hover:text-primary-700">
            Back to login
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            icon={EnvelopeIcon}
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" loading={loading} className="w-full">
            Send Reset Link
          </Button>
        </form>
      )}

      <p className="mt-6 text-center text-sm text-[var(--color-text-secondary)]">
        Remember your password?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
