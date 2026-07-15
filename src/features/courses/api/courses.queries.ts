import {
    queryOptions,
    useQuery,
} from "@tanstack/react-query";

import { queryKeys } from "@/app/query-client/queryKeys";
import {
    getCourse,
    getCourseOverview,
    getCourses,
} from "@/features/courses/api/courses.api";

export function coursesListQueryOptions() {
    return queryOptions({
        queryKey: queryKeys.courses.list(),
        queryFn: ({ signal }) =>
            getCourses(signal),
        staleTime: 30_000,
        retry: false,
    });
}

export function courseDetailQueryOptions(
    courseId: number,
) {
    return queryOptions({
        queryKey:
            queryKeys.courses.detail(courseId),

        queryFn: ({ signal }) =>
            getCourse(courseId, signal),

        staleTime: 60_000,
        retry: false,
    });
}

export function courseOverviewQueryOptions(
    courseId: number,
) {
    return queryOptions({
        queryKey:
            queryKeys.courses.overview(courseId),

        queryFn: ({ signal }) =>
            getCourseOverview(
                courseId,
                signal,
            ),

        staleTime: 30_000,
        retry: false,
    });
}

export function useCoursesQuery() {
    return useQuery(
        coursesListQueryOptions(),
    );
}

export function useCourseDetailQuery(
    courseId: number | null,
) {
    return useQuery({
        ...courseDetailQueryOptions(
            courseId ?? 0,
        ),
        enabled: courseId !== null,
    });
}

export function useCourseOverviewQuery(
    courseId: number,
) {
    return useQuery(
        courseOverviewQueryOptions(
            courseId,
        ),
    );
}