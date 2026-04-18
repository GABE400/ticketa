import { NextRequest, NextResponse } from "next/server";

/**
 * Diagnostic Route: Test auth configuration without actually logging in
 * Access: /api/debug/auth-check
 * 
 * This will tell us EXACTLY what's wrong with the auth setup in production.
 */
export async function GET(request: NextRequest) {
    const results: Record<string, any> = {
        timestamp: new Date().toISOString(),
        checks: {},
    };

    // 1. Check environment variables
    results.checks.env = {
        BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? `SET (${process.env.BETTER_AUTH_SECRET.length} chars)` : "❌ MISSING",
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "❌ MISSING",
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "❌ MISSING",
        DATABASE_URL: process.env.DATABASE_URL ? `SET (starts with ${process.env.DATABASE_URL.substring(0, 20)}...)` : "❌ MISSING",
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ? `SET (${process.env.GOOGLE_CLIENT_ID.substring(0, 10)}...)` : "❌ MISSING",
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? `SET (${process.env.GOOGLE_CLIENT_SECRET.length} chars)` : "❌ MISSING",
        NODE_ENV: process.env.NODE_ENV,
    };

    // 2. Test database connection
    try {
        const { db } = await import("@/lib/db");
        const result = await db.execute(
            // @ts-ignore - raw SQL for diagnostics
            { sql: "SELECT 1 as test", params: [] }
        );
        results.checks.database = "✅ Connected";
    } catch (e: any) {
        // Try alternative approach
        try {
            const postgres = (await import("postgres")).default;
            const sql = postgres(process.env.DATABASE_URL!, { ssl: 'require', max: 1 });
            await sql`SELECT 1`;
            await sql.end();
            results.checks.database = "✅ Connected (direct)";
        } catch (e2: any) {
            results.checks.database = `❌ FAILED: ${e2.message}`;
        }
    }

    // 3. Test auth import
    try {
        const { auth } = await import("@/lib/auth");
        results.checks.authImport = "✅ Auth module loaded successfully";
        results.checks.authOptions = {
            hasSecret: !!auth.options?.secret,
            baseURL: auth.options?.baseURL,
        };
    } catch (e: any) {
        results.checks.authImport = `❌ FAILED: ${e.message}`;
        results.checks.authStack = e.stack?.split("\n").slice(0, 5);
    }

    // 4. Test a real auth handler call (sign-in/email)
    try {
        const { auth } = await import("@/lib/auth");
        // Create a minimal test request
        const testUrl = new URL("/api/auth/ok", request.url);
        const testRequest = new Request(testUrl.toString(), {
            method: "GET",
        });
        const response = await auth.handler(testRequest);
        results.checks.authHandler = {
            status: response.status,
            ok: response.ok,
        };
    } catch (e: any) {
        results.checks.authHandler = `❌ Handler crashed: ${e.message}`;
        results.checks.authHandlerStack = e.stack?.split("\n").slice(0, 5);
    }

    return NextResponse.json(results, { status: 200 });
}
