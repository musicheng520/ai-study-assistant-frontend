import {
    useMemo,
    useState,
} from "react";
import {
    useNavigate,
    useParams,
} from "react-router";

import { Card } from "@/components/ui";
import { toApiError } from "@/lib/errors/ApiError";

import {
    useAskCourseQuestionMutation,
    useChatSessionQuery,
    useCourseChatSessionsQuery,
} from "../api";
import type { ChatCitation } from "../model";
import { ChatComposer } from "./ChatComposer";
import { ChatMessageList } from "./ChatMessageList";
import { ChatSessionList } from "./ChatSessionList";
import { CitationSourceViewer } from "./CitationSourceViewer";

function parseRouteNumber(
    value: string | undefined,
): number | null {
    if (!value) {
        return null;
    }

    const parsed = Number(value);

    if (
        !Number.isInteger(parsed) ||
        parsed <= 0
    ) {
        return null;
    }

    return parsed;
}

function getErrorMessage(error: unknown) {
    if (
        error instanceof Error &&
        error.message
    ) {
        return error.message;
    }

    return "Something went wrong while loading this chat session.";
}

export function ChatWorkspace() {
    const params = useParams();
    const navigate = useNavigate();

    const [
        askError,
        setAskError,
    ] = useState<string | null>(null);

    const [
        selectedCitation,
        setSelectedCitation,
    ] = useState<ChatCitation | null>(null);

    const [
        sourceViewerOpen,
        setSourceViewerOpen,
    ] = useState(false);

    const courseId = useMemo(
        () => parseRouteNumber(params.courseId),
        [params.courseId],
    );

    const hasSessionRouteParam =
        params.sessionId !== undefined;

    const selectedSessionId = useMemo(
        () => parseRouteNumber(params.sessionId),
        [params.sessionId],
    );

    const sessionsQuery =
        useCourseChatSessionsQuery(courseId, {
            limit: 20,
            offset: 0,
        });

    const sessionDetailQuery =
        useChatSessionQuery(
            courseId === null
                ? null
                : selectedSessionId,
        );

    const askMutation =
        useAskCourseQuestionMutation();

    if (courseId === null) {
        return (
            <Card className="p-6">
                <h1 className="text-lg font-semibold text-text-primary">
                    Invalid course route
                </h1>

                <p className="mt-2 text-sm text-text-secondary">
                    The course ID in this URL is not valid.
                </p>
            </Card>
        );
    }

    const activeCourseId = courseId;

    const invalidSessionRoute =
        hasSessionRouteParam &&
        selectedSessionId === null;

    function handleNewChat() {
        setAskError(null);

        navigate(
            `/courses/${activeCourseId}/chat`,
        );
    }

    function handleSelectSession(
        sessionId: number,
    ) {
        setAskError(null);

        navigate(
            `/courses/${activeCourseId}/chat/${sessionId}`,
        );
    }

    async function handleAskQuestion(
        question: string,
    ) {
        setAskError(null);

        try {
            const response =
                await askMutation.mutateAsync({
                    courseId: activeCourseId,
                    request: {
                        question,
                        sessionId:
                        selectedSessionId,
                        topK: 5,
                    },
                });

            if (
                response.sessionId !==
                selectedSessionId
            ) {
                navigate(
                    `/courses/${activeCourseId}/chat/${response.sessionId}`,
                );
            } else {
                await sessionDetailQuery.refetch();
            }

            await sessionsQuery.refetch();
        } catch (error) {
            const apiError =
                toApiError(error);

            setAskError(apiError.message);

            throw apiError;
        }
    }

    function handleOpenCitation(
        citation: ChatCitation,
    ) {
        setSelectedCitation(citation);
        setSourceViewerOpen(true);
    }

    function handleSourceViewerOpenChange(
        nextOpen: boolean,
    ) {
        setSourceViewerOpen(nextOpen);

        if (!nextOpen) {
            setSelectedCitation(null);
        }
    }

    const composerDisabled =
        invalidSessionRoute ||
        sessionDetailQuery.isError;

    return (
        <>
            <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)]">
                <aside className="hidden lg:block">
                    <ChatSessionList
                        sessions={
                            sessionsQuery.data?.sessions ??
                            []
                        }
                        selectedSessionId={
                            selectedSessionId
                        }
                        isLoading={
                            sessionsQuery.isPending
                        }
                        isError={
                            sessionsQuery.isError
                        }
                        onRetry={() => {
                            void sessionsQuery.refetch();
                        }}
                        onNewChat={handleNewChat}
                        onSelectSession={
                            handleSelectSession
                        }
                        variant="sidebar"
                    />
                </aside>

                <div className="lg:hidden">
                    <ChatSessionList
                        sessions={
                            sessionsQuery.data?.sessions ??
                            []
                        }
                        selectedSessionId={
                            selectedSessionId
                        }
                        isLoading={
                            sessionsQuery.isPending
                        }
                        isError={
                            sessionsQuery.isError
                        }
                        onRetry={() => {
                            void sessionsQuery.refetch();
                        }}
                        onNewChat={handleNewChat}
                        onSelectSession={
                            handleSelectSession
                        }
                        variant="compact"
                    />
                </div>

                <Card className="flex min-h-[620px] flex-col overflow-hidden">
                    <div className="min-h-0 flex-1">
                        {invalidSessionRoute ? (
                            <div className="flex min-h-[520px] items-center justify-center px-5 py-10 text-center sm:px-6">
                                <div className="max-w-md">
                                    <h1 className="text-lg font-semibold text-text-primary">
                                        Invalid chat session
                                    </h1>

                                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                                        The session ID in this URL
                                        is not valid. Choose a
                                        previous chat or start a
                                        new one.
                                    </p>
                                </div>
                            </div>
                        ) : selectedSessionId ? (
                            <ChatMessageList
                                session={
                                    sessionDetailQuery.data ??
                                    null
                                }
                                selectedSessionId={
                                    selectedSessionId
                                }
                                isLoading={
                                    sessionDetailQuery.isPending
                                }
                                isError={
                                    sessionDetailQuery.isError
                                }
                                errorMessage={getErrorMessage(
                                    sessionDetailQuery.error,
                                )}
                                onRetry={() => {
                                    void sessionDetailQuery.refetch();
                                }}
                                onOpenCitation={
                                    handleOpenCitation
                                }
                            />
                        ) : (
                            <>
                                <header className="border-b border-line px-5 py-4 sm:px-6">
                                    <p className="text-xs font-medium uppercase tracking-wide text-text-muted">
                                        AI Chat
                                    </p>

                                    <h1 className="mt-1 text-xl font-semibold text-text-primary">
                                        Ask questions from your
                                        course materials
                                    </h1>

                                    <p className="mt-1 text-sm leading-6 text-text-secondary">
                                        Answers will be grounded in
                                        READY documents and
                                        connected to citations.
                                    </p>
                                </header>

                                <section className="flex min-h-[420px] items-center justify-center px-5 py-10 sm:px-6">
                                    <div className="max-w-md text-center">
                                        <div className="mx-auto grid size-12 place-items-center rounded-full bg-ai-50 text-sm font-semibold text-ai-700">
                                            AI
                                        </div>

                                        <h2 className="mt-4 text-lg font-semibold text-text-primary">
                                            Start a new course chat
                                        </h2>

                                        <p className="mt-2 text-sm leading-6 text-text-secondary">
                                            Ask a question below to
                                            create a new chat
                                            session for this course.
                                        </p>
                                    </div>
                                </section>
                            </>
                        )}
                    </div>

                    {askError ? (
                        <div className="border-t border-red-200 bg-red-50 px-5 py-3 text-sm text-red-800 sm:px-6">
                            {askError}
                        </div>
                    ) : null}

                    <ChatComposer
                        disabled={composerDisabled}
                        isSubmitting={
                            askMutation.isPending
                        }
                        submitLabel={
                            selectedSessionId
                                ? "Send"
                                : "Start chat"
                        }
                        onSubmit={
                            handleAskQuestion
                        }
                    />
                </Card>
            </div>

            <CitationSourceViewer
                open={sourceViewerOpen}
                courseId={activeCourseId}
                citation={selectedCitation}
                onOpenChange={
                    handleSourceViewerOpenChange
                }
            />
        </>
    );
}