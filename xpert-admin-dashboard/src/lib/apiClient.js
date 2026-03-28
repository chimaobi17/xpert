import api from './axios';

export async function apiCall(method, url, data = null, options = {}) {
  try {
    const config = { method, url, ...options };
    if (data) config.data = data;
    const response = await api(config);
    return { ok: true, data: response.data };
  } catch (err) {
    if (!err.response) {
      return { ok: false, error: { error: 'network_error' } };
    }
    return { ok: false, error: err.response.data || {}, status: err.response.status };
  }
}

export const get = (url, options) => apiCall('get', url, null, options);
export const post = (url, data, options) => apiCall('post', url, data, options);
export const patch = (url, data, options) => apiCall('patch', url, data, options);
export const put = (url, data, options) => apiCall('put', url, data, options);
export const del = (url, options) => apiCall('delete', url, null, options);
