import clsx from 'clsx';

const variants = {
  success: 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  neutral: 'bg-gray-100 text-gray-700 dark:bg-zinc-800 dark:text-zinc-400',
  premium: 'bg-gradient-to-r from-primary-500 to-primary-300 text-white shadow-sm',
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
};

export default function Badge({ children, variant = 'neutral', size = 'md', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}
