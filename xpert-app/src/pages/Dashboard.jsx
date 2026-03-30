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
    // Only trigger onboarding if the user hasn't seen it in this session 
    // AND they aren't marked as onboarded in the database.
    const hasSeenOnboarding = sessionStorage.getItem('xpert_onboarding_shown');
    
    if (user && !user.onboarding_complete && !hasSeenOnboarding) {
      setShowOnboarding(true);
      sessionStorage.setItem('xpert_onboarding_shown', 'true');
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
    <div className="animate-fade-in">
      {showOnboarding && (
        <OnboardingFlow onComplete={() => { setShowOnboarding(false); loadDashboardData(); }} />
      )}

      <div className="mb-10">
        <h1 className="text-4xl font-bold text-white tracking-tight">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-lg text-zinc-400 mt-2 font-medium">
          Your elite AI workspace is ready for deployment.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 sm:grid-cols-3 mb-10 text-white">
        {stats.map((stat) => (
          <Card key={stat.label} glass className="border-zinc-800/50 hover:border-primary-500/30 transition-all group">
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 text-primary-500 shadow-inner group-hover:scale-110 transition-transform">
                <stat.icon className="h-7 w-7" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-1.5 flex-wrap">
                  <span className="text-3xl font-black">{stat.value}</span>
                  <span className="text-xs font-bold text-zinc-600 mb-1 truncate">{stat.sub}</span>
                </div>
              </div>
            </div>
            {stat.pct !== null && (
              <div className="mt-6 h-1.5 w-full rounded-full bg-black/40 overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-500 shadow-[0_0_15px_rgba(33,196,93,0.5)] transition-all duration-1000"
                  style={{ width: `${Math.min(stat.pct, 100)}%` }}
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Upgrade Banner for Free Users */}
      {user?.plan_level === 'free' && (
        <div className="mb-12 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-primary-600/20 to-emerald-400/5 border border-primary-500/20 glass p-8 lg:p-12 group hover:border-primary-500/40 transition-all">
          <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary-500/10 blur-[100px] rounded-full group-hover:bg-primary-500/20 transition-all duration-700" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left flex-1 max-w-xl">
              <Badge variant="premium" className="mb-4 rounded-full px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-black border-none font-black uppercase tracking-tighter italic">Limited Access</Badge>
              <h3 className="text-3xl font-black text-white leading-tight mb-3">Ascend to Unlimited Intelligence</h3>
              <p className="text-lg text-zinc-400 font-medium">
                Unlock 6x high-tier token capacity, priority server allocation, and our entire library of premium curators.
              </p>
            </div>
            <Link to="/settings?tab=plan" className="w-full md:w-auto">
              <Button className="w-full h-16 px-10 rounded-full font-black uppercase tracking-widest text-lg shadow-[0_0_30px_rgba(33,196,93,0.3)] hover:scale-105 active:scale-95 transition-all">
                <ArrowUpCircleIcon className="h-6 w-6 mr-2" /> Upgrade Plan
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Quick Access */}
        <div>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-white tracking-tight italic">Deployed Agents</h2>
             <Link to="/workspace" className="text-xs font-black uppercase tracking-widest text-primary-500 hover:text-white transition-colors">View All</Link>
          </div>
          {loadingData ? (
             <div className="flex flex-col items-center justify-center py-20 glass rounded-[2rem] border border-zinc-800/50">
               <Spinner />
               <p className="mt-4 text-xs font-bold text-zinc-500 uppercase tracking-widest animate-pulse mt-6">
                 Waking up server environment...
               </p>
             </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {myAgents.map((agent) => (
                <Card
                  key={agent.id}
                  hoverable
                  onClick={() => navigate(`/agents/${agent.id}`, { state: { from: '/dashboard' } })}
                  className="!p-6 glass border-zinc-800/50 hover:border-primary-500/30 transition-all flex items-center gap-4 group"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900 border border-zinc-800 text-primary-500 group-hover:scale-110 transition-transform">
                    <CodeBracketIcon className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-white block truncate">{agent.name}</span>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{agent.domain}</span>
                  </div>
                </Card>
              ))}
              <Card
                hoverable
                onClick={() => navigate('/agents/discover')}
                className="!p-6 glass border-zinc-800/50 border-dashed hover:border-solid hover:border-primary-500/50 transition-all flex items-center gap-4 group bg-zinc-950/20"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-500 group-hover:text-primary-500 transition-colors">
                  <span className="text-2xl font-light">+</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-zinc-400 group-hover:text-white transition-colors">Curate more agents</span>
                  <span className="text-[10px] font-bold text-zinc-600 block uppercase tracking-widest">Discover library</span>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Neural Network Activity */}
        <div>
          <h2 className="text-xl font-bold text-white mb-6 tracking-tight italic">Recent Interactions</h2>
          {myAgents.length === 0 && !loadingData ? (
             <Card glass className="text-center py-20 border-zinc-800/50">
               <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">No neural pathways mapped yet.</p>
               <Button variant="outline" className="mt-8 rounded-full h-12 px-8 font-bold border-zinc-800" onClick={() => navigate('/agents/discover')}>Curate first agent</Button>
             </Card>
          ) : (
            <Card glass className="text-center py-20 border-zinc-800/50 group">
               <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <ChartBarIcon className="h-8 w-8 text-zinc-600" />
               </div>
               <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
                Interaction mapping active...
              </p>
              <p className="text-xs text-zinc-600 font-medium mt-2">Activity logs will stream here during deployment.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
