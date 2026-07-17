import type { LucideIcon } from "lucide-react";
import {
    Activity,
    ArrowRight,
    Brain,
    Clock,
    Database,
    Gauge,
    RefreshCw,
    ServerCog,
    ShieldCheck,
    Timer,
    Workflow,
    Zap,
} from "lucide-react";
import {
    useState,
} from "react";
import { Link } from "react-router";

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
import {
    useAdminAiMetricsQuery,
    useAdminAiRequestLogsQuery,
    useAdminCacheMetricsQuery,
    useAdminWorkflowLogsQuery,
} from "@/features/admin/api";
import type {
    AdminDaysRange,
    AiRequestLogResponse,
    RecentAiFailure,
    WorkflowRunLogResponse,
    WorkflowUsageMetric,
} from "@/features/admin/model";
import { toApiError } from "@/lib/errors/ApiError";

type MetricCardProps = {
    label: string;
    value: string;
    description: string;
    icon: LucideIcon;
    variant?: "default" | "success" | "warning";
};

const dayOptions: AdminDaysRange[] = [
    1,
    7,
    30,
];

function formatNumber(value: number) {
    return new Intl.NumberFormat().format(value);
}

function formatPercent(value: number) {
    return `${Math.round(value)}%`;
}

function formatMilliseconds(value: number | null) {
    if (value === null) {
        return "—";
    }

    if (value < 1_000) {
        return `${Math.round(value)} ms`;
    }

    return `${(value / 1_000).toFixed(1)} s`;
}

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

function MetricCard({
                        label,
                        value,
                        description,
                        icon: Icon,
                        variant = "default",
                    }: MetricCardProps) {
    const iconClassName =
        variant === "success"
            ? "bg-emerald-50 text-emerald-700"
            : variant === "warning"
                ? "bg-amber-50 text-amber-700"
                : "bg-brand-50 text-brand-700";

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
                        className={[
                            "grid size-10 shrink-0 place-items-center rounded-xl",
                            iconClassName,
                        ].join(" ")}
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

function WorkflowUsageList({
                               usage,
                           }: {
    usage: WorkflowUsageMetric[];
}) {
    if (usage.length === 0) {
        return (
            <EmptyState
                compact
                icon={Workflow}
                title="No workflow usage yet"
                description="AI workflow usage will appear after users generate answers, summaries, quizzes or flashcards."
            />
        );
    }

    const maxRequestCount = Math.max(
        ...usage.map((item) => item.requestCount),
        1,
    );

    return (
        <div className="space-y-3">
            {usage
                .slice()
                .sort(
                    (first, second) =>
                        second.requestCount -
                        first.requestCount,
                )
                .map((item) => {
                    const width = Math.round(
                        (item.requestCount /
                            maxRequestCount) *
                        100,
                    );

                    return (
                        <article
                            key={item.workflowType}
                            className="rounded-2xl border border-line bg-canvas p-4"
                        >
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="text-sm font-semibold text-text-primary">
                                        {item.workflowType}
                                    </p>

                                    <p className="mt-1 text-xs text-text-muted">
                                        {item.failedCount} failed ·{" "}
                                        {formatNumber(
                                            item.totalTokens,
                                        )}{" "}
                                        tokens
                                    </p>
                                </div>

                                <Badge variant="info">
                                    {item.requestCount} requests
                                </Badge>
                            </div>

                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-surface-muted">
                                <div
                                    className="h-full bg-brand-700"
                                    style={{
                                        width: `${width}%`,
                                    }}
                                />
                            </div>

                            <p className="mt-3 text-xs text-text-muted">
                                Avg latency{" "}
                                {formatMilliseconds(
                                    item.averageLatencyMs,
                                )}
                            </p>
                        </article>
                    );
                })}
        </div>
    );
}

function RecentFailuresList({
                                failures,
                            }: {
    failures: RecentAiFailure[];
}) {
    if (failures.length === 0) {
        return (
            <EmptyState
                compact
                icon={ShieldCheck}
                title="No recent failures"
                description="No AI failures were recorded in the selected date range."
            />
        );
    }

    return (
        <div className="space-y-3">
            {failures.map((failure) => (
                <article
                    key={failure.id}
                    className="rounded-2xl border border-red-200 bg-red-50 p-4"
                >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-red-950">
                                {failure.workflowType}
                            </p>

                            <p className="mt-1 text-xs text-red-800">
                                {failure.modelName} · user{" "}
                                {failure.userId}
                                {failure.courseId
                                    ? ` · course ${failure.courseId}`
                                    : ""}
                            </p>
                        </div>

                        <Badge variant="destructive">
                            {failure.errorType ??
                                "ERROR"}
                        </Badge>
                    </div>

                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-red-900">
                        {failure.errorMessage ??
                            "No error message returned."}
                    </p>

                    <p className="mt-3 text-xs text-red-700">
                        {formatDateTime(
                            failure.createdAt,
                        )}
                    </p>
                </article>
            ))}
        </div>
    );
}

function RecentRequestPreview({
                                  logs,
                              }: {
    logs: AiRequestLogResponse[];
}) {
    if (logs.length === 0) {
        return (
            <EmptyState
                compact
                icon={Activity}
                title="No AI request logs"
                description="AI requests will appear here after users run RAG, summary, quiz or flashcard workflows."
            />
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-text-muted">
                    <th className="py-3 pr-4 font-medium">
                        Workflow
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Model
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Latency
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Tokens
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Cache
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Status
                    </th>
                </tr>
                </thead>

                <tbody className="divide-y divide-line">
                {logs.map((log) => (
                    <tr key={log.id}>
                        <td className="py-3 pr-4">
                            <p className="font-medium text-text-primary">
                                {log.workflowType}
                            </p>

                            <p className="text-xs text-text-muted">
                                {formatDateTime(
                                    log.createdAt,
                                )}
                            </p>
                        </td>

                        <td className="py-3 pr-4 text-text-secondary">
                            {log.modelName}
                        </td>

                        <td className="py-3 pr-4 text-text-secondary">
                            {formatMilliseconds(
                                log.latencyMs,
                            )}
                        </td>

                        <td className="py-3 pr-4 text-text-secondary">
                            {formatNumber(
                                log.totalTokens,
                            )}
                        </td>

                        <td className="py-3 pr-4">
                            <Badge
                                variant={
                                    log.cacheHit
                                        ? "success"
                                        : "neutral"
                                }
                            >
                                {log.cacheHit
                                    ? "HIT"
                                    : "MISS"}
                            </Badge>
                        </td>

                        <td className="py-3 pr-4">
                            <Badge
                                variant={
                                    log.errorType
                                        ? "destructive"
                                        : "success"
                                }
                            >
                                {log.errorType
                                    ? "FAILED"
                                    : "SUCCESS"}
                            </Badge>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

function RecentWorkflowPreview({
                                   workflows,
                               }: {
    workflows: WorkflowRunLogResponse[];
}) {
    if (workflows.length === 0) {
        return (
            <EmptyState
                compact
                icon={Workflow}
                title="No workflow runs"
                description="Workflow runs will appear after coordinator or generation actions are executed."
            />
        );
    }

    return (
        <div className="space-y-3">
            {workflows.map((workflow) => (
                <article
                    key={workflow.id}
                    className="rounded-2xl border border-line bg-canvas p-4"
                >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-text-primary">
                                #{workflow.id} ·{" "}
                                {workflow.workflowType}
                            </p>

                            <p className="mt-1 text-xs text-text-muted">
                                user {workflow.userId}
                                {workflow.courseId
                                    ? ` · course ${workflow.courseId}`
                                    : ""}{" "}
                                · {workflow.stepCount} steps
                            </p>
                        </div>

                        <Badge
                            variant={
                                workflow.status === "SUCCESS"
                                    ? "success"
                                    : workflow.status === "FAILED"
                                        ? "destructive"
                                        : "warning"
                            }
                        >
                            {workflow.status}
                        </Badge>
                    </div>

                    <p className="mt-3 text-sm text-text-secondary">
                        Duration{" "}
                        {formatMilliseconds(
                            workflow.durationMs,
                        )}
                    </p>

                    {workflow.errorMessage ? (
                        <p className="mt-2 line-clamp-2 rounded-xl bg-red-50 px-3 py-2 text-sm leading-6 text-red-800">
                            {workflow.errorMessage}
                        </p>
                    ) : null}
                </article>
            ))}
        </div>
    );
}

export function AdminMetricsPage() {
    const [
        days,
        setDays,
    ] = useState<AdminDaysRange>(7);

    const aiMetricsQuery =
        useAdminAiMetricsQuery(days);

    const cacheMetricsQuery =
        useAdminCacheMetricsQuery(days);

    const requestLogsQuery =
        useAdminAiRequestLogsQuery({
            limit: 5,
            offset: 0,
        });

    const workflowLogsQuery =
        useAdminWorkflowLogsQuery({
            limit: 5,
            offset: 0,
        });

    const isFetching =
        aiMetricsQuery.isFetching ||
        cacheMetricsQuery.isFetching ||
        requestLogsQuery.isFetching ||
        workflowLogsQuery.isFetching;

    function handleRefresh() {
        void aiMetricsQuery.refetch();
        void cacheMetricsQuery.refetch();
        void requestLogsQuery.refetch();
        void workflowLogsQuery.refetch();
    }

    if (
        aiMetricsQuery.isPending ||
        cacheMetricsQuery.isPending
    ) {
        return (
            <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-7xl space-y-6">
                    <div className="h-28 rounded-3xl bg-surface-muted" />

                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        {[
                            "a",
                            "b",
                            "c",
                            "d",
                            "e",
                            "f",
                            "g",
                            "h",
                        ].map((item) => (
                            <div
                                key={item}
                                className="h-36 rounded-2xl bg-surface-muted"
                            />
                        ))}
                    </div>

                    <div className="grid gap-5 lg:grid-cols-2">
                        <div className="h-96 rounded-3xl bg-surface-muted" />
                        <div className="h-96 rounded-3xl bg-surface-muted" />
                    </div>
                </section>
            </main>
        );
    }

    if (
        aiMetricsQuery.isError ||
        cacheMetricsQuery.isError
    ) {
        const error =
            aiMetricsQuery.error ??
            cacheMetricsQuery.error;

        return (
            <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
                <section className="mx-auto max-w-7xl">
                    <ErrorState
                        title="Admin metrics could not be loaded"
                        message={
                            toApiError(error).message
                        }
                        onRetry={handleRefresh}
                    />
                </section>
            </main>
        );
    }

    const aiMetrics =
        aiMetricsQuery.data;

    const cacheMetrics =
        cacheMetricsQuery.data;

    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-7xl space-y-6">
                <PageHeader
                    eyebrow={
                        <Badge variant="ai">
                            <ServerCog
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Admin observability
                        </Badge>
                    }
                    title="AI & Cache Metrics"
                    description="Monitor AI requests, latency, token usage, retrieval behavior, cache hit rate and workflow health."
                    actions={
                        <div className="flex flex-wrap gap-3">
                            <select
                                value={days}
                                onChange={(event) => {
                                    setDays(
                                        Number(
                                            event.target
                                                .value,
                                        ) as AdminDaysRange,
                                    );
                                }}
                                className="h-10 rounded-lg border border-line bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                                aria-label="Metrics date range"
                            >
                                {dayOptions.map(
                                    (option) => (
                                        <option
                                            key={option}
                                            value={option}
                                        >
                                            Last {option}{" "}
                                            {option === 1
                                                ? "day"
                                                : "days"}
                                        </option>
                                    ),
                                )}
                            </select>

                            <Button
                                variant="secondary"
                                disabled={isFetching}
                                onClick={handleRefresh}
                            >
                                <RefreshCw
                                    className={[
                                        "size-4",
                                        isFetching
                                            ? "animate-spin"
                                            : "",
                                    ].join(" ")}
                                    aria-hidden="true"
                                />
                                Refresh
                            </Button>
                        </div>
                    }
                />

                <section
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    aria-label="AI metrics"
                >
                    <MetricCard
                        icon={Brain}
                        label="AI requests"
                        value={formatNumber(
                            aiMetrics.totalRequests,
                        )}
                        description={`${formatNumber(
                            aiMetrics.successCount,
                        )} success · ${formatNumber(
                            aiMetrics.failedCount,
                        )} failed`}
                    />

                    <MetricCard
                        icon={ShieldCheck}
                        label="Success rate"
                        value={formatPercent(
                            aiMetrics.successRate,
                        )}
                        description="Returned as backend percentage"
                        variant={
                            aiMetrics.successRate >= 90
                                ? "success"
                                : "warning"
                        }
                    />

                    <MetricCard
                        icon={Timer}
                        label="Average latency"
                        value={formatMilliseconds(
                            aiMetrics.averageLatencyMs,
                        )}
                        description={`Max latency ${formatMilliseconds(
                            aiMetrics.maxLatencyMs,
                        )}`}
                    />

                    <MetricCard
                        icon={Zap}
                        label="Total tokens"
                        value={formatNumber(
                            aiMetrics.totalTokens,
                        )}
                        description={`${aiMetrics.averageRetrievedChunkCount.toFixed(
                            1,
                        )} avg retrieved chunks`}
                    />
                </section>

                <section
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    aria-label="Cache metrics"
                >
                    <MetricCard
                        icon={Database}
                        label="RAG requests"
                        value={formatNumber(
                            cacheMetrics.ragRequestCount,
                        )}
                        description="Requests eligible for RAG cache metrics"
                    />

                    <MetricCard
                        icon={Gauge}
                        label="Cache hit rate"
                        value={formatPercent(
                            cacheMetrics.cacheHitRate,
                        )}
                        description={`${formatNumber(
                            cacheMetrics.cacheHitCount,
                        )} hit · ${formatNumber(
                            cacheMetrics.cacheMissCount,
                        )} miss`}
                        variant={
                            cacheMetrics.cacheHitRate >= 40
                                ? "success"
                                : "warning"
                        }
                    />

                    <MetricCard
                        icon={Clock}
                        label="Hit latency"
                        value={formatMilliseconds(
                            cacheMetrics.averageCacheHitLatencyMs,
                        )}
                        description="Average latency for cache hits"
                    />

                    <MetricCard
                        icon={Clock}
                        label="Miss latency"
                        value={formatMilliseconds(
                            cacheMetrics.averageCacheMissLatencyMs,
                        )}
                        description={`${cacheMetrics.averageRetrievedChunkCount.toFixed(
                            1,
                        )} avg retrieved chunks`}
                    />
                </section>

                <div className="grid gap-5 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Workflow usage
                            </CardTitle>

                            <CardDescription>
                                Request volume, failures, tokens
                                and latency grouped by workflow.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <WorkflowUsageList
                                usage={
                                    aiMetrics.workflowUsage
                                }
                            />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>
                                Recent AI failures
                            </CardTitle>

                            <CardDescription>
                                Latest failed AI requests in the
                                selected date range.
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <RecentFailuresList
                                failures={
                                    aiMetrics.recentFailures
                                }
                            />
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)]">
                    <Card>
                        <CardHeader>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <CardTitle>
                                        Recent AI requests
                                    </CardTitle>

                                    <CardDescription>
                                        Preview of the latest
                                        request logs. Full filterable
                                        table comes in M65 second
                                        half.
                                    </CardDescription>
                                </div>

                                <Link
                                    to="/admin/requests"
                                    className={buttonVariants({
                                        variant: "secondary",
                                        size: "sm",
                                    })}
                                >
                                    Full logs
                                    <ArrowRight
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {requestLogsQuery.isError ? (
                                <ErrorState
                                    compact
                                    title="AI request logs could not be loaded"
                                    message={
                                        toApiError(
                                            requestLogsQuery.error,
                                        ).message
                                    }
                                    onRetry={() => {
                                        void requestLogsQuery.refetch();
                                    }}
                                />
                            ) : (
                                <RecentRequestPreview
                                    logs={
                                        requestLogsQuery.data ??
                                        []
                                    }
                                />
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <CardTitle>
                                        Recent workflow runs
                                    </CardTitle>

                                    <CardDescription>
                                        Preview of workflow run
                                        status, duration and step
                                        count.
                                    </CardDescription>
                                </div>

                                <Link
                                    to="/admin/workflows"
                                    className={buttonVariants({
                                        variant: "secondary",
                                        size: "sm",
                                    })}
                                >
                                    Full logs
                                    <ArrowRight
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </div>
                        </CardHeader>

                        <CardContent>
                            {workflowLogsQuery.isError ? (
                                <ErrorState
                                    compact
                                    title="Workflow logs could not be loaded"
                                    message={
                                        toApiError(
                                            workflowLogsQuery.error,
                                        ).message
                                    }
                                    onRetry={() => {
                                        void workflowLogsQuery.refetch();
                                    }}
                                />
                            ) : (
                                <RecentWorkflowPreview
                                    workflows={
                                        workflowLogsQuery.data ??
                                        []
                                    }
                                />
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                                M65 first half complete
                            </p>

                            <h2 className="mt-2 text-lg font-semibold text-text-primary">
                                Admin observability dashboard is connected
                            </h2>

                            <p className="mt-2 max-w-3xl text-sm leading-6 text-text-secondary">
                                This page now shows AI request
                                volume, success rate, latency,
                                tokens, cache metrics, workflow
                                usage, recent failures and log
                                previews.
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