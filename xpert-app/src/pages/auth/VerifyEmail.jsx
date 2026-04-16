import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import AuthLayout from '../../components/layout/AuthLayout';
import Button from '../../components/ui/Button';
import { post } from '../../lib/apiClient';
import { EnvelopeIcon } from '@heroicons/react/24/outline';

export default function VerifyEmail() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const inputRefs = useRef([]);

  useEffect(() => {
    if (user?.is_verified) {
      navigate('/workspace', { replace: true });
    }
  }, [user, navigate]);

  function handleChange(index, value) {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newCode = [...code];
      digits.forEach((d, i) => {
        if (index + i < 6) newCode[index + i] = d;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function handleVerify(e) {
    e?.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter the full 6-digit code.');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await post('/email/verify', { code: fullCode });
      if (res.ok) {
        setSuccess('Email verified successfully!');
        await refreshUser?.();
        setTimeout(() => navigate('/workspace'), 1500);
      } else {
        setError(res.error?.message || 'Invalid code. Please try again.');
        setCode(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Unable to verify. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setResending(true);
    setError('');
    try {
      const res = await post('/email/resend');
      if (res.ok) {
        setSuccess('New code sent to your email.');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(res.error?.message || 'Could not resend. Try again later.');
      }
    } catch {
      setError('Unable to resend. Please try again.');
    } finally {
      setResending(false);
    }
  }

  // Auto-submit when all 6 digits entered
  useEffect(() => {
    if (code.every(d => d !== '') && code.join('').length === 6) {
      handleVerify();
    }
  }, [code]);

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50">
          <EnvelopeIcon className="h-7 w-7 text-primary-600" />
        </div>
        <h2 className="text-xl font-semibold text-[var(--color-text)]">Verify your email</h2>
        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
          We sent a 6-digit code to <strong className="text-[var(--color-text)]">{user?.email}</strong>
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600 text-center">{error}</div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-primary-50 p-3 text-sm text-primary-700 text-center">{success}</div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-center gap-3">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => (inputRefs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className="h-14 w-12 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-surface)] text-center text-xl font-bold text-[var(--color-text)] outline-none transition-all focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              autoFocus={i === 0}
            />
          ))}
        </div>

        <Button type="submit" loading={loading} className="w-full">
          Verify Email
        </Button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Didn&apos;t receive the code?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            className="font-medium text-primary-600 hover:text-primary-700 disabled:opacity-50"
          >
            {resending ? 'Sending...' : 'Resend code'}
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
