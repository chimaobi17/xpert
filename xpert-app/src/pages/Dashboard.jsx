import {
  BoltIcon,
  DocumentTextIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';
import { getGreeting, formatNumber } from '../lib/helpers';
import StatsCard from '../components/dashboard/StatsCard';
import QuickActions from '../components/dashboard/QuickActions';
import RecentActivity from '../components/dashboard/RecentActivity';
import UpgradeBanner from '../components/dashboard/UpgradeBanner';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'User'}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Here&apos;s your activity overview for today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          icon={BoltIcon}
          label="Tokens Used Today"
          value={formatNumber(8750)}
          subtitle="of 25,000 daily quota"
          trend={12}
        />
        <StatsCard
          icon={DocumentTextIcon}
          label="Requests Today"
          value="18"
          subtitle="of 50 daily limit"
          trend={-5}
        />
        <StatsCard
          icon={BookOpenIcon}
          label="Saved Prompts"
          value="24"
          subtitle="in your library"
        />
      </div>

      {user?.plan_level === 'free' && <UpgradeBanner />}

      <QuickActions />
      <RecentActivity />
    </div>
  );
}
