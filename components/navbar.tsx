'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, X, LogOut, Ticket, LayoutDashboard, User, Loader2, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useAuthModal } from '@/components/auth/auth-modal-provider';
import { becomeOrganizerAction } from '@/lib/actions/users';
import { toast } from 'sonner';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const { openLogin, openSignup } = useAuthModal();
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleBecomeOrganizer = async () => {
    setIsUpgrading(true);
    try {
      const result = await becomeOrganizerAction();
      if (result.success) {
        toast.success("Welcome, Organizer! Redirecting to your dashboard...");
        // Use window.location to force a full reload and session refresh
        window.location.href = '/dashboard';
      } else {
        toast.error("Failed to upgrade role. Please try again.");
      }
    } catch (err) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.push('/');
    router.refresh();
  };

  const navLinks = [
    { name: 'Events', href: '/' },
    { name: 'Security', href: '#security' },
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-purple-500/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-300">
            <div className="relative h-10 w-10 sm:h-12 sm:w-12 flex items-center justify-center p-1 rounded-lg bg-gradient-to-br from-purple-500/20 to-red-500/20 group-hover:from-purple-500/30 group-hover:to-red-500/30 transition-colors">
              <Image
                src="/images/ticketa-logo.png"
                alt="Ticketa Logo"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-lg sm:text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:to-white transition-all duration-300">
              Ticketa
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href} 
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {!isPending && (
              <>
                {session ? (
                  <div className="hidden md:flex items-center gap-4">
                    <Link href="/tickets">
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        <Ticket className="w-4 h-4" />
                        My Tickets
                      </button>
                    </Link>
                    {(session.user.role === 'organizer' || session.user.role === 'admin') && (
                      <Link href="/dashboard">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors">
                          <LayoutDashboard className="w-4 h-4" />
                          Dashboard
                        </button>
                      </Link>
                    )}
                    {session.user.role === 'admin' && (
                      <Link href="/admin">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors">
                          <ShieldCheck className="w-4 h-4" />
                          Admin
                        </button>
                      </Link>
                    )}
                    {!isUpgrading && session.user.role !== 'organizer' && (
                      <button 
                        onClick={handleBecomeOrganizer}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                      >
                        <User className="w-4 h-4" />
                        Become Organizer
                      </button>
                    )}
                    {isUpgrading && (
                      <button disabled className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-400 opacity-50">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Upgrading...
                      </button>
                    )}
                    <button 
                      onClick={handleLogout}
                      className="px-6 py-2 rounded-full border border-white/10 text-white font-semibold text-sm hover:bg-white/5 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-4">
                    <button 
                      onClick={openLogin} 
                      className="text-gray-300 hover:text-white text-sm font-medium transition-colors"
                    >
                      Login
                    </button>
                    <motion.button
                      onClick={openSignup}
                      className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-red-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-shadow duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Get Started
                    </motion.button>
                  </div>
                )}
              </>
            )}
            
            <button 
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black/95 border-b border-purple-500/20 overflow-hidden"
          >
            <div className="px-4 py-8 flex flex-col gap-6 items-center">
              {navLinks.map((link) => (
                <Link 
                  key={link.name}
                  href={link.href} 
                  className="text-gray-300 hover:text-white transition-colors text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              {session ? (
                <>
                  <Link 
                    href="/tickets" 
                    className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-lg font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    <Ticket className="w-5 h-5" />
                    My Tickets
                  </Link>
                  {(session.user.role === 'organizer' || session.user.role === 'admin') && (
                    <Link 
                      href="/dashboard" 
                      className="flex items-center gap-3 text-purple-400 hover:text-purple-300 transition-colors text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </Link>
                  )}
                  {session.user.role === 'admin' && (
                    <Link 
                      href="/admin" 
                      className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors text-lg font-medium"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShieldCheck className="w-5 h-5" />
                      Admin Panel
                    </Link>
                  )}
                  {session.user.role !== 'organizer' && (
                    <button 
                      onClick={handleBecomeOrganizer}
                      disabled={isUpgrading}
                      className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors text-lg font-medium disabled:opacity-50"
                    >
                      {isUpgrading ? <Loader2 className="w-5 h-5 animate-spin" /> : <User className="w-5 h-5" />}
                      Become Organizer
                    </button>
                  )}
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors text-lg font-medium"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </>
              ) : (
                <button
                  className="w-full max-w-xs px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-red-500 text-white font-bold text-center"
                  onClick={() => {
                    openSignup();
                    setIsOpen(false);
                  }}
                >
                  Get Started
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
