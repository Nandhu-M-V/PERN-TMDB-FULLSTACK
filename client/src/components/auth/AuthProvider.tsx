import { useEffect, useState } from 'react';
import { AuthContext } from '../../context/authContext';
import type { User } from '../../context/authContext';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setTimeout(() => {
        setUser(JSON.parse(storedUser));
      }, 0);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
