"use server";

import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { requireAuth } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { z } from "zod";

export async function becomeOrganizerAction() {
  const session = await requireAuth();
  
  try {
    await db.update(user)
      .set({ role: "organizer" })
      .where(eq(user.id, session.user.id));

    revalidatePath("/");
    revalidatePath("/dashboard");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

const payoutSchema = z.discriminatedUnion("method", [
  z.object({
    method: z.literal("bank_transfer"),
    bankName: z.string().min(2),
    accName: z.string().min(2),
    accNumber: z.string().min(5),
  }),
  z.object({
    method: z.literal("mobile_money"),
    provider: z.enum(["airtel", "mtn", "zamtel"]),
    phone: z.string().min(10),
  }),
]);

export async function updatePayoutSettings(data: z.infer<typeof payoutSchema>) {
  const session = await requireAuth();
  const validated = payoutSchema.parse(data);

  try {
    await db.update(user)
      .set({ 
        payoutMethod: validated.method,
        payoutDetails: validated
      })
      .where(eq(user.id, session.user.id));

    revalidatePath("/dashboard/settings");
    revalidatePath("/admin/payouts");
    
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
