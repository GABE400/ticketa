import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handler = toNextJsHandler(auth);

export async function GET(request: Request) {
    try {
        return await handler.GET!(request);
    } catch (error: any) {
        console.error("[Auth GET Error]", error.message, error.stack);
        return new Response(JSON.stringify({ 
            error: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    }
}

export async function POST(request: Request) {
    try {
        return await handler.POST!(request);
    } catch (error: any) {
        console.error("[Auth POST Error]", error.message, error.stack);
        return new Response(JSON.stringify({ 
            error: error.message,
            stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
        }), { 
            status: 500, 
            headers: { "Content-Type": "application/json" } 
        });
    }
}