import { CheckIcon } from '@heroicons/react/24/solid';

const quotas = {
  free: { tokens: '25,000/day', requests: '50/day' },
  standard: { tokens: '150,000/day', requests: '300/day' },
  premium: { tokens: '1,000,000/day', requests: 'Unlimited' },
};

const rateLimits = {
  free: { daily: 50, perMinute: 5 },
  standard: { daily: 300, perMinute: 20 },
  premium: { daily: 'Unlimited', perMinute: 60 },
};

export default function Settings() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[var(--color-text)]">Platform Settings</h1>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-4">Plan Quotas</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Daily Tokens</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Daily Requests</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(quotas).map(([plan, quota]) => (
                <tr key={plan} className="border-b border-[var(--color-border)]">
                  <td className="px-4 py-3 font-medium text-[var(--color-text)] capitalize">{plan}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{quota.tokens}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{quota.requests}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-4">Rate Limits</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Plan</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Daily Limit</th>
                <th className="px-4 py-3 text-left font-medium text-[var(--color-text-secondary)]">Per Minute</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(rateLimits).map(([plan, limits]) => (
                <tr key={plan} className="border-b border-[var(--color-border)]">
                  <td className="px-4 py-3 font-medium text-[var(--color-text)] capitalize">{plan}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{limits.daily}</td>
                  <td className="px-4 py-3 text-[var(--color-text-secondary)]">{limits.perMinute}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-4">AI Models</h3>
        <div className="space-y-3">
          {[
            { name: 'Text Generation', model: 'mistralai/Mistral-7B-Instruct-v0.2' },
            { name: 'Code Generation', model: 'bigcode/starcoder2-15b' },
            { name: 'Translation', model: 'facebook/nllb-200-distilled-600M' },
            { name: 'Summarization', model: 'facebook/bart-large-cnn' },
            { name: 'Text Classification', model: 'distilbert-base-uncased-finetuned-sst-2-english' },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between rounded-lg bg-[var(--color-bg)] p-3">
              <span className="text-sm font-medium text-[var(--color-text)]">{item.name}</span>
              <code className="text-xs text-[var(--color-text-secondary)] bg-[var(--color-bg-secondary)] px-2 py-1 rounded">
                {item.model}
              </code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
