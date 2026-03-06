export const apiFetch = async (url: string, options: RequestInit = {}) => {
  return fetch(`http://localhost:5000${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
};

export const logout = async () => {
  await fetch('http://localhost:5000/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
};
