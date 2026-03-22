'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { QrCode, TicketCheck, MapPin, Calendar, Clock } from 'lucide-react';

export default function LiveTicket() {
  const [qrRotation, setQrRotation] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setQrRotation((prev) => (prev + 6) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
            <TicketCheck className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Live Ticket Experience</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Dynamic Security, Real-Time <span className="text-transparent bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text">Protection</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Ticket Visual */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Animated background glow */}
            <div className="absolute inset-0 rounded-2xl blur-3xl bg-gradient-to-br from-purple-500/20 to-red-500/20 animate-pulse"></div>

            {/* Ticket Card */}
            <motion.div
              className="relative bg-gradient-to-br from-slate-900 to-slate-950 rounded-2xl border border-purple-500/30 p-8 backdrop-blur-xl"
              whileHover={{ borderColor: 'rgba(139, 92, 246, 0.8)' }}
              transition={{ duration: 0.3 }}
            >
              {/* Live Badge */}
              <motion.div
                className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/50"
                animate={{ boxShadow: ['0 0 20px rgba(239, 68, 68, 0.5)', '0 0 40px rgba(239, 68, 68, 0.8)', '0 0 20px rgba(239, 68, 68, 0.5)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span className="text-xs font-bold text-red-400">LIVE</span>
              </motion.div>

              {/* Event Info */}
              <div className="mb-8">
                <div className="inline-block px-3 py-1 rounded-lg bg-purple-500/20 border border-purple-500/30 text-xs text-purple-300 font-semibold mb-4">
                  EVENT TICKET
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Summer Music Festival</h3>
                
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-purple-400" />
                    <span>Lusaka International Arena</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>June 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span>Doors open at 18:00</span>
                  </div>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="flex flex-col items-center gap-4 py-8 border-y border-purple-500/20">
                {/* Rotating QR Code */}
                <motion.div
                  className="p-4 rounded-xl bg-white/10 border-2 border-purple-500/50"
                  style={{ rotate: qrRotation }}
                >
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                    <QrCode className="w-24 h-24 text-white/80" />
                  </div>
                </motion.div>
                <p className="text-xs text-gray-400 text-center">
                  Security token refreshes every <span className="text-purple-400 font-semibold">3 seconds</span>
                </p>
              </div>

              {/* Ticket Details */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-gray-400 mb-1">Ticket Type</p>
                  <p className="text-sm font-bold text-white">VIP Access</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                  <p className="text-xs text-gray-400 mb-1">Seat ID</p>
                  <p className="text-sm font-bold text-white">A1-2847</p>
                </div>
              </div>

              {/* Verification checkmark */}
              <motion.div
                className="absolute -bottom-6 -right-6 w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center border-4 border-black shadow-xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-2xl">✓</span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right: Features List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2">Rotating QR Codes</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Every ticket displays a dynamically rotating QR code that changes every 3 seconds, making counterfeiting virtually impossible.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2">Real-Time Verification</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Gate staff instantly verify authenticity using our secure web scanner, preventing duplicate entry and scalping.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-red-500/20 bg-red-500/5 hover:border-red-500/40 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2">Instant Mobile Money Payouts</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Settle directly to Airtel Money or MTN Money within minutes of ticket sales, with zero hidden fees.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/5 hover:border-purple-500/40 transition-colors">
              <h3 className="text-lg font-bold text-white mb-2">Ethical Resale Marketplace</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Enable fair ticket resales with price caps, protecting fans while giving organizers resale control.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
