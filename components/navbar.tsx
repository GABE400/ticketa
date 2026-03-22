'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Security', href: '#security' },
    { name: 'Pricing', href: '#pricing' },
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
          <div className="flex items-center gap-3 group px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-300">
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
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <motion.button
              className="hidden sm:block px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-red-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-shadow duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            
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
                <a 
                  key={link.name}
                  href={link.href} 
                  className="text-gray-300 hover:text-white transition-colors text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <button
                className="w-full max-w-xs px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-red-500 text-white font-bold text-center"
                onClick={() => setIsOpen(false)}
              >
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
