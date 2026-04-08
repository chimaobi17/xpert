import api from './axios';

/**
 * Centralized API client — all components call this instead of axios directly.
 * Handles error codes from the standardized backend error format.
 */

let showUpgradeModal = null;
let navigateToLogin = null;
let navigateToBlocked = null;
let showToastFn = null;

export function registerApiHandlers({ onUpgrade, onLogin, onBlocked, onToast }) {
  showUpgradeModal = onUpgrade;
  navigateToLogin = onLogin;
  navigateToBlocked = onBlocked;
  showToastFn = onToast;
}

function toast(message, type = 'error') {
  if (showToastFn) {
    showToastFn(message, type);
  }
}

export async function apiCall(method, url, data = null, options = {}) {
  try {
    const config = { method, url, ...options };

    if (data) {
      if (data instanceof FormData) {
        config.data = data;
        config.headers = { ...config.headers, 'Content-Type': 'multipart/form-data' };
      } else {
        config.data = data;
      }
    }

    const response = await api(config);

    return { ok: true, data: response.data };
  } catch (err) {
    // Handle aborted requests silently
    if (err.code === 'ERR_CANCELED' || err.name === 'CanceledError') {
      return { ok: false, error: { error: 'cancelled' }, data: null };
    }

    if (!err.response) {
      toast('Cannot reach server. Check your connection.', 'error');
      return { ok: false, error: { error: 'network_error', retry: true, upgrade: false } };
    }

    const error = err.response.data || {};
    const status = err.response.status;

    switch (error.error) {
      case 'auth_required':
        navigateToLogin?.();
        break;

      case 'account_blocked':
        navigateToBlocked?.(error);
        break;

      case 'quota_exceeded':
      case 'premium_required':
      case 'file_too_large':
      case 'prompt_too_long':
      case 'agent_limit_reached':
        if (error.upgrade) {
          showUpgradeModal?.(error.message);
        } else {
          toast(error.message, 'error');
        }
        break;

      case 'rate_limited':
        toast(`Rate limited. Try again in ${error.retry_after || 60} seconds.`, 'warning');
        break;

      case 'ai_unavailable':
        toast('Your request has been queued. Processing shortly.', 'info');
        break;

      case 'ai_timeout':
        toast('AI took too long. Please try again.', 'warning');
        break;

      case 'validation_failed':
        return { ok: false, validationErrors: error.details || {}, error };

      case 'agent_already_added':
        toast('This agent is already in your workspace.', 'info');
        break;

      case 'forbidden':
        toast('Access denied.', 'error');
        break;

      default:
        if (status === 401) {
          navigateToLogin?.();
        } else if (status === 422 && error.details) {
          return { ok: false, validationErrors: error.details, error };
        } else {
          toast(error.message || 'Something went wrong.', 'error');
        }
    }

    return { ok: false, error };
  }
}

// Convenience methods
export const get = (url, options) => apiCall('get', url, null, options);
export const post = (url, data, options) => apiCall('post', url, data, options);
export const patch = (url, data, options) => apiCall('patch', url, data, options);
export const put = (url, data, options) => apiCall('put', url, data, options);
export const del = (url, options) => apiCall('delete', url, null, options);
