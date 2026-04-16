'use client';

import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';
import { validateTicketAction } from '@/lib/actions/ticket-validation';
import { toast } from 'sonner';
import { Shield, Loader2, CheckCircle2, AlertCircle, RefreshCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { AnimatePresence, motion } from 'framer-motion';

interface QRScannerProps {
  eventId: string;
}

export default function QRScanner({ eventId }: QRScannerProps) {
  const [isValidating, setIsValidating] = useState(false);
  const [isScannerStarted, setIsScannerStarted] = useState(false);
  const [lastResult, setLastResult] = useState<{
    success: boolean;
    message: string;
    guest?: string;
    tier?: string;
  } | null>(null);
  
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const regionId = 'qr-reader';

  const isStarting = useRef(false);

  const startScanner = async () => {
    if (scannerRef.current || isStarting.current) return;
    isStarting.current = true;

    try {
      const scanner = new Html5Qrcode(regionId);
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
      };

      const onScanSuccess = async (decodedText: string) => {
        if (isValidating) return;
        setIsValidating(true);
        try { await scanner.pause(); } catch (e) {}

        try {
          if (navigator.vibrate) navigator.vibrate(100);
          const result = await validateTicketAction(decodedText, eventId);
          setLastResult(result as any);

          if (result.success) {
            toast.success(`Verified: ${result.guest}`);
          } else {
            toast.error(result.error);
          }

          setTimeout(async () => {
            setLastResult(null);
            setIsValidating(false);
            if (scannerRef.current && scannerRef.current.getState() === 3) {
              try { await scannerRef.current.resume(); } catch (e) {}
            }
          }, 3000);

        } catch (error) {
          toast.error('Validation failed. Please try again.');
          setIsValidating(false);
          try { await scanner.resume(); } catch(e) {}
        }
      };

      try {
        // Fallback Chain: environment (back) -> user (front/any) -> default
        const startAttempt = async (constraints: any) => {
           try {
             return await scanner.start(constraints, config, onScanSuccess, () => {});
           } catch (err: any) {
             const errorStr = err?.toString() || "";
             if (errorStr.includes("NotFoundError") || errorStr.includes("NotAllowedError") || errorStr.includes("OverconstrainedError")) {
               return { failed: true, error: errorStr };
             }
             throw err;
           }
        };

        let result = await startAttempt({ facingMode: 'environment' });
        
        if (result && (result as any).failed) {
          result = await startAttempt({ facingMode: 'user' });
        }

        if (result && (result as any).failed) {
          try {
            const cameras = await Html5Qrcode.getCameras();
            if (cameras && cameras.length > 0) {
              // Final fallback: Use the first available camera ID directly
              await scanner.start(cameras[0].id, config, onScanSuccess, () => {});
              result = { failed: false };
            }
          } catch (e) {
            result = { failed: true, error: (result as any).error };
          }
        }

        if (result && (result as any).failed) {
           throw new Error((result as any).error);
        }
        
      } catch (err: any) {
        if (!window.isSecureContext) {
          toast.error('Camera requires a secure connection (HTTPS).');
        } else if (err?.toString().includes("NotAllowedError")) {
          toast.error('Camera permission denied.');
        } else {
          toast.error('Could not start camera. Check permissions.');
        }
        throw err;
      }
      
      setIsScannerStarted(true);
    } catch (err: any) {
      if (!err?.toString().includes("NotFoundError")) {
        console.error('Scanner start failed:', err);
      }
    } finally {
      isStarting.current = false;
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      const scanner = scannerRef.current;
      scannerRef.current = null; // Clear ref immediately to prevent double-stop
      
      try {
        const state = scanner.getState();
        // 2 = SCANNING, 3 = PAUSED
        if (state === 2 || state === 3) {
          await scanner.stop();
        }
      } catch (err: any) {
        if (!err?.toString().includes("is not running or paused")) {
          // Only log real errors
        }
      } finally {
        setIsScannerStarted(false);
      }
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative aspect-square w-full max-w-md mx-auto rounded-[2rem] overflow-hidden bg-slate-900 border-2 border-white/5 group">
        {/* The Video Element */}
        <div id={regionId} className="w-full h-full object-cover grayscale brightness-110 opacity-70 group-hover:opacity-100 transition-opacity" />

        {/* Framing Overlay */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-64 h-64 border-2 border-dashed border-purple-500/50 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-purple-500 rounded-tl-xl" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-purple-500 rounded-tr-xl" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-purple-500 rounded-bl-xl" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-purple-500 rounded-br-xl" />
          </div>
        </div>

        {/* Scanning Animation Line */}
        {isScannerStarted && !isValidating && (
          <div className="absolute top-[20%] left-0 right-0 h-[2px] bg-purple-500/50 blur-[2px] animate-scan-line shadow-[0_0_15px_rgba(139,92,246,0.5)]" />
        )}

        {/* Validation Overlay */}
        <AnimatePresence>
          {(isValidating || lastResult) && (
            <div className={cn(
                "absolute inset-0 flex flex-col items-center justify-center backdrop-blur-md p-8 text-center transition-all duration-300",
                lastResult?.success ? "bg-green-500/10" : "bg-red-500/10"
            )}>
              {isValidating && !lastResult && (
                <div className="space-y-4">
                  <Loader2 className="w-16 h-16 text-purple-400 animate-spin mx-auto" />
                  <p className="text-xl font-bold tracking-tighter">Validating Identity...</p>
                </div>
              )}

              {lastResult && (
                <div className="space-y-4 animate-in zoom-in-95 duration-300">
                  {lastResult.success ? (
                    <>
                      <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-500/50">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-black text-white">{lastResult.guest}</h3>
                      <p className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs font-bold text-green-400 uppercase tracking-widest mx-auto inline-block">
                        {lastResult.tier} Pass Confirmed
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-2 border border-red-500/50">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                      </div>
                      <h3 className="text-xl font-bold text-red-400">Entry Denied</h3>
                      <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                        {lastResult.message || 'Invalid or expired pass.'}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </AnimatePresence>

        {/* Controls Overlay */}
        {!isScannerStarted && !isValidating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm px-10 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                <Shield className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-sm text-gray-400">Camera access is required to scan passes.</p>
              <Button onClick={startScanner} className="bg-white text-black font-bold h-11 px-8 rounded-xl shadow-xl shadow-white/5 hover:bg-gray-200">
                Enable Camera
              </Button>
            </div>
          </div>
        )}
      </div>

      {isScannerStarted && (
        <div className="flex justify-center">
          <Button 
            variant="ghost" 
            onClick={stopScanner}
            className="text-gray-500 hover:text-white transition-colors"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Restart Scanner
          </Button>
        </div>
      )}
    </div>
  );
}
