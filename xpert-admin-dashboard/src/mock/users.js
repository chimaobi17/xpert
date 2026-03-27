export const users = [
  { id: 1, name: 'Admin User', email: 'admin@xpert.test', role: 'super_admin', plan_level: 'premium', tokens_today: 5200, requests_today: 32, job_title: 'Platform Admin', purpose: 'Manage XPERT', field_of_specialization: 'technology', banned_until: null, ban_reason: null, created_at: '2026-01-01T00:00:00Z' },
  { id: 2, name: 'Test User', email: 'user@xpert.test', role: 'user', plan_level: 'free', tokens_today: 8750, requests_today: 18, job_title: 'Developer', purpose: 'Code generation', field_of_specialization: 'technology', banned_until: null, ban_reason: null, created_at: '2026-01-15T10:00:00Z' },
  { id: 3, name: 'Sarah Chen', email: 'sarah@example.com', role: 'user', plan_level: 'standard', tokens_today: 45000, requests_today: 89, job_title: 'Content Strategist', purpose: 'Content creation', field_of_specialization: 'creative', banned_until: null, ban_reason: null, created_at: '2026-02-10T08:30:00Z' },
  { id: 4, name: 'James Wilson', email: 'james@example.com', role: 'user', plan_level: 'free', tokens_today: 12000, requests_today: 25, job_title: 'Business Consultant', purpose: 'Market analysis', field_of_specialization: 'business', banned_until: null, ban_reason: null, created_at: '2026-02-15T14:00:00Z' },
  { id: 5, name: 'Maria Garcia', email: 'maria@example.com', role: 'admin', plan_level: 'premium', tokens_today: 78000, requests_today: 156, job_title: 'Researcher', purpose: 'Document analysis', field_of_specialization: 'research', banned_until: null, ban_reason: null, created_at: '2026-03-01T09:00:00Z' },
  { id: 6, name: 'Alex Kim', email: 'alex@example.com', role: 'user', plan_level: 'free', tokens_today: 3200, requests_today: 8, job_title: 'Translator', purpose: 'Language translation', field_of_specialization: 'language', banned_until: null, ban_reason: null, created_at: '2026-03-05T11:30:00Z' },
  { id: 7, name: 'Blocked User', email: 'blocked@example.com', role: 'user', plan_level: 'free', tokens_today: 0, requests_today: 0, job_title: null, purpose: null, field_of_specialization: null, banned_until: '2026-04-25T00:00:00Z', ban_reason: 'Abuse of AI generation quota through automated scripting', created_at: '2026-03-10T15:00:00Z' },
];

export function getUserById(id) {
  return users.find((u) => u.id === Number(id));
}
