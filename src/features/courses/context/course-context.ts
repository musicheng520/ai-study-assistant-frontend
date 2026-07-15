import { useOutletContext } from "react-router";

import type { Course } from "@/features/courses/model";

export type CourseOutletContext = {
    course: Course;
};

export function useCourseContext() {
    return useOutletContext<CourseOutletContext>();
}