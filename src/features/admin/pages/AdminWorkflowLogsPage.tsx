import {
    ArrowLeft,
    ChevronLeft,
    ChevronRight,
    RefreshCw,
    Search,
    SlidersHorizontal,
    Workflow,
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
import { useAdminWorkflowLogsQuery } from "@/features/admin/api";
import type {
    AdminWorkflowStatus,
    WorkflowRunLogResponse,
} from "@/features/admin/model";
import { toApiError } from "@/lib/errors/ApiError";

const LOG_LIMIT = 20;

type WorkflowStatusFilter =
    | "ALL"
    | AdminWorkflowStatus;

function formatMilliseconds(value: number | null) {
    if (value === null) {
        return "—";
    }

    if (value < 1_000) {
        return `${Math.round(value)} ms`;
    }

    return `${(value / 1_000).toFixed(1)} s`;
}

function formatDateTime(value: string | null) {
    if (!value) {
        return "—";
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

function parseWorkflowStatus(
    value: string | null,
): WorkflowStatusFilter {
    if (
        value === "RUNNING" ||
        value === "SUCCESS" ||
        value === "FAILED"
    ) {
        return value;
    }

    return "ALL";
}

function getStatusBadgeVariant(
    status: AdminWorkflowStatus,
) {
    if (status === "SUCCESS") {
        return "success";
    }

    if (status === "FAILED") {
        return "destructive";
    }

    return "warning";
}

function WorkflowLogTable({
                              workflows,
                          }: {
    workflows: WorkflowRunLogResponse[];
}) {
    if (workflows.length === 0) {
        return (
            <EmptyState
                compact
                icon={Workflow}
                title="No workflow logs"
                description="No workflow runs matched the current filters."
            />
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
                <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-text-muted">
                    <th className="py-3 pr-4 font-medium">
                        Run
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Workflow
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        User / Course
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Status
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Steps
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Duration
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Started
                    </th>
                    <th className="py-3 pr-4 font-medium">
                        Completed
                    </th>
                </tr>
                </thead>

                <tbody className="divide-y divide-line">
                {workflows.map((workflow) => (
                    <tr key={workflow.id}>
                        <td className="py-3 pr-4 align-top">
                            <p className="font-medium text-text-primary">
                                #{workflow.id}
                            </p>

                            {workflow.errorMessage ? (
                                <p className="mt-2 line-clamp-2 max-w-[18rem] text-xs leading-5 text-red-700">
                                    {workflow.errorMessage}
                                </p>
                            ) : null}
                        </td>

                        <td className="py-3 pr-4 align-top">
                            <Badge variant="info">
                                {workflow.workflowType}
                            </Badge>
                        </td>

                        <td className="py-3 pr-4 align-top text-text-secondary">
                            <p>user {workflow.userId}</p>

                            <p className="mt-1 text-xs text-text-muted">
                                {workflow.courseId
                                    ? `course ${workflow.courseId}`
                                    : "no course"}
                            </p>
                        </td>

                        <td className="py-3 pr-4 align-top">
                            <Badge
                                variant={getStatusBadgeVariant(
                                    workflow.status,
                                )}
                            >
                                {workflow.status}
                            </Badge>
                        </td>

                        <td className="py-3 pr-4 align-top text-text-secondary">
                            {workflow.stepCount}
                        </td>

                        <td className="py-3 pr-4 align-top text-text-secondary">
                            {formatMilliseconds(
                                workflow.durationMs,
                            )}
                        </td>

                        <td className="py-3 pr-4 align-top text-text-secondary">
                            {formatDateTime(
                                workflow.startedAt,
                            )}
                        </td>

                        <td className="py-3 pr-4 align-top text-text-secondary">
                            {formatDateTime(
                                workflow.completedAt,
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export function AdminWorkflowLogsPage() {
    const [
        searchParams,
        setSearchParams,
    ] = useSearchParams();

    const workflowType =
        searchParams.get("workflowType") ?? "";

    const statusFilter =
        parseWorkflowStatus(
            searchParams.get("status"),
        );

    const page =
        parsePage(searchParams.get("page"));

    const offset =
        (page - 1) * LOG_LIMIT;

    const workflowLogsQuery =
        useAdminWorkflowLogsQuery({
            workflowType:
                workflowType.trim() || undefined,
            status:
                statusFilter === "ALL"
                    ? undefined
                    : statusFilter,
            limit: LOG_LIMIT,
            offset,
        });

    const workflows =
        workflowLogsQuery.data ?? [];

    const hasPreviousPage =
        page > 1;

    const hasNextPage =
        workflows.length === LOG_LIMIT;

    function updateSearchParameter(
        name: string,
        value: string,
    ) {
        const nextSearchParams =
            new URLSearchParams(
                searchParams,
            );

        if (
            value.trim() === "" ||
            value === "ALL"
        ) {
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
        statusFilter !== "ALL";

    return (
        <main className="min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
            <section className="mx-auto max-w-7xl space-y-6">
                <PageHeader
                    eyebrow={
                        <Badge variant="ai">
                            <Workflow
                                className="size-3.5"
                                aria-hidden="true"
                            />
                            Admin workflows
                        </Badge>
                    }
                    title="Workflow Logs"
                    description="Inspect workflow run status, duration, step count and errors."
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
                                    workflowLogsQuery.isFetching
                                }
                                onClick={() => {
                                    void workflowLogsQuery.refetch();
                                }}
                            >
                                <RefreshCw
                                    className={[
                                        "size-4",
                                        workflowLogsQuery.isFetching
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
                                    htmlFor="admin-workflow-type-filter"
                                >
                                    Workflow type
                                </label>

                                <div className="relative">
                                    <Search
                                        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-text-muted"
                                        aria-hidden="true"
                                    />

                                    <Input
                                        id="admin-workflow-type-filter"
                                        className="pl-10"
                                        placeholder="Filter workflow, e.g. REVISION_PACK, CHECKLIST"
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
                                value={statusFilter}
                                onChange={(event) => {
                                    updateSearchParameter(
                                        "status",
                                        event.target.value,
                                    );
                                }}
                                className="h-11 rounded-lg border border-line bg-surface px-3 text-sm text-text-primary outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                                aria-label="Workflow status filter"
                            >
                                <option value="ALL">
                                    All statuses
                                </option>
                                <option value="RUNNING">
                                    RUNNING
                                </option>
                                <option value="SUCCESS">
                                    SUCCESS
                                </option>
                                <option value="FAILED">
                                    FAILED
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
                        {workflowLogsQuery.isPending ? (
                            <div className="space-y-3 p-5">
                                {Array.from({
                                    length: 6,
                                }).map((_, index) => (
                                    <div
                                        key={`workflow-log-skeleton-${index}`}
                                        className="h-16 rounded-2xl bg-surface-muted"
                                    />
                                ))}
                            </div>
                        ) : null}

                        {workflowLogsQuery.isError ? (
                            <div className="p-5">
                                <ErrorState
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
                            </div>
                        ) : null}

                        {!workflowLogsQuery.isPending &&
                        !workflowLogsQuery.isError ? (
                            <WorkflowLogTable
                                workflows={workflows}
                            />
                        ) : null}
                    </CardContent>
                </Card>

                <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm text-text-secondary">
                        Page {page} · showing{" "}
                        <strong>{workflows.length}</strong>{" "}
                        workflow runs
                    </p>

                    <div className="flex gap-2">
                        <Button
                            variant="secondary"
                            disabled={
                                !hasPreviousPage ||
                                workflowLogsQuery.isFetching
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
                                workflowLogsQuery.isFetching
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
            </section>
        </main>
    );
}