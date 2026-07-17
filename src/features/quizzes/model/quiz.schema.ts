import { z } from "zod";

function parseJsonArray(value: unknown) {
    if (Array.isArray(value)) {
        return value;
    }

    if (typeof value !== "string") {
        return [];
    }

    try {
        const parsed = JSON.parse(value);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch {
        return [];
    }
}

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

const rawSavedQuizQuestionSchema = z.object({
    id: z.number(),
    quizId: z.number(),
    questionType: quizQuestionTypeSchema,
    questionText: z.string(),
    options: z.array(z.string()).optional(),
    optionsJson: z.unknown().optional(),
    correctAnswer: z.string(),
    explanation: z.string().default(""),
    difficulty:
        quizDifficultySchema.default("MEDIUM"),
    topic: z.string().default("General"),
    sourceChunkId: nullableNumberSchema,
    createdAt: z.string(),
});

export const savedQuizQuestionSchema =
    rawSavedQuizQuestionSchema.transform(
        (value) => ({
            id: value.id,
            quizId: value.quizId,
            questionType: value.questionType,
            questionText: value.questionText,
            options:
                value.options ??
                z.array(z.string()).parse(
                    parseJsonArray(
                        value.optionsJson,
                    ),
                ),
            correctAnswer: value.correctAnswer,
            explanation: value.explanation,
            difficulty: value.difficulty,
            topic: value.topic,
            sourceChunkId: value.sourceChunkId,
            createdAt: value.createdAt,
        }),
    );

export const quizDetailSchema =
    savedQuizSchema
        .extend({
            questions: z
                .array(savedQuizQuestionSchema)
                .default([]),
        })
        .transform((value) => ({
            ...value,
            questions: value.questions,
        }));

export const quizWrongAnswerResultSchema =
    z.object({
        wrongAnswerId: z.number().optional(),
        quizId: z.number().optional(),
        questionId: z.number(),
        topic: z.string().default("General"),
        userAnswer: z.string().default(""),
        correctAnswer: z.string().default(""),
        explanation: z.string().default(""),
        resolved: z.boolean().optional(),
        createdAt: z.string().optional(),
    });

export const quizSubmitResponseSchema =
    z.object({
        attemptId: z.number(),
        quizId: z.number(),
        score: z.number(),
        totalQuestions: z.number(),
        correctCount: z.number(),
        wrongAnswers: z
            .array(quizWrongAnswerResultSchema)
            .default([]),
    });

export const quizAttemptSchema = z.object({
    attemptId: z.number(),
    quizId: z.number(),
    score: z.number(),
    totalQuestions: z.number(),
    correctCount: z.number(),
    startedAt: z.string(),
    submittedAt: z.string(),
});

export const quizAttemptListSchema = z.array(
    quizAttemptSchema,
);

export const quizDeleteResponseSchema = z
    .object({
        deleted: z.boolean().default(true),
        quizId: z.number(),
    })
    .passthrough();