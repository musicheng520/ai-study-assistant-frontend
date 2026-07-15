import { z } from "zod";

export const documentStatusValues = [
    "PROCESSING",
    "READY",
    "FAILED",
] as const;

export const documentTypeValues = [
    "LECTURE",
    "ASSIGNMENT_BRIEF",
    "RUBRIC",
    "EXAM_NOTES",
    "READING",
    "OTHER",
] as const;

export const documentStatusSchema = z.enum(
    documentStatusValues,
);

export const documentTypeSchema = z.enum(
    documentTypeValues,
);

export const documentResponseSchema = z.object({
    id: z.number().int().positive(),

    courseId: z.number().int().positive(),

    originalFileName: z.string().min(1),

    fileType: z.string().min(1),

    documentType: documentTypeSchema,

    fileSize: z.number().int().nonnegative(),

    status: documentStatusSchema,

    errorMessage: z.string().nullable(),

    totalPages: z
        .number()
        .int()
        .nonnegative()
        .nullable(),

    chunkCount: z
        .number()
        .int()
        .nonnegative(),

    createdAt: z.string().min(1),

    updatedAt: z.string().min(1),
});

export const documentStatusResponseSchema =
    z.object({
        documentId: z.number().int().positive(),

        status: documentStatusSchema,

        errorMessage: z.string().nullable(),

        chunkCount: z
            .number()
            .int()
            .nonnegative(),
    });

export type DocumentStatus = z.infer<
    typeof documentStatusSchema
>;

export type DocumentType = z.infer<
    typeof documentTypeSchema
>;

export type CourseDocument = z.infer<
    typeof documentResponseSchema
>;

export type DocumentStatusResponse = z.infer<
    typeof documentStatusResponseSchema
>;