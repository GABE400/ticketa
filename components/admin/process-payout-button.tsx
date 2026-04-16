
'use client';

import { useState } from 'react';
import { processOrganizerPayout } from '@/lib/actions/admin';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, RotateCcw } from 'lucide-react';

interface ProcessPayoutButtonProps {
    organizerId: string;
    organizerName: string;
    amount: number;
}

export default function ProcessPayoutButton({ organizerId, organizerName, amount }: ProcessPayoutButtonProps) {
    const [isLoading, setIsLoading] = useState(false);

    async function handleProcess() {
        if (!confirm(`Are you sure you want to mark $${amount.toFixed(2)} as PAID to ${organizerName}? This will clear their pending balance.`)) {
            return;
        }

        setIsLoading(true);
        try {
            const result = await processOrganizerPayout(organizerId);
            if (result.success) {
                toast.success(`Payout successfully recorded for ${organizerName}`);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to process payout");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Button 
            onClick={handleProcess} 
            disabled={isLoading}
            variant="outline"
            className="bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white transition-all rounded-xl h-10 px-6 font-black uppercase text-[10px] tracking-widest gap-2"
        >
            {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
            ) : (
                <CheckCircle2 className="w-3 h-3" />
            )}
            {isLoading ? 'Processing...' : 'Settle Payout'}
        </Button>
    );
}
