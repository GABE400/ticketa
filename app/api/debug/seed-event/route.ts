import { db } from "@/lib/db";
import { events, ticketTypes, user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

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
      return NextResponse.json({ error: "User not found. Please sign up first." }, { status: 404 });
    }

    // Ensure they are an organizer for the seed to work correctly
    if (userData.role !== "organizer") {
      await db.update(user).set({ role: "organizer" }).where(eq(user.id, userData.id));
    }

    const eventId = uuidv4();
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    
    const dayAfter = new Date(tomorrow);
    dayAfter.setHours(tomorrow.getHours() + 6);

    await db.transaction(async (tx) => {
      // 1. Create the Featured Event
      await tx.insert(events).values({
        id: eventId,
        organizerId: userData.id,
        title: "Techno Night: Neon Dreams 2026",
        description: "Join us for an immersive audio-visual journey through the deepest realms of melodic techno. Featuring multi-sensory laser arrays and 360-degree spatial audio.",
        location: "Alchemist District, Nairobi",
        startTime: tomorrow,
        endTime: dayAfter,
        imageUrl: "https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&q=80&w=2076",
        category: "Music",
        status: "published",
      });

      // 2. Create Ticket Types
      await tx.insert(ticketTypes).values([
        {
          id: uuidv4(),
          eventId: eventId,
          name: "Standard Pass",
          price: "25.00",
          capacity: 500,
          sold: 12,
        },
        {
          id: uuidv4(),
          eventId: eventId,
          name: "VIP Backstage",
          price: "75.00",
          capacity: 50,
          sold: 5,
        }
      ]);
    });

    return NextResponse.json({ 
      success: true, 
      message: "Seeded 'Neon Dreams' event successfully!",
      eventId: eventId,
      hint: "Go back to the homepage to see it!"
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
