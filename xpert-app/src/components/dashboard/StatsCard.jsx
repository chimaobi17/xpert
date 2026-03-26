import clsx from 'clsx';

export default function StatsCard({ icon: Icon, label, value, subtitle, trend, className }) {
  return (
    <div className={clsx('rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--color-text-secondary)]">{label}</p>
          <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-[var(--color-text-tertiary)]">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="rounded-lg bg-primary-50 p-2.5">
            <Icon className="h-5 w-5 text-primary-600" />
          </div>
        )}
      </div>
      {trend && (
        <div className="mt-3 flex items-center gap-1">
          <span className={clsx('text-xs font-medium', trend > 0 ? 'text-green-600' : 'text-red-500')}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-xs text-[var(--color-text-tertiary)]">vs yesterday</span>
        </div>
      )}
    </div>
  );
}
