"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface User {
  name: string;
  email: string;
  createdAt: number;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem('mizen_user_profile');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        // We do NOT load the password into state for security
        setUser({ name: parsed.name, email: parsed.email, createdAt: parsed.createdAt });
      } catch (e) {
        console.error("Failed to parse user profile");
      }
    }
    setIsReady(true);
  }, []);

  const login = (email: string, password: string) => {
    const savedUser = localStorage.getItem('mizen_user_profile');
    if (!savedUser) return false;

    try {
      const parsed = JSON.parse(savedUser);
      // VERY basic client-side check. In a real app, this would be hashed and on a server.
      if (parsed.email.toLowerCase() === email.toLowerCase() && parsed.password === password) {
        setUser({ name: parsed.name, email: parsed.email, createdAt: parsed.createdAt });
        return true;
      }
    } catch (e) {
      return false;
    }
    return false;
  };

  const register = (name: string, email: string, password: string) => {
    const newUser = {
      name,
      email: email.toLowerCase(),
      password, // Stored locally only
      createdAt: Date.now()
    };
    localStorage.setItem('mizen_user_profile', JSON.stringify(newUser));
    setUser({ name, email: newUser.email, createdAt: newUser.createdAt });
  };

  const logout = () => {
    setUser(null);
    // Note: We do NOT delete the local storage, so they can log back in.
    // If they want to delete their account completely, that would be a different function.
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isReady }}>
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
