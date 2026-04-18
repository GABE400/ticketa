
import { NextRequest, NextResponse } from "next/server";
import { headers as nextHeaders } from "next/headers";

/**
 * Diagnostic Route: Inspect Headers and Environment for Auth Debugging
 * Access: /api/debug/inspect-env
 */
export async function GET(request: NextRequest) {
    const headersList = await nextHeaders();
    const headers: Record<string, string> = {};
    headersList.forEach((value, key) => {
        headers[key] = value;
    });

    const env = {
        BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
        KOYEB_PUBLIC_DOMAIN: process.env.KOYEB_PUBLIC_DOMAIN,
        NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
        NODE_ENV: process.env.NODE_ENV,
    };

    const origin = headersList.get("origin");
    const host = headersList.get("host");
    const forwardedHost = headersList.get("x-forwarded-host");
    const forwardedProto = headersList.get("x-forwarded-proto");

    return NextResponse.json({
        timestamp: new Date().toISOString(),
        request: {
            url: request.url,
            origin,
            host,
            forwardedHost,
            forwardedProto,
        },
        env,
        headers, // Optional: filter if too many sensitive ones
    });
}
