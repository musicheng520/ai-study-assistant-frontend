import {
    BookOpenText,
    Plus,
    Search,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";
import { useNavigate } from "react-router";

import {
    EmptyState,
    ErrorState,
} from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import {
    Badge,
    Button,
    Input,
} from "@/components/ui";
import { useCoursesQuery } from "@/features/courses/api";
import { CourseCard } from "@/features/courses/components/CourseCard";
import { CourseFormDialog } from "@/features/courses/components/CourseFormDialog";
import { CoursesPageSkeleton } from "@/features/courses/components/CoursesPageSkeleton";
import { DeleteCourseDialog } from "@/features/courses/components/DeleteCourseDialog";
import type { Course } from "@/features/courses/model";

export function CoursesPage() {
    const navigate = useNavigate();

    const coursesQuery =
        useCoursesQuery();

    const [
        searchQuery,
        setSearchQuery,
    ] = useState("");

    const [
        createDialogOpen,
        setCreateDialogOpen,
    ] = useState(false);

    const [
        editingCourse,
        setEditingCourse,
    ] = useState<Course | null>(null);

    const [
        deletingCourse,
        setDeletingCourse,
    ] = useState<Course | null>(null);

    const courses =
        coursesQuery.data ?? [];

    const filteredCourses =
        useMemo(() => {
            const normalizedQuery =
                searchQuery
                    .trim()
                    .toLowerCase();

            if (!normalizedQuery) {
                return courses;
            }

            return courses.filter((course) => {
                const searchableText = [
                    course.name,
                    course.code ?? "",
                    course.description ?? "",
                ]
                    .join(" ")
                    .toLowerCase();

                return searchableText.includes(
                    normalizedQuery,
                );
            });
        }, [
            courses,
            searchQuery,
        ]);

    if (coursesQuery.isPending) {
        return <CoursesPageSkeleton />;
    }

    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-6xl">
                <PageHeader
                    eyebrow={
                        <Badge variant="info">
                            <BookOpenText
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Course workspace
                        </Badge>
                    }
                    title="Courses"
                    description="Create course workspaces and organise documents, questions and study materials."
                    actions={
                        <Button
                            onClick={() => {
                                setCreateDialogOpen(true);
                            }}
                        >
                            <Plus
                                className="size-4"
                                aria-hidden="true"
                            />
                            Create course
                        </Button>
                    }
                />

                {coursesQuery.isError ? (
                    <div className="mt-8">
                        <ErrorState
                            title="Courses could not be loaded"
                            message={
                                coursesQuery.error instanceof Error
                                    ? coursesQuery.error.message
                                    : "The course list request failed."
                            }
                            onRetry={() => {
                                void coursesQuery.refetch();
                            }}
                        />
                    </div>
                ) : null}

                {!coursesQuery.isError &&
                courses.length === 0 ? (
                    <div className="mt-8">
                        <EmptyState
                            icon={BookOpenText}
                            title="No courses yet"
                            description="Create your first course to begin uploading documents and building study resources."
                            action={
                                <Button
                                    onClick={() => {
                                        setCreateDialogOpen(
                                            true,
                                        );
                                    }}
                                >
                                    <Plus
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                    Create first course
                                </Button>
                            }
                        />
                    </div>
                ) : null}

                {!coursesQuery.isError &&
                courses.length > 0 ? (
                    <>
                        <div className="mt-8 max-w-md">
                            <label
                                className="sr-only"
                                htmlFor="course-search"
                            >
                                Search courses
                            </label>

                            <div className="relative">
                                <Search
                                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                                    aria-hidden="true"
                                />

                                <Input
                                    id="course-search"
                                    className="pl-10"
                                    placeholder="Search by name, code or description"
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => {
                                        setSearchQuery(
                                            event.target.value,
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        {filteredCourses.length > 0 ? (
                            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                                {filteredCourses.map(
                                    (course) => (
                                        <CourseCard
                                            key={course.id}
                                            course={course}
                                            onEdit={
                                                setEditingCourse
                                            }
                                            onDelete={
                                                setDeletingCourse
                                            }
                                        />
                                    ),
                                )}
                            </div>
                        ) : (
                            <div className="mt-6">
                                <EmptyState
                                    icon={Search}
                                    title="No matching courses"
                                    description="Try another course name, code or description."
                                    action={
                                        <Button
                                            onClick={() => {
                                                setSearchQuery("");
                                            }}
                                            variant="secondary"
                                        >
                                            Clear search
                                        </Button>
                                    }
                                />
                            </div>
                        )}
                    </>
                ) : null}
            </section>

            <CourseFormDialog
                open={createDialogOpen}
                onOpenChange={
                    setCreateDialogOpen
                }
                onSaved={(course) => {
                    navigate(
                        `/courses/${course.id}`,
                    );
                }}
            />

            <CourseFormDialog
                open={editingCourse !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditingCourse(null);
                    }
                }}
                course={
                    editingCourse ?? undefined
                }
            />

            <DeleteCourseDialog
                open={deletingCourse !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeletingCourse(null);
                    }
                }}
                course={deletingCourse}
            />
        </main>
    );
}