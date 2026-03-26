import clsx from 'clsx';

export default function Card({ children, className, hoverable = false, onClick, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6',
        hoverable && 'transition-all duration-150 hover:border-primary-500/40 hover:shadow-md cursor-pointer',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
