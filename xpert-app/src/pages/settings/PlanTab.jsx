import useAuth from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { CheckIcon } from '@heroicons/react/24/solid';

const plans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    tokens: '25,000/day',
    requests: '50/day',
    features: ['5 AI agents', 'Basic prompt generation', 'Prompt library', 'Community support'],
  },
  {
    name: 'Standard',
    price: '$19',
    period: '/month',
    tokens: '150,000/day',
    requests: '300/day',
    features: ['All AI agents', 'Advanced prompt editing', 'Priority support', 'API access', 'Export history'],
    popular: true,
  },
  {
    name: 'Premium',
    price: '$49',
    period: '/month',
    tokens: '1,000,000/day',
    requests: 'Unlimited',
    features: ['Everything in Standard', 'Premium-only agents', 'Custom system prompts', 'Dedicated support', 'Team collaboration'],
  },
];

export default function PlanTab() {
  const { user } = useAuth();
  const currentPlan = user?.plan_level || 'free';

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-semibold text-[var(--color-text)]">Current Usage</h3>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-[var(--color-bg)] p-4">
            <p className="text-xs text-[var(--color-text-secondary)]">Token Usage Today</p>
            <p className="text-lg font-bold text-[var(--color-text)] mt-1">8,750 / 25,000</p>
            <div className="mt-2 h-2 rounded-full bg-[var(--color-border)]">
              <div className="h-2 rounded-full bg-primary-500" style={{ width: '35%' }} />
            </div>
          </div>
          <div className="rounded-lg bg-[var(--color-bg)] p-4">
            <p className="text-xs text-[var(--color-text-secondary)]">Requests Today</p>
            <p className="text-lg font-bold text-[var(--color-text)] mt-1">18 / 50</p>
            <div className="mt-2 h-2 rounded-full bg-[var(--color-border)]">
              <div className="h-2 rounded-full bg-primary-500" style={{ width: '36%' }} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-4">Plans</h3>
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const isCurrent = plan.name.toLowerCase() === currentPlan;
            return (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-5 ${
                  plan.popular
                    ? 'border-primary-500 shadow-md'
                    : 'border-[var(--color-border)]'
                }`}
              >
                {plan.popular && (
                  <Badge variant="premium" size="sm" className="absolute -top-2.5 left-4">
                    Most Popular
                  </Badge>
                )}
                <h4 className="text-lg font-bold text-[var(--color-text)]">{plan.name}</h4>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-[var(--color-text)]">{plan.price}</span>
                  <span className="text-sm text-[var(--color-text-secondary)]">{plan.period}</span>
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] mt-2">
                  {plan.tokens} tokens &middot; {plan.requests} requests
                </p>
                <ul className="mt-4 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                      <CheckIcon className="h-4 w-4 text-primary-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  {isCurrent ? (
                    <Button variant="outline" className="w-full" disabled>
                      Current Plan
                    </Button>
                  ) : (
                    <Button variant={plan.popular ? 'primary' : 'secondary'} className="w-full">
                      Upgrade
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
