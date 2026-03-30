import clsx from 'clsx';

export default function Card({ children, className, hoverable = false, onClick, ...props }) {
  return (
    <div
      className={clsx(
        'rounded-[2rem] bg-[var(--color-surface)] p-8 transition-all duration-300',
        hoverable && 'cursor-pointer hover:bg-[var(--color-surface-hover)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.01] active:scale-[0.99]',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
