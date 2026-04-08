import clsx from 'clsx';

export default function Card({ children, className, hoverable = false, glass = false, onClick, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-3xl p-8 transition-all duration-500 overflow-hidden',
        glass ? 'glass' : 'bg-white dark:bg-[var(--color-surface)] border border-gray-100 dark:border-border',
        hoverable && [
          'cursor-pointer hover:scale-[1.01] active:scale-[0.99] shadow-sm hover:shadow-[0_0_30px_rgba(31,196,95,0.1)]',
          'hover:border-primary-500/50 transition-all duration-500'
        ],
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
