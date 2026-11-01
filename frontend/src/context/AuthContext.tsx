import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children?: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const fullName = localStorage.getItem('fullName');
    const email = localStorage.getItem('email') || undefined;
    const employeeId = localStorage.getItem('employeeId') || undefined;
    const departmentName = localStorage.getItem('departmentName') || undefined;
    const permissionsRaw = localStorage.getItem('permissions');
    const permissions = permissionsRaw ? JSON.parse(permissionsRaw) : [];

    if (token && role && fullName) {
      return { token, role, fullName, email, employeeId, departmentName, permissions };
    }
    return null;
  });

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('fullName', userData.fullName);
    if (userData.email) localStorage.setItem('email', userData.email);
    if (userData.employeeId) localStorage.setItem('employeeId', userData.employeeId);
    if (userData.departmentName) localStorage.setItem('departmentName', userData.departmentName);
    if (userData.permissions) {
      localStorage.setItem('permissions', JSON.stringify(userData.permissions));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'Admin') return true;
    if (!user.permissions) return false;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasPermission }}>
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
