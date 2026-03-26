import clsx from 'clsx';

const variants = {
  success: 'bg-green-100 text-green-700 [data-theme="dark"]_&:bg-green-900/30 [data-theme="dark"]_&:text-green-400',
  warning: 'bg-amber-100 text-amber-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  neutral: 'bg-gray-100 text-gray-700',
  premium: 'bg-gradient-to-r from-primary-500 to-emerald-400 text-white',
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
