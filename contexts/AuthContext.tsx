'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

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
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  // Bridge NextAuth session to legacy user shape
  useEffect(() => {
    if (session?.user) {
      const s = session.user as any;
      setUser({
        id: s.id || s.email || 'unknown',
        email: s.email,
        name: s.name || s.email?.split('@')[0] || 'User',
        avatar: s.image,
        provider: 'google', // or 'email' (we can't easily distinguish here without extra field)
        role: s.role || 'customer'
      });
    } else {
      setUser(null);
    }
  }, [session]);

  const login = async (email: string, password: string) => {
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) throw new Error(result.error);
    if (result?.ok) {
      window.location.href = '/portal';
    }
  };

  const employeeLogin = async (email: string, password: string) => {
    const result = await signIn('credentials', { email, password, redirect: false });
    if (result?.error) throw new Error(result.error);
    if (result?.ok) {
      window.location.href = '/admin/portal';
    }
  };

  const loginWithGoogle = async () => {
    await signIn('google', { callbackUrl: '/portal' });
  };

  const logout = () => {
    signOut({ callbackUrl: '/auth/signin' });
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
