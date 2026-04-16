import { db } from "../lib/db/index.ts";
import { user } from "../lib/db/schema.ts";
import { eq } from "drizzle-orm";

/**
 * QUICK FIX SCRIPT
 * Usage: npx ts-node scripts/fix-role.ts [user_email]
 * This script will manually update a user's role to 'organizer' in the database.
 */

async function fixRole(email: string) {
  console.log(`🚀 Updating role for: ${email}...`);
  
  try {
    const result = await db.update(user)
      .set({ role: "organizer" })
      .where(eq(user.email, email))
      .returning();

    if (result.length > 0) {
      console.log(`✅ Success! ${email} is now an organizer.`);
    } else {
      console.log(`❌ Error: User with email ${email} not found.`);
    }
  } catch (error) {
    console.error(`❌ Failed to update role:`, error);
  }
}

const email = process.argv[2];
if (!email) {
  console.log("Please provide an email: npx ts-node scripts/fix-role.ts email@example.com");
  process.exit(1);
}

fixRole(email);
