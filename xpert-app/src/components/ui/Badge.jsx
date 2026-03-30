import clsx from 'clsx';

const variants = {
  success: 'bg-primary-500/10 text-primary-500 border border-primary-500/20 font-bold uppercase tracking-widest',
  warning: 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-bold uppercase tracking-widest',
  error: 'bg-red-500/10 text-red-500 border border-red-500/20 font-bold uppercase tracking-widest',
  info: 'bg-blue-500/10 text-blue-500 border border-blue-500/20 font-bold uppercase tracking-widest',
  neutral: 'bg-surface-hover text-text-secondary border border-border/50 font-bold uppercase tracking-widest',
  premium: 'bg-gradient-to-r from-amber-400 to-orange-500 text-black border-none font-black uppercase tracking-widest shadow-lg',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-[8px]',
  md: 'px-3 py-1 text-[10px]',
};

export default function Badge({ children, variant = 'neutral', size = 'md', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full',
        variants[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
