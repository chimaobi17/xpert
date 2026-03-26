import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Tabs from '../../components/ui/Tabs';
import ProfileTab from './ProfileTab';
import PlanTab from './PlanTab';
import PreferencesTab from './PreferencesTab';

const tabs = [
  { id: 'profile', label: 'Profile' },
  { id: 'plan', label: 'Plan & Usage' },
  { id: 'preferences', label: 'Preferences' },
  { id: 'api', label: 'API Keys' },
];

export default function Settings() {
  const [searchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'profile';
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)]">Settings</h1>
        <p className="text-sm text-[var(--color-text-secondary)] mt-1">
          Manage your account and preferences
        </p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'plan' && <PlanTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
        {activeTab === 'api' && (
          <div className="text-center py-12">
            <p className="text-sm text-[var(--color-text-secondary)]">API key management coming soon.</p>
          </div>
        )}
      </div>
    </div>
  );
}
