
import { NextRequest, NextResponse } from "next/server";
import { getPesapalToken } from "@/lib/pesapal";
import { requireAdmin } from "@/lib/session";

/**
 * Admin Diagnostic Route: Verify PesaPal Configuration
 * Access: /api/debug/verify-payment-configs
 */
export async function GET(request: NextRequest) {
    try {
        // 1. Security check - ensure only admins can run this diagnostic
        try {
            await requireAdmin();
        } catch (e) {
            return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
        }

        const diagnostics = {
            timestamp: new Date().toISOString(),
            environment: {
                nodeEnv: process.env.NODE_ENV,
                isSandbox: process.env.PESAPAL_SANDBOX === 'true',
                siteUrl: process.env.NEXT_PUBLIC_SITE_URL,
            },
            checks: {
                consumerKey: !!process.env.PESAPAL_CONSUMER_KEY,
                consumerSecret: !!process.env.PESAPAL_CONSUMER_SECRET,
                ipnId: !!process.env.PESAPAL_IPN_ID,
            },
            connectivity: {
                status: "starting",
                error: null as string | null,
                tokenObtained: false
            }
        };

        // 2. Perform live connectivity check
        try {
            const token = await getPesapalToken();
            if (token) {
                diagnostics.connectivity.status = "connected";
                diagnostics.connectivity.tokenObtained = true;
            } else {
                diagnostics.connectivity.status = "failed";
                diagnostics.connectivity.error = "Token was null or empty";
            }
        } catch (error: any) {
            diagnostics.connectivity.status = "failed";
            diagnostics.connectivity.error = error.message || "Unknown connectivity error";
        }

        return NextResponse.json(diagnostics);

    } catch (error: any) {
        return NextResponse.json({ 
            error: "Diagnostic execution failed", 
            message: error.message 
        }, { status: 500 });
    }
}
