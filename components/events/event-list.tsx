import { getEvents } from "@/lib/actions/events";
import EventCard from "./event-card";
import { motion } from "framer-motion";

export default async function EventList() {
    const events = await getEvents();

    if (events.length === 0) {
        return null;
    }

    return (
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-black">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            <span className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Live Now</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                            Featured <span className="text-transparent bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text">Events</span>
                        </h2>
                    </div>
                    <p className="text-gray-400 max-w-md text-right hidden md:block">
                        Discover the most anticipated events across Africa. Secure your spot with rotating QR technology.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => {
                        // Find the minimum price among ticket types
                        const minPrice = event.ticketTypes.length > 0
                            ? Math.min(...event.ticketTypes.map(tt => parseFloat(tt.price))).toString()
                            : "0";

                        return (
                            <EventCard
                                key={event.id}
                                id={event.id}
                                title={event.title}
                                location={event.location}
                                startTime={event.startTime}
                                imageUrl={event.imageUrl}
                                category={event.category}
                                minPrice={minPrice}
                            />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
