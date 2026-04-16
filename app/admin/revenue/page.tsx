
import { getAdminStats, getRecentOrders } from "@/lib/actions/admin";
import { 
    DollarSign, 
    TrendingUp, 
    ArrowUpRight, 
    CreditCard,
    PieChart,
    BarChart3,
    ArrowDownRight
} from "lucide-react";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminRevenuePage() {
    const stats = await getAdminStats();
    const recentOrders = await getRecentOrders();

    const profitMargin = stats.totalVolume > 0 
        ? (stats.platformProfit / stats.totalVolume) * 100 
        : 0;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter text-balance">Platform Treasury</h1>
                    <p className="text-gray-500 font-medium">Detailed financial breakdown and profit margins</p>
                </div>
                <div className="bg-purple-500/10 border border-purple-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-purple-400" />
                    <div>
                        <p className="text-xs font-black text-purple-400 uppercase tracking-widest leading-none mb-1">Profit Margin</p>
                        <p className="text-lg font-bold text-white leading-none">{profitMargin.toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            {/* Revenue breakdown cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl border-l-4 border-l-green-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <DollarSign className="w-3 h-3" />
                            Gross Volume
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white italic">
                            {new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(stats.totalVolume)}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-wider underline decoration-green-500/30">Total Value Processed</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl border-l-4 border-l-purple-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <TrendingUp className="w-3 h-3" />
                            Net Platform Profit
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white italic">
                            {new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(stats.platformProfit)}
                        </div>
                        <div className="flex gap-4 mt-2">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Fees: ${stats.totalFeesCollected.toFixed(2)}</span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Comm: ${stats.totalCommissions.toFixed(2)}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl border-l-4 border-l-red-500">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                            <ArrowDownRight className="w-3 h-3" />
                            Organizer Payouts
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white italic">
                            {new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(stats.totalPendingPayouts)}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase tracking-wider underline decoration-red-500/30">Total Marketplace Liability</p>
                    </CardContent>
                </Card>
            </div>

            {/* Audit Log Table */}
            <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                    <div>
                        <h2 className="text-lg font-bold text-white">Financial Audit Log</h2>
                        <p className="text-xs text-gray-500">Full breakdown of every transaction and fee split</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest font-black text-gray-400">
                                <th className="px-6 py-4">Transaction</th>
                                <th className="px-6 py-4 text-right">Subtotal</th>
                                <th className="px-6 py-4 text-right underline decoration-purple-500/50">Buyer Fee</th>
                                <th className="px-6 py-4 text-right underline decoration-purple-500/50">Org Comm.</th>
                                <th className="px-6 py-4 text-right font-black text-green-400">Total Paid</th>
                                <th className="px-6 py-4 text-right font-black text-red-400">Net Payout</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {recentOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-bold text-white italic">#{order.id.slice(0, 8)}</span>
                                            <span className="text-[10px] text-gray-500">{format(new Date(order.createdAt), "MMM d, HH:mm")}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs font-mono text-gray-400">
                                        ${Number(order.subtotal).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs font-mono text-purple-400/80">
                                        +${Number(order.serviceFee).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs font-mono text-purple-400/80">
                                        -${Number(order.commissionAmount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-black text-white">
                                        ${Number(order.amount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm font-black text-red-400">
                                        ${Number(order.netAmount).toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
