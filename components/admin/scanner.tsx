
'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode';
import { verifyAndCheckInTicket } from '@/lib/actions/check-in';
import { toast } from 'sonner';
import { ShieldCheck, XCircle, Loader2, Camera, User, Ticket } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function QRScanner() {
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);
    const [scanResult, setScanResult] = useState<any>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [lastScan, setLastScan] = useState<string | null>(null);

    useEffect(() => {
        // Initialize scanner
        const scanner = new Html5QrcodeScanner(
            "reader",
            { 
                fps: 10, 
                qrbox: { width: 250, height: 250 },
                aspectRatio: 1.0,
            },
            /* verbose= */ false
        );

        scanner.render(onScanSuccess, onScanError);
        scannerRef.current = scanner;

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(console.error);
            }
        };
    }, []);

    async function onScanSuccess(decodedText: string) {
        // Prevent duplicate scans within 2 seconds
        if (decodedText === lastScan) return;
        
        setLastScan(decodedText);
        setIsVerifying(true);
        setScanResult(null);

        try {
            // Haptic feedack if supported
            if ('vibrate' in navigator) navigator.vibrate(100);

            const result = await verifyAndCheckInTicket(decodedText);
            setScanResult(result);
            
            if (result.success) {
                toast.success(`Check-in: ${result.attendee}`);
            } else {
                toast.error(result.error || "Invalid ticket");
            }
        } catch (error: any) {
            toast.error("Scanning synchronization failure");
        } finally {
            setIsVerifying(false);
            // Clear last scan after 3 seconds to allow re-scans if needed
            setTimeout(() => setLastScan(null), 3000);
        }
    }

    function onScanError(error: any) {
        // Handle scan errors (usually just "no QR found in frame")
        // console.warn(error);
    }

    return (
        <div className="space-y-8 max-w-xl mx-auto">
            <div className="relative rounded-[2rem] overflow-hidden border border-white/10 bg-black shadow-2xl shadow-purple-500/10">
                <div id="reader" className="w-full"></div>
                
                {isVerifying && (
                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md">
                        <Loader2 className="w-12 h-12 animate-spin text-purple-400 mb-4" />
                        <span className="text-white font-black uppercase tracking-widest text-xs">Authenticating Token...</span>
                    </div>
                )}
            </div>

            {/* Scan Results Overlay/Card */}
            {scanResult && (
                <Card className={`border-2 animate-in fade-in slide-in-from-bottom-4 duration-500 ${
                    scanResult.success ? 'bg-green-500/10 border-green-500/20' : 'bg-red-500/10 border-red-500/20'
                }`}>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-2xl ${
                                scanResult.success ? 'bg-green-500/20' : 'bg-red-500/20'
                            }`}>
                                {scanResult.success ? (
                                    <ShieldCheck className="w-8 h-8 text-green-400" />
                                ) : (
                                    <XCircle className="w-8 h-8 text-red-400" />
                                )}
                            </div>
                            <div className="flex-1">
                                <h3 className={`text-xl font-black italic uppercase italic tracking-tighter ${
                                    scanResult.success ? 'text-green-400' : 'text-red-400'
                                }`}>
                                    {scanResult.success ? "Welcome Inside!" : scanResult.error}
                                </h3>
                                {scanResult.attendee && (
                                    <div className="flex items-center gap-2 mt-1">
                                        <User className="w-3 h-3 text-gray-500" />
                                        <span className="text-sm font-bold text-white">{scanResult.attendee}</span>
                                    </div>
                                )}
                                {scanResult.ticketType && (
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <Ticket className="w-3 h-3 text-gray-500" />
                                        <span className="text-xs font-medium text-gray-400 uppercase tracking-widest">{scanResult.ticketType}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {!scanResult && !isVerifying && (
                <div className="text-center space-y-2 opacity-50">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-[0.2em] italic">Awaiting Valid Ticket QR</p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-purple-500 animate-pulse"></div>
                        <div className="w-1 h-1 rounded-full bg-purple-500 animate-pulse delay-75"></div>
                        <div className="w-1 h-1 rounded-full bg-purple-500 animate-pulse delay-150"></div>
                    </div>
                </div>
            )}
        </div>
    );
}
