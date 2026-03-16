import { API_URL } from '@/environment_variables/env_constants';

export const apiFetch = async (url: string, options: RequestInit = {}) => {
  return fetch(`${API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

export const logout = async () => {
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
};
