"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Play, X, AlertCircle } from "lucide-react";

interface DemoModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  videoUrl: string | null;
}

export function DemoModal({ isOpen, onOpenChange, videoUrl }: DemoModalProps) {
  // Extract YouTube ID from URL
  const getYouTubeId = (url: string | null) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(videoUrl);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-slate-950 border-white/10 p-0 overflow-hidden backdrop-blur-3xl shadow-2xl">
        <DialogHeader className="p-6 border-b border-white/5 pb-4 bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-600/10 border border-red-600/20 text-red-500">
              <Play className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black text-white tracking-tighter uppercase">Platform Demo</DialogTitle>
              <DialogDescription className="text-gray-500 text-xs font-medium uppercase tracking-widest mt-0.5">
                Experiencing Ticketa in action
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {videoId ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
              title="Ticketa Demo"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="absolute inset-0 w-full h-full border-0 select-none"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-12 space-y-4">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mb-2">
                <AlertCircle className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Invalid Video Link</h3>
                <p className="text-gray-400 max-w-sm text-sm">
                  We couldn't load the demo video because the URL provided by the administrator is invalid or missing.
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-slate-900/50 border-t border-white/5 flex justify-end">
            <button 
                onClick={() => onOpenChange(false)}
                className="px-6 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-xs font-bold text-gray-400 hover:text-white transition-all uppercase tracking-widest"
            >
                Close Demo
            </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
