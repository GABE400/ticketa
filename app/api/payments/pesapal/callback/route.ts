import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, tickets, ticketTypes } from "@/lib/db/schema";
import { getPesapalToken, getPesapalTransactionStatus } from "@/lib/pesapal";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const orderMerchantReference = searchParams.get("OrderMerchantReference");

  if (!orderTrackingId || !orderMerchantReference) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    const token = await getPesapalToken();
    const statusResult = await getPesapalTransactionStatus(token, orderTrackingId);

    // If payment is successful (PesaPal v3 usually returns status_code 1 for success)
    if (statusResult.status_code === 1 || statusResult.payment_status_description === "Completed") {
      
      const { completeOrderAndIssueTickets } = await import("@/lib/actions/orders-completion");
      await completeOrderAndIssueTickets(orderMerchantReference, orderTrackingId);

      return NextResponse.redirect(new URL("/tickets?success=true", request.url));
    }

    return NextResponse.redirect(new URL("/tickets?error=payment_failed", request.url));
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(new URL("/tickets?error=processing_error", request.url));
  }
}
