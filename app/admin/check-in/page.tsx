
import QRScanner from "@/components/admin/scanner";
import { Camera, Shield, UserCheck, ShieldAlert } from "lucide-react";

export default function CheckInPage() {
    return (
        <div className="space-y-8 min-h-[80vh] flex flex-col items-center justify-center -mt-16 sm:-mt-24">
            <div className="text-center space-y-4 max-w-sm px-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-black uppercase tracking-widest text-purple-400">
                    <Shield className="w-3 h-3" />
                    Secure Gate Control
                </div>
                <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                    Attendee <span className="bg-gradient-to-r from-purple-400 to-red-500 bg-clip-text text-transparent">Check-In</span>
                </h1>
                <p className="text-gray-500 font-medium text-sm">
                    Scan the ticket QR code on the attendee's mobile device to grant access and mark as used.
                </p>
            </div>

            <div className="w-full max-w-lg px-4">
                <QRScanner />
            </div>

            <div className="flex flex-col items-center gap-4 text-center px-4 max-w-xs">
                <div className="flex items-center gap-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                    <div className="flex items-center gap-1.5 underline decoration-purple-500/30">
                        <UserCheck className="w-3 h-3" />
                        Staff Authorized
                    </div>
                </div>
                <p className="text-[10px] text-gray-600 font-mono leading-relaxed">
                    This terminal is cryptographically linked to your organizer session. Every check-in is logged with a global timestamp.
                </p>
            </div>
        </div>
    );
}
