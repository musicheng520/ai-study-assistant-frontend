import {
    useEffect,
    useRef,
} from "react";
import {
    AlertTriangle,
    Bot,
    FileText,
    MessageSquare,
    RefreshCcw,
    UserRound,
} from "lucide-react";

import {
    Button,
} from "@/components/ui";
import { cn } from "@/lib/utils/cn";

import type {
    ChatCitation,
    ChatMessage,
    ChatSessionDetail,
} from "../model";
import { ChatMessageActions } from "./ChatMessageActions";

type ChatMessageListProps = {
    courseId: number;
    session: ChatSessionDetail | null;
    selectedSessionId: number;
    isLoading: boolean;
    isError: boolean;
    errorMessage?: string;
    onRetry: () => void;
    onOpenCitation: (
        citation: ChatCitation,
    ) => void;
};

function formatMessageTime(value: string) {
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

function MessageListSkeleton() {
    return (
        <div className="space-y-5 px-5 py-5 sm:px-6">
            {Array.from({
                length: 4,
            }).map((_, index) => (
                <div
                    key={`message-skeleton-${index}`}
                    className={cn(
                        "flex",
                        index % 2 === 0
                            ? "justify-end"
                            : "justify-start",
                    )}
                    aria-hidden="true"
                >
                    <div
                        className={cn(
                            "w-full max-w-[82%] rounded-2xl border border-line p-4",
                            index % 2 === 0
                                ? "bg-brand-50"
                                : "bg-surface",
                        )}
                    >
                        <div className="h-4 w-1/3 rounded bg-surface-muted" />
                        <div className="mt-4 h-3 w-full rounded bg-surface-muted" />
                        <div className="mt-2 h-3 w-5/6 rounded bg-surface-muted" />
                        <div className="mt-2 h-3 w-2/3 rounded bg-surface-muted" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function MessageEmptyState() {
    return (
        <div className="flex min-h-[360px] items-center justify-center px-5 py-10 text-center sm:px-6">
            <div className="max-w-md">
                <div className="mx-auto grid size-12 place-items-center rounded-full bg-surface-muted">
                    <MessageSquare
                        className="size-5 text-text-muted"
                        aria-hidden="true"
                    />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-text-primary">
                    No messages in this session
                </h2>

                <p className="mt-2 text-sm leading-6 text-text-secondary">
                    This chat session exists, but it does not
                    have messages yet.
                </p>
            </div>
        </div>
    );
}

function NoAnswerPanel() {
    return (
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
            <div className="flex items-start gap-3">
                <AlertTriangle
                    className="mt-0.5 size-5 shrink-0 text-amber-700"
                    aria-hidden="true"
                />

                <div>
                    <p className="text-sm font-semibold text-amber-900">
                        The AI could not find enough evidence
                    </p>

                    <p className="mt-1 text-sm leading-6 text-amber-800">
                        This is not a system failure. It means
                        the available course documents did not
                        provide strong enough support for a
                        grounded answer. Try asking a narrower
                        question, choosing a specific document,
                        or uploading more relevant material.
                    </p>
                </div>
            </div>
        </div>
    );
}

function CitationList({
                          message,
                          onOpenCitation,
                      }: {
    message: ChatMessage;
    onOpenCitation: (
        citation: ChatCitation,
    ) => void;
}) {
    if (
        message.role !== "ASSISTANT" ||
        message.citations.length === 0
    ) {
        return null;
    }

    return (
        <div className="mt-4 flex flex-wrap gap-2">
            {message.citations.map(
                (citation, index) => {
                    const citationNumber =
                        citation.citationIndex ??
                        index + 1;

                    const key = [
                        message.id,
                        citation.id ?? "citation",
                        citation.chunkId,
                        citationNumber,
                    ].join("-");

                    return (
                        <button
                            key={key}
                            type="button"
                            className={[
                                "inline-flex max-w-full items-center gap-2",
                                "rounded-full border border-brand-200",
                                "bg-brand-50 px-3 py-1.5",
                                "text-xs font-medium text-brand-800",
                                "transition-colors",
                                "hover:bg-brand-100",
                                "focus-visible:outline-2",
                                "focus-visible:outline-brand-600",
                            ].join(" ")}
                            title={
                                citation.snippet
                            }
                            aria-label={`Open citation ${citationNumber} from ${citation.fileName}`}
                            onClick={() => {
                                onOpenCitation(
                                    citation,
                                );
                            }}
                        >
                            <FileText
                                className="size-3.5 shrink-0"
                                aria-hidden="true"
                            />

                            <span className="shrink-0">
                                [{citationNumber}]
                            </span>

                            <span className="max-w-[14rem] truncate">
                                {citation.fileName}
                            </span>

                            {citation.pageNumber ? (
                                <span className="shrink-0 text-brand-600">
                                    p.{citation.pageNumber}
                                </span>
                            ) : null}
                        </button>
                    );
                },
            )}
        </div>
    );
}

function ChatMessageBubble({
                               courseId,
                               message,
                               onOpenCitation,
                           }: {
    courseId: number;
    message: ChatMessage;
    onOpenCitation: (
        citation: ChatCitation,
    ) => void;
}) {
    const isUser =
        message.role === "USER";

    return (
        <article
            className={cn(
                "flex gap-3",
                isUser
                    ? "justify-end"
                    : "justify-start",
            )}
        >
            {!isUser ? (
                <div className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-ai-50 text-ai-700">
                    <Bot
                        className="size-4"
                        aria-hidden="true"
                    />
                </div>
            ) : null}

            <div
                className={cn(
                    "max-w-[82%]",
                    isUser
                        ? "items-end"
                        : "items-start",
                )}
            >
                <div
                    className={cn(
                        "rounded-2xl border px-4 py-3",
                        isUser
                            ? "border-brand-200 bg-brand-700 text-white"
                            : "border-line bg-surface text-text-primary",
                    )}
                >
                    <p
                        className={cn(
                            "whitespace-pre-wrap text-sm leading-6",
                            isUser
                                ? "text-white"
                                : "text-text-primary",
                        )}
                    >
                        {message.content}
                    </p>
                </div>

                <div
                    className={cn(
                        "mt-1 flex items-center gap-2 text-[11px] text-text-muted",
                        isUser
                            ? "justify-end"
                            : "justify-start",
                    )}
                >
                    <span>
                        {isUser
                            ? "You"
                            : "AI Assistant"}
                    </span>

                    <span aria-hidden="true">
                        ·
                    </span>

                    <time dateTime={message.createdAt}>
                        {formatMessageTime(
                            message.createdAt,
                        )}
                    </time>

                    {!isUser && message.noAnswer ? (
                        <>
                            <span aria-hidden="true">
                                ·
                            </span>

                            <span className="font-medium text-amber-700">
                                No answer
                            </span>
                        </>
                    ) : null}
                </div>

                {!isUser && message.noAnswer ? (
                    <NoAnswerPanel />
                ) : null}

                <CitationList
                    message={message}
                    onOpenCitation={
                        onOpenCitation
                    }
                />

                {!isUser ? (
                    <ChatMessageActions
                        courseId={courseId}
                        message={message}
                    />
                ) : null}
            </div>

            {isUser ? (
                <div className="mt-1 grid size-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-800">
                    <UserRound
                        className="size-4"
                        aria-hidden="true"
                    />
                </div>
            ) : null}
        </article>
    );
}

export function ChatMessageList({
                                    courseId,
                                    session,
                                    selectedSessionId,
                                    isLoading,
                                    isError,
                                    errorMessage,
                                    onRetry,
                                    onOpenCitation,
                                }: ChatMessageListProps) {
    const bottomRef =
        useRef<HTMLDivElement | null>(null);

    const messageCount =
        session?.messages.length ?? 0;

    useEffect(() => {
        if (
            isLoading ||
            isError ||
            messageCount === 0
        ) {
            return;
        }

        bottomRef.current?.scrollIntoView({
            block: "end",
        });
    }, [
        isError,
        isLoading,
        messageCount,
        selectedSessionId,
    ]);

    if (isLoading) {
        return (
            <div className="flex min-h-[520px] flex-col">
                <header className="border-b border-line px-5 py-4 sm:px-6">
                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                        Chat session
                    </p>

                    <h1 className="mt-1 text-xl font-semibold text-text-primary">
                        Loading session #{selectedSessionId}
                    </h1>
                </header>

                <MessageListSkeleton />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex min-h-[520px] items-center justify-center px-5 py-10 text-center sm:px-6">
                <div className="max-w-md">
                    <div className="mx-auto grid size-12 place-items-center rounded-full bg-red-50">
                        <RefreshCcw
                            className="size-5 text-red-700"
                            aria-hidden="true"
                        />
                    </div>

                    <h1 className="mt-4 text-lg font-semibold text-text-primary">
                        Failed to load chat session
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                        {errorMessage ??
                            "The selected session could not be loaded."}
                    </p>

                    <Button
                        className="mt-5"
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
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex min-h-[520px] items-center justify-center px-5 py-10 text-center sm:px-6">
                <div className="max-w-md">
                    <h1 className="text-lg font-semibold text-text-primary">
                        Session not found
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                        This session may have been deleted or you
                        may not have access to it.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-[520px] flex-col">
            <header className="border-b border-line px-5 py-4 sm:px-6">
                <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                    {session.scopeType === "DOCUMENT"
                        ? "Document chat"
                        : "Course chat"}
                </p>

                <h1 className="mt-1 truncate text-xl font-semibold text-text-primary">
                    {session.title || "New chat"}
                </h1>

                <p className="mt-1 text-sm leading-6 text-text-secondary">
                    {session.messages.length} messages · Last
                    updated{" "}
                    {formatMessageTime(
                        session.updatedAt,
                    )}
                </p>
            </header>

            {session.messages.length === 0 ? (
                <MessageEmptyState />
            ) : (
                <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
                    {session.messages.map(
                        (message) => (
                            <ChatMessageBubble
                                key={message.id}
                                courseId={courseId}
                                message={message}
                                onOpenCitation={
                                    onOpenCitation
                                }
                            />
                        ),
                    )}

                    <div ref={bottomRef} />
                </div>
            )}
        </div>
    );
}