import { z } from "zod";

export const courseFormSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Course name is required.")
        .max(
            150,
            "Course name cannot exceed 150 characters.",
        ),

    code: z
        .string()
        .trim()
        .max(
            50,
            "Course code cannot exceed 50 characters.",
        ),

    description: z
        .string()
        .trim(),

    color: z
        .string()
        .trim()
        .max(
            30,
            "Course color cannot exceed 30 characters.",
        )
        .regex(
            /^#[0-9a-fA-F]{6}$/,
            "Select a valid course color.",
        ),
});

export const courseResponseSchema = z.object({
    id: z.number().int().positive(),
    userId: z.number().int().positive(),
    name: z.string(),
    code: z.string().nullable(),
    description: z.string().nullable(),
    color: z.string().nullable(),
    progressScore: z
        .number()
        .min(0)
        .max(100),
    createdAt: z.string(),
    updatedAt: z.string(),
});

const courseOverviewStatsSchema = z.object({
    documentCount: z.number().int().nonnegative(),
    readyDocumentCount: z.number().int().nonnegative(),
    processingDocumentCount: z
        .number()
        .int()
        .nonnegative(),
    failedDocumentCount: z
        .number()
        .int()
        .nonnegative(),
    chatMessageCount: z
        .number()
        .int()
        .nonnegative(),
    summaryCount: z.number().int().nonnegative(),
    quizCount: z.number().int().nonnegative(),
    quizAttemptCount: z
        .number()
        .int()
        .nonnegative(),
    averageQuizScore: z
        .number()
        .min(0)
        .max(100)
        .nullable(),
    wrongAnswerCount: z
        .number()
        .int()
        .nonnegative(),
    unresolvedWrongAnswerCount: z
        .number()
        .int()
        .nonnegative(),
    flashcardCount: z.number().int().nonnegative(),
    noteCount: z.number().int().nonnegative(),
    taskCount: z.number().int().nonnegative(),
    completedTaskCount: z
        .number()
        .int()
        .nonnegative(),
    revisionPackCount: z
        .number()
        .int()
        .nonnegative(),
    assignmentAnalysisCount: z
        .number()
        .int()
        .nonnegative(),
    rubricAnalysisCount: z
        .number()
        .int()
        .nonnegative(),
});

const courseWeakTopicSchema = z.object({
    topic: z.string(),
    wrongCount: z.number().int().nonnegative(),
    unresolvedCount: z
        .number()
        .int()
        .nonnegative(),
    latestWrongAt: z.string().nullable(),
});

const courseNextActionSchema = z.object({
    type: z.string(),
    title: z.string(),
    reason: z.string(),
    priority: z.number().int(),
    actionLabel: z.string(),
    targetPath: z.string(),
});

const courseActivitySchema = z.object({
    id: z.number().int().positive(),
    eventType: z.string(),
    targetType: z.string(),
    targetId: z
        .number()
        .int()
        .nonnegative()
        .nullable(),
    topic: z.string().nullable(),
    title: z.string(),
    iconType: z.string(),
    createdAt: z.string(),
});

export const courseOverviewResponseSchema =
    z.object({
        courseId: z.number().int().positive(),
        courseName: z.string(),
        courseCode: z.string().nullable(),
        courseColor: z.string().nullable(),
        progressScore: z
            .number()
            .min(0)
            .max(100),

        stats: courseOverviewStatsSchema,

        weakTopics: z.array(
            courseWeakTopicSchema,
        ),

        nextActions: z.array(
            courseNextActionSchema,
        ),

        recentActivities: z.array(
            courseActivitySchema,
        ),

        generatedAt: z.string(),
    });

export type CourseFormValues = z.infer<
    typeof courseFormSchema
>;

export type Course = z.infer<
    typeof courseResponseSchema
>;

export type CourseOverview = z.infer<
    typeof courseOverviewResponseSchema
>;

export type CourseCreateRequest = {
    name: string;
    code?: string;
    description?: string;
    color?: string;
};

export type CourseUpdateRequest =
    CourseCreateRequest;

export function toCourseRequest(
    values: CourseFormValues,
): CourseCreateRequest {
    const name = values.name.trim();
    const code = values.code.trim();
    const description =
        values.description.trim();
    const color = values.color.trim();

    return {
        name,
        ...(code
            ? {
                code,
            }
            : {}),
        ...(description
            ? {
                description,
            }
            : {}),
        ...(color
            ? {
                color,
            }
            : {}),
    };
}