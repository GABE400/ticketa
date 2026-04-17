import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

/**
 * Robust database initialization for standard Node.js environments (Koyeb/Docker).
 * Uses postgres.js for stable TCP connection pooling with Neon.
 */
if (!databaseUrl && process.env.NODE_ENV === 'production') {
  throw new Error('DATABASE_URL is missing in production environment');
}

// For build-time stability, we only initialize the client if the URL is present
// or if we are in development.
const client = postgres(databaseUrl || 'postgres://localhost:5432/build_placeholder', {
  ssl: 'require',
  max: 10, // Adjust pooling based on resource limits
});

export const db = drizzle(client, { schema });
