
import { getAdminStats, getRecentOrders } from "@/lib/actions/admin";
import SyncHistoricalDataButton from "@/components/admin/sync-button";
import { 
    Card, 
    CardContent, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { 
    TrendingUp, 
    Users, 
    DollarSign, 
    Calendar,
    ArrowUpRight,
    Search,
    Filter,
} from "lucide-react";
import { format } from "date-fns";

export default async function AdminDashboardPage() {
    const stats = await getAdminStats();
    const recentOrders = await getRecentOrders();

    const statCards = [
        {
            title: "Gross Sales Volume",
            value: new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(stats.totalVolume),
            description: "Total ticket value processed",
            icon: DollarSign,
            color: "text-green-400"
        },
        {
            title: "Platform Profit",
            value: new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(stats.platformProfit),
            description: "Fees + Commissions collected",
            icon: TrendingUp,
            color: "text-purple-400"
        },
        {
            title: "Net Treasury",
            value: new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(stats.totalPendingPayouts),
            description: "Total owed to organizers",
            icon: Calendar,
            color: "text-blue-400"
        },
        {
            title: "Active Users",
            value: stats.userCount.toLocaleString(),
            description: `${stats.organizerCount} verified organizers`,
            icon: Users,
            color: "text-red-400"
        }
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">Site Overview</h1>
                    <p className="text-gray-500 font-medium">Global platform performance and metrics</p>
                </div>
                <div className="flex items-center gap-2">
                    <SyncHistoricalDataButton />
                    <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-white transition-colors">
                        <Filter className="w-5 h-5" />
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-red-600 text-white font-bold hover:bg-red-500 transition-colors shadow-lg shadow-red-500/20">
                        Export Data
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <Card key={i} className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium text-gray-400">{stat.title}</CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-white tracking-tight">{stat.value}</div>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 font-bold">{stat.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Recent Orders Table */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden mt-8">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-white">Recent Transactions</h2>
                    <button className="text-xs font-bold text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 uppercase tracking-widest">
                        View all orders
                        <ArrowUpRight className="w-3 h-3" />
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest font-black text-gray-500">
                                <th className="px-6 py-3">Order ID</th>
                                <th className="px-6 py-3">Buyer</th>
                                <th className="px-6 py-3">Event</th>
                                <th className="px-6 py-3">Amount</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentOrders.length > 0 ? recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-xs font-mono text-gray-400 truncate max-w-[120px]">
                                        #{order.id.slice(0, 8)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-white">{order.buyer.name}</span>
                                            <span className="text-[10px] text-gray-500">{order.buyer.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-300">
                                        {order.ticketType?.event?.title || "Unknown Event"}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-black text-white">
                                        ${Number(order.amount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-400">
                                        {format(new Date(order.createdAt), "MMM d, HH:mm")}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-2 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] font-black text-green-400 uppercase tracking-tighter">
                                            Paid
                                        </span>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-20 text-center text-gray-500 italic">
                                        No transactions processed yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
