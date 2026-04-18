import { getSiteSettings } from "@/lib/actions/settings";
import { Settings, Play, Save, Video, HelpCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SettingsForm } from "./settings-form";

export default async function AdminSettingsPage() {
    const settings = await getSiteSettings();

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">Site Settings</h1>
                    <p className="text-gray-500 font-medium">Manage global platform configurations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
                        <CardHeader className="border-b border-white/5 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
                                    <Video className="w-5 h-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl text-white">Demo Content</CardTitle>
                                    <CardDescription className="text-gray-500 font-medium">
                                        Configure the promotional video shown on the landing page.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <SettingsForm initialUrl={settings?.demoVideoUrl || ""} />
                        </CardContent>
                    </Card>

                    {/* Placeholder for more settings categories */}
                    <Card className="bg-slate-900/5 border-dashed border-white/5 opacity-50">
                        <CardContent className="py-20 flex flex-col items-center justify-center text-center">
                            <Settings className="w-12 h-12 text-gray-800 mb-4" />
                            <h3 className="text-gray-700 font-bold">More settings coming soon</h3>
                            <p className="text-gray-800 text-sm max-w-xs">Specific platform configurations will appear here.</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <Card className="bg-purple-900/10 border-purple-500/20">
                        <CardHeader>
                            <div className="flex items-center gap-2 text-purple-400 mb-1">
                                <HelpCircle className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">Guide</span>
                            </div>
                            <CardTitle className="text-lg text-white">YouTube Integration</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm text-gray-400 space-y-4">
                            <p>
                                Paste a standard YouTube URL (e.g., <code className="text-purple-300">youtube.com/watch?v=...</code>) and we'll automatically handle the embedding for you.
                            </p>
                            <div className="p-3 rounded-lg bg-black/40 border border-white/5 font-mono text-[10px] space-y-2 translate-y-1">
                                <p className="text-gray-500 break-all underline decoration-purple-500/50 underline-offset-4">
                                    https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                </p>
                            </div>
                            <p className="pt-4">
                                To remove the video, simply clear the input field and save. The "Watch Demo" button will then show an informative message to users.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900/50 border-white/10">
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-4">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                <span className="text-xs font-bold text-gray-400">Settings are global and live.</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
