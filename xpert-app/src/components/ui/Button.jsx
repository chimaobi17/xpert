import clsx from 'clsx';
import Spinner from './Spinner';

const variants = {
  primary: 'bg-primary-500 text-black font-black uppercase tracking-widest shadow-[0_0_30px_rgba(31,196,95,0.3)] hover:scale-105 hover:bg-white active:scale-95 transition-all outline-none',
  secondary: 'bg-surface-hover text-foreground font-bold glass border-border/50 hover:bg-surface hover:text-foreground active:scale-95 border transition-all',
  outline: 'border border-border text-text-secondary font-bold hover:border-primary-500 hover:text-primary-500 hover:bg-primary-500/5 active:scale-95 transition-all',
  ghost: 'text-text-secondary hover:text-foreground hover:bg-surface-hover font-bold active:scale-95 transition-all',
  danger: 'bg-red-500/10 text-red-500 font-black uppercase tracking-tighter hover:bg-red-500 hover:text-white hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] active:scale-95 transition-all',
};

const sizes = {
  sm: 'px-5 py-2 text-[10px]',
  md: 'px-8 py-3.5 text-sm',
  lg: 'px-12 py-5 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  ...props
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/40 active:scale-95 border border-transparent',
        'dark:active:bg-transparent dark:active:border-primary-500 dark:active:text-primary-500',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed grayscale',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Spinner size="sm" className="mr-1" /> : null}
      {children}
    </button>
  );
}
