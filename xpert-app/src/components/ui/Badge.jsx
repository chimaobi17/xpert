import clsx from 'clsx';

const variants = {
  success: 'bg-primary-500/10 text-primary-500 border border-primary-500/20 italic font-bold uppercase tracking-tighter',
  warning: 'bg-amber-500/10 text-amber-500 border border-amber-500/20 italic font-bold uppercase tracking-tighter',
  error: 'bg-red-500/10 text-red-500 border border-red-500/20 italic font-bold uppercase tracking-tighter',
  info: 'bg-blue-500/10 text-blue-500 border border-blue-500/20 italic font-bold uppercase tracking-tighter',
  neutral: 'bg-zinc-800 text-zinc-400 border border-zinc-700/50 italic font-bold uppercase tracking-tighter',
  premium: 'bg-gradient-to-r from-amber-400 to-orange-500 text-black border-none italic font-black uppercase tracking-tighter shadow-[0_0_15px_rgba(251,191,36,0.2)]',
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
