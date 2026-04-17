import { auth } from "./auth"
import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins"

export const authClient = createAuthClient<typeof auth>({
    baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || (typeof window !== "undefined" ? window.location.origin : (process.env.BETTER_AUTH_URL || "http://localhost:3000")),
    plugins: [
        magicLinkClient(),
    ],
})
