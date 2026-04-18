import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const isBuildPhase = process.env.NEXT_PHASE === 'phase-production-build';

if (isBuildPhase) {
    console.log("[Build Phase] Database client initialized in restricted mode.");
}

/**
 * Robust database initialization for standard Node.js environments (Koyeb/Docker).
 * Uses postgres.js for stable TCP connection pooling with Neon.
 */
const client = postgres(databaseUrl || 'postgres://localhost:5432/build_placeholder', {
  ssl: isBuildPhase ? false : 'require', // Disable SSL check during build if using placeholder
  max: isBuildPhase ? 1 : 10, // Minimize connection pool during build
  idle_timeout: 1,
  connect_timeout: 1,
});

export const db = drizzle(client, { schema });
