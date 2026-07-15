import {
    ArrowRight,
    Edit3,
    Trash2,
} from "lucide-react";
import { Link } from "react-router";

import {
    Badge,
    Button,
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    buttonVariants,
} from "@/components/ui";
import type { Course } from "@/features/courses/model";
import { cn } from "@/lib/utils/cn";

type CourseCardProps = {
    course: Course;
    onEdit: (course: Course) => void;
    onDelete: (course: Course) => void;
};

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

function formatUpdatedAt(
    value: string,
): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Recently updated";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "medium",
        },
    ).format(date);
}

export function CourseCard({
                               course,
                               onEdit,
                               onDelete,
                           }: CourseCardProps) {
    const courseColor =
        getCourseColor(course.color);

    const progressScore = Math.min(
        100,
        Math.max(0, course.progressScore),
    );

    return (
        <Card className="overflow-hidden">
            <div
                className="h-1.5"
                style={{
                    backgroundColor: courseColor,
                }}
                aria-hidden="true"
            />

            <CardHeader>
                <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                        {course.code ? (
                            <Badge variant="neutral">
                                {course.code}
                            </Badge>
                        ) : null}

                        <CardTitle className="mt-3 text-lg">
                            <Link
                                className="rounded-sm hover:text-brand-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
                                to={`/courses/${course.id}`}
                            >
                                {course.name}
                            </Link>
                        </CardTitle>
                    </div>

                    <span
                        className="size-3 shrink-0 rounded-full"
                        style={{
                            backgroundColor: courseColor,
                        }}
                        aria-label={`Course color ${courseColor}`}
                    />
                </div>
            </CardHeader>

            <CardContent>
                <p className="line-clamp-3 min-h-12 text-sm leading-6 text-text-secondary">
                    {course.description ||
                        "No course description has been added yet."}
                </p>

                <div className="mt-5">
                    <div className="flex items-center justify-between gap-3 text-xs">
            <span className="font-medium text-text-secondary">
              Course progress
            </span>

                        <span className="font-semibold text-text-primary">
              {progressScore.toFixed(0)}%
            </span>
                    </div>

                    <div
                        className="mt-2 h-2 overflow-hidden rounded-full bg-surface-muted"
                        role="progressbar"
                        aria-label={`${course.name} progress`}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progressScore}
                    >
                        <div
                            className="h-full rounded-full"
                            style={{
                                backgroundColor: courseColor,
                                width: `${progressScore}%`,
                            }}
                        />
                    </div>
                </div>

                <p className="mt-4 text-xs text-text-muted">
                    Updated{" "}
                    {formatUpdatedAt(
                        course.updatedAt,
                    )}
                </p>
            </CardContent>

            <CardFooter className="flex-wrap justify-between">
                <Link
                    className={cn(
                        buttonVariants({
                            variant: "primary",
                            size: "sm",
                        }),
                    )}
                    to={`/courses/${course.id}`}
                >
                    Open course

                    <ArrowRight
                        className="size-4"
                        aria-hidden="true"
                    />
                </Link>

                <div className="flex items-center gap-1">
                    <Button
                        aria-label={`Edit ${course.name}`}
                        onClick={() => {
                            onEdit(course);
                        }}
                        size="icon"
                        variant="ghost"
                    >
                        <Edit3
                            className="size-4"
                            aria-hidden="true"
                        />
                    </Button>

                    <Button
                        aria-label={`Delete ${course.name}`}
                        onClick={() => {
                            onDelete(course);
                        }}
                        size="icon"
                        variant="ghost"
                        className="text-red-700 hover:bg-red-50 hover:text-red-800"
                    >
                        <Trash2
                            className="size-4"
                            aria-hidden="true"
                        />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}