import clsx from 'clsx';

export default function Textarea({ label, error, rows = 4, className, id, ...props }) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={clsx('space-y-1', className)}>
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-[var(--color-text)]">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        rows={rows}
        className={clsx(
          'block w-full rounded-lg border bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] transition-colors duration-150 resize-y',
          error ? 'border-red-500 focus:ring-red-500/30' : 'border-[var(--color-border)]'
        )}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
