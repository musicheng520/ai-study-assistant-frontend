import { apiClient } from "@/lib/api/apiClient";

import {
    quizAttemptListSchema,
    quizDeleteResponseSchema,
    quizDetailSchema,
    quizGenerateResponseSchema,
    quizSaveResponseSchema,
    quizSubmitResponseSchema,
    savedQuizListSchema,
} from "../model";
import type {
    QuizAttempt,
    QuizDeleteResponse,
    QuizDetail,
    QuizGenerateRequest,
    QuizGenerateResponse,
    QuizSaveDraftRequest,
    QuizSaveResponse,
    QuizSubmitResponse,
    SavedQuiz,
    SubmitQuizRequest,
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

export type GetQuizDetailParams = {
    quizId: number;
    signal?: AbortSignal;
};

export async function getQuizDetail({
                                        quizId,
                                        signal,
                                    }: GetQuizDetailParams): Promise<QuizDetail> {
    const response = await apiClient.get<unknown>(
        `/api/quizzes/${quizId}`,
        { signal },
    );

    return quizDetailSchema.parse(response.data);
}

export type SubmitQuizParams = {
    courseId: number;
    quizId: number;
    request: SubmitQuizRequest;
};

export async function submitQuiz({
                                     quizId,
                                     request,
                                 }: SubmitQuizParams): Promise<QuizSubmitResponse> {
    const response = await apiClient.post<unknown>(
        `/api/quiz/${quizId}/submit`,
        request,
    );

    return quizSubmitResponseSchema.parse(
        response.data,
    );
}

export type GetQuizAttemptsParams = {
    quizId: number;
    signal?: AbortSignal;
};

export async function getQuizAttempts({
                                          quizId,
                                          signal,
                                      }: GetQuizAttemptsParams): Promise<QuizAttempt[]> {
    const response = await apiClient.get<unknown>(
        `/api/quiz/${quizId}/attempts`,
        { signal },
    );

    return quizAttemptListSchema.parse(
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