import { useState, useEffect, useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';
import useAuth from '../../hooks/useAuth';
import { patch, post } from '../../lib/apiClient';
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
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setJobTitle(user.job_title || '');
      setPurpose(user.purpose || '');
      setSpecialization(user.field_of_specialization || 'technology');
      setLanguage(user.language_preference || 'en');
    }
  }, [user]);

  async function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }

    setAvatarUploading(true);
    const formData = new FormData();
    formData.append('avatar', file);

    const res = await post('/user/avatar', formData);
    if (res.ok) {
      updateUser(res.data);
      toast.success('Profile picture updated');
    }
    setAvatarUploading(false);
    e.target.value = '';
  }

  async function handleSave(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await patch('/user/profile', {
        name,
        job_title: jobTitle,
        purpose,
        field_of_specialization: specialization,
        language_preference: language
      });
      if (res.ok) {
        updateUser(res.data);
        toast.success('Profile updated');
      } else {
        toast.error(res.error?.message || 'Failed to save profile');
      }
    } catch {
      toast.error('Failed to save profile');
    }
    setLoading(false);
  }

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <div className="relative group">
          <Avatar name={user?.name} src={user?.avatar_url} size="lg" />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-none"
          >
            {avatarUploading
              ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : <CameraIcon className="h-5 w-5 text-white" />
            }
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarChange}
            className="hidden"
          />
        </div>
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
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs text-primary-500 hover:text-primary-600 font-medium mt-1 border-none bg-transparent cursor-pointer p-0"
          >
            Change photo
          </button>
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
            Language Preference
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-text)] focus:border-primary-500 focus:outline-none"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
            <option value="zh">中文</option>
            <option value="ar">العربية</option>
            <option value="pt">Português</option>
            <option value="it">Italiano</option>
            <option value="ru">Русский</option>
            <option value="ja">日本語</option>
            <option value="ko">한국어</option>
            <option value="hi">हिन्दी</option>
            <option value="tr">Türkçe</option>
            <option value="nl">Nederlands</option>
            <option value="sw">Kiswahili</option>
            <option value="id">Bahasa Indonesia</option>
            <option value="vi">Tiếng Việt</option>
            <option value="pl">Polski</option>
            <option value="bn">বাংলা</option>
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
