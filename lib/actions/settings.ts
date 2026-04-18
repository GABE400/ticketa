"use server";

import { db } from "@/lib/db";
import { siteSettings } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

/**
 * Fetches the global site settings.
 * If no settings row exists (e.g., first run), it returns a default object.
 */
export async function getSiteSettings() {
    try {
        const settings = await db.query.siteSettings.findFirst({
            where: eq(siteSettings.id, "global"),
        });

        return settings || {
            id: "global",
            demoVideoUrl: null,
            updatedAt: new Date(),
        };
    } catch (error) {
        console.error("Error fetching site settings:", error);
        return {
            id: "global",
            demoVideoUrl: null,
            updatedAt: new Date(),
        };
    }
}

/**
 * Updates the global site settings.
 * Only accessible by admins.
 */
export async function updateSiteSettings(demoVideoUrl: string | null) {
    await requireAdmin();

    try {
        // Upsert logic: check if exists, then update or insert
        const existing = await db.query.siteSettings.findFirst({
            where: eq(siteSettings.id, "global"),
        });

        if (existing) {
            await db.update(siteSettings)
                .set({ 
                    demoVideoUrl,
                    updatedAt: new Date()
                })
                .where(eq(siteSettings.id, "global"));
        } else {
            await db.insert(siteSettings)
                .values({
                    id: "global",
                    demoVideoUrl,
                    updatedAt: new Date()
                });
        }

        revalidatePath("/admin/settings");
        revalidatePath("/"); // Revalidate landing page
        return { success: true };
    } catch (error: any) {
        console.error("Error updating site settings:", error);
        return { success: false, error: error.message || "Failed to update settings" };
    }
}
