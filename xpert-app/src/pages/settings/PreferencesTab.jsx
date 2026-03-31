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
            <Card
              key={opt.id}
              hoverable
              onClick={() => setTheme(opt.id)}
              className={clsx(
                'flex-1 p-4 flex flex-col items-center justify-center transition-all duration-500',
                preference === opt.id
                  ? 'border-primary-500 bg-transparent ring-1 ring-primary-500 shadow-[0_0_20px_rgba(33,196,93,0.15)]'
                  : 'border-gray-100 dark:border-border hover:border-primary-500/50'
              )}
            >
              <span className="text-2xl mb-2">{opt.icon}</span>
              <p className="text-xs font-bold text-foreground">{opt.label}</p>
            </Card>
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
