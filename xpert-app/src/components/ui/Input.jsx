import clsx from 'clsx';

export default function Input({ label, error, icon: Icon, className, id, ...props }) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={clsx('space-y-1', className)}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Icon className="h-5 w-5 text-[var(--color-text-tertiary)]" />
          </div>
        )}
        <input
          id={inputId}
          className={clsx(
            'block w-full rounded-lg border bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-colors duration-150',
            Icon && 'pl-10',
            error ? 'border-red-500 focus:ring-red-500/30' : 'border-[var(--color-border)]'
          )}
          {...props}
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
