import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/app/query-client/queryKeys";

import {
    deleteQuiz,
    generateCourseQuiz,
    generateDocumentQuiz,
    getCourseQuizzes,
    getQuizAttempts,
    getQuizDetail,
    saveQuizDraft,
    submitQuiz,
    type DeleteQuizParams,
    type GenerateCourseQuizParams,
    type GenerateDocumentQuizParams,
    type SubmitQuizParams,
} from "./quizzes.api";
import type {
    QuizSaveDraftRequest,
} from "../model";

export function useCourseQuizzesQuery(
    courseId: number | null,
) {
    return useQuery({
        queryKey: queryKeys.quizzes.list(
            courseId ?? 0,
        ),
        queryFn: ({ signal }) =>
            getCourseQuizzes({
                courseId: courseId as number,
                signal,
            }),
        enabled:
            typeof courseId === "number" &&
            Number.isInteger(courseId) &&
            courseId > 0,
    });
}

export function useQuizDetailQuery(
    quizId: number | null,
) {
    return useQuery({
        queryKey: queryKeys.quizzes.detail(
            quizId ?? 0,
        ),
        queryFn: ({ signal }) =>
            getQuizDetail({
                quizId: quizId as number,
                signal,
            }),
        enabled:
            typeof quizId === "number" &&
            Number.isInteger(quizId) &&
            quizId > 0,
    });
}

export function useQuizAttemptsQuery(
    quizId: number | null,
) {
    return useQuery({
        queryKey: queryKeys.quizzes.attempts(
            quizId ?? 0,
        ),
        queryFn: ({ signal }) =>
            getQuizAttempts({
                quizId: quizId as number,
                signal,
            }),
        enabled:
            typeof quizId === "number" &&
            Number.isInteger(quizId) &&
            quizId > 0,
    });
}

export function useGenerateCourseQuizMutation() {
    return useMutation({
        mutationFn: (
            params: Omit<
                GenerateCourseQuizParams,
                "signal"
            >,
        ) => generateCourseQuiz(params),
    });
}

export function useGenerateDocumentQuizMutation() {
    return useMutation({
        mutationFn: (
            params: Omit<
                GenerateDocumentQuizParams,
                "signal"
            >,
        ) => generateDocumentQuiz(params),
    });
}

export function useSaveQuizDraftMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            request: QuizSaveDraftRequest,
        ) => saveQuizDraft(request),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    queryKeys.quizzes.lists(),
            });

            await queryClient.invalidateQueries({
                queryKey:
                queryKeys.courses.all,
            });
        },
    });
}

export function useSubmitQuizMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            params: SubmitQuizParams,
        ) => submitQuiz(params),

        onSuccess: async (data, variables) => {
            await queryClient.invalidateQueries({
                queryKey:
                    queryKeys.quizzes.detail(
                        data.quizId,
                    ),
            });

            await queryClient.invalidateQueries({
                queryKey:
                    queryKeys.quizzes.attempts(
                        data.quizId,
                    ),
            });

            await queryClient.invalidateQueries({
                queryKey:
                    queryKeys.courses.overview(
                        variables.courseId,
                    ),
            });
        },
    });
}

export function useDeleteQuizMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            params: DeleteQuizParams,
        ) => deleteQuiz(params),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    queryKeys.quizzes.lists(),
            });

            await queryClient.invalidateQueries({
                queryKey:
                queryKeys.courses.all,
            });
        },
    });
}