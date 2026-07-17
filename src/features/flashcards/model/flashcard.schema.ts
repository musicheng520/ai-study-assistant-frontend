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

export const flashcardDifficultySchema = z.enum([
    "EASY",
    "MEDIUM",
    "HARD",
]);

export const flashcardSourceTypeSchema = z.enum([
    "COURSE",
    "DOCUMENT",
    "WEAK_TOPIC",
    "WEAK_TOPICS",
    "WRONG_TOPIC",
    "WRONG_TOPICS",
    "QUIZ_WRONG_TOPIC",
]);

export const flashcardDraftCardSchema = z.object({
    front: z.string(),
    back: z.string(),
    topic: z.string().default("General"),
    difficulty:
        flashcardDifficultySchema.default("MEDIUM"),
    sourceChunkId: nullableNumberSchema,
});

export const flashcardGenerateResponseSchema =
    z.object({
        draftKey: z.string(),
        title: z.string().default("Flashcards"),
        sourceScope:
            flashcardSourceTypeSchema.optional(),
        sourceType:
            flashcardSourceTypeSchema.optional(),
        count: z.number().optional(),
        savedCount: z.number().optional(),
        difficulty:
            flashcardDifficultySchema.default("MEDIUM"),
        topics: z.array(z.string()).optional(),
        weakTopics: z.array(z.string()).optional(),
        cards: z
            .array(flashcardDraftCardSchema)
            .default([]),
    })
        .transform((value) => ({
            ...value,
            count:
                value.count ??
                value.savedCount ??
                value.cards.length,
            topics:
                value.topics ??
                value.weakTopics ??
                [],
        }));

export const flashcardSaveResponseSchema =
    z.object({
        savedCount: z.number(),
        flashcardIds: z
            .array(z.number())
            .default([]),
    });

const rawSavedFlashcardSchema = z.object({
    id: z.number().optional(),
    flashcardId: z.number().optional(),
    userId: z.number().optional(),
    courseId: z.number(),
    documentId: nullableNumberSchema,
    front: z.string(),
    back: z.string(),
    topic: z.string().default("General"),
    difficulty:
        flashcardDifficultySchema.default("MEDIUM"),
    sourceType:
        flashcardSourceTypeSchema.optional(),
    sourceScope:
        flashcardSourceTypeSchema.optional(),
    sourceChunkId: nullableNumberSchema,
    createdAt: z.string(),
});

export const savedFlashcardSchema =
    rawSavedFlashcardSchema.transform(
        (value, ctx) => {
            const id =
                value.id ?? value.flashcardId;

            if (!id) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Saved flashcard must include id or flashcardId.",
                });

                return z.NEVER;
            }

            return {
                id,
                userId: value.userId,
                courseId: value.courseId,
                documentId: value.documentId,
                front: value.front,
                back: value.back,
                topic: value.topic,
                difficulty: value.difficulty,
                sourceType:
                    value.sourceType ??
                    value.sourceScope ??
                    "COURSE",
                sourceChunkId: value.sourceChunkId,
                createdAt: value.createdAt,
            };
        },
    );

export const savedFlashcardListSchema = z.array(
    savedFlashcardSchema,
);

export const flashcardDeleteResponseSchema = z
    .object({
        deleted: z.boolean().default(true),
        flashcardId: z.number(),
    })
    .passthrough();