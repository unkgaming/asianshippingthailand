'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'email';
  role?: 'customer' | 'employee' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  employeeLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('logistix_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('logistix_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('logistix_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('logistix_user');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    // Mock login - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In production, validate against backend
    // For now, accept any email/password
    const mockUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email: email,
      name: email.split('@')[0],
      provider: 'email',
      role: 'customer'
    };
    
    setUser(mockUser);
  };

  const employeeLogin = async (email: string, password: string) => {
    // Mock employee login - simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Check if employee credentials (simple check for demo)
    // In production, validate against backend with proper security
    if (email.includes('admin') || email.includes('employee') || password === 'employee123') {
      const mockEmployee: User = {
        id: 'emp_' + Math.random().toString(36).substr(2, 9),
        email: email,
        name: email.split('@')[0],
        provider: 'email',
        role: 'employee'
      };
      setUser(mockEmployee);
    } else {
      throw new Error('Invalid employee credentials');
    }
  };

  const loginWithGoogle = async () => {
    // Mock Google OAuth - simulate popup and callback
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate Google user data
    const mockGoogleUser: User = {
      id: 'google_' + Math.random().toString(36).substr(2, 9),
      email: 'user@gmail.com',
      name: 'Google User',
      avatar: 'https://ui-avatars.com/api/?name=Google+User&background=4285f4&color=fff',
      provider: 'google'
    };
    
    setUser(mockGoogleUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('logistix_user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, loginWithGoogle, employeeLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
