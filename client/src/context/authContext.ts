import { createContext } from 'react';

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | null>(null);
