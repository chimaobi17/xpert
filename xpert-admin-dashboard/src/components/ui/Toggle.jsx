import clsx from 'clsx';

export default function Toggle({ checked, onChange, label, className }) {
  return (
    <label className={clsx('inline-flex items-center gap-3 cursor-pointer', className)}>
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div
          className={clsx(
            'h-6 w-11 rounded-full transition-colors duration-200',
            checked ? 'bg-primary-500' : 'bg-gray-300'
          )}
        />
        <div
          className={clsx(
            'absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200',
            checked && 'translate-x-5'
          )}
        />
      </div>
      {label && <span className="text-sm text-[var(--color-text)]">{label}</span>}
    </label>
  );
}
