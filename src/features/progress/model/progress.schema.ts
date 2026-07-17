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

const nullableStringSchema = z.preprocess(
    (value) => {
        if (
            value === undefined ||
            value === null ||
            value === ""
        ) {
            return null;
        }

        return value;
    },
    z.string().nullable(),
);

function humanizeEventType(eventType: string) {
    return eventType
        .toLowerCase()
        .split("_")
        .filter(Boolean)
        .map(
            (part) =>
                part.charAt(0).toUpperCase() +
                part.slice(1),
        )
        .join(" ");
}

export const progressActivitySchema = z
    .object({
        id: z.number().optional(),
        eventType: z.string(),
        targetType: z.string().optional(),
        targetId: nullableNumberSchema.optional(),
        topic: nullableStringSchema.optional(),
        title: z.string().optional(),
        iconType: z.string().optional(),
        createdAt: z.string(),
    })
    .transform((value) => ({
        id: value.id,
        eventType: value.eventType,
        targetType:
            value.targetType ?? "UNKNOWN",
        targetId:
            value.targetId ?? null,
        topic:
            value.topic ?? null,
        title:
            value.title ??
            humanizeEventType(value.eventType),
        iconType: value.iconType,
        createdAt: value.createdAt,
    }));

export const userProgressOverviewSchema =
    z.object({
        courseCount: z.number().default(0),
        documentCount: z.number().default(0),
        readyDocumentCount: z.number().default(0),
        questionAskedCount: z.number().default(0),
        summaryCount: z.number().default(0),
        quizCount: z.number().default(0),
        flashcardCount: z.number().default(0),
        averageQuizScore:
            nullableNumberSchema.default(null),
        currentStreak: z.number().default(0),
        longestStreak: z.number().default(0),
        recentActivity: z
            .array(progressActivitySchema)
            .default([]),
    });

export const courseWeakTopicSchema = z
    .object({
        topic: z.string(),
        wrongCount: z.number().default(0),
        resolvedCount: z.number().default(0),
        unresolvedCount: z.number().default(0),
        lastWrongAt: nullableStringSchema.optional(),
        relatedQuizCount: z.number().default(0),
    })
    .transform((value) => ({
        ...value,
        lastWrongAt: value.lastWrongAt ?? null,
    }));

export const courseProgressSchema = z.object({
    courseId: z.number(),
    documentCount: z.number().default(0),
    readyDocumentCount: z.number().default(0),
    chatMessageCount: z.number().default(0),
    summaryCount: z.number().default(0),
    quizCount: z.number().default(0),
    quizAttemptCount: z.number().default(0),
    averageQuizScore:
        nullableNumberSchema.default(null),
    wrongAnswerCount: z.number().default(0),
    unresolvedWrongAnswerCount:
        z.number().default(0),
    flashcardCount: z.number().default(0),
    noteCount: z.number().default(0),
    progressScore: z.number().default(0),
    weakTopics: z
        .array(courseWeakTopicSchema)
        .default([]),
    recommendedNextReview:
        nullableStringSchema.default(null),
    recentActivity: z
        .array(progressActivitySchema)
        .default([]),
});

export const courseWeakTopicsResponseSchema =
    z.object({
        courseId: z.number(),
        topicCount: z.number().default(0),
        weakTopics: z
            .array(courseWeakTopicSchema)
            .default([]),
    });

export const courseReviewRecommendationSchema = z
    .object({
        type: z.string(),
        topic: nullableStringSchema.optional(),
        quizId: nullableNumberSchema.optional(),
        documentId: nullableNumberSchema.optional(),
        reason: z.string(),
        priority: z.number().default(999),
        action: z.string(),
    })
    .transform((value) => ({
        ...value,
        topic: value.topic ?? null,
        quizId: value.quizId ?? null,
        documentId: value.documentId ?? null,
    }));

export const courseReviewRecommendationsResponseSchema =
    z.object({
        courseId: z.number(),
        count: z.number().default(0),
        recommendations: z
            .array(courseReviewRecommendationSchema)
            .default([]),
    });