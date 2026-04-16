import { requireOrganizer } from "@/lib/session";
import { db } from "@/lib/db";
import { events, tickets, ticketTypes } from "@/lib/db/schema";
import { eq, count, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import QRScanner from "@/components/events/qr-scanner";
import Link from "next/link";
import { ChevronLeft, Shield, Users, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface ScanPageProps {
  params: Promise<{ id: string }>;
}

export default async function ScanPage({ params }: ScanPageProps) {
  const { id } = await params;
  const session = await requireOrganizer();

  const event = await db.query.events.findFirst({
    where: and(eq(events.id, id), eq(events.organizerId, session.user.id)),
    with: {
        ticketTypes: true
    }
  });

  if (!event) {
    notFound();
  }

  // Calculate stats
  const totalSold = event.ticketTypes.reduce((acc, tt) => acc + tt.sold, 0);
  
  // Actually we need to count tickets with status = 'used'
  const checkInCount = await db
    .select({ count: count() })
    .from(tickets)
    .innerJoin(ticketTypes, eq(tickets.ticketTypeId, ticketTypes.id))
    .where(and(
      eq(ticketTypes.eventId, id),
      eq(tickets.status, "used")
    ))
    .then(res => res[0].count);

  // Note: The count query above is a bit simplified. In a real scenario we'd join correctly.
  // For now, let's just get the count for tickets belonging to this event's ticket types.

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{event.title}</h1>
            <p className="text-gray-500 text-sm font-bold uppercase tracking-wider">Entrance Control</p>
          </div>
        </div>

        {/* Real-time Stats */}
        <div className="grid grid-cols-2 gap-4">
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
                <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <Users className="w-3 h-3 text-purple-400" />
                        Checked In
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <div className="text-2xl font-black">{checkInCount} <span className="text-sm font-normal text-gray-500">/ {totalSold}</span></div>
                </CardContent>
            </Card>
            <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
                <CardHeader className="p-4 pb-0">
                    <CardTitle className="text-xs font-medium text-gray-500 uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle2 className="w-3 h-3 text-green-400" />
                        Capacity
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <div className="text-2xl font-black">{Math.round((checkInCount / (totalSold || 1)) * 100)}%</div>
                </CardContent>
            </Card>
        </div>

        {/* Scanner Section */}
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Live Scanner
                </h2>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] uppercase font-black tracking-widest text-green-500">System Ready</span>
                </div>
            </div>
            
            <QRScanner eventId={id} />
            
            <p className="text-center text-xs text-gray-500 px-8 leading-relaxed">
                Hold the guest's QR code within the frame. Scans are validated in real-time against the secure blockchain-inspired rotating key.
            </p>
        </div>
      </div>
    </div>
  );
}
