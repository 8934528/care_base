import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const fullName = localStorage.getItem('fullName');

    if (token && role && fullName) {
      return { token, role, fullName };
    }
    return null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('fullName', userData.fullName);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
