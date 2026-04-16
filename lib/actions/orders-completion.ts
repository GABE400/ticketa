import { db } from "@/lib/db";
import { orders, tickets, ticketTypes } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { sendBookingConfirmation } from "@/lib/email";
import { generateSignedToken } from "@/lib/qr";

/**
 * Robustly issues tickets for a completed order.
 * Handles database transactions, inventory updates, and ensures idempotency.
 */
export async function completeOrderAndIssueTickets(orderId: string, trackingId: string) {
  const result = await db.transaction(async (tx) => {
    // 1. Fetch the order with all metadata needed for the receipt
    const order = await tx.query.orders.findFirst({
      where: eq(orders.id, orderId),
      with: {
        ticketType: {
          with: {
            event: true
          }
        },
        buyer: true,
      },
    });

    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    // 2. Idempotency Check
    if (order.status === "paid") {
      return { success: true, alreadyProcessed: true };
    }

    // 3. Update Order Status
    await tx.update(orders)
      .set({ 
        status: "paid", 
        pesapalOrderTrackingId: trackingId 
      })
      .where(eq(orders.id, orderId));

    // 4. Generate the tickets with SIGNED QR data
    const quantity = order.quantity || 1;
    const ticketsToCreate = [];

    for (let i = 0; i < quantity; i++) {
        const ticketId = uuidv4();
        ticketsToCreate.push({
            id: ticketId,
            userId: order.userId,
            ticketTypeId: order.ticketTypeId!,
            qrData: generateSignedToken(ticketId), // High security signed token
            status: "active" as const,
        });
    }

    await tx.insert(tickets).values(ticketsToCreate);

    // 5. Update Sold Count on Ticket Type
    await tx.update(ticketTypes)
      .set({ 
        sold: sql`${ticketTypes.sold} + ${quantity}` 
      })
      .where(eq(ticketTypes.id, order.ticketTypeId!));

    return { 
      success: true, 
      quantity,
      emailData: {
        order,
        event: order.ticketType.event,
        user: order.buyer,
        quantity
      }
    };
  });

  // 6. Trigger Email Notification (Outside transaction)
  if (result.success && !result.alreadyProcessed && result.emailData) {
    try {
      await sendBookingConfirmation(result.emailData);
    } catch (error) {
      console.error("Failed to send booking confirmation email:", error);
      // We don't throw here to avoid failing the whole request after payment success
    }
  }

  return result;
}
