'use client';

import { useEffect, useState } from 'react';
import { generateQRCode } from '@/lib/qr';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TicketQRProps {
  data: string;
}

export default function TicketQR({ data }: TicketQRProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const fetchQR = async () => {
    setLoading(true);
    try {
      // Rotating logic simulation: In a real rotating system, 
      // the 'data' passed from server would be a base token 
      // and we'd append a time-based TOTP here.
      const qrSvg = await generateQRCode(data);
      setSvg(qrSvg);
      setLastUpdated(new Date());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQR();
    // Simulate rotating token every 30 seconds
    const interval = setInterval(fetchQR, 30000);
    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-48 h-48 bg-white rounded-2xl p-4 shadow-[0_0_50px_rgba(139,92,246,0.3)]">
        {loading && !svg ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl">
            <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          </div>
        ) : svg ? (
          <div 
            className="w-full h-full" 
            dangerouslySetInnerHTML={{ __html: svg }} 
          />
        ) : null}
      </div>
      
      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
        <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
        <span>Token rotates in 30s</span>
      </div>
    </div>
  );
}
