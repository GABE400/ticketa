import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "./db";
import { user as userTable } from "./db/schema";
import { eq } from "drizzle-orm";

export async function getSession() {
    return await auth.api.getSession({
        headers: await headers()
    });
}

export async function requireAuth() {
    const session = await getSession();
    if (!session) {
        redirect("/");
    }
    return session;
}

export async function requireOrganizer() {
    const session = await getSession();
    
    if (!session) {
        redirect("/");
    }

    // Direct DB check to bypass session caching issues
    const dbUser = await db.query.user.findFirst({
        where: eq(userTable.id, session.user.id)
    });

    if (!dbUser || (dbUser.role !== "organizer" && dbUser.role !== "admin")) {
        redirect("/");
    }

    return session;
}

export async function requireAdmin() {
    const session = await getSession();
    
    if (!session) {
        redirect("/");
    }

    // Direct DB check for role security
    const dbUser = await db.query.user.findFirst({
        where: eq(userTable.id, session.user.id)
    });

    if (!dbUser || dbUser.role !== "admin") {
        redirect("/");
    }

    return session;
}
