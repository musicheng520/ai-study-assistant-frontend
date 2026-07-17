export type AdminDaysRange =
    | 1
    | 7
    | 30;

export type AdminWorkflowStatus =
    | "RUNNING"
    | "SUCCESS"
    | "FAILED";

export type AdminWorkflowType =
    | "RAG_QA"
    | "SUMMARY"
    | "QUIZ"
    | "FLASHCARD"
    | "SHORT_ANSWER_GRADING"
    | "ASSIGNMENT_ANALYSIS"
    | "RUBRIC_ANALYSIS"
    | "CHECKLIST_GENERATION"
    | "REVISION_PACK"
    | "COORDINATOR"
    | "REVISION_PLAN"
    | "CHECKLIST"
    | "UNKNOWN"
    | string;

export type WorkflowUsageMetric = {
    workflowType: AdminWorkflowType;
    requestCount: number;
    failedCount: number;
    totalTokens: number;
    averageLatencyMs: number;
};

export type RecentAiFailure = {
    id: number;
    userId: number;
    courseId: number | null;
    workflowType: AdminWorkflowType;
    modelName: string;
    errorType: string | null;
    errorMessage: string | null;
    createdAt: string;
};

export type AiMetricsResponse = {
    days: number;
    totalRequests: number;
    successCount: number;
    failedCount: number;
    successRate: number;
    totalTokens: number;
    averageLatencyMs: number;
    maxLatencyMs: number;
    averageRetrievedChunkCount: number;
    workflowUsage: WorkflowUsageMetric[];
    recentFailures: RecentAiFailure[];
};

export type CacheMetricsResponse = {
    days: number;
    ragRequestCount: number;
    cacheHitCount: number;
    cacheMissCount: number;
    cacheHitRate: number;
    averageCacheHitLatencyMs: number;
    averageCacheMissLatencyMs: number;
    averageRetrievedChunkCount: number;
};

export type AiRequestLogResponse = {
    id: number;
    userId: number;
    courseId: number | null;
    workflowType: AdminWorkflowType;
    modelName: string;
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
    latencyMs: number;
    cacheHit: boolean;
    retrievedChunkCount: number;
    errorType: string | null;
    errorMessage: string | null;
    createdAt: string;
};

export type WorkflowRunLogResponse = {
    id: number;
    userId: number;
    courseId: number | null;
    workflowType: AdminWorkflowType;
    status: AdminWorkflowStatus;
    errorMessage: string | null;
    startedAt: string;
    completedAt: string | null;
    durationMs: number | null;
    stepCount: number;
};

export type AiRequestLogFilters = {
    workflowType?: string;
    onlyFailures?: boolean;
    limit?: number;
    offset?: number;
};

export type WorkflowLogFilters = {
    status?: string;
    workflowType?: string;
    limit?: number;
    offset?: number;
};