import {
    courseOverviewResponseSchema,
    courseResponseSchema,
    type Course,
    type CourseCreateRequest,
    type CourseOverview,
    type CourseUpdateRequest,
} from "@/features/courses/model";
import { apiClient } from "@/lib/api/apiClient";
import { ApiError } from "@/lib/errors/ApiError";

function parseCourse(
    responseData: unknown,
): Course {
    const parsedResponse =
        courseResponseSchema.safeParse(
            responseData,
        );

    if (!parsedResponse.success) {
        throw new ApiError({
            status: 500,
            code: "INVALID_API_RESPONSE",
            message:
                "The course response does not match the expected backend contract.",
            retryable: false,
        });
    }

    return parsedResponse.data;
}

function parseCourseList(
    responseData: unknown,
): Course[] {
    const parsedResponse = courseResponseSchema
        .array()
        .safeParse(responseData);

    if (!parsedResponse.success) {
        throw new ApiError({
            status: 500,
            code: "INVALID_API_RESPONSE",
            message:
                "The course list response does not match the expected backend contract.",
            retryable: false,
        });
    }

    return parsedResponse.data;
}

function parseCourseOverview(
    responseData: unknown,
): CourseOverview {
    const parsedResponse =
        courseOverviewResponseSchema.safeParse(
            responseData,
        );

    if (!parsedResponse.success) {
        throw new ApiError({
            status: 500,
            code: "INVALID_API_RESPONSE",
            message:
                "The course overview response does not match the expected backend contract.",
            retryable: false,
        });
    }

    return parsedResponse.data;
}

export async function getCourses(
    signal?: AbortSignal,
): Promise<Course[]> {
    const response = await apiClient.get(
        "/api/courses",
        {
            signal,
        },
    );

    return parseCourseList(response.data);
}

export async function getCourse(
    courseId: number,
    signal?: AbortSignal,
): Promise<Course> {
    const response = await apiClient.get(
        `/api/courses/${courseId}`,
        {
            signal,
        },
    );

    return parseCourse(response.data);
}

export async function getCourseOverview(
    courseId: number,
    signal?: AbortSignal,
): Promise<CourseOverview> {
    const response = await apiClient.get(
        `/api/courses/${courseId}/overview`,
        {
            signal,
        },
    );

    return parseCourseOverview(
        response.data,
    );
}

export async function createCourse(
    request: CourseCreateRequest,
): Promise<Course> {
    const response = await apiClient.post(
        "/api/courses",
        request,
    );

    return parseCourse(response.data);
}

type UpdateCourseArguments = {
    courseId: number;
    request: CourseUpdateRequest;
};

export async function updateCourse({
                                       courseId,
                                       request,
                                   }: UpdateCourseArguments): Promise<Course> {
    const response = await apiClient.put(
        `/api/courses/${courseId}`,
        request,
    );

    return parseCourse(response.data);
}

export async function deleteCourse(
    courseId: number,
): Promise<void> {
    await apiClient.delete(
        `/api/courses/${courseId}`,
    );
}