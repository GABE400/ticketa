import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;
const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

if (isBuildPhase) {
    console.log("[Build Phase] Database client initialized in restricted mode.");
}

/**
 * Robust database initialization for standard Node.js environments (Koyeb/Docker).
 * Uses postgres.js for stable TCP connection pooling with Neon.
 */
const client = postgres(databaseUrl || 'postgres://localhost:5432/build_placeholder', {
  ssl: isBuildPhase ? false : 'require', 
  max: isBuildPhase ? 1 : 10,
});

// Runtime connectivity check for production logging
if (!isBuildPhase) {
    client`SELECT 1`.then(() => console.log("✅ Database connection verified (Runtime)"))
                 .catch((e) => console.error("❌ Database connection failed (Runtime):", e.message));
}

export const db = drizzle(client, { schema });
