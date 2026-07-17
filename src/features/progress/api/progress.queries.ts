import {
    useQuery,
} from "@tanstack/react-query";

import { queryKeys } from "@/app/query-client/queryKeys";

import {
    getCourseProgress,
    getCourseReviewRecommendations,
    getCourseWeakTopics,
    getUserProgressOverview,
} from "./progress.api";

export function useProgressOverviewQuery() {
    return useQuery({
        queryKey: queryKeys.progress.overview(),
        queryFn: ({ signal }) =>
            getUserProgressOverview({
                signal,
            }),
    });
}

export function useCourseProgressQuery(
    courseId: number | null,
) {
    return useQuery({
        queryKey: queryKeys.progress.course(
            courseId ?? 0,
        ),
        queryFn: ({ signal }) =>
            getCourseProgress({
                courseId: courseId as number,
                signal,
            }),
        enabled:
            typeof courseId === "number" &&
            Number.isInteger(courseId) &&
            courseId > 0,
    });
}

export function useCourseWeakTopicsQuery(
    courseId: number | null,
) {
    return useQuery({
        queryKey: queryKeys.progress.weakTopics(
            courseId ?? 0,
        ),
        queryFn: ({ signal }) =>
            getCourseWeakTopics({
                courseId: courseId as number,
                signal,
            }),
        enabled:
            typeof courseId === "number" &&
            Number.isInteger(courseId) &&
            courseId > 0,
    });
}

export function useCourseReviewRecommendationsQuery(
    courseId: number | null,
) {
    return useQuery({
        queryKey:
            queryKeys.progress.recommendations(
                courseId ?? 0,
            ),
        queryFn: ({ signal }) =>
            getCourseReviewRecommendations({
                courseId: courseId as number,
                signal,
            }),
        enabled:
            typeof courseId === "number" &&
            Number.isInteger(courseId) &&
            courseId > 0,
    });
}