import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BoltIcon,
  DocumentTextIcon,
  ClockIcon,
  ArrowUpCircleIcon,
  CodeBracketIcon,
  PencilSquareIcon,
  ChartBarIcon,
  DocumentMagnifyingGlassIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';
import useAuth from '../hooks/useAuth';
import { get } from '../lib/apiClient';
import { getGreeting, formatDateTime, formatNumber } from '../lib/helpers';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import OnboardingFlow from '../components/onboarding/OnboardingFlow';

const iconMap = {
  CodeBracketIcon, PencilSquareIcon, ChartBarIcon, DocumentMagnifyingGlassIcon, UserGroupIcon,
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [usage, setUsage] = useState(null);
  const [myAgents, setMyAgents] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user && !user.onboarding_complete) {
      setShowOnboarding(true);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    setLoadingData(true);
    const [usageRes, agentsRes] = await Promise.all([
      get('/usage'),
      get('/user/agents'),
    ]);

    if (usageRes.ok) setUsage(usageRes.data);
    if (agentsRes.ok) setMyAgents(agentsRes.data.slice(0, 5));
    setLoadingData(false);
  }

  const tokensUsed = usage?.tokens_used ?? 0;
  const tokenQuota = usage?.token_quota ?? 25000;
  const requestsToday = usage?.requests_today ?? 0;
  const requestLimit = usage?.request_limit ?? 50;
  const savedPrompts = usage?.saved_prompts ?? 0;

  const stats = [
    {
      label: 'Tokens Used Today',
      value: formatNumber(tokensUsed),
      sub: `/ ${formatNumber(tokenQuota)}`,
      icon: BoltIcon,
      pct: (tokensUsed / tokenQuota) * 100,
    },
    {
      label: 'Requests Today',
      value: requestsToday,
      sub: requestLimit === 0 ? '/ unlimited' : `/ ${requestLimit}`,
      icon: DocumentTextIcon,
      pct: requestLimit === 0 ? 0 : (requestsToday / requestLimit) * 100,
    },
    {
      label: 'Saved Prompts',
      value: savedPrompts,
      sub: 'in library',
      icon: ClockIcon,
      pct: null,
    },
  ];

  return (
    <div>
      {showOnboarding && (
        <OnboardingFlow onComplete={() => { setShowOnboarding(false); loadDashboardData(); }} />
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-text)]">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Here&apos;s what&apos;s happening with your AI workspace
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600">
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-[var(--color-text-secondary)]">{stat.label}</p>
                <p className="text-xl font-bold text-[var(--color-text)]">
                  {stat.value} <span className="text-sm font-normal text-[var(--color-text-tertiary)]">{stat.sub}</span>
                </p>
              </div>
            </div>
            {stat.pct !== null && (
              <div className="mt-3 h-1.5 rounded-full bg-primary-100">
                <div
                  className="h-1.5 rounded-full bg-primary-500 transition-all"
                  style={{ width: `${Math.min(stat.pct, 100)}%` }}
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Upgrade Banner for Free Users */}
      {user?.plan_level === 'free' && (
        <Card className="mb-8 bg-gradient-to-r from-primary-500 to-emerald-400 border-none">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-white">Upgrade to unlock more</h3>
              <p className="text-sm text-white/80 mt-1">
                Get 6x more tokens, 6x more requests, and access premium agents
              </p>
            </div>
            <Link to="/settings?tab=plan">
              <Button variant="secondary" size="sm" className="bg-white text-primary-700 hover:bg-white/90">
                <ArrowUpCircleIcon className="h-4 w-4" /> Upgrade
              </Button>
            </Link>
          </div>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Quick Actions</h2>
          {loadingData ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : (
            <div className="grid gap-3 grid-cols-2">
              {myAgents.map((agent) => (
                <Card
                  key={agent.id}
                  hoverable
                  onClick={() => navigate(`/agents/${agent.id}`, { state: { from: '/dashboard' } })}
                  className="!p-4"
                >
                  <div className="flex items-center gap-2">
                    <CodeBracketIcon className="h-5 w-5 text-primary-500" />
                    <span className="text-sm font-medium text-[var(--color-text)] truncate">{agent.name}</span>
                  </div>
                </Card>
              ))}
              <Card
                hoverable
                onClick={() => navigate('/agents/discover')}
                className="!p-4 border-dashed"
              >
                <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                  <span className="text-lg">+</span>
                  <span className="text-sm font-medium">Discover more</span>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)] mb-4">Recent Activity</h2>
          {myAgents.length === 0 && !loadingData ? (
            <Card className="text-center py-8">
              <p className="text-sm text-[var(--color-text-secondary)]">No recent activity yet. Start using agents!</p>
            </Card>
          ) : (
            <Card className="text-center py-8">
              <p className="text-sm text-[var(--color-text-secondary)]">
                Activity will appear here as you use agents.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
