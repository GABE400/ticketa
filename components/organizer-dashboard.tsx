'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, DollarSign, Settings } from 'lucide-react';
import Image from 'next/image';

export default function OrganizerDashboard() {
  // Sample data for charts
  const salesData = [
    { time: '10am', sales: 120, revenue: 2400 },
    { time: '11am', sales: 240, revenue: 4800 },
    { time: '12pm', sales: 180, revenue: 3600 },
    { time: '1pm', sales: 390, revenue: 7800 },
    { time: '2pm', sales: 540, revenue: 10800 },
    { time: '3pm', sales: 620, revenue: 12400 },
    { time: '4pm', sales: 780, revenue: 15600 },
  ];

  const categoryData = [
    { name: 'VIP', value: 450 },
    { name: 'Standard', value: 720 },
    { name: 'Economy', value: 330 },
  ];

  const stats = [
    {
      label: 'Total Revenue',
      value: '$47,200',
      change: '+12.5%',
      icon: DollarSign,
    },
    {
      label: 'Tickets Sold',
      value: '1,500',
      change: '+8.2%',
      icon: TrendingUp,
    },
    {
      label: 'Active Attendees',
      value: '892',
      change: '+3.1%',
      icon: Users,
    },
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
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
            <Settings className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">Organizer View</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Real-Time Event <span className="text-transparent bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text">Intelligence</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Monitor every aspect of your event from a single dashboard. Make data-driven decisions in real-time.
          </p>
        </motion.div>

        {/* Dashboard Container */}
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Glow effects */}
          <div className="absolute -inset-20 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-red-500/10 blur-3xl -z-10 rounded-3xl"></div>

          {/* Main Dashboard */}
          <div className="rounded-2xl sm:rounded-3xl border border-red-500/30 bg-gradient-to-br from-slate-900/80 to-slate-950/80 backdrop-blur-xl p-4 sm:p-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={index}
                    className="p-4 sm:p-6 rounded-xl border border-red-500/20 bg-red-500/5 hover:border-red-500/40 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-gray-400 text-xs sm:text-sm mb-2">{stat.label}</p>
                        <p className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
                      </div>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-green-400 font-semibold">{stat.change} from last event</p>
                  </motion.div>
                );
              })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Sales Velocity Chart */}
              <motion.div
                className="p-6 rounded-xl border border-red-500/20 bg-red-500/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold text-white mb-4">Ticket Sales Velocity</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="time" stroke="#888888" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#888888" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 15, 15, 0.95)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                      }}
                      cursor={{ stroke: 'rgba(239, 68, 68, 0.5)' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#EF4444"
                      strokeWidth={3}
                      dot={false}
                      isAnimationActive
                      animationDuration={1000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </motion.div>

              {/* Category Breakdown */}
              <motion.div
                className="p-6 rounded-xl border border-red-500/20 bg-red-500/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-bold text-white mb-4">Ticket Category Mix</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
                    <XAxis dataKey="name" stroke="#888888" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#888888" style={{ fontSize: '12px' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'rgba(15, 15, 15, 0.95)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </motion.div>
            </div>

            {/* Additional Info Row */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-400 text-sm mb-2">Estimated Sellout</p>
                <p className="text-2xl font-bold text-white mb-4">In 2 hours 15 minutes</p>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-red-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: '85%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  ></motion.div>
                </div>
                <p className="text-xs text-gray-400 mt-2">85% of capacity</p>
              </motion.div>

              <motion.div
                className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-400 text-sm mb-2">Fraud Detection Status</p>
                <p className="text-2xl font-bold text-white mb-4">5 Suspicious Attempts Blocked</p>
                <p className="text-sm text-green-400 font-semibold">✓ Security optimal - no action needed</p>
              </motion.div>
            </div>

            {/* Social Proof - Event Images */}
            <motion.div
              className="mt-12 pt-8 border-t border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-400 text-sm mb-6 text-center">See Ticketa in action across Africa's biggest events</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative h-48 rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group">
                  <Image
                    src="/images/event-crowd.jpg"
                    alt="Live event with Ticketa"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <div>
                      <p className="text-white font-bold text-sm">Lagos Music Festival</p>
                      <p className="text-gray-300 text-xs">12,500 attendees</p>
                    </div>
                  </div>
                </div>
                <div className="relative h-48 rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group">
                  <Image
                    src="/images/event-friends.jpg"
                    alt="Happy event attendees"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <div>
                      <p className="text-white font-bold text-sm">Nairobi Comedy Night</p>
                      <p className="text-gray-300 text-xs">3,200 attendees</p>
                    </div>
                  </div>
                </div>
                <div className="relative h-48 rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group">
                  <Image
                    src="/images/festival-scene.jpg"
                    alt="Festival crowd"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                    <div>
                      <p className="text-white font-bold text-sm">Accra Art & Culture Fest</p>
                      <p className="text-gray-300 text-xs">8,900 attendees</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              className="mt-8 pt-8 border-t border-purple-500/20 flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
            >
              <button className="px-8 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold hover:shadow-lg hover:shadow-red-500/50 transition-all duration-300">
                Launch Demo Dashboard
              </button>
              <button className="px-8 py-3 rounded-xl border border-purple-500/40 hover:border-purple-500/80 hover:bg-purple-500/10 text-white font-bold transition-all duration-300 backdrop-blur-sm">
                View Documentation
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
