import type { LucideIcon } from "lucide-react";
import {
    Activity,
    ArrowRight,
    BookOpen,
    Brain,
    CheckCircle2,
    CircleAlert,
    FileText,
    Layers,
    MessageSquareText,
    RefreshCw,
    Sparkles,
    Target,
    Trophy,
} from "lucide-react";
import {
    useMemo,
    useState,
} from "react";
import { Link } from "react-router";

import {
    EmptyState,
    ErrorState,
} from "@/components/feedback";
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
import type { Course } from "@/features/courses/model";
import {
    useCourseProgressQuery,
    useCourseReviewRecommendationsQuery,
    useCourseWeakTopicsQuery,
} from "@/features/progress/api";
import type { ProgressActivity } from "@/features/progress/model";
import { toApiError } from "@/lib/errors/ApiError";

type CourseProgressDrilldownProps = {
    courses: Course[];
};

type MiniMetricProps = {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
};

function formatDateTime(value: string | null) {
    if (!value) {
        return "No recent date";
    }

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

function clampProgress(value: number) {
    return Math.min(
        Math.max(Math.round(value), 0),
        100,
    );
}

function MiniMetric({
                        label,
                        value,
                        description,
                        icon: Icon,
                    }: MiniMetricProps) {
    return (
        <div className="rounded-2xl border border-line bg-canvas p-4">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-text-secondary">
                        {label}
                    </p>

                    <p className="mt-2 text-xl font-semibold text-text-primary">
                        {value}
                    </p>
                </div>

                <span
                    className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700"
                    aria-hidden="true"
                >
                    <Icon className="size-4" />
                </span>
            </div>

            <p className="mt-3 text-xs leading-5 text-text-muted">
                {description}
            </p>
        </div>
    );
}

function getActivityIcon(
    activity: ProgressActivity,
) {
    const text = [
        activity.eventType,
        activity.targetType,
        activity.iconType ?? "",
    ]
        .join(" ")
        .toLowerCase();

    if (text.includes("quiz")) {
        return Trophy;
    }

    if (text.includes("summary")) {
        return FileText;
    }

    if (text.includes("flashcard")) {
        return Layers;
    }

    if (text.includes("chat")) {
        return MessageSquareText;
    }

    return Activity;
}

function CourseActivityList({
                                activities,
                            }: {
    activities: ProgressActivity[];
}) {
    if (activities.length === 0) {
        return (
            <EmptyState
                compact
                icon={Activity}
                title="No course activity yet"
                description="This course activity will appear after uploads, AI questions and study generation."
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

export function CourseProgressDrilldown({
                                            courses,
                                        }: CourseProgressDrilldownProps) {
    const firstCourseId =
        courses[0]?.id ?? null;

    const [
        selectedCourseId,
        setSelectedCourseId,
    ] = useState<number | null>(
        firstCourseId,
    );

    const selectedCourse = useMemo(
        () =>
            courses.find(
                (course) =>
                    course.id === selectedCourseId,
            ) ?? null,
        [
            courses,
            selectedCourseId,
        ],
    );

    const progressQuery =
        useCourseProgressQuery(selectedCourseId);

    const weakTopicsQuery =
        useCourseWeakTopicsQuery(selectedCourseId);

    const recommendationsQuery =
        useCourseReviewRecommendationsQuery(
            selectedCourseId,
        );

    if (courses.length === 0) {
        return (
            <Card>
                <CardContent className="p-6">
                    <EmptyState
                        compact
                        icon={BookOpen}
                        title="No course progress yet"
                        description="Create a course and complete learning activities to unlock course-level analytics."
                    />
                </CardContent>
            </Card>
        );
    }

    const progress =
        progressQuery.data ?? null;

    const weakTopics =
        weakTopicsQuery.data?.weakTopics ??
        progress?.weakTopics ??
        [];

    const recommendations =
        recommendationsQuery.data?.recommendations ??
        [];

    const progressScore =
        progress
            ? clampProgress(progress.progressScore)
            : 0;

    return (
        <Card
            id="course-progress"
            className="scroll-mt-24 overflow-hidden"
        >
            <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <CardTitle>
                            Course-level progress
                        </CardTitle>

                        <CardDescription>
                            Inspect one course in detail: learning
                            resources, weak topics, recommendations
                            and recent activity.
                        </CardDescription>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {selectedCourse ? (
                            <>
                                <Link
                                    to={`/courses/${selectedCourse.id}`}
                                    className={buttonVariants({
                                        variant: "secondary",
                                        size: "sm",
                                    })}
                                >
                                    Overview
                                </Link>

                                <Link
                                    to={`/courses/${selectedCourse.id}/study`}
                                    className={buttonVariants({
                                        variant: "ai",
                                        size: "sm",
                                    })}
                                >
                                    Study Hub
                                </Link>
                            </>
                        ) : null}

                        <Button
                            size="sm"
                            variant="secondary"
                            disabled={
                                progressQuery.isFetching ||
                                weakTopicsQuery.isFetching ||
                                recommendationsQuery.isFetching
                            }
                            onClick={() => {
                                void progressQuery.refetch();
                                void weakTopicsQuery.refetch();
                                void recommendationsQuery.refetch();
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
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-6">
                <div>
                    <label
                        htmlFor="course-progress-select"
                        className="text-sm font-medium text-text-primary"
                    >
                        Select course
                    </label>

                    <select
                        id="course-progress-select"
                        value={selectedCourseId ?? ""}
                        onChange={(event) => {
                            setSelectedCourseId(
                                Number(
                                    event.target.value,
                                ),
                            );
                        }}
                        className="mt-2 h-11 w-full max-w-xl rounded-lg border border-line bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                    >
                        {courses.map((course) => (
                            <option
                                key={course.id}
                                value={course.id}
                            >
                                {course.name}
                            </option>
                        ))}
                    </select>
                </div>

                {progressQuery.isPending ? (
                    <div className="space-y-4">
                        <div className="h-28 rounded-2xl bg-surface-muted" />

                        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            {[
                                "documents",
                                "chat",
                                "quiz",
                                "flashcards",
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="h-32 rounded-2xl bg-surface-muted"
                                />
                            ))}
                        </div>
                    </div>
                ) : null}

                {progressQuery.isError ? (
                    <ErrorState
                        compact
                        title="Course progress could not be loaded"
                        message={
                            toApiError(
                                progressQuery.error,
                            ).message
                        }
                        onRetry={() => {
                            void progressQuery.refetch();
                        }}
                    />
                ) : null}

                {!progressQuery.isPending &&
                !progressQuery.isError &&
                progress ? (
                    <>
                        <section className="rounded-2xl border border-line bg-canvas p-5">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="text-sm font-medium text-text-secondary">
                                        Progress score
                                    </p>

                                    <h3 className="mt-2 text-3xl font-semibold text-text-primary">
                                        {progressScore}%
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                                        Based on documents, AI chat,
                                        summaries, quizzes,
                                        flashcards and mistake
                                        tracking.
                                    </p>
                                </div>

                                <Badge
                                    variant={
                                        progressScore >= 70
                                            ? "success"
                                            : progressScore >= 35
                                                ? "warning"
                                                : "neutral"
                                    }
                                >
                                    {progressScore >= 70
                                        ? "Strong"
                                        : progressScore >= 35
                                            ? "In progress"
                                            : "Early stage"}
                                </Badge>
                            </div>

                            <div className="mt-5 h-2 overflow-hidden rounded-full bg-surface-muted">
                                <div
                                    className="h-full bg-brand-700"
                                    style={{
                                        width: `${progressScore}%`,
                                    }}
                                />
                            </div>
                        </section>

                        <section
                            className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                            aria-label="Selected course progress metrics"
                        >
                            <MiniMetric
                                icon={FileText}
                                label="Ready documents"
                                value={`${progress.readyDocumentCount}/${progress.documentCount}`}
                                description="Documents available for retrieval"
                            />

                            <MiniMetric
                                icon={MessageSquareText}
                                label="Chat messages"
                                value={`${progress.chatMessageCount}`}
                                description="Course AI chat messages"
                            />

                            <MiniMetric
                                icon={Trophy}
                                label="Quiz score"
                                value={formatScore(
                                    progress.averageQuizScore,
                                )}
                                description={`${progress.quizAttemptCount} attempts completed`}
                            />

                            <MiniMetric
                                icon={Layers}
                                label="Flashcards"
                                value={`${progress.flashcardCount}`}
                                description="Saved flashcards in this course"
                            />

                            <MiniMetric
                                icon={Sparkles}
                                label="Summaries"
                                value={`${progress.summaryCount}`}
                                description="Saved course summaries"
                            />

                            <MiniMetric
                                icon={Brain}
                                label="Quizzes"
                                value={`${progress.quizCount}`}
                                description="Saved quiz resources"
                            />

                            <MiniMetric
                                icon={CircleAlert}
                                label="Wrong answers"
                                value={`${progress.wrongAnswerCount}`}
                                description={`${progress.unresolvedWrongAnswerCount} unresolved`}
                            />

                            <MiniMetric
                                icon={CheckCircle2}
                                label="Notes"
                                value={`${progress.noteCount}`}
                                description="Saved notes or answers"
                            />
                        </section>

                        <div className="grid gap-5 lg:grid-cols-2">
                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle>
                                        Weak topics
                                    </CardTitle>

                                    <CardDescription>
                                        Topics calculated from wrong
                                        answers and unresolved
                                        mistakes.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    {weakTopicsQuery.isPending ? (
                                        <div className="space-y-3">
                                            {[
                                                "weak-a",
                                                "weak-b",
                                                "weak-c",
                                            ].map((item) => (
                                                <div
                                                    key={item}
                                                    className="h-24 rounded-2xl bg-surface-muted"
                                                />
                                            ))}
                                        </div>
                                    ) : null}

                                    {weakTopicsQuery.isError ? (
                                        <ErrorState
                                            compact
                                            title="Weak topics could not be loaded"
                                            message={
                                                toApiError(
                                                    weakTopicsQuery.error,
                                                ).message
                                            }
                                            onRetry={() => {
                                                void weakTopicsQuery.refetch();
                                            }}
                                        />
                                    ) : null}

                                    {!weakTopicsQuery.isPending &&
                                    !weakTopicsQuery.isError &&
                                    weakTopics.length === 0 ? (
                                        <EmptyState
                                            compact
                                            icon={CircleAlert}
                                            title="No weak topics yet"
                                            description="Weak topics will appear after quiz attempts produce wrong answers."
                                        />
                                    ) : null}

                                    {!weakTopicsQuery.isPending &&
                                    !weakTopicsQuery.isError &&
                                    weakTopics.length > 0 ? (
                                        <div className="space-y-3">
                                            {weakTopics.map(
                                                (topic) => (
                                                    <article
                                                        key={
                                                            topic.topic
                                                        }
                                                        className="rounded-2xl border border-line bg-canvas p-4"
                                                    >
                                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                                            <div>
                                                                <p className="text-sm font-semibold text-text-primary">
                                                                    {
                                                                        topic.topic
                                                                    }
                                                                </p>

                                                                <p className="mt-1 text-xs text-text-muted">
                                                                    Latest wrong:{" "}
                                                                    {formatDateTime(
                                                                        topic.lastWrongAt,
                                                                    )}
                                                                </p>
                                                            </div>

                                                            <Badge
                                                                variant={
                                                                    topic.unresolvedCount >
                                                                    0
                                                                        ? "warning"
                                                                        : "success"
                                                                }
                                                            >
                                                                {
                                                                    topic.unresolvedCount
                                                                }{" "}
                                                                unresolved
                                                            </Badge>
                                                        </div>

                                                        <p className="mt-3 text-sm leading-6 text-text-secondary">
                                                            {
                                                                topic.wrongCount
                                                            }{" "}
                                                            wrong answers ·{" "}
                                                            {
                                                                topic.resolvedCount
                                                            }{" "}
                                                            resolved ·{" "}
                                                            {
                                                                topic.relatedQuizCount
                                                            }{" "}
                                                            related quizzes
                                                        </p>
                                                    </article>
                                                ),
                                            )}

                                            {selectedCourse ? (
                                                <Link
                                                    to={`/courses/${selectedCourse.id}/flashcards/study?mode=weak`}
                                                    className={buttonVariants({
                                                        variant:
                                                            "secondary",
                                                        size: "sm",
                                                    })}
                                                >
                                                    Review weak-topic flashcards
                                                    <ArrowRight
                                                        className="size-4"
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                            ) : null}
                                        </div>
                                    ) : null}
                                </CardContent>
                            </Card>

                            <Card className="shadow-none">
                                <CardHeader>
                                    <CardTitle>
                                        Recommendations
                                    </CardTitle>

                                    <CardDescription>
                                        Suggested next steps for
                                        this course.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent>
                                    {recommendationsQuery.isPending ? (
                                        <div className="space-y-3">
                                            {[
                                                "rec-a",
                                                "rec-b",
                                                "rec-c",
                                            ].map((item) => (
                                                <div
                                                    key={item}
                                                    className="h-24 rounded-2xl bg-surface-muted"
                                                />
                                            ))}
                                        </div>
                                    ) : null}

                                    {recommendationsQuery.isError ? (
                                        <ErrorState
                                            compact
                                            title="Recommendations could not be loaded"
                                            message={
                                                toApiError(
                                                    recommendationsQuery.error,
                                                ).message
                                            }
                                            onRetry={() => {
                                                void recommendationsQuery.refetch();
                                            }}
                                        />
                                    ) : null}

                                    {!recommendationsQuery.isPending &&
                                    !recommendationsQuery.isError &&
                                    recommendations.length === 0 ? (
                                        <EmptyState
                                            compact
                                            icon={Target}
                                            title="No recommendations yet"
                                            description="Complete more study actions to generate recommendations."
                                        />
                                    ) : null}

                                    {!recommendationsQuery.isPending &&
                                    !recommendationsQuery.isError &&
                                    recommendations.length > 0 ? (
                                        <ol className="space-y-3">
                                            {recommendations
                                                .slice()
                                                .sort(
                                                    (
                                                        first,
                                                        second,
                                                    ) =>
                                                        first.priority -
                                                        second.priority,
                                                )
                                                .map(
                                                    (
                                                        recommendation,
                                                    ) => (
                                                        <li
                                                            key={`${recommendation.type}-${recommendation.priority}-${recommendation.topic ?? "none"}`}
                                                            className="rounded-2xl border border-line bg-canvas p-4"
                                                        >
                                                            <div className="flex flex-wrap items-start justify-between gap-3">
                                                                <div>
                                                                    <p className="text-sm font-semibold text-text-primary">
                                                                        {
                                                                            recommendation.action
                                                                        }
                                                                    </p>

                                                                    <p className="mt-1 text-xs text-text-muted">
                                                                        {
                                                                            recommendation.type
                                                                        }
                                                                        {recommendation.topic
                                                                            ? ` · ${recommendation.topic}`
                                                                            : ""}
                                                                    </p>
                                                                </div>

                                                                <Badge variant="neutral">
                                                                    Priority{" "}
                                                                    {
                                                                        recommendation.priority
                                                                    }
                                                                </Badge>
                                                            </div>

                                                            <p className="mt-3 text-sm leading-6 text-text-secondary">
                                                                {
                                                                    recommendation.reason
                                                                }
                                                            </p>

                                                            {selectedCourse ? (
                                                                <Link
                                                                    to={`/courses/${selectedCourse.id}/study`}
                                                                    className={buttonVariants({
                                                                        variant:
                                                                            "secondary",
                                                                        size: "sm",
                                                                    })}
                                                                >
                                                                    Open Study Hub
                                                                    <ArrowRight
                                                                        className="size-4"
                                                                        aria-hidden="true"
                                                                    />
                                                                </Link>
                                                            ) : null}
                                                        </li>
                                                    ),
                                                )}
                                        </ol>
                                    ) : null}
                                </CardContent>
                            </Card>
                        </div>

                        <Card className="shadow-none">
                            <CardHeader>
                                <CardTitle>
                                    Course recent activity
                                </CardTitle>

                                <CardDescription>
                                    Latest activity recorded for
                                    the selected course.
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <CourseActivityList
                                    activities={
                                        progress.recentActivity
                                    }
                                />
                            </CardContent>
                        </Card>
                    </>
                ) : null}
            </CardContent>
        </Card>
    );
}