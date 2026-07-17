import type { LucideIcon } from "lucide-react";
import {
    Activity,
    ArrowRight,
    BookOpen,
    Brain,
    FileText,
    Flame,
    Layers,
    MessageSquareText,
    RefreshCw,
    Trophy,
} from "lucide-react";
import { Link } from "react-router";
import { CourseProgressDrilldown } from "@/features/progress/components/CourseProgressDrilldown";
import {
    EmptyState,
    ErrorState,
} from "@/components/feedback";
import { PageHeader } from "@/components/layout";
import {
    Badge,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    buttonVariants,
} from "@/components/ui";
import { useCoursesQuery } from "@/features/courses/api";
import { useProgressOverviewQuery } from "@/features/progress/api";
import type { ProgressActivity } from "@/features/progress/model";
import { toApiError } from "@/lib/errors/ApiError";

type ProgressMetricCardProps = {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
};

function formatDateTime(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Recently";
    }

    return new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
}

function formatScore(value: number | null) {
    if (value === null) {
        return "—";
    }

    return `${Math.round(value)}%`;
}

function ProgressMetricCard({
                                label,
                                value,
                                description,
                                icon: Icon,
                            }: ProgressMetricCardProps) {
    return (
        <Card>
            <CardContent className="pt-5 sm:pt-6">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <p className="text-sm font-medium text-text-secondary">
                            {label}
                        </p>

                        <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
                            {value}
                        </p>
                    </div>

                    <span
                        className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"
                        aria-hidden="true"
                    >
                        <Icon className="size-5" />
                    </span>
                </div>

                <p className="mt-3 text-xs leading-5 text-text-muted">
                    {description}
                </p>
            </CardContent>
        </Card>
    );
}

function getActivityIcon(
    activity: ProgressActivity,
) {
    const type =
        activity.iconType ??
        activity.eventType;

    if (type.toLowerCase().includes("quiz")) {
        return Trophy;
    }

    if (type.toLowerCase().includes("summary")) {
        return FileText;
    }

    if (
        type.toLowerCase().includes("flashcard")
    ) {
        return Layers;
    }

    if (type.toLowerCase().includes("chat")) {
        return MessageSquareText;
    }

    return Activity;
}

function ActivityList({
                          activities,
                      }: {
    activities: ProgressActivity[];
}) {
    if (activities.length === 0) {
        return (
            <EmptyState
                compact
                icon={Activity}
                title="No recent activity"
                description="Your uploads, questions, summaries, quizzes and flashcards will appear here."
            />
        );
    }

    return (
        <ol className="divide-y divide-line">
            {activities.map((activity) => {
                const Icon =
                    getActivityIcon(activity);

                const key = [
                    activity.eventType,
                    activity.targetType,
                    activity.targetId ?? "none",
                    activity.topic ?? "none",
                    activity.createdAt,
                ].join("-");

                return (
                    <li
                        key={key}
                        className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                    >
                        <span
                            className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-muted text-text-muted"
                            aria-hidden="true"
                        >
                            <Icon className="size-4" />
                        </span>

                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-text-primary">
                                {activity.title}
                            </p>

                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                                <span>
                                    {activity.eventType}
                                </span>

                                {activity.topic ? (
                                    <>
                                        <span aria-hidden="true">
                                            ·
                                        </span>

                                        <span>
                                            {activity.topic}
                                        </span>
                                    </>
                                ) : null}

                                <span aria-hidden="true">
                                    ·
                                </span>

                                <time
                                    dateTime={
                                        activity.createdAt
                                    }
                                >
                                    {formatDateTime(
                                        activity.createdAt,
                                    )}
                                </time>
                            </div>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
}

export function ProgressPage() {
    const progressQuery =
        useProgressOverviewQuery();

    const coursesQuery =
        useCoursesQuery();

    if (progressQuery.isPending) {
        return (
            <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-6xl space-y-6">
                    <div className="h-28 rounded-3xl bg-surface-muted" />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            "courses",
                            "documents",
                            "score",
                            "streak",
                        ].map((item) => (
                            <div
                                key={item}
                                className="h-36 rounded-2xl bg-surface-muted"
                            />
                        ))}
                    </div>

                    <div className="h-96 rounded-3xl bg-surface-muted" />
                </section>
            </main>
        );
    }

    if (progressQuery.isError) {
        return (
            <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-6xl">
                    <ErrorState
                        title="Progress could not be loaded"
                        message={
                            toApiError(
                                progressQuery.error,
                            ).message
                        }
                        onRetry={() => {
                            void progressQuery.refetch();
                        }}
                    />
                </section>
            </main>
        );
    }

    const overview =
        progressQuery.data;

    const courses =
        coursesQuery.data ?? [];

    const readyRatio =
        overview.documentCount > 0
            ? `${overview.readyDocumentCount}/${overview.documentCount}`
            : "0/0";

    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-6xl space-y-6">
                <PageHeader
                    eyebrow={
                        <Badge variant="ai">
                            <Brain
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Learning analytics
                        </Badge>
                    }
                    title="Progress"
                    description="Track your learning activity across courses, documents, questions, quizzes and flashcards."
                    actions={
                        <Button
                            variant="secondary"
                            disabled={
                                progressQuery.isFetching
                            }
                            onClick={() => {
                                void progressQuery.refetch();
                                void coursesQuery.refetch();
                            }}
                        >
                            <RefreshCw
                                className={[
                                    "size-4",
                                    progressQuery.isFetching
                                        ? "animate-spin"
                                        : "",
                                ].join(" ")}
                                aria-hidden="true"
                            />
                            Refresh
                        </Button>
                    }
                />

                <section
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    aria-label="Progress metrics"
                >
                    <ProgressMetricCard
                        icon={BookOpen}
                        label="Courses"
                        value={`${overview.courseCount}`}
                        description="Active course workspaces"
                    />

                    <ProgressMetricCard
                        icon={FileText}
                        label="Ready documents"
                        value={readyRatio}
                        description="Documents available for RAG and study generation"
                    />

                    <ProgressMetricCard
                        icon={Trophy}
                        label="Average quiz score"
                        value={formatScore(
                            overview.averageQuizScore,
                        )}
                        description={`${overview.quizCount} saved quizzes across all courses`}
                    />

                    <ProgressMetricCard
                        icon={Flame}
                        label="Study streak"
                        value={`${overview.currentStreak} day`}
                        description={`Longest streak: ${overview.longestStreak} days`}
                    />
                </section>

                <section
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    aria-label="Learning resources"
                >
                    <ProgressMetricCard
                        icon={MessageSquareText}
                        label="Questions asked"
                        value={`${overview.questionAskedCount}`}
                        description="AI chat questions across courses"
                    />

                    <ProgressMetricCard
                        icon={FileText}
                        label="Summaries"
                        value={`${overview.summaryCount}`}
                        description="Saved summary resources"
                    />

                    <ProgressMetricCard
                        icon={Trophy}
                        label="Quizzes"
                        value={`${overview.quizCount}`}
                        description="Saved quiz resources"
                    />

                    <ProgressMetricCard
                        icon={Layers}
                        label="Flashcards"
                        value={`${overview.flashcardCount}`}
                        description="Saved flashcard cards"
                    />
                </section>

                <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_24rem]">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Course progress
                            </CardTitle>

                            <CardDescription>
                                Jump into each course workspace
                                and continue learning.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            {coursesQuery.isPending ? (
                                <div className="space-y-3">
                                    {[
                                        "course-a",
                                        "course-b",
                                        "course-c",
                                    ].map((item) => (
                                        <div
                                            key={item}
                                            className="h-28 rounded-2xl bg-surface-muted"
                                        />
                                    ))}
                                </div>
                            ) : null}

                            {coursesQuery.isError ? (
                                <ErrorState
                                    compact
                                    title="Courses could not be loaded"
                                    message="Progress overview loaded, but the course list request failed."
                                    onRetry={() => {
                                        void coursesQuery.refetch();
                                    }}
                                />
                            ) : null}

                            {!coursesQuery.isPending &&
                            !coursesQuery.isError &&
                            courses.length === 0 ? (
                                <EmptyState
                                    compact
                                    icon={BookOpen}
                                    title="No courses yet"
                                    description="Create a course workspace before tracking course progress."
                                    action={
                                        <Link
                                            to="/courses"
                                            className={buttonVariants({
                                                variant:
                                                    "secondary",
                                                size: "sm",
                                            })}
                                        >
                                            Go to courses
                                            <ArrowRight
                                                className="size-4"
                                                aria-hidden="true"
                                            />
                                        </Link>
                                    }
                                />
                            ) : null}

                            {!coursesQuery.isPending &&
                            !coursesQuery.isError &&
                            courses.length > 0 ? (
                                <div className="space-y-3">
                                    {courses.map((course) => {
                                        const score =
                                            Math.round(
                                                course.progressScore ??
                                                0,
                                            );

                                        return (
                                            <article
                                                key={course.id}
                                                className="rounded-2xl border border-line bg-canvas p-4"
                                            >
                                                <div className="flex flex-wrap items-start justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-text-primary">
                                                            {
                                                                course.name
                                                            }
                                                        </p>

                                                        <p className="mt-1 text-xs text-text-muted">
                                                            {course.code ??
                                                                "No course code"}
                                                        </p>
                                                    </div>

                                                    <Badge variant="info">
                                                        {score}%
                                                    </Badge>
                                                </div>

                                                <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
                                                    <div
                                                        className="h-full bg-brand-700"
                                                        style={{
                                                            width: `${Math.min(
                                                                Math.max(
                                                                    score,
                                                                    0,
                                                                ),
                                                                100,
                                                            )}%`,
                                                        }}
                                                    />
                                                </div>

                                                <div className="mt-4 flex flex-wrap gap-2">
                                                    <Link
                                                        to={`/courses/${course.id}`}
                                                        className={buttonVariants({
                                                            variant:
                                                                "secondary",
                                                            size: "sm",
                                                        })}
                                                    >
                                                        Overview
                                                    </Link>

                                                    <Link
                                                        to={`/courses/${course.id}/study`}
                                                        className={buttonVariants({
                                                            variant:
                                                                "ai",
                                                            size: "sm",
                                                        })}
                                                    >
                                                        Study Hub
                                                    </Link>
                                                </div>
                                            </article>
                                        );
                                    })}
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Recent activity
                            </CardTitle>

                            <CardDescription>
                                Latest learning events recorded
                                across your courses.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <ActivityList
                                activities={
                                    overview.recentActivity
                                }
                            />
                        </CardContent>
                    </Card>
                </div>

                <CourseProgressDrilldown courses={courses} />

                <Card className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                                M64 complete
                            </p>

                            <h2 className="mt-2 text-lg font-semibold text-text-primary">
                                Progress dashboard is connected
                            </h2>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                                This page now combines global progress, course
                                progress, weak-topic analytics, recommendations
                                and recent learning activity.
                            </p>
                        </div>

                        <Badge variant="success">
                            Ready
                        </Badge>
                    </div>
                </Card>
            </section>
        </main>
    );
}