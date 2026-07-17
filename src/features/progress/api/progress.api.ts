import { apiClient } from "@/lib/api/apiClient";

import {
    courseProgressSchema,
    courseReviewRecommendationsResponseSchema,
    courseWeakTopicsResponseSchema,
    userProgressOverviewSchema,
} from "../model";
import type {
    CourseProgress,
    CourseReviewRecommendationsResponse,
    CourseWeakTopicsResponse,
    UserProgressOverview,
} from "../model";

export type GetUserProgressOverviewParams = {
    signal?: AbortSignal;
};

export async function getUserProgressOverview({
                                                  signal,
                                              }: GetUserProgressOverviewParams = {}): Promise<UserProgressOverview> {
    const response = await apiClient.get<unknown>(
        "/api/progress/overview",
        { signal },
    );

    return userProgressOverviewSchema.parse(
        response.data,
    );
}

export type GetCourseProgressParams = {
    courseId: number;
    signal?: AbortSignal;
};

export async function getCourseProgress({
                                            courseId,
                                            signal,
                                        }: GetCourseProgressParams): Promise<CourseProgress> {
    const response = await apiClient.get<unknown>(
        `/api/courses/${courseId}/progress`,
        { signal },
    );

    return courseProgressSchema.parse(
        response.data,
    );
}

export type GetCourseWeakTopicsParams = {
    courseId: number;
    signal?: AbortSignal;
};

export async function getCourseWeakTopics({
                                              courseId,
                                              signal,
                                          }: GetCourseWeakTopicsParams): Promise<CourseWeakTopicsResponse> {
    const response = await apiClient.get<unknown>(
        `/api/courses/${courseId}/progress/wrong-topics`,
        { signal },
    );

    return courseWeakTopicsResponseSchema.parse(
        response.data,
    );
}

export type GetCourseReviewRecommendationsParams = {
    courseId: number;
    signal?: AbortSignal;
};

export async function getCourseReviewRecommendations({
                                                         courseId,
                                                         signal,
                                                     }: GetCourseReviewRecommendationsParams): Promise<CourseReviewRecommendationsResponse> {
    const response = await apiClient.get<unknown>(
        `/api/courses/${courseId}/progress/recommendations`,
        { signal },
    );

    return courseReviewRecommendationsResponseSchema.parse(
        response.data,
    );
}