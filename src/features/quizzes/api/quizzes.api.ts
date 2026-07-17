import { apiClient } from "@/lib/api/apiClient";

import {
    quizDeleteResponseSchema,
    quizGenerateResponseSchema,
    quizSaveResponseSchema,
    savedQuizListSchema,
} from "../model";
import type {
    QuizDeleteResponse,
    QuizGenerateRequest,
    QuizGenerateResponse,
    QuizSaveDraftRequest,
    QuizSaveResponse,
    SavedQuiz,
} from "../model";

const AI_GENERATION_TIMEOUT_MS = 120_000;

export type GenerateCourseQuizParams = {
    courseId: number;
    request?: QuizGenerateRequest;
    signal?: AbortSignal;
};

export async function generateCourseQuiz({
                                             courseId,
                                             request,
                                             signal,
                                         }: GenerateCourseQuizParams): Promise<QuizGenerateResponse> {
    const response = await apiClient.post<unknown>(
        `/api/courses/${courseId}/quiz/generate`,
        request ?? {},
        {
            signal,
            timeout: AI_GENERATION_TIMEOUT_MS,
        },
    );

    return quizGenerateResponseSchema.parse(
        response.data,
    );
}

export type GenerateDocumentQuizParams = {
    documentId: number;
    request?: QuizGenerateRequest;
    signal?: AbortSignal;
};

export async function generateDocumentQuiz({
                                               documentId,
                                               request,
                                               signal,
                                           }: GenerateDocumentQuizParams): Promise<QuizGenerateResponse> {
    const response = await apiClient.post<unknown>(
        `/api/documents/${documentId}/quiz/generate`,
        request ?? {},
        {
            signal,
            timeout: AI_GENERATION_TIMEOUT_MS,
        },
    );

    return quizGenerateResponseSchema.parse(
        response.data,
    );
}

export async function saveQuizDraft(
    request: QuizSaveDraftRequest,
): Promise<QuizSaveResponse> {
    const response = await apiClient.post<unknown>(
        "/api/quiz/save",
        request,
    );

    return quizSaveResponseSchema.parse(
        response.data,
    );
}

export type GetCourseQuizzesParams = {
    courseId: number;
    signal?: AbortSignal;
};

export async function getCourseQuizzes({
                                           courseId,
                                           signal,
                                       }: GetCourseQuizzesParams): Promise<SavedQuiz[]> {
    const response = await apiClient.get<unknown>(
        `/api/courses/${courseId}/quizzes`,
        { signal },
    );

    return savedQuizListSchema.parse(
        response.data,
    );
}

export type DeleteQuizParams = {
    quizId: number;
};

export async function deleteQuiz({
                                     quizId,
                                 }: DeleteQuizParams): Promise<QuizDeleteResponse> {
    const response = await apiClient.delete<unknown>(
        `/api/quizzes/${quizId}`,
    );

    if (
        response.status === 204 ||
        response.data === "" ||
        response.data == null
    ) {
        return {
            deleted: true,
            quizId,
        };
    }

    return quizDeleteResponseSchema.parse(
        response.data,
    );
}