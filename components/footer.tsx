'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: ['Features', 'Security', 'Pricing', 'Enterprise'],
    Company: ['About Us', 'Blog', 'Careers', 'Contact'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'],
    Resources: ['Documentation', 'API Reference', 'Status Page', 'Support'],
  };

  return (
    <footer className="relative border-t border-purple-500/20 bg-gradient-to-b from-black to-slate-950">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <motion.div
              className="flex items-center gap-3 mb-6 group cursor-default"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative h-12 w-12 flex items-center justify-center p-1.5 rounded-xl bg-gradient-to-br from-purple-500/20 to-red-500/20 shadow-lg shadow-purple-500/5 group-hover:from-purple-500/30 transition-all duration-300">
                <Image
                  src="/images/ticketa-logo.png"
                  alt="Ticketa Logo"
                  fill
                  className="object-contain p-1"
                />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">Ticketa</span>
            </motion.div>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Revolutionizing event ticketing across Africa with security, speed, and fairness.
            </p>
            <div className="flex gap-4">
              {[Twitter, Linkedin, Instagram].map((Icon, index) => (
                <motion.a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-gray-400 hover:text-purple-400 hover:border-purple-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links], colIndex) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: (colIndex + 1) * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
                {title}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          className="mb-12 p-8 rounded-2xl border border-purple-500/30 bg-gradient-to-r from-purple-500/10 to-red-500/10 backdrop-blur-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to transform your events?</h3>
              <p className="text-gray-400">Join thousands of organizers already using Ticketa.</p>
            </div>
            <motion.button
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-red-500 text-white font-bold whitespace-nowrap hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now
            </motion.button>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-gray-400"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p>
            &copy; {currentYear} Ticketa. All rights reserved. Built for African event creators.
          </p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">
              Status
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Security
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
