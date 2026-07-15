import { z } from "zod";

export const aiFeedbackTargetTypeSchema = z.enum([
    "ANSWER",
    "SUMMARY",
    "QUIZ",
    "FLASHCARD",
    "ASSIGNMENT_ANALYSIS",
    "RUBRIC_ANALYSIS",
    "REVISION_PACK",
]);

export const aiFeedbackRatingSchema = z.enum([
    "HELPFUL",
    "NOT_HELPFUL",
    "INACCURATE",
]);

export const aiFeedbackResponseSchema = z.object({
    id: z.number(),
    courseId: z.number(),
    targetType: aiFeedbackTargetTypeSchema,
    targetId: z.number(),
    rating: aiFeedbackRatingSchema,
    comment: z.string().nullable().default(null),
    createdAt: z.string(),
});