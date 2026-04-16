'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import AuthModal from '@/components/auth/auth-modal';

interface AuthModalContextType {
  openLogin: () => void;
  openSignup: () => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [tab, setTab] = useState<'login' | 'signup'>('login');

  const openLogin = () => {
    setTab('login');
    setIsOpen(true);
  };

  const openSignup = () => {
    setTab('signup');
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return (
    <AuthModalContext.Provider value={{ openLogin, openSignup, close }}>
      {children}
      <AuthModal 
        isOpen={isOpen} 
        onOpenChange={setIsOpen} 
        defaultTab={tab} 
      />
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (context === undefined) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
