import clsx from 'clsx';

export default function Select({ label, options = [], error, className, id, ...props }) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={clsx('space-y-2', className)}>
      {label && (
        <label htmlFor={selectId} className="block text-xs font-black uppercase tracking-widest text-text-tertiary ml-1">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={clsx(
          'block w-full rounded-2xl border bg-background px-4 py-3.5 text-sm text-foreground transition-all duration-300',
          error
            ? 'border-red-500/50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
            : 'border-gray-200 dark:border-border focus:border-primary-500/50 focus:ring-4 focus:ring-primary-500/10'
        )}
        {...props}
      >
        <option value="" className="bg-background">Select...</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-background">
            {opt}
          </option>
        ))}
      </select>
      {error && <p className="text-[10px] font-bold text-red-500 ml-1 uppercase tracking-tighter">{error}</p>}
    </div>
  );
}
