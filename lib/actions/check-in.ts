
"use server";

import { db } from "@/lib/db";
import { tickets, events, ticketTypes, user as userTable } from "@/lib/db/schema";
import { requireOrganizer } from "@/lib/session";
import { verifySignedToken } from "@/lib/qr";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function verifyAndCheckInTicket(token: string) {
    const session = await requireOrganizer();
    
    // 1. Decrypt/Verify the token
    const decoded = verifySignedToken(token);
    if (!decoded) {
        return { success: false, error: "Invalid or expired ticket security token." };
    }

    const { ticketId } = decoded;

    // 2. Fetch ticket with event and organizer data
    const ticketData = await db.query.tickets.findFirst({
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

    if (!ticketData) {
        return { success: false, error: "Ticket not found in central registry." };
    }

    // 3. Authorization: Is this user allowed to check-in for this event?
    // Admins can check-in for anything. Organizers only for their own events.
    const isOwner = ticketData.ticketType.event.organizerId === session.user.id;
    const isAdmin = session.user.role === 'admin';

    if (!isOwner && !isAdmin) {
        return { success: false, error: "Unauthorized: You are not a staff member for this event." };
    }

    // 4. Status Validation
    if (ticketData.status === 'used') {
        return { 
            success: false, 
            error: "TICKET ALREADY USED", 
            attendee: ticketData.buyer.name,
            checkedInAt: (ticketData as any).updatedAt // If we tracked it, but let's just say used
        };
    }

    if (ticketData.status === 'cancelled') {
        return { success: false, error: "Ticket has been voided or cancelled." };
    }

    // 5. Success! Mark as Used
    await db.update(tickets)
        .set({ status: 'used' })
        .where(eq(tickets.id, ticketId));

    revalidatePath("/admin/check-in");
    revalidatePath("/tickets");

    return { 
        success: true, 
        message: "Check-in successful!",
        attendee: ticketData.buyer.name,
        ticketType: ticketData.ticketType.name,
        eventTitle: ticketData.ticketType.event.title
    };
}
