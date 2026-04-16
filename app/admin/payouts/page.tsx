
import { getPendingPayouts } from "@/lib/actions/admin";
import ProcessPayoutButton from "@/components/admin/process-payout-button";
import PayoutDetailsDisplay from "@/components/admin/payout-details-display";
import { 
    Banknote, 
    ArrowUpRight, 
    Users, 
    Clock, 
    ArrowRightLeft,
    ShieldCheck,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminPayoutsPage() {
    const payouts = await getPendingPayouts();
    
    // Calculate total platform liability
    const totalLiability = payouts.reduce((acc: number, p: any) => acc + Number(p.balance), 0);
    const totalOrders = payouts.reduce((acc: number, p: any) => acc + Number(p.count), 0);

    return (
        <div className="space-y-10">
            {/* Page Header */}
            <div>
                <h1 className="text-4xl font-black text-white tracking-tighter">Marketplace Ledger</h1>
                <p className="text-gray-500 font-medium mt-1">Audit liabilities and process payments to organizers</p>
            </div>

            {/* Treasury Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Banknote className="w-12 h-12 text-green-400" />
                    </div>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Gross Liability</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white tracking-tight">
                            {new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(totalLiability)}
                        </div>
                        <p className="text-[10px] text-red-400 font-bold uppercase mt-2 flex items-center gap-1">
                            <ArrowUpRight className="w-3 h-3" /> Owed to Organizers
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Pending Settlements</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white tracking-tight">
                            {payouts.length} <span className="text-sm font-medium text-gray-600">Accounts</span>
                        </div>
                        <p className="text-[10px] text-gray-500 font-bold uppercase mt-2">Requiring Verification</p>
                    </CardContent>
                </Card>

                <Card className="bg-slate-900/50 border-white/10 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Volume Depth</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white tracking-tight">
                            {totalOrders} <span className="text-sm font-medium text-gray-600">Orders</span>
                        </div>
                        <p className="text-[10px] text-purple-400 font-bold uppercase mt-2">Unset Transactions</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Ledger Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">Organizer Payout Ledger</h2>
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <ShieldCheck className="w-3 h-3" /> Real-time Audit
                    </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 text-[9px] uppercase tracking-[0.2em] font-black text-gray-500">
                                    <th className="px-8 py-5">Organizer Account</th>
                                    <th className="px-8 py-5">Payout Instructions</th>
                                    <th className="px-8 py-5">Tx Count</th>
                                    <th className="px-8 py-5">Settlement Amount</th>
                                    <th className="px-8 py-5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {payouts.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                                                    <CheckCircle2 className="w-8 h-8 text-gray-700" />
                                                </div>
                                                <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Treasury is Balanced. No pending payouts.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    payouts.map((p: any) => (
                                        <tr key={p.organizer_id} className="hover:bg-white/5 transition-colors group">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center shrink-0 shadow-xl">
                                                        {p.image ? (
                                                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Users className="w-5 h-5 text-gray-600" />
                                                        )}
                                                    </div>
                                                    <div className="flex flex-col min-w-0">
                                                        <span className="text-sm font-black text-white truncate">{p.name}</span>
                                                        <span className="text-[10px] text-gray-500 font-medium truncate">{p.email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <PayoutDetailsDisplay details={p.payout_details} />
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="px-2 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-mono font-bold text-gray-400">
                                                        {p.count}
                                                    </div>
                                                    <span className="text-[10px] text-gray-600 uppercase font-black tracking-widest">Orders</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex flex-col">
                                                    <span className="text-lg font-black text-white tracking-tighter">
                                                        {new Intl.NumberFormat('en-ZM', { style: 'currency', currency: 'ZMW' }).format(Number(p.balance))}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-[9px] text-green-400 font-black uppercase tracking-widest">
                                                        <ArrowRightLeft className="w-3 h-3" /> Ready for Transfer
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <ProcessPayoutButton 
                                                    organizerId={p.organizer_id} 
                                                    organizerName={p.name} 
                                                    amount={Number(p.balance)} 
                                                />
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Liability Notice */}
            <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="text-sm font-black text-red-400 uppercase tracking-widest">Administrative Audit Notice</p>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed">
                        Processing a payout will mark all associated orders as "Completed" in the system. This action is permanent and creates a legal audit trail. Please ensure you have transferred the funds via your banking provider before settling the ledger here.
                    </p>
                </div>
            </div>
        </div>
    );
}
