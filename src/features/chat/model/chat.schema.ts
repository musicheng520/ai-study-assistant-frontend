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

export const chatCitationSchema = z.object({
    id: z.number().optional(),
    citationIndex: z.number().optional(),
    messageId: z.number().optional(),
    documentId: z.number(),
    chunkId: z.number(),
    fileName: z.string(),
    pageNumber: nullableNumberSchema,
    sectionTitle: z.string().nullable().default(null),
    snippet: z.string(),
    distance: z.number().nullable().optional(),
    createdAt: z.string().optional(),
});

const rawChatMessageSchema = z.object({
    id: z.number(),
    sessionId: z.number().optional(),
    userId: z.number().optional(),
    courseId: z.number().optional(),
    role: z.enum([
        "USER",
        "ASSISTANT",
    ]),
    content: z.string(),
    workflowType: z.string().default("RAG_QA"),
    noAnswer: z.boolean().default(false),
    modelName: z.string().nullable().optional(),
    citations: z.array(chatCitationSchema).default([]),
    createdAt: z.string(),
});

export const chatMessageSchema =
    rawChatMessageSchema.transform(
        (value, ctx) => {
            if (value.sessionId === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Chat message must include sessionId when parsed directly.",
                });

                return z.NEVER;
            }

            if (value.courseId === undefined) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Chat message must include courseId when parsed directly.",
                });

                return z.NEVER;
            }

            return {
                ...value,
                sessionId: value.sessionId,
                courseId: value.courseId,
            };
        },
    );

const rawChatSessionSummarySchema = z.object({
    id: z.number().optional(),
    sessionId: z.number().optional(),
    courseId: z.number(),
    title: z.string().nullable().optional(),
    scopeType: z.enum([
        "COURSE",
        "DOCUMENT",
    ]).default("COURSE"),
    documentId: nullableNumberSchema,
    messageCount: z.number().optional(),
    lastMessagePreview: z.string().nullable().optional(),
    createdAt: z.string(),
    updatedAt: z.string(),
});

export const chatSessionSummarySchema =
    rawChatSessionSummarySchema.transform(
        (value, ctx) => {
            const id =
                value.id ?? value.sessionId;

            if (!id) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Chat session must include id or sessionId.",
                });

                return z.NEVER;
            }

            return {
                id,
                courseId: value.courseId,
                title:
                    value.title?.trim() ||
                    "New chat",
                scopeType: value.scopeType,
                documentId: value.documentId,
                messageCount:
                value.messageCount,
                lastMessagePreview:
                    value.lastMessagePreview ??
                    null,
                createdAt: value.createdAt,
                updatedAt: value.updatedAt,
            };
        },
    );

const rawChatSessionDetailSchema = z.object({
    id: z.number().optional(),
    sessionId: z.number().optional(),
    courseId: z.number(),
    title: z.string().nullable().optional(),
    scopeType: z.enum([
        "COURSE",
        "DOCUMENT",
    ]).default("COURSE"),
    documentId: nullableNumberSchema,
    createdAt: z.string(),
    updatedAt: z.string(),
    messages: z.array(rawChatMessageSchema).default([]),
});

export const chatSessionDetailSchema =
    rawChatSessionDetailSchema.transform(
        (value, ctx) => {
            const id =
                value.id ?? value.sessionId;

            if (!id) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message:
                        "Chat session detail must include id or sessionId.",
                });

                return z.NEVER;
            }

            return {
                id,
                courseId: value.courseId,
                title:
                    value.title?.trim() ||
                    "New chat",
                scopeType: value.scopeType,
                documentId: value.documentId,
                createdAt: value.createdAt,
                updatedAt: value.updatedAt,
                messages: value.messages.map(
                    (message) => ({
                        ...message,
                        sessionId:
                            message.sessionId ??
                            id,
                        courseId:
                            message.courseId ??
                            value.courseId,
                    }),
                ),
            };
        },
    );

export const chatSessionListResponseSchema = z
    .union([
        z.object({
            courseId: z.number(),
            limit: z.number(),
            offset: z.number(),
            count: z.number(),
            sessions: z.array(
                chatSessionSummarySchema,
            ),
        }),
        z.array(chatSessionSummarySchema),
    ])
    .transform((value) => {
        if (Array.isArray(value)) {
            return {
                courseId:
                    value[0]?.courseId ?? 0,
                limit: value.length,
                offset: 0,
                count: value.length,
                sessions: value,
            };
        }

        return value;
    });

export const ragAskResponseSchema = z.object({
    sessionId: z.number(),
    userMessageId: z.number(),
    assistantMessageId: z.number(),
    answer: z.string(),
    noAnswer: z.boolean().default(false),
    workflowType: z.string().default("RAG_QA"),
    retrievedChunkCount: z.number().default(0),
    citations: z.array(chatCitationSchema).default([]),
});

export const sourceChunkSchema = z.object({
    chunkId: z.number(),
    userId: z.number(),
    courseId: z.number(),
    documentId: z.number(),
    chunkIndex: z.number(),
    content: z.string(),
    contentHash: z.string(),
    pageNumber: nullableNumberSchema,
    sectionTitle: z.string().nullable().default(null),
    tokenCount: z.number(),
    vectorKey: z.string(),
    vectorStatus: z.string(),
    embeddingModel: z.string(),
    embeddingDimension: z.number(),
    fileName: z.string(),
    fileType: z.string(),
    documentType: z.string(),
    createdAt: z.string(),
});

export const saveAnswerResponseSchema = z
    .object({
        id: z.number().optional(),
        savedAnswerId: z.number().optional(),
        message: z.string().optional(),
    })
    .passthrough();