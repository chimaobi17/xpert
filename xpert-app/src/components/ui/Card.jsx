import clsx from 'clsx';

export default function Card({ children, className, hoverable = false, glass = false, onClick, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-3xl p-8 transition-all duration-300',
        glass ? 'glass shadow-lg' : 'bg-[var(--color-surface)] border border-border shadow-sm',
        hoverable && 'cursor-pointer hover:bg-surface-hover hover:shadow-xl hover:scale-[1.01] active:scale-[0.99]',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
