import type { LucideIcon } from "lucide-react";
import {
    Activity,
    ArrowRight,
    CheckSquare2,
    CircleAlert,
    FileText,
    HelpCircle,
    MessageSquareText,
    Sparkles,
    Target,
    Trophy,
} from "lucide-react";
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
import { useCourseOverviewQuery } from "@/features/courses/api";
import { CourseOverviewSkeleton } from "@/features/courses/components/CourseOverviewSkeleton";
import { useCourseContext } from "@/features/courses/layouts/CourseLayout";
import { cn } from "@/lib/utils/cn";

type MetricCardProps = {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
};

function MetricCard({
                        label,
                        value,
                        description,
                        icon: Icon,
                    }: MetricCardProps) {
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

function formatDateTime(
    value: string,
): string {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Recently";
    }

    return new Intl.DateTimeFormat(
        undefined,
        {
            dateStyle: "medium",
            timeStyle: "short",
        },
    ).format(date);
}

export function CourseOverviewPage() {
    const { course } =
        useCourseContext();

    const overviewQuery =
        useCourseOverviewQuery(course.id);

    if (overviewQuery.isPending) {
        return <CourseOverviewSkeleton />;
    }

    if (overviewQuery.isError) {
        return (
            <ErrorState
                title="Course overview could not be loaded"
                message={
                    overviewQuery.error instanceof Error
                        ? overviewQuery.error.message
                        : "The course overview request failed."
                }
                onRetry={() => {
                    void overviewQuery.refetch();
                }}
            />
        );
    }

    const overview =
        overviewQuery.data;

    const stats = overview.stats;

    const averageQuizScore =
        stats.quizAttemptCount > 0 &&
        stats.averageQuizScore !== null
            ? `${stats.averageQuizScore.toFixed(
                0,
            )}%`
            : "—";

    const implementedPaths = new Set([
        `/courses/${course.id}`,
        `/courses/${course.id}/documents`,
    ]);

    return (
        <div className="space-y-6">
            <section
                aria-labelledby="course-actions-title"
            >
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2
                            id="course-actions-title"
                            className="text-lg font-semibold text-text-primary"
                        >
                            Quick actions
                        </h2>

                        <p className="mt-1 text-sm text-text-secondary">
                            Continue building this course workspace.
                        </p>
                    </div>

                    <Badge variant="success">
                        Overview ready
                    </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                        className={cn(
                            buttonVariants({
                                variant: "primary",
                            }),
                        )}
                        to={`/courses/${course.id}/documents`}
                    >
                        <FileText
                            className="size-4"
                            aria-hidden="true"
                        />
                        Upload documents
                    </Link>

                    <Button
                        disabled
                        variant="secondary"
                    >
                        <MessageSquareText
                            className="size-4"
                            aria-hidden="true"
                        />
                        Ask AI · M61
                    </Button>

                    <Button
                        disabled
                        variant="ai"
                    >
                        <Sparkles
                            className="size-4"
                            aria-hidden="true"
                        />
                        Generate quiz · M64
                    </Button>
                </div>
            </section>

            <section
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                aria-label="Course metrics"
            >
                <MetricCard
                    icon={FileText}
                    label="Documents"
                    value={`${stats.readyDocumentCount}/${stats.documentCount}`}
                    description={`${stats.processingDocumentCount} processing · ${stats.failedDocumentCount} failed`}
                />

                <MetricCard
                    icon={Trophy}
                    label="Average quiz score"
                    value={averageQuizScore}
                    description={`${stats.quizAttemptCount} completed attempts`}
                />

                <MetricCard
                    icon={CheckSquare2}
                    label="Study tasks"
                    value={`${stats.completedTaskCount}/${stats.taskCount}`}
                    description="Completed tasks in this course"
                />

                <MetricCard
                    icon={CircleAlert}
                    label="Unresolved mistakes"
                    value={`${stats.unresolvedWrongAnswerCount}`}
                    description={`${stats.wrongAnswerCount} wrong answers recorded`}
                />
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Recommended next actions
                        </CardTitle>

                        <CardDescription>
                            Suggestions calculated from real course
                            activity and learning state.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {overview.nextActions.length > 0 ? (
                            <ol className="space-y-3">
                                {overview.nextActions
                                    .slice()
                                    .sort(
                                        (first, second) =>
                                            first.priority -
                                            second.priority,
                                    )
                                    .map((action) => {
                                        const actionIsAvailable =
                                            implementedPaths.has(
                                                action.targetPath,
                                            );

                                        return (
                                            <li
                                                key={`${action.type}-${action.priority}-${action.title}`}
                                                className="rounded-xl border border-line bg-canvas p-4"
                                            >
                                                <div className="flex items-start gap-3">
                          <span
                              className="grid size-9 shrink-0 place-items-center rounded-xl bg-ai-50 text-ai-700"
                              aria-hidden="true"
                          >
                            <Target className="size-4" />
                          </span>

                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex flex-wrap items-start justify-between gap-2">
                                                            <p className="text-sm font-medium text-text-primary">
                                                                {action.title}
                                                            </p>

                                                            <Badge variant="neutral">
                                                                Priority{" "}
                                                                {action.priority}
                                                            </Badge>
                                                        </div>

                                                        <p className="mt-1 text-sm leading-6 text-text-secondary">
                                                            {action.reason}
                                                        </p>

                                                        {actionIsAvailable ? (
                                                            <Link
                                                                className={cn(
                                                                    "mt-3",
                                                                    buttonVariants({
                                                                        variant:
                                                                            "secondary",
                                                                        size: "sm",
                                                                    }),
                                                                )}
                                                                to={
                                                                    action.targetPath
                                                                }
                                                            >
                                                                {
                                                                    action.actionLabel
                                                                }

                                                                <ArrowRight
                                                                    className="size-4"
                                                                    aria-hidden="true"
                                                                />
                                                            </Link>
                                                        ) : (
                                                            <Badge
                                                                className="mt-3"
                                                                variant="warning"
                                                            >
                                                                Available in a later
                                                                module
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })}
                            </ol>
                        ) : (
                            <EmptyState
                                compact
                                icon={Target}
                                title="No recommendation yet"
                                description="Upload documents or complete learning activities to generate a useful next action."
                            />
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Weak topics
                        </CardTitle>

                        <CardDescription>
                            Topics based on recorded wrong answers.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {overview.weakTopics.length > 0 ? (
                            <ul className="space-y-3">
                                {overview.weakTopics.map(
                                    (weakTopic) => (
                                        <li
                                            key={weakTopic.topic}
                                            className="rounded-xl border border-line bg-canvas p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-medium text-text-primary">
                                                        {weakTopic.topic}
                                                    </p>

                                                    <p className="mt-1 text-xs text-text-muted">
                                                        {weakTopic.latestWrongAt
                                                            ? `Latest mistake ${formatDateTime(
                                                                weakTopic.latestWrongAt,
                                                            )}`
                                                            : "No recent date available"}
                                                    </p>
                                                </div>

                                                <Badge
                                                    variant={
                                                        weakTopic.unresolvedCount >
                                                        0
                                                            ? "warning"
                                                            : "success"
                                                    }
                                                >
                                                    {
                                                        weakTopic.unresolvedCount
                                                    }{" "}
                                                    unresolved
                                                </Badge>
                                            </div>

                                            <p className="mt-3 text-sm text-text-secondary">
                                                {
                                                    weakTopic.wrongCount
                                                }{" "}
                                                wrong answers recorded
                                            </p>
                                        </li>
                                    ),
                                )}
                            </ul>
                        ) : (
                            <EmptyState
                                compact
                                icon={HelpCircle}
                                title="No weak topics yet"
                                description="Weak topics will appear after quiz attempts and wrong-answer analysis."
                            />
                        )}
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        Recent activity
                    </CardTitle>

                    <CardDescription>
                        The latest learning events recorded for
                        this course.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {overview.recentActivities.length >
                    0 ? (
                        <ol className="divide-y divide-line">
                            {overview.recentActivities.map(
                                (activity) => (
                                    <li
                                        key={activity.id}
                                        className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                                    >
                    <span
                        className="grid size-9 shrink-0 place-items-center rounded-xl bg-surface-muted text-text-muted"
                        aria-hidden="true"
                    >
                      <Activity className="size-4" />
                    </span>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-medium text-text-primary">
                                                {activity.title}
                                            </p>

                                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-text-muted">
                        <span>
                          {
                              activity.eventType
                          }
                        </span>

                                                {activity.topic ? (
                                                    <>
                            <span
                                aria-hidden="true"
                            >
                              ·
                            </span>

                                                        <span>
                              {activity.topic}
                            </span>
                                                    </>
                                                ) : null}

                                                <span
                                                    aria-hidden="true"
                                                >
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
                                ),
                            )}
                        </ol>
                    ) : (
                        <EmptyState
                            compact
                            icon={Activity}
                            title="No recent activity"
                            description="Course activity will appear after uploads, questions and study sessions."
                        />
                    )}
                </CardContent>
            </Card>

            <p className="text-right text-xs text-text-muted">
                Overview generated{" "}
                {formatDateTime(
                    overview.generatedAt,
                )}
            </p>
        </div>
    );
}