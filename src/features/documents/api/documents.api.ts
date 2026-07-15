import type {
    AxiosProgressEvent,
} from "axios";

import {
    documentResponseSchema,
    documentStatusResponseSchema,
    type CourseDocument,
    type DocumentStatusResponse,
    type UploadDocumentArguments,
} from "@/features/documents/model";
import { apiClient } from "@/lib/api/apiClient";
import { ApiError } from "@/lib/errors/ApiError";

function parseDocumentResponse(
    responseData: unknown,
): CourseDocument {
    const parsedResponse =
        documentResponseSchema.safeParse(
            responseData,
        );

    if (!parsedResponse.success) {
        throw new ApiError({
            status: 500,
            code: "INVALID_API_RESPONSE",
            message:
                "The document response does not match the expected backend contract.",
            retryable: false,
        });
    }

    return parsedResponse.data;
}

function parseDocumentListResponse(
    responseData: unknown,
): CourseDocument[] {
    const parsedResponse =
        documentResponseSchema
            .array()
            .safeParse(responseData);

    if (!parsedResponse.success) {
        throw new ApiError({
            status: 500,
            code: "INVALID_API_RESPONSE",
            message:
                "The document list response does not match the expected backend contract.",
            retryable: false,
        });
    }

    return parsedResponse.data;
}

function parseDocumentStatusResponse(
    responseData: unknown,
): DocumentStatusResponse {
    const parsedResponse =
        documentStatusResponseSchema.safeParse(
            responseData,
        );

    if (!parsedResponse.success) {
        throw new ApiError({
            status: 500,
            code: "INVALID_API_RESPONSE",
            message:
                "The document status response does not match the expected backend contract.",
            retryable: false,
        });
    }

    return parsedResponse.data;
}

function createUploadProgressHandler(
    file: File,
    onProgress:
        | UploadDocumentArguments["onProgress"]
        | undefined,
) {
    if (!onProgress) {
        return undefined;
    }

    return (
        progressEvent: AxiosProgressEvent,
    ): void => {
        const loadedBytes =
            progressEvent.loaded;

        const totalBytes =
            progressEvent.total ??
            file.size;

        const percentage =
            totalBytes > 0
                ? Math.min(
                    100,
                    Math.round(
                        (loadedBytes / totalBytes) *
                        100,
                    ),
                )
                : 0;

        onProgress({
            loadedBytes,
            totalBytes,
            percentage,
        });
    };
}

export async function getDocuments(
    courseId: number,
    signal?: AbortSignal,
): Promise<CourseDocument[]> {
    const response = await apiClient.get(
        `/api/courses/${courseId}/documents`,
        {
            signal,
        },
    );

    return parseDocumentListResponse(
        response.data,
    );
}

export async function getDocument(
    documentId: number,
    signal?: AbortSignal,
): Promise<CourseDocument> {
    const response = await apiClient.get(
        `/api/documents/${documentId}`,
        {
            signal,
        },
    );

    return parseDocumentResponse(
        response.data,
    );
}

export async function getDocumentStatus(
    documentId: number,
    signal?: AbortSignal,
): Promise<DocumentStatusResponse> {
    const response = await apiClient.get(
        `/api/documents/${documentId}/status`,
        {
            signal,
        },
    );

    return parseDocumentStatusResponse(
        response.data,
    );
}

export async function uploadDocument({
                                         courseId,
                                         file,
                                         documentType,
                                         onProgress,
                                     }: UploadDocumentArguments): Promise<CourseDocument> {
    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "documentType",
        documentType,
    );

    const uploadProgressHandler =
        createUploadProgressHandler(
            file,
            onProgress,
        );

    const response = await apiClient.post(
        `/api/courses/${courseId}/documents`,
        formData,
        {
            ...(uploadProgressHandler
                ? {
                    onUploadProgress:
                    uploadProgressHandler,
                }
                : {}),
        },
    );

    return parseDocumentResponse(
        response.data,
    );
}

export async function retryDocument(
    documentId: number,
): Promise<CourseDocument> {
    const response = await apiClient.post(
        `/api/documents/${documentId}/retry`,
    );

    return parseDocumentResponse(
        response.data,
    );
}

export async function deleteDocument(
    documentId: number,
): Promise<void> {
    await apiClient.delete(
        `/api/documents/${documentId}`,
    );
}