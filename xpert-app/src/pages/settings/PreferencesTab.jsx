import clsx from 'clsx';
import useTheme from '../../hooks/useTheme';
import Card from '../../components/ui/Card';
import LanguageSelector from '../../components/ui/LanguageSelector';

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
                  ? 'border-primary-500 bg-transparent ring-1 ring-primary-500 shadow-[0_0_20px_rgba(31,196,95,0.15)]'
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
        <LanguageSelector />
        <p className="text-xs text-[var(--color-text-tertiary)] mt-3">
          Choose your preferred language. All UI text will be translated accordingly.
        </p>
      </Card>
    </div>
  );
}
