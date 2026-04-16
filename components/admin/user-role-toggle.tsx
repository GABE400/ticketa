
'use client';

import { useState } from 'react';
import { updateUserRole } from '@/lib/actions/admin';
import { toast } from 'sonner';
import { Loader2, ShieldAlert, ShieldCheck, User } from 'lucide-react';

interface UserRoleToggleProps {
    userId: string;
    currentRole: "buyer" | "organizer" | "admin";
}

export default function UserRoleToggle({ userId, currentRole }: UserRoleToggleProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState(currentRole);

    const roles: ("buyer" | "organizer" | "admin")[] = ["buyer", "organizer", "admin"];

    const handleRoleChange = async (newRole: "buyer" | "organizer" | "admin") => {
        if (newRole === role) return;
        
        setIsLoading(true);
        try {
            await updateUserRole(userId, newRole);
            setRole(newRole);
            toast.success(`User promoted to ${newRole}`);
        } catch (error: any) {
            toast.error(error.message || "Failed to update role");
        } finally {
            setIsLoading(false);
        }
    };

    const getRoleIcon = (r: string) => {
        switch(r) {
            case 'admin': return <ShieldAlert className="w-3 h-3 text-red-400" />;
            case 'organizer': return <ShieldCheck className="w-3 h-3 text-purple-400" />;
            default: return <User className="w-3 h-3 text-gray-400" />;
        }
    };

    return (
        <div className="flex items-center gap-1">
            {roles.map((r) => (
                <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    disabled={isLoading}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter transition-all flex items-center gap-1 border ${
                        role === r 
                            ? 'bg-white/10 border-white/20 text-white' 
                            : 'bg-transparent border-transparent text-gray-500 hover:text-gray-300'
                    }`}
                >
                    {isLoading && role === r ? <Loader2 className="w-3 h-3 animate-spin" /> : getRoleIcon(r)}
                    {r}
                </button>
            ))}
        </div>
    );
}
