import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool } from '@neondatabase/serverless';
import * as schema from './schema';

const databaseUrl = process.env.DATABASE_URL;

/**
 * Build-safe database initialization.
 * During the Next.js build phase, DATABASE_URL may be missing.
 * We use a proxy or a dummy connection to prevent the build from crashing
 * while allowing the site to statically optimize non-DB routes.
 */
const pool = new Pool({ 
  connectionString: databaseUrl || 'postgres://localhost:5432/build_placeholder' 
});

export const db = drizzle(pool, { schema });
