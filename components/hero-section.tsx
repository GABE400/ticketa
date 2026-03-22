'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  };

  return (
    <section 
      className="relative min-h-screen pt-20 pb-20 overflow-hidden flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%), url(/images/event-crowd.jpg)',
        backgroundAttachment: 'fixed',
      }}
    >

      {/* Background gradient accent elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <motion.div
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Next-generation ticketing</span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          variants={itemVariants}
          className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight"
        >
          <span className="text-white">Ticketing</span>
          <br />
          <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-red-500 bg-clip-text text-transparent">
            Without the Drama
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p 
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          Experience Ticketa: The only platform with rotating QR security, instant Mobile Money payouts, and zero-scalping technology.
        </motion.p>

        {/* Features bullets */}
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-6 justify-center mb-12 text-sm">
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            Rotating QR Security
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            Instant Settlements
          </div>
          <div className="flex items-center gap-2 text-gray-400">
            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
            Ethical Resale
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-red-500 text-white font-bold text-lg hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2 group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Start Selling Tickets
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          
          <motion.button
            className="px-8 py-4 rounded-xl border border-purple-500/40 hover:border-purple-500/80 hover:bg-purple-500/10 text-white font-bold text-lg transition-all duration-300 backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Watch Demo
          </motion.button>
        </motion.div>

        {/* Trust badges */}
        <motion.div variants={itemVariants} className="mt-16 pt-12 border-t border-gray-700/50">
          <p className="text-gray-400 text-sm mb-6">Trusted by leading event organizers</p>
          <div className="flex flex-wrap gap-8 justify-center items-center">
            {['Festival Pro', 'Event Hub', 'Venue Max', 'Crowd Control'].map((brand) => (
              <div key={brand} className="px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 text-gray-400 text-xs font-semibold">
                {brand}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
