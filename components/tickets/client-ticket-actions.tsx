'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DownloadTicketButton = dynamic(
  () => import('./download-ticket-button'),
  { ssr: false }
);

interface ClientTicketActionsProps {
    ticket: any;
    userName: string;
}

/**
 * Definitively isolates the PDF generation logic from the SSR engine.
 * This prevents fflate/jspdf from being traced during build-time SSR.
 */
export default function ClientTicketActions(props: ClientTicketActionsProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="w-full h-12 mt-4 rounded-xl bg-white/5 animate-pulse border border-white/10" />
        );
    }

    return <DownloadTicketButton {...props} />;
}
