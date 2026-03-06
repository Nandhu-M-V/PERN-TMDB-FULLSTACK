const API = 'http://localhost:5000/api/auth';

export const login = async (email: string, password: string) => {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const register = async (email: string, password: string) => {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  return res.json();
};

export const refresh = async () => {
  const res = await fetch(`${API}/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  return res.json();
};
