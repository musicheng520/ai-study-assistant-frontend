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

export const summarySourceScopeSchema = z.enum([
    "COURSE",
    "DOCUMENT",
]);

export const summaryKeyConceptSchema = z.object({
    name: z.string(),
    explanation: z.string(),
});

export const summaryDefinitionSchema = z.object({
    term: z.string(),
    definition: z.string(),
});

export const summaryGenerateResponseSchema =
    z.object({
        draftKey: z.string(),
        title: z.string(),
        summary: z.string(),
        keyConcepts: z
            .array(summaryKeyConceptSchema)
            .default([]),
        definitions: z
            .array(summaryDefinitionSchema)
            .default([]),
        revisionNotes: z.string().default(""),
        sourceScope:
            summarySourceScopeSchema.default("COURSE"),
    });

export const summarySaveResponseSchema = z.object({
    summaryId: z.number(),
});

const rawSavedSummarySchema = z.object({
    id: z.number(),
    userId: z.number().optional(),
    courseId: z.number(),
    documentId: nullableNumberSchema,
    title: z.string(),
    summary: z.string(),
    keyConcepts: z
        .array(summaryKeyConceptSchema)
        .optional(),
    definitions: z
        .array(summaryDefinitionSchema)
        .optional(),
    keyConceptsJson: z.unknown().optional(),
    definitionsJson: z.unknown().optional(),
    revisionNotes: z.string().default(""),
    sourceScope:
        summarySourceScopeSchema.default("COURSE"),
    createdAt: z.string(),
});

export const savedSummarySchema =
    rawSavedSummarySchema.transform(
        (value) => {
            const parsedKeyConcepts =
                value.keyConcepts ??
                z.array(summaryKeyConceptSchema).parse(
                    parseJsonArray(
                        value.keyConceptsJson,
                    ),
                );

            const parsedDefinitions =
                value.definitions ??
                z.array(summaryDefinitionSchema).parse(
                    parseJsonArray(
                        value.definitionsJson,
                    ),
                );

            return {
                id: value.id,
                userId: value.userId,
                courseId: value.courseId,
                documentId: value.documentId,
                title: value.title,
                summary: value.summary,
                keyConcepts: parsedKeyConcepts,
                definitions: parsedDefinitions,
                revisionNotes:
                value.revisionNotes,
                sourceScope:
                value.sourceScope,
                createdAt: value.createdAt,
            };
        },
    );

export const savedSummaryListSchema = z.array(
    savedSummarySchema,
);

export const summaryDeleteResponseSchema = z
    .object({
        deleted: z.boolean().default(true),
        summaryId: z.number(),
    })
    .passthrough();