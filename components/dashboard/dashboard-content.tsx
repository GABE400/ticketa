'use client';

import { useState, useEffect } from "react";
import { Plus, Calendar, Users, DollarSign, TrendingUp, QrCode, MapPin, ChevronLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import CreateEventForm from "@/components/events/create-event-form";
import { format } from "date-fns";
import { deleteEvent } from "@/lib/actions/events";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
interface DashboardContentProps {
    initialEvents: any[];
    userName: string;
    totalRevenue: number;
    totalNetPayout: number;
    totalTicketsSold: number;
}

export default function DashboardContent({ 
  initialEvents, 
  userName,
  totalRevenue,
  totalNetPayout,
  totalTicketsSold
}: DashboardContentProps) {
    const [mounted, setMounted] = useState(false);
    const [isDeleting, setIsDeleting] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDelete = async (eventId: string) => {
        setIsDeleting(eventId);
        try {
            const result = await deleteEvent(eventId);
            if (result.success) {
                toast.success("Event deleted from marketplace");
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete event");
        } finally {
            setIsDeleting(null);
        }
    };

    // Stats are now provided directly from the server for parity with admin
    // removed client-side reduce logic

    // Initial server-side render or skeleton while mounting
    if (!mounted) {
        return (
            <div className="min-h-screen bg-black text-white p-4 sm:p-8 animate-pulse">
                <div className="max-w-7xl mx-auto space-y-8">
                    <div className="h-32 bg-slate-900/50 rounded-2xl border border-white/5" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => <div key={i} className="h-32 bg-slate-900/50 rounded-2xl border border-white/5" />)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white pt-28 pb-8 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <Link 
                            href="/" 
                            className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors mb-4 group"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        <h1 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h1>
                        <p className="text-gray-400">Welcome back, {userName}. Here's what's happening with your events.</p>
                    </div>
                    
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 font-bold shadow-lg shadow-purple-500/10">
                                <Plus className="w-4 h-4 mr-2" />
                                Create New Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-[1400px] w-[95vw] max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10 text-white p-0 md:p-6">
                            <DialogHeader>
                                <DialogTitle>Create New Event</DialogTitle>
                                <DialogDescription className="text-gray-400">
                                    Fill in the details to publish your event to the Ticketa marketplace.
                                </DialogDescription>
                            </DialogHeader>
                            <CreateEventForm />
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl group hover:border-green-500/30 transition-all duration-500">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-xs font-black uppercase tracking-widest text-gray-400">Estimated Payout</CardTitle>
                            <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
                                <DollarSign className="h-4 w-4 text-green-400" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-black text-white tracking-tighter">
                                {new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(totalNetPayout)}
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Gross: {new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(totalRevenue)}</span>
                                <div className="h-1 w-1 rounded-full bg-gray-800" />
                                <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">Markup Applied</span>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Tickets Sold</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold italic">{totalTicketsSold.toLocaleString()}</div>
                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold font-mono">Total Verified Sales</p>
                        </CardContent>
                    </Card>
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">Active Events</CardTitle>
                            <Calendar className="h-4 w-4 text-red-400" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold italic">{initialEvents.length}</div>
                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-widest font-bold font-mono">Published Listings</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Events List */}
                <div className="space-y-4">
                    <h2 className="text-xl font-bold">Your Events</h2>
                    <div className="grid grid-cols-1 gap-4">
                        {initialEvents.length === 0 ? (
                            <div className="border border-dashed border-white/10 rounded-2xl p-12 text-center">
                                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-white text-gray-400">No events yet</h3>
                                <p className="text-gray-500 mb-6">Start by creating your first event to reach thousands of buyers.</p>
                                <Button variant="outline" className="border-white/10 text-white">Learn how it works</Button>
                            </div>
                        ) : (
                            initialEvents.map((event) => (
                                <Card key={event.id} className="bg-slate-900/50 border-white/10 backdrop-blur-xl hover:border-white/20 transition-all group overflow-hidden">
                                    <div className="flex flex-col md:flex-row">
                                        {event.imageUrl && (
                                            <div className="relative w-full md:w-48 h-32">
                                                <img 
                                                    src={event.imageUrl} 
                                                    alt={event.title} 
                                                    className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                                                />
                                            </div>
                                        )}
                                        <CardContent className="flex-1 p-6">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <span className="px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                                                            {event.category}
                                                        </span>
                                                        <span className="text-xs text-gray-500">
                                                            Created {format(new Date(event.createdAt), 'MMM d, yyyy')}
                                                        </span>
                                                    </div>
                                                    <h3 className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors">{event.title}</h3>
                                                    <p className="text-gray-400 text-sm mt-1 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" /> {event.location}
                                                    </p>
                                                </div>
                                                
                                                 <div className="flex flex-row md:flex-col justify-between md:items-end gap-2 text-right">
                                                     <div>
                                                         <p className="text-xs text-gray-500">Total Sold</p>
                                                         <p className="text-lg font-bold text-white">
                                                             {event.ticketTypes.reduce((acc: number, tt: any) => acc + (tt.sold || 0), 0)} / {event.ticketTypes.reduce((acc: number, tt: any) => acc + tt.capacity, 0)}
                                                         </p>
                                                     </div>
                                                     <div className="flex flex-wrap gap-2 justify-end">
                                                         <Dialog>
                                                             <DialogTrigger asChild>
                                                                 <Button size="sm" variant="outline" className="border-white/10 text-white h-8 hover:bg-white/5">Edit</Button>
                                                             </DialogTrigger>
                                                             <DialogContent className="max-w-[1400px] w-[95vw] max-h-[90vh] overflow-y-auto bg-slate-900 border-white/10 text-white p-0 md:p-6">
                                                                 <DialogHeader className="px-6 pt-6">
                                                                     <DialogTitle>Update Event Studio</DialogTitle>
                                                                     <DialogDescription className="text-gray-400">
                                                                         Modify your event identity, logistics, or ticket inventory.
                                                                     </DialogDescription>
                                                                 </DialogHeader>
                                                                 <CreateEventForm 
                                                                     eventId={event.id} 
                                                                     initialData={event} 
                                                                     onSuccess={() => {
                                                                         // Standard way to close dialog without refs
                                                                         const closeBtn = document.querySelector('[data-state="open"] button[aria-label="Close"]');
                                                                         (closeBtn as any)?.click();
                                                                     }} 
                                                                 />
                                                             </DialogContent>
                                                         </Dialog>

                                                         <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-500 text-white border-0 h-8 font-bold">
                                                           <Link href={`/dashboard/events/${event.id}/scan`}>
                                                               <QrCode className="w-3.5 h-3.5 mr-1.5" /> 
                                                               Scan
                                                           </Link>
                                                         </Button>
                                                         <Button asChild size="sm" className="bg-white/10 hover:bg-white/20 text-white border-0 h-8">
                                                           <Link href={`/events/${event.id}`}>
                                                             View Page
                                                           </Link>
                                                         </Button>
                                                         
                                                         <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                              <Button 
                                                                 size="sm" 
                                                                 variant="destructive" 
                                                                 className="h-8 w-8 p-0 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-500"
                                                                 disabled={isDeleting === event.id}
                                                              >
                                                                  {isDeleting === event.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                                              </Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent className="bg-slate-900 border-white/10 text-white max-w-md">
                                                               <AlertDialogHeader>
                                                                  <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mb-4">
                                                                     <AlertTriangle className="w-6 h-6 text-red-500" />
                                                                  </div>
                                                                  <AlertDialogTitle className="text-xl font-black tracking-tight">Final Confirmation</AlertDialogTitle>
                                                                  <AlertDialogDescription className="text-gray-400 leading-relaxed">
                                                                     Are you sure you want to delete <span className="text-white font-bold">"{event.title}"</span>? This will permanently remove all associated ticket tiers and cannot be undone.
                                                                  </AlertDialogDescription>
                                                               </AlertDialogHeader>
                                                               <AlertDialogFooter className="mt-6 flex gap-3">
                                                                  <AlertDialogCancel className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-12 rounded-xl px-6 font-bold flex-1">
                                                                     Cancel
                                                                  </AlertDialogCancel>
                                                                  <AlertDialogAction 
                                                                     onClick={() => handleDelete(event.id)}
                                                                     className="bg-red-500 hover:bg-red-600 text-white border-0 h-12 rounded-xl px-6 font-black flex-1 shadow-lg shadow-red-500/20"
                                                                  >
                                                                     Confirm Deletion
                                                                  </AlertDialogAction>
                                                               </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                         </AlertDialog>
                                                     </div>
                                                 </div>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
