
import { getAllUsers } from "@/lib/actions/admin";
import UserRoleToggle from "@/components/admin/user-role-toggle";
import { format } from "date-fns";
import { Users, Mail, Calendar, ShieldCheck } from "lucide-react";

export default async function AdminUsersPage() {
    const users = await getAllUsers();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter">User Management</h1>
                    <p className="text-gray-500 font-medium">Manage permissions and roles across the platform</p>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
                    <Users className="w-5 h-5 text-red-400" />
                    <div>
                        <p className="text-xs font-black text-red-400 uppercase tracking-widest leading-none mb-1">Total Users</p>
                        <p className="text-lg font-bold text-white leading-none">{users.length}</p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-slate-900/50 backdrop-blur-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/5 bg-white/5 text-[10px] uppercase tracking-widest font-black text-gray-400">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Current Role</th>
                                <th className="px-6 py-4">Actions</th>
                                <th className="px-6 py-4">Joined</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                                {user.image ? (
                                                    <img src={user.image} alt={user.name} />
                                                ) : (
                                                    <Users className="w-5 h-5 text-gray-600" />
                                                )}
                                            </div>
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-sm font-bold text-white truncate">{user.name}</span>
                                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                                    <Mail className="w-3 h-3" />
                                                    <span className="truncate">{user.email}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                                            user.role === 'admin' 
                                                ? 'bg-red-500/10 border border-red-500/20 text-red-400' 
                                                : user.role === 'organizer'
                                                    ? 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                                                    : 'bg-white/5 border border-white/10 text-gray-500'
                                        }`}>
                                            <ShieldCheck className="w-3 h-3" />
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <UserRoleToggle userId={user.id} currentRole={user.role as any} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                                            <Calendar className="w-3 h-3" />
                                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                                        </div>
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
