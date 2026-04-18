"use client";

import { useState } from "react";
import { updateSiteSettings } from "@/lib/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Save, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function SettingsForm({ initialUrl }: { initialUrl: string }) {
    const [url, setUrl] = useState(initialUrl);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setIsSuccess(false);

        try {
            const result = await updateSiteSettings(url.trim() || null);
            if (result.success) {
                toast.success("Settings updated successfully!");
                setIsSuccess(true);
                // Hide success indicator after 3 seconds
                setTimeout(() => setIsSuccess(false), 3000);
            } else {
                toast.error(result.error || "Failed to update settings");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-3">
                <Label htmlFor="demoUrl" className="text-gray-400 text-sm font-bold flex items-center gap-2">
                    YouTube Demo URL
                </Label>
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-700 group-focus-within:text-red-500 transition-colors">
                        <Play className="w-5 h-5" />
                    </div>
                    <Input
                        id="demoUrl"
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="pl-12 h-14 bg-black/40 border-white/10 text-white placeholder:text-gray-700 focus:border-red-500/50 transition-all text-lg font-medium rounded-xl"
                    />
                </div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest pl-1">
                    This link will be used for the "Watch Demo" button on the hero section.
                </p>
            </div>

            <div className="pt-4 flex items-center justify-between">
                <AnimatePresence mode="wait">
                    {isSuccess && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="flex items-center gap-2 text-green-400 font-bold text-sm"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Changes saved
                        </motion.div>
                    )}
                </AnimatePresence>

                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="ml-auto min-w-[140px] h-12 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black shadow-lg shadow-red-600/20 group transition-all duration-300"
                >
                    {isLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                        <Save className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    )}
                    {isLoading ? "Saving..." : "Save Settings"}
                </Button>
            </div>
        </form>
    );
}
