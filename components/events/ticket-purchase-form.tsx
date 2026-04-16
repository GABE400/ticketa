'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { initiateCheckout } from '@/lib/actions/orders';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { calculateOrderFees } from '@/lib/fees';

interface TicketPurchaseFormProps {
  ticketTypes: {
    id: string;
    name: string;
    price: string;
    capacity: number;
    sold: number;
  }[];
}

export default function TicketPurchaseForm({ ticketTypes }: TicketPurchaseFormProps) {
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(ticketTypes[0]?.id || null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const selectedTicket = ticketTypes.find(t => t.id === selectedTicketId);
  const { subtotal, serviceFee, totalAmount } = calculateOrderFees(
    selectedTicket ? parseFloat(selectedTicket.price) : 0, 
    quantity
  );

  const handleCheckout = async () => {
    if (!selectedTicketId) return;
    
    setIsLoading(true);
    try {
      const result = await initiateCheckout({
        ticketTypeId: selectedTicketId,
        quantity: quantity,
      });

      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }
    } catch (error: any) {
      toast.error(error.message || 'Checkout failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-white/10 bg-slate-900/50 backdrop-blur-3xl overflow-hidden">
      <CardHeader className="border-b border-white/5 bg-white/5">
        <CardTitle className="text-xl text-white font-bold">Select Tickets</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-white/5">
          {ticketTypes.map((type) => (
            <div 
              key={type.id} 
              onClick={() => setSelectedTicketId(type.id)}
              className={`p-6 transition-colors cursor-pointer group ${
                selectedTicketId === type.id ? 'bg-purple-500/10' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className={`font-bold text-lg transition-colors ${
                    selectedTicketId === type.id ? 'text-purple-400' : 'text-white'
                  }`}>
                    {type.name}
                  </h3>
                  <p className="text-xs text-gray-500">Available until sold out</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white">ZMW {parseFloat(type.price).toLocaleString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  selectedTicketId === type.id ? 'border-purple-500' : 'border-gray-600'
                }`}>
                  {selectedTicketId === type.id && <div className="w-2 h-2 rounded-full bg-purple-500" />}
                </div>
                <span className="text-xs text-gray-400">Select this category</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-6 border-t border-white/5 bg-black/40">
        <div className="w-full space-y-4">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400 tracking-wide uppercase text-xs font-bold">Quantity</span>
            <div className="flex items-center gap-4">
               <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg border border-white/10 hover:bg-white/5 flex items-center justify-center"
               >-</button>
               <span className="text-white font-bold">{quantity}</span>
               <button 
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-8 h-8 rounded-lg border border-white/10 hover:bg-white/5 flex items-center justify-center"
               >+</button>
            </div>
          </div>
          <div className="space-y-2 pt-2 border-t border-white/5">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-gray-300">ZMW {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Service Fee (Platform + Processing)</span>
              <span className="text-gray-300">ZMW {serviceFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-end mt-2">
              <span className="text-gray-400 tracking-wide uppercase text-xs font-bold">Total Amount</span>
              <span className="text-white text-xl font-black">ZMW {totalAmount.toLocaleString()}</span>
            </div>
          </div>
          <Button 
            onClick={handleCheckout}
            disabled={isLoading || !selectedTicketId}
            className="w-full bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-500 hover:to-red-500 font-bold h-12 shadow-lg shadow-purple-500/20"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Buy Tickets'
            )}
          </Button>
          <p className="text-[10px] text-center text-gray-500">
            Payment handled securely by <span className="text-orange-400 font-bold">PesaPal</span>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
}
