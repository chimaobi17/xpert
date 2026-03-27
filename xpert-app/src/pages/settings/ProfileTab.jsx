import { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import { patch } from '../../lib/apiClient';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import toast from 'react-hot-toast';

export default function ProfileTab() {
  const { user, updateUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    const res = await patch('/user/profile', { name });
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
