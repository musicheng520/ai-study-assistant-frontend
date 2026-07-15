import {
    MessageSquare,
    Plus,
    RefreshCcw,
} from "lucide-react";

import {
    Badge,
    Button,
    Card,
} from "@/components/ui";
import { cn } from "@/lib/utils/cn";

import type { ChatSessionSummary } from "../model";

type ChatSessionListVariant =
    | "sidebar"
    | "compact";

type ChatSessionListProps = {
    sessions: ChatSessionSummary[];
    selectedSessionId: number | null;
    isLoading: boolean;
    isError: boolean;
    onRetry: () => void;
    onNewChat: () => void;
    onSelectSession: (
        sessionId: number,
    ) => void;
    variant?: ChatSessionListVariant;
};

function formatSessionTime(value: string) {
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

function getSessionTitle(
    session: ChatSessionSummary,
) {
    return session.title?.trim() || "New chat";
}

function getSessionPreview(
    session: ChatSessionSummary,
) {
    if (session.lastMessagePreview?.trim()) {
        return session.lastMessagePreview;
    }

    if (session.scopeType === "DOCUMENT") {
        return "Document-scoped chat";
    }

    return "Course-level chat";
}

function SessionSkeletonList({
                                 compact,
                             }: {
    compact: boolean;
}) {
    return (
        <div
            className={cn(
                compact
                    ? "flex gap-3 overflow-hidden"
                    : "space-y-3",
            )}
        >
            {Array.from({
                length: compact ? 3 : 5,
            }).map((_, index) => (
                <div
                    key={index}
                    className={cn(
                        "rounded-xl border border-line bg-surface p-3",
                        compact
                            ? "min-w-64"
                            : "w-full",
                    )}
                    aria-hidden="true"
                >
                    <div className="h-4 w-2/3 rounded bg-surface-muted" />
                    <div className="mt-3 h-3 w-full rounded bg-surface-muted" />
                    <div className="mt-2 h-3 w-1/2 rounded bg-surface-muted" />
                </div>
            ))}
        </div>
    );
}

export function ChatSessionList({
                                    sessions,
                                    selectedSessionId,
                                    isLoading,
                                    isError,
                                    onRetry,
                                    onNewChat,
                                    onSelectSession,
                                    variant = "sidebar",
                                }: ChatSessionListProps) {
    const compact = variant === "compact";

    return (
        <Card
            className={cn(
                "p-4",
                compact
                    ? "overflow-hidden"
                    : "sticky top-20 max-h-[calc(100vh-7rem)]",
            )}
        >
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h2 className="flex items-center gap-2 text-sm font-semibold text-text-primary">
                        <MessageSquare
                            className="size-4 text-text-muted"
                            aria-hidden="true"
                        />
                        Chat sessions
                    </h2>

                    <p className="mt-1 text-xs text-text-muted">
                        Continue previous questions
                    </p>
                </div>

                <Button
                    size="sm"
                    onClick={onNewChat}
                >
                    <Plus
                        className="size-4"
                        aria-hidden="true"
                    />
                    New
                </Button>
            </div>

            <div
                className={cn(
                    "mt-4",
                    compact
                        ? "flex gap-3 overflow-x-auto pb-1"
                        : "space-y-2 overflow-y-auto pr-1",
                )}
            >
                {isLoading ? (
                    <SessionSkeletonList
                        compact={compact}
                    />
                ) : null}

                {isError ? (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                        <p className="text-sm font-medium text-red-900">
                            Failed to load sessions
                        </p>

                        <p className="mt-1 text-xs leading-5 text-red-800">
                            Your current route is preserved.
                            Retry loading the session list.
                        </p>

                        <Button
                            className="mt-3"
                            size="sm"
                            variant="secondary"
                            onClick={onRetry}
                        >
                            <RefreshCcw
                                className="size-4"
                                aria-hidden="true"
                            />
                            Retry
                        </Button>
                    </div>
                ) : null}

                {!isLoading &&
                !isError &&
                sessions.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-line bg-surface-muted p-4">
                        <p className="text-sm font-medium text-text-primary">
                            No chat sessions yet
                        </p>

                        <p className="mt-1 text-xs leading-5 text-text-secondary">
                            Start a new question after the
                            composer is added in M61.4.
                        </p>
                    </div>
                ) : null}

                {!isLoading &&
                !isError
                    ? sessions.map((session) => {
                        const selected =
                            session.id ===
                            selectedSessionId;

                        return (
                            <button
                                key={session.id}
                                type="button"
                                aria-current={
                                    selected
                                        ? "page"
                                        : undefined
                                }
                                onClick={() => {
                                    onSelectSession(
                                        session.id,
                                    );
                                }}
                                className={cn(
                                    [
                                        "w-full rounded-xl border p-3 text-left",
                                        "transition-colors",
                                        "focus-visible:outline-2",
                                        "focus-visible:outline-brand-600",
                                    ],
                                    compact
                                        ? "min-w-72"
                                        : "",
                                    selected
                                        ? "border-brand-300 bg-brand-50"
                                        : "border-line bg-surface hover:bg-surface-muted",
                                )}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <p
                                        className={cn(
                                            "min-w-0 truncate text-sm font-medium",
                                            selected
                                                ? "text-brand-900"
                                                : "text-text-primary",
                                        )}
                                    >
                                        {getSessionTitle(
                                            session,
                                        )}
                                    </p>

                                    <Badge
                                        variant={
                                            session.scopeType ===
                                            "DOCUMENT"
                                                ? "info"
                                                : "neutral"
                                        }
                                    >
                                        {
                                            session.scopeType
                                        }
                                    </Badge>
                                </div>

                                <p className="mt-2 line-clamp-2 text-xs leading-5 text-text-secondary">
                                    {getSessionPreview(
                                        session,
                                    )}
                                </p>

                                <div className="mt-3 flex items-center justify-between gap-3 text-[11px] text-text-muted">
                                      <span>
                                          {formatSessionTime(
                                              session.updatedAt,
                                          )}
                                      </span>

                                    {typeof session.messageCount ===
                                    "number" ? (
                                        <span>
                                              {
                                                  session.messageCount
                                              }{" "}
                                            messages
                                          </span>
                                    ) : null}
                                </div>
                            </button>
                        );
                    })
                    : null}
            </div>
        </Card>
    );
}