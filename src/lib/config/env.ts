import { z } from "zod";

const envSchema = z.object({
    VITE_APP_NAME: z.string().trim().min(1),
    VITE_API_BASE_URL: z.url(),
});

const parsedEnv = envSchema.safeParse(import.meta.env);

if (!parsedEnv.success) {
    console.error(
        "Invalid frontend environment configuration:",
        parsedEnv.error.flatten().fieldErrors,
    );

    throw new Error(
        "Frontend environment configuration is invalid. Check your .env.local file.",
    );
}

export const env = {
    appName: parsedEnv.data.VITE_APP_NAME,
    apiBaseUrl: parsedEnv.data.VITE_API_BASE_URL.replace(/\/+$/, ""),
} as const;