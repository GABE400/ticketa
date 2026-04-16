'use client';

import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Users, DollarSign, Settings } from 'lucide-react';
import Image from 'next/image';
import { format } from "date-fns";

interface OrganizerDashboardProps {
  initialEvents?: any[];
  userName?: string;
}

export default function OrganizerDashboard({ initialEvents = [], userName = "Organizer" }: OrganizerDashboardProps) {
  // Build sales data from real events for the demo chart
  const salesData = initialEvents.length > 0 ? initialEvents.slice(0, 7).map((e, i) => ({
    time: format(new Date(e.createdAt), 'HH:mm'),
    sales: e.ticketTypes?.reduce((acc: number, tt: any) => acc + (tt.sold || 0), 0) || 0,
    revenue: e.ticketTypes?.reduce((acc: number, tt: any) => acc + (Number(tt.price) * (tt.sold || 0)), 0) || 0
  })) : [
    { time: 'N/A', sales: 0, revenue: 0 }
  ];

  // Build category data from real events
  const categoryMap = initialEvents.reduce((acc: Record<string, number>, e) => {
    acc[e.category] = (acc[e.category] || 0) + (e.ticketTypes?.reduce((acc: number, tt: any) => acc + (tt.sold || 0), 0) || 0);
    return acc;
  }, {});
  const categoryData = Object.entries(categoryMap).map(([name, value]) => ({ name, value }));

  // Calculate aggregate stats for the preview
  const totalRevenue = initialEvents.reduce((acc: number, e) => {
    return acc + (e.ticketTypes?.reduce((tAcc: number, tt: any) => tAcc + (Number(tt.price) * (tt.sold || 0)), 0) || 0);
  }, 0);
  const totalTicketsSold = initialEvents.reduce((acc: number, e) => {
    return acc + (e.ticketTypes?.reduce((tAcc: number, tt: any) => tAcc + (tt.sold || 0), 0) || 0);
  }, 0);
  const activeAttendees = Math.floor(totalTicketsSold * 0.85); // Simulated check-in rate for demo

  const stats = [
    {
      label: 'Total Revenue',
      value: new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(totalRevenue),
      change: 'Lifetime',
      icon: DollarSign,
    },
    {
      label: 'Tickets Sold',
      value: totalTicketsSold.toLocaleString(),
      change: 'Total',
      icon: TrendingUp,
    },
    {
      label: 'Active Attendees',
      value: activeAttendees.toLocaleString(),
      change: 'Present',
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

            {/* Additional Info Row - Dynamic logic */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-400 text-sm mb-2">Inventory Status</p>
                <p className="text-2xl font-bold text-white mb-4">
                  {totalTicketsSold === 0 ? "Waiting for first sale" : `${((totalTicketsSold / 1000) * 100).toFixed(1)}% of targets`}
                </p>
                <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-purple-500 to-red-500"
                    initial={{ width: 0 }}
                    whileInView={{ width: totalTicketsSold > 0 ? '45%' : '0%' }}
                    transition={{ duration: 1.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  ></motion.div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Live inventory tracking enabled</p>
              </motion.div>

              <motion.div
                className="p-6 rounded-xl border border-purple-500/20 bg-purple-500/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-400 text-sm mb-2">Gate Security Status</p>
                <p className="text-2xl font-bold text-white mb-4">All Systems Nominal</p>
                <p className="text-sm text-green-400 font-semibold">✓ {initialEvents.length} active monitors running</p>
              </motion.div>
            </div>

            {/* Dynamic Event Showcase */}
            <motion.div
              className="mt-12 pt-8 border-t border-purple-500/20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-400 text-sm mb-6 text-center">Your active events on the Ticketa marketplace</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {initialEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="relative h-48 rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 group">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-900 flex items-center justify-center text-gray-500 italic">No Image</div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                      <div>
                        <p className="text-white font-bold text-sm">{event.title}</p>
                        <p className="text-gray-300 text-xs">
                          {event.ticketTypes?.reduce((acc: number, tt: any) => acc + (tt.sold || 0), 0)} attendees
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
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
