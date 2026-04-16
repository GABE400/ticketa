import { NextRequest, NextResponse } from "next/server";
import { getPesapalToken, getPesapalTransactionStatus } from "@/lib/pesapal";
import { completeOrderAndIssueTickets } from "@/lib/actions/orders-completion";

/**
 * PesaPal IPN Handler (Instant Payment Notification)
 * This route is called by PesaPal server-to-server to update us on status changes.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const orderMerchantReference = searchParams.get("OrderMerchantReference");
  const orderNotificationType = searchParams.get("OrderNotificationType");

  if (!orderTrackingId || !orderMerchantReference) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const token = await getPesapalToken();
    const statusResult = await getPesapalTransactionStatus(token, orderTrackingId);

    // Check if the transaction is completed
    if (statusResult.status_code === 1 || statusResult.payment_status_description === "Completed") {
      await completeOrderAndIssueTickets(orderMerchantReference, orderTrackingId);
      
      return NextResponse.json({ 
        success: true, 
        message: "Status updated and tickets issued",
        OrderTrackingId: orderTrackingId 
      });
    }

    return NextResponse.json({ 
      success: true, 
      message: `Status checked: ${statusResult.payment_status_description}` 
    });
    
  } catch (error: any) {
    console.error("PesaPal IPN Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
