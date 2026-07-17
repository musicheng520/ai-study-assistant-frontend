import {
    Activity,
    AlertTriangle,
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Search,
    ShieldCheck,
    SlidersHorizontal,
    Zap,
} from "lucide-react";
import {
    Link,
    useSearchParams,
} from "react-router";

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
    Input,
    buttonVariants,
} from "@/components/ui";
import { useAdminAiRequestLogsQuery } from "@/features/admin/api";
import type { AiRequestLogResponse } from "@/features/admin/model";
import { toApiError } from "@/lib/errors/ApiError";

const LOG_LIMIT = 20;

type FailureFilter =
    | "all"
    | "failures";

function formatNumber(value: number) {
    return new Intl.NumberFormat().format(value);
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

function parsePage(value: string | null) {
    const parsed = Number(value);

    if (
        Number.isInteger(parsed) &&
        parsed > 0
    ) {
        return parsed;
    }

    return 1;
}

function getFailureFilter(
    value: string | null,
): FailureFilter {
    return value === "failures"
        ? "failures"
        : "all";
}

function AiRequestLogTable({
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
                description="No request logs matched the current filters."
            />
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
                <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-text-muted">
                    <th className="py-3 pr-4 font-medium">
                        Time
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Workflow
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        User / Course
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Model
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Tokens
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Latency
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Retrieval
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
                        <td className="py-3 pr-4 align-top">
                            <p className="font-medium text-text-primary">
                                #{log.id}
                            </p>

                            <p className="mt-1 text-xs text-text-muted">
                                {formatDateTime(
                                    log.createdAt,
                                )}
                            </p>
                        </td>

                        <td className="py-3 pr-4 align-top">
                            <Badge variant="info">
                                {log.workflowType}
                            </Badge>
                        </td>

                        <td className="py-3 pr-4 align-top text-text-secondary">
                            <p>user {log.userId}</p>

                            <p className="mt-1 text-xs text-text-muted">
                                {log.courseId
                                    ? `course ${log.courseId}`
                                    : "no course"}
                            </p>
                        </td>

                        <td className="py-3 pr-4 align-top text-text-secondary">
                            {log.modelName}
                        </td>

                        <td className="py-3 pr-4 align-top text-text-secondary">
                            <p>
                                total{" "}
                                {formatNumber(
                                    log.totalTokens,
                                )}
                            </p>

                            <p className="mt-1 text-xs text-text-muted">
                                {formatNumber(
                                    log.promptTokens,
                                )}{" "}
                                prompt ·{" "}
                                {formatNumber(
                                    log.completionTokens,
                                )}{" "}
                                completion
                            </p>
                        </td>

                        <td className="py-3 pr-4 align-top text-text-secondary">
                            {formatMilliseconds(
                                log.latencyMs,
                            )}
                        </td>

                        <td className="py-3 pr-4 align-top text-text-secondary">
                            {log.retrievedChunkCount} chunks
                        </td>

                        <td className="py-3 pr-4 align-top">
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

                        <td className="py-3 pr-4 align-top">
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

                            {log.errorMessage ? (
                                <p className="mt-2 line-clamp-2 max-w-[18rem] text-xs leading-5 text-red-700">
                                    {log.errorMessage}
                                </p>
                            ) : null}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export function AdminRequestLogsPage() {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const workflowType =
        searchParams.get("workflowType") ?? "";

    const failureFilter =
        getFailureFilter(
            searchParams.get("status"),
        );

    const page =
        parsePage(searchParams.get("page"));

    const offset =
        (page - 1) * LOG_LIMIT;

    const requestLogsQuery =
        useAdminAiRequestLogsQuery({
            workflowType:
                workflowType.trim() || undefined,
            onlyFailures:
                failureFilter === "failures"
                    ? true
                    : undefined,
            limit: LOG_LIMIT,
            offset,
        });

    const logs =
        requestLogsQuery.data ?? [];

    const hasPreviousPage =
        page > 1;

    const hasNextPage =
        logs.length === LOG_LIMIT;

    function updateSearchParameter(
        name: string,
        value: string,
    ) {
        const nextSearchParams =
            new URLSearchParams(
                searchParams,
            );

        if (value.trim() === "") {
            nextSearchParams.delete(name);
        } else {
            nextSearchParams.set(
                name,
                value,
            );
        }

        if (name !== "page") {
            nextSearchParams.set("page", "1");
        }

        setSearchParams(
            nextSearchParams,
            {
                replace: true,
                preventScrollReset: true,
            },
        );
    }

    function clearFilters() {
        setSearchParams(
            new URLSearchParams(),
            {
                replace: true,
                preventScrollReset: true,
            },
        );
    }

    function goToPage(nextPage: number) {
        updateSearchParameter(
            "page",
            String(nextPage),
        );
    }

    const filtersAreActive =
        workflowType.trim() !== "" ||
        failureFilter !== "all";

    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-7xl space-y-6">
                <PageHeader
                    eyebrow={
                        <Badge variant="ai">
                            <Zap
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Admin logs
                        </Badge>
                    }
                    title="AI Request Logs"
                    description="Inspect AI request latency, token usage, retrieval count, cache hit state and failures."
                    actions={
                        <div className="flex flex-wrap gap-3">
                            <Link
                                to="/admin"
                                className={buttonVariants({
                                    variant: "secondary",
                                    size: "sm",
                                })}
                            >
                                <ArrowLeft
                                    className="size-4"
                                    aria-hidden="true"
                                />
                                Back to admin
                            </Link>

                            <Button
                                variant="secondary"
                                disabled={
                                    requestLogsQuery.isFetching
                                }
                                onClick={() => {
                                    void requestLogsQuery.refetch();
                                }}
                            >
                                <RefreshCw
                                    className={[
                                        "size-4",
                                        requestLogsQuery.isFetching
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

                <Card>
                    <CardContent className="py-5">
                        <div className="flex items-center gap-2">
                            <SlidersHorizontal
                                className="size-4 text-text-muted"
                                aria-hidden="true"
                            />

                            <p className="text-sm font-medium text-text-primary">
                                Filters
                            </p>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-[minmax(0,1fr)_14rem_10rem]">
                            <div>
                                <label
                                    className="sr-only"
                                    htmlFor="admin-request-workflow-filter"
                                >
                                    Workflow type
                                </label>

                                <div className="relative">
                                    <Search
                                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                                        aria-hidden="true"
                                    />

                                    <Input
                                        id="admin-request-workflow-filter"
                                        className="pl-10"
                                        placeholder="Filter workflow, e.g. RAG_QA, SUMMARY, QUIZ"
                                        value={workflowType}
                                        onChange={(event) => {
                                            updateSearchParameter(
                                                "workflowType",
                                                event.target.value,
                                            );
                                        }}
                                    />
                                </div>
                            </div>

                            <select
                                value={failureFilter}
                                onChange={(event) => {
                                    updateSearchParameter(
                                        "status",
                                        event.target.value,
                                    );
                                }}
                                className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                                aria-label="Failure filter"
                            >
                                <option value="all">
                                    All requests
                                </option>
                                <option value="failures">
                                    Failures only
                                </option>
                            </select>

                            <Button
                                variant="ghost"
                                disabled={!filtersAreActive}
                                onClick={clearFilters}
                            >
                                Clear filters
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-0">
                        {requestLogsQuery.isPending ? (
                            <div className="space-y-3 p-5">
                                {Array.from({
                                    length: 6,
                                }).map((_, index) => (
                                    <div
                                        key={`request-log-skeleton-${index}`}
                                        className="h-16 rounded-2xl bg-surface-muted"
                                    />
                                ))}
                            </div>
                        ) : null}

                        {requestLogsQuery.isError ? (
                            <div className="p-5">
                                <ErrorState
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
                            </div>
                        ) : null}

                        {!requestLogsQuery.isPending &&
                        !requestLogsQuery.isError ? (
                            <AiRequestLogTable
                                logs={logs}
                            />
                        ) : null}
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-text-secondary">
                        Page {page} · showing{" "}
                        <strong>{logs.length}</strong>{" "}
                        logs
                    </p>

                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            disabled={
                                !hasPreviousPage ||
                                requestLogsQuery.isFetching
                            }
                            onClick={() => {
                                goToPage(page - 1);
                            }}
                        >
                            <ChevronLeft
                                className="size-4"
                                aria-hidden="true"
                            />
                            Previous
                        </Button>

                        <Button
                            variant="secondary"
                            disabled={
                                !hasNextPage ||
                                requestLogsQuery.isFetching
                            }
                            onClick={() => {
                                goToPage(page + 1);
                            }}
                        >
                            Next
                            <ChevronRight
                                className="size-4"
                                aria-hidden="true"
                            />
                        </Button>
                    </div>
                </div>

                <Card className="p-5 sm:p-6">
                    <div className="flex items-start gap-3">
                        {failureFilter === "failures" ? (
                            <AlertTriangle
                                className="mt-0.5 size-5 text-amber-700"
                                aria-hidden="true"
                            />
                        ) : (
                            <ShieldCheck
                                className="mt-0.5 size-5 text-emerald-700"
                                aria-hidden="true"
                            />
                        )}

                        <div>
                            <h2 className="text-sm font-semibold text-text-primary">
                                Admin access note
                            </h2>

                            <p className="mt-1 text-sm leading-6 text-text-secondary">
                                If this page returns 403, that is
                                expected for non-admin accounts.
                                Login with an ADMIN token to inspect
                                observability logs.
                            </p>
                        </div>
                    </div>
                </Card>
            </section>
        </main>
    );
}