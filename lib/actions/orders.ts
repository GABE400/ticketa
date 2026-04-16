"use server";

import { db } from "@/lib/db";
import { orders, tickets, ticketTypes } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { getPesapalToken, registerPesapalOrder } from "@/lib/pesapal";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { calculateOrderFees } from "@/lib/fees";

const checkoutSchema = z.object({
  ticketTypeId: z.string(),
  quantity: z.number().min(1).max(10),
});

export async function initiateCheckout(data: z.infer<typeof checkoutSchema>) {
  const session = await requireAuth();
  const { ticketTypeId, quantity } = checkoutSchema.parse(data);

  // 1. Fetch ticket type and event info
  const ticketType = await db.query.ticketTypes.findFirst({
    where: (tt, { eq }) => eq(tt.id, ticketTypeId),
    with: {
      event: true,
    },
  });

  if (!ticketType) throw new Error("Ticket type not found");
  if (ticketType.sold + quantity > ticketType.capacity) {
    throw new Error("Not enough tickets available");
  }

  const { subtotal, serviceFee, totalAmount, commissionAmount, netAmount } = calculateOrderFees(parseFloat(ticketType.price), quantity);
  const orderId = uuidv4();

  // 2. Create pending order in DB
  await db.insert(orders).values({
    id: orderId,
    userId: session.user.id,
    subtotal: subtotal.toString(),
    serviceFee: serviceFee.toString(),
    commissionAmount: commissionAmount.toString(),
    netAmount: netAmount.toString(),
    amount: totalAmount.toString(), // Final total paid by buyer
    status: "pending",
    ticketTypeId,
    quantity,
  });

  // 3. Initiate PesaPal
  const pToken = await getPesapalToken();
  const pesapalResponse = await registerPesapalOrder(pToken, {
    id: orderId,
    amount: totalAmount,
    currency: "ZMW",
    description: `Ticket Purchase: ${ticketType.event.title} (${quantity} tickets)`,
    callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/payments/pesapal/callback`,
    notification_id: process.env.PESAPAL_IPN_ID!,
    billing_address: {
      email_address: session.user.email,
      first_name: session.user.name.split(" ")[0],
      last_name: session.user.name.split(" ")[1] || "",
    },
  });

  if (pesapalResponse.redirect_url) {
    return { success: true, redirectUrl: pesapalResponse.redirect_url };
  } else {
    throw new Error("Failed to initiate PesaPal payment");
  }
}
