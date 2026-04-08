import { Link } from 'react-router-dom';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import logoFull from '../../assets/logo-full.svg';

export default function AuthLayout({ children }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 sm:px-6 relative overflow-hidden transition-colors duration-500">
      {/* Back to Home Link */}
      <div className="absolute top-8 left-8 z-50">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm font-semibold text-text-secondary hover:text-primary-500 transition-all group"
        >
          <div className="p-2 rounded-full bg-surface/50 border border-border/50 group-hover:border-primary-500/50 backdrop-blur-md">
            <ChevronLeftIcon className="h-4 w-4" />
          </div>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Environmental Glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/5 blur-[120px] rounded-full pointer-events-none dark:opacity-100 opacity-30" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none dark:opacity-100 opacity-30" />

      <div className="w-full max-w-[480px] z-10">
        <div className="mb-8 sm:mb-12 text-center">
          <div className="mx-auto mb-4 sm:mb-6 flex items-center justify-center group">
            <img src={logoFull} alt="Xpert" className="h-16 sm:h-20 group-hover:scale-105 transition-transform duration-500" />
          </div>
          <p className="text-text-tertiary font-bold uppercase tracking-[0.2em] text-[10px]">Premium AI Management Platform</p>
        </div>

        <div className="rounded-2xl sm:rounded-3xl border border-border bg-surface/40 backdrop-blur-xl p-5 sm:p-8 lg:p-10 shadow-2xl glass relative overflow-hidden">
          {children}
        </div>
        
        <div className="mt-12 text-center">
           <p className="text-text-tertiary text-xs font-medium tracking-tight uppercase">SESSION READY — EDGE DEPLOYED</p>
        </div>
      </div>
    </div>
  );
}
