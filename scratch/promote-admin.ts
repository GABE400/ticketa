
import "dotenv/config";
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './lib/db/schema';
import { eq } from "drizzle-orm";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function promoteFirstAdmin() {
  const email = process.argv[2];
  if (!email) {
    console.error("Please provide an email address as the first argument.");
    process.exit(1);
  }

  const targetUser = await db.query.user.findFirst({
    where: eq(schema.user.email, email),
  });

  if (!targetUser) {
    console.error(`User with email ${email} not found.`);
    process.exit(1);
  }

  await db.update(schema.user)
    .set({ role: "admin" })
    .where(eq(schema.user.id, targetUser.id));

  console.log(`Successfully promoted ${email} to ADMIN.`);
  process.exit(0);
}

promoteFirstAdmin().catch(console.error);
