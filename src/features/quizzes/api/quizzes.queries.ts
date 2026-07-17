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
    saveQuizDraft,
    type DeleteQuizParams,
    type GenerateCourseQuizParams,
    type GenerateDocumentQuizParams,
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