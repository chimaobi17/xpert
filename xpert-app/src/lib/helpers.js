export function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatDate(dateStr) {
  if (!dateStr) return 'No date';
  const date = new Date(dateStr);
  if (isNaN(date.getTime()) || date.getFullYear() <= 1970) return 'No date';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function timeAgo(dateStr) {
  if (!dateStr) return 'No date';
  const date = new Date(dateStr);
  if (isNaN(date.getTime()) || date.getFullYear() <= 1970) return 'No date';
  const now = new Date();
  const seconds = Math.floor((now - date) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours > 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  return formatDate(dateStr);
}

export function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function truncate(str, length = 80) {
  if (!str) return '';
  return str.length > length ? str.slice(0, length) + '...' : str;
}

export function interpolateTemplate(template, values) {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value || '');
  }
  result = result.replace(/\{\{#if \w+\}\}([\s\S]*?)\{\{\/if\}\}/g, (match, content) => {
    const fieldMatch = match.match(/\{\{#if (\w+)\}\}/);
    const field = fieldMatch ? fieldMatch[1] : '';
    return values[field] ? content.replace(new RegExp(`\\{\\{${field}\\}\\}`, 'g'), values[field]) : '';
  });
  return result.trim();
}

export function generateCacheKey(agentId, promptText) {
  const input = `${agentId}:${promptText}`;
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(16);
}
