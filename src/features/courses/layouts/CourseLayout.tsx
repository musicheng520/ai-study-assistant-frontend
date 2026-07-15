import {
    BookOpen,
    Edit3,
    FileText,
    LayoutDashboard,
    Trash2,
} from "lucide-react";
import {
    useState,
} from "react";
import {
    Link,
    NavLink,
    Outlet,
    useNavigate,
    useParams,
} from "react-router";

import {
    ErrorState,
} from "@/components/feedback";
import {
    PageHeader,
    PageSkeleton,
} from "@/components/layout";
import {
    Badge,
    Button,
    buttonVariants,
} from "@/components/ui";
import { useCourseDetailQuery } from "@/features/courses/api";
import { CourseFormDialog } from "@/features/courses/components/CourseFormDialog";
import { DeleteCourseDialog } from "@/features/courses/components/DeleteCourseDialog";
import { toApiError } from "@/lib/errors/ApiError";
import { cn } from "@/lib/utils/cn";


function parseCourseId(
    value: string | undefined,
): number | null {
    if (!value) {
        return null;
    }

    const courseId = Number(value);

    if (
        !Number.isInteger(courseId) ||
        courseId <= 0
    ) {
        return null;
    }

    return courseId;
}

function getCourseColor(
    color: string | null,
): string {
    if (
        color &&
        /^#[0-9a-fA-F]{6}$/.test(color)
    ) {
        return color;
    }

    return "#2563eb";
}

export function CourseLayout() {
    const params = useParams();
    const navigate = useNavigate();

    const courseId = parseCourseId(
        params.courseId,
    );

    const courseQuery =
        useCourseDetailQuery(courseId);

    const [
        editDialogOpen,
        setEditDialogOpen,
    ] = useState(false);

    const [
        deleteDialogOpen,
        setDeleteDialogOpen,
    ] = useState(false);

    if (courseId === null) {
        return (
            <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-3xl">
                    <ErrorState
                        title="Invalid course address"
                        message="The course ID in this URL is not valid."
                    />

                    <Link
                        className={cn(
                            "mt-5",
                            buttonVariants({
                                variant: "secondary",
                            }),
                        )}
                        to="/courses"
                    >
                        Return to courses
                    </Link>
                </section>
            </main>
        );
    }

    if (courseQuery.isPending) {
        return <PageSkeleton cardCount={2} />;
    }

    if (courseQuery.isError) {
        const apiError = toApiError(
            courseQuery.error,
        );

        const title =
            apiError.status === 403
                ? "Course access denied"
                : apiError.status === 404
                    ? "Course not found"
                    : "Course could not be loaded";

        return (
            <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-3xl">
                    <ErrorState
                        title={title}
                        message={apiError.message}
                        onRetry={
                            apiError.retryable
                                ? () => {
                                    void courseQuery.refetch();
                                }
                                : undefined
                        }
                    />

                    <Link
                        className={cn(
                            "mt-5",
                            buttonVariants({
                                variant: "secondary",
                            }),
                        )}
                        to="/courses"
                    >
                        Return to courses
                    </Link>
                </section>
            </main>
        );
    }

    const course = courseQuery.data;

    const courseColor =
        getCourseColor(course.color);

    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-6xl">
                <PageHeader
                    eyebrow={
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="info">
                                <BookOpen
                                    className="size-3.5"
                                    aria-hidden="true"
                                />
                                Course workspace
                            </Badge>

                            {course.code ? (
                                <Badge variant="neutral">
                                    {course.code}
                                </Badge>
                            ) : null}
                        </div>
                    }
                    title={course.name}
                    description={
                        course.description ||
                        "Manage documents and learning resources for this course."
                    }
                    actions={
                        <>
                            <Button
                                onClick={() => {
                                    setEditDialogOpen(true);
                                }}
                                variant="secondary"
                            >
                                <Edit3
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Edit
                            </Button>

                            <Button
                                onClick={() => {
                                    setDeleteDialogOpen(true);
                                }}
                                variant="destructive"
                            >
                                <Trash2
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Delete
                            </Button>
                        </>
                    }
                />

                <div className="mt-6 rounded-xl border border-line bg-surface p-4">
                    <div className="flex items-center justify-between gap-4">
                        <div>
                            <p className="text-sm font-medium text-text-primary">
                                Overall course progress
                            </p>

                            <p className="mt-1 text-xs text-text-muted">
                                Based on available learning activity.
                            </p>
                        </div>

                        <p className="text-lg font-semibold text-text-primary">
                            {course.progressScore.toFixed(0)}%
                        </p>
                    </div>

                    <div
                        className="mt-3 h-2 overflow-hidden rounded-full bg-surface-muted"
                        role="progressbar"
                        aria-label="Overall course progress"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={
                            course.progressScore
                        }
                    >
                        <div
                            className="h-full rounded-full"
                            style={{
                                backgroundColor:
                                courseColor,
                                width: `${Math.min(
                                    100,
                                    Math.max(
                                        0,
                                        course.progressScore,
                                    ),
                                )}%`,
                            }}
                        />
                    </div>
                </div>

                <nav
                    className="mt-6 overflow-x-auto border-b border-line"
                    aria-label="Course navigation"
                >
                    <div className="flex min-w-max gap-1">
                        <NavLink
                            className={({ isActive }) =>
                                cn(
                                    [
                                        "flex items-center gap-2",
                                        "border-b-2 px-4 py-3",
                                        "text-sm font-medium",
                                        "transition-colors",
                                        "focus-visible:outline-2",
                                        "focus-visible:outline-brand-600",
                                    ],
                                    isActive
                                        ? "border-brand-700 text-brand-800"
                                        : "border-transparent text-text-secondary hover:text-text-primary",
                                )
                            }
                            end
                            to={`/courses/${course.id}`}
                        >
                            <LayoutDashboard
                                className="size-4"
                                aria-hidden="true"
                            />
                            Overview
                        </NavLink>

                        <NavLink
                            className={({ isActive }) =>
                                cn(
                                    [
                                        "flex items-center gap-2",
                                        "border-b-2 px-4 py-3",
                                        "text-sm font-medium",
                                        "transition-colors",
                                        "focus-visible:outline-2",
                                        "focus-visible:outline-brand-600",
                                    ],
                                    isActive
                                        ? "border-brand-700 text-brand-800"
                                        : "border-transparent text-text-secondary hover:text-text-primary",
                                )
                            }
                            to={`/courses/${course.id}/documents`}
                        >
                            <FileText
                                className="size-4"
                                aria-hidden="true"
                            />
                            Documents
                        </NavLink>
                    </div>
                </nav>

                <div className="mt-6">
                    <Outlet
                        context={{
                            course,
                        }}
                    />
                </div>
            </section>

            <CourseFormDialog
                open={editDialogOpen}
                onOpenChange={
                    setEditDialogOpen
                }
                course={course}
            />

            <DeleteCourseDialog
                open={deleteDialogOpen}
                onOpenChange={
                    setDeleteDialogOpen
                }
                course={course}
                onDeleted={() => {
                    navigate("/courses", {
                        replace: true,
                    });
                }}
            />
        </main>
    );
}