import { z } from "zod";

const nullableNumberSchema = z.preprocess(
    (value) => {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return null;
        }

        if (typeof value === "string") {
            const parsed = Number(value);

            return Number.isFinite(parsed)
                ? parsed
                : null;
        }

        return value;
    },
    z.number().nullable(),
);

export const quizDifficultySchema = z.enum([
    "EASY",
    "MEDIUM",
    "HARD",
]);

export const quizSourceScopeSchema = z.enum([
    "COURSE",
    "DOCUMENT",
    "WEAK_TOPIC",
]);

export const quizQuestionTypeSchema = z.enum([
    "MCQ",
    "SHORT_ANSWER",
]);

export const quizDraftQuestionSchema = z.object({
    questionType: quizQuestionTypeSchema,
    questionText: z.string(),
    options: z.array(z.string()).default([]),
    correctAnswer: z.string(),
    explanation: z.string().default(""),
    difficulty:
        quizDifficultySchema.default("MEDIUM"),
    topic: z.string().default("General"),
    sourceChunkId: nullableNumberSchema,
});

export const quizGenerateResponseSchema = z.object({
    draftKey: z.string(),
    title: z.string(),
    difficulty:
        quizDifficultySchema.default("MEDIUM"),
    sourceScope:
        quizSourceScopeSchema.default("COURSE"),
    questionCount: z.number(),
    questions: z
        .array(quizDraftQuestionSchema)
        .default([]),
});

export const quizSaveResponseSchema = z.object({
    quizId: z.number(),
});

export const savedQuizSchema = z.object({
    id: z.number(),
    userId: z.number().optional(),
    courseId: z.number(),
    documentId: nullableNumberSchema,
    title: z.string(),
    difficulty:
        quizDifficultySchema.default("MEDIUM"),
    sourceScope:
        quizSourceScopeSchema.default("COURSE"),
    questionCount: z.number(),
    createdAt: z.string(),
});

export const savedQuizListSchema = z.array(
    savedQuizSchema,
);

export const quizDeleteResponseSchema = z
    .object({
        deleted: z.boolean().default(true),
        quizId: z.number(),
    })
    .passthrough();