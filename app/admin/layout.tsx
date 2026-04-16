
import Navbar from "@/components/navbar";
import { requireAdmin } from "@/lib/session";
import { 
    LayoutDashboard, 
    Users, 
    Calendar, 
    DollarSign, 
    Settings,
    ShieldCheck,
    Camera,
    Banknote
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Server-side guard for the entire /admin route group
    const session = await requireAdmin();

    const menuItems = [
        { icon: LayoutDashboard, label: "Overview", href: "/admin" },
        { icon: Camera, label: "Check-In", href: "/admin/check-in" },
        { icon: DollarSign, label: "Revenue", href: "/admin/revenue" },
        { icon: Banknote, label: "Payouts", href: "/admin/payouts" },
        { icon: Users, label: "Users", href: "/admin/users" },
        { icon: Calendar, label: "Events", href: "/admin/events" },
        { icon: Settings, label: "Settings", href: "/admin/settings" },
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            <Navbar />
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 space-y-2">
                        <div className="px-4 py-4 mb-4 rounded-2xl bg-gradient-to-br from-red-500/20 to-purple-500/20 border border-red-500/30">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-6 h-6 text-red-400" />
                                <div>
                                    <p className="text-xs font-black text-red-400 uppercase tracking-widest">Admin Site</p>
                                    <p className="text-sm font-bold text-white truncate">{session.user.name}</p>
                                </div>
                            </div>
                        </div>

                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group"
                                >
                                    <item.icon className="w-5 h-5 text-gray-500 group-hover:text-red-400 transition-colors" />
                                    <span className="font-medium text-gray-300 group-hover:text-white">{item.label}</span>
                                </Link>
                            ))}
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 min-w-0">
                        {children}
                    </main>
                </div>
            </div>
        </div>
    );
}
