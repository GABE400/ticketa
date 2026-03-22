'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Heart, Lock, Wifi, BarChart3 } from 'lucide-react';
import Image from 'next/image';

export default function FeatureGrid() {
  const features = [
    {
      title: 'Rotating Token System',
      description: 'Military-grade security with tokens that rotate every 3 seconds. Impossible to counterfeit or duplicate.',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      gridSpan: 'col-span-1 row-span-2',
      image: '/images/mobile-ticket.jpg',
    },
    {
      title: 'Instant Settlements',
      description: 'Airtel & MTN Money payouts in minutes, not weeks. Real-time reconciliation and transparent fee structure.',
      icon: Zap,
      color: 'from-red-500 to-red-600',
      gridSpan: 'col-span-1 row-span-1',
    },
    {
      title: 'Ethical Resale',
      description: 'Price-capped secondary marketplace ensures fans get fair deals while organizers maintain control.',
      icon: Heart,
      color: 'from-purple-500 to-pink-500',
      gridSpan: 'col-span-1 row-span-1',
      image: '/images/event-friends.jpg',
    },
    {
      title: 'Zero-Scalping Tech',
      description: 'Advanced algorithms detect and prevent scalper bots, protecting your event from fraudulent bulk purchases.',
      icon: Lock,
      color: 'from-cyan-500 to-blue-500',
      gridSpan: 'col-span-1 row-span-1',
    },
    {
      title: 'Real-Time Analytics',
      description: 'Live dashboard tracking sales velocity, demographics, and sellout predictions to optimize pricing.',
      icon: BarChart3,
      color: 'from-amber-500 to-orange-500',
      gridSpan: 'col-span-1 row-span-1',
      image: '/images/festival-scene.jpg',
    },
    {
      title: '24/7 Web-Based Support',
      description: 'Offline-capable web terminal for gate staff. Support in 12+ languages across East Africa.',
      icon: Wifi,
      color: 'from-green-500 to-emerald-500',
      gridSpan: 'col-span-1 row-span-1',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8 },
    },
  };

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-4">
            <span className="text-sm text-purple-300">Powerful Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to <span className="text-transparent bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text">scale events</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Built for African event organizers who refuse to compromise on security, speed, or customer experience.
          </p>
        </motion.div>

        {/* Feature Grid - Bento Style */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className={`${feature.gridSpan} group relative overflow-hidden rounded-2xl border border-purple-500/20 bg-gradient-to-br from-slate-900/50 to-slate-950/50 p-8 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-300 cursor-pointer`}
              >
                {/* Background image if available */}
                {feature.image && (
                  <>
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover opacity-20 group-hover:opacity-35 transition-opacity duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-slate-950/50 group-hover:from-slate-950/90 transition-colors duration-300"></div>
                  </>
                )}

                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col h-full">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                    {feature.title}
                  </h3>

                  <p className="text-gray-400 text-sm leading-relaxed flex-grow">
                    {feature.description}
                  </p>

                  {/* Hover indicator */}
                  <div className="flex items-center gap-2 text-purple-400 text-sm font-semibold mt-auto pt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>Learn more</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute -inset-20 bg-gradient-to-r from-purple-500 to-red-500 opacity-0 group-hover:opacity-20 blur-3xl -z-10 transition-opacity duration-300"></div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <button className="px-8 py-4 rounded-xl bg-gradient-to-r from-purple-500 to-red-500 text-white font-bold hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300">
            Explore All Features
          </button>
        </motion.div>
      </div>
    </section>
  );
}
