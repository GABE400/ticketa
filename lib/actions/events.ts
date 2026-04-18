"use server";

import { db } from "@/lib/db";
import { events, ticketTypes } from "@/lib/db/schema";
import { requireOrganizer } from "@/lib/session";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { eq, and, sql } from "drizzle-orm";
import { orders } from "@/lib/db/schema";

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  location: z.string().min(3),
  startTime: z.string(), // ISO string from client
  endTime: z.string(),
  imageUrl: z.string().url().optional().or(z.literal("")),
  galleryImages: z.array(z.string().url()).optional().default([]),
  socialLinks: z.object({
    instagram: z.string().optional(),
    x: z.string().optional(),
    tikTok: z.string().optional(),
    website: z.string().optional(),
  }).optional().default({}),
  locationLat: z.number().optional().nullable(),
  locationLng: z.number().optional().nullable(),
  category: z.string(),
  ticketTypes: z.array(z.object({
    name: z.string(),
    price: z.number().min(0),
    capacity: z.number().min(1),
  })).min(1),
});

export async function createEvent(formData: z.infer<typeof eventSchema>) {
  const session = await requireOrganizer();
  
  const validated = eventSchema.parse(formData);
  
  const eventId = uuidv4();
  
  await db.transaction(async (tx) => {
    // 1. Create the event
    await tx.insert(events).values({
      id: eventId,
      organizerId: session.user.id,
      title: validated.title,
      description: validated.description,
      location: validated.location,
      startTime: new Date(validated.startTime),
      endTime: new Date(validated.endTime),
      imageUrl: validated.imageUrl,
      galleryImages: validated.galleryImages,
      socialLinks: validated.socialLinks,
      locationLat: validated.locationLat,
      locationLng: validated.locationLng,
      category: validated.category,
    });

    // 2. Create ticket types
    if (validated.ticketTypes.length > 0) {
      await tx.insert(ticketTypes).values(
        validated.ticketTypes.map(tt => ({
          id: uuidv4(),
          eventId: eventId,
          name: tt.name,
          price: tt.price.toString(), // Decimal in DB
          capacity: tt.capacity,
        }))
      );
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath(`/events/${eventId}`);
  
  return { success: true, eventId };
}

export async function updateEvent(eventId: string, formData: z.infer<typeof eventSchema>) {
  const session = await requireOrganizer();
  
  // Verify ownership
  const existing = await db.query.events.findFirst({
    where: (events, { eq, and }) => and(eq(events.id, eventId), eq(events.organizerId, session.user.id))
  });

  if (!existing) {
    throw new Error("Event not found or unauthorized");
  }

  const validated = eventSchema.parse(formData);

  await db.transaction(async (tx) => {
    // 1. Update the event
    await tx.update(events).set({
      title: validated.title,
      description: validated.description,
      location: validated.location,
      startTime: new Date(validated.startTime),
      endTime: new Date(validated.endTime),
      imageUrl: validated.imageUrl,
      galleryImages: validated.galleryImages,
      socialLinks: validated.socialLinks,
      locationLat: validated.locationLat,
      locationLng: validated.locationLng,
      category: validated.category,
      updatedAt: new Date(),
    }).where(eq(events.id, eventId));

    // 2. Update ticket types (Simple Strategy: Delete and Re-create)
    // First, delete existing ticket types for this event
    await tx.delete(ticketTypes).where(eq(ticketTypes.eventId, eventId));

    // Then, insert the new ones
    if (validated.ticketTypes.length > 0) {
      await tx.insert(ticketTypes).values(
        validated.ticketTypes.map(tt => ({
          id: uuidv4(),
          eventId: eventId,
          name: tt.name,
          price: tt.price.toString(),
          capacity: tt.capacity,
        }))
      );
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/");
  revalidatePath(`/events/${eventId}`);
  
  return { success: true, eventId };
}

export async function deleteEvent(eventId: string) {
  const session = await requireOrganizer();
  
  // Verify ownership
  const existing = await db.query.events.findFirst({
    where: (events, { eq, and }) => and(eq(events.id, eventId), eq(events.organizerId, session.user.id))
  });

  if (!existing) {
    throw new Error("Event not found or unauthorized");
  }

  await db.transaction(async (tx) => {
    // Delete ticket types first
    await tx.delete(ticketTypes).where(eq(ticketTypes.eventId, eventId));
    // Delete the event
    await tx.delete(events).where(eq(events.id, eventId));
  });

  revalidatePath("/dashboard");
  revalidatePath("/");
  
  return { success: true };
}

export async function getEvents() {
  if (process.env.NEXT_PHASE === 'phase-production-build') {
    return [];
  }
  
  return await db.query.events.findMany({
    with: {
      organizer: true,
      ticketTypes: true,
    },
    orderBy: (events, { desc }) => [desc(events.createdAt)],
  });
}

export async function getOrganizerEvents() {
  const session = await requireOrganizer();
  
  return await db.transaction(async (tx) => {
    // 1. Fetch events
    const initialEvents = await tx.query.events.findMany({
      where: (events, { eq }) => eq(events.organizerId, session.user.id),
      with: {
        ticketTypes: true,
      },
      orderBy: (events, { desc }) => [desc(events.createdAt)],
    });

    // 2. Aggregate stats from orders table for parity with admin
    const statsResult = await tx.execute(sql`
      SELECT 
        COALESCE(SUM(CAST(o.subtotal AS DECIMAL)), 0) as total_revenue,
        COALESCE(SUM(CAST(o.net_amount AS DECIMAL)), 0) as total_net_payout,
        COALESCE(SUM(o.quantity), 0) as total_sold
      FROM orders o
      JOIN ticket_types tt ON o.ticket_type_id = tt.id
      JOIN events e ON tt.event_id = e.id
      WHERE e.organizer_id = ${session.user.id}
      AND o.status = 'paid'
    `);

    // The result from execute is an array of rows
    const stats = (statsResult as any).rows?.[0] || statsResult[0] || { total_revenue: 0, total_net_payout: 0, total_sold: 0 };

    return {
      events: initialEvents,
      totalRevenue: Number(stats.total_revenue || stats.total_revenue),
      totalNetPayout: Number(stats.total_net_payout || stats.total_net_payout),
      totalTicketsSold: Number(stats.total_sold || stats.total_sold),
    };
  });
}
