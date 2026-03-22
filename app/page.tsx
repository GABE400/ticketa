'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Heart, TrendingUp, ChevronRight, QrCode } from 'lucide-react';
import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import LiveTicket from '@/components/live-ticket';
import FeatureGrid from '@/components/feature-grid';
import OrganizerDashboard from '@/components/organizer-dashboard';
import Footer from '@/components/footer';

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-black text-white">
      <Navbar />
      <HeroSection />
      <LiveTicket />
      <FeatureGrid />
      <OrganizerDashboard />
      <Footer />
    </main>
  );
}
