'use client';

import { ShieldAlert, RotateCcw } from 'lucide-react';
import '@/app/globals.css';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 selection:bg-purple-500/30 font-sans">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[35%] h-[35%] bg-purple-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[35%] h-[35%] bg-red-600/10 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-md w-full text-center space-y-8 z-10">
          {/* Alert Icon with glow */}
          <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500/20 to-red-500/20 rounded-3xl flex items-center justify-center mx-auto border border-white/10 shadow-2xl">
            <ShieldAlert className="w-10 h-10 text-red-500" />
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-red-500 rounded-3xl blur opacity-30 -z-10"></div>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              System Interrupted
            </h1>
            <p className="text-gray-400 text-sm leading-relaxed">
              A critical security or connectivity error occurred. Our team has been notified.
            </p>
          </div>

          {error?.message && (
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left font-mono text-xs text-gray-400 overflow-auto max-h-32">
              <span className="text-red-400 font-bold">Error:</span> {error.message}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Reset Session
            </button>
            <a
              href="/"
              className="flex items-center justify-center px-8 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 font-bold transition-all cursor-pointer"
            >
              Return Home
            </a>
          </div>
        </div>
      </body>
    </html>
  );
}
