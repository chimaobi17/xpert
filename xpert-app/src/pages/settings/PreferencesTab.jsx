import clsx from 'clsx';
import useTheme from '../../hooks/useTheme';
import Card from '../../components/ui/Card';

const themeOptions = [
  { id: 'light', label: 'Light', icon: '☀️' },
  { id: 'dark', label: 'Dark', icon: '🌙' },
  { id: 'system', label: 'System', icon: '💻' },
];

export default function PreferencesTab() {
  const { preference, setTheme } = useTheme();

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Theme</h3>
        <div className="flex gap-2">
          {themeOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setTheme(opt.id)}
              className={clsx(
                'flex-1 rounded-lg border px-4 py-3 text-center transition-all',
                preference === opt.id
                  ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                  : 'border-[var(--color-border)] hover:border-primary-300'
              )}
            >
              <span className="text-xl">{opt.icon}</span>
              <p className="text-xs font-medium text-[var(--color-text)] mt-1">{opt.label}</p>
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--color-text-tertiary)] mt-3">
          System mode follows your operating system&apos;s theme preference.
        </p>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold text-[var(--color-text)] mb-4">Default Language</h3>
        <select
          className="block w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)]"
          defaultValue="en"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
        </select>
      </Card>
    </div>
  );
}
