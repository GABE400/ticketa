import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

/**
 * Robust database initialization for standard Node.js environments (Koyeb/Docker).
 * Uses postgres.js for stable TCP connection pooling with Neon.
 */
// During the Next.js build phase on Koyeb, DATABASE_URL is often missing.
// We allow the module to initialize with a placeholder to prevent build-time crashes.
// Connection errors will only occur if a query is actually attempted at runtime without a valid URL.
const client = postgres(databaseUrl || 'postgres://localhost:5432/build_placeholder', {
  ssl: 'require',
  max: 10, // Adjust pooling based on resource limits
});

export const db = drizzle(client, { schema });
