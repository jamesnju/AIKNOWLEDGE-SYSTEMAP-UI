'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { Admin } from '../types';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAdmin = () => {
      const storedAdmin = authService.getAdmin();
      if (storedAdmin && authService.isAuthenticated()) {
        setAdmin(storedAdmin);
      }
      setIsLoading(false);
    };
    loadAdmin();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    if (response.success && response.data) {
      setAdmin(response.data.admin);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    const response = await authService.register({ email, password, name });
    if (response.success && response.data) {
      setAdmin(response.data.admin);
    }
  };

  const logout = () => {
    authService.logout();
    setAdmin(null);
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!admin && authService.isAuthenticated(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};