"use server";

import { db } from "@/lib/db";
import { requireAuth } from "@/lib/session";

export async function getUserTickets() {
    const session = await requireAuth();
    
    return await db.query.tickets.findMany({
        where: (tickets, { eq }) => eq(tickets.userId, session.user.id),
        with: {
            ticketType: {
                with: {
                    event: true
                }
            }
        },
        orderBy: (tickets, { desc }) => [desc(tickets.createdAt)],
    });
}
