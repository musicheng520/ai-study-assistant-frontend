import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/app/query-client/queryKeys";
import {
    deleteDocument,
    retryDocument,
    uploadDocument,
} from "@/features/documents/api/documents.api";
import type {
    CourseDocument,
    UploadDocumentArguments,
} from "@/features/documents/model";

function createStatusCache(
    document: CourseDocument,
) {
    return {
        documentId: document.id,
        status: document.status,
        errorMessage:
        document.errorMessage,
        chunkCount:
        document.chunkCount,
    };
}

export function useUploadDocumentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            argumentsValue:
                UploadDocumentArguments,
        ) =>
            uploadDocument(argumentsValue),

        onSuccess: async (
            uploadedDocument,
            variables,
        ) => {
            queryClient.setQueryData(
                queryKeys.documents.detail(
                    uploadedDocument.id,
                ),
                uploadedDocument,
            );

            queryClient.setQueryData(
                queryKeys.documents.status(
                    uploadedDocument.id,
                ),
                createStatusCache(
                    uploadedDocument,
                ),
            );

            queryClient.setQueryData<
                CourseDocument[]
            >(
                queryKeys.documents.list(
                    variables.courseId,
                ),
                (currentDocuments) => {
                    const documents =
                        currentDocuments ?? [];

                    return [
                        uploadedDocument,
                        ...documents.filter(
                            (document) =>
                                document.id !==
                                uploadedDocument.id,
                        ),
                    ];
                },
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey:
                        queryKeys.documents.list(
                            variables.courseId,
                        ),
                }),

                queryClient.invalidateQueries({
                    queryKey:
                        queryKeys.courses.overview(
                            variables.courseId,
                        ),
                }),

                queryClient.invalidateQueries({
                    queryKey:
                        queryKeys.courses.dashboard(
                            variables.courseId,
                        ),
                }),
            ]);
        },
    });
}

type RetryDocumentArguments = {
    courseId: number;
    documentId: number;
};

export function useRetryDocumentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         documentId,
                     }: RetryDocumentArguments) =>
            retryDocument(documentId),

        onSuccess: async (
            retriedDocument,
            variables,
        ) => {
            queryClient.setQueryData(
                queryKeys.documents.detail(
                    retriedDocument.id,
                ),
                retriedDocument,
            );

            queryClient.setQueryData(
                queryKeys.documents.status(
                    retriedDocument.id,
                ),
                createStatusCache(
                    retriedDocument,
                ),
            );

            queryClient.setQueryData<
                CourseDocument[]
            >(
                queryKeys.documents.list(
                    variables.courseId,
                ),
                (currentDocuments) => {
                    if (!currentDocuments) {
                        return currentDocuments;
                    }

                    return currentDocuments.map(
                        (document) =>
                            document.id ===
                            retriedDocument.id
                                ? retriedDocument
                                : document,
                    );
                },
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey:
                        queryKeys.documents.list(
                            variables.courseId,
                        ),
                }),

                queryClient.invalidateQueries({
                    queryKey:
                        queryKeys.courses.overview(
                            variables.courseId,
                        ),
                }),

                queryClient.invalidateQueries({
                    queryKey:
                        queryKeys.courses.dashboard(
                            variables.courseId,
                        ),
                }),
            ]);
        },
    });
}

type DeleteDocumentArguments = {
    courseId: number;
    documentId: number;
};

export function useDeleteDocumentMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
                         documentId,
                     }: DeleteDocumentArguments) =>
            deleteDocument(documentId),

        onSuccess: async (
            _response,
            variables,
        ) => {
            queryClient.removeQueries({
                queryKey:
                    queryKeys.documents.detail(
                        variables.documentId,
                    ),
            });

            queryClient.removeQueries({
                queryKey:
                    queryKeys.documents.status(
                        variables.documentId,
                    ),
            });

            queryClient.setQueryData<
                CourseDocument[]
            >(
                queryKeys.documents.list(
                    variables.courseId,
                ),
                (currentDocuments) => {
                    if (!currentDocuments) {
                        return currentDocuments;
                    }

                    return currentDocuments.filter(
                        (document) =>
                            document.id !==
                            variables.documentId,
                    );
                },
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey:
                        queryKeys.documents.list(
                            variables.courseId,
                        ),
                }),

                queryClient.invalidateQueries({
                    queryKey:
                        queryKeys.courses.overview(
                            variables.courseId,
                        ),
                }),

                queryClient.invalidateQueries({
                    queryKey:
                        queryKeys.courses.dashboard(
                            variables.courseId,
                        ),
                }),
            ]);
        },
    });
}