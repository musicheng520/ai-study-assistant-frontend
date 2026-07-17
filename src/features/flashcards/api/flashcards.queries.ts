import {
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/app/query-client/queryKeys";

import {
    deleteFlashcard,
    generateCourseFlashcards,
    generateDocumentFlashcards,
    generateWeakTopicFlashcards,
    getCourseFlashcards,
    saveFlashcardsDraft,
    type DeleteFlashcardParams,
    type GenerateCourseFlashcardsParams,
    type GenerateDocumentFlashcardsParams,
    type GenerateWeakTopicFlashcardsParams,
} from "./flashcards.api";
import type {
    FlashcardSaveDraftRequest,
} from "../model";

export function useCourseFlashcardsQuery(
    courseId: number | null,
) {
    return useQuery({
        queryKey: queryKeys.flashcards.list(
            courseId ?? 0,
        ),
        queryFn: ({ signal }) =>
            getCourseFlashcards({
                courseId: courseId as number,
                signal,
            }),
        enabled:
            typeof courseId === "number" &&
            Number.isInteger(courseId) &&
            courseId > 0,
    });
}

export function useGenerateCourseFlashcardsMutation() {
    return useMutation({
        mutationFn: (
            params: Omit<
                GenerateCourseFlashcardsParams,
                "signal"
            >,
        ) => generateCourseFlashcards(params),
    });
}

export function useGenerateDocumentFlashcardsMutation() {
    return useMutation({
        mutationFn: (
            params: Omit<
                GenerateDocumentFlashcardsParams,
                "signal"
            >,
        ) => generateDocumentFlashcards(params),
    });
}

export function useGenerateWeakTopicFlashcardsMutation() {
    return useMutation({
        mutationFn: (
            params: Omit<
                GenerateWeakTopicFlashcardsParams,
                "signal"
            >,
        ) => generateWeakTopicFlashcards(params),
    });
}

export function useSaveFlashcardsDraftMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            request: FlashcardSaveDraftRequest,
        ) => saveFlashcardsDraft(request),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    queryKeys.flashcards.lists(),
            });

            await queryClient.invalidateQueries({
                queryKey:
                queryKeys.courses.all,
            });
        },
    });
}

export function useDeleteFlashcardMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (
            params: DeleteFlashcardParams,
        ) => deleteFlashcard(params),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey:
                    queryKeys.flashcards.lists(),
            });

            await queryClient.invalidateQueries({
                queryKey:
                queryKeys.courses.all,
            });
        },
    });
}