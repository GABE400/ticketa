import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink } from "better-auth/plugins";
import { db } from "./db";
import * as schema from "./db/schema";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            ...schema,
        },
    }),
    user: {
        additionalFields: {
            role: {
                type: "string",
                defaultValue: "buyer",
            },
        },
    },
    emailAndPassword: {
        enabled: true,
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID || "build_placeholder",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "build_placeholder",
        },
        github: {
            clientId: process.env.GITHUB_CLIENT_ID || "build_placeholder",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "build_placeholder",
        },
    },
    secret: process.env.BETTER_AUTH_SECRET || "build_placeholder_secret_min_32_characters_long",
    baseURL: process.env.BETTER_AUTH_URL || (process.env.NODE_ENV === 'production' ? `https://${process.env.KOYEB_PUBLIC_DOMAIN}` : "http://localhost:3000"),
    plugins: [
        magicLink({
            sendMagicLink: async ({ email, url }, ctx) => {
                await transporter.sendMail({
                    from: process.env.SMTP_FROM,
                    to: email,
                    subject: "Login to Ticketa",
                    html: `
                        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px; background-color: #ffffff;">
                            <h2 style="color: #111827; font-weight: 800; margin-bottom: 8px;">Verify your identity</h2>
                            <p style="color: #4b5563; font-size: 16px; margin-bottom: 24px;">Click the button below to log in to your Ticketa account. This link will expire in 10 minutes.</p>
                            <a href="${url}" style="display: inline-block; background-color: #8b5cf6; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">Sign in to Ticketa</a>
                            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px;">If you didn't request this email, you can safely ignore it.</p>
                        </div>
                    `,
                });
            },
        }),
    ],
});
