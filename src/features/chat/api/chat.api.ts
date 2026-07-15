import { apiClient } from "@/lib/api/apiClient";

import {
    chatSessionDetailSchema,
    chatSessionListResponseSchema,
    ragAskResponseSchema,
    saveAnswerResponseSchema,
    sourceChunkSchema,
} from "../model";
import type {
    AskCourseQuestionRequest,
    ChatSessionDetail,
    ChatSessionListResponse,
    RagAskResponse,
    SaveAnswerResponse,
    SourceChunk,
} from "../model";

export type GetCourseChatSessionsParams = {
    courseId: number;
    limit?: number;
    offset?: number;
    signal?: AbortSignal;
};

export async function getCourseChatSessions({
                                                courseId,
                                                limit = 20,
                                                offset = 0,
                                                signal,
                                            }: GetCourseChatSessionsParams): Promise<ChatSessionListResponse> {
    const response = await apiClient.get<unknown>(
        `/api/courses/${courseId}/chat/sessions`,
        {
            params: {
                limit,
                offset,
            },
            signal,
        },
    );

    return chatSessionListResponseSchema.parse(
        response.data,
    );
}

export type GetChatSessionParams = {
    sessionId: number;
    signal?: AbortSignal;
};

export async function getChatSession({
                                         sessionId,
                                         signal,
                                     }: GetChatSessionParams): Promise<ChatSessionDetail> {
    const response = await apiClient.get<unknown>(
        `/api/chat/sessions/${sessionId}`,
        {
            signal,
        },
    );

    return chatSessionDetailSchema.parse(
        response.data,
    );
}

export type AskCourseQuestionParams = {
    courseId: number;
    request: AskCourseQuestionRequest;
    signal?: AbortSignal;
};

export async function askCourseQuestion({
                                            courseId,
                                            request,
                                            signal,
                                        }: AskCourseQuestionParams): Promise<RagAskResponse> {
    const response = await apiClient.post<unknown>(
        `/api/courses/${courseId}/chat/ask`,
        {
            question: request.question,
            sessionId:
                request.sessionId ?? null,
            topK: request.topK ?? 5,
        },
        {
            signal,
        },
    );

    return ragAskResponseSchema.parse(
        response.data,
    );
}

export type GetSourceChunkParams = {
    courseId: number;
    chunkId: number;
    signal?: AbortSignal;
};

export async function getSourceChunk({
                                         courseId,
                                         chunkId,
                                         signal,
                                     }: GetSourceChunkParams): Promise<SourceChunk> {
    const response = await apiClient.get<unknown>(
        `/api/courses/${courseId}/sources/chunks/${chunkId}`,
        {
            signal,
        },
    );

    return sourceChunkSchema.parse(
        response.data,
    );
}

export type SaveAnswerParams = {
    messageId: number;
    signal?: AbortSignal;
};

export async function saveAnswer({
                                     messageId,
                                     signal,
                                 }: SaveAnswerParams): Promise<SaveAnswerResponse> {
    const response = await apiClient.post<unknown>(
        `/api/chat/messages/${messageId}/save`,
        undefined,
        {
            signal,
        },
    );

    if (
        response.status === 204 ||
        response.data === "" ||
        response.data == null
    ) {
        return {};
    }

    return saveAnswerResponseSchema.parse(
        response.data,
    );
}