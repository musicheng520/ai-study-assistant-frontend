import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/app/query-client/queryKeys";

import {
    askCourseQuestion,
    getChatSession,
    getCourseChatSessions,
    getSourceChunk,
    saveAnswer,
    type AskCourseQuestionParams,
    type SaveAnswerParams,
} from "./chat.api";

export function useCourseChatSessionsQuery(
    courseId: number | null,
    params: {
        limit?: number;
        offset?: number;
    } = {},
) {
    const limit = params.limit ?? 20;
    const offset = params.offset ?? 0;

    return useQuery({
        queryKey: queryKeys.chat.sessionList(
            courseId ?? 0,
            {
                limit,
                offset,
            },
        ),
        queryFn: ({ signal }) =>
            getCourseChatSessions({
                courseId: courseId as number,
                limit,
                offset,
                signal,
            }),
        enabled:
            typeof courseId === "number" &&
            Number.isInteger(courseId) &&
            courseId > 0,
    });
}

export function useChatSessionQuery(
    sessionId: number | null,
) {
    return useQuery({
        queryKey: queryKeys.chat.sessionDetail(
            sessionId ?? 0,
        ),
        queryFn: ({ signal }) =>
            getChatSession({
                sessionId: sessionId as number,
                signal,
            }),
        enabled:
            typeof sessionId === "number" &&
            Number.isInteger(sessionId) &&
            sessionId > 0,
    });
}

export function useSourceChunkQuery(
    courseId: number | null,
    chunkId: number | null,
) {
    return useQuery({
        queryKey: queryKeys.chat.sourceChunk(
            courseId ?? 0,
            chunkId ?? 0,
        ),
        queryFn: ({ signal }) =>
            getSourceChunk({
                courseId: courseId as number,
                chunkId: chunkId as number,
                signal,
            }),
        enabled:
            typeof courseId === "number" &&
            Number.isInteger(courseId) &&
            courseId > 0 &&
            typeof chunkId === "number" &&
            Number.isInteger(chunkId) &&
            chunkId > 0,
    });
}

export function useAskCourseQuestionMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            params: Omit<
                AskCourseQuestionParams,
                "signal"
            >,
        ) => askCourseQuestion(params),

        onSuccess: (data, variables) => {
            void queryClient.invalidateQueries({
                queryKey:
                    queryKeys.chat.sessions(),
            });

            void queryClient.invalidateQueries({
                queryKey:
                    queryKeys.chat.sessionDetail(
                        data.sessionId,
                    ),
            });

            void queryClient.invalidateQueries({
                queryKey:
                    queryKeys.courses.overview(
                        variables.courseId,
                    ),
            });
        },
    });
}

export function useSaveAnswerMutation() {
    return useMutation({
        mutationFn: (
            params: Omit<
                SaveAnswerParams,
                "signal"
            >,
        ) => saveAnswer(params),
    });
}