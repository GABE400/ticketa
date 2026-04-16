
"use server";

import { db } from "@/lib/db";
import { orders, user as userTable, events, ticketTypes } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function getAdminStats() {
    await requireAdmin();

    const stats = await db.transaction(async (tx) => {
        // 1. Total Volume (Gross Sales)
        const totalVolumeResult = await tx.select({ 
            value: sql<number>`sum(CAST(${orders.subtotal} AS DECIMAL))` 
        }).from(orders).where(eq(orders.status, "paid"));
        
        // 2. Platform Revenue (Service Fees from Buyers)
        const totalServiceFeesResult = await tx.select({ 
            value: sql<number>`sum(CAST(${orders.serviceFee} AS DECIMAL))` 
        }).from(orders).where(eq(orders.status, "paid"));

        // 3. Platform Revenue (Commissions from Organizers)
        const totalCommissionsResult = await tx.select({ 
            value: sql<number>`sum(CAST(${orders.commissionAmount} AS DECIMAL))` 
        }).from(orders).where(eq(orders.status, "paid"));

        // 4. Total Payouts (Net amount for Organizers)
        const totalNetPayoutsResult = await tx.select({ 
            value: sql<number>`sum(CAST(${orders.netAmount} AS DECIMAL))` 
        }).from(orders).where(eq(orders.status, "paid"));

        // 5. User Counts
        const totalUsers = await tx.select({ count: sql<number>`count(*)` }).from(userTable);
        const organizers = await tx.select({ count: sql<number>`count(*)` }).from(userTable).where(eq(userTable.role, "organizer"));

        // 6. Content Counts
        const activeEvents = await tx.select({ count: sql<number>`count(*)` }).from(events).where(eq(events.status, "published"));

        const serviceFees = Number(totalServiceFeesResult[0]?.value || 0);
        const commissions = Number(totalCommissionsResult[0]?.value || 0);

        return {
            totalVolume: Number(totalVolumeResult[0]?.value || 0),
            totalFeesCollected: serviceFees,
            totalCommissions: commissions,
            platformProfit: serviceFees + commissions,
            totalPendingPayouts: Number(totalNetPayoutsResult[0]?.value || 0),
            userCount: Number(totalUsers[0]?.count || 0),
            organizerCount: Number(organizers[0]?.count || 0),
            eventCount: Number(activeEvents[0]?.count || 0),
        };
    });

    return stats;
}

export async function getAllUsers() {
    await requireAdmin();
    return await db.query.user.findMany({
        orderBy: [desc(userTable.createdAt)],
    });
}

export async function updateUserRole(userId: string, role: "buyer" | "organizer" | "admin") {
    await requireAdmin();
    
    await db.update(userTable)
        .set({ role })
        .where(eq(userTable.id, userId));

    revalidatePath("/admin/users");
    return { success: true };
}

export async function getRecentOrders() {
    await requireAdmin();
    return await db.query.orders.findMany({
        where: eq(orders.status, "paid"),
        with: {
            buyer: true,
            ticketType: {
                with: {
                    event: true
                }
            }
        },
        limit: 10,
        orderBy: [desc(orders.createdAt)],
    });
}

export async function getPendingPayouts() {
    await requireAdmin();

    const result = await db.execute(sql`
        SELECT 
            u.id as organizer_id,
            u.name as name,
            u.email as email,
            u.image as image,
            u.payout_details as payout_details,
            SUM(CAST(o.net_amount AS DECIMAL)) as balance,
            COUNT(o.id) as count
        FROM orders o
        JOIN ticket_types tt ON o.ticket_type_id = tt.id
        JOIN events e ON tt.event_id = e.id
        JOIN "user" u ON e.organizer_id = u.id
        WHERE o.status = 'paid' AND o.payout_status = 'pending'
        GROUP BY u.id, u.name, u.email, u.image, u.payout_details
        ORDER BY balance DESC
    `);

    return (result as any).rows || result || [];
}

import { sendSettlementNotification } from "@/lib/email";

export async function processOrganizerPayout(organizerId: string) {
    await requireAdmin();

    // 1. Get total balance and user info before clearing it
    const summary = await db.execute(sql`
        SELECT 
            u.id, u.name, u.email,
            SUM(CAST(o.net_amount AS DECIMAL)) as total
        FROM "user" u
        JOIN events e ON e.organizer_id = u.id
        JOIN ticket_types tt ON tt.event_id = e.id
        JOIN orders o ON o.ticket_type_id = tt.id
        WHERE u.id = ${organizerId}
        AND o.status = 'paid'
        AND o.payout_status = 'pending'
        GROUP BY u.id, u.name, u.email
    `);

    const adminStats = (summary as any).rows?.[0] || summary?.[0];

    // 2. Mark all 'paid' and 'pending' payout orders for this organizer as 'completed'
    await db.execute(sql`
        UPDATE orders
        SET payout_status = 'completed', payout_date = NOW()
        WHERE id IN (
            SELECT o.id 
            FROM orders o
            JOIN ticket_types tt ON o.ticket_type_id = tt.id
            JOIN events e ON tt.event_id = e.id
            WHERE e.organizer_id = ${organizerId}
            AND o.status = 'paid'
            AND o.payout_status = 'pending'
        )
    `);

    // 3. Send notification if we have valid data
    if (adminStats && adminStats.email) {
        await sendSettlementNotification({
            user: { name: adminStats.name, email: adminStats.email },
            amount: Number(adminStats.total),
            date: new Date()
        });
    }

    revalidatePath("/admin/payouts");
    revalidatePath("/admin");
    return { success: true };
}

export async function syncHistoricalData() {
    await requireAdmin();

    console.log("🚀 Starting financial data backfill...");

    // 1. Find all 'paid' orders where subtotal is still "0.00"
    const missingDataOrders = await db.query.orders.findMany({
        where: and(
            eq(orders.status, "paid"),
            sql`${orders.subtotal} = '0.00'`
        )
    });

    if (missingDataOrders.length === 0) {
        return { success: true, count: 0 };
    }

    console.log(`📦 Found ${missingDataOrders.length} orders to synchronize...`);

    for (const order of missingDataOrders) {
        // For older orders, we assume subtotal = amount (no service fee was charged yet)
        await db.update(orders)
            .set({
                subtotal: order.amount,
                serviceFee: "0.00",
                commissionAmount: "0.00",
                netAmount: order.amount,
            })
            .where(eq(orders.id, order.id));
    }

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    
    return { success: true, count: missingDataOrders.length };
}
