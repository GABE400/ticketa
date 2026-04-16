'use client';

import { ChevronLeft, Shield } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function WorkspaceLayout({ 
  children, 
  title, 
  subtitle, 
  className 
}: WorkspaceLayoutProps) {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30">
      {/* Aesthetic Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/5 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[0%] right-[-5%] w-[35%] h-[35%] bg-red-600/5 rounded-full blur-[120px]"></div>
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-white/5 px-4 sm:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
               <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tighter text-white">Ticketa <span className="text-gray-500 font-normal">Studio</span></span>
          </Link>
          
          <Link 
            href="/dashboard" 
            className="text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
          >
            Manage Events
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-20 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-4">
            <Link 
              href="/dashboard" 
              className="inline-flex items-center text-sm text-gray-500 hover:text-white transition-colors group"
            >
              <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </Link>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
                {title}
              </h1>
              {subtitle && (
                <p className="text-gray-400 text-lg mt-2 max-w-2xl leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className={cn("relative", className)}>
             {children}
          </div>
        </div>
      </main>
    </div>
  );
}
