
/**
 * Platform Monetization Logic (ZMW Migration)
 * 
 * 1. Platform Commission: 2.5% (Added to base price)
 * 2. Processing Fee (PesaPal): 3.5% (Added to base price)
 * 3. Total Markup: 6.0% (Customer pays Base + 6%)
 */

export const FEES = {
  PLATFORM_COMMISSION_PERCENT: 0.025, // 2.5%
  PESAPAL_FEE_PERCENT: 0.035,        // 3.5%
};

export function calculateOrderFees(ticketPrice: number, quantity: number) {
  const baseSubtotal = ticketPrice * quantity;
  
  // Logic: Organizer wants 'ticketPrice'. We add fees on top.
  const platformCommission = baseSubtotal * FEES.PLATFORM_COMMISSION_PERCENT;
  const pesapalFee = baseSubtotal * FEES.PESAPAL_FEE_PERCENT;
  
  // The Total Price paid by the buyer
  const totalAmount = baseSubtotal + platformCommission + pesapalFee;
  
  // Payout to organizer is the raw price they set
  const netAmount = baseSubtotal;

  return {
    subtotal: Number(baseSubtotal.toFixed(2)),
    serviceFee: Number((platformCommission + pesapalFee).toFixed(2)), // Combined fee shown to user
    totalAmount: Number(totalAmount.toFixed(2)),
    commissionAmount: Number(platformCommission.toFixed(2)),
    processingFee: Number(pesapalFee.toFixed(2)),
    netAmount: Number(netAmount.toFixed(2)),
  };
}
