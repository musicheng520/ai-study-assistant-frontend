import {
    queryOptions,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";
import {
    useEffect,
} from "react";

import { queryKeys } from "@/app/query-client/queryKeys";
import {
    getDocument,
    getDocuments,
    getDocumentStatus,
} from "@/features/documents/api/documents.api";
import type {
    CourseDocument,
} from "@/features/documents/model";

export function documentsListQueryOptions(
    courseId: number,
) {
    return queryOptions({
        queryKey:
            queryKeys.documents.list(courseId),

        queryFn: ({ signal }) =>
            getDocuments(courseId, signal),

        staleTime: 15_000,

        retry: false,
    });
}

export function documentDetailQueryOptions(
    documentId: number,
) {
    return queryOptions({
        queryKey:
            queryKeys.documents.detail(
                documentId,
            ),

        queryFn: ({ signal }) =>
            getDocument(documentId, signal),

        staleTime: 30_000,

        retry: false,
    });
}

export function documentStatusQueryOptions(
    documentId: number,
) {
    return queryOptions({
        queryKey:
            queryKeys.documents.status(
                documentId,
            ),

        queryFn: ({ signal }) =>
            getDocumentStatus(
                documentId,
                signal,
            ),

        staleTime: 0,

        retry: false,

        refetchInterval: (query) => {
            const status =
                query.state.data?.status;

            return status === "PROCESSING"
                ? 2_000
                : false;
        },

        refetchIntervalInBackground: false,

        refetchOnWindowFocus: true,
    });
}

export function useDocumentsQuery(
    courseId: number,
) {
    return useQuery(
        documentsListQueryOptions(
            courseId,
        ),
    );
}

export function useDocumentDetailQuery(
    documentId: number | null,
) {
    return useQuery({
        ...documentDetailQueryOptions(
            documentId ?? 0,
        ),

        enabled: documentId !== null,
    });
}

type UseDocumentStatusQueryArguments = {
    courseId: number;
    documentId: number | null;
    enabled: boolean;
};

export function useDocumentStatusQuery({
                                           courseId,
                                           documentId,
                                           enabled,
                                       }: UseDocumentStatusQueryArguments) {
    const queryClient = useQueryClient();

    const statusQuery = useQuery({
        ...documentStatusQueryOptions(
            documentId ?? 0,
        ),

        enabled:
            enabled &&
            documentId !== null,
    });

    const statusData =
        statusQuery.data;

    useEffect(() => {
        if (
            documentId === null ||
            !statusData
        ) {
            return;
        }

        /*
         * Status API 返回后，立即同步文档详情缓存。
         */
        queryClient.setQueryData<CourseDocument>(
            queryKeys.documents.detail(
                documentId,
            ),
            (currentDocument) => {
                if (!currentDocument) {
                    return currentDocument;
                }

                return {
                    ...currentDocument,
                    status: statusData.status,
                    errorMessage:
                    statusData.errorMessage,
                    chunkCount:
                    statusData.chunkCount,
                };
            },
        );

        /*
         * 同步课程文档列表中的对应文档，
         * 页面不需要等待下一次完整列表请求。
         */
        queryClient.setQueryData<
            CourseDocument[]
        >(
            queryKeys.documents.list(
                courseId,
            ),
            (currentDocuments) => {
                if (!currentDocuments) {
                    return currentDocuments;
                }

                return currentDocuments.map(
                    (document) =>
                        document.id === documentId
                            ? {
                                ...document,
                                status:
                                statusData.status,
                                errorMessage:
                                statusData.errorMessage,
                                chunkCount:
                                statusData.chunkCount,
                            }
                            : document,
                );
            },
        );

        const isTerminalStatus =
            statusData.status === "READY" ||
            statusData.status === "FAILED";

        if (!isTerminalStatus) {
            return;
        }

        /*
         * 终态后重新读取完整 DocumentResponse，
         * 因为状态接口没有 totalPages 等完整字段。
         */
        void Promise.all([
            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.documents.detail(
                        documentId,
                    ),
            }),

            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.documents.list(
                        courseId,
                    ),
            }),

            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.courses.overview(
                        courseId,
                    ),
            }),

            queryClient.invalidateQueries({
                queryKey:
                    queryKeys.courses.dashboard(
                        courseId,
                    ),
            }),
        ]);
    }, [
        courseId,
        documentId,
        queryClient,
        statusData,
    ]);

    return statusQuery;
}