"use server";

import { db } from "@/lib/db";
import { tickets, ticketTypes, events } from "@/lib/db/schema";
import { requireOrganizer } from "@/lib/session";
import { verifySignedToken } from "@/lib/qr";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function validateTicketAction(token: string, eventId: string) {
  const session = await requireOrganizer();
  
  // 1. Verify the signature and rotating timestamp
  const decoded = verifySignedToken(token);
  if (!decoded) {
    return { 
      success: false, 
      error: "Invalid or expired QR code. Please ask the guest to refresh their ticket." 
    };
  }

  const { ticketId } = decoded;

  // 2. Fetch ticket with relations to verify event ownership
  const ticket = await db.query.tickets.findFirst({
    where: eq(tickets.id, ticketId),
    with: {
      ticketType: {
        with: {
          event: true
        }
      },
      buyer: true
    }
  });

  if (!ticket) {
    return { success: false, error: "Ticket not found in database." };
  }

  // 3. Security: Ensure the ticket belongs to the current event
  if (ticket.ticketType.event.id !== eventId) {
    return { success: false, error: "This ticket is for a different event." };
  }

  // 4. Security: Ensure the current user (organizer) owns this event
  if (ticket.ticketType.event.organizerId !== session.user.id) {
    return { success: false, error: "Unauthorized: You are not the organizer for this event." };
  }

  // 5. Check if already used
  if (ticket.status === "used") {
    return { 
      success: false, 
      error: "This ticket has already been used.",
      checkedInAt: ticket.createdAt // Ideally we'd have a usedAt field
    };
  }

  // 6. Mark as used
  try {
    await db.update(tickets)
      .set({ status: "used" })
      .where(eq(tickets.id, ticketId));

    revalidatePath(`/dashboard/events/${eventId}/scan`);
    
    return { 
      success: true, 
      message: "Ticket validated successfully!",
      guest: ticket.buyer.name,
      tier: ticket.ticketType.name
    };
  } catch (err) {
    return { success: false, error: "Failed to update ticket status." };
  }
}
