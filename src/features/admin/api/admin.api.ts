import { apiClient } from "@/lib/api/apiClient";

import {
    aiMetricsResponseSchema,
    aiRequestLogListSchema,
    cacheMetricsResponseSchema,
    workflowRunLogListSchema,
} from "../model";
import type {
    AiMetricsResponse,
    AiRequestLogFilters,
    AiRequestLogResponse,
    CacheMetricsResponse,
    WorkflowLogFilters,
    WorkflowRunLogResponse,
} from "../model";

export type GetAdminAiMetricsParams = {
    days: number;
    signal?: AbortSignal;
};

export async function getAdminAiMetrics({
                                            days,
                                            signal,
                                        }: GetAdminAiMetricsParams): Promise<AiMetricsResponse> {
    const response = await apiClient.get<unknown>(
        "/api/admin/metrics/ai",
        {
            signal,
            params: {
                days,
            },
        },
    );

    return aiMetricsResponseSchema.parse(
        response.data,
    );
}

export type GetAdminCacheMetricsParams = {
    days: number;
    signal?: AbortSignal;
};

export async function getAdminCacheMetrics({
                                               days,
                                               signal,
                                           }: GetAdminCacheMetricsParams): Promise<CacheMetricsResponse> {
    const response = await apiClient.get<unknown>(
        "/api/admin/metrics/cache",
        {
            signal,
            params: {
                days,
            },
        },
    );

    return cacheMetricsResponseSchema.parse(
        response.data,
    );
}

export type GetAdminAiRequestLogsParams =
    AiRequestLogFilters & {
    signal?: AbortSignal;
};

export async function getAdminAiRequestLogs({
                                                workflowType,
                                                onlyFailures,
                                                limit = 20,
                                                offset = 0,
                                                signal,
                                            }: GetAdminAiRequestLogsParams): Promise<AiRequestLogResponse[]> {
    const response = await apiClient.get<unknown>(
        "/api/admin/logs/ai-requests",
        {
            signal,
            params: {
                workflowType:
                    workflowType || undefined,
                onlyFailures,
                limit,
                offset,
            },
        },
    );

    return aiRequestLogListSchema.parse(
        response.data,
    );
}

export type GetAdminWorkflowLogsParams =
    WorkflowLogFilters & {
    signal?: AbortSignal;
};

export async function getAdminWorkflowLogs({
                                               status,
                                               workflowType,
                                               limit = 20,
                                               offset = 0,
                                               signal,
                                           }: GetAdminWorkflowLogsParams): Promise<WorkflowRunLogResponse[]> {
    const response = await apiClient.get<unknown>(
        "/api/admin/workflows",
        {
            signal,
            params: {
                status: status || undefined,
                workflowType:
                    workflowType || undefined,
                limit,
                offset,
            },
        },
    );

    return workflowRunLogListSchema.parse(
        response.data,
    );
}