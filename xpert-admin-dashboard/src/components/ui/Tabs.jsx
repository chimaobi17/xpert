import clsx from 'clsx';

export default function Tabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={clsx('flex gap-1 border-b border-[var(--color-border)]', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={clsx(
            'px-4 py-2.5 text-sm font-medium transition-colors duration-150 border-b-2 -mb-px',
            activeTab === tab.id
              ? 'border-primary-500 text-primary-600'
              : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text)] hover:border-[var(--color-border)]'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
