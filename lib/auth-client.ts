import { auth } from "./auth"
import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins"

export const authClient = createAuthClient<typeof auth>({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    plugins: [
        magicLinkClient(),
    ],
})
