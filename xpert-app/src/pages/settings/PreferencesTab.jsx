import useTheme from '../../hooks/useTheme';
import Toggle from '../../components/ui/Toggle';
import Select from '../../components/ui/Select';

export default function PreferencesTab() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-lg space-y-6">
      <div>
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-4">Appearance</h3>
        <Toggle
          checked={theme === 'dark'}
          onChange={toggleTheme}
          label="Dark Mode"
        />
      </div>

      <div>
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-4">Language</h3>
        <Select
          label="Default Language"
          options={['English', 'Spanish', 'French', 'German', 'Portuguese', 'Chinese', 'Japanese']}
          defaultValue="English"
        />
      </div>
    </div>
  );
}
