import { db } from "@/lib/db";
import { user, ticketTypes, events } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { completeOrderAndIssueTickets } from "@/lib/actions/orders-completion";
import { orders } from "@/lib/db/schema";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const userData = await db.query.user.findFirst({
      where: eq(user.email, email),
    });

    if (!userData) {
      return NextResponse.json({ error: "User not found. Sign up first." }, { status: 404 });
    }

    // 1. Find a ticket type to use (ideally from our seed)
    const ticketType = await db.query.ticketTypes.findFirst();

    if (!ticketType) {
      return NextResponse.json({ error: "No ticket types found in DB. Please run seed-event first." }, { status: 404 });
    }

    const orderId = uuidv4();

    // 2. Create a dummy PAID order
    await db.insert(orders).values({
        id: orderId,
        userId: userData.id,
        amount: "0.00",
        status: "pending", // Start as pending
        ticketTypeId: ticketType.id,
        quantity: 1
    });

    // 3. Issue the tickets immediately via our engine
    await completeOrderAndIssueTickets(orderId, "DEBUG_BYPASS_PAYMENT");

    return NextResponse.json({ 
      success: true, 
      message: "Generated 1 test ticket successfully!",
      hint: "Check the 'My Tickets' page to see your pass."
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
