import clsx from 'clsx';
import Spinner from './Spinner';

const variants = {
  primary: 'bg-gradient-to-tr from-primary-600 to-emerald-400 text-black font-bold shadow-[0_4px_15px_rgba(33,196,93,0.3)] hover:scale-[1.03] active:scale-[0.97] transition-all',
  secondary: 'bg-[var(--color-bg-secondary)] text-[var(--color-text)] hover:bg-[var(--color-surface-hover)]',
  outline: 'border-2 border-primary-500/20 text-[var(--color-text)] hover:bg-primary-500/5 hover:border-primary-500/40',
  ghost: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]',
  danger: 'bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white',
};

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-2.5 text-sm',
  lg: 'px-8 py-4 text-base',
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
        'inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-500/20 active:scale-95',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  );
}
