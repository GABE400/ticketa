import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { Calendar, MapPin, Shield, Ticket, Users, Share2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TicketPurchaseForm from "@/components/events/ticket-purchase-form";

interface EventPageProps {
  params: Promise<{ id: string }>;
}

export default async function EventPage({ params }: EventPageProps) {
  const { id } = await params;
  
  const event = await db.query.events.findFirst({
    where: (events, { eq }) => eq(events.id, id),
    with: {
      organizer: true,
      ticketTypes: true,
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Header */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        {event.imageUrl ? (
          <img 
            src={event.imageUrl} 
            alt={event.title} 
            className="w-full h-full object-cover blur-[2px] opacity-40 scale-110"
          />
        ) : (
          <div className="w-full h-full bg-slate-900"></div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
            <div className="flex flex-col md:flex-row gap-8 items-end justify-between">
              <div className="space-y-4 max-w-2xl">
                <span className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-xs font-bold text-purple-400 uppercase tracking-widest">
                  {event.category}
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
                  {event.title}
                </h1>
                <div className="flex flex-wrap gap-6 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span>{format(event.startTime, 'EEEE, MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex items-center gap-4 hidden md:flex">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-800">
                  {event.organizer.image && <img src={event.organizer.image} alt={event.organizer.name} />}
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-bold">Organized by</p>
                  <p className="text-lg font-bold text-white">{event.organizer.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-12">
            <section className="space-y-4">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Info className="w-6 h-6 text-purple-400" />
                About this event
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed whitespace-pre-wrap">
                {event.description || "No description provided for this event."}
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Shield className="w-6 h-6 text-purple-400" />
                Secure & Trusted Ticketing
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 space-y-2">
                  <h3 className="font-bold text-white">Rotating QR Codes</h3>
                  <p className="text-sm text-gray-500">Your ticket QR code updates every few minutes to prevent screenshot fraud.</p>
                </div>
                <div className="p-6 rounded-2xl bg-slate-900/50 border border-white/10 space-y-2">
                  <h3 className="font-bold text-white">Instant Delivery</h3>
                  <p className="text-sm text-gray-500">Get your digital tickets via SMS and Email instantly after payment.</p>
                </div>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <TicketPurchaseForm ticketTypes={event.ticketTypes.map(tt => ({
                id: tt.id,
                name: tt.name,
                price: tt.price,
                capacity: tt.capacity,
                sold: tt.sold
              }))} />

              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 border-white/10 text-white font-bold h-11">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
