'use client';

import { useState } from 'react';
import { FileDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DownloadTicketButtonProps {
    ticket: {
        id: string;
        ticketType: {
            name: string;
            event: {
                title: string;
                startTime: string | Date;
                location: string;
            }
        }
    };
    userName: string;
}

export default function DownloadTicketButton({ ticket, userName }: DownloadTicketButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
        setIsGenerating(true);
        try {
            const { generateTicketPDF } = await import('@/lib/ticket-pdf');
            const blobUrl = await generateTicketPDF({
                ticketId: ticket.id,
                eventTitle: ticket.ticketType.event.title,
                eventStartTime: new Date(ticket.ticketType.event.startTime),
                eventLocation: ticket.ticketType.event.location,
                attendeeName: userName,
                ticketTypeName: ticket.ticketType.name
            });

            // Create a link and trigger click
            const link = document.createElement('a');
            link.href = blobUrl as string;
            link.download = `Ticket_${ticket.ticketType.event.title.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <Button 
            onClick={handleDownload}
            disabled={isGenerating}
            variant="outline"
            className="w-full mt-4 bg-white/5 border-white/10 hover:bg-white/10 text-white font-bold h-12 rounded-xl group transition-all"
        >
            {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-purple-400" />
            ) : (
                <FileDown className="w-4 h-4 mr-2 group-hover:translate-y-0.5 transition-transform text-purple-400" />
            )}
            {isGenerating ? 'Generating Pass...' : 'Download PDF Pass'}
        </Button>
    );
}
