
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../lib/db/schema';

/**
 * Maintenance Script: Ensure Database Tables Exist
 * Run with: npx tsx scripts/setup-db.ts
 */
async function setup() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error("❌ DATABASE_URL is not set in your .env file.");
        process.exit(1);
    }

    console.log("⏳ Connecting to database...");
    const client = postgres(url, { ssl: 'require' });
    const db = drizzle(client, { schema });

    try {
        console.log("⏳ Verifying tables...");
        // A simple query to see if the user table exists
        await db.select().from(schema.user).limit(1);
        console.log("✅ Database tables already exist.");
    } catch (error: any) {
        if (error.message.includes('does not exist')) {
            console.log("⚠️ Tables are missing. PLEASE RUN THE FOLLOWING COMMAND LOCALLY:");
            console.log("\n   npx drizzle-kit push\n");
            console.log("This will create all required tables (user, session, account, events, etc.) in your Neon database.");
        } else {
            console.error("❌ Database connection error:", error.message);
        }
    } finally {
        await client.end();
    }
}

setup();
