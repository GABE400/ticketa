
import { getEvents } from "@/lib/actions/events";
import { format } from "date-fns";
import { 
    Calendar, 
    MapPin, 
    ShieldCheck, 
    ExternalLink,
    Search,
    Filter,
    MoreHorizontal
} from "lucide-react";
import Link from "next/link";

export default async function AdminEventsPage() {
    const events = await getEvents();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">Event Marketplace</h1>
                    <p className="text-gray-500 font-medium">Global oversight of all published listings and ticket inventory</p>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                    <Link 
                        href="/events/create" 
                        className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20 text-sm"
                    >
                        Create Main Event
                    </Link>
                </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest font-black text-gray-400">
                                <th className="px-6 py-4">Event Details</th>
                                <th className="px-6 py-4">Organizer</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Sold / Capacity</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {events.map((event) => {
                                const totalSold = event.ticketTypes.reduce((acc, tt) => acc + (tt.sold || 0), 0);
                                const totalCapacity = event.ticketTypes.reduce((acc, tt) => acc + tt.capacity, 0);
                                const percentage = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;

                                return (
                                    <tr key={event.id} className="hover:bg-white/5 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-10 rounded-lg bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                                                    {event.imageUrl && (
                                                        <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                                    )}
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <span className="text-sm font-bold text-white truncate max-w-[200px]">{event.title}</span>
                                                    <div className="flex items-center gap-1 text-[10px] text-gray-500 mt-0.5">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate">{event.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white">{event.organizer.name}</span>
                                                <span className="text-[10px] text-gray-500 font-mono">#{event.organizerId.slice(0, 8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gray-400 uppercase tracking-tighter">
                                                {event.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1 w-full max-w-[120px]">
                                                <div className="flex justify-between text-[10px] font-bold">
                                                    <span className="text-white">{totalSold} / {totalCapacity}</span>
                                                    <span className={percentage > 80 ? 'text-red-400' : 'text-green-400'}>{Math.round(percentage)}%</span>
                                                </div>
                                                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                                    <div 
                                                        className={`h-full transition-all duration-1000 ${percentage > 80 ? 'bg-red-500' : 'bg-green-500'}`}
                                                        style={{ width: `${Math.min(100, percentage)}%` }}
                                                    />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-green-400 uppercase tracking-tighter">
                                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                                Live
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    href={`/events/${event.id}`} 
                                                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-colors"
                                                >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                </Link>
                                                <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-colors">
                                                    <MoreHorizontal className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
