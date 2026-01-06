import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, setAuthToken, removeAuthToken } from '../lib/api';

interface AuthContextType {
  user: any | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          // Verify token or decode it. For simple JWT, check if expired.
          // Or verify with /auth/me endpoint if exists. 
          // For now, assuming token valid if present until 401.
          
          setUser({ email: 'user@example.com' }); // Should decode token
        } catch (error) {
          removeAuthToken();
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await api.post('/auth/login', { email, password });
    if (data.token) {
      setAuthToken(data.token);
      setUser({ email }); // Extract from token
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    const data = await api.post('/auth/register', { email, password, fullName });
    if (data.token) {
      setAuthToken(data.token);
      setUser({ email, fullName });
    }
  };

  const logout = () => {
    removeAuthToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
