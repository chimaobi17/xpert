import { useState } from 'react';
import clsx from 'clsx';
import useAuth from '../../hooks/useAuth';
import { patch } from '../../lib/apiClient';
import api from '../../lib/axios';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';
import logoFull from '../../assets/logo-full.svg';

const specializations = ['technology', 'creative', 'business', 'research', 'language'];

const steps = [
  { title: 'What do you do?', subtitle: 'This helps us personalize your experience' },
  { title: 'What brings you here?', subtitle: 'Help us understand your goals' },
  { title: 'Your specialization', subtitle: 'We\'ll pre-load agents tailored to your field' },
];

export default function OnboardingFlow({ onComplete }) {
  const { user, refreshUser } = useAuth();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    job_title: '',
    purpose: '',
    field_of_specialization: '',
  });
  const [loading, setLoading] = useState(false);
  const [loadingSkip, setLoadingSkip] = useState(false);
  const [error, setError] = useState(null);

  function handleNext() {
    if (step < 2) {
      setStep(step + 1);
    }
  }

  function handleBack() {
    if (step > 0) setStep(step - 1);
  }

  async function handleSkip() {
    setLoadingSkip(true);
    try {
      await api.patch('/user/onboarded', {});
      await refreshUser();
    } catch {
      // Silently ignore — user just wants to skip
    } finally {
      setLoadingSkip(false);
      onComplete?.();
    }
  }

  async function handleSubmit() {
    if (!canProceed) return;
    setLoading(true);
    setError(null);
    try {
      const res = await patch('/user/profile', form);
      if (!res.ok) {
        setError(res.error?.message || 'Failed to save profile. Please try again.');
        setLoading(false);
        return;
      }
      try { await refreshUser(); } catch { /* ignore */ }
      // Success - close modal
      setLoading(false);
      onComplete?.();
    } catch (err) {
      console.error('Onboarding submit error:', err);
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  }

  const canProceed =
    (step === 0 && form.job_title.trim().length > 0) ||
    (step === 1 && form.purpose.trim().length > 0) ||
    (step === 2 && form.field_of_specialization !== '');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[100px] dark:bg-black/80" />
      <div
        className={clsx(
          'relative z-10 w-full max-w-md rounded-[2.5rem] p-6 sm:p-8 shadow-2xl bg-background dark:bg-surface/90 dark:glass border border-border/50 dark:border-primary-500/50',
          'animate-fade-in'
        )}
      >
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex items-center justify-center">
            <img src={logoFull} alt="Xpert" className="h-10 sm:h-12 mx-auto" />
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary-500 mb-2">
            Welcome, {user?.name || 'Explorer'}
          </p>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-text)] tracking-tight leading-tight">{steps[step].title}</h2>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-2 font-medium">{steps[step].subtitle}</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={clsx(
                'h-1.5 rounded-full transition-all duration-500',
                i === step ? 'w-10 bg-primary-500' : 'w-4 bg-[var(--color-border)]'
              )}
            />
          ))}
        </div>

        <div className="space-y-6">
          {step === 0 && (
            <div className="animate-fade-in">
              <Input
                label="Job Title"
                placeholder="e.g. Full-Stack Developer"
                value={form.job_title}
                onChange={(e) => setForm({ ...form, job_title: e.target.value })}
              />
            </div>
          )}
          {step === 1 && (
            <div className="animate-fade-in">
              <Input
                label="What's your main goal?"
                placeholder="e.g. Generate code faster"
                value={form.purpose}
                onChange={(e) => setForm({ ...form, purpose: e.target.value })}
              />
            </div>
          )}
          {step === 2 && (
            <div className="animate-fade-in">
              <Select
                label="Field of Specialization"
                options={specializations}
                value={form.field_of_specialization}
                onChange={(e) => setForm({ ...form, field_of_specialization: e.target.value })}
              />
            </div>
          )}
          {error && (
            <p className="text-xs text-red-500 text-center font-medium animate-pulse">{error}</p>
          )}
        </div>

        <div className="mt-8 sm:mt-10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={handleBack}
                className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-secondary)] hover:text-primary-500 transition-colors px-3 py-2"
              >
                Back
              </button>
            )}
            <button
              onClick={handleSkip}
              disabled={loadingSkip}
              className="text-[10px] font-black uppercase tracking-widest text-[var(--color-text-tertiary)] hover:text-primary-500 transition-colors px-3 py-2"
            >
              Skip
            </button>
          </div>
          {step < 2 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed}
              className="px-8 sm:px-10 shadow-primary-500/20"
            >
              Continue
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              loading={loading}
              disabled={!canProceed}
              className="px-8 sm:px-10 shadow-primary-500/30"
            >
              Start
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
