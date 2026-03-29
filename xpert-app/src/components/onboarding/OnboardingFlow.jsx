import { useState } from 'react';
import clsx from 'clsx';
import useAuth from '../../hooks/useAuth';
import { patch } from '../../lib/apiClient';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const specializations = ['technology', 'creative', 'business', 'research', 'language'];

const steps = [
  { title: 'What do you do?', subtitle: 'This helps us personalize your experience' },
  { title: 'What brings you here?', subtitle: 'Help us understand your goals' },
  { title: 'Your specialization', subtitle: 'We\'ll pre-load agents tailored to your field' },
];

export default function OnboardingFlow({ onComplete }) {
  const { user, refreshUser } = useAuth();
  const [loadingSkip, setLoadingSkip] = useState(false);

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
    const res = await patch('/user/onboarded', {});
    if (res.ok) {
      await refreshUser();
      onComplete?.();
    }
    setLoadingSkip(false);
  }

  async function handleSubmit() {
    setLoading(true);
    const res = await patch('/user/profile', form);
    if (res.ok) {
      await refreshUser();
    }
    setLoading(false);
    onComplete?.();
  }

  const canProceed =
    (step === 0 && form.job_title.trim()) ||
    (step === 1 && form.purpose.trim()) ||
    (step === 2 && form.field_of_specialization);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className={clsx(
          'relative z-10 w-full max-w-lg mx-4 rounded-2xl p-8 shadow-2xl backdrop-blur-md',
          'bg-white border border-white/20 [html[data-theme=dark]_&]:bg-gray-900/60 [html[data-theme=dark]_&]:border-white/10'
        )}
      >
        <div className="mb-6 text-center">
          <svg className="mx-auto h-10 w-10 mb-3" viewBox="0 0 48 48" fill="none">
            <path d="M12 8L24 25L12 42" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M36 8L24 25L36 42" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-sm text-[var(--color-text-secondary)] mb-1">
            Welcome, {user?.name || 'there'}!
          </p>
          <h2 className="text-xl font-bold text-[var(--color-text)]">{steps[step].title}</h2>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">{steps[step].subtitle}</p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6">
          {steps.map((_, i) => (
            <div
              key={i}
              className={clsx(
                'h-2 rounded-full transition-all duration-300',
                i === step ? 'w-8 bg-primary-500' : 'w-2 bg-[var(--color-border)]'
              )}
            />
          ))}
        </div>

        <div className="space-y-4">
          {step === 0 && (
            <Input
              label="Job Title"
              placeholder="e.g. Full-Stack Developer, Product Manager"
              value={form.job_title}
              onChange={(e) => setForm({ ...form, job_title: e.target.value })}
            />
          )}
          {step === 1 && (
            <Input
              label="What's your main goal with XPERT?"
              placeholder="e.g. Generate code faster, write better content"
              value={form.purpose}
              onChange={(e) => setForm({ ...form, purpose: e.target.value })}
            />
          )}
          {step === 2 && (
            <Select
              label="Field of Specialization"
              options={specializations}
              value={form.field_of_specialization}
              onChange={(e) => setForm({ ...form, field_of_specialization: e.target.value })}
            />
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {step > 0 && (
              <Button variant="ghost" onClick={handleBack}>
                Back
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={handleSkip}
              loading={loadingSkip}
              className="text-[var(--color-text-tertiary)]"
            >
              Skip
            </Button>
          </div>
          {step < 2 ? (
            <Button onClick={handleNext} disabled={!canProceed}>
              Continue
            </Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading} disabled={!canProceed}>
              Get Started
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
