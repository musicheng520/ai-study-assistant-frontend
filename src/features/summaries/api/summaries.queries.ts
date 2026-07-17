import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/app/query-client/queryKeys";

import {
    deleteSummary,
    generateCourseSummary,
    generateDocumentSummary,
    getCourseSummaries,
    saveSummaryDraft,
    type DeleteSummaryParams,
    type GenerateCourseSummaryParams,
    type GenerateDocumentSummaryParams,
} from "./summaries.api";
import type {
    SaveDraftRequest,
} from "../model";

export function useCourseSummariesQuery(
    courseId: number | null,
) {
    return useQuery({
        queryKey: queryKeys.summaries.list(
            courseId ?? 0,
        ),
        queryFn: ({ signal }) =>
            getCourseSummaries({
                courseId: courseId as number,
                signal,
            }),
        enabled:
            typeof courseId === "number" &&
            Number.isInteger(courseId) &&
            courseId > 0,
    });
}

export function useGenerateCourseSummaryMutation() {
    return useMutation({
        mutationFn: (
            params: Omit<
                GenerateCourseSummaryParams,
                "signal"
            >,
        ) => generateCourseSummary(params),
    });
}

export function useGenerateDocumentSummaryMutation() {
    return useMutation({
        mutationFn: (
            params: Omit<
                GenerateDocumentSummaryParams,
                "signal"
            >,
        ) => generateDocumentSummary(params),
    });
}

export function useSaveSummaryDraftMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            request: SaveDraftRequest,
        ) => saveSummaryDraft(request),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    queryKeys.summaries.lists(),
            });

            await queryClient.invalidateQueries({
                queryKey:
                queryKeys.courses.all,
            });
        },
    });
}

export function useDeleteSummaryMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            params: DeleteSummaryParams,
        ) => deleteSummary(params),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    queryKeys.summaries.lists(),
            });

            await queryClient.invalidateQueries({
                queryKey:
                queryKeys.courses.all,
            });
        },
    });
}