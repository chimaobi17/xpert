import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function ProfileTab() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success('Profile updated');
    }, 800);
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Avatar name={user?.name} size="lg" />
        <div>
          <p className="text-sm font-medium text-[var(--color-text)]">{user?.name}</p>
          <p className="text-xs text-[var(--color-text-secondary)]">{user?.email}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-4">
        <Input
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Input
          label="Email"
          value={user?.email || ''}
          disabled
          className="opacity-60"
        />
        <Button type="submit" loading={loading}>
          Save Changes
        </Button>
      </form>
    </div>
  );
}
