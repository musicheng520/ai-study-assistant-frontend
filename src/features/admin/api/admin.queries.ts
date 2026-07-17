import {
    useQuery,
} from "@tanstack/react-query";

import { queryKeys } from "@/app/query-client/queryKeys";

import {
    getAdminAiMetrics,
    getAdminAiRequestLogs,
    getAdminCacheMetrics,
    getAdminWorkflowLogs,
} from "./admin.api";
import type {
    AiRequestLogFilters,
    WorkflowLogFilters,
} from "../model";

export function useAdminAiMetricsQuery(
    days: number,
) {
    return useQuery({
        queryKey:
            queryKeys.admin.aiMetrics(days),
        queryFn: ({ signal }) =>
            getAdminAiMetrics({
                days,
                signal,
            }),
    });
}

export function useAdminCacheMetricsQuery(
    days: number,
) {
    return useQuery({
        queryKey:
            queryKeys.admin.cacheMetrics(days),
        queryFn: ({ signal }) =>
            getAdminCacheMetrics({
                days,
                signal,
            }),
    });
}

export function useAdminAiRequestLogsQuery(
    filters: AiRequestLogFilters,
) {
    return useQuery({
        queryKey:
            queryKeys.admin.aiRequestLogs(
                filters,
            ),
        queryFn: ({ signal }) =>
            getAdminAiRequestLogs({
                ...filters,
                signal,
            }),
    });
}

export function useAdminWorkflowLogsQuery(
    filters: WorkflowLogFilters,
) {
    return useQuery({
        queryKey:
            queryKeys.admin.workflowLogs(
                filters,
            ),
        queryFn: ({ signal }) =>
            getAdminWorkflowLogs({
                ...filters,
                signal,
            }),
    });
}