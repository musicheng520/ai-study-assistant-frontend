import {
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";

import { queryKeys } from "@/app/query-client/queryKeys";
import {
    createCourse,
    deleteCourse,
    updateCourse,
} from "@/features/courses/api/courses.api";

export function useCreateCourseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createCourse,

        onSuccess: async (course) => {
            queryClient.setQueryData(
                queryKeys.courses.detail(course.id),
                course,
            );

            await queryClient.invalidateQueries({
                queryKey:
                    queryKeys.courses.lists(),
            });
        },
    });
}

export function useUpdateCourseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateCourse,

        onSuccess: async (course) => {
            queryClient.setQueryData(
                queryKeys.courses.detail(course.id),
                course,
            );

            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey:
                        queryKeys.courses.lists(),
                }),

                queryClient.invalidateQueries({
                    queryKey:
                        queryKeys.courses.overview(
                            course.id,
                        ),
                }),
            ]);
        },
    });
}

export function useDeleteCourseMutation() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteCourse,

        onSuccess: async (
            _response,
            courseId,
        ) => {
            queryClient.removeQueries({
                queryKey:
                    queryKeys.courses.detail(
                        courseId,
                    ),
            });

            queryClient.removeQueries({
                queryKey:
                    queryKeys.courses.overview(
                        courseId,
                    ),
            });

            queryClient.removeQueries({
                queryKey:
                    queryKeys.courses.dashboard(
                        courseId,
                    ),
            });

            await queryClient.invalidateQueries({
                queryKey:
                    queryKeys.courses.lists(),
            });
        },
    });
}