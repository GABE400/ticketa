'use client';

import { useState } from "react";
import { 
    Smartphone, 
    Building2, 
    Copy, 
    CheckCircle2, 
    AlertCircle,
    ChevronDown,
    ChevronUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function PayoutDetailsDisplay({ details }: { details: any }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!details) {
        return (
            <div className="flex items-center gap-2 text-red-400/50 italic text-[10px] font-bold uppercase tracking-widest">
                <AlertCircle className="w-3 h-3" /> No Instructions Set
            </div>
        );
    }

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} copied to clipboard`);
    };

    return (
        <div className="flex flex-col gap-2">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors text-[10px] font-black uppercase tracking-widest group"
            >
                {details.method === 'mobile_money' ? (
                    <Smartphone className="w-3 h-3" />
                ) : (
                    <Building2 className="w-3 h-3" />
                )}
                {details.method === 'mobile_money' ? `${details.provider} Money` : 'Bank Transfer'}
                {isOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>

            {isOpen && (
                <div className="mt-2 p-3 rounded-xl bg-black/40 border border-white/5 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    {details.method === 'mobile_money' ? (
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0">
                                <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Phone Number</p>
                                <p className="text-xs font-mono font-bold text-white truncate">{details.phone}</p>
                            </div>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-7 w-7 rounded-lg hover:bg-white/10"
                                onClick={() => copyToClipboard(details.phone, "Phone number")}
                            >
                                <Copy className="w-3 h-3 text-gray-500" />
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Account Name</p>
                                    <p className="text-xs font-bold text-white truncate">{details.accName}</p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 rounded-lg hover:bg-white/10"
                                    onClick={() => copyToClipboard(details.accName, "Account name")}
                                >
                                    <Copy className="w-3 h-3 text-gray-500" />
                                </Button>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <div className="min-w-0">
                                    <p className="text-[8px] text-gray-600 font-black uppercase tracking-widest">Bank / Account No.</p>
                                    <p className="text-[10px] font-bold text-gray-300 truncate">{details.bankName}</p>
                                    <p className="text-xs font-mono font-bold text-white truncate">{details.accNumber}</p>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-7 w-7 rounded-lg hover:bg-white/10"
                                    onClick={() => copyToClipboard(details.accNumber, "Account number")}
                                >
                                    <Copy className="w-3 h-3 text-gray-500" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
