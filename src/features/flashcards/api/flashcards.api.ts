import { apiClient } from "@/lib/api/apiClient";

import {
    flashcardDeleteResponseSchema,
    flashcardGenerateResponseSchema,
    flashcardSaveResponseSchema,
    savedFlashcardListSchema,
} from "../model";
import type {
    FlashcardDeleteResponse,
    FlashcardGenerateRequest,
    FlashcardGenerateResponse,
    FlashcardSaveDraftRequest,
    FlashcardSaveResponse,
    SavedFlashcard,
    WeakTopicFlashcardGenerateResponse,
    WrongTopicFlashcardGenerateRequest,
} from "../model";

const AI_GENERATION_TIMEOUT_MS = 120_000;

export type GenerateCourseFlashcardsParams = {
    courseId: number;
    request?: FlashcardGenerateRequest;
    signal?: AbortSignal;
};

export async function generateCourseFlashcards({
                                                   courseId,
                                                   request,
                                                   signal,
                                               }: GenerateCourseFlashcardsParams): Promise<FlashcardGenerateResponse> {
    const response = await apiClient.post<unknown>(
        `/api/courses/${courseId}/flashcards/generate`,
        request ?? {},
        {
            signal,
            timeout: AI_GENERATION_TIMEOUT_MS,
        },
    );

    return flashcardGenerateResponseSchema.parse(
        response.data,
    );
}

export type GenerateDocumentFlashcardsParams = {
    documentId: number;
    request?: FlashcardGenerateRequest;
    signal?: AbortSignal;
};

export async function generateDocumentFlashcards({
                                                     documentId,
                                                     request,
                                                     signal,
                                                 }: GenerateDocumentFlashcardsParams): Promise<FlashcardGenerateResponse> {
    const response = await apiClient.post<unknown>(
        `/api/documents/${documentId}/flashcards/generate`,
        request ?? {},
        {
            signal,
            timeout: AI_GENERATION_TIMEOUT_MS,
        },
    );

    return flashcardGenerateResponseSchema.parse(
        response.data,
    );
}

export type GenerateWeakTopicFlashcardsParams = {
    courseId: number;
    request?: WrongTopicFlashcardGenerateRequest;
    signal?: AbortSignal;
};

export async function generateWeakTopicFlashcards({
                                                      courseId,
                                                      request,
                                                      signal,
                                                  }: GenerateWeakTopicFlashcardsParams): Promise<WeakTopicFlashcardGenerateResponse> {
    const response = await apiClient.post<unknown>(
        `/api/courses/${courseId}/flashcards/generate-from-wrong-topics`,
        request ?? {},
        {
            signal,
            timeout: AI_GENERATION_TIMEOUT_MS,
        },
    );

    return flashcardGenerateResponseSchema.parse(
        response.data,
    );
}

export async function saveFlashcardsDraft(
    request: FlashcardSaveDraftRequest,
): Promise<FlashcardSaveResponse> {
    const response = await apiClient.post<unknown>(
        "/api/flashcards/save",
        request,
    );

    return flashcardSaveResponseSchema.parse(
        response.data,
    );
}

export type GetCourseFlashcardsParams = {
    courseId: number;
    signal?: AbortSignal;
};

export async function getCourseFlashcards({
                                              courseId,
                                              signal,
                                          }: GetCourseFlashcardsParams): Promise<SavedFlashcard[]> {
    const response = await apiClient.get<unknown>(
        `/api/courses/${courseId}/flashcards`,
        { signal },
    );

    return savedFlashcardListSchema.parse(
        response.data,
    );
}

export type DeleteFlashcardParams = {
    flashcardId: number;
};

export async function deleteFlashcard({
                                          flashcardId,
                                      }: DeleteFlashcardParams): Promise<FlashcardDeleteResponse> {
    const response = await apiClient.delete<unknown>(
        `/api/flashcards/${flashcardId}`,
    );

    if (
        response.status === 204 ||
        response.data === "" ||
        response.data == null
    ) {
        return {
            deleted: true,
            flashcardId,
        };
    }

    return flashcardDeleteResponseSchema.parse(
        response.data,
    );
}