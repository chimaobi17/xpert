import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Button from '../ui/Button';

export default function UpgradeBanner() {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl border border-primary-200 bg-gradient-to-r from-primary-50 to-emerald-50 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-lg bg-primary-100 p-2">
            <SparklesIcon className="h-5 w-5 text-primary-600" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-primary-800">Upgrade to Standard</h3>
            <p className="text-xs text-primary-600 mt-0.5">
              Get 150,000 tokens/day, 300 requests, and access to priority support.
            </p>
          </div>
        </div>
        <Button size="sm" onClick={() => navigate('/settings?tab=plan')}>
          Upgrade Now
        </Button>
      </div>
    </div>
  );
}
