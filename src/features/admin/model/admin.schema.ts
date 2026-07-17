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

export const adminWorkflowStatusSchema = z.enum([
    "RUNNING",
    "SUCCESS",
    "FAILED",
]);

export const workflowUsageMetricSchema = z.object({
    workflowType: z.string(),
    requestCount: z.number().default(0),
    failedCount: z.number().default(0),
    totalTokens: z.number().default(0),
    averageLatencyMs: z.number().default(0),
});

export const recentAiFailureSchema = z
    .object({
        id: z.number(),
        userId: z.number(),
        courseId: nullableNumberSchema.optional(),
        workflowType: z.string(),
        modelName: z.string().default("unknown"),
        errorType: nullableStringSchema.optional(),
        errorMessage:
            nullableStringSchema.optional(),
        createdAt: z.string(),
    })
    .transform((value) => ({
        ...value,
        courseId: value.courseId ?? null,
        errorType: value.errorType ?? null,
        errorMessage: value.errorMessage ?? null,
    }));

export const aiMetricsResponseSchema = z.object({
    days: z.number().default(7),
    totalRequests: z.number().default(0),
    successCount: z.number().default(0),
    failedCount: z.number().default(0),
    successRate: z.number().default(0),
    totalTokens: z.number().default(0),
    averageLatencyMs: z.number().default(0),
    maxLatencyMs: z.number().default(0),
    averageRetrievedChunkCount:
        z.number().default(0),
    workflowUsage: z
        .array(workflowUsageMetricSchema)
        .default([]),
    recentFailures: z
        .array(recentAiFailureSchema)
        .default([]),
});

export const cacheMetricsResponseSchema =
    z.object({
        days: z.number().default(7),
        ragRequestCount: z.number().default(0),
        cacheHitCount: z.number().default(0),
        cacheMissCount: z.number().default(0),
        cacheHitRate: z.number().default(0),
        averageCacheHitLatencyMs:
            z.number().default(0),
        averageCacheMissLatencyMs:
            z.number().default(0),
        averageRetrievedChunkCount:
            z.number().default(0),
    });

export const aiRequestLogResponseSchema = z
    .object({
        id: z.number(),
        userId: z.number(),
        courseId: nullableNumberSchema.optional(),
        workflowType: z.string(),
        modelName: z.string().default("unknown"),
        promptTokens: z.number().default(0),
        completionTokens: z.number().default(0),
        totalTokens: z.number().default(0),
        latencyMs: z.number().default(0),
        cacheHit: z.boolean().default(false),
        retrievedChunkCount:
            z.number().default(0),
        errorType: nullableStringSchema.optional(),
        errorMessage:
            nullableStringSchema.optional(),
        createdAt: z.string(),
    })
    .transform((value) => ({
        ...value,
        courseId: value.courseId ?? null,
        errorType: value.errorType ?? null,
        errorMessage: value.errorMessage ?? null,
    }));

export const aiRequestLogListSchema = z.array(
    aiRequestLogResponseSchema,
);

export const workflowRunLogResponseSchema = z
    .object({
        id: z.number(),
        userId: z.number(),
        courseId: nullableNumberSchema.optional(),
        workflowType: z.string(),
        status: adminWorkflowStatusSchema,
        errorMessage:
            nullableStringSchema.optional(),
        startedAt: z.string(),
        completedAt:
            nullableStringSchema.optional(),
        durationMs:
            nullableNumberSchema.optional(),
        stepCount: z.number().default(0),
    })
    .transform((value) => ({
        ...value,
        courseId: value.courseId ?? null,
        errorMessage: value.errorMessage ?? null,
        completedAt: value.completedAt ?? null,
        durationMs: value.durationMs ?? null,
    }));

export const workflowRunLogListSchema = z.array(
    workflowRunLogResponseSchema,
);