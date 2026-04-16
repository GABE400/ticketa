
'use client';

import { useState } from 'react';
import { syncHistoricalData } from '@/lib/actions/admin';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle2, Loader2 } from 'lucide-react';

export default function SyncHistoricalDataButton() {
    const [isLoading, setIsLoading] = useState(false);

    const handleSync = async () => {
        setIsLoading(true);
        try {
            const result = await syncHistoricalData();
            if (result.success) {
                if (result.count === 0) {
                    toast.info("Database is already up to date.");
                } else {
                    toast.success(`Synchronized ${result.count} historical orders!`);
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to sync data");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={handleSync}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-xs font-bold text-gray-400 hover:text-white"
        >
            {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-red-400" />
            ) : (
                <RefreshCw className="w-4 h-4 text-red-400" />
            )}
            Sync Historical Data
        </button>
    );
}
