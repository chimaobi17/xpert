import { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { patch } from '../../lib/apiClient';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import Badge from '../../components/ui/Badge';
import toast from 'react-hot-toast';

export default function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [purpose, setPurpose] = useState('');
  const [specialization, setSpecialization] = useState('technology');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setJobTitle(user.job_title || '');
      setPurpose(user.purpose || '');
      setSpecialization(user.field_of_specialization || 'technology');
    }
  }, [user]);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    const res = await patch('/user/profile', { 
      name,
      job_title: jobTitle,
      purpose,
      field_of_specialization: specialization
    });
    if (res.ok) {
      updateUser(res.data);
      toast.success('Profile updated');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Avatar name={user?.name} size="lg" />
        <div>
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-[var(--color-text)]">{user?.name}</p>
            <Badge
              variant={user?.plan_level === 'premium' ? 'premium' : user?.plan_level === 'standard' ? 'success' : 'neutral'}
              size="sm"
            >
              {user?.plan_level === 'premium' ? 'Premium' : user?.plan_level === 'standard' ? 'Standard' : 'Free'}
            </Badge>
          </div>
          <p className="text-xs text-[var(--color-text-secondary)]">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
        />
        
        <Input
          label="Job Title"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          placeholder="e.g. Software Engineer, Student"
        />

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            Primary Area of Focus
          </label>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-primary-500 focus:outline-none"
          >
            <option value="technology">Technology & Engineering</option>
            <option value="creative">Creative & Content</option>
            <option value="business">Business & Support</option>
            <option value="research">Research & Analysis</option>
            <option value="language">Language & Arts</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
            What will you use XPERT for?
          </label>
          <textarea
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-3 text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-tertiary)] focus:border-primary-500 focus:outline-none"
            placeholder="Tell us about how you use AI in your daily work..."
          />
        </div>

        <Input
          label="Email Address"
          value={user?.email || ''}
          disabled
          className="opacity-60 bg-gray-50/5"
        />

        <div className="pt-2">
          <Button type="submit" loading={loading} className="w-full sm:w-auto">
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
