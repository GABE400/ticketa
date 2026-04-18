import Navbar from '@/components/navbar';
import HeroSection from '@/components/hero-section';
import LiveTicket from '@/components/live-ticket';
import FeatureGrid from '@/components/feature-grid';
import EventList from '@/components/events/event-list';
import Footer from '@/components/footer';
import { getSiteSettings } from '@/lib/actions/settings';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <HeroSection demoVideoUrl={settings?.demoVideoUrl} />
      {/* @ts-expect-error Async Server Component */}
      <EventList />
      <LiveTicket />
      <FeatureGrid />
      <Footer />
    </main>
  );
}
