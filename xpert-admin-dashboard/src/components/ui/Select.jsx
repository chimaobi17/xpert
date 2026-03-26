import clsx from 'clsx';

export default function Select({ label, options = [], error, className, id, ...props }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={clsx('space-y-1', className)}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'block w-full rounded-lg border bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] transition-colors duration-150',
          error ? 'border-red-500 focus:ring-red-500/30' : 'border-[var(--color-border)]'
        )}
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
