import { requireAuth } from "@/lib/session";
import { getUserTickets } from "@/lib/actions/tickets";
import { Ticket, Calendar, MapPin, Shield, Info, ArrowUpRight, Clock, User } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import TicketQR from "@/components/tickets/ticket-qr";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { cn } from "@/lib/utils";
import ClientTicketActions from "@/components/tickets/client-ticket-actions";

export default async function TicketsPage() {
    const session = await requireAuth();
    const tickets = await getUserTickets();

    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
            <Navbar />
            
            {/* Background Aesthetic */}
            <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[0%] right-[-5%] w-[35%] h-[35%] bg-red-600/10 rounded-full blur-[120px]" style={{ animationDelay: '2s' }}></div>
            </div>

            <main className="max-w-5xl mx-auto px-4 pt-32 pb-20 space-y-16">
                {/* Header Section */}
                <div className="relative">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-4 text-[10px] font-bold uppercase tracking-widest text-purple-400">
                        <Shield className="w-3 h-3" />
                        Authenticated Inventory
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
                        Your <span className="bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text text-transparent">Passes</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-xl">
                        Your secure digital vault for all upcoming experiences. Each pass is uniquely encrypted and features rotating security.
                    </p>
                </div>

                {tickets.length === 0 ? (
                    <div className="relative group overflow-hidden rounded-[3rem] border border-white/5 bg-white/[0.02] p-20 text-center space-y-8 backdrop-blur-sm">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative z-10">
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/20 to-red-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 group-hover:rotate-0 transition-transform duration-500">
                                <Ticket className="w-12 h-12 text-purple-400" />
                            </div>
                            <h2 className="text-3xl font-black">Empty Vault</h2>
                            <p className="text-gray-500 max-w-sm mx-auto text-lg leading-relaxed">
                                Ready for your next adventure? Explore the marketplace and claim your spot at the hottest events.
                            </p>
                            <Link href="/" className="inline-block mt-8">
                                <button className="px-10 py-4 rounded-2xl bg-white text-black font-black hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5">
                                    Browse Marketplace
                                </button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-16">
                        {tickets.map((t) => (
                            <div key={t.id} className="relative group perspective-1000">
                                {/* Ambient Glow */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-red-600/20 rounded-[3rem] blur-2xl opacity-0 group-hover:opacity-100 transition duration-700"></div>
                                
                                <div className="relative bg-slate-900/40 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col lg:flex-row min-h-[400px]">
                                    {/* Left Stub: Image & Title */}
                                    <div className="lg:w-72 h-48 lg:h-auto relative">
                                        {t.ticketType.event.imageUrl ? (
                                            <img 
                                                src={t.ticketType.event.imageUrl} 
                                                alt={t.ticketType.event.title} 
                                                className="w-full h-full object-cover brightness-75 grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                                                <Calendar className="w-12 h-12 text-white/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-slate-950/80"></div>
                                        <div className="absolute bottom-6 left-6 lg:hidden">
                                            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{t.ticketType.event.title}</h3>
                                        </div>
                                    </div>

                                    {/* Middle Section: Event Details */}
                                    <div className="flex-1 p-8 md:p-12 relative border-r border-dashed border-white/10">
                                        {/* Ticket Cut-outs */}
                                        <div className="absolute -top-4 -right-4 w-8 h-8 bg-black rounded-full shadow-inner hidden lg:block"></div>
                                        <div className="absolute -bottom-4 -right-4 w-8 h-8 bg-black rounded-full shadow-inner hidden lg:block"></div>

                                        <div className="space-y-10">
                                            <div className="hidden lg:block">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <div className="h-[1px] w-8 bg-purple-500"></div>
                                                    <span className="text-[10px] uppercase font-black tracking-[0.3em] text-purple-400 italic">Official Pass</span>
                                                </div>
                                                <h2 className="text-4xl font-black text-white leading-none tracking-tighter uppercase italic">
                                                    {t.ticketType.event.title}
                                                </h2>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-1.5 text-gray-500">
                                                        <Calendar className="w-3 h-3" />
                                                        <span className="text-[10px] uppercase font-bold tracking-widest">Date</span>
                                                    </div>
                                                    <p className="text-sm font-black text-white uppercase italic tracking-tight">{format(t.ticketType.event.startTime, 'MMM d, yyyy')}</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-1.5 text-gray-500">
                                                        <Clock className="w-3 h-3" />
                                                        <span className="text-[10px] uppercase font-bold tracking-widest">Starts</span>
                                                    </div>
                                                    <p className="text-sm font-black text-white uppercase italic tracking-tight">{format(t.ticketType.event.startTime, 'h:mm a')}</p>
                                                </div>
                                                <div className="space-y-2 col-span-2 md:col-span-1">
                                                    <div className="flex items-center gap-1.5 text-gray-500">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="text-[10px] uppercase font-bold tracking-widest">Venue</span>
                                                    </div>
                                                    <p className="text-sm font-black text-white uppercase italic tracking-tight truncate">{t.ticketType.event.location}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-8 border-t border-white/5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-red-500/20 border border-white/10 flex items-center justify-center">
                                                        <User className="w-5 h-5 text-white/80" />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none">Holder Name</p>
                                                        <p className="text-sm font-black text-white uppercase tracking-tighter">{session.user.name}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] text-gray-500 uppercase font-black tracking-widest leading-none">Tier</p>
                                                    <p className="text-sm font-black text-purple-400 uppercase italic tracking-widest">{t.ticketType.name}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Stub: QR Code & Security */}
                                    <div className="lg:w-80 bg-white/[0.03] p-10 flex flex-col items-center justify-center text-center space-y-8">
                                        <div className="relative p-3 bg-white rounded-2xl shadow-[0_0_50px_rgba(255,255,255,0.1)] group-hover:scale-105 transition-transform duration-500">
                                            <TicketQR data={t.qrData} size={200} />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-center gap-2 text-green-400">
                                                <Shield className="w-4 h-4 fill-green-400/20" />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Encrypted</span>
                                            </div>
                                            <p className="text-[10px] font-mono text-gray-500 uppercase">
                                                ID: {t.id.slice(0, 16).toUpperCase()}
                                            </p>
                                        </div>

                                        <ClientTicketActions ticket={t as any} userName={session.user.name} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
