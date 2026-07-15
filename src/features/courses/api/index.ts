export {
    createCourse,
    deleteCourse,
    getCourse,
    getCourseOverview,
    getCourses,
    updateCourse,
} from "./courses.api";

export {
    useCreateCourseMutation,
    useDeleteCourseMutation,
    useUpdateCourseMutation,
} from "./courses.mutations";

export {
    courseDetailQueryOptions,
    courseOverviewQueryOptions,
    coursesListQueryOptions,
    useCourseDetailQuery,
    useCourseOverviewQuery,
    useCoursesQuery,
} from "./courses.queries";