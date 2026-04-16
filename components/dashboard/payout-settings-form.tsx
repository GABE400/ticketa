'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Building2, Smartphone, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { updatePayoutSettings } from '@/lib/actions/users';
import { toast } from 'sonner';

const payoutSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("bank_transfer"),
    bankName: z.string().min(2, "Bank name required"),
    accName: z.string().min(2, "Account name required"),
    accNumber: z.string().min(5, "Account number required"),
  }),
  z.object({
    method: z.literal("mobile_money"),
    provider: z.enum(["airtel", "mtn", "zamtel"]),
    phone: z.string().min(10, "Valid phone number required"),
  }),
]);

type PayoutFormData = z.infer<typeof payoutSchema>;

export default function PayoutSettingsForm({ initialData }: { initialData?: any }) {
  const [isLoading, setIsLoading] = useState(false);
  const [method, setMethod] = useState<"bank_transfer" | "mobile_money">(
    initialData?.method || "mobile_money"
  );

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<PayoutFormData>({
    resolver: zodResolver(payoutSchema),
    defaultValues: initialData || { method: "mobile_money", provider: "mtn" }
  });

  const onSubmit = async (data: PayoutFormData) => {
    setIsLoading(true);
    try {
      const result = await updatePayoutSettings(data);
      if (result.success) {
        toast.success("Payout settings saved successfully");
      } else {
        toast.error(result.error || "Failed to save settings");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-3xl overflow-hidden shadow-2xl">
      <CardHeader className="border-b border-white/5 bg-white/[0.02] p-8">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <CheckCircle2 className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <CardTitle className="text-2xl font-black text-white uppercase tracking-tight">Settlement Instructions</CardTitle>
            <CardDescription className="text-gray-500 font-bold text-xs uppercase tracking-widest mt-1">
              Where should we send your Kwacha?
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <Tabs 
            defaultValue={method} 
            onValueChange={(v) => {
                const newMethod = v as "bank_transfer" | "mobile_money";
                setMethod(newMethod);
                setValue("method", newMethod);
            }} 
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 bg-black border border-white/5 h-14 p-1 rounded-2xl">
              <TabsTrigger 
                value="mobile_money" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-black font-black uppercase text-[10px] tracking-widest"
              >
                <Smartphone className="w-4 h-4 mr-2" /> Mobile Money
              </TabsTrigger>
              <TabsTrigger 
                value="bank_transfer" 
                className="rounded-xl data-[state=active]:bg-white data-[state=active]:text-black font-black uppercase text-[10px] tracking-widest"
              >
                <Building2 className="w-4 h-4 mr-2" /> Bank Transfer
              </TabsTrigger>
            </TabsList>

            <TabsContent value="mobile_money" className="mt-8 space-y-6">
              <div className="space-y-4">
                <Label className="text-[10px] text-gray-500 font-black uppercase ml-1 tracking-widest">Network Provider</Label>
                <div className="grid grid-cols-3 gap-4">
                  {['airtel', 'mtn', 'zamtel'].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setValue("provider", p as any)}
                      className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                        watch("provider" as any) === p 
                        ? "border-purple-500 bg-purple-500/10" 
                        : "border-white/5 bg-black/40 hover:border-white/20"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black uppercase text-xs ${
                        p === 'airtel' ? 'bg-red-500' : p === 'mtn' ? 'bg-yellow-400 text-black' : 'bg-green-600'
                      }`}>
                        {p[0]}
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-tighter text-white">{p} Money</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[10px] text-gray-400 font-black uppercase ml-1">Phone Number</Label>
                <Input 
                  {...register("phone")} 
                  placeholder="e.g. 097..." 
                  className="bg-black border-white/10 text-white h-16 text-xl font-black rounded-2xl px-6 focus:ring-4 focus:ring-purple-500/20 transition-all shadow-inner"
                />
                {errors.method === "mobile_money" && (errors as any).phone && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1 font-bold">
                    <AlertCircle className="w-3 h-3" /> {(errors as any).phone.message}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="bank_transfer" className="mt-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-[10px] text-gray-400 font-black uppercase ml-1">Account Name</Label>
                  <Input 
                    {...register("accName")} 
                    placeholder="Full Legal Name"
                    className="bg-black border-white/10 text-white h-16 text-lg font-black rounded-2xl px-6 shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] text-gray-400 font-black uppercase ml-1">Bank Name</Label>
                  <Input 
                    {...register("bankName")} 
                    placeholder="e.g. Stanbic, FNB"
                    className="bg-black border-white/10 text-white h-16 text-lg font-black rounded-2xl px-6 shadow-inner"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] text-gray-400 font-black uppercase ml-1">Account Number</Label>
                <Input 
                  {...register("accNumber")} 
                  placeholder="XXXXXXXXXXXX"
                  className="bg-black border-white/10 text-white h-16 text-xl font-black rounded-2xl px-6 tracking-widest shadow-inner"
                />
              </div>
            </TabsContent>
          </Tabs>

          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-16 rounded-[1.2rem] bg-white text-black hover:bg-gray-200 font-black uppercase tracking-[0.2em] shadow-xl transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              "Save Settlement Details"
            )}
          </Button>

          <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest text-center mt-4">
            Security: Details are encrypted and only accessible by platform administrators during settlement.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}
