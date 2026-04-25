'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth';
import { Admin } from '../types';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  validateToken: () => Promise<boolean>;
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
  const router = useRouter();

  const validateToken = async (): Promise<boolean> => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      const response = await authService.getCurrentAdmin();
      if (response.success && response.data) {
        setAdmin(response.data);
        return true;
      } else {
        // Token is invalid
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
        return false;
      }
    } catch (error) {
      console.error('Token validation error:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('admin');
      setAdmin(null);
      return false;
    }
  };

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      const storedAdmin = localStorage.getItem('admin');
      
      if (token && storedAdmin) {
        // Validate token with backend
        const isValid = await validateToken();
        if (!isValid) {
          // Redirect to login if token is invalid
          if (window.location.pathname.startsWith('/admin')) {
            router.push('/admin/login');
          }
        }
      } else {
        setAdmin(null);
      }
      setIsLoading(false);
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      if (response.success && response.data) {
        setAdmin(response.data.admin);
        // Set cookie for middleware
        document.cookie = `token=${response.data.token}; path=/; max-age=2592000`; // 30 days
        toast.success('Login successful!');
        router.push('/admin/dashboard');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      toast.error('Invalid credentials');
      throw error;
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      const response = await authService.register({ email, password, name });
      if (response.success && response.data) {
        setAdmin(response.data.admin);
        // Set cookie for middleware
        document.cookie = `token=${response.data.token}; path=/; max-age=2592000`; // 30 days
        toast.success('Registration successful!');
        router.push('/admin/dashboard');
      } else {
        throw new Error(response.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('Registration failed');
      throw error;
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    
    // Clear cookie
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Reset state
    setAdmin(null);
    
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!admin && !!localStorage.getItem('token'),
        validateToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 'use client';

// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { authService } from '../services/auth';
// import { Admin } from '../types';

// interface AuthContextType {
//   admin: Admin | null;
//   isLoading: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, name: string) => Promise<void>;
//   logout: () => void;
//   isAuthenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within AuthProvider');
//   }
//   return context;
// };

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [admin, setAdmin] = useState<Admin | null>(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const loadAdmin = () => {
//       const storedAdmin = authService.getAdmin();
//       if (storedAdmin && authService.isAuthenticated()) {
//         setAdmin(storedAdmin);
//       }
//       setIsLoading(false);
//     };
//     loadAdmin();
//   }, []);

//   const login = async (email: string, password: string) => {
//     const response = await authService.login({ email, password });
//     if (response.success && response.data) {
//       setAdmin(response.data.admin);
//     }
//   };

//   const register = async (email: string, password: string, name: string) => {
//     const response = await authService.register({ email, password, name });
//     if (response.success && response.data) {
//       setAdmin(response.data.admin);
//     }
//   };

//   const logout = () => {
//     authService.logout();
//     setAdmin(null);
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         admin,
//         isLoading,
//         login,
//         register,
//         logout,
//         isAuthenticated: !!admin && authService.isAuthenticated(),
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };