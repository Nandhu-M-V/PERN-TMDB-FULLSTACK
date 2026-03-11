const API = 'http://localhost:5000/auth';

const handleResponse = async (res: Response) => {
  let data;

  try {
    data = await res.json();
  } catch (error) {
    console.error('❌ Failed to parse JSON:', error);
    throw new Error('Invalid server response');
  }

  if (!res.ok) {
    console.error('❌ API Error:', res.status, data);
    throw new Error(data?.message || 'Request failed');
  }

  return data;
};

export const login = async (email: string, password: string) => {
  console.log(' Login request:', { email });

  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(res);
  localStorage.setItem('user', JSON.stringify(data.user));

  //   console.log(' Login success:', data);

  return data;
};

export const register = async (email: string, password: string) => {
  console.log(' Register request:', { email });

  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password }),
  });

  const data = await handleResponse(res);

  //   console.log(' Register success:', data);

  return data;
};

export const refresh = async () => {
  console.log(' Refresh token request');

  const res = await fetch(`${API}/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  const data = await handleResponse(res);

  //   console.log(' Token refreshed:', data);

  return data;
};
