import { z } from "zod";

export const userRoleSchema = z.enum([
    "USER",
    "ADMIN",
]);

export const userStatusSchema = z.enum([
    "ACTIVE",
    "DISABLED",
]);

export const loginRequestSchema = z.object({
    email: z
        .string()
        .trim()
        .min(1, "Email is required.")
        .email("Enter a valid email address."),

    password: z
        .string()
        .min(1, "Password is required."),
});

export const registerRequestSchema = z
    .object({
        displayName: z
            .string()
            .trim()
            .min(1, "Display name is required.")
            .max(
                100,
                "Display name cannot exceed 100 characters.",
            ),

        email: z
            .string()
            .trim()
            .min(1, "Email is required.")
            .email("Enter a valid email address."),

        password: z
            .string()
            .min(
                8,
                "Password must contain at least 8 characters.",
            ),

        confirmPassword: z
            .string()
            .min(1, "Confirm your password."),
    })
    .refine(
        (formValues) =>
            formValues.password ===
            formValues.confirmPassword,
        {
            message: "Passwords do not match.",
            path: ["confirmPassword"],
        },
    );

export const authResponseSchema = z.object({
    token: z.string().min(1),
    userId: z.number().int().positive(),
    email: z.string().email(),
    displayName: z.string(),
    role: userRoleSchema,
});

export const currentUserResponseSchema = z.object({
    id: z.number().int().positive(),
    email: z.string().email(),
    displayName: z.string(),
    role: userRoleSchema,
    status: userStatusSchema,
});

export type UserRole = z.infer<
    typeof userRoleSchema
>;

export type UserStatus = z.infer<
    typeof userStatusSchema
>;

export type LoginRequest = z.infer<
    typeof loginRequestSchema
>;

export type RegisterFormValues = z.infer<
    typeof registerRequestSchema
>;

export type RegisterRequest = {
    displayName: string;
    email: string;
    password: string;
};

export type AuthResponse = z.infer<
    typeof authResponseSchema
>;

export type CurrentUser = z.infer<
    typeof currentUserResponseSchema
>;