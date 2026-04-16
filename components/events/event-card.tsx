import { Calendar, MapPin, Ticket } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EventCardProps {
  id: string;
  title: string;
  location: string;
  startTime: Date;
  imageUrl?: string | null;
  category: string;
  minPrice: string;
}

export default function EventCard({ id, title, location, startTime, imageUrl, category, minPrice }: EventCardProps) {
  return (
    <Card className="group overflow-hidden border-white/10 bg-slate-900/50 backdrop-blur-xl hover:border-purple-500/50 transition-all duration-500">
      <Link href={`/events/${id}`} className="block relative h-56 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <Ticket className="w-12 h-12 text-slate-700" />
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold text-purple-400 uppercase tracking-widest">
            {category}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
      </Link>
      
      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold mb-2">
          <Calendar className="w-3.5 h-3.5" />
          {format(startTime, 'EEE, MMM d • h:mm a')}
        </div>
        <h3 className="text-xl font-bold text-white line-clamp-1 group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mt-2 flex items-center gap-1.5 line-clamp-1">
          <MapPin className="w-3.5 h-3.5 text-gray-500" />
          {location}
        </p>
      </CardContent>
      
      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">Tickets from</span>
          <span className="text-lg font-black text-white">${parseFloat(minPrice).toLocaleString()}</span>
        </div>
        <Link href={`/events/${id}`}>
          <Button size="sm" className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 font-bold px-6 border-0 shadow-lg shadow-purple-500/20">
            Get Tickets
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
