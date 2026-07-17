import {
    Calendar,
    FileText,
    RefreshCcw,
} from "lucide-react";

import {
    Badge,
    Button,
    Card,
} from "@/components/ui";
import { useCourseSummariesQuery } from "@/features/summaries";

type SavedSummariesPanelProps = {
    courseId: number;
};

function formatDate(value: string) {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function SavedSummariesPanel({
                                        courseId,
                                    }: SavedSummariesPanelProps) {
    const summariesQuery =
        useCourseSummariesQuery(courseId);

    return (
        <Card className="overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line px-5 py-5 sm:px-6">
                <div>
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-text-muted">
                        <FileText
                            className="size-4"
                            aria-hidden="true"
                        />
                        Saved summaries
                    </p>

                    <h2 className="mt-2 text-xl font-semibold text-text-primary">
                        Summary library
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                        Saved summaries are persisted in MySQL
                        and can be revisited later.
                    </p>
                </div>

                <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                        void summariesQuery.refetch();
                    }}
                >
                    <RefreshCcw
                        className="size-4"
                        aria-hidden="true"
                    />
                    Refresh
                </Button>
            </div>

            <div className="p-5 sm:p-6">
                {summariesQuery.isPending ? (
                    <div className="space-y-3">
                        {Array.from({
                            length: 3,
                        }).map((_, index) => (
                            <div
                                key={`summary-skeleton-${index}`}
                                className="rounded-2xl border border-line p-4"
                                aria-hidden="true"
                            >
                                <div className="h-4 w-1/3 rounded bg-surface-muted" />
                                <div className="mt-4 h-3 w-full rounded bg-surface-muted" />
                                <div className="mt-2 h-3 w-5/6 rounded bg-surface-muted" />
                            </div>
                        ))}
                    </div>
                ) : null}

                {summariesQuery.isError ? (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-semibold text-red-900">
                            Failed to load saved summaries
                        </p>

                        <p className="mt-1 text-sm leading-6 text-red-800">
                            Try refreshing the summary library.
                        </p>
                    </div>
                ) : null}

                {!summariesQuery.isPending &&
                !summariesQuery.isError &&
                summariesQuery.data?.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-line bg-surface-muted p-6 text-center">
                        <div className="mx-auto grid size-12 place-items-center rounded-full bg-surface text-text-muted">
                            <FileText
                                className="size-5"
                                aria-hidden="true"
                            />
                        </div>

                        <h3 className="mt-4 text-base font-semibold text-text-primary">
                            No saved summaries yet
                        </h3>

                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                            Generate a draft summary above, then
                            save it to build your summary
                            library.
                        </p>
                    </div>
                ) : null}

                {!summariesQuery.isPending &&
                !summariesQuery.isError &&
                summariesQuery.data &&
                summariesQuery.data.length > 0 ? (
                    <div className="space-y-4">
                        {summariesQuery.data.map(
                            (summary) => (
                                <article
                                    key={summary.id}
                                    className="rounded-2xl border border-line bg-surface p-4"
                                >
                                    <div className="flex flex-wrap items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <Badge
                                                    variant={
                                                        summary.sourceScope ===
                                                        "COURSE"
                                                            ? "info"
                                                            : "neutral"
                                                    }
                                                >
                                                    {
                                                        summary.sourceScope
                                                    }
                                                </Badge>

                                                <span className="flex items-center gap-1 text-xs text-text-muted">
                                                    <Calendar
                                                        className="size-3.5"
                                                        aria-hidden="true"
                                                    />
                                                    {formatDate(
                                                        summary.createdAt,
                                                    )}
                                                </span>
                                            </div>

                                            <h3 className="mt-3 text-base font-semibold text-text-primary">
                                                {
                                                    summary.title
                                                }
                                            </h3>
                                        </div>
                                    </div>

                                    <p className="mt-3 line-clamp-4 whitespace-pre-wrap text-sm leading-6 text-text-secondary">
                                        {summary.summary}
                                    </p>

                                    {summary.keyConcepts.length >
                                    0 ? (
                                        <div className="mt-4 flex flex-wrap gap-2">
                                            {summary.keyConcepts
                                                .slice(0, 4)
                                                .map(
                                                    (
                                                        concept,
                                                    ) => (
                                                        <Badge
                                                            key={
                                                                concept.name
                                                            }
                                                            variant="neutral"
                                                        >
                                                            {
                                                                concept.name
                                                            }
                                                        </Badge>
                                                    ),
                                                )}
                                        </div>
                                    ) : null}
                                </article>
                            ),
                        )}
                    </div>
                ) : null}
            </div>
        </Card>
    );
}