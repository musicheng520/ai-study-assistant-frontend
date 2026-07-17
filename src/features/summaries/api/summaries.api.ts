import { apiClient } from "@/lib/api/apiClient";
const AI_GENERATION_TIMEOUT_MS = 120_000;
import {
    savedSummaryListSchema,
    summaryDeleteResponseSchema,
    summaryGenerateResponseSchema,
    summarySaveResponseSchema,
} from "../model";
import type {
    SaveDraftRequest,
    SavedSummary,
    SummaryDeleteResponse,
    SummaryGenerateRequest,
    SummaryGenerateResponse,
    SummarySaveResponse,
} from "../model";

export type GenerateCourseSummaryParams = {
    courseId: number;
    request?: SummaryGenerateRequest;
    signal?: AbortSignal;
};

export async function generateCourseSummary({
                                                courseId,
                                                request,
                                                signal,
                                            }: GenerateCourseSummaryParams): Promise<SummaryGenerateResponse> {
    const response = await apiClient.post<unknown>(
        `/api/courses/${courseId}/summary/generate`,
        request ?? {},
        {
            signal,
            timeout: AI_GENERATION_TIMEOUT_MS,
        },
    );

    return summaryGenerateResponseSchema.parse(
        response.data,
    );
}

export type GenerateDocumentSummaryParams = {
    documentId: number;
    request?: SummaryGenerateRequest;
    signal?: AbortSignal;
};

export async function generateDocumentSummary({
                                                  documentId,
                                                  request,
                                                  signal,
                                              }: GenerateDocumentSummaryParams): Promise<SummaryGenerateResponse> {
    const response = await apiClient.post<unknown>(
        `/api/documents/${documentId}/summary/generate`,
        request ?? {},
        {
            signal,
            timeout: AI_GENERATION_TIMEOUT_MS,
        },
    );

    return summaryGenerateResponseSchema.parse(
        response.data,
    );
}

export async function saveSummaryDraft(
    request: SaveDraftRequest,
): Promise<SummarySaveResponse> {
    const response = await apiClient.post<unknown>(
        "/api/summary/save",
        request,
    );

    return summarySaveResponseSchema.parse(
        response.data,
    );
}

export type GetCourseSummariesParams = {
    courseId: number;
    signal?: AbortSignal;
};

export async function getCourseSummaries({
                                             courseId,
                                             signal,
                                         }: GetCourseSummariesParams): Promise<SavedSummary[]> {
    const response = await apiClient.get<unknown>(
        `/api/courses/${courseId}/summaries`,
        { signal },
    );

    return savedSummaryListSchema.parse(
        response.data,
    );
}

export type DeleteSummaryParams = {
    summaryId: number;
};

export async function deleteSummary({
                                        summaryId,
                                    }: DeleteSummaryParams): Promise<SummaryDeleteResponse> {
    const response = await apiClient.delete<unknown>(
        `/api/summary/${summaryId}`,
    );

    if (
        response.status === 204 ||
        response.data === "" ||
        response.data == null
    ) {
        return {
            deleted: true,
            summaryId,
        };
    }

    return summaryDeleteResponseSchema.parse(
        response.data,
    );
}