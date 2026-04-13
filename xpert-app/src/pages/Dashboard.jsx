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
  LockClosedIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import useAuth from '../hooks/useAuth';
import { get } from '../lib/apiClient';
import { getGreeting, formatDateTime, formatNumber } from '../lib/helpers';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';

const iconMap = {
  CodeBracketIcon, PencilSquareIcon, ChartBarIcon, DocumentMagnifyingGlassIcon, UserGroupIcon,
};

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [usage, setUsage] = useState(null);
  const [myAgents, setMyAgents] = useState([]);
  const [recentLogs, setRecentLogs] = useState([]);
  const [loadingData, setLoadingData] = useState(true);



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
      label: 'Usage Today',
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
      label: 'Saved Results',
      value: savedPrompts,
      sub: 'in library',
      icon: ClockIcon,
      pct: null,
    },
  ];

  return (
    <div className="animate-fade-in">

      <div className="mb-6 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
          {getGreeting()}, {user?.name?.split(' ')[0] || 'there'}
        </h1>
        <p className="text-lg text-text-secondary mt-2 font-medium">
          Here's what's happening today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8 sm:mb-10 text-foreground">
        {stats.map((stat) => (
          <Card key={stat.label} hoverable glass className="transition-all group p-4 sm:p-6 lg:p-8">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="flex h-12 w-12 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-hover text-primary-500 shadow-sm group-hover:scale-110 transition-all duration-500">
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-1 sm:mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground">{stat.value}</span>
                  <span className="text-xs font-bold text-text-tertiary mb-1 truncate">{stat.sub}</span>
                </div>
              </div>
            </div>
            {stat.pct !== null && (
              <div className="mt-8 h-1.5 w-full rounded-full bg-surface-hover overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary-500 shadow-[0_0_15px_rgba(31,196,95,0.5)] transition-all duration-1000"
                  style={{ width: `${Math.min(stat.pct, 100)}%` }}
                />
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Upgrade Banner for Free Users */}
      {user?.plan_level === 'free' && (
        <div className="mb-6 sm:mb-12 relative overflow-hidden rounded-2xl sm:rounded-[2.5rem] bg-gradient-to-br from-primary-600/20 to-emerald-400/5 border border-primary-500/20 glass p-4 sm:p-8 lg:p-12 group hover:border-primary-500/40 transition-all">
          <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary-500/10 blur-[100px] rounded-full group-hover:bg-primary-500/20 transition-all duration-700" />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-8">
            <div className="text-center md:text-left flex-1 max-w-xl">
              <Badge variant="premium" className="mb-3 sm:mb-4 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 text-black border-none font-black uppercase tracking-tighter italic text-[10px] sm:text-xs">Free Plan</Badge>
              <h3 className="text-lg sm:text-2xl lg:text-3xl font-black text-white leading-tight mb-2 sm:mb-3">Get More Out of Xpert</h3>
              <p className="text-sm sm:text-lg text-zinc-400 font-medium">
                More daily usage, faster responses, and access to all AI helpers — including image generation.
              </p>
            </div>
            <Link to="/settings?tab=plan" className="w-full md:w-auto">
              <Button className="w-full h-11 sm:h-16 px-6 sm:px-10 rounded-full font-black uppercase tracking-widest text-xs sm:text-lg shadow-[0_0_30px_rgba(31,196,95,0.3)] hover:scale-105 active:scale-95 transition-all">
                <ArrowUpCircleIcon className="h-5 w-5 sm:h-6 sm:w-6 mr-2" /> Upgrade Plan
              </Button>
            </Link>
          </div>
        </div>
      )}

      <div className="grid gap-6 sm:gap-10 lg:grid-cols-2">
        {/* Quick Access */}
        <div>
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-xl font-bold text-foreground tracking-tight">Your AI Helpers</h2>
             <Link to="/workspace" className="text-xs font-black uppercase tracking-widest text-primary-500 hover:text-foreground transition-colors">View All</Link>
          </div>
          {loadingData ? (
             <div className="flex flex-col items-center justify-center py-12 sm:py-20 glass rounded-2xl sm:rounded-[2rem] border border-zinc-800/50">
               <Spinner />
               <p className="mt-4 text-xs font-bold text-zinc-500 uppercase tracking-widest animate-pulse sm:mt-6">
                 Loading your dashboard...
               </p>
             </div>
          ) : (
            <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
              {myAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="group relative"
                >
                  <Card
                    hoverable
                    glass
                    onClick={() => {
                      if (agent.is_premium_only && user?.plan_level === 'free') {
                        navigate('/settings?tab=plan');
                      } else {
                        navigate(`/agents/${agent.id}`, { state: { from: '/dashboard' } });
                      }
                    }}
                    className={clsx(
                      "!p-3 sm:!p-6 lg:!p-8 h-full flex items-center gap-3 sm:gap-6 border-border/50 hover:border-primary-500/30 overflow-hidden relative",
                      agent.is_premium_only && user?.plan_level === 'free' && "cursor-default border-primary-500/20 shadow-[0_0_20px_rgba(31,196,95,0.05)]"
                    )}
                  >
                    {/* Content Layer (Blurred if locked) */}
                    <div className={clsx(
                      "flex items-center gap-3 sm:gap-6 flex-1 transition-all duration-500",
                      agent.is_premium_only && user?.plan_level === 'free' && "blur-[6px] opacity-30 pointer-events-none"
                    )}>
                      <div className="flex h-10 w-10 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-surface-hover text-primary-500 shadow-sm group-hover:scale-110 transition-all duration-500">
                        {agent.is_premium_only && user?.plan_level === 'free' ? (
                          <LockClosedIcon className="h-5 w-5 sm:h-8 sm:w-8" />
                        ) : (
                          <CodeBracketIcon className="h-5 w-5 sm:h-8 sm:w-8" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5 sm:mb-1">
                          <h3 className="text-sm sm:text-lg font-bold text-foreground tracking-tight truncate">{agent.name}</h3>
                          {agent.is_premium_only && (
                             <Badge variant="premium" size="sm" className="scale-75 origin-left">Elite</Badge>
                          )}
                        </div>
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-text-tertiary mb-1 sm:mb-2">{agent.domain}</p>
                        <p className="text-[11px] sm:text-xs text-text-secondary leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity truncate pr-4 hidden sm:block">
                           {agent.description?.slice(0, 100) || agent.system_prompt?.slice(0, 100)}...
                        </p>
                      </div>
                    </div>

                    {/* Premium Lock Overlay for Dashboard */}
                    {agent.is_premium_only && user?.plan_level === 'free' && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-3 sm:p-4 text-center animate-fade-in bg-background/10">
                        <div className="bg-primary-500/10 p-2 sm:p-2.5 rounded-xl mb-2 sm:mb-3 shadow-lg shadow-primary-500/5">
                           <LockClosedIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary-500" />
                        </div>
                        <h4 className="text-xs sm:text-sm font-black text-foreground mb-3 sm:mb-4">{agent.name}</h4>
                        <Button
                          onClick={(e) => { e.stopPropagation(); navigate('/settings?tab=plan'); }}
                          className="h-8 sm:h-9 px-4 sm:px-6 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary-500/20"
                        >
                          Unlock
                        </Button>
                      </div>
                    )}
                  </Card>
                </div>
              ))}
              <Card
                hoverable
                onClick={() => navigate('/agents/discover')}
                className="!p-3 sm:!p-6 border-dashed hover:border-solid transition-all flex items-center gap-3 sm:gap-4 group bg-surface-hover/20"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-surface-hover border border-border text-text-tertiary group-hover:text-primary-500 transition-colors">
                  <span className="text-2xl font-light">+</span>
                </div>
                <div>
                  <span className="text-sm font-bold text-text-secondary group-hover:text-foreground transition-colors">Add more helpers</span>
                  <span className="text-[10px] font-bold text-text-tertiary block uppercase tracking-widest">Browse all</span>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Neural Network Activity */}
        <div>
          <h2 className="text-xl font-bold text-foreground mb-6 tracking-tight">Recent Activity</h2>
          {myAgents.length === 0 && !loadingData ? (
             <Card className="text-center py-20">
               <p className="text-sm font-bold text-text-tertiary uppercase tracking-widest">No activity yet.</p>
               <Button variant="outline" className="mt-8 rounded-full h-12 px-8 font-bold" onClick={() => navigate('/agents/discover')}>Find your first helper</Button>
             </Card>
          ) : (
            <Card className="text-center py-20 group">
               <div className="w-16 h-16 rounded-full bg-surface-hover border border-border flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                  <ChartBarIcon className="h-8 w-8 text-text-tertiary" />
               </div>
               <p className="text-sm font-bold text-text-tertiary uppercase tracking-widest">
                Your recent activity will show up here.
              </p>
              <p className="text-xs text-text-tertiary font-medium mt-2">Use an AI helper to see your history.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
