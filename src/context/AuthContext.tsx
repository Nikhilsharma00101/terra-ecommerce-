'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { SessionProvider, useSession, signIn, signOut, getSession } from 'next-auth/react';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  tier?: string;
  phone?: string;
  image?: string;
  addresses?: Array<any>;
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProviderInner: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = useMemo(() => {
    if (session?.user) {
      return {
        id: (session.user as any).id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        image: session.user.image || undefined,
        role: (session.user as any).role || 'user',
        tier: (session.user as any).tier,
      };
    }
    return null;
  }, [session]);

  const refreshUser = useCallback(async () => {
    // Force a re-fetch of the session from the server
    await getSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        return { success: false, error: res.error };
      }

      // session will automatically update via useSession, but we return true immediately
      return { success: true };
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      return {
        success: false,
        error: errorObj.message || 'An unexpected connection error occurred.',
      };
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    phone?: string
  ) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone }),
      });

      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || 'Failed to register.' };
      }

      // After successful registration, automatically log them in
      await login(email, password);
      return { success: true };
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      return {
        success: false,
        error: errorObj.message || 'An unexpected connection error occurred.',
      };
    }
  };

  const logout = async () => {
    localStorage.removeItem('terra_cart');
    localStorage.removeItem('terra_coupon');
    signOut({ callbackUrl: '/login' });
  };

  const isAdmin = user?.role === 'admin';
  const isAuthenticated = !!user;
  const isLoading = status === 'loading';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <SessionProvider>
      <AuthProviderInner>{children}</AuthProviderInner>
    </SessionProvider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
