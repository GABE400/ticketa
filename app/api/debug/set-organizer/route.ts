import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

/**
 * DEBUG ROUTE: Manually set a user role to organizer
 * Usage: GET /api/debug/set-organizer?email=user@example.com
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const result = await db.update(user)
      .set({ role: "organizer" })
      .where(eq(user.email, email))
      .returning();

    if (result.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: `${email} is now an organizer`,
        user: result[0]
      });
    } else {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
