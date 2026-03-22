'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Navbar() {
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
            <div className="relative h-12 w-12 flex items-center justify-center p-1 rounded-lg bg-gradient-to-br from-purple-500/20 to-red-500/20 group-hover:from-purple-500/30 group-hover:to-red-500/30 transition-colors">
              <Image
                src="/images/ticketa-logo.png"
                alt="Ticketa Logo"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent group-hover:to-white transition-all duration-300">
              Ticketa
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Features
            </a>
            <a href="#security" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Security
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
              Pricing
            </a>
          </div>

          {/* CTA Button */}
          <motion.button
            className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-500 to-red-500 text-white font-semibold text-sm hover:shadow-lg hover:shadow-purple-500/50 transition-shadow duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}
